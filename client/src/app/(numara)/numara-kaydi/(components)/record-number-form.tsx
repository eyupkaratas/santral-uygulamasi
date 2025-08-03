"use client";

import { createNumberRecordAction } from "@/actions/lookup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  no: z.string().nonempty({ message: "Lütfen bir numara girin." }),
  direction: z.string().nonempty({ message: "Lütfen bir arama yönü girin." }),
  notes: z.string(),
  personName: z.string().nonempty({ message: "Lütfen bir kişi adı girin." }),
});

export function RecordNumberForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: "",
      direction: "",
      notes: "",
      personName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await createNumberRecordAction({
        no: values.no,
        direction: Number(values.direction),
        notes: values.notes,
        personName: values.personName,
      });

      if (res.success) {
        toast.success("Numara kaydı oluşturuldu.", { position: "top-center", closeButton: true });
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
          <CardTitle className="text-center">Numara Kaydı</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  name="no"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Numara</FormLabel>
                        <FormControl>
                          <Input placeholder="0 555 555 5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="direction"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Arama Yönü</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} {...field}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Arama Yönü" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Gelen</SelectItem>
                              <SelectItem value="1">Giden</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Notlar</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="personName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>Kişi Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Eyüp Karataş" {...field} />
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
