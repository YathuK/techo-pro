"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Phone, Mail, Star, Clock, Shield, Sparkles, Loader2, Trash2 } from "lucide-react";
import SlideDrawer from "@/components/SlideDrawer";

interface Employee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  team: string | null;
  status: string;
  rating: number;
  hoursPerWeek: number;
  certifications: string | null;
}

const statusColors: Record<string, string> = {
  "On Site": "bg-success/10 text-success",
  "Available": "bg-info/10 text-info",
  "Day Off": "bg-stone-100 text-stone-500",
  "In Office": "bg-accent/10 text-accent-dark",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Installer", team: "", status: "Available" });

  const fetchEmployees = useCallback(async () => {
    const res = await fetch("/api/employees");
    if (res.ok) setEmployees(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ name: "", email: "", phone: "", role: "Installer", team: "", status: "Available" });
      fetchEmployees();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Employees</h1>
          <p className="text-sm text-stone-500 mt-0.5">{employees.length} team members</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
      ) : employees.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-500">No employees yet</p>
          <p className="text-xs text-stone-400 mt-1">Add your first team member</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const certs = emp.certifications ? (() => { try { return JSON.parse(emp.certifications!); } catch { return []; } })() : [];
            return (
              <div key={emp.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-charcoal-100 rounded-full flex items-center justify-center text-sm font-bold text-charcoal-600">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{emp.name}</p>
                      <p className="text-xs text-stone-500">{emp.role}{emp.team ? ` · ${emp.team}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[emp.status] || statusColors.Available}`}>
                      {emp.status}
                    </span>
                    <button onClick={() => handleDelete(emp.id)} className="p-1 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5 text-stone-400 hover:text-danger" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {emp.phone && <p className="text-xs text-stone-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400" /> {emp.phone}</p>}
                  {emp.email && <p className="text-xs text-stone-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400" /> {emp.email}</p>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  {emp.rating > 0 && <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-warning fill-warning" /><span className="text-xs font-medium text-charcoal-700">{emp.rating}</span></div>}
                  {emp.hoursPerWeek > 0 && <div className="flex items-center gap-1 text-xs text-stone-500"><Clock className="w-3.5 h-3.5" /> {emp.hoursPerWeek}h/week</div>}
                  {certs.length > 0 && <div className="flex items-center gap-1 text-xs text-accent"><Shield className="w-3.5 h-3.5" /> {certs.length} cert{certs.length > 1 ? "s" : ""}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SlideDrawer open={showAdd} onClose={() => setShowAdd(false)} title="Add Employee">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-charcoal-700 mb-1 block">Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Carlos Rivera" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-charcoal-700 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal-700 mb-1 block">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-charcoal-700 mb-1 block">Role *</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option>Crew Lead</option><option>Installer</option><option>Equipment Operator</option><option>Office Manager</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal-700 mb-1 block">Team</label>
              <input value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Team Alpha" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal-700 mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option>Available</option><option>On Site</option><option>Day Off</option><option>In Office</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </SlideDrawer>
    </div>
  );
}
