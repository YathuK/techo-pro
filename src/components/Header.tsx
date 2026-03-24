"use client";

import { Bell, Search, Sparkles, User, LogOut, X, Users, Briefcase, Receipt, Package, UserCog, FileText } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "Customer" | "Job" | "Invoice" | "Employee" | "Inventory" | "Page" | "Action";
  label: string;
  sub?: string;
  href: string;
}

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hi! I'm your Techo assistant. Ask me anything about managing your hardscaping business — quotes, scheduling, inventory, or follow-ups." },
  ]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const user = session?.user as { name?: string; companyName?: string } | undefined;

  const typeIcons: Record<string, React.ReactNode> = {
    Customer: <Users className="w-3.5 h-3.5 text-blue-500" />,
    Job: <Briefcase className="w-3.5 h-3.5 text-violet-500" />,
    Invoice: <Receipt className="w-3.5 h-3.5 text-emerald-500" />,
    Employee: <UserCog className="w-3.5 h-3.5 text-amber-500" />,
    Inventory: <Package className="w-3.5 h-3.5 text-rose-500" />,
    Page: <FileText className="w-3.5 h-3.5 text-stone-400" />,
    Action: <Sparkles className="w-3.5 h-3.5 text-accent" />,
  };

  // Global search across all APIs
  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); setSearchLoading(false); return; }

    setSearchLoading(true);
    const query = q.toLowerCase();
    const results: SearchResult[] = [];

    // Static page matches
    const pages = [
      { label: "Dashboard", href: "/dashboard", keywords: ["dashboard", "home", "overview", "revenue"] },
      { label: "Customers", href: "/customers", keywords: ["customer", "client", "lead", "contact", "crm"] },
      { label: "Techo Quotes", href: "/quotes", keywords: ["quote", "estimate", "bid", "price", "proposal"] },
      { label: "Techo Messages", href: "/messages", keywords: ["message", "email", "text", "sms", "follow"] },
      { label: "Employees", href: "/employees", keywords: ["employee", "crew", "team", "worker", "staff"] },
      { label: "Jobs", href: "/jobs", keywords: ["job", "project", "schedule", "calendar", "work"] },
      { label: "Inventory", href: "/inventory", keywords: ["inventory", "stock", "material", "paver", "sand", "gravel"] },
      { label: "Invoices", href: "/invoices", keywords: ["invoice", "payment", "billing", "overdue", "receipt"] },
    ];
    pages.forEach((p) => {
      if (p.label.toLowerCase().includes(query) || p.keywords.some((k) => k.includes(query))) {
        results.push({ type: "Page", label: p.label, href: p.href });
      }
    });

    // Fetch real data in parallel
    try {
      const [custRes, jobRes, invRes, empRes, itemRes] = await Promise.all([
        fetch("/api/customers").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/jobs").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/invoices").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/employees").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/inventory").then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      // Search customers
      custRes.forEach((c: { id: string; name: string; email?: string; phone?: string; status: string }) => {
        if (c.name.toLowerCase().includes(query) || (c.email || "").toLowerCase().includes(query) || (c.phone || "").includes(query)) {
          results.push({ type: "Customer", label: c.name, sub: c.email || c.phone || c.status, href: "/customers" });
        }
      });

      // Search jobs
      jobRes.forEach((j: { id: string; jobNumber: string; type: string; customer?: { name: string }; status: string }) => {
        if (j.jobNumber.toLowerCase().includes(query) || j.type.toLowerCase().includes(query) || (j.customer?.name || "").toLowerCase().includes(query)) {
          results.push({ type: "Job", label: `${j.jobNumber} — ${j.type}`, sub: j.customer?.name || j.status, href: "/jobs" });
        }
      });

      // Search invoices
      invRes.forEach((i: { id: string; invoiceNumber: string; customer?: { name: string }; amount: number; status: string }) => {
        if (i.invoiceNumber.toLowerCase().includes(query) || (i.customer?.name || "").toLowerCase().includes(query)) {
          results.push({ type: "Invoice", label: `${i.invoiceNumber} — $${i.amount.toLocaleString()}`, sub: i.customer?.name || i.status, href: "/invoices" });
        }
      });

      // Search employees
      empRes.forEach((e: { id: string; name: string; role: string; team?: string }) => {
        if (e.name.toLowerCase().includes(query) || e.role.toLowerCase().includes(query) || (e.team || "").toLowerCase().includes(query)) {
          results.push({ type: "Employee", label: e.name, sub: `${e.role}${e.team ? ` · ${e.team}` : ""}`, href: "/employees" });
        }
      });

      // Search inventory
      itemRes.forEach((it: { id: string; name: string; category: string; location?: string }) => {
        if (it.name.toLowerCase().includes(query) || it.category.toLowerCase().includes(query)) {
          results.push({ type: "Inventory", label: it.name, sub: it.category, href: "/inventory" });
        }
      });
    } catch { /* silently fail, still show page results */ }

    setSearchResults(results.slice(0, 10));
    setSearchLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    debounceRef.current = setTimeout(() => performSearch(searchQuery), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, performSearch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        (document.getElementById("global-search") as HTMLInputElement)?.focus();
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setTimeout(() => {
      let response = "I can help with that! Try navigating to the relevant section using the sidebar.";
      const q = userMsg.toLowerCase();
      if (q.includes("quote")) response = "To create a quote, go to Customers, find the client, and click the quote icon. Describe the project and I'll generate an itemized estimate with Techo-Bloc products.";
      else if (q.includes("invoice") || q.includes("payment")) response = "Head to Invoices to create and track invoices. You can also message clients about overdue invoices from the Customers tab.";
      else if (q.includes("schedule") || q.includes("calendar")) response = "Go to Jobs and switch to Calendar view to see all your jobs on a timeline.";
      else if (q.includes("customer") || q.includes("client")) response = "Check the Customers tab. You can message or quote customers directly from each row using the action icons.";
      else if (q.includes("inventory") || q.includes("stock")) response = "Go to Inventory to track materials. I'll alert you when stock drops below reorder points.";
      else if (q.includes("employee") || q.includes("crew")) response = "The Employees page shows your team, their status, and availability.";
      setAiMessages((prev) => [...prev, { role: "ai", text: response }]);
    }, 800);
  };

  return (
    <>
      <header className="h-14 lg:h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-6">
        {/* Global Search */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-lg" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="global-search"
              type="text"
              placeholder="Search everything... ⌘K"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
            />
            {searchOpen && (searchResults.length > 0 || searchLoading) && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-stone-200 shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                {searchLoading && searchResults.length === 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-stone-500">
                    <div className="w-4 h-4 border-2 border-stone-300 border-t-accent rounded-full animate-spin" />
                    Searching...
                  </div>
                )}
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { router.push(r.href); setSearchOpen(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors text-left border-b border-stone-50 last:border-0"
                  >
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                      {typeIcons[r.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-charcoal-900 truncate">{r.label}</p>
                      {r.sub && <p className="text-xs text-stone-500 truncate">{r.sub}</p>}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase flex-shrink-0">{r.type}</span>
                  </button>
                ))}
                {!searchLoading && searchResults.length === 0 && searchQuery.trim() && (
                  <div className="px-4 py-3 text-sm text-stone-500 text-center">No results for &ldquo;{searchQuery}&rdquo;</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="sm:hidden w-10" />

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="sm:hidden p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowAiChat(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg text-sm font-medium text-accent hover:from-accent/20 hover:to-accent/10 transition-all ai-glow"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Techo</span>
          </button>

          <button className="relative p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </button>

          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-stone-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-charcoal-900">{user?.name || "User"}</p>
                <p className="text-xs text-stone-500">{user?.companyName || "My Company"}</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-charcoal-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-cream-200" />
              </div>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-stone-200 shadow-lg z-50 py-1">
                  <div className="px-4 py-2 border-b border-stone-100 md:hidden">
                    <p className="text-sm font-medium text-charcoal-900">{user?.name}</p>
                    <p className="text-xs text-stone-500">{user?.companyName}</p>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: "/auth/signin" })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-stone-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* AI Chat Drawer */}
      <div className={`fixed inset-0 z-50 ${showAiChat ? "" : "pointer-events-none"}`}>
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showAiChat ? "opacity-100" : "opacity-0"}`} onClick={() => setShowAiChat(false)} />
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${showAiChat ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /><h2 className="text-lg font-semibold text-charcoal-900">Techo Assistant</h2></div>
            <button onClick={() => setShowAiChat(false)} className="p-1.5 hover:bg-stone-100 rounded-lg"><X className="w-5 h-5 text-stone-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-charcoal-900 text-cream-100 rounded-br-md" : "bg-stone-100 text-charcoal-800 rounded-bl-md"}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-stone-200">
            <div className="flex gap-2">
              <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="Ask about quotes, scheduling..." className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              <button onClick={handleAiSend} className="px-4 py-2.5 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light transition-colors">Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
