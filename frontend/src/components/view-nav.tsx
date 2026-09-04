import { cn } from "@/lib/utils";

export type DashboardView = "dashboard" | "comparison";

interface ViewNavProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const VIEWS: { id: DashboardView; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "comparison", label: "B2B vs B2C" },
];

export function ViewNav({ currentView, onViewChange }: ViewNavProps) {
  return (
    <nav className="flex gap-2" aria-label="Dashboard views">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onViewChange(view.id)}
          aria-current={currentView === view.id ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            currentView === view.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          {view.label}
        </button>
      ))}
    </nav>
  );
}
