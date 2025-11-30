"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
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

export default function Profile() {
  // async user hook (may be null initially)
  const user: UserType | null = useGetUserFromDB();
  console.log(user);
  // local controlled form state
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const [bloodGroup, setBloodGroup] = useState<string | undefined>(undefined);

  // whether we've initialized state from `user` already
  const [initialized, setInitialized] = useState(false);

  // initialize local state ONCE when user becomes available
  useEffect(() => {
    if (!initialized && user) {
      setEmail(user.email ?? "");
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
      setMedicalHistory(user.medicalHistory ?? "");
      setBloodGroup(user.bloodGroup ?? undefined);
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialized]);

  // optional: form submit state
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // build payload
    const payload = {
      email, // usually read-only but useful to log
      name,
      phone,
      medicalHistory,
      bloodGroup,
    };

    // log to console first (as you requested)
    console.log("Profile submit payload:", payload);

    // If you want to send to your server:
    try {
      setSaving(true);
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log("Updated:", json);
    } catch (err) {
      console.error("Network error saving profile:", err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Card className="w-full max-w-xl shadow-2xl mx-auto border-gray-300 mt-20">
        <CardHeader>
          <CardTitle>Your Profile Details</CardTitle>
          <CardDescription>
            Please complete your profile to commit transactions and help others
            notify you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  required
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Blood Group</Label>
                <Select
                  value={bloodGroup ?? ""}
                  onValueChange={(val) => setBloodGroup(val || undefined)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a blood group" />
                  </SelectTrigger>
                  <SelectContent className="bg-white opacity-100">
                    <SelectGroup>
                      <SelectLabel>Select your blood group</SelectLabel>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={medicalHistory}
                  required
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Type your message here."
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full bg-gray-500 text-white font-semibold"
                disabled={saving || !initialized}
              >
                {saving ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2" />
      </Card>
    </div>
  );
}
