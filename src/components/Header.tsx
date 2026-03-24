"use client";

import { Bell, Search, Sparkles, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const user = session?.user as { name?: string; companyName?: string } | undefined;

  return (
    <header className="h-14 lg:h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-6">
      {/* Search */}
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

      <div className="sm:hidden w-10" />

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="sm:hidden p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        <button className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg text-sm font-medium text-accent hover:from-accent/20 hover:to-accent/10 transition-all ai-glow">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        <button className="relative p-2 text-stone-500 hover:text-charcoal-900 hover:bg-stone-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Profile with dropdown */}
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
  );
}
