"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User as UserType } from "@/models/User";
import UserRow from "./user-table-row";
import { Search, ArrowUpDown, Filter } from "lucide-react";

const fetchUsers = async (): Promise<UserType[]> => {
  const res = await fetch("/api/admin/users?user=all");
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.users;
};

const UserAccessEdit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchUsers,
  });

  // Filter and Sort Logic
  const filteredUsers = useMemo(() => {
    if (!data) return [];

    return data
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  }, [data, searchTerm, roleFilter, sortOrder]);

  if (isLoading) return <div className="p-6 text-center">Loading users...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500 text-center">Failed to load users</div>
    );

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        User Access Control
      </h2>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="border rounded-xl px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="regular">Regular</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-slate-50 transition-colors bg-white"
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">
              Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="hidden md:table-header-group grid grid-cols-4 bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold mx-auto text-slate-600">
                User Details
              </th>
              <th className="p-4 font-semibold mx-auto text-slate-600">
                Contact
              </th>
              <th className="p-4 font-semibold text-center mx-auto text-slate-600">
                Role
              </th>
              <th className="p-4  font-semibold mx-auto text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 flex flex-col md:table-row-group">
            {filteredUsers.map((user) => (
              <UserRow key={user._id?.toString()} user={user} />
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessEdit;
