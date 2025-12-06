"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// label not used in this form
import useGetUserFromDB from "@/hooks/useGetUserFromDB";
import type { User as UserType } from "@/models/User";
// donation model type not used directly here

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect } from "react";

export default function Donation() {
  const user: UserType | null = useGetUserFromDB();

  // FormValues will be inferred from the zod schema below when used in onSubmit

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    phone: z
      .string()
      .regex(/^\d+$/, "Contact must be a number")
      .min(10, "Contact must be at least 10 digits"),
    donatedBloodGroup: z.enum([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ]),
    quantity: z.coerce
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(100, "Quantity cannot exceed 100"),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      donatedBloodGroup: user?.bloodGroup ?? "O-",
      quantity: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const res = await fetch("/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      console.log("Updated:", json);
    } catch (error) {
      console.error("Network error saving profile:", error);
      alert("Network error");
    }
  }

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name ?? "",
        phone: user?.phone ?? "",
        donatedBloodGroup: user?.bloodGroup ?? "O-",
        quantity: undefined,
      });
    }
  }, [user, form]);

  return (
    <div className="px-4 mb-10">
      <Card className="w-full max-w-xl shadow-2xl mx-auto border-gray-300 mt-10 lg:mt-20">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="donatedBloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donating Blood Group</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a blood group" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            <SelectLabel>Select blood group</SelectLabel>
                            {[
                              "A+",
                              "A-",
                              "B+",
                              "B-",
                              "AB+",
                              "AB-",
                              "O+",
                              "O-",
                            ].map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Quantity"
                        min="1"
                        max="100"
                        step="1"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                        value={(field.value as number | undefined) ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full px-4 py-2 border bg-green-800 hover:bg-green-900 text-white"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
