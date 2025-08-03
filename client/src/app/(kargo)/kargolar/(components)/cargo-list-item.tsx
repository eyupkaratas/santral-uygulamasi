import { deliverCargoAction } from "@/actions/cargo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Cargo } from "@/types/cargo";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Package } from "lucide-react";
import { startTransition } from "react";
import { toast } from "sonner";
import CargoCard from "./cargo-card";

type CargoListItemProps = {
  cargo: Cargo;
};

export default function CargoListItem({ cargo }: CargoListItemProps) {
  const isDisabled = cargo.durum === "Beklemede";

  function handleDeliverCargo() {
    startTransition(async () => {
      const res = await deliverCargoAction(cargo.id);

      if (res.success) {
        toast.success(res.message, { position: "top-center", closeButton: true });
      } else {
        toast.error(res.message, { position: "top-center", closeButton: true });
      }
    });
  }

  const cardContent = (
    <Card className={cn("rounded-md px-4 py-2", isDisabled ? "cursor-not-allowed" : "hover:bg-muted/90")}>
      <CardContent className="flex items-center justify-between p-0">
        <div className={cn(isDisabled && "opacity-70")}>
          <div>Gönderen: {cargo.gonderen}</div>
          <div>Takip Numarası: {cargo.takipNumarasi}</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn(isDisabled && "opacity-70")}>{cargo.durum}</div>
          {cargo.durum === "Beklemede" && (
            <Button size="icon" className="pointer-events-auto" onClick={handleDeliverCargo}>
              <Package width={16} height={16} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isDisabled) {
    return cardContent;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{cardContent}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Kargo</DialogTitle>
        </VisuallyHidden>

        <CargoCard cargo={cargo} />
      </DialogContent>
    </Dialog>
  );
}
