"use client";

import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return <p>Not logged in</p>;

  console.log(session);
  return <div>Profile</div>;
};

export default Profile;
