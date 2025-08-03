import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type CardItemProps = {
  label: string;
  content: string;
};

function CardItem({ label, content }: CardItemProps) {
  return (
    <div className="flex flex-col items-center justify-center border-b">
      <div className="mb-2 text-center">
        <p className="font-bold">{label}</p>
        <p className="whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

type ProfileCardProps = {
  adSoyad: string;
  birim: string;
  unvan: string;
  dahiliNo: string;
  eposta: string;
};

export default function ProfileCard(props: ProfileCardProps) {
  const { adSoyad, birim, unvan, dahiliNo, eposta } = props;

  return (
    <Card>
      <CardHeader className="border-b-1">
        <CardTitle className="mb-4 text-center">Profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardItem label="İsim, Soyisim" content={adSoyad} />

        <CardItem label="Birim, Ünvan" content={`${birim}\n${unvan}`} />

        <CardItem label="Dahili No" content={dahiliNo} />

        <CardItem label="E-Posta" content={eposta} />
      </CardContent>
    </Card>
  );
}
