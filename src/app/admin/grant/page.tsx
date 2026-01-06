"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  Droplet,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ---------------- Types ---------------- */

type RequestStatus = "pending" | "granted" | "rejected";

interface BloodRequest {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  bloodGroup: string;
  quantity: number;
  status: RequestStatus;
  createdAt: string;
}

/* ---------------- Helpers ---------------- */

const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case "granted":
      return (
        <Badge className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 border-emerald-200">
          <CheckCircle2 className="h-3 w-3" /> Granted
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="inline-flex items-center gap-1 bg-red-100 text-red-700 border-red-200">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      );
  }
};

const updateRequestStatus = async ({
  id,
  status,
}: {
  id: string;
  status: RequestStatus;
}) => {
  const res = await fetch(`/api/admin/requests/grant/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  console.log("Sending updated status");

  if (!res.ok) throw new Error("Failed to update status");
};

export default function RequestManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BloodRequest;
    direction: "asc" | "desc";
  } | null>(null);
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["all-user-requests"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/request");
        const data = await res.json();
        return data;
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
      }
    },
  });

  const mutation = useMutation({
    mutationFn: updateRequestStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["all-user-requests"] });

      const previous = queryClient.getQueryData<BloodRequest[]>([
        "all-user-requests",
      ]);

      queryClient.setQueryData<BloodRequest[]>(
        ["all-user-requests"],
        (old = []) => old.map((r) => (r._id === id ? { ...r, status } : r))
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        console.log("error at status changes");
        queryClient.setQueryData(["all-user-requests"], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-requests"] });
    },
  });

  const requests: BloodRequest[] = data?.requests;

  const handleSort = (key: keyof BloodRequest) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredRequests = useMemo(() => {
    let result: BloodRequest[] = requests?.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (requests && sortConfig) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? 1 : -1;
        if (aVal > bVal) return sortConfig.direction === "desc" ? 1 : -1;

        return 0;
      });
    }
    return result;
  }, [requests, sortConfig, searchQuery]);

  if (isFetching) return <div>Loading...</div>;

  /* ---------------- Render ---------------- */

  return (
    <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="sticky top-0 z-20 pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Blood Requests
            </h1>
            <p className="text-slate-500">
              Review and manage blood grant requests.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search name, blood group, status..."
              className="pl-10 rounded-xl bg-white/90"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ---------------- Desktop Table ---------------- */}
      <div className="hidden md:block">
        <Card className="bg-white py-0 backdrop-blur-md shadow-xl border-none rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="">
                {/* HEADER */}
                <TableHeader className="sticky top-0 z-10">
                  <TableRow
                    className="
                bg-gradient-to-r from-slate-50 to-slate-100/70 
                border-b border-slate-200
              "
                  >
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer font-semibold text-slate-700 lg:pl-6 h-14"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="uppercase tracking-wide text-xs">
                          User
                        </span>
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      onClick={() => handleSort("bloodGroup")}
                      className="cursor-pointer font-semibold text-slate-700"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Droplet className="h-4 w-4 text-rose-500" />
                        <span className="uppercase tracking-wide text-xs">
                          Group
                        </span>
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      onClick={() => handleSort("quantity")}
                      className="cursor-pointer font-semibold text-slate-700"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="uppercase tracking-wide text-xs">
                          Quantity
                        </span>
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </TableHead>

                    <TableHead
                      onClick={() => handleSort("createdAt")}
                      className="cursor-pointer font-semibold text-slate-700"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="uppercase tracking-wide text-xs">
                          Date
                        </span>
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </TableHead>

                    <TableHead className="font-semibold text-slate-700 text-center uppercase tracking-wide text-xs">
                      Status
                    </TableHead>

                    <TableHead className="text-right lg:pr-6 font-semibold text-slate-700 uppercase tracking-wide text-xs">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {/* BODY */}
                <TableBody>
                  <AnimatePresence>
                    {filteredRequests.map((req, index) => (
                      <motion.tr
                        key={req._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`
                    transition-colors
                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                    hover:bg-rose-50/40
                  `}
                      >
                        <TableCell className="lg:pl-6">
                          <div className="font-medium text-slate-900">
                            {req.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {req.phone}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="font-bold text-rose-600">
                            {req.bloodGroup}
                          </span>
                        </TableCell>

                        <TableCell className="font-medium text-center">
                          {req.quantity}
                        </TableCell>

                        <TableCell className="text-slate-600 text-center text-sm">
                          {format(new Date(req.createdAt), "MMM dd, yyyy")}
                        </TableCell>

                        <TableCell className="text-center">
                          {getStatusBadge(req.status)}
                        </TableCell>

                        <TableCell className="text-right lg:pr-6">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="
                            gap-2 rounded-lg
                            border-slate-300
                            text-slate-700
                            hover:bg-slate-100
                          "
                              >
                                Update
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-44 bg-white rounded-xl shadow-xl border-slate-200"
                            >
                              <DropdownMenuLabel>
                                Update Status
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onSelect={() =>
                                  mutation.mutate({
                                    id: req._id,
                                    status: "pending",
                                  })
                                }
                              >
                                Mark Pending
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onSelect={() =>
                                  mutation.mutate({
                                    id: req._id,
                                    status: "granted",
                                  })
                                }
                                className="text-emerald-600 focus:bg-emerald-50"
                              >
                                Grant
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onSelect={() =>
                                  mutation.mutate({
                                    id: req._id,
                                    status: "rejected",
                                  })
                                }
                                className="text-red-600 focus:bg-red-50"
                              >
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>

              {filteredRequests && (
                <button
                  onClick={() =>
                    updateRequestStatus({
                      id: filteredRequests[0]._id,
                      status: "granted",
                    })
                  }
                >
                  Click
                </button>
              )}

              {filteredRequests && filteredRequests.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  No requests found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Mobile Cards ---------------- */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {filteredRequests.map((req) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-white/80 backdrop-blur-md p-4 shadow border border-slate-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{req.name}</div>
                  <div className="text-xs text-slate-500">{req.phone}</div>
                </div>
                {getStatusBadge(req.status)}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Blood Group</div>
                  <div className="font-bold text-red-600">{req.bloodGroup}</div>
                </div>
                <div>
                  <div className="text-slate-400">Quantity</div>
                  <div>{req.quantity} Unit</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-400">Requested On</div>
                  <div>{format(new Date(req.createdAt), "MMM dd, yyyy")}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    mutation.mutate({
                      id: req._id,
                      status: "granted",
                    })
                  }
                >
                  Grant
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200"
                  onClick={() =>
                    mutation.mutate({
                      id: req._id,
                      status: "rejected",
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
