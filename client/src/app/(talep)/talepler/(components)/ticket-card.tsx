import { updateTicketAction } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket } from "@/types/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type TicketItemProps = {
  label: string;
  content: string;
};

function TicketItem({ label, content }: TicketItemProps) {
  return (
    <div className="flex flex-col items-center justify-center border-b">
      <div className="mb-2 w-full space-y-2 text-center">
        <p className="font-bold">{label}</p>
        <div>{content}</div>
      </div>
    </div>
  );
}

type TicketCardProps = {
  ticket: Ticket;
};

const formSchema = z.object({
  personnelId: z.string({ message: "Lütfen mevcut bir personel ID giriniz." }),
  status: z.string({ message: "Lütfen geçerli bir durum seçiniz." }),
  priority: z.string({ message: "Lütfen geçerli bir öncelik seçiniz." }),
});

export default function TicketCard({ ticket }: TicketCardProps) {
  const [isPending, startTransition] = useTransition();
  const priorityMap: Record<string, string> = {
    Dusuk: "0",
    Normal: "1",
    Yuksek: "2",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personnelId: ticket.atananPersonelId?.toString() || "",
      status: ticket.durum === "Acik" ? "0" : "1",
      priority: priorityMap[ticket.oncelik] ?? "1",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await updateTicketAction(
        {
          personnelId: values.personnelId,
          status: values.status,
          priority: values.priority,
        },
        ticket.id
      );

      if (res.success) {
        toast.success(res.message, { position: "top-center", closeButton: true });
        form.reset();
      } else {
        toast.error(res.message, { position: "top-center", closeButton: true });
      }
    });
  }
  return (
    <Card>
      <CardHeader className="border-b-1">
        <CardTitle className="mb-4 text-center"> {`Talep ID #${ticket.id}`}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TicketItem label="Konu:" content={ticket.konu.toString()} />
        <TicketItem label="Açıklama" content={ticket.aciklama} />
        <TicketItem label="Talep Sahibi" content={ticket.talebiYapanKisi} />
        <TicketItem label="Talep Tarihi" content={new Date(ticket.createdDate).toLocaleDateString("tr-TR")} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                name="personnelId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Atanacak Personel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Talep Durumu</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Talep Durumu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Açık</SelectItem>
                            <SelectItem value="1">Kapalı</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Öncelik</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Öncelik" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Düşük</SelectItem>
                            <SelectItem value="1">Normal</SelectItem>
                            <SelectItem value="2">Yüksek</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : "Güncelle"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
