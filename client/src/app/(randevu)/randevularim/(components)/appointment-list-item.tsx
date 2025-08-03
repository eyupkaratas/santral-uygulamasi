import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AppointmentCard from "./appointment-card";

type AppointmentListItemProps = {
  appointment: Appointment;
};

export default function AppointmentListItem({ appointment }: AppointmentListItemProps) {
  const simdikiZaman = new Date();
  const bitisZamani = new Date(appointment.bitisZamani);

  let cardColor = "";
  if (bitisZamani < simdikiZaman) {
    cardColor = "bg-red-500/50 hover:bg-red-500/40";
  } else {
    cardColor = "bg-green-500/50 hover:bg-green-500/40";
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={cn("rounded-md px-4 py-2", cardColor)}>
          <div>
            <div className="flex justify-between">
              <div>Randevu ID #{appointment.id}</div>
              <div>İlgili Personel: {appointment.personelAdi}</div>
            </div>
            <div className="flex justify-between">
              <div>
                Başlangıç Zamanı:{" "}
                {new Date(appointment.baslangicZamani).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {new Date(appointment.baslangicZamani).toLocaleDateString("tr-TR")}
              </div>

              <div>
                Bitiş Zamanı:{" "}
                {new Date(appointment.bitisZamani).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {new Date(appointment.bitisZamani).toLocaleDateString("tr-TR")}
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Talep</DialogTitle>
        </VisuallyHidden>

        <AppointmentCard appointment={appointment} />
      </DialogContent>
    </Dialog>
  );
}
