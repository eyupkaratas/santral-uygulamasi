import { getPersonnelsAction } from "@/actions/personnel";
import { getUnitsAction } from "@/actions/unit";
import AsyncWrapper from "@/components/async-wrapper";
import UnitFilter from "../birimler/(components)/unit-filter";
import CreatePersonnelForm from "./(components)/create-personnel-form";
import PersonnelList from "./(components)/personnel-list";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const birimId = (await searchParams).birimId?.toString();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg space-y-2">
        <div className="text-center">Personeller</div>
        <CreatePersonnelForm />

        <AsyncWrapper loader={getUnitsAction} fallback={null} render={(units) => <UnitFilter units={units} />} />

        <AsyncWrapper
          key={birimId}
          loader={() => getPersonnelsAction(birimId)}
          fallback={null}
          render={(personnels) => <PersonnelList personnels={personnels} />}
        />
      </div>
    </div>
  );
}
