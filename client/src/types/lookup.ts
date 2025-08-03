export type Lookup = {
  id: number;
  kisiAdSoyad: string;
  numara: string;
  yonu: "Gelen" | "Giden";
  aramaZamani: string;
  personelAdi: string;
  notlar: string;
};

export type CreateLookup = {
  numara: string;
  yonu: 0 | 1;
  notlar: string;
  yeniKisiAdi: string;

  personelId: number;
};
