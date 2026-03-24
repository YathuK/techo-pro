"use client";

import { Bell, Search, Sparkles, User, LogOut, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: string;
  label: string;
  href: string;
}

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hi! I'm your Techo-Pro AI assistant. Ask me anything about managing your hardscaping business — quotes, scheduling, inventory, or follow-ups." },
  ]);
  const searchRef = useRef<HTMLDivElement>(null);
  const user = session?.user as { name?: string; companyName?: string } | undefined;

  // Search across pages
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    const pages = [
      { label: "Dashboard", href: "/dashboard", keywords: ["dashboard", "home", "overview", "revenue"] },
      { label: "Customers", href: "/customers", keywords: ["customer", "client", "lead", "contact", "crm"] },
      { label: "AI Quotes", href: "/quotes", keywords: ["quote", "estimate", "bid", "price", "proposal"] },
      { label: "AI Messages", href: "/messages", keywords: ["message", "email", "text", "sms", "follow"] },
      { label: "Employees", href: "/employees", keywords: ["employee", "crew", "team", "worker", "staff"] },
      { label: "Jobs", href: "/jobs", keywords: ["job", "project", "schedule", "calendar", "work"] },
      { label: "Inventory", href: "/inventory", keywords: ["inventory", "stock", "material", "paver", "sand", "gravel"] },
      { label: "Invoices", href: "/invoices", keywords: ["invoice", "payment", "billing", "overdue", "receipt"] },
    ];
    pages.forEach((p) => {
      if (p.label.toLowerCase().includes(q) || p.keywords.some((k) => k.includes(q))) {
        results.push({ type: "Page", label: p.label, href: p.href });
      }
    });
    // Action suggestions
    if (q.includes("add") || q.includes("new") || q.includes("create")) {
      results.push({ type: "Action", label: "Add Customer", href: "/customers" });
      results.push({ type: "Action", label: "Create Job", href: "/jobs" });
      results.push({ type: "Action", label: "New Invoice", href: "/invoices" });
    }
    setSearchResults(results.slice(0, 6));
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    // Simulate AI response
    setTimeout(() => {
      let response = "I can help with that! Try navigating to the relevant section using the sidebar.";
      const q = userMsg.toLowerCase();
      if (q.includes("quote")) response = "To create a quote, go to AI Quotes and click the AI Quote Builder button. Describe the project and I'll generate an itemized estimate with Techo-Bloc products.";
      else if (q.includes("invoice") || q.includes("payment")) response = "Head to Invoices to create and track invoices. I can also draft payment reminder emails for overdue accounts — check the AI Messages section.";
      else if (q.includes("schedule") || q.includes("calendar")) response = "Go to Jobs and switch to Calendar view to see all your jobs on a timeline. You can also see crew availability there.";
      else if (q.includes("customer") || q.includes("client")) response = "Check the Customers tab to manage your CRM. I can flag leads that haven't been contacted in 5+ days and draft follow-up messages.";
      else if (q.includes("inventory") || q.includes("stock")) response = "Go to Inventory to track all your materials. I'll alert you when stock drops below reorder points and can auto-generate purchase orders.";
      else if (q.includes("employee") || q.includes("crew")) response = "The Employees page shows all your team members, their status, and availability. I can suggest optimal crew assignments based on skills and location.";
      setAiMessages((prev) => [...prev, { role: "ai", text: response }]);
    }, 800);
  };

  return (
    <>
      <header className="h-14 lg:h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-6">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search pages, actions..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-stone-200 shadow-lg z-50 py-1 overflow-hidden">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { router.push(r.href); setSearchOpen(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
                  >
                    <span className="text-[10px] font-semibold text-stone-400 uppercase w-12">{r.type}</span>
                    <span className="text-sm text-charcoal-900">{r.label}</span>
                  </button>
                ))}
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
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          <button className="relative p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-stone-200"
            >
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
                  <button
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-stone-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* AI Chat Drawer */}
      <div className={`fixed inset-0 z-50 ${showAiChat ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showAiChat ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowAiChat(false)}
        />
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${showAiChat ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-charcoal-900">AI Assistant</h2>
            </div>
            <button onClick={() => setShowAiChat(false)} className="p-1.5 hover:bg-stone-100 rounded-lg">
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-charcoal-900 text-cream-100 rounded-br-md"
                    : "bg-stone-100 text-charcoal-800 rounded-bl-md"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-stone-200">
            <div className="flex gap-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                placeholder="Ask about quotes, scheduling, inventory..."
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                onClick={handleAiSend}
                className="px-4 py-2.5 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
