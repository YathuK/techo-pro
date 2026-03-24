"use client";

import {
  Plus,
  Phone,
  Mail,
  Star,
  Clock,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";

const employees = [
  { id: 1, name: "Carlos Rivera", role: "Crew Lead", team: "Team Alpha", phone: "(416) 555-2001", email: "carlos@prohardscaping.com", status: "On Site", rating: 4.9, hoursWeek: 42, certifications: ["Techo-Bloc Certified", "ICPI Level 2"] },
  { id: 2, name: "Jake Morrison", role: "Crew Lead", team: "Team Bravo", phone: "(416) 555-2002", email: "jake@prohardscaping.com", status: "On Site", rating: 4.7, hoursWeek: 40, certifications: ["Techo-Bloc Certified", "NCMA Certified"] },
  { id: 3, name: "Amir Hassan", role: "Crew Lead", team: "Team Charlie", phone: "(416) 555-2003", email: "amir@prohardscaping.com", status: "Available", rating: 4.8, hoursWeek: 38, certifications: ["Techo-Bloc Certified"] },
  { id: 4, name: "Tommy Nguyen", role: "Installer", team: "Team Alpha", phone: "(416) 555-2004", email: "tommy@prohardscaping.com", status: "On Site", rating: 4.6, hoursWeek: 44, certifications: ["ICPI Level 1"] },
  { id: 5, name: "Ryan O'Brien", role: "Installer", team: "Team Bravo", phone: "(416) 555-2005", email: "ryan@prohardscaping.com", status: "Day Off", rating: 4.5, hoursWeek: 0, certifications: [] },
  { id: 6, name: "Marcus Johnson", role: "Equipment Operator", team: "Shared", phone: "(416) 555-2006", email: "marcus@prohardscaping.com", status: "Available", rating: 4.8, hoursWeek: 36, certifications: ["Heavy Equipment License"] },
  { id: 7, name: "Diana Petrov", role: "Office Manager", team: "Office", phone: "(416) 555-2007", email: "diana@prohardscaping.com", status: "In Office", rating: 5.0, hoursWeek: 40, certifications: [] },
  { id: 8, name: "Sam Williams", role: "Installer", team: "Team Charlie", phone: "(416) 555-2008", email: "sam@prohardscaping.com", status: "On Site", rating: 4.4, hoursWeek: 41, certifications: [] },
];

const statusColors: Record<string, string> = {
  "On Site": "bg-success/10 text-success",
  "Available": "bg-info/10 text-info",
  "Day Off": "bg-stone-100 text-stone-500",
  "In Office": "bg-accent/10 text-accent-dark",
};

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Employees</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage your crews and team members</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* AI Scheduling Insight */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">AI Scheduling: Team Bravo has 2 unscheduled days next week</p>
            <p className="text-xs text-stone-500">Recommend assigning Riverside Mall Phase 2 (starts Mar 28). Jake&apos;s crew has retaining wall experience.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap w-full sm:w-auto">
          Auto-Schedule
        </button>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { team: "Team Alpha", members: 2, status: "On Site — Thompson Residence", color: "border-l-success" },
          { team: "Team Bravo", members: 2, status: "On Site — Riverside Mall", color: "border-l-info" },
          { team: "Team Charlie", members: 2, status: "On Site — Oakwood HOA", color: "border-l-accent" },
          { team: "Office", members: 1, status: "In Office", color: "border-l-warning" },
        ].map((team) => (
          <div key={team.team} className={`bg-white rounded-xl border border-stone-200 border-l-4 ${team.color} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-charcoal-900">{team.team}</h3>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <Users className="w-3.5 h-3.5" /> {team.members}
              </div>
            </div>
            <p className="text-xs text-stone-500">{team.status}</p>
          </div>
        ))}
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-charcoal-100 rounded-full flex items-center justify-center text-sm font-bold text-charcoal-600">
                  {emp.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{emp.name}</p>
                  <p className="text-xs text-stone-500">{emp.role} · {emp.team}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[emp.status]}`}>
                {emp.status}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              <p className="text-xs text-stone-600 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400" /> {emp.phone}
              </p>
              <p className="text-xs text-stone-600 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> {emp.email}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-xs font-medium text-charcoal-700">{emp.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <Clock className="w-3.5 h-3.5" /> {emp.hoursWeek}h/week
              </div>
              {emp.certifications.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-accent">
                  <Shield className="w-3.5 h-3.5" /> {emp.certifications.length} cert{emp.certifications.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
