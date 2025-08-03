"use client";

import { createPersonnelAction } from "@/actions/personnel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserRoundPlus } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  personnelName: z.string().nonempty({ error: "Lütfen personelin adını giriniz." }),
  position: z.string().nonempty({ error: "Lütfen personelin ünvanını giriniz." }),
  personnelId: z.string().nonempty({ error: "Lütfen personelin ID'sini giriniz." }),
  email: z.email().nonempty({ error: "Lütfen personelin e-postasını giriniz." }),
  password: z.string().nonempty({ error: "Lütfen personelin şifresini giriniz." }),
  unitId: z.string({ error: "Lütfen personelin birim ID'sini giriniz." }),
  role: z.string().nonempty({ error: "Lütfen personelin rolünü giriniz." }),
});

export default function CreatePersonnelForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personnelName: "",
      position: "",
      personnelId: "",
      email: "",
      password: "",
      unitId: "",
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await createPersonnelAction(values);
      if (res.success) {
        toast.success(res.message, { position: "top-center", closeButton: true });
        form.reset();
      } else {
        toast.error(res.message, { position: "bottom-center", closeButton: true });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <UserRoundPlus width={16} height={16} /> Personel Oluştur
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto">
        <DialogTitle className="text-center">Personel Oluştur</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                name="personnelName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel Adı ve Soyadı</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="position"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel Ünvanı</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="personnelId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel ID&apos;si</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel E-Postası</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel Şifresi</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="unitId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel Birim ID&apos;si</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Personel Rolü</FormLabel>
                      <FormControl>
                        <Input placeholder="DepartmentUser | Operator | Admin" {...field} />
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
      </DialogContent>
    </Dialog>
  );
}
