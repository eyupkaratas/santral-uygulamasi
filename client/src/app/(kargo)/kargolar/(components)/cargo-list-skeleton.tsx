import { Skeleton } from "@/components/ui/skeleton";

export default function CargoListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-full rounded-md" />
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-md" />
      ))}
    </div>
  );
}
