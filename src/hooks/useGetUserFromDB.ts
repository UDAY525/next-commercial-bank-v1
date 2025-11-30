"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { User as UserType } from "@/models/User";

const useGetUserFromDB = () => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<UserType | null>(null);

  // Update imgSrc when session changes (handles async arrival)
  useEffect(() => {
    // 1. Define the async function inside
    const fetchData = async () => {
      try {
        const resp = await fetch("/api/user");

        if (!resp.ok) throw new Error("Network response was not ok");

        const data = await resp.json();
        setUser(data?.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    // 2. Call the function immediately
    fetchData();
  }, [session]); // Removed imgSrc from dependencies

  if (status === "loading" || status === "unauthenticated") return null;

  return user;
};

export default useGetUserFromDB;
