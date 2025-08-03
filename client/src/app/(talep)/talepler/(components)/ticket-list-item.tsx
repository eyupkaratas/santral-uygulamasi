import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Ticket } from "@/types/ticket";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import TicketCard from "./ticket-card";

type TicketListItemProps = {
  ticket: Ticket;
};

export default function TicketListItem({ ticket }: TicketListItemProps) {
  let cardColor = "";
  if (ticket.oncelik === "Dusuk") {
    cardColor = "bg-green-500/50 hover:bg-green-500/40";
  } else if (ticket.oncelik === "Normal") {
    cardColor = "bg-yellow-500/50 hover:bg-yellow-500/40";
  } else if (ticket.oncelik === "Yuksek") {
    cardColor = "bg-red-500/50 hover:bg-red-500/40";
  }
  let ticketStatus = "";
  if (ticket.durum === "Acik") {
    ticketStatus = "Açık";
  } else {
    ticketStatus = "Kapalı";
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={cn("rounded-md px-4 py-2", cardColor)}>
          <div>
            <div className="flex justify-between">
              <div>
                Talep ID #{ticket.id} ({ticketStatus})
              </div>
              <div>Konu: {ticket.konu}</div>
            </div>
            <div className="flex justify-between">
              <div>Talep Sahibi: {ticket.talebiYapanKisi}</div>
              <div>Atanan Personel: {ticket.atananPersonel}</div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Talep</DialogTitle>
        </VisuallyHidden>

        <TicketCard ticket={ticket} />
      </DialogContent>
    </Dialog>
  );
}
