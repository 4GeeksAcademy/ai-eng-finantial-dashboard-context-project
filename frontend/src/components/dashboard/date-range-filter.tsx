interface DateRangeFilterProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  availableRange: { minDate: string; maxDate: string } | null
  errorMessage: string | null
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  availableRange,
  errorMessage,
}: DateRangeFilterProps) {
  return (
    <section
      aria-label="Date range filter"
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          From
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={errorMessage ? 'date-range-error' : undefined}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          To
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={errorMessage ? 'date-range-error' : undefined}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
          />
        </label>
      </div>

      <div className="flex flex-col items-start gap-1 sm:items-end">
        {availableRange ? (
          <span className="text-xs text-muted-foreground">
            Available range: {availableRange.minDate} — {availableRange.maxDate}
          </span>
        ) : null}
        {errorMessage ? (
          <span id="date-range-error" role="alert" className="text-xs font-medium text-destructive">
            {errorMessage}
          </span>
        ) : null}
      </div>
    </section>
  )
}
