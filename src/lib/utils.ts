import { auth } from "@/auth";
import connectDB from "@/connectDB";
import User from "@/models/User";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
