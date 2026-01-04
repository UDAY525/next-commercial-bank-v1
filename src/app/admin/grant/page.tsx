"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

const Grant = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["all-user-requests"],
    queryFn: async () => {
      return await fetch("/api/request").then((res) => res.json());
    },
  });

  if (isFetching) return <div>Loading...</div>;

  console.log(data);
  return <div>Grant</div>;
};

export default Grant;
