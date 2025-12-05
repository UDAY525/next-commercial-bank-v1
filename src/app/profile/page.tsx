"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useGetUserFromDB from "@/hooks/useGetUserFromDB";
import type { User as UserType } from "@/models/User";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Profile() {
  // async user hook (may be null initially)
  const user: UserType | null = useGetUserFromDB();

  const formSchema = z.object({
    email: z.string().email("Invalid email"),
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .regex(/^\d+$/, "Contact must be a number")
      .min(10, "Contact must be at least 10 digits"),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    medicalHistory: z.string().min(2, "Please keep NA if not applicable"),
  });
  type FormValues = z.infer<typeof formSchema>;

  async function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json();
      console.log("Updated:", json);
    } catch (err) {
      console.error("Network error saving profile:", err);
      alert("Network error");
    }
    console.log(values);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? "", // ensure string, not undefined
      name: user?.name ?? "", // ensure string, not undefined
      phone: user?.phone ?? "",
      bloodGroup: user?.bloodGroup ?? "O-",
      medicalHistory: user?.medicalHistory ?? "NA", // fixed (was using bloodGroup before)
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email ?? "",
        name: user.name ?? "",
        phone: user.phone ?? "",
        bloodGroup: user.bloodGroup ?? "O-",
        medicalHistory: user.medicalHistory ?? "NA",
      });
    }
  }, [user, form]);
  console.log(user);
  return (
    <div className="px-4 mb-10">
      <Card className="w-full max-w-xl shadow-2xl mx-auto border-gray-300 mt-10 lg:mt-20">
        <CardHeader>
          <CardTitle>Your Profile Details</CardTitle>
          <CardDescription>
            Please complete your profile to commit transactions and help others
            notify you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
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
                      <Input placeholder="phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a blood group" />
                        </SelectTrigger>
                        <SelectContent className="bg-white opacity-100">
                          <SelectGroup>
                            <SelectLabel>Select your blood group</SelectLabel>
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
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        id="medicalHistory"
                        {...field}
                        placeholder="Please keep NA, if not applicable for you."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className={`px-4 py-2 rounded w-full text-white bg-gray-500 ${
                    form.formState.isSubmitting
                      ? "opacity-60 cursor-not-allowed"
                      : " hover:bg-gray-700"
                  }`}
                >
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : "Complete Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col gap-2" />
      </Card>
    </div>
  );
}
