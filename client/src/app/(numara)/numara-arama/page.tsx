import { getLookupsAction } from "@/actions/lookup";
import CargoListSkeleton from "@/app/(kargo)/kargolar/(components)/cargo-list-skeleton";
import AsyncWrapper from "@/components/async-wrapper";
import LookupList from "./(components)/lookup-list";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg space-y-2">
        <div className="text-center">Numaralar</div>

        <AsyncWrapper
          loader={() => getLookupsAction()}
          fallback={<CargoListSkeleton />}
          render={(lookups) => <LookupList lookups={lookups} />}
        />
      </div>
    </div>
  );
}
