#!/usr/bin/env python3
"""Accessibility verification for the Financial Metrics Dashboard.

Connects to the already-running Vite app at http://localhost:5173.
Does not start or stop servers.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"
SCREENSHOT_PATH = Path(__file__).resolve().parent / "a11y-verification.png"


def result(name: str, passed: bool, detail: str) -> dict:
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name}: {detail}")
    return {"name": name, "passed": passed, "detail": detail}


def main() -> int:
    checks: list[dict] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 900})

        # ------------------------------------------------------------------
        # 1) Navigate and wait for networkidle
        # ------------------------------------------------------------------
        try:
            page.goto(BASE_URL, wait_until="networkidle", timeout=60_000)
            page.wait_for_load_state("networkidle")
            # Charts finish after the metrics fetch + lazy chunk load
            page.wait_for_selector('[role="img"][aria-label]', timeout=30_000)
            checks.append(
                result(
                    "Navigate + networkidle",
                    True,
                    f"Loaded {BASE_URL} and chart content appeared",
                )
            )
        except Exception as exc:  # noqa: BLE001
            checks.append(result("Navigate + networkidle", False, str(exc)))
            browser.close()
            return _summarize(checks)

        # ------------------------------------------------------------------
        # 3) Chart containers: role="img" + non-empty aria-label
        #    (done before error-route so we inspect the happy-path DOM)
        # ------------------------------------------------------------------
        try:
            charts = page.locator('[role="img"]')
            chart_count = charts.count()
            labels: list[str] = []
            tabindexes: list[str | None] = []
            all_ok = True
            for i in range(chart_count):
                chart = charts.nth(i)
                label = (chart.get_attribute("aria-label") or "").strip()
                tabindex = chart.get_attribute("tabindex")
                labels.append(label)
                tabindexes.append(tabindex)
                if not label or tabindex != "0":
                    all_ok = False
            passed = chart_count >= 2 and all_ok
            detail = (
                f"found {chart_count} role=img; labels={labels!r}; tabindex={tabindexes!r}"
                if passed
                else (
                    f"expected ≥2 labeled focusable charts; found {chart_count}, "
                    f"labels={labels!r}, tabindex={tabindexes!r}"
                )
            )
            checks.append(result("Chart role=img + aria-label + tabindex=0", passed, detail))
        except Exception as exc:  # noqa: BLE001
            checks.append(result("Chart role=img + aria-label + tabindex=0", False, str(exc)))

        # ------------------------------------------------------------------
        # 4) Loading skeletons: role="status" + aria-busy during load window
        # ------------------------------------------------------------------
        try:
            # Hold the API so the loading UI stays mounted long enough to inspect.
            def delay_metrics(route):
                page.wait_for_timeout(2500)
                route.continue_()

            page.route("**/api/metrics", delay_metrics)
            page.reload(wait_until="domcontentloaded")
            page.wait_for_selector('[role="status"][aria-busy="true"]', timeout=10_000)
            status_nodes = page.locator('[role="status"][aria-busy="true"]')
            status_count = status_nodes.count()
            html_snapshot = page.content()
            has_sr_loading = bool(
                re.search(r"Loading[^<]{0,80}", html_snapshot, flags=re.I)
            )
            # Wait for load to finish so later checks see the full dashboard
            page.wait_for_load_state("networkidle")
            page.wait_for_selector('[role="img"][aria-label]', timeout=30_000)
            page.unroute("**/api/metrics")

            passed = status_count >= 1 and has_sr_loading
            checks.append(
                result(
                    "Loading role=status + aria-busy",
                    passed,
                    f"status/busy nodes during load={status_count}; "
                    f"sr-only loading text present={has_sr_loading}",
                )
            )
        except Exception as exc:  # noqa: BLE001
            try:
                page.unroute("**/api/metrics")
            except Exception:  # noqa: BLE001
                pass
            checks.append(result("Loading role=status + aria-busy", False, str(exc)))

        # ------------------------------------------------------------------
        # 2) Error banner role="alert" (force API failure so it renders)
        # ------------------------------------------------------------------
        try:
            page.route(
                "**/api/metrics",
                lambda route: route.fulfill(
                    status=500,
                    content_type="application/json",
                    body='{"detail":"forced failure for a11y check"}',
                ),
            )
            page.reload(wait_until="networkidle")
            alert = page.locator('[role="alert"]')
            alert.wait_for(state="visible", timeout=15_000)
            aria_live = alert.get_attribute("aria-live") or ""
            alert_text = alert.inner_text().strip()
            passed = alert.count() >= 1 and bool(alert_text)
            checks.append(
                result(
                    "Error banner role=alert",
                    passed,
                    f'role=alert visible; aria-live={aria_live!r}; text={alert_text!r}',
                )
            )
            page.unroute("**/api/metrics")
            # Restore healthy dashboard for focus / screenshot checks
            page.reload(wait_until="networkidle")
            page.wait_for_selector('[role="img"][aria-label]', timeout=30_000)
        except Exception as exc:  # noqa: BLE001
            try:
                page.unroute("**/api/metrics")
            except Exception:  # noqa: BLE001
                pass
            checks.append(result("Error banner role=alert", False, str(exc)))

        # ------------------------------------------------------------------
        # 5) Tab through page; log focus targets + :focus-visible outline
        # ------------------------------------------------------------------
        focus_log: list[str] = []
        focus_visible_hits = 0
        try:
            # Charts expose tabindex=0 in component code — do not inject at runtime.
            # Start from <body> so Tab walks the document from the top.
            page.locator("body").click(position={"x": 5, "y": 5})
            for step in range(12):
                page.keyboard.press("Tab")
                info = page.evaluate(
                    """() => {
                      const el = document.activeElement;
                      if (!el || el === document.body) {
                        return { tag: 'BODY', text: '', outline: '', outlineWidth: '0px',
                                 role: null, ariaLabel: null, focusVisible: false };
                      }
                      const cs = getComputedStyle(el);
                      const matchesFocusVisible = el.matches(':focus-visible');
                      return {
                        tag: el.tagName,
                        role: el.getAttribute('role'),
                        ariaLabel: el.getAttribute('aria-label'),
                        text: (el.innerText || el.textContent || '').trim().slice(0, 60),
                        outline: cs.outline,
                        outlineWidth: cs.outlineWidth,
                        outlineColor: cs.outlineColor,
                        outlineOffset: cs.outlineOffset,
                        focusVisible: matchesFocusVisible,
                      };
                    }"""
                )
                label = info.get("ariaLabel") or info.get("text") or ""
                line = (
                    f"#{step + 1} <{info['tag']}> role={info.get('role')!r} "
                    f"label/text={label!r} :focus-visible={info.get('focusVisible')} "
                    f"outline={info.get('outline')!r} offset={info.get('outlineOffset')!r}"
                )
                focus_log.append(line)
                print(f"  focus {line}")
                width = info.get("outlineWidth") or "0px"
                if info.get("focusVisible") and width not in ("0px", "0", ""):
                    focus_visible_hits += 1

            # Python !r formats attribute values with single quotes: role='img'
            chart_in_order = any("role='img'" in line for line in focus_log)
            passed = focus_visible_hits >= 1 and chart_in_order
            checks.append(
                result(
                    "Keyboard Tab + :focus-visible",
                    passed,
                    f"focus-visible outline hits={focus_visible_hits}/12; "
                    f"chart in tab order={chart_in_order}",
                )
            )
        except Exception as exc:  # noqa: BLE001
            checks.append(result("Keyboard Tab + :focus-visible", False, str(exc)))

        # ------------------------------------------------------------------
        # 6) Full-page screenshot with a chart focused
        # ------------------------------------------------------------------
        try:
            chart = page.locator('[role="img"][tabindex="0"]').first
            chart.focus()
            # Prefer keyboard focus so :focus-visible engages
            page.keyboard.press("Tab")
            page.keyboard.press("Shift+Tab")
            focused_is_chart = page.evaluate(
                """() => {
                  const el = document.activeElement;
                  return !!(el && el.getAttribute('role') === 'img');
                }"""
            )
            if not focused_is_chart:
                chart.focus()
                focused_is_chart = page.evaluate(
                    """() => {
                      const el = document.activeElement;
                      return !!(el && el.getAttribute('role') === 'img');
                    }"""
                )

            page.screenshot(path=str(SCREENSHOT_PATH), full_page=True)
            checks.append(
                result(
                    "Full-page screenshot",
                    SCREENSHOT_PATH.is_file() and focused_is_chart,
                    f"saved {SCREENSHOT_PATH} (chart focused={focused_is_chart})",
                )
            )
        except Exception as exc:  # noqa: BLE001
            checks.append(result("Full-page screenshot", False, str(exc)))

        browser.close()

    return _summarize(checks)


def _summarize(checks: list[dict]) -> int:
    print("\n======== SUMMARY ========")
    passed = sum(1 for c in checks if c["passed"])
    total = len(checks)
    for c in checks:
        print(f"  {'PASS' if c['passed'] else 'FAIL'} — {c['name']}")
    print(f"=========================\n{passed}/{total} checks passed")
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
