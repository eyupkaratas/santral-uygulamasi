import { getTicketsAction } from "@/actions/ticket";
import CargoListSkeleton from "@/app/(kargo)/kargolar/(components)/cargo-list-skeleton";
import AsyncWrapper from "@/components/async-wrapper";
import TicketList from "./(components)/ticket-list";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg space-y-2">
        <div className="text-center">Talepler</div>

        <AsyncWrapper
          loader={() => getTicketsAction()}
          fallback={<CargoListSkeleton />}
          render={(tickets) => <TicketList tickets={tickets} />}
        />
      </div>
    </div>
  );
}
