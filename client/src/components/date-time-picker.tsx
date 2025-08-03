"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

interface DateTimePickerProps {
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
}

export default function DateTimePicker({ label, date, setDate, time, setTime }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1">{label} Tarihi</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-40 justify-between font-normal">
            {date ? date.toLocaleDateString("tr-TR") : "Tarih seçin"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <Label className="px-1">{label} Saati</Label>
      <Input
        type="time"
        step="1"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="bg-background w-40"
      />
    </div>
  );
}
