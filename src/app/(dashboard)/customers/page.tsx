"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Pencil,
  Copy,
  Check,
  RefreshCw,
  Send,
  User,
  Mic,
  MicOff,
  Square,
  Clock,
  FileAudio,
  AlertTriangle,
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

interface VoiceNote {
  customerId: string;
  transcript: string;
  summary: string;
  date: string;
  duration: number;
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

function summarizeTranscript(transcript: string): string {
  const lines = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const keyPhrases: string[] = [];

  const keywords = ["patio", "driveway", "wall", "retaining", "quote", "price", "cost", "budget", "timeline", "start", "finish", "material", "techo", "pavers", "stone", "concrete", "pool", "fire pit", "walkway", "steps", "drainage", "grading", "permit", "deposit", "payment", "warranty", "issue", "problem", "change", "add", "remove", "size", "color", "style", "deadline", "schedule", "crew", "follow up", "call back", "email", "measure", "visit"];

  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      keyPhrases.push(line.trim());
    }
  });

  if (keyPhrases.length === 0 && lines.length > 0) {
    keyPhrases.push(...lines.slice(0, 4).map(l => l.trim()));
  }

  const bullets = keyPhrases.slice(0, 6).map(p => `- ${p.charAt(0).toUpperCase() + p.slice(1)}`);

  return `**Call Notes Summary**\n${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}\n\n${bullets.join("\n")}\n\n_Full transcript saved below._`;
}

