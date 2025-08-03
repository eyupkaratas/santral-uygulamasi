"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Birim } from "@/types/personnel";
import { useQueryState } from "nuqs";

type UnitFilterProps = {
  units: Birim[];
};

export default function UnitFilter({ units }: UnitFilterProps) {
  const [birimId, setBirimId] = useQueryState("birimId", { shallow: false });

  return (
    <div>
      <Select
        onValueChange={(value) => {
          setBirimId(value);
        }}
        value={birimId ?? ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Birim" />
        </SelectTrigger>
        <SelectContent>
          {units.map((unit) => (
            <SelectItem key={unit.id} value={unit.id.toString()}>
              {unit.ad}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
