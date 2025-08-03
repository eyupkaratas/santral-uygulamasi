export type Role = "Admin" | "Operator" | "DepartmentUser";

export type Birim = {
  id: number;
  ad: string;
};

export type Personnel = {
  id: number;
  adSoyad: string;
  unvan: string;
  dahiliNo: string;
  eposta: string;
  rol: Role;
  birim: Birim;
};
