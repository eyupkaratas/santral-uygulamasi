import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cargo } from "@/types/cargo";

type CargoItemProps = {
  label: string;
  content: string;
};

function CargoItem({ label, content }: CargoItemProps) {
  return (
    <div className="flex flex-col items-center justify-center border-b">
      <div className="mb-2 w-full space-y-2 text-center">
        <p className="font-bold">{label}</p>
        <div>{content}</div>
      </div>
    </div>
  );
}

type CargoCardProps = {
  cargo: Cargo;
};

export default function CargoCard({ cargo }: CargoCardProps) {
  return (
    <Card>
      <CardHeader className="border-b-1">
        <CardTitle className="mb-4 text-center">Kargo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CargoItem label="Gönderen" content={cargo.gonderen} />
        <CargoItem label="Açıklama" content={cargo.aciklama} />
        <CargoItem label="Teslim Tarihi" content={new Date(cargo.teslimTarihi!).toLocaleDateString("tr-TR")} />
        <CargoItem label="Teslim Alan Personel" content={cargo.teslimAlanPersonelAdi!} />
      </CardContent>
    </Card>
  );
}
