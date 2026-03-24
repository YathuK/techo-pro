"use client";

import {
  Plus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState } from "react";

const jobs = [
  { id: "JOB-1024", client: "Thompson Residence", type: "Patio Installation", address: "42 Maple Ave, Toronto", status: "In Progress", value: "$12,500", crew: "Team Alpha", startDate: "Mar 18", endDate: "Mar 28", progress: 65, materials: "Techo-Bloc Blu 60 Smooth" },
  { id: "JOB-1023", client: "Riverside Mall", type: "Retaining Wall", address: "200 River Rd, Toronto", status: "Scheduled", value: "$28,900", crew: "Team Bravo", startDate: "Mar 28", endDate: "Apr 15", progress: 0, materials: "Techo-Bloc Mini-Creta" },
  { id: "JOB-1022", client: "Garcia Home", type: "Driveway Pavers", address: "7 Pine St, Oakville", status: "Completed", value: "$8,750", crew: "Team Alpha", startDate: "Mar 10", endDate: "Mar 16", progress: 100, materials: "Techo-Bloc Blu 60 Smooth" },
  { id: "JOB-1021", client: "Oakwood HOA", type: "Walkway & Steps", address: "Oakwood Community, Toronto", status: "In Progress", value: "$15,200", crew: "Team Charlie", startDate: "Mar 20", endDate: "Apr 2", progress: 40, materials: "Techo-Bloc Borealis" },
  { id: "JOB-1020", client: "Chen Property", type: "Fire Pit Area", address: "18 Oak Dr, Mississauga", status: "Quote Sent", value: "$6,400", crew: "Unassigned", startDate: "TBD", endDate: "TBD", progress: 0, materials: "Techo-Bloc Valencia" },
  { id: "JOB-1019", client: "Williams Estate", type: "Pool Deck", address: "88 Lakeshore Blvd, Burlington", status: "Scheduled", value: "$22,300", crew: "Team Alpha", startDate: "Apr 5", endDate: "Apr 18", progress: 0, materials: "Techo-Bloc Travertina Raw" },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-info/10 text-info border-info/20",
  "Scheduled": "bg-warning/10 text-warning border-warning/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Quote Sent": "bg-accent/10 text-accent-dark border-accent/20",
};

const progressColors: Record<string, string> = {
  "In Progress": "bg-info",
  "Scheduled": "bg-warning",
  "Completed": "bg-success",
  "Quote Sent": "bg-accent",
};

export default function JobsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Jobs</h1>
          <p className="text-sm text-stone-500 mt-0.5">Track and manage all your hardscaping projects</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-stone-100 rounded-lg p-0.5">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-white shadow-sm" : ""}`}>
              <LayoutGrid className="w-4 h-4 text-charcoal-700" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-white shadow-sm" : ""}`}>
              <List className="w-4 h-4 text-charcoal-700" />
            </button>
          </div>
          <button className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">AI Optimizer: JOB-1024 is 2 days ahead of schedule</p>
            <p className="text-xs text-stone-500">Team Alpha could start JOB-1019 (Williams Pool Deck) 3 days early. Want me to update the schedule?</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap">
          Optimize Schedule
        </button>
      </div>

      {/* Jobs Grid */}
      <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
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
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> {job.startDate} — {job.endDate}
              </p>
              <p className="text-xs text-stone-600 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-stone-400" /> {job.crew}
              </p>
              <p className="text-xs text-stone-600 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-stone-400" /> {job.materials}
              </p>
            </div>

            {/* Progress Bar */}
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
    </div>
  );
}
