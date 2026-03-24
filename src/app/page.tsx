"use client";

import {
  DollarSign,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const recentJobs = [
  { id: "JOB-1024", client: "Thompson Residence", type: "Patio Installation", status: "In Progress", value: "$12,500", crew: "Team Alpha" },
  { id: "JOB-1023", client: "Riverside Mall", type: "Retaining Wall", status: "Scheduled", value: "$28,900", crew: "Team Bravo" },
  { id: "JOB-1022", client: "Garcia Home", type: "Driveway Pavers", status: "Completed", value: "$8,750", crew: "Team Alpha" },
  { id: "JOB-1021", client: "Oakwood HOA", type: "Walkway & Steps", status: "In Progress", value: "$15,200", crew: "Team Charlie" },
  { id: "JOB-1020", client: "Chen Property", type: "Fire Pit Area", status: "Quote Sent", value: "$6,400", crew: "Unassigned" },
];

const aiInsights = [
  { text: "3 quotes pending over 5 days — follow up to close $47K in pipeline", type: "revenue" },
  { text: "Techo-Bloc Blu 60 Smooth stock running low — reorder 12 pallets", type: "inventory" },
  { text: "Team Bravo has 2 unscheduled days next week — assign Riverside Mall Phase 2", type: "scheduling" },
  { text: "Invoice #INV-892 is 15 days overdue ($8,200) — send payment reminder", type: "collections" },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-info/10 text-info",
  "Scheduled": "bg-warning/10 text-warning",
  "Completed": "bg-success/10 text-success",
  "Quote Sent": "bg-accent/10 text-accent-dark",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Welcome back, Mike. Here&apos;s your business at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 transition-colors">
            This Month
          </button>
          <button className="px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue" value="$124,500" change="+12.5%" trend="up" icon={DollarSign} iconColor="bg-success/10 text-success" />
        <StatCard title="Active Customers" value="48" change="+8.2%" trend="up" icon={Users} iconColor="bg-info/10 text-info" />
        <StatCard title="Active Jobs" value="12" change="+3" trend="up" icon={Briefcase} iconColor="bg-accent/10 text-accent" />
        <StatCard title="Pending Quotes" value="7" change="-2" trend="down" icon={FileText} iconColor="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-charcoal-900">Recent Jobs</h2>
            <a href="/jobs" className="text-sm text-accent hover:text-accent-dark font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-stone-100">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{job.client}</p>
                  <p className="text-xs text-stone-500">{job.id} · {job.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-charcoal-900">{job.value}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status]}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-charcoal-950 to-charcoal-900 rounded-xl p-5 text-cream-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-cream-100">AI Insights</h2>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                {insight.type === "revenue" && <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />}
                {insight.type === "inventory" && <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />}
                {insight.type === "scheduling" && <Clock className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />}
                {insight.type === "collections" && <CheckCircle2 className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />}
                <p className="text-xs leading-relaxed text-charcoal-300">{insight.text}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 bg-accent/20 border border-accent/30 rounded-lg text-sm font-medium text-accent hover:bg-accent/30 transition-colors">
            Get Full AI Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Quote", icon: FileText, href: "/quotes", color: "text-accent" },
          { label: "Add Customer", icon: Users, href: "/customers", color: "text-info" },
          { label: "Create Job", icon: Briefcase, href: "/jobs", color: "text-success" },
          { label: "Send Invoice", icon: DollarSign, href: "/invoices", color: "text-warning" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all group"
          >
            <action.icon className={`w-5 h-5 ${action.color}`} />
            <span className="text-sm font-medium text-charcoal-700 group-hover:text-charcoal-900">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
