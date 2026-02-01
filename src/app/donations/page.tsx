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
import useGetUserFromDB from "@/hooks/useGetUserFromDB";
import type { User as UserType } from "@/models/User";

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

  const formSchema = z.object({
    phone: z.string().regex(/^\d+$/, "Contact must be a number").min(10),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    quantity: z.coerce.number().int().min(1).max(100),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: user?.phone ?? "",
      bloodGroup: user?.bloodGroup ?? "O-",
      quantity: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch("/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch (err) {
      console.error(err);
    }
    if (user) {
      form.reset({
        phone: user.phone ?? "",
        bloodGroup: user.bloodGroup ?? "O-",
        quantity: undefined,
      });
    }
  }

  useEffect(() => {
    if (user) {
      form.reset({
        phone: user.phone ?? "",
        bloodGroup: user.bloodGroup ?? "O-",
        quantity: undefined,
      });
    }
  }, [user, form]);

  return (
    <div className="relative min-h-screen py-15 overflow-hidden bg-white flex items-center justify-center px-4">
      {/* 🌈 Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-red-500/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-green-500/20 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      {/* 🪟 Glass Card */}
      <Card
        className="
    relative z-10 w-full max-w-xl
    rounded-3xl
    bg-white/65 backdrop-blur-xl
    border border-white/70
    shadow-[0_25px_70px_-20px_rgba(0,0,0,0.3)]
    overflow-hidden
    transition-transform duration-300
    // hover:-translate-y-0.5
    fade-in zoom-in animate-in
  "
      >
        <div
          className="
      pointer-events-none
      absolute inset-0
      rounded-3xl
      ring-1 ring-red-500/20
      shadow-[inset_0_0_40px_rgba(220,38,38,0.08)]
    "
        />

        <div
          className="
      pointer-events-none
      absolute inset-0
      bg-linear-to-br from-white/40 via-transparent to-transparent
      opacity-50
    "
        />

        <CardHeader className="relative space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Donate Blood
            <span className="text-red-600 animate-pulse">❤️</span>
          </CardTitle>
          <CardDescription className="text-slate-600">
            Your donation can save lives. Please fill in the details below.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="
                    bg-white/80
                    border-slate-300
                    focus:border-red-500 focus:ring-red-500/30
                    transition
                  "
                        placeholder="Enter phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blood Group */}
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Blood Group
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="
                      bg-white/80 border-slate-300
                      focus:ring-2 focus:ring-red-500/30 w-full
                      transition
                    "
                        >
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            <SelectLabel>Blood Groups</SelectLabel>
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

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        {...field}
                        value={(field.value as number | undefined) ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        className="
                    bg-white/80
                    border-slate-300
                    focus:border-red-500 focus:ring-red-500/30
                    transition
                  "
                        placeholder="Units donated"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="
            relative w-full mt-4
            py-3 rounded-xl
            font-semibold text-white
            bg-linear-to-r from-green-600 to-green-700
            hover:from-green-700 hover:to-green-800
            shadow-lg shadow-green-600/30
            transition-all duration-300
            hover:shadow-green-600/50
            focus-visible:ring-2 focus-visible:ring-red-500/40
          "
              >
                <span className="relative z-10">Submit Donation</span>

                {/* soft pulse overlay */}
                <span
                  className="
              absolute inset-0
              rounded-xl
              bg-red-500/10
              opacity-0
              group-hover:opacity-100
              transition
            "
                />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
