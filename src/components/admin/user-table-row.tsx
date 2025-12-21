"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type User as UserType } from "@/models/User";
import clsx from "clsx";

export default function UserRow({ user }: { user: UserType }) {
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState<UserType["role"]>(user.role);

  const [lastSavedRole, setLastSavedRole] = useState<UserType["role"]>(
    user.role
  );

  const isDirty = selectedRole !== lastSavedRole;

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          role: selectedRole,
        }),
      });

      if (!res.ok) throw new Error("Failed to update role");
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["all-users"] });

      const prevUsers = queryClient.getQueryData<UserType[]>(["all-users"]);

      queryClient.setQueryData<UserType[]>(["all-users"], (old) =>
        old?.map((u) => (u._id === user._id ? { ...u, role: selectedRole } : u))
      );

      return { prevUsers };
    },

    onSuccess: () => {
      // 🔥 THIS is the key line
      setLastSavedRole(selectedRole);
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevUsers) {
        queryClient.setQueryData(["all-users"], ctx.prevUsers);
      }
      setSelectedRole(lastSavedRole);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });

  return (
    <tr
      className={clsx(
        "border-t transition-all",
        mutation.isPending && "bg-yellow-50 opacity-60",
        !mutation.isPending && "hover:bg-gray-50"
      )}
    >
      <td className="p-3">{user.name}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.phone}</td>

      <td className="p-3">
        <select
          value={selectedRole}
          disabled={mutation.isPending}
          onChange={(e) => setSelectedRole(e.target.value as UserType["role"])}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>
      </td>

      <td className="p-3">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !isDirty}
          className={clsx(
            "rounded-md px-3 py-1 text-sm font-medium transition",
            isDirty
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          )}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
}
