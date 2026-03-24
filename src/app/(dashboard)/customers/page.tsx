"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Phone,
  Mail,
  MapPin,
  Download,
  Sparkles,
  Trash2,
  MessageSquare,
  FileText,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Send,
  User,
} from "lucide-react";
import SlideDrawer from "@/components/SlideDrawer";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  notes: string | null;
  jobCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Lead: "bg-info/10 text-info",
  Inactive: "bg-stone-100 text-stone-500",
};

const templates = [
  { id: "quote-follow", label: "Quote Follow-Up", desc: "Remind about a pending quote" },
  { id: "job-complete", label: "Job Completion", desc: "Notify project is done" },
  { id: "schedule-confirm", label: "Schedule Confirm", desc: "Confirm upcoming dates" },
  { id: "payment-reminder", label: "Payment Reminder", desc: "Overdue invoice nudge" },
  { id: "seasonal-promo", label: "Seasonal Promo", desc: "Seasonal hardscaping deals" },
  { id: "review-request", label: "Review Request", desc: "Ask for a Google review" },
  { id: "referral-ask", label: "Referral Request", desc: "Ask for referrals" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function timeAgo(dateStr: string) {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", status: "Lead", notes: "" });

  // Quote drawer state
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
  const [quoteCustomer, setQuoteCustomer] = useState<Customer | null>(null);
  const [quoteDesc, setQuoteDesc] = useState("");
  const [quoteMarkup, setQuoteMarkup] = useState(35);
  const [quoteGenerating, setQuoteGenerating] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<{ content: string; value: number; quoteNumber: string } | null>(null);
  const [quoteCopied, setQuoteCopied] = useState(false);

  // Message drawer state
  const [msgDrawerOpen, setMsgDrawerOpen] = useState(false);
  const [msgCustomer, setMsgCustomer] = useState<Customer | null>(null);
  const [msgTemplate, setMsgTemplate] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"email" | "text">("email");
  const [msgContent, setMsgContent] = useState<{ subject: string | null; content: string } | null>(null);
  const [msgLoading, setMsgLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) setCustomers(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setDrawerOpen(false); setFormData({ name: "", email: "", phone: "", address: "", status: "Lead", notes: "" }); fetchCustomers(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try { const res = await fetch(`/api/customers/${id}`, { method: "DELETE" }); if (res.ok) setCustomers((p) => p.filter((c) => c.id !== id)); }
    catch (err) { console.error(err); }
  };

  const openQuoteDrawer = (customer: Customer) => {
    setQuoteCustomer(customer);
    setQuoteDesc("");
    setGeneratedQuote(null);
    setQuoteDrawerOpen(true);
  };

  const handleGenerateQuote = async () => {
    if (!quoteCustomer || !quoteDesc.trim()) return;
    setQuoteGenerating(true);
    setGeneratedQuote(null);
    try {
      const res = await fetch("/api/ai/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: quoteCustomer.id, description: quoteDesc, markup: quoteMarkup }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedQuote({ content: data.content, value: data.value, quoteNumber: data.quoteNumber });
      }
    } catch (err) { console.error(err); }
    finally { setQuoteGenerating(false); }
  };

  const handleCopyQuote = () => {
    if (!generatedQuote) return;
    navigator.clipboard.writeText(generatedQuote.content);
    setQuoteCopied(true);
    setTimeout(() => setQuoteCopied(false), 2000);
  };

  const openMessageDrawer = (customer: Customer) => {
    setMsgCustomer(customer);
    setMsgTemplate(null);
    setMsgContent(null);
    setMsgDrawerOpen(true);
  };

  const generateMessage = async (templateId: string) => {
    if (!msgCustomer) return;
    setMsgTemplate(templateId);
    setMsgLoading(true);
    setMsgContent(null);
    try {
      const res = await fetch("/api/ai/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: msgCustomer.id, template: templateId, type: msgType }),
      });
      if (res.ok) {
        const data = await res.json();
        setMsgContent({ subject: data.subject, content: data.content });
      }
    } catch (err) { console.error(err); }
    finally { setMsgLoading(false); }
  };

  const handleCopy = () => {
    if (!msgContent) return;
    const text = msgContent.subject ? `Subject: ${msgContent.subject}\n\n${msgContent.content}` : msgContent.content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => { if (msgTemplate) generateMessage(msgTemplate); };

  // When switching email/text, regenerate if template is selected
  const switchMsgType = (type: "email" | "text") => {
    setMsgType(type);
    if (msgTemplate) {
      setMsgLoading(true);
      setMsgContent(null);
      fetch("/api/ai/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: msgCustomer?.id, template: msgTemplate, type }),
      }).then(r => r.ok ? r.json() : null).then(data => {
        if (data) setMsgContent({ subject: data.subject, content: data.content });
      }).finally(() => setMsgLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Customers</h1>
          <p className="text-sm text-stone-500 mt-0.5">{customers.length} total customer{customers.length !== 1 ? "s" : ""} and leads</p>
        </div>
        <div className="flex gap-3">
          <button className="px-3 sm:px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => setDrawerOpen(true)} className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-stone-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><p className="text-sm text-stone-500">No customers yet. Add your first customer.</p></div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Contact</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Jobs</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Total Spent</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Last Contact</th>
                <th className="text-right text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-charcoal-100 rounded-full flex items-center justify-center text-sm font-semibold text-charcoal-600">{customer.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-charcoal-900">{customer.name}</p>
                        {customer.address && <p className="text-xs text-stone-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {customer.address}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {customer.email && <p className="text-sm text-charcoal-700 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-stone-400" /> {customer.email}</p>}
                    {customer.phone && <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5"><Phone className="w-3 h-3 text-stone-400" /> {customer.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-charcoal-700">{customer.jobCount}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[customer.status] || statusColors.Inactive}`}>{customer.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-stone-500">{timeAgo(customer.updatedAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openMessageDrawer(customer)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Send Message">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => openQuoteDrawer(customer)} className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="Create Quote">
                        <FileText className="w-4 h-4 text-amber-500" />
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Customer Drawer */}
      <SlideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Customer">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Customer or company name" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(416) 555-0000" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St, Toronto" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"><option value="Lead">Lead</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Any notes..." rows={3} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving || !formData.name.trim()} className="flex-1 px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? "Saving..." : "Add Customer"}
            </button>
          </div>
        </form>
      </SlideDrawer>

      {/* Quote Drawer */}
      <SlideDrawer open={quoteDrawerOpen} onClose={() => setQuoteDrawerOpen(false)} title="AI Quote Builder">
        {quoteCustomer && (
          <div className="space-y-5">
            {/* Customer Card */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-charcoal-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-cream-200" />
                </div>
                <div>
                  <p className="text-base font-semibold text-charcoal-900">{quoteCustomer.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[quoteCustomer.status] || statusColors.Inactive}`}>{quoteCustomer.status}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {quoteCustomer.email && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400" /> {quoteCustomer.email}</p>}
                {quoteCustomer.phone && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400" /> {quoteCustomer.phone}</p>}
                {quoteCustomer.address && <p className="text-sm text-charcoal-700 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-stone-400" /> {quoteCustomer.address}</p>}
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Describe the project</label>
              <textarea
                value={quoteDesc}
                onChange={(e) => setQuoteDesc(e.target.value)}
                placeholder="e.g., 20x24 patio with Techo-Bloc Blu 60 pavers in charcoal, small retaining wall along the back edge about 3 feet high..."
                rows={4}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Markup %</label>
              <input type="number" value={quoteMarkup} onChange={(e) => setQuoteMarkup(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>

            <button onClick={handleGenerateQuote} disabled={quoteGenerating || !quoteDesc.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {quoteGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {quoteGenerating ? "Generating..." : "Generate AI Quote"}
            </button>

            {/* Generated Quote */}
            {generatedQuote && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-charcoal-900">{generatedQuote.quoteNumber}</p>
                  <p className="text-sm font-bold text-accent">${generatedQuote.value.toLocaleString()}</p>
                </div>
                <pre className="text-xs text-charcoal-800 whitespace-pre-wrap leading-relaxed font-mono bg-stone-50 rounded-xl p-4 border border-stone-200 max-h-[300px] overflow-y-auto">
                  {generatedQuote.content}
                </pre>
                <div className="flex gap-2">
                  <button onClick={handleCopyQuote} className="flex-1 py-2 bg-charcoal-900 text-cream-100 rounded-lg text-sm font-medium hover:bg-charcoal-800 flex items-center justify-center gap-2">
                    {quoteCopied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    {quoteCopied ? "Copied!" : "Copy Quote"}
                  </button>
                  <button onClick={handleGenerateQuote} className="py-2 px-3 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="py-2 px-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideDrawer>

      {/* Message Drawer */}
      <SlideDrawer open={msgDrawerOpen} onClose={() => setMsgDrawerOpen(false)} title="Send Message">
        {msgCustomer && (
          <div className="space-y-5">
            {/* Customer Card */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-charcoal-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-cream-200" />
                </div>
                <div>
                  <p className="text-base font-semibold text-charcoal-900">{msgCustomer.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[msgCustomer.status] || statusColors.Inactive}`}>{msgCustomer.status}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {msgCustomer.email && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400" /> {msgCustomer.email}</p>}
                {msgCustomer.phone && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400" /> {msgCustomer.phone}</p>}
                {msgCustomer.address && <p className="text-sm text-charcoal-700 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-stone-400" /> {msgCustomer.address}</p>}
              </div>
            </div>

            {/* Email / Text Toggle */}
            <div className="flex bg-stone-100 rounded-lg p-0.5">
              <button onClick={() => switchMsgType("email")} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${msgType === "email" ? "bg-white text-charcoal-900 shadow-sm" : "text-stone-500"}`}>
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
              <button onClick={() => switchMsgType("text")} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${msgType === "text" ? "bg-white text-charcoal-900 shadow-sm" : "text-stone-500"}`}>
                <MessageSquare className="w-3.5 h-3.5" /> Text
              </button>
            </div>

            {/* Template Picker */}
            <div>
              <p className="text-sm font-medium text-charcoal-700 mb-2">Choose a template</p>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => generateMessage(t.id)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      msgTemplate === t.id ? "border-accent bg-accent/5" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                    }`}>
                    <p className={`font-medium ${msgTemplate === t.id ? "text-accent-dark" : "text-charcoal-900"}`}>{t.label}</p>
                    <p className="text-stone-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Message */}
            {msgLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
                <span className="ml-2 text-sm text-stone-500">Generating message...</span>
              </div>
            )}

            {msgContent && !msgLoading && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  {msgContent.subject && (
                    <p className="text-xs text-stone-500 mb-2">
                      <span className="font-semibold">Subject:</span> {msgContent.subject}
                    </p>
                  )}
                  <pre className="text-sm text-charcoal-800 whitespace-pre-wrap leading-relaxed font-sans">
                    {msgContent.content}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex-1 py-2 bg-charcoal-900 text-cream-100 rounded-lg text-sm font-medium hover:bg-charcoal-800 flex items-center justify-center gap-2">
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={handleRegenerate} className="py-2 px-3 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="py-2 px-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
