"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User as UserType } from "@/models/User";
import UserRow from "./user-table-row";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const ROWS_PER_PAGE = 15;

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
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchUsers,
  });

  // Base Logic: Filter & Sort
  const processedUsers = useMemo(() => {
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

  // Pagination Logic
  const totalPages = Math.ceil(processedUsers.length / ROWS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return processedUsers.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [processedUsers, currentPage]);

  if (isLoading) return <div className="p-6 text-center">Loading users...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500 text-center text-sm">
        Failed to load users
      </div>
    );

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-slate-800">
        User Access Control
      </h2>

      {/* Filters Section - Stacks on mobile */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="flex-1 md:flex-none border rounded-xl px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="regular">Regular</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-slate-50 transition-colors bg-white text-sm"
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </span>
          </button>
        </div>
      </div>

      {/* Table Container - Restored Responsive Logic */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <table className="w-full text-sm border-collapse">
          {/* Header hidden on mobile */}
          <thead className="hidden md:table-header-group bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-center">
                User Details
              </th>
              <th className="p-4 font-semibold text-slate-600 text-center">
                Contact
              </th>
              <th className="p-4 font-semibold text-center text-slate-600">
                Role
              </th>
              <th className="p-4 font-semibold text-center text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          {/* Tbody acts as a flex container on mobile to match your UserRow design */}
          <tbody className="divide-y divide-slate-100 flex flex-col md:table-row-group">
            {paginatedUsers.map((user) => (
              <UserRow key={user._id?.toString()} user={user} />
            ))}

            {paginatedUsers.length === 0 && (
              <tr className="flex md:table-row w-full">
                <td
                  colSpan={4}
                  className="p-10 text-center text-slate-400 w-full"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Section - Improved for Mobile */}
        <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs md:text-sm order-2 sm:order-1">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ROWS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ROWS_PER_PAGE, processedUsers.length)}
            </span>{" "}
            of <span className="font-medium">{processedUsers.length}</span>
          </p>

          <div className="flex items-center gap-1 md:gap-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="px-3 text-xs font-medium text-slate-700 whitespace-nowrap">
              Page {currentPage} / {totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccessEdit;
