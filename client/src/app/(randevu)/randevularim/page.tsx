import AsyncWrapper from "@/components/async-wrapper";

import { getAppointmentsAction } from "@/actions/appointment";
import CargoListSkeleton from "@/app/(kargo)/kargolar/(components)/cargo-list-skeleton";
import AppointmentsList from "./(components)/appointment-list";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl space-y-2">
        <div className="text-center">Randevular</div>

        <AsyncWrapper
          loader={() => getAppointmentsAction()}
          fallback={<CargoListSkeleton />}
          render={(appointments) => <AppointmentsList appointments={appointments} />}
        />
      </div>
    </div>
  );
}
