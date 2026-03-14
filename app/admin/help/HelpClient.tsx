"use client";

import { useState, useEffect } from "react";
import { Card, Section } from "@/components/ui";
import { getStaffUser } from "@/lib/staff-auth";
import { getAllHelp, type HelpEntry } from "@/lib/help-content";

export default function HelpClient() {
  const [role, setRole] = useState<"superadmin" | "admin" | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const user = getStaffUser();
    if (user) setRole(user.role);
  }, []);

  const isSuperAdmin = role === "superadmin";
  const allHelp = getAllHelp();

  // Filter: admins don't see architecture/auth-only sections
  const sections = allHelp.filter((h) => {
    if (!isSuperAdmin && (h.section === "architecture" || h.section === "auth")) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        h.title.toLowerCase().includes(q) ||
        h.overview.toLowerCase().includes(q) ||
        h.steps.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featureSections = sections.filter((h) => h.route !== "/admin/help");
  const referenceSections = sections.filter((h) => h.route === "/admin/help");

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Staff Help Center</h1>
        <p className="text-sm text-gray-500">
          {isSuperAdmin
            ? "Complete reference — operational guides + technical documentation"
            : "How to use each feature in the admin dashboard"}
        </p>
        {isSuperAdmin && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">
            Super-Admin View
          </span>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search help topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-church-main transition-colors mb-5"
      />

      {/* Feature Guides */}
      <Section label="FEATURE GUIDES">
        <div className="space-y-2.5 mb-6">
          {featureSections.map((entry) => (
            <HelpCard
              key={entry.section}
              entry={entry}
              expanded={expanded === entry.section}
              onToggle={() => setExpanded(expanded === entry.section ? null : entry.section)}
              isSuperAdmin={isSuperAdmin}
            />
          ))}
        </div>
      </Section>

      {/* System Reference — super-admin only */}
      {referenceSections.length > 0 && (
        <Section label="SYSTEM REFERENCE">
          <div className="space-y-2.5">
            {referenceSections.map((entry) => (
              <HelpCard
                key={entry.section}
                entry={entry}
                expanded={expanded === entry.section}
                onToggle={() => setExpanded(expanded === entry.section ? null : entry.section)}
                isSuperAdmin={isSuperAdmin}
              />
            ))}
          </div>
        </Section>
      )}

      {sections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No help topics match your search.</p>
        </div>
      )}
    </div>
  );
}

function HelpCard({
  entry,
  expanded,
  onToggle,
  isSuperAdmin,
}: {
  entry: HelpEntry;
  expanded: boolean;
  onToggle: () => void;
  isSuperAdmin: boolean;
}) {
  return (
    <Card className="cursor-pointer hover:border-church-main transition-all" onClick={onToggle}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-church-soft flex items-center justify-center text-lg shrink-0">
          {entry.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{entry.title}</p>
          <p className="text-xs text-gray-500 truncate">{entry.overview.slice(0, 80)}...</p>
        </div>
        <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
          {/* Overview */}
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{entry.overview}</p>

          {/* Steps */}
          {entry.steps.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">How to use</p>
              <ol className="space-y-2">
                {entry.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-church-soft text-church-main flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Technical — super-admin only */}
          {isSuperAdmin && entry.technical && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-bold uppercase">
                  Super-Admin
                </span>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Technical Details</p>
              </div>

              {/* Data Flow */}
              <div className="mb-3">
                <p className="text-[10px] text-gray-500 font-semibold mb-1">Data Flow</p>
                <p className="text-xs text-gray-600 leading-relaxed font-mono bg-gray-50 rounded p-2.5 border border-gray-200">
                  {entry.technical.dataFlow}
                </p>
              </div>

              {/* API Routes */}
              {entry.technical.apiRoutes.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">API Endpoints</p>
                  <div className="space-y-1.5">
                    {entry.technical.apiRoutes.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                          r.method === "GET" ? "bg-green-100 text-green-700" :
                          r.method === "POST" ? "bg-blue-100 text-blue-700" :
                          r.method === "PUT" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {r.method}
                        </span>
                        <code className="text-gray-600 font-mono text-[11px]">{r.path}</code>
                        <span className="text-gray-400 hidden md:inline">— {r.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {entry.technical.collections.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">MongoDB Collections</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.technical.collections.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-[10px] font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {entry.technical.notes && (
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">Notes</p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    {entry.technical.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
