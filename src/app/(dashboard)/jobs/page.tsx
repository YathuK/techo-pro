"use client";

import {
  Plus,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  Sparkles,
  Filter,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import SlideDrawer from "@/components/SlideDrawer";

interface Customer {
  id: string;
  name: string;
}

interface Job {
  id: string;
  jobNumber: string;
  type: string;
  address: string | null;
  status: string;
  value: number;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  materials: string | null;
  notes: string | null;
  customer: { id: string; name: string } | null;
  crew: { id: string; name: string; team: string }[];
}

const statusColors: Record<string, string> = {
  "In Progress": "bg-info/10 text-info border-info/20",
  Scheduled: "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-success/10 text-success border-success/20",
  "Quote Sent": "bg-accent/10 text-accent-dark border-accent/20",
};

const statusDotColors: Record<string, string> = {
  "In Progress": "bg-info",
  Scheduled: "bg-warning",
  Completed: "bg-success",
  "Quote Sent": "bg-accent",
};

const progressColors: Record<string, string> = {
  "In Progress": "bg-info",
  Scheduled: "bg-warning",
  Completed: "bg-success",
  "Quote Sent": "bg-accent",
};

const STATUSES = ["Quote Sent", "Scheduled", "In Progress", "Completed"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function CalendarView({
  jobs,
  currentMonth,
  setCurrentMonth,
}: {
  jobs: Job[];
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Map jobs to dates
  const jobsByDate: Record<number, Job[]> = {};
  jobs.forEach((job) => {
    if (!job.startDate) return;
    const start = new Date(job.startDate);
    const end = job.endDate ? new Date(job.endDate) : start;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!jobsByDate[day]) jobsByDate[day] = [];
        if (!jobsByDate[day].find((j) => j.id === job.id)) {
          jobsByDate[day].push(job);
        }
      }
    }
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div key={`empty-${i}`} className="h-24 sm:h-28 bg-stone-50/50" />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;
    const dayJobs = jobsByDate[day] || [];

    days.push(
      <div
        key={day}
        className={`h-24 sm:h-28 border-t border-stone-100 p-1 sm:p-1.5 ${
          isToday ? "bg-accent/5" : "hover:bg-stone-50"
        } transition-colors`}
      >
        <span
          className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
            isToday ? "bg-accent text-white" : "text-charcoal-700"
          }`}
        >
          {day}
        </span>
        <div className="mt-0.5 space-y-0.5 overflow-hidden">
          {dayJobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs truncate cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: `var(--job-bg-${job.status.replace(/\s/g, "")})`,
              }}
              title={`${job.jobNumber}: ${job.customer?.name ?? "No customer"} — ${job.type}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDotColors[job.status] || "bg-stone-400"}`}
              />
              <span className="truncate text-charcoal-800 font-medium">
                {job.customer?.name ?? "No customer"}
              </span>
            </div>
          ))}
          {dayJobs.length > 3 && (
            <span className="text-[10px] text-stone-500 pl-1">
              +{dayJobs.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-stone-100">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-charcoal-700" />
        </button>
        <h2 className="text-sm sm:text-base font-semibold text-charcoal-900">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-charcoal-700" />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-stone-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-stone-500 uppercase py-2"
          >
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">{days}</div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 border-t border-stone-100 bg-stone-50">
        {Object.entries(statusDotColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs text-stone-600">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const initialFormState = {
  customerId: "",
  type: "",
  address: "",
  status: "Quote Sent",
  value: "",
  startDate: "",
  endDate: "",
  materials: "",
  notes: "",
};

export default function JobsPage() {
  const [view, setView] = useState<"grid" | "list" | "calendar">("grid");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchCustomers()]);
      setLoading(false);
    }
    load();
  }, [fetchJobs, fetchCustomers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.customerId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          customerId: form.customerId,
          address: form.address || undefined,
          status: form.status,
          value: form.value ? Number(form.value) : 0,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          materials: form.materials || undefined,
          notes: form.notes || undefined,
        }),
      });
      if (res.ok) {
        setForm(initialFormState);
        setDrawerOpen(false);
        await fetchJobs();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchJobs();
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    "w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";
  const labelClass = "block text-sm font-medium text-charcoal-700 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">
            Jobs
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Track and manage all your hardscaping projects
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <div className="flex bg-stone-100 rounded-lg p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md ${view === "grid" ? "bg-white shadow-sm" : ""}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4 text-charcoal-700" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md ${view === "list" ? "bg-white shadow-sm" : ""}`}
              title="List view"
            >
              <List className="w-4 h-4 text-charcoal-700" />
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`p-1.5 rounded-md ${view === "calendar" ? "bg-white shadow-sm" : ""}`}
              title="Calendar view"
            >
              <CalendarIcon className="w-4 h-4 text-charcoal-700" />
            </button>
          </div>
          <button className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">
              Techo Optimizer: Scheduling insights available
            </p>
            <p className="text-xs text-stone-500">
              Review your current jobs to find optimization opportunities.
            </p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap w-full sm:w-auto">
          Optimize Schedule
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarIcon className="w-12 h-12 text-stone-300 mb-4" />
          <h3 className="text-lg font-semibold text-charcoal-900 mb-1">
            No jobs yet
          </h3>
          <p className="text-sm text-stone-500 mb-4">
            Create your first job to get started.
          </p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      )}

      {/* Calendar View */}
      {!loading && jobs.length > 0 && view === "calendar" && (
        <CalendarView
          jobs={jobs}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      )}

      {/* Jobs Grid/List */}
      {!loading && jobs.length > 0 && (view === "grid" || view === "list") && (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-stone-400">
                      {job.jobNumber}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[job.status] || "bg-stone-100 text-stone-600 border-stone-200"}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-charcoal-900">
                    {job.customer?.name ?? "No customer"}
                  </h3>
                  <p className="text-xs text-stone-500">{job.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-charcoal-900">
                    {formatCurrency(job.value)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job.id);
                    }}
                    disabled={deletingId === job.id}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete job"
                  >
                    {deletingId === job.id ? (
                      <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {job.address && (
                  <p className="text-xs text-stone-600 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />{" "}
                    {job.address}
                  </p>
                )}
                <p className="text-xs text-stone-600 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                  {job.startDate
                    ? new Date(job.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD"}
                  {" — "}
                  {job.endDate
                    ? new Date(job.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD"}
                </p>
                {job.crew && job.crew.length > 0 && (
                  <p className="text-xs text-stone-600 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-stone-400" />{" "}
                    {job.crew.map((c) => c.name).join(", ")}
                  </p>
                )}
                {job.materials && (
                  <p className="text-xs text-stone-600 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-stone-400" />{" "}
                    {job.materials}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-stone-500">Progress</span>
                  <span className="text-xs font-semibold text-charcoal-700">
                    {job.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColors[job.status] || "bg-stone-400"}`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Job Drawer */}
      <SlideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="New Job"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={form.customerId}
              onChange={(e) => updateField("customerId", e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Job Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              className={inputClass}
              placeholder="e.g. Patio Installation"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={inputClass}
              placeholder="e.g. 42 Maple Ave, Toronto"
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Value ($)</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => updateField("value", e.target.value)}
              className={inputClass}
              placeholder="0"
              min="0"
              step="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Materials</label>
            <input
              type="text"
              value={form.materials}
              onChange={(e) => updateField("materials", e.target.value)}
              className={inputClass}
              placeholder="e.g. Techo-Bloc Blu 60 Smooth"
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !form.type || !form.customerId}
              className="w-full px-4 py-2.5 bg-charcoal-900 text-cream-100 rounded-lg text-sm font-medium hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Job
                </>
              )}
            </button>
          </div>
        </form>
      </SlideDrawer>
    </div>
  );
}
