"use client";

import { createTicketAction } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  subject: z.string().nonempty({ message: "Lütfen talebin konusunu girin." }),
  description: z.string().nonempty({ message: "Lütfen bir açıklama girin." }),
  requesterName: z.string().nonempty({ message: "Lütfen talepte bulunan kişinin adını giriniz." }),
  requesterNumber: z.string().nonempty({ message: "Lütfen talepte bulunan kişinin numarasını giriniz." }),
  assignedPersonnelId: z.string().nonempty({ message: "Lütfen taleple ilgilenecek personelin IDsini giriniz." }),
});

export function RecordTicketForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      requesterName: "",
      requesterNumber: "",
      assignedPersonnelId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await createTicketAction({
        subject: values.subject,
        description: values.description,
        requesterName: values.requesterName,
        requesterNumber: values.requesterNumber,
        assignedPersonnelId: Number(values.assignedPersonnelId),
      });

      if (res.success) {
        toast.success("Talep başarıyla oluşturuldu.", { position: "top-center", closeButton: true });
        form.reset();
      } else {
        toast.error(res.message, { position: "top-center", closeButton: true });
      }
    });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Talep Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  name="subject"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Talep Konusu</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="requesterName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Talepte Bulunan Kişi</FormLabel>
                        <FormControl>
                          <Input placeholder="Ad Soyad Giriniz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="requesterNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Talepte Bulunan Kişinin Numarası</FormLabel>
                        <FormControl>
                          <Input placeholder="05555555555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  name="assignedPersonnelId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Talebin Atanacağı Personel</FormLabel>
                        <FormControl>
                          <Input placeholder="ID Giriniz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : "Oluştur"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
