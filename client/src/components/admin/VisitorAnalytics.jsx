import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Download, ChevronLeft, ChevronRight, Globe, Monitor,
  Smartphone, MapPin, Users, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

function getDeviceIcon(device) {
  if (device === "Mobile" || device === "Tablet") return Smartphone;
  return Monitor;
}

function exportCSV(visitors) {
  const headers = ["Email", "Name", "Country", "Browser", "Device", "OS", "IP", "First Visit", "Last Visit", "Visits"];
  const rows = visitors.map(v => [
    v.email || "", v.name || "", v.country || "", v.browser || "",
    v.device || "", v.os || "", v.visitor_ip || "",
    v.created_date ? new Date(v.created_date).toLocaleString() : "",
    v.updated_date ? new Date(v.updated_date).toLocaleString() : "",
    v.visit_count || 1
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function VisitorAnalytics({ visitors }) {
  const [search, setSearch] = useState("");
  const [filterBrowser, setFilterBrowser] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const browsers = useMemo(() => [...new Set(visitors.map(v => v.browser).filter(Boolean))], [visitors]);
  const countries = useMemo(() => [...new Set(visitors.map(v => v.country).filter(Boolean))], [visitors]);

  const filtered = useMemo(() => {
    return visitors.filter(v => {
      const searchLower = search.toLowerCase();
      const matchesSearch = !search ||
        (v.email || "").toLowerCase().includes(searchLower) ||
        (v.name || "").toLowerCase().includes(searchLower) ||
        (v.visitor_ip || "").toLowerCase().includes(searchLower);
      const matchesBrowser = filterBrowser === "all" || v.browser === filterBrowser;
      const matchesCountry = filterCountry === "all" || v.country === filterCountry;
      return matchesSearch && matchesBrowser && matchesCountry;
    });
  }, [visitors, search, filterBrowser, filterCountry]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: visitors.length,
    unique: new Set(visitors.map(v => v.visitor_ip)).size,
    countries: new Set(visitors.map(v => v.country).filter(c => c && c !== "unknown")).size,
  }), [visitors]);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Total Visits", value: stats.total },
          { icon: Globe, label: "Unique Visitors", value: stats.unique },
          { icon: MapPin, label: "Countries", value: stats.countries },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 border border-border flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by email, name, or IP..."
            className="pl-10"
          />
        </div>
        <Select value={filterBrowser} onValueChange={(v) => { setFilterBrowser(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Browser" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Browsers</SelectItem>
            {browsers.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCountry} onValueChange={(v) => { setFilterCountry(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => exportCSV(filtered)} variant="outline" className="shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email / Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Browser</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Device / OS</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">First Visit</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Visit</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Visits</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No visitors found</td></tr>
              ) : paginated.map((v, i) => {
                const DeviceIcon = getDeviceIcon(v.device);
                return (
                  <tr key={v.id || i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{v.email || v.visitor_ip || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{v.name || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{v.country || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.browser || "—"}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <DeviceIcon className="w-3.5 h-3.5" />
                        {v.device || "—"} / {v.os || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {v.created_date ? new Date(v.created_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {v.updated_date ? new Date(v.updated_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {v.visit_count || 1}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1.5 text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}