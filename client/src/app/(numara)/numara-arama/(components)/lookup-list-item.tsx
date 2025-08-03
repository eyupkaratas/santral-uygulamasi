import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Lookup } from "@/types/lookup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LookupCard from "./last-call-card";

type LookupListItemProps = {
  lookup: Lookup;
};

export default function LookupListItem({ lookup }: LookupListItemProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={cn("rounded-md px-4 py-2")}>
          <div>
            <div className="flex justify-between">
              <div>
                Numara:{lookup.numara} ({lookup.yonu})
              </div>
            </div>
            <div className="flex justify-between">
              <div>Numara Sahibi: {lookup.kisiAdSoyad}</div>
              <div>
                Çağrı Tarihi:{" "}
                {new Date(lookup.aramaZamani).toLocaleString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Talep</DialogTitle>
        </VisuallyHidden>

        <LookupCard lookup={lookup} />
      </DialogContent>
    </Dialog>
  );
}
