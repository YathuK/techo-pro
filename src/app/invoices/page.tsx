"use client";

import {
  Plus,
  Send,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Sparkles,
  Eye,
  MoreHorizontal,
} from "lucide-react";

const invoices = [
  { id: "INV-896", client: "Thompson Residence", project: "Patio Installation", amount: "$12,500", paid: "$3,750", balance: "$8,750", status: "Partial", dueDate: "Apr 5, 2026", sentDate: "Mar 20, 2026" },
  { id: "INV-895", client: "Garcia Home", project: "Driveway Pavers", amount: "$8,750", paid: "$8,750", balance: "$0", status: "Paid", dueDate: "Mar 16, 2026", sentDate: "Mar 10, 2026" },
  { id: "INV-894", client: "Oakwood HOA", project: "Walkway & Steps — Deposit", amount: "$4,560", paid: "$4,560", balance: "$0", status: "Paid", dueDate: "Mar 22, 2026", sentDate: "Mar 18, 2026" },
  { id: "INV-893", client: "Riverside Mall", project: "Retaining Wall — Phase 1", amount: "$28,900", paid: "$28,900", balance: "$0", status: "Paid", dueDate: "Mar 12, 2026", sentDate: "Mar 1, 2026" },
  { id: "INV-892", client: "Patel Residence", project: "Garden Path Repair", amount: "$8,200", paid: "$0", balance: "$8,200", status: "Overdue", dueDate: "Mar 9, 2026", sentDate: "Feb 25, 2026" },
  { id: "INV-891", client: "Williams Estate", project: "Pool Deck — Deposit", amount: "$6,690", paid: "$0", balance: "$6,690", status: "Sent", dueDate: "Mar 30, 2026", sentDate: "Mar 22, 2026" },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Paid: { color: "bg-success/10 text-success", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Partial: { color: "bg-warning/10 text-warning", icon: <Clock className="w-3.5 h-3.5" /> },
  Sent: { color: "bg-info/10 text-info", icon: <Send className="w-3.5 h-3.5" /> },
  Overdue: { color: "bg-danger/10 text-danger", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  Draft: { color: "bg-stone-100 text-stone-500", icon: <Clock className="w-3.5 h-3.5" /> },
};

export default function InvoicesPage() {
  const totalOutstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + parseFloat(i.balance.replace(/[$,]/g, "")), 0);
  const totalOverdue = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((sum, i) => sum + parseFloat(i.balance.replace(/[$,]/g, "")), 0);
  const totalCollected = invoices.reduce(
    (sum, i) => sum + parseFloat(i.paid.replace(/[$,]/g, "")),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Invoices</h1>
          <p className="text-sm text-stone-500 mt-0.5">Create, track, and manage your invoices</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export All
          </button>
          <button className="px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="p-2.5 bg-success/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Collected This Month</p>
            <p className="text-xl font-bold text-charcoal-900">${totalCollected.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="p-2.5 bg-warning/10 rounded-lg">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Outstanding</p>
            <p className="text-xl font-bold text-warning">${totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="p-2.5 bg-danger/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Overdue</p>
            <p className="text-xl font-bold text-danger">${totalOverdue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* AI Collection Insight */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">AI Collection: INV-892 is 15 days overdue ($8,200)</p>
            <p className="text-xs text-stone-500">Patel Residence hasn&apos;t responded to the first reminder. Want me to draft a follow-up?</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap">
          Draft Reminder
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Invoice</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Client</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Project</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Balance</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Due Date</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className={`hover:bg-stone-50 transition-colors ${inv.status === "Overdue" ? "bg-danger/5" : ""}`}>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-semibold text-charcoal-900">{inv.id}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-charcoal-700">{inv.client}</td>
                <td className="px-5 py-3.5 text-sm text-stone-600">{inv.project}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">{inv.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-semibold ${inv.status === "Overdue" ? "text-danger" : inv.status === "Paid" ? "text-success" : "text-charcoal-900"}`}>
                    {inv.balance}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[inv.status].color}`}>
                    {statusConfig[inv.status].icon} {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{inv.dueDate}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4 text-stone-400" />
                    </button>
                    <button className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors" title="More">
                      <MoreHorizontal className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