// ── Delete Confirmation Dialog ──
function DeleteConfirm({ open, customerName, onConfirm, onCancel, deleting }: {
  open: boolean; customerName: string; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-charcoal-900 text-center">Delete Customer</h3>
        <p className="text-sm text-stone-500 text-center mt-2">
          Are you sure you want to delete <strong>{customerName}</strong>? This will also remove all their jobs, quotes, and invoices. This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-charcoal-700 hover:bg-stone-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", status: "Lead", notes: "" });

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Voice note state
  const [voiceDrawerOpen, setVoiceDrawerOpen] = useState(false);
  const [voiceCustomer, setVoiceCustomer] = useState<Customer | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [voiceSummary, setVoiceSummary] = useState("");
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [summarizing, setSummarizing] = useState(false);
  const [viewingNotes, setViewingNotes] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quote drawer state
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
  const [quoteCustomer, setQuoteCustomer] = useState<Customer | null>(null);
  const [quoteDesc, setQuoteDesc] = useState("");
  const [quoteMarkup, setQuoteMarkup] = useState("35");
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

  // Load voice notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("techo-voice-notes");
    if (saved) setVoiceNotes(JSON.parse(saved));
  }, []);

  const saveVoiceNotes = (notes: VoiceNote[]) => {
    setVoiceNotes(notes);
    localStorage.setItem("techo-voice-notes", JSON.stringify(notes));
  };

  // ── CRUD ──
  const openAddDrawer = () => { setEditingId(null); setFormData({ name: "", email: "", phone: "", address: "", status: "Lead", notes: "" }); setDrawerOpen(true); };
  const openEditDrawer = (c: Customer) => { setEditingId(c.id); setFormData({ name: c.name, email: c.email || "", phone: c.phone || "", address: c.address || "", status: c.status, notes: c.notes || "" }); setDrawerOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const url = editingId ? `/api/customers/${editingId}` : "/api/customers";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setDrawerOpen(false); setEditingId(null); setFormData({ name: "", email: "", phone: "", address: "", status: "Lead", notes: "" }); fetchCustomers(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) setCustomers((p) => p.filter((c) => c.id !== deleteTarget.id));
    } catch (err) { console.error(err); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  // ── Voice Notes ──
  const openVoiceDrawer = (customer: Customer) => {
    setVoiceCustomer(customer);
    setTranscript("");
    setVoiceSummary("");
    setViewingNotes(false);
    setVoiceDrawerOpen(true);
  };

  const startRecording = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SpeechRecognition = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition is not supported in this browser. Please use Chrome."); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = () => { stopRecording(); };
    recognition.onend = () => {
      if (isRecording) { try { recognition.start(); } catch { /* ignore */ } }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setRecordingTime(0);
    setTranscript("");
    setVoiceSummary("");

    timerRef.current = setInterval(() => {
      setRecordingTime(t => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setIsRecording(false);
  };

  const generateSummary = () => {
    if (!transcript.trim() || !voiceCustomer) return;
    setSummarizing(true);
    // Simulate summary generation
    setTimeout(() => {
      const summary = summarizeTranscript(transcript);
      setVoiceSummary(summary);

      // Save the voice note
      const note: VoiceNote = {
        customerId: voiceCustomer.id,
        transcript,
        summary,
        date: new Date().toISOString(),
        duration: recordingTime,
      };
      saveVoiceNotes([note, ...voiceNotes]);
      setSummarizing(false);
    }, 1500);
  };

  const getCustomerNotes = (customerId: string) => voiceNotes.filter(n => n.customerId === customerId);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Quote ──
  const openQuoteDrawer = (c: Customer) => { setQuoteCustomer(c); setQuoteDesc(""); setGeneratedQuote(null); setQuoteDrawerOpen(true); };
  const handleGenerateQuote = async () => {
    if (!quoteCustomer || !quoteDesc.trim()) return;
    setQuoteGenerating(true); setGeneratedQuote(null);
    try {
      const res = await fetch("/api/ai/generate-quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: quoteCustomer.id, description: quoteDesc, markup: Number(quoteMarkup) || 35 }) });
      if (res.ok) { const data = await res.json(); setGeneratedQuote({ content: data.content, value: data.value, quoteNumber: data.quoteNumber }); }
    } catch (err) { console.error(err); } finally { setQuoteGenerating(false); }
  };
  const handleCopyQuote = () => { if (!generatedQuote) return; navigator.clipboard.writeText(generatedQuote.content); setQuoteCopied(true); setTimeout(() => setQuoteCopied(false), 2000); };

  // ── Message ──
  const openMessageDrawer = (c: Customer) => { setMsgCustomer(c); setMsgTemplate(null); setMsgContent(null); setMsgDrawerOpen(true); };
  const generateMessage = async (templateId: string) => {
    if (!msgCustomer) return; setMsgTemplate(templateId); setMsgLoading(true); setMsgContent(null);
    try {
      const res = await fetch("/api/ai/generate-message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: msgCustomer.id, template: templateId, type: msgType }) });
      if (res.ok) { const data = await res.json(); setMsgContent({ subject: data.subject, content: data.content }); }
    } catch (err) { console.error(err); } finally { setMsgLoading(false); }
  };
  const handleCopy = () => { if (!msgContent) return; const text = msgContent.subject ? `Subject: ${msgContent.subject}\n\n${msgContent.content}` : msgContent.content; navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleRegenerate = () => { if (msgTemplate) generateMessage(msgTemplate); };
  const switchMsgType = (type: "email" | "text") => {
    setMsgType(type);
    if (msgTemplate) { setMsgLoading(true); setMsgContent(null); fetch("/api/ai/generate-message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: msgCustomer?.id, template: msgTemplate, type }) }).then(r => r.ok ? r.json() : null).then(data => { if (data) setMsgContent({ subject: data.subject, content: data.content }); }).finally(() => setMsgLoading(false)); }
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
          <button onClick={openAddDrawer} className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-stone-400 animate-spin" /></div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 text-center py-16"><p className="text-sm text-stone-500">No customers yet. Add your first customer.</p></div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Jobs</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Spent</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Last Contact</th>
                  <th className="text-right text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((customer) => {
                  const customerNoteCount = getCustomerNotes(customer.id).length;
                  return (
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
                          <button onClick={() => openVoiceDrawer(customer)} className="p-1.5 hover:bg-violet-50 rounded-lg transition-colors relative" title="Voice Notes">
                            <Mic className="w-4 h-4 text-violet-500" />
                            {customerNoteCount > 0 && (
                              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-violet-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{customerNoteCount}</span>
                            )}
                          </button>
                          <button onClick={() => openMessageDrawer(customer)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Send Message">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => openQuoteDrawer(customer)} className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="Create Quote">
                            <FileText className="w-4 h-4 text-amber-500" />
                          </button>
                          <button onClick={() => openEditDrawer(customer)} className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors" title="Edit">
                            <Pencil className="w-4 h-4 text-stone-500" />
                          </button>
                          <button onClick={() => setDeleteTarget(customer)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {customers.map((customer) => {
              const customerNoteCount = getCustomerNotes(customer.id).length;
              return (
                <div key={customer.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
                  {/* Top row: Avatar + Name + Status */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-charcoal-100 rounded-full flex items-center justify-center text-sm font-semibold text-charcoal-600 shrink-0">{customer.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-900 truncate">{customer.name}</p>
                      <p className="text-xs text-stone-400">{timeAgo(customer.updatedAt)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusColors[customer.status] || statusColors.Inactive}`}>{customer.status}</span>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-1.5 text-sm">
                    {customer.address && (
                      <p className="text-stone-600 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" /> <span className="truncate">{customer.address}</span></p>
                    )}
                    {customer.email && (
                      <p className="text-stone-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" /> <span className="truncate">{customer.email}</span></p>
                    )}
                    {customer.phone && (
                      <p className="text-stone-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {customer.phone}</p>
                    )}
                  </div>

                  {/* Jobs + Total Spent row */}
                  <div className="flex items-center gap-4 pt-1 border-t border-stone-100">
                    <div className="flex-1">
                      <p className="text-xs text-stone-400">Jobs</p>
                      <p className="text-sm font-medium text-charcoal-700">{customer.jobCount}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-stone-400">Total Spent</p>
                      <p className="text-sm font-semibold text-charcoal-900">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 pt-1 border-t border-stone-100">
                    <button onClick={() => openVoiceDrawer(customer)} className="p-2 hover:bg-violet-50 rounded-lg transition-colors relative" title="Voice Notes">
                      <Mic className="w-4 h-4 text-violet-500" />
                      {customerNoteCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-violet-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{customerNoteCount}</span>
                      )}
                    </button>
                    <button onClick={() => openMessageDrawer(customer)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Send Message">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    </button>
                    <button onClick={() => openQuoteDrawer(customer)} className="p-2 hover:bg-amber-50 rounded-lg transition-colors" title="Create Quote">
                      <FileText className="w-4 h-4 text-amber-500" />
                    </button>
                    <button onClick={() => openEditDrawer(customer)} className="p-2 hover:bg-stone-100 rounded-lg transition-colors" title="Edit">
                      <Pencil className="w-4 h-4 text-stone-500" />
                    </button>
                    <button onClick={() => setDeleteTarget(customer)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={!!deleteTarget}
        customerName={deleteTarget?.name || ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />

      {/* Add/Edit Customer Drawer */}
      <SlideDrawer open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditingId(null); }} title={editingId ? "Edit Customer" : "Add Customer"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Customer or company name" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(416) 555-0000" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St, Toronto" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"><option value="Lead">Lead</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
          <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Any notes..." rows={3} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setDrawerOpen(false); setEditingId(null); }} className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving || !formData.name.trim()} className="flex-1 px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? "Saving..." : editingId ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </SlideDrawer>

      {/* Voice Notes Drawer */}
      <SlideDrawer open={voiceDrawerOpen} onClose={() => { setVoiceDrawerOpen(false); stopRecording(); }} title="Voice Notes">
        {voiceCustomer && (
          <div className="space-y-5">
            {/* Customer Card */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-charcoal-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-cream-200" />
                </div>
                <div>
                  <p className="text-base font-semibold text-charcoal-900">{voiceCustomer.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[voiceCustomer.status] || statusColors.Inactive}`}>{voiceCustomer.status}</span>
                </div>
              </div>
            </div>

            {/* Tab toggle: Record / Past Notes */}
            <div className="flex bg-stone-100 rounded-lg p-0.5">
              <button onClick={() => setViewingNotes(false)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${!viewingNotes ? "bg-white text-charcoal-900 shadow-sm" : "text-stone-500"}`}>
                <Mic className="w-3.5 h-3.5" /> Record
              </button>
              <button onClick={() => setViewingNotes(true)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewingNotes ? "bg-white text-charcoal-900 shadow-sm" : "text-stone-500"}`}>
                <FileAudio className="w-3.5 h-3.5" /> Notes ({getCustomerNotes(voiceCustomer.id).length})
              </button>
            </div>

            {!viewingNotes ? (
              <>
                {/* Recording UI */}
                <div className="flex flex-col items-center py-6">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 animate-pulse"
                        : "bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/20"
                    }`}
                  >
                    {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                  </button>
                  <p className="mt-3 text-sm font-medium text-charcoal-900">
                    {isRecording ? `Recording... ${formatTime(recordingTime)}` : "Tap to start recording"}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {isRecording ? "Tap again to stop" : "Record your conversation with the customer"}
                  </p>
                </div>

                {/* Live Transcript */}
                {transcript && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-charcoal-700">Live Transcript</p>
                      {isRecording && <span className="flex items-center gap-1 text-xs text-red-500"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live</span>}
                    </div>
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 max-h-48 overflow-y-auto">
                      <p className="text-sm text-charcoal-800 leading-relaxed">{transcript}</p>
                    </div>
                  </div>
                )}

                {/* Generate Summary */}
                {transcript && !isRecording && (
                  <button onClick={generateSummary} disabled={summarizing}
                    className="w-full py-2.5 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                    {summarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {summarizing ? "Summarizing..." : "Generate Techo Summary"}
                  </button>
                )}

                {/* Summary */}
                {voiceSummary && (
                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <p className="text-sm font-semibold text-charcoal-900">Techo Summary</p>
                    </div>
                    <div className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-wrap">{voiceSummary}</div>
                  </div>
                )}
              </>
            ) : (
              /* Past Notes */
              <div className="space-y-3">
                {getCustomerNotes(voiceCustomer.id).length === 0 ? (
                  <div className="text-center py-10">
                    <MicOff className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm text-stone-500">No voice notes yet</p>
                    <p className="text-xs text-stone-400 mt-1">Record a conversation to create notes</p>
                  </div>
                ) : (
                  getCustomerNotes(voiceCustomer.id).map((note, i) => (
                    <div key={i} className="bg-white rounded-xl border border-stone-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span className="text-xs text-stone-500">{new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                        </div>
                        <span className="text-xs text-stone-400">{formatTime(note.duration)}</span>
                      </div>
                      <div className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-wrap mb-3">{note.summary}</div>
                      <details className="group">
                        <summary className="text-xs text-accent cursor-pointer hover:text-accent-dark font-medium">Show full transcript</summary>
                        <div className="mt-2 p-3 bg-stone-50 rounded-lg text-xs text-stone-600 leading-relaxed">{note.transcript}</div>
                      </details>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </SlideDrawer>

      {/* Quote Drawer */}
      <SlideDrawer open={quoteDrawerOpen} onClose={() => setQuoteDrawerOpen(false)} title="Techo Quote Builder">
        {quoteCustomer && (
          <div className="space-y-5">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-charcoal-900 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-cream-200" /></div>
                <div><p className="text-base font-semibold text-charcoal-900">{quoteCustomer.name}</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[quoteCustomer.status] || statusColors.Inactive}`}>{quoteCustomer.status}</span></div>
              </div>
              <div className="space-y-1.5">
                {quoteCustomer.email && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400" /> {quoteCustomer.email}</p>}
                {quoteCustomer.phone && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400" /> {quoteCustomer.phone}</p>}
              </div>
            </div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1.5">Describe the project</label><textarea value={quoteDesc} onChange={(e) => setQuoteDesc(e.target.value)} placeholder="e.g., 20x24 patio with Techo-Bloc Blu 60 pavers in charcoal..." rows={4} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" /></div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1.5">Markup %</label><input type="number" value={quoteMarkup} onChange={(e) => setQuoteMarkup(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
            <button onClick={handleGenerateQuote} disabled={quoteGenerating || !quoteDesc.trim()} className="w-full py-2.5 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {quoteGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{quoteGenerating ? "Generating..." : "Generate Techo Quote"}
            </button>
            {generatedQuote && (
              <div className="space-y-3">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold text-charcoal-900">{generatedQuote.quoteNumber}</p><p className="text-sm font-bold text-accent">${generatedQuote.value.toLocaleString()}</p></div>
                <pre className="text-xs text-charcoal-800 whitespace-pre-wrap leading-relaxed font-mono bg-stone-50 rounded-xl p-4 border border-stone-200 max-h-[300px] overflow-y-auto">{generatedQuote.content}</pre>
                <div className="flex gap-2">
                  <button onClick={handleCopyQuote} className="flex-1 py-2 bg-charcoal-900 text-cream-100 rounded-lg text-sm font-medium hover:bg-charcoal-800 flex items-center justify-center gap-2">{quoteCopied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}{quoteCopied ? "Copied!" : "Copy"}</button>
                  <button onClick={handleGenerateQuote} className="py-2 px-3 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50"><RefreshCw className="w-4 h-4" /></button>
                  <button className="py-2 px-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark flex items-center gap-2"><Send className="w-4 h-4" /> Send</button>
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
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-charcoal-900 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-cream-200" /></div>
                <div><p className="text-base font-semibold text-charcoal-900">{msgCustomer.name}</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[msgCustomer.status] || statusColors.Inactive}`}>{msgCustomer.status}</span></div>
              </div>
              <div className="space-y-1.5">
                {msgCustomer.email && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-stone-400" /> {msgCustomer.email}</p>}
                {msgCustomer.phone && <p className="text-sm text-charcoal-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400" /> {msgCustomer.phone}</p>}
              </div>
            </div>
            <div className="flex bg-stone-100 rounded-lg p-0.5">
              <button onClick={() => switchMsgType("email")} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${msgType === "email" ? "bg-white text-charcoal-900 shadow-sm" : "text-stone-500"}`}><Mail className="w-3.5 h-3.5" /> Email</button>
              <button onClick={() => switchMsgType("text")} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${msgType === "text" ? "bg-white text-charcoal-900 shadow-sm" : "text-stone-500"}`}><MessageSquare className="w-3.5 h-3.5" /> Text</button>
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal-700 mb-2">Choose a template</p>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => generateMessage(t.id)} className={`text-left p-2.5 rounded-lg border transition-all text-xs ${msgTemplate === t.id ? "border-accent bg-accent/5" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"}`}>
                    <p className={`font-medium ${msgTemplate === t.id ? "text-accent-dark" : "text-charcoal-900"}`}>{t.label}</p>
                    <p className="text-stone-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {msgLoading && (<div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-accent" /><span className="ml-2 text-sm text-stone-500">Generating...</span></div>)}
            {msgContent && !msgLoading && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                  {msgContent.subject && <p className="text-xs text-stone-500 mb-2"><span className="font-semibold">Subject:</span> {msgContent.subject}</p>}
                  <pre className="text-sm text-charcoal-800 whitespace-pre-wrap leading-relaxed font-sans">{msgContent.content}</pre>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex-1 py-2 bg-charcoal-900 text-cream-100 rounded-lg text-sm font-medium hover:bg-charcoal-800 flex items-center justify-center gap-2">{copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}{copied ? "Copied!" : "Copy"}</button>
                  <button onClick={handleRegenerate} className="py-2 px-3 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50"><RefreshCw className="w-4 h-4" /></button>
                  <button className="py-2 px-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark flex items-center gap-2"><Send className="w-4 h-4" /> Send</button>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideDrawer>
    </div>
  );
}
