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
} from "lucide-react";
import { useState } from "react";

const jobs = [
  { id: "JOB-1024", client: "Thompson Residence", type: "Patio Installation", address: "42 Maple Ave, Toronto", status: "In Progress", value: "$12,500", crew: "Team Alpha", startDate: "2026-03-18", endDate: "2026-03-28", progress: 65, materials: "Techo-Bloc Blu 60 Smooth" },
  { id: "JOB-1023", client: "Riverside Mall", type: "Retaining Wall", address: "200 River Rd, Toronto", status: "Scheduled", value: "$28,900", crew: "Team Bravo", startDate: "2026-03-28", endDate: "2026-04-15", progress: 0, materials: "Techo-Bloc Mini-Creta" },
  { id: "JOB-1022", client: "Garcia Home", type: "Driveway Pavers", address: "7 Pine St, Oakville", status: "Completed", value: "$8,750", crew: "Team Alpha", startDate: "2026-03-10", endDate: "2026-03-16", progress: 100, materials: "Techo-Bloc Blu 60 Smooth" },
  { id: "JOB-1021", client: "Oakwood HOA", type: "Walkway & Steps", address: "Oakwood Community, Toronto", status: "In Progress", value: "$15,200", crew: "Team Charlie", startDate: "2026-03-20", endDate: "2026-04-02", progress: 40, materials: "Techo-Bloc Borealis" },
  { id: "JOB-1020", client: "Chen Property", type: "Fire Pit Area", address: "18 Oak Dr, Mississauga", status: "Quote Sent", value: "$6,400", crew: "Unassigned", startDate: "", endDate: "", progress: 0, materials: "Techo-Bloc Valencia" },
  { id: "JOB-1019", client: "Williams Estate", type: "Pool Deck", address: "88 Lakeshore Blvd, Burlington", status: "Scheduled", value: "$22,300", crew: "Team Alpha", startDate: "2026-04-05", endDate: "2026-04-18", progress: 0, materials: "Techo-Bloc Travertina Raw" },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-info/10 text-info border-info/20",
  "Scheduled": "bg-warning/10 text-warning border-warning/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Quote Sent": "bg-accent/10 text-accent-dark border-accent/20",
};

const statusDotColors: Record<string, string> = {
  "In Progress": "bg-info",
  "Scheduled": "bg-warning",
  "Completed": "bg-success",
  "Quote Sent": "bg-accent",
};

const progressColors: Record<string, string> = {
  "In Progress": "bg-info",
  "Scheduled": "bg-warning",
  "Completed": "bg-success",
  "Quote Sent": "bg-accent",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function CalendarView({ currentMonth, setCurrentMonth }: { currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Map jobs to dates
  const jobsByDate: Record<number, typeof jobs> = {};
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
  // Empty cells for days before the first
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-28 bg-stone-50/50" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
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
              style={{ backgroundColor: `var(--job-bg-${job.status.replace(/\s/g, "")})` }}
              title={`${job.id}: ${job.client} — ${job.type}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDotColors[job.status]}`} />
              <span className="truncate text-charcoal-800 font-medium">{job.client}</span>
            </div>
          ))}
          {dayJobs.length > 3 && (
            <span className="text-[10px] text-stone-500 pl-1">+{dayJobs.length - 3} more</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-100">
        <button onClick={prevMonth} className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-charcoal-700" />
        </button>
        <h2 className="text-sm sm:text-base font-semibold text-charcoal-900">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={nextMonth} className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-charcoal-700" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-stone-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-stone-500 uppercase py-2">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">{days}</div>

      {/* Legend */}
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

export default function JobsPage() {
  const [view, setView] = useState<"grid" | "list" | "calendar">("grid");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Jobs</h1>
          <p className="text-sm text-stone-500 mt-0.5">Track and manage all your hardscaping projects</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <div className="flex bg-stone-100 rounded-lg p-0.5">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-white shadow-sm" : ""}`} title="Grid view">
              <LayoutGrid className="w-4 h-4 text-charcoal-700" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-white shadow-sm" : ""}`} title="List view">
              <List className="w-4 h-4 text-charcoal-700" />
            </button>
            <button onClick={() => setView("calendar")} className={`p-1.5 rounded-md ${view === "calendar" ? "bg-white shadow-sm" : ""}`} title="Calendar view">
              <CalendarIcon className="w-4 h-4 text-charcoal-700" />
            </button>
          </div>
          <button className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">AI Optimizer: JOB-1024 is 2 days ahead of schedule</p>
            <p className="text-xs text-stone-500">Team Alpha could start JOB-1019 (Williams Pool Deck) 3 days early. Want me to update the schedule?</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap w-full sm:w-auto">
          Optimize Schedule
        </button>
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <CalendarView currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      )}

      {/* Jobs Grid/List */}
      {(view === "grid" || view === "list") && (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-stone-400">{job.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-charcoal-900">{job.client}</h3>
                  <p className="text-xs text-stone-500">{job.type}</p>
                </div>
                <span className="text-lg font-bold text-charcoal-900">{job.value}</span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-stone-600 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> {job.address}
                </p>
                <p className="text-xs text-stone-600 flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                  {job.startDate ? new Date(job.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                  {" — "}
                  {job.endDate ? new Date(job.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                </p>
                <p className="text-xs text-stone-600 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-stone-400" /> {job.crew}
                </p>
                <p className="text-xs text-stone-600 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-stone-400" /> {job.materials}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-stone-500">Progress</span>
                  <span className="text-xs font-semibold text-charcoal-700">{job.progress}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressColors[job.status]}`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
