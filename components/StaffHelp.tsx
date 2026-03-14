"use client";

import { useState, useEffect } from "react";
import { getStaffUser } from "@/lib/staff-auth";
import { getHelpForSection, type HelpEntry } from "@/lib/help-content";

interface StaffHelpProps {
  section: string;
}

export default function StaffHelp({ section }: StaffHelpProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"superadmin" | "admin" | null>(null);
  const [entry, setEntry] = useState<HelpEntry | null>(null);

  useEffect(() => {
    const user = getStaffUser();
    if (user) setRole(user.role);
    const help = getHelpForSection(section);
    if (help) setEntry(help);
  }, [section]);

  if (!entry) return null;

  const isSuperAdmin = role === "superadmin";

  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors text-left w-full"
      >
        <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
          ?
        </span>
        <span className="text-xs font-semibold text-blue-700 flex-1">
          How this works
        </span>
        <span className="text-blue-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-blue-100 bg-white overflow-hidden">
          {/* Overview */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">{entry.overview}</p>
          </div>

          {/* Steps */}
          {entry.steps.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">
                How to use
              </p>
              <ol className="space-y-1.5">
                {entry.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-church-soft text-church-main flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Technical Details — super-admin only */}
          {isSuperAdmin && entry.technical && (
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-bold uppercase">
                  Super-Admin
                </span>
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Technical Details
                </p>
              </div>

              {/* Data Flow */}
              <div className="mb-3">
                <p className="text-[10px] text-gray-500 font-semibold mb-1">Data Flow</p>
                <p className="text-xs text-gray-600 leading-relaxed font-mono bg-white rounded p-2 border border-gray-200">
                  {entry.technical.dataFlow}
                </p>
              </div>

              {/* API Routes */}
              {entry.technical.apiRoutes.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">API Endpoints</p>
                  <div className="space-y-1">
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
    </div>
  );
}
