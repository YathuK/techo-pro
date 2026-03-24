"use client";

import { Bell, Search, Sparkles, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 lg:h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-6">
      {/* Search - hidden on small mobile, shown from sm up */}
      <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search customers, jobs, invoices..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          />
        </div>
      </div>

      {/* Spacer for mobile to push items right (hamburger is fixed position) */}
      <div className="sm:hidden w-10" />

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile search button */}
        <button className="sm:hidden p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* AI Quick Action */}
        <button className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg text-sm font-medium text-accent hover:from-accent/20 hover:to-accent/10 transition-all ai-glow">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-stone-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-charcoal-900">Mike Johnson</p>
            <p className="text-xs text-stone-500">Pro Hardscaping Co.</p>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-charcoal-900 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-cream-200" />
          </div>
        </div>
      </div>
    </header>
  );
}
