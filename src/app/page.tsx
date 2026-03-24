"use client";

import Link from "next/link";
import {
  HardHat,
  ArrowRight,
  FileText,
  MessageSquare,
  Users,
  Briefcase,
  Package,
  Receipt,
  Sparkles,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Quote Builder",
    desc: "Describe a project in plain English. Get a detailed, itemized quote with Techo-Bloc products, labor, and materials in seconds.",
    accent: "from-amber-500/20 to-amber-500/5",
    iconBg: "bg-amber-500/10 text-amber-400",
    wide: true,
  },
  {
    icon: MessageSquare,
    title: "Smart Messages",
    desc: "Auto-generate follow-ups, completion notices, and payment reminders. Copy, paste, send.",
    accent: "from-blue-500/20 to-blue-500/5",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: Users,
    title: "Customer CRM",
    desc: "Track every lead, client, and job history. AI flags who needs a follow-up.",
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Briefcase,
    title: "Job Tracking",
    desc: "Grid, list, or calendar view. Real-time progress bars. AI schedule optimization.",
    accent: "from-violet-500/20 to-violet-500/5",
    iconBg: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: Package,
    title: "Inventory",
    desc: "Track every paver, bag of sand, and roll of fabric. Auto-reorder alerts when stock runs low.",
    accent: "from-rose-500/20 to-rose-500/5",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
  {
    icon: Receipt,
    title: "Invoicing",
    desc: "Create, send, and track invoices. AI drafts payment reminders for overdue accounts.",
    accent: "from-cyan-500/20 to-cyan-500/5",
    iconBg: "bg-cyan-500/10 text-cyan-400",
    wide: true,
  },
];

const metrics = [
  { value: "3.2x", label: "Faster quoting" },
  { value: "47%", label: "More jobs closed" },
  { value: "12h", label: "Saved per week" },
  { value: "$0", label: "To get started" },
];

