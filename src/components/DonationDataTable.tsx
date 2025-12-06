"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Donation {
  _id: string;
  name: string;
  donatedBloodGroup: string;
  quantity: number;
  donatedAt?: string | null;
}

type SortField = "donatedBloodGroup" | "quantity" | "donatedAt";
type SortOrder = "asc" | "desc" | null;

interface SortConfig {
  field: SortField | null;
  order: SortOrder;
}

interface DonationDataTableProps {
  donations: Donation[];
}

function SortIcon({
  field,
  currentField,
  currentOrder,
}: {
  field: SortField;
  currentField: SortField | null;
  currentOrder: SortOrder;
}) {
  if (currentField !== field) {
    return <div className="w-4 h-4" />;
  }
  return currentOrder === "asc" ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
}

export default function DonationDataTable({
  donations,
}: DonationDataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    order: null,
  });

  const sortedDonations = useMemo(() => {
    if (!sortConfig.field || !sortConfig.order) {
      return donations;
    }

    const sorted = [...donations].sort((a, b) => {
      const aValue =
        sortConfig.field === "donatedBloodGroup"
          ? a.donatedBloodGroup
          : sortConfig.field === "quantity"
          ? a.quantity
          : new Date(a.donatedAt || 0).getTime();

      const bValue =
        sortConfig.field === "donatedBloodGroup"
          ? b.donatedBloodGroup
          : sortConfig.field === "quantity"
          ? b.quantity
          : new Date(b.donatedAt || 0).getTime();

      if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [donations, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Cycle through: asc -> desc -> null
        const nextOrder: SortOrder =
          prev.order === "asc" ? "desc" : prev.order === "desc" ? null : "asc";
        return {
          field: nextOrder ? field : null,
          order: nextOrder,
        };
      }
      return { field, order: "asc" };
    });
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-linear-to-r from-blue-50 to-blue-100 hover:bg-linear-to-r hover:from-blue-100 hover:to-blue-200 border-b border-gray-200">
              <TableHead
                className="cursor-pointer select-none font-semibold text-blue-900 py-4 px-6 transition-colors duration-200"
                onClick={() => handleSort("donatedBloodGroup")}
              >
                <div className="flex items-center gap-2 group">
                  <span>Blood Group</span>
                  <SortIcon
                    field="donatedBloodGroup"
                    currentField={sortConfig.field}
                    currentOrder={sortConfig.order}
                  />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-blue-900 py-4 px-6 transition-colors duration-200"
                onClick={() => handleSort("quantity")}
              >
                <div className="flex items-center gap-2 group">
                  <span>Quantity (ml)</span>
                  <SortIcon
                    field="quantity"
                    currentField={sortConfig.field}
                    currentOrder={sortConfig.order}
                  />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none font-semibold text-blue-900 py-4 px-6 transition-colors duration-200 text-right"
                onClick={() => handleSort("donatedAt")}
              >
                <div className="flex items-center justify-end gap-2 group">
                  <span>Date Donated</span>
                  <SortIcon
                    field="donatedAt"
                    currentField={sortConfig.field}
                    currentOrder={sortConfig.order}
                  />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDonations.map((donation, index) => (
              <TableRow
                key={donation._id.toString()}
                className={`border-b border-gray-100 transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                } hover:bg-blue-100/50`}
              >
                <TableCell className="py-4 px-6 font-medium text-gray-900">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                    {donation.donatedBloodGroup}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-700">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {donation.quantity}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-700 text-right">
                  {donation.donatedAt ? (
                    new Date(donation.donatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedDonations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No donations to display</p>
        </div>
      )}
    </div>
  );
}
