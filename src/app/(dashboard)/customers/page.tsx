"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  Filter,
  Download,
  Sparkles,
} from "lucide-react";

const customers = [
  { id: 1, name: "David Thompson", email: "david@thompson.com", phone: "(416) 555-0123", address: "42 Maple Ave, Toronto", jobs: 3, totalSpent: "$34,750", status: "Active", lastContact: "2 days ago" },
  { id: 2, name: "Sarah Chen", email: "sarah.chen@gmail.com", phone: "(416) 555-0456", address: "18 Oak Dr, Mississauga", jobs: 1, totalSpent: "$6,400", status: "Lead", lastContact: "5 days ago" },
  { id: 3, name: "Riverside Mall Corp", email: "facilities@riverside.com", phone: "(416) 555-0789", address: "200 River Rd, Toronto", jobs: 5, totalSpent: "$128,900", status: "Active", lastContact: "1 day ago" },
  { id: 4, name: "Maria Garcia", email: "m.garcia@email.com", phone: "(905) 555-0234", address: "7 Pine St, Oakville", jobs: 2, totalSpent: "$15,200", status: "Active", lastContact: "1 week ago" },
  { id: 5, name: "Oakwood HOA", email: "board@oakwoodhoa.ca", phone: "(416) 555-0567", address: "Oakwood Community, Toronto", jobs: 4, totalSpent: "$62,300", status: "Active", lastContact: "3 days ago" },
  { id: 6, name: "James Wilson", email: "jwilson@outlook.com", phone: "(905) 555-0890", address: "55 Birch Lane, Burlington", jobs: 0, totalSpent: "$0", status: "Lead", lastContact: "Today" },
  { id: 7, name: "Patel Residence", email: "vpatel@hotmail.com", phone: "(416) 555-0321", address: "120 Cedar Blvd, Scarborough", jobs: 1, totalSpent: "$9,800", status: "Inactive", lastContact: "2 months ago" },
];

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Lead: "bg-info/10 text-info",
  Inactive: "bg-stone-100 text-stone-500",
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Customers</h1>
          <p className="text-sm text-stone-500 mt-0.5">{customers.length} total customers and leads</p>
        </div>
        <div className="flex gap-3">
          <button className="px-3 sm:px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* AI CRM Insight */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">AI Insight: 2 leads haven&apos;t been contacted in 5+ days</p>
            <p className="text-xs text-stone-500">Sarah Chen and James Wilson might need a follow-up. Want me to draft messages?</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors w-full sm:w-auto whitespace-nowrap">
          Draft Messages
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <button className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Customer</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Contact</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Jobs</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Total Spent</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Last Contact</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-charcoal-100 rounded-full flex items-center justify-center text-sm font-semibold text-charcoal-600">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">{customer.name}</p>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {customer.address}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-charcoal-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" /> {customer.email}
                  </p>
                  <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-stone-400" /> {customer.phone}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-sm text-charcoal-700">{customer.jobs}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">{customer.totalSpent}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[customer.status]}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{customer.lastContact}</td>
                <td className="px-3 py-3.5">
                  <button className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
