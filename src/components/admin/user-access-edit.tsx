"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type User as UserType } from "@/models/User";
import UserRow from "./user-table-row";

const fetchUsers = async (): Promise<UserType[]> => {
  const res = await fetch("/api/admin/users?user=all");
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.users;
};

const UserAccessEdit = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div className="p-6">Loading users…</div>;
  if (error)
    return <div className="p-6 text-red-500">Failed to load users</div>;

  return (
    <div className="p-6 mx-auto w-full">
      <h2 className="text-xl font-semibold mb-4">User Access Control</h2>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((user) => (
              <UserRow
                key={user._id?.toString()}
                user={user}
                // onRoleChange={(role) => mutate({ userId: user._id, role })}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessEdit;
