# Component Specifications

## Feature 1 - Date Range Filter

### Component: DateRangeFilter

#### Purpose

The DateRangeFilter component lets the user filter the dashboard data by a start date and an end date.

#### Props

- startDate: string | undefined - selected start date
- endDate: string | undefined - selected end date
- minDate: string - earliest available date
- maxDate: string - latest available date
- onStartDateChange: (date: string) => void - updates the start date
- onEndDateChange: (date: string) => void - updates the end date

#### Layout

The component is displayed at the top of the home dashboard.

It contains:

- one start date input
- one end date input
- the available date range below or beside the inputs

The available range is displayed as:

Available dates: minDate to maxDate

#### Behavior

- Both date inputs are optional.
- When both inputs are empty, the dashboard shows all available data.
- When only startDate is entered, the dashboard shows data from that date forward.
- When only endDate is entered, the dashboard shows data up to that date.
- When both dates are entered, the dashboard shows data between the two dates.
- Dates must use the YYYY-MM-DD format.
- The dashboard data updates when a date value changes.

---

## Feature 2 - Anomaly Alerts Table

### Component: ThresholdInput

#### Purpose

The ThresholdInput component lets the user choose the minimum increase ratio used to detect unusual spending.

#### Props

- threshold: number - current threshold value
- onThresholdChange: (value: number) => void - updates the threshold
- min: number - minimum allowed value, 0.01
- max: number - maximum allowed value, 1.0

#### Behavior

- The default threshold is 0.3.
- The accepted range is from 0.01 to 1.0.
- When the value is below 0.01 or above 1.0, an error message is shown.
- An invalid value is not used to update the alerts table.

### Component: AnomalyAlertsTable

#### Purpose

The AnomalyAlertsTable displays periods where spending increased above the selected threshold.

#### Props

- alerts: AlertEntry[] - list of anomaly alerts
- threshold: number - current threshold
- startDate: string | undefined - active start date filter
- endDate: string | undefined - active end date filter
- isLoading: boolean - shows whether alert data is loading

#### Columns

| Column | Data type | Description |
|---|---|---|
| Period | string | Time period of the alert |
| Recorded outcome | number | Total spending for the period |
| Cumulative average | number | Average of all previous periods |
| Percentage increase | number | Increase above the cumulative average |

#### Conditional Rendering

- When isLoading is true, show Loading alerts....
- When alerts is empty, show No anomaly alerts found for the selected threshold and date range.
- When alerts are available, show one table row for each alert.
- The table respects the active start and end date filters from Feature 1.

---

## Feature 3 - B2B vs B2C Comparison View

### Component: BusinessComparisonPage

#### Purpose

The BusinessComparisonPage displays and compares income data for B2B and B2C.

#### Props

- startDate: string | undefined - selected start date
- endDate: string | undefined - selected end date
- b2bCategories: CategoryEntry[] - top B2B income categories
- b2cCategories: CategoryEntry[] - top B2C income categories
- b2bTotal: number - total B2B income
- b2cTotal: number - total B2C income
- isLoading: boolean - shows whether comparison data is loading

#### Layout

- A date range filter is displayed at the top of the page.
- The B2B and B2C panels are displayed side by side on larger screens.
- The panels are displayed one below the other on smaller screens.
- The comparison chart is displayed below both panels.

### Component: BusinessCategoryPanel

#### Purpose

The BusinessCategoryPanel displays the top five income categories for one business type.

#### Props

- title: string - panel title, either B2B or B2C
- categories: CategoryEntry[] - top five categories
- groupTotal: number - total income for the business type
- isLoading: boolean - loading state

#### Conditional Rendering

- When isLoading is true, show Loading categories....
- When the B2B category list is empty, the B2B panel shows No B2B income categories found for the selected date range.
- When the B2C category list is empty, the B2C panel shows No B2C income categories found for the selected date range.
- When categories are available, show the top five categories in a table.

### Component: TopCategoriesTable

#### Props

- categories: CategoryEntry[] - categories displayed in the table
- groupTotal: number - total income used to calculate percentages

#### Columns

| Column | Data type | Description |
|---|---|---|
| Category | string | Category name |
| Total income | number | Total income for the category |
| Percentage of group total | number | Category income divided by the business total |

### Component: BusinessIncomeComparisonChart

#### Purpose

The BusinessIncomeComparisonChart compares the total income of B2B and B2C.

#### Props

- b2bTotal: number - total income for B2B
- b2cTotal: number - total income for B2C

#### Chart Data

The chart displays two data points:

- B2B represents the total B2B income.
- B2C represents the total B2C income.

#### Conditional Rendering

- When both totals are available, display the comparison chart.
- When no comparison data is available, show No income comparison data found for the selected date range.