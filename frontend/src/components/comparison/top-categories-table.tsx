import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type TopCategoryItem } from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";
import { computeCategoryShares } from "@/lib/business-comparison-utils";

interface TopCategoriesTableProps {
  title: string;
  items: TopCategoryItem[];
  loading?: boolean;
  error?: string | null;
}

export function TopCategoriesTable({
  title,
  items,
  loading,
  error,
}: TopCategoriesTableProps) {
  const shares = computeCategoryShares(items);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription>Top income categories</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : error ? (
          <div className="flex h-40 items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : shares.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
            No hay ingresos registrados para {title} en este rango.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Income</th>
                  <th className="py-2 font-medium">% of group</th>
                </tr>
              </thead>
              <tbody>
                {shares.map((share) => (
                  <tr key={share.category} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-4 capitalize text-foreground">{share.category}</td>
                    <td className="py-2 pr-4 text-foreground">
                      {formatCurrency(share.total_amount)}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {formatPercent(share.percentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
