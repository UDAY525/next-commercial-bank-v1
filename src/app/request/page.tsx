"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Droplet, Phone, User as UserIcon, Activity } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import useGetUserFromDB from "@/hooks/useGetUserFromDB";
import type { User as UserType } from "@/models/User";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .min(10, "At least 10 digits"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "At least 1 unit")
    .max(100, "Max 10 units per request"),
});

const RequestPage = () => {
  const user: UserType | null = useGetUserFromDB();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      bloodGroup: user?.bloodGroup ?? "O-",
      quantity: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "O+",
        quantity: 1,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Request Submitted:", values);
    // Add your mutation here

    const requestPromise = fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Request failed");
      }
      return res.json();
    });

    toast.promise(requestPromise, {
      loading: "Submitting your request...",
      success: "Your request has been submitted",
      error: "Request not created, please try again",
    });

    await requestPromise;

    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "O+",
        quantity: 1,
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center py-15 justify-center p-4 overflow-hidden">
      {/* Animated Background Gradients */}
      {/* Soft Pulsating Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-emerald-100 to-sky-100 animate-gradient" />

        {/* Floating blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-rose-300/40 rounded-full blur-[140px] animate-blob" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-emerald-300/40 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] right-[-15%] w-[40%] h-[40%] bg-sky-300/30 rounded-full blur-[140px] animate-blob animation-delay-4000" />
      </div>

      <Card className="relative w-full max-w-xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] rounded-3xl animate-in fade-in zoom-in duration-700">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <Droplet
              className="text-emerald-600 animate-pulse"
              size={32}
              fill="currentColor"
            />
          </div>

          <CardTitle className="text-3xl font-extrabold text-slate-800">
            Request <span className="text-emerald-600">Blood Grant</span>
          </CardTitle>

          <CardDescription className="text-slate-600">
            Submit your request. Our team will review availability and respond
            promptly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                        <UserIcon size={14} /> Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                        <Phone size={14} /> Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0123456789"
                          {...field}
                          className="bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group */}
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                        <Activity size={14} /> Required Group
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border w-full border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-slate-200 shadow-xl text-slate-800">
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((g) => (
                            <SelectItem
                              key={g}
                              value={g}
                              className="focus:bg-emerald-500 focus:text-white"
                            >
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                        Quantity (Units)
                      </FormLabel>
                      {/* <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-white/5 border-white/10 text-white focus:border-emerald-500"
                        />
                      </FormControl> */}
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
                            field.onChange(
                              val === "" ? undefined : Number(val),
                            );
                          }}
                          value={(field.value as number | undefined) ?? ""}
                          className="bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-900/20"
              >
                Send Grant Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestPage;
