import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lookup } from "@/types/lookup";

type LookupItemProps = {
  label: string;
  content: string;
};
type LookupCardProps = {
  lookup: Lookup;
};

function LookupItem({ label, content }: LookupItemProps) {
  return (
    <div className="flex flex-col items-center justify-center border-b">
      <div className="mb-2 w-full space-y-2 text-center">
        <p className="font-bold">{label}</p>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default function LookupCard({ lookup }: LookupCardProps) {
  return (
    <Card>
      <CardHeader className="border-b-1">
        <CardTitle className="mb-4 text-center"> {`Çağrı ID:${lookup.id}`}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LookupItem label="Çağrıyı Yapan Personel" content={lookup.personelAdi.toString()} />
        <LookupItem label="Notlar" content={lookup.notlar} />
      </CardContent>
    </Card>
  );
}
