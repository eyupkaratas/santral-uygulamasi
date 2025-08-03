import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/types/appointment";

type AppointmentItemProps = {
  label: string;
  content: string;
};
type AppointmentCardProps = {
  appointment: Appointment;
};

function AppointmentItem({ label, content }: AppointmentItemProps) {
  return (
    <div className="flex flex-col items-center justify-center border-b">
      <div className="mb-2 w-full space-y-2 text-center">
        <p className="font-bold">{label}</p>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card>
      <CardHeader className="border-b-1">
        <CardTitle className="mb-4 text-center"> {`Randevu ID #${appointment.id}`}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AppointmentItem label="Konu:" content={appointment.konu.toString()} />
        <AppointmentItem label="Randevu Sahibi" content={appointment.kisiAdi} />
        <AppointmentItem
          label="Başlangıç Zamanı"
          content={`${new Date(appointment.baslangicZamani).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} - ${new Date(appointment.baslangicZamani).toLocaleDateString("tr-TR")}`}
        />

        <AppointmentItem
          label="Bitiş Zamanı"
          content={`${new Date(appointment.bitisZamani).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} - ${new Date(appointment.bitisZamani).toLocaleDateString("tr-TR")}`}
        />
      </CardContent>
    </Card>
  );
}
