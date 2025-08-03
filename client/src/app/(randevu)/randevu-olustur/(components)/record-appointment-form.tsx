"use client";

import { createAppointmentAction } from "@/actions/appointment";
import DateTimePicker from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string().nonempty({ message: "Lütfen randevu konusunu girin." }),
  personnelId: z.string().nonempty({ message: "Personel ID gerekli." }),
  kisiId: z.string().nonempty({ message: "Kişi ID gerekli." }),
});

export function RecordAppointmentForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00:00");

  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState("10:00:00");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      personnelId: "",
      kisiId: "",
    },
  });

  function combineDateTime(date?: Date, timeStr?: string): Date | null {
    if (!date || !timeStr) return null;

    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, seconds || 0);
    return combined;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const baslangicZamani = combineDateTime(startDate, startTime);
    const bitisZamani = combineDateTime(endDate, endTime);

    if (!baslangicZamani || !bitisZamani) {
      toast.error("Lütfen başlangıç ve bitiş tarih/saatini seçin.");
      return;
    }

    startTransition(async () => {
      const res = await createAppointmentAction({
        subject: values.subject,
        personnelId: Number(values.personnelId),
        kisiId: Number(values.kisiId),
        baslangicZamani,
        bitisZamani,
      });

      if (res.success) {
        toast.success("Randevu başarıyla oluşturuldu.", { position: "top-center" });
        form.reset();
        setStartDate(undefined);
        setStartTime("09:00:00");
        setEndDate(undefined);
        setEndTime("10:00:00");
      } else {
        toast.error(res.message, { position: "top-center" });
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Randevu Oluşturma</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Randevu Konusu</FormLabel>
                    <FormControl>
                      <Input placeholder="Konu giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="personnelId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="kisiId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kişi ID</FormLabel>
                    <FormControl>
                      <Input placeholder="5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-6">
                <DateTimePicker
                  label="Başlangıç"
                  date={startDate}
                  setDate={setStartDate}
                  time={startTime}
                  setTime={setStartTime}
                />
                <DateTimePicker label="Bitiş" date={endDate} setDate={setEndDate} time={endTime} setTime={setEndTime} />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Oluştur"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
