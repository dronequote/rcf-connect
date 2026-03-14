"use client";

import { useState } from "react";
import { Card, Section } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import { fetchWithStaffAuth } from "@/lib/staff-auth";
import type { Visitor, VisitorStatus } from "@/lib/types";

interface VisitorsClientProps {
  visitors: Visitor[];
}

const filters = ["All", "New", "Following Up", "Connected", "Regular"] as const;
type Filter = (typeof filters)[number];

const statusMap: Record<string, Filter> = {
  new: "New",
  following_up: "Following Up",
  connected: "Connected",
  regular: "Regular",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  following_up: "bg-yellow-100 text-yellow-700",
  connected: "bg-green-100 text-green-700",
  regular: "bg-purple-100 text-purple-700",
};

const statusOptions: { value: VisitorStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "following_up", label: "Following Up" },
  { value: "connected", label: "Connected" },
  { value: "regular", label: "Regular" },
];

interface VisitorNote {
  text: string;
  author: string;
  createdAt: string;
}

export default function VisitorsClient({ visitors: initial }: VisitorsClientProps) {
  const [visitors, setVisitors] = useState(initial);
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [noteText, setNoteText] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [visitorNotes, setVisitorNotes] = useState<Record<string, VisitorNote[]>>({});

  const filtered = visitors.filter((v) => {
    if (filter !== "All" && statusMap[v.status] !== filter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = async (id: string, status: VisitorStatus) => {
    setSaving(id);
    try {
      const res = await fetchWithStaffAuth(`/api/admin/visitors/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVisitors((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status } : v))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setSaving(null);
  };

  const handleAddNote = async (id: string) => {
    const text = noteText[id]?.trim();
    if (!text) return;
    setSaving(id);
    try {
      const res = await fetchWithStaffAuth(`/api/admin/visitors/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setVisitorNotes((prev) => ({
          ...prev,
          [id]: [...(prev[id] || []), data.note],
        }));
        setNoteText((prev) => ({ ...prev, [id]: "" }));
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    }
    setSaving(null);
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Visitor Management</h1>
        <p className="text-sm text-gray-500">
          {visitors.length} total visitors
        </p>
      </div>

      <StaffHelp section="visitors" />

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-church-main transition-colors mb-4"
      />

      {/* Filter Pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? "bg-church-main text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Visitor Cards */}
      <div className="space-y-2.5">
        {filtered.map((v) => (
          <Card
            key={v.id}
            className="cursor-pointer hover:border-church-main transition-all"
            onClick={() => setExpanded(expanded === v.id ? null : v.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-church-soft flex items-center justify-center text-church-main text-xs font-bold shrink-0">
                {v.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[v.status]}`}>
                    {statusMap[v.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{v.date} · {v.source}</p>
              </div>
              <span className="text-gray-400 text-xs">{expanded === v.id ? "▲" : "▼"}</span>
            </div>

            {expanded === v.id && (
              <div className="mt-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Email</p>
                    <p className="text-xs text-gray-700">{v.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Phone</p>
                    <p className="text-xs text-gray-700">{v.phone}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.interests.map((i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-church-soft text-church-main text-[10px] font-semibold">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Update Status</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleStatusChange(v.id, opt.value)}
                        disabled={saving === v.id}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          v.status === opt.value
                            ? "bg-church-main text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } ${saving === v.id ? "opacity-50" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Notes</p>
                  {(visitorNotes[v.id] || []).map((note, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 mb-1.5 text-xs text-gray-700">
                      <p>{note.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {note.author} · {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      placeholder="Add a note..."
                      value={noteText[v.id] || ""}
                      onChange={(e) =>
                        setNoteText((prev) => ({ ...prev, [v.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-church-main"
                    />
                    <button
                      onClick={() => handleAddNote(v.id)}
                      disabled={saving === v.id || !noteText[v.id]?.trim()}
                      className="px-4 py-2 rounded-lg bg-church-main text-white text-xs font-semibold disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No visitors match your filters.</p>
        </div>
      )}
    </div>
  );
}
