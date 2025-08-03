export type Ticket = {
  id: number;
  konu: string;
  aciklama: string;
  oncelik: string;
  durum: string;
  talebiYapanKisiId: string;
  talebiYapanKisi: string;
  olusturanPersonelId: string | null;
  olusturanPersonel: string | null;
  atananPersonelId: string;
  atananPersonel: string;
  createdDate: string;
};
