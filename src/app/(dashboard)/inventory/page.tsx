"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, AlertTriangle, Plus, Sparkles, Loader2, Trash2, BarChart3 } from "lucide-react";
import SlideDrawer from "@/components/SlideDrawer";

interface InventoryItem { id: string; name: string; category: string; unit: string; inStock: number; reorderPoint: number; price: number; location: string | null; }

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Pavers", unit: "sq ft", inStock: "", reorderPoint: "", price: "", location: "" });

  const fetchItems = useCallback(async () => { const res = await fetch("/api/inventory"); if (res.ok) setItems(await res.json()); setLoading(false); }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, inStock: Number(form.inStock) || 0, reorderPoint: Number(form.reorderPoint) || 0, price: Number(form.price) || 0 }) });
    if (res.ok) { setShowAdd(false); setForm({ name: "", category: "Pavers", unit: "sq ft", inStock: "", reorderPoint: "", price: "", location: "" }); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/inventory/${id}`, { method: "DELETE" }); fetchItems(); };

  const lowStock = items.filter((i) => i.inStock <= i.reorderPoint);
  const totalValue = items.reduce((s, i) => s + i.inStock * i.price, 0);
  const filtered = items;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Inventory</h1><p className="text-sm text-stone-500 mt-0.5">{items.length} items</p></div>
        <div className="flex gap-3">
          <button className="px-3 sm:px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Report</span></button>
          <button onClick={() => setShowAdd(true)} className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Item</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"><div className="p-2.5 bg-accent/10 rounded-lg"><Package className="w-5 h-5 text-accent" /></div><div><p className="text-xs text-stone-500">Total Items</p><p className="text-xl font-bold text-charcoal-900">{items.length}</p></div></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"><div className="p-2.5 bg-danger/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-danger" /></div><div><p className="text-xs text-stone-500">Low Stock</p><p className="text-xl font-bold text-danger">{lowStock.length}</p></div></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"><div className="p-2.5 bg-success/10 rounded-lg"><Package className="w-5 h-5 text-success" /></div><div><p className="text-xs text-stone-500">Total Value</p><p className="text-xl font-bold text-charcoal-900">${totalValue.toLocaleString()}</p></div></div>
      </div>


      {loading ? (<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (<div className="text-center py-20"><Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" /><p className="text-sm font-medium text-stone-500">{items.length === 0 ? "No items yet" : "No matches"}</p></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-stone-200">
            <table className="w-full min-w-[800px]">
              <thead><tr className="border-b border-stone-100 bg-stone-50">
                {["Item","Category","In Stock","Reorder At","Unit Price","Value","Location",""].map((h) => <th key={h} className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-stone-100">{filtered.map((item) => (
                <tr key={item.id} className={`hover:bg-stone-50 ${item.inStock <= item.reorderPoint ? "bg-danger/5" : ""}`}>
                  <td className="px-5 py-3.5 text-sm font-medium text-charcoal-900">{item.name}</td>
                  <td className="px-5 py-3.5 text-sm text-stone-600">{item.category}</td>
                  <td className="px-5 py-3.5"><span className={`text-sm font-semibold ${item.inStock <= item.reorderPoint ? "text-danger" : "text-charcoal-900"}`}>{item.inStock.toLocaleString()} {item.unit}</span></td>
                  <td className="px-5 py-3.5 text-sm text-stone-500">{item.reorderPoint} {item.unit}</td>
                  <td className="px-5 py-3.5 text-sm text-charcoal-700">${item.price.toFixed(2)}/{item.unit}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-charcoal-900">${(item.inStock * item.price).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-stone-600">{item.location || "—"}</td>
                  <td className="px-3 py-3.5"><button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-stone-400 hover:text-danger" /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className={`bg-white rounded-xl border p-4 ${item.inStock <= item.reorderPoint ? "border-danger/30 bg-danger/5" : "border-stone-200"}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-charcoal-900 truncate">{item.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-600 rounded-full">{item.category}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-stone-500">In Stock</p>
                    <p className={`text-sm font-semibold ${item.inStock <= item.reorderPoint ? "text-danger" : "text-charcoal-900"}`}>{item.inStock.toLocaleString()} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Reorder At</p>
                    <p className="text-sm text-stone-600">{item.reorderPoint} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Unit Price</p>
                    <p className="text-sm text-charcoal-700">${item.price.toFixed(2)}/{item.unit}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-500">{item.location || "No location"}</span>
                  <span className="text-sm font-medium text-charcoal-900">${(item.inStock * item.price).toLocaleString()}</span>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-stone-400 hover:text-danger" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <SlideDrawer open={showAdd} onClose={() => setShowAdd(false)} title="Add Inventory Item">
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Item Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Techo-Bloc Blu 60 Smooth" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"><option>Pavers</option><option>Walls</option><option>Supplies</option><option>Base Material</option></select></div>
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Unit</label><select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"><option>sq ft</option><option>lin ft</option><option>bags</option><option>tons</option><option>pcs</option></select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">In Stock</label><input type="number" value={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.value })} placeholder="0" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Reorder At</label><input type="number" value={form.reorderPoint} onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })} placeholder="0" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
            <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Price $</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          </div>
          <div><label className="text-sm font-medium text-charcoal-700 mb-1 block">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Yard A" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 disabled:opacity-50 flex items-center justify-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{saving ? "Adding..." : "Add Item"}</button>
          </div>
        </form>
      </SlideDrawer>
    </div>
  );
}
