import { getPersonnelsAction } from "@/actions/personnel";
import { getUnitsAction } from "@/actions/unit";
import AsyncWrapper from "@/components/async-wrapper";
import UnitFilter from "./(components)/unit-filter";
import UnitFilterSkeleton from "./(components)/unit-filter-skeleton";
import UnitList from "./(components)/unit-list";
import UnitListSkeleton from "./(components)/unit-list-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const birimId = (await searchParams).birimId?.toString();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg space-y-2">
        <div className="text-center">Birimler ve Personeller</div>
        <AsyncWrapper
          loader={getUnitsAction}
          fallback={<UnitFilterSkeleton />}
          render={(units) => <UnitFilter units={units} />}
        />

        <AsyncWrapper
          key={birimId}
          loader={() => getPersonnelsAction(birimId)}
          fallback={<UnitListSkeleton />}
          render={(personnels) => <UnitList personnels={personnels} />}
        />
      </div>
    </div>
  );
}
