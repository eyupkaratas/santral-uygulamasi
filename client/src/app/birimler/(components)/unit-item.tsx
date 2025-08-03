import ProfileCard from "@/components/profile-card";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Personnel } from "@/types/personnel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type UnitItemProps = {
  personnel: Personnel;
};

export default function UnitItem({ personnel }: UnitItemProps) {
  const { adSoyad, birim, unvan, dahiliNo, eposta } = personnel;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:bg-muted/90 rounded-md px-4 py-2">
          {adSoyad}, {unvan}
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Profil</DialogTitle>
        </VisuallyHidden>

        <ProfileCard adSoyad={adSoyad} birim={birim.ad} unvan={unvan} dahiliNo={dahiliNo} eposta={eposta} />
      </DialogContent>
    </Dialog>
  );
}
