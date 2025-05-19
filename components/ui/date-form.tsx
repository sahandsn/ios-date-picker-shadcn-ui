"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IosDatePicker } from "@/components/ios-date-picker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  date: z.date(),
});

type TForm = z.infer<typeof schema>;

export const DateForm = () => {
  const form = useForm<TForm>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (values: TForm) => {
    toast(values.date.toLocaleString());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Date</FormLabel>
              <IosDatePicker {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button>Submit</Button>
      </form>
    </Form>
  );
};