const testimonials = [
  {
    quote: "We used to spend 2 hours on every quote. Now it takes 5 minutes. The AI knows Techo-Bloc products better than I do.",
    name: "Carlos Rivera",
    title: "Owner, Rivera Hardscaping",
    location: "Toronto, ON",
  },
  {
    quote: "The calendar view alone changed how we schedule crews. No more double-bookings, no more missed starts.",
    name: "Sarah Mitchell",
    title: "Operations Manager, Mitchell Paving Co.",
    location: "Mississauga, ON",
  },
  {
    quote: "My guys in the field can see what's next. My office knows what's overdue. Everything just works.",
    name: "James Park",
    title: "Founder, Precision Landscapes",
    location: "Burlington, ON",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-charcoal-950 text-cream-200 min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-charcoal-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <HardHat className="w-5 h-5 text-charcoal-950" />
            </div>
            <span className="text-base font-bold text-cream-100 tracking-tight">
              Techo<span className="text-accent">-Pro</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm text-charcoal-300 hover:text-cream-100 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-accent text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-accent-light transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/8 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 right-0 h-full" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">AI-powered hardscaping management</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight leading-[1.1]">
              Run your hardscaping
              <br />
              business smarter.
            </h1>

            {/* Sub */}
            <p className="mt-6 text-base sm:text-lg text-charcoal-400 max-w-xl mx-auto leading-relaxed">
              Quotes, schedules, crews, inventory, invoices — one platform
              with AI that actually understands hardscaping.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-6 py-3 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light transition-all flex items-center justify-center gap-2 group"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-3 border border-charcoal-700 text-cream-200 rounded-xl text-sm font-medium hover:border-charcoal-600 hover:bg-charcoal-900 transition-all text-center"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product Screenshot with Glow */}
          <div className="relative mt-16 sm:mt-20">
            <div className="absolute -inset-4 bg-gradient-to-t from-accent/10 via-accent/5 to-transparent rounded-2xl blur-2xl" />
            <div className="relative rounded-xl border border-charcoal-800 bg-charcoal-900 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-charcoal-800 bg-charcoal-900/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-charcoal-700" />
                  <div className="w-3 h-3 rounded-full bg-charcoal-700" />
                  <div className="w-3 h-3 rounded-full bg-charcoal-700" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-charcoal-800 rounded-md text-xs text-charcoal-500 font-mono">
                    app.techo-pro.com/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard Preview */}
              <div className="p-4 sm:p-6 bg-stone-50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Revenue", value: "$124,500", color: "text-emerald-600" },
                    { label: "Customers", value: "48", color: "text-blue-600" },
                    { label: "Active Jobs", value: "12", color: "text-amber-600" },
                    { label: "Quotes", value: "7", color: "text-violet-600" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-3">
                      <p className="text-[10px] sm:text-xs text-stone-500">{s.label}</p>
                      <p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 bg-white rounded-lg border border-stone-200 p-3">
                    <p className="text-xs font-semibold text-stone-900 mb-2">Recent Jobs</p>
                    {["Thompson — Patio", "Riverside — Wall", "Garcia — Driveway"].map((j) => (
                      <div key={j} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                        <span className="text-xs text-stone-700">{j}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">In Progress</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-charcoal-900 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3 h-3 text-accent" />
                      <p className="text-xs font-semibold text-cream-100">AI Insights</p>
                    </div>
                    <p className="text-[10px] text-charcoal-400 leading-relaxed">3 quotes pending — follow up to close $47K in pipeline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-white/5 py-12 bg-charcoal-950">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-charcoal-500 uppercase tracking-widest mb-8 font-medium">
            Trusted by hardscaping contractors across Ontario
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-40">
            {["Rivera Hardscaping", "Mitchell Paving", "Precision Landscapes", "StoneWorks Pro", "Maple Outdoor Living", "Elite Pavers Inc."].map((name) => (
              <span key={name} className="text-sm font-semibold text-cream-200 whitespace-nowrap">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 tracking-tight">{m.value}</p>
                <p className="text-sm text-charcoal-400 mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              Everything you need.
              <br />
              Nothing you don&apos;t.
            </h2>
            <p className="mt-4 text-charcoal-400 text-base">
              Built specifically for hardscaping contractors. Not landscaping software
              with a different coat of paint.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`group relative rounded-2xl border border-charcoal-800 bg-gradient-to-br ${f.accent} p-6 sm:p-8 hover:border-charcoal-700 transition-all ${
                  f.wide ? "md:col-span-2" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-cream-100 mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed max-w-lg">{f.desc}</p>
                <ChevronRight className="absolute top-6 right-6 w-5 h-5 text-charcoal-700 group-hover:text-charcoal-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">Powered by AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              AI that speaks hardscaping.
            </h2>
            <p className="mt-4 text-charcoal-400 text-base">
              Not a generic chatbot. An AI trained on Techo-Bloc products, real material costs,
              labor estimates, and the way contractors actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "Instant Quotes",
                desc: "Describe a project. AI calculates materials, labor, markup, and HST. Generates a professional PDF-ready quote.",
              },
              {
                icon: Clock,
                title: "Smart Scheduling",
                desc: "AI spots gaps in your crew schedules and suggests optimal job assignments based on skills and location.",
              },
              {
                icon: Shield,
                title: "Proactive Alerts",
                desc: "Low stock warnings, overdue invoice reminders, and follow-up nudges — before you have to think about it.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-accent/10 bg-accent/[0.03] p-6 hover:border-accent/20 transition-all"
              >
                <item.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-base font-semibold text-cream-100 mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              Contractors ship faster with Techo-Pro.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-charcoal-800 bg-charcoal-900/50 p-6 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-charcoal-300 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-charcoal-800">
                  <p className="text-sm font-semibold text-cream-100">{t.name}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">{t.title} · {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              Simple pricing. No surprises.
            </h2>
            <p className="mt-4 text-charcoal-400 text-base">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "",
                desc: "For solo contractors getting started",
                features: ["1 user", "Up to 10 customers", "AI quote builder", "Basic invoicing", "Email support"],
                cta: "Get started",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$49",
                period: "/mo",
                desc: "For growing hardscaping businesses",
                features: ["Unlimited users", "Unlimited customers", "AI quotes & messages", "Full inventory tracking", "Calendar scheduling", "Priority support"],
                cta: "Start free trial",
                highlight: true,
              },
              {
                name: "Business",
                price: "$149",
                period: "/mo",
                desc: "For multi-crew operations",
                features: ["Everything in Pro", "Multi-crew management", "Advanced AI analytics", "Custom quote templates", "API access", "Dedicated account manager"],
                cta: "Contact sales",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col ${
                  plan.highlight
                    ? "border-2 border-accent bg-gradient-to-b from-accent/10 to-transparent relative"
                    : "border border-charcoal-800 bg-charcoal-900/30"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-charcoal-950 text-xs font-bold rounded-full">
                    Most popular
                  </div>
                )}
                <h3 className="text-base font-semibold text-cream-100">{plan.name}</h3>
                <div className="mt-3 mb-1">
                  <span className="text-4xl font-bold text-cream-50">{plan.price}</span>
                  {plan.period && <span className="text-sm text-charcoal-400">{plan.period}</span>}
                </div>
                <p className="text-sm text-charcoal-500 mb-6">{plan.desc}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-charcoal-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-colors ${
                    plan.highlight
                      ? "bg-accent text-charcoal-950 hover:bg-accent-light"
                      : "border border-charcoal-700 text-cream-200 hover:bg-charcoal-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 tracking-tight">
            Your next job starts here.
          </h2>
          <p className="mt-4 text-charcoal-400 text-base">
            Join hundreds of hardscaping contractors running their business with Techo-Pro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light transition-all flex items-center justify-center gap-2 group"
            >
              Get started for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
                <HardHat className="w-4 h-4 text-charcoal-950" />
              </div>
              <span className="text-sm font-bold text-cream-100">
                Techo<span className="text-accent">-Pro</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">Features</a>
              <a href="#pricing" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">Testimonials</a>
            </div>
            <p className="text-xs text-charcoal-600">
              &copy; 2026 Techo-Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
