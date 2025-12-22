"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type User as UserType } from "@/models/User";
import { clsx } from "clsx";

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
        body: JSON.stringify({ userId: user._id, role: selectedRole }),
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
    onSuccess: () => setLastSavedRole(selectedRole),
    onError: (err, vars, ctx) => {
      if (ctx?.prevUsers)
        queryClient.setQueryData(["all-users"], ctx.prevUsers);
      setSelectedRole(lastSavedRole);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["all-users"] }),
  });

  return (
    <tr
      className={clsx(
        "flex flex-col md:table-row p-4 md:p-0 transition-colors",
        mutation.isPending ? "bg-blue-50/50" : "hover:bg-slate-50/50"
      )}
    >
      {/* Mobile Label: User */}
      <td className="md:p-4 flex flex-col items-center">
        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          User
        </span>
        <div className="font-semibold text-slate-900">{user.name}</div>
        <div className="text-slate-500 text-xs md:hidden">{user.email}</div>
      </td>

      {/* Mobile Label: Contact */}
      <td className="md:p-4 hidden md:table-cell">
        <div className="text-slate-600 text-center">{user.email}</div>
        <div className="text-slate-400 text-xs text-center">
          {user.phone || "No phone"}
        </div>
      </td>

      {/* Role Selector */}
      <td className="md:p-4 flex flex-col items-center mt-3 md:mt-0">
        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Update Role
        </span>
        <select
          value={selectedRole}
          disabled={mutation.isPending}
          onChange={(e) => setSelectedRole(e.target.value as UserType["role"])}
          className="rounded-lg border bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-32"
        >
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>
      </td>

      {/* Action Button */}
      <td className="md:p-4 flex md:table-cell justify-center mt-4 md:mt-0">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !isDirty}
          className={clsx(
            "w-full px-4 py-2 rounded-lg text-sm mx-auto font-semibold transition-all shadow-sm",
            isDirty
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </td>
    </tr>
  );
}
