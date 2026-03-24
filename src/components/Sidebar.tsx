"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCog,
  Briefcase,
  Package,
  Receipt,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/quotes", label: "AI Quotes", icon: FileText, ai: true },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/invoices", label: "Invoices", icon: Receipt },
];

const opsItems = [
  { href: "/employees", label: "Employees", icon: UserCog },
  { href: "/inventory", label: "Inventory", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-charcoal-800">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <HardHat className="w-6 h-6 text-charcoal-950" />
        </div>
        {(!collapsed || mobileOpen) && (
          <div className="flex-1">
            <h1 className="text-lg font-bold text-cream-100 tracking-tight">
              Techo<span className="text-accent">-Pro</span>
            </h1>
            <p className="text-[10px] text-charcoal-400 uppercase tracking-widest">
              Hardscaping Suite
            </p>
          </div>
        )}
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-charcoal-400 hover:text-cream-200 hover:bg-charcoal-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-charcoal-400 hover:text-cream-200 hover:bg-charcoal-900"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-accent" : "text-charcoal-500 group-hover:text-cream-300"
                )}
              />
              {(!collapsed || mobileOpen) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {(!collapsed || mobileOpen) && item.ai && (
                <Sparkles className="w-3.5 h-3.5 text-accent ml-auto" />
              )}
              {collapsed && !mobileOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-charcoal-900 text-cream-200 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* Operations Section */}
        {(!collapsed || mobileOpen) && (
          <p className="px-3 pt-5 pb-1 text-[10px] font-semibold text-charcoal-600 uppercase tracking-widest">
            Operations
          </p>
        )}
        {collapsed && !mobileOpen && <div className="my-3 mx-3 border-t border-charcoal-800" />}
        {opsItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-charcoal-400 hover:text-cream-200 hover:bg-charcoal-900"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-accent" : "text-charcoal-500 group-hover:text-cream-300"
                )}
              />
              {(!collapsed || mobileOpen) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {collapsed && !mobileOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-charcoal-900 text-cream-200 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Assistant Promo */}
      {(!collapsed || mobileOpen) && (
        <div className="mx-3 mb-4 p-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-cream-100">AI Assistant</span>
          </div>
          <p className="text-xs text-charcoal-400 leading-relaxed">
            Let AI build quotes, draft messages, and manage your business smarter.
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile hamburger button - rendered via portal-like pattern in Header */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-charcoal-900 rounded-lg text-cream-200 shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={clsx(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-charcoal-950 text-cream-200 flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex bg-charcoal-950 text-cream-200 flex-col transition-all duration-300 relative",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-charcoal-800 border border-charcoal-700 rounded-full flex items-center justify-center text-charcoal-400 hover:text-cream-200 hover:bg-charcoal-700 transition-colors z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>
    </>
  );
}
