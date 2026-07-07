import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type BusinessCategoryShare,
  type BusinessType,
  type Category,
} from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";

interface BusinessIncomeTableProps {
  businessType: BusinessType;
  rows: BusinessCategoryShare[];
  totalIncome: number;
  availableCategories: Category[];
  loading?: boolean;
  error?: string | null;
}

export function BusinessIncomeTable({
  businessType,
  rows,
  totalIncome,
  availableCategories,
  loading,
  error,
}: BusinessIncomeTableProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">{businessType} Income</CardTitle>
        <CardDescription>
          Top categories and contribution over total income for {businessType}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
              <p className="text-xs text-muted-foreground">Total income</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-secondary/50 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3 font-medium">Total ingreso</th>
                    <th className="px-4 py-3 font-medium">% sobre el grupo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                        No hay categorias de ingreso para el rango seleccionado.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={`${businessType}-${row.category}`}>
                        <td className="px-4 py-3 text-foreground">{row.category}</td>
                        <td className="px-4 py-3 text-foreground">
                          {formatCurrency(row.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatPercent(row.sharePercent)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground">
              Categorias disponibles segun facetas: {availableCategories.join(", ") || "Sin categorias"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
