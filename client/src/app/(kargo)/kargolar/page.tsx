import { getCargosAction } from "@/actions/cargo";
import AsyncWrapper from "@/components/async-wrapper";
import CargoList from "./(components)/cargo-list";
import CargoListSkeleton from "./(components)/cargo-list-skeleton";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg space-y-2">
        <div className="text-center">Kargolar</div>

        <AsyncWrapper
          loader={() => getCargosAction()}
          fallback={<CargoListSkeleton />}
          render={(cargos) => <CargoList cargos={cargos} />}
        />
      </div>
    </div>
  );
}
