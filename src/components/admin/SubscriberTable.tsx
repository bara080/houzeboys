"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Subscriber } from "@/lib/stats";

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SubscriberTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(0); }}
        className="max-w-sm bg-white/5 border-white/10 text-white placeholder:text-gray-600"
      />
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Email</TableHead>
              <TableHead className="text-gray-500">Phone</TableHead>
              <TableHead className="text-gray-500">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((s) => (
                <TableRow key={s.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="text-white font-medium">{s.name}</TableCell>
                  <TableCell className="text-gray-400">{s.email}</TableCell>
                  <TableCell className="text-gray-400">{s.phone}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(s.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded border border-white/10 disabled:opacity-30 hover:text-white"
          >
            ← Prev
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded border border-white/10 disabled:opacity-30 hover:text-white"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
