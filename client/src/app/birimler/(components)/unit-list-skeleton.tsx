import { Skeleton } from "@/components/ui/skeleton";

export default function UnitListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-full rounded-md" />
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}
