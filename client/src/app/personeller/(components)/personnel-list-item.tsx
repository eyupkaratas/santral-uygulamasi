import { deletePersonnelAction } from "@/actions/personnel";
import ProfileCard from "@/components/profile-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Personnel } from "@/types/personnel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type PersonnelListItemProps = {
  personnel: Personnel;
};

export default function PersonnelListItem({ personnel }: PersonnelListItemProps) {
  const { adSoyad, birim, unvan, dahiliNo, eposta } = personnel;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:bg-muted/90 relative flex flex-row items-center justify-between rounded-md px-4 py-2">
          <CardContent className="p-0">
            {adSoyad}, {unvan}
          </CardContent>

          <DeleteButton personnelId={personnel.id} />
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Personel</DialogTitle>
        </VisuallyHidden>

        <ProfileCard adSoyad={adSoyad} birim={birim.ad} unvan={unvan} dahiliNo={dahiliNo} eposta={eposta} />
      </DialogContent>
    </Dialog>
  );
}

type DeleteButtonProps = {
  personnelId: number;
};

function DeleteButton({ personnelId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDeletion() {
    startTransition(async () => {
      const res = await deletePersonnelAction(personnelId);

      if (res.success) {
        toast.success(res.message, { position: "top-center", closeButton: true });
      } else {
        toast.error(res.message, { position: "top-center", closeButton: true });
      }
    });
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={(e) => e.stopPropagation()}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" className="pointer-events-auto">
            <Trash2 width={16} height={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bu personeli silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Personel kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletion}>
              {isPending ? <Loader2 className="animate-spin" /> : "Devam"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
