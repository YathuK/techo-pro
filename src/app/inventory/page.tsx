"use client";

import {
  Package,
  AlertTriangle,
  TrendingDown,
  Plus,
  Search,
  Sparkles,
  ArrowDown,
  ArrowUp,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const inventory = [
  { id: 1, name: "Techo-Bloc Blu 60 Smooth (Charcoal)", category: "Pavers", unit: "sq ft", inStock: 1240, reorderPoint: 500, price: 9.0, location: "Yard A", trend: "down", usage: "High" },
  { id: 2, name: "Techo-Bloc Blu 60 Smooth (Shale Grey)", category: "Pavers", unit: "sq ft", inStock: 860, reorderPoint: 500, price: 9.0, location: "Yard A", trend: "stable", usage: "Medium" },
  { id: 3, name: "Techo-Bloc Mini-Creta (Shale Grey)", category: "Walls", unit: "lin ft", inStock: 180, reorderPoint: 200, price: 35.0, location: "Yard B", trend: "down", usage: "High" },
  { id: 4, name: "Techo-Bloc Borealis (Smoked Pine)", category: "Pavers", unit: "sq ft", inStock: 640, reorderPoint: 300, price: 12.5, location: "Yard A", trend: "up", usage: "Medium" },
  { id: 5, name: "Techo-Bloc Valencia (Desert)", category: "Pavers", unit: "sq ft", inStock: 420, reorderPoint: 200, price: 14.0, location: "Yard A", trend: "stable", usage: "Low" },
  { id: 6, name: "Techo-Bloc Travertina Raw (Ivory)", category: "Pavers", unit: "sq ft", inStock: 780, reorderPoint: 400, price: 16.0, location: "Yard B", trend: "down", usage: "High" },
  { id: 7, name: "Polymeric Sand (HP Nextgel)", category: "Supplies", unit: "bags", inStock: 24, reorderPoint: 20, price: 40.0, location: "Warehouse", trend: "down", usage: "High" },
  { id: 8, name: "Crushed Gravel Base 3/4\"", category: "Base Material", unit: "tons", inStock: 45, reorderPoint: 20, price: 70.0, location: "Yard C", trend: "down", usage: "High" },
  { id: 9, name: "Geotextile Fabric", category: "Supplies", unit: "sq ft", inStock: 2400, reorderPoint: 1000, price: 0.35, location: "Warehouse", trend: "stable", usage: "Medium" },
  { id: 10, name: "Edge Restraint (Snap Edge)", category: "Supplies", unit: "pcs", inStock: 86, reorderPoint: 50, price: 12.0, location: "Warehouse", trend: "stable", usage: "Medium" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const lowStock = inventory.filter((i) => i.inStock <= i.reorderPoint);
  const totalValue = inventory.reduce((sum, i) => sum + i.inStock * i.price, 0);
  const filtered = inventory.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Inventory</h1>
          <p className="text-sm text-stone-500 mt-0.5">Track materials, supplies, and stock levels</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Usage Report
          </button>
          <button className="px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="p-2.5 bg-accent/10 rounded-lg">
            <Package className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Total Items</p>
            <p className="text-xl font-bold text-charcoal-900">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="p-2.5 bg-danger/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Low Stock Alerts</p>
            <p className="text-xl font-bold text-danger">{lowStock.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="p-2.5 bg-success/10 rounded-lg">
            <TrendingDown className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Total Inventory Value</p>
            <p className="text-xl font-bold text-charcoal-900">${totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* AI Alert */}
      {lowStock.length > 0 && (
        <div className="bg-gradient-to-r from-danger/5 to-warning/5 border border-danger/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-medium text-charcoal-900">
                AI Alert: {lowStock.length} item{lowStock.length > 1 ? "s" : ""} below reorder point
              </p>
              <p className="text-xs text-stone-500">
                {lowStock.map((i) => i.name.split("(")[0].trim()).join(", ")} — AI can auto-generate purchase orders
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap">
            Auto-Reorder
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Item</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Category</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">In Stock</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Reorder At</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Unit Price</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Value</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Location</th>
              <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((item) => (
              <tr key={item.id} className={`hover:bg-stone-50 transition-colors ${item.inStock <= item.reorderPoint ? "bg-danger/5" : ""}`}>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-charcoal-900">{item.name}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-stone-600">{item.category}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-semibold ${item.inStock <= item.reorderPoint ? "text-danger" : "text-charcoal-900"}`}>
                    {item.inStock.toLocaleString()} {item.unit}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{item.reorderPoint} {item.unit}</td>
                <td className="px-5 py-3.5 text-sm text-charcoal-700">${item.price.toFixed(2)}/{item.unit}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-charcoal-900">${(item.inStock * item.price).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-sm text-stone-600">{item.location}</td>
                <td className="px-5 py-3.5">
                  {item.trend === "down" && <ArrowDown className="w-4 h-4 text-danger" />}
                  {item.trend === "up" && <ArrowUp className="w-4 h-4 text-success" />}
                  {item.trend === "stable" && <span className="text-xs text-stone-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
