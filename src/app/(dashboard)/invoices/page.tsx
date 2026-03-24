"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Send, Download, CheckCircle2, Clock, AlertCircle, DollarSign, Sparkles, Loader2, Trash2 } from "lucide-react";
import SlideDrawer from "@/components/SlideDrawer";

interface Invoice { id: string; invoiceNumber: string; project: string | null; amount: number; paid: number; status: string; dueDate: string | null; customer: { id: string; name: string }; }
interface Customer { id: string; name: string; }

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Paid: { color: "bg-success/10 text-success", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Partial: { color: "bg-warning/10 text-warning", icon: <Clock className="w-3.5 h-3.5" /> },
  Sent: { color: "bg-info/10 text-info", icon: <Send className="w-3.5 h-3.5" /> },
  Overdue: { color: "bg-danger/10 text-danger", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  Draft: { color: "bg-stone-100 text-stone-500", icon: <Clock className="w-3.5 h-3.5" /> },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerId: "", project: "", amount: "", status: "Draft", dueDate: "" });

  const fetchData = useCallback(async () => {
    const [i, c] = await Promise.all([fetch("/api/invoices"), fetch("/api/customers")]);
    if (i.ok) setInvoices(await i.json());
    if (c.ok) setCustomers(await c.json());
    setLoading(false);
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch("/api/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: Number(form.amount) || 0, dueDate: form.dueDate || undefined }) });
    if (res.ok) { setShowAdd(false); setForm({ customerId: "", project: "", amount: "", status: "Draft", dueDate: "" }); fetchData(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/invoices/${id}`, { method: "DELETE" }); fetchData(); };

  const totalOutstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + (i.amount - i.paid), 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + (i.amount - i.paid), 0);
  const totalCollected = invoices.reduce((s, i) => s + i.paid, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Invoices</h1><p className="text-sm text-stone-500 mt-0.5">{invoices.length} invoices</p></div>
        <div className="flex gap-3">
          <button className="px-3 sm:px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2"><Download className="w-4 h-4" /><span className="hidden sm:inline">Export</span></button>
          <button onClick={() => setShowAdd(true)} className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2"><Plus className="w-4 h-4" /> New Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"><div className="p-2.5 bg-success/10 rounded-lg"><DollarSign className="w-5 h-5 text-success" /></div><div><p className="text-xs text-stone-500">Collected</p><p className="text-xl font-bold text-charcoal-900">${totalCollected.toLocaleString()}</p></div></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"><div className="p-2.5 bg-warning/10 rounded-lg"><Clock className="w-5 h-5 text-warning" /></div><div><p className="text-xs text-stone-500">Outstanding</p><p className="text-xl font-bold text-warning">${totalOutstanding.toLocaleString()}</p></div></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"><div className="p-2.5 bg-danger/10 rounded-lg"><AlertCircle className="w-5 h-5 text-danger" /></div><div><p className="text-xs text-stone-500">Overdue</p><p className="text-xl font-bold text-danger">${totalOverdue.toLocaleString()}</p></div></div>
      </div>

      {loading ? (<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
      ) : invoices.length === 0 ? (<div className="text-center py-20"><Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" /><p className="text-sm font-medium text-stone-500">No invoices yet</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead><tr className="border-b border-stone-100 bg-stone-50">
              {["Invoice","Client","Amount","Balance","Status","Due",""].map((h) => <th key={h} className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-stone-100">{invoices.map((inv) => {
              const sc = statusConfig[inv.status] || statusConfig.Draft;
              return (<tr key={inv.id} className={`hover:bg-stone-50 ${inv.status === "Overdue" ? "bg-danger/5" : ""}`}>
                <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">{inv.invoiceNumber}</td>
                <td className="px-5 py-3.5 text-sm text-charcoal-700">{inv.customer?.name}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">${inv.amount.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">${(inv.amount - inv.paid).toLocaleString()}</td>
                <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>{sc.icon} {inv.status}</span></td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                <td className="px-3 py-3.5"><button onClick={() => handleDelete(inv.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-stone-400 hover:text-danger" /></button></td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      )}

      <SlideDrawer open={showAdd} onClose={() => setShowAdd(false)} title="New Invoice">
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Customer *</label><select required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"><option value="">Select...</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Project</label><input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Patio Installation" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Amount *</label><input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          </div>
          <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"><option>Draft</option><option>Sent</option><option>Partial</option><option>Paid</option><option>Overdue</option></select></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 disabled:opacity-50 flex items-center justify-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{saving ? "Creating..." : "Create Invoice"}</button>
          </div>
        </form>
      </SlideDrawer>
    </div>
  );
}
