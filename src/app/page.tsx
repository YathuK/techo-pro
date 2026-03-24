"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

// ── Intersection Observer hook for scroll animations ──
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ── Animated Counter ──
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const { ref, isVisible } = useInView(0.3);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isVisible) return;
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) { setDisplay(value); return; }

    const target = parseFloat(numMatch[0]);
    const prefix = value.slice(0, value.indexOf(numMatch[0]));
    const postfix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);
    const isFloat = numMatch[0].includes(".");
    const duration = 1500;
    const steps = 40;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      setDisplay(`${prefix}${isFloat ? current.toFixed(1) : Math.round(current)}${postfix}${suffix}`);
      if (step >= steps) { setDisplay(value + suffix); clearInterval(interval); }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isVisible, value, suffix]);

  return <span ref={ref}>{display}</span>;
}

// ── Floating Particles ──
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `floatOrb ${5 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
            transform: "none",
          }}
        />
      ))}
    </div>
  );
}

const features = [
  { icon: FileText, title: "Techo Quote Builder", desc: "Describe a project in plain English. Get a detailed, itemized quote with Techo-Bloc products, labor, and materials in seconds.", accent: "from-amber-500/20 to-amber-500/5", iconBg: "bg-amber-500/10 text-amber-400", wide: true },
  { icon: MessageSquare, title: "Smart Messages", desc: "Auto-generate follow-ups, completion notices, and payment reminders. Copy, paste, send.", accent: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/10 text-blue-400" },
  { icon: Users, title: "Customer CRM", desc: "Track every lead, client, and job history. Techo flags who needs a follow-up.", accent: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/10 text-emerald-400" },
  { icon: Briefcase, title: "Job Tracking", desc: "Grid, list, or calendar view. Real-time progress bars. Techo schedule optimization.", accent: "from-violet-500/20 to-violet-500/5", iconBg: "bg-violet-500/10 text-violet-400" },
  { icon: Package, title: "Inventory", desc: "Track every paver, bag of sand, and roll of fabric. Auto-reorder alerts when stock runs low.", accent: "from-rose-500/20 to-rose-500/5", iconBg: "bg-rose-500/10 text-rose-400" },
  { icon: Receipt, title: "Invoicing", desc: "Create, send, and track invoices. Techo drafts payment reminders for overdue accounts.", accent: "from-cyan-500/20 to-cyan-500/5", iconBg: "bg-cyan-500/10 text-cyan-400", wide: true },
];

const metrics = [
  { value: "3.2x", label: "Faster quoting" },
  { value: "47%", label: "More jobs closed" },
  { value: "12h", label: "Saved per week" },
  { value: "$0", label: "To get started" },
];

const testimonials = [
  { quote: "We used to spend 2 hours on every quote. Now it takes 5 minutes. Techo knows Techo-Bloc products better than I do.", name: "Carlos Rivera", title: "Owner, Rivera Hardscaping", location: "Toronto, ON" },
  { quote: "The calendar view alone changed how we schedule crews. No more double-bookings, no more missed starts.", name: "Sarah Mitchell", title: "Operations Manager, Mitchell Paving Co.", location: "Mississauga, ON" },
  { quote: "My guys in the field can see what's next. My office knows what's overdue. Everything just works.", name: "James Park", title: "Founder, Precision Landscapes", location: "Burlington, ON" },
];

const logos = ["Rivera Hardscaping", "Mitchell Paving", "Precision Landscapes", "StoneWorks Pro", "Maple Outdoor Living", "Elite Pavers Inc.", "GTA Stoneworks", "Northern Pave Co."];

export default function LandingPage() {
  const featuresView = useInView(0.1);
  const aiView = useInView(0.1);
  const testimonialsView = useInView(0.1);
  const pricingView = useInView(0.1);
  const ctaView = useInView(0.2);

  return (
    <div className="bg-charcoal-950 text-cream-200 min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-charcoal-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <HardHat className="w-5 h-5 text-charcoal-950" />
            </div>
            <span className="text-base font-bold text-cream-100 tracking-tight">
              Techo<span className="text-accent">-Pro</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors duration-300">Features</a>
            <a href="#testimonials" className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors duration-300">Testimonials</a>
            <a href="#pricing" className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors duration-300">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-charcoal-300 hover:text-cream-100 transition-colors duration-300 hidden sm:block">Sign in</Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-accent text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-accent-light hover:scale-105 transition-all duration-300">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/8 rounded-full animate-hero-glow" />
          <div className="absolute top-0 left-0 right-0 h-full animate-grid-pulse" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
          <FloatingParticles />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-sparkle" />
              <span className="text-xs font-medium text-accent">Techo-powered hardscaping management</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up animate-delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight leading-[1.1]">
              Run your hardscaping
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">business smarter.</span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-in-up animate-delay-400 mt-6 text-base sm:text-lg text-charcoal-400 max-w-xl mx-auto leading-relaxed">
              Quotes, schedules, crews, inventory, invoices — one platform
              with Techo that actually understands hardscaping.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animate-delay-500 flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-6 py-3 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-3 border border-charcoal-700 text-cream-200 rounded-xl text-sm font-medium hover:border-charcoal-500 hover:bg-charcoal-900 transition-all duration-300 text-center"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product Screenshot with Glow */}
          <div className="relative mt-16 sm:mt-20 animate-fade-in-scale animate-delay-700">
            <div className="absolute -inset-4 bg-gradient-to-t from-accent/10 via-accent/5 to-transparent rounded-2xl blur-2xl animate-hero-glow" />
            <div className="relative rounded-xl border border-charcoal-800 bg-charcoal-900 shadow-2xl shadow-black/50 overflow-hidden hover:border-charcoal-700 transition-colors duration-500">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-charcoal-800 bg-charcoal-900/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
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
                    <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-3 hover:shadow-md transition-shadow duration-300">
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
                      <Sparkles className="w-3 h-3 text-accent animate-sparkle" />
                      <p className="text-xs font-semibold text-cream-100">Techo Insights</p>
                    </div>
                    <p className="text-[10px] text-charcoal-400 leading-relaxed">3 quotes pending — follow up to close $47K in pipeline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Marquee */}
      <section className="border-y border-white/5 py-10 bg-charcoal-950 overflow-hidden">
        <p className="text-center text-xs text-charcoal-500 uppercase tracking-widest mb-6 font-medium">
          Trusted by hardscaping contractors across Ontario
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-charcoal-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-charcoal-950 to-transparent z-10" />
          <div className="flex animate-marquee w-max">
            {[...logos, ...logos].map((name, i) => (
              <span key={`${name}-${i}`} className="text-sm font-semibold text-cream-200/30 whitespace-nowrap mx-8 hover:text-cream-200/60 transition-colors duration-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics with animated counters */}
      <section className="py-20 sm:py-28 relative">
        <FloatingParticles />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m, i) => (
              <div key={m.label} className={`text-center animate-fade-in-up animate-delay-${(i + 1) * 200}`}>
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 tracking-tight">
                  <AnimatedCounter value={m.value} />
                </p>
                <p className="text-sm text-charcoal-400 mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28" ref={featuresView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${featuresView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children ${featuresView.isVisible ? "is-visible" : ""}`}>
            {features.map((f) => (
              <div
                key={f.title}
                className={`group relative rounded-2xl border border-charcoal-800 bg-gradient-to-br ${f.accent} p-6 sm:p-8 card-hover-lift cursor-default ${
                  f.wide ? "md:col-span-2" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-cream-100 mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed max-w-lg">{f.desc}</p>
                <ChevronRight className="absolute top-6 right-6 w-5 h-5 text-charcoal-700 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 sm:py-28 relative" ref={aiView.ref}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/6 rounded-full animate-float-orb-2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${aiView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-sparkle" />
              <span className="text-xs font-medium text-accent">Powered by Techo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              Techo speaks hardscaping.
            </h2>
            <p className="mt-4 text-charcoal-400 text-base">
              Not a generic tool. Techo is trained on Techo-Bloc products, real material costs,
              labor estimates, and the way contractors actually work.
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children ${aiView.isVisible ? "is-visible" : ""}`}>
            {[
              { icon: Zap, title: "Instant Quotes", desc: "Describe a project. Techo calculates materials, labor, markup, and HST. Generates a professional PDF-ready quote." },
              { icon: Clock, title: "Smart Scheduling", desc: "Techo spots gaps in your crew schedules and suggests optimal job assignments based on skills and location." },
              { icon: Shield, title: "Proactive Alerts", desc: "Low stock warnings, overdue invoice reminders, and follow-up nudges — before you have to think about it." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-accent/10 bg-accent/[0.03] p-6 card-hover-lift group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-semibold text-cream-100 mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28 border-t border-white/5" ref={testimonialsView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${testimonialsView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              Contractors ship faster with Techo-Pro.
            </h2>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children ${testimonialsView.isVisible ? "is-visible" : ""}`}>
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-charcoal-800 bg-charcoal-900/50 p-6 flex flex-col card-hover-lift"
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
      <section id="pricing" className="py-20 sm:py-28" ref={pricingView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${pricingView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">
              Simple pricing. No surprises.
            </h2>
            <p className="mt-4 text-charcoal-400 text-base">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto stagger-children ${pricingView.isVisible ? "is-visible" : ""}`}>
            {[
              { name: "Starter", price: "Free", period: "", desc: "For solo contractors getting started", features: ["1 user", "Up to 10 customers", "Techo quote builder", "Basic invoicing", "Email support"], cta: "Get started", highlight: false },
              { name: "Pro", price: "$49", period: "/mo", desc: "For growing hardscaping businesses", features: ["Unlimited users", "Unlimited customers", "Techo quotes & messages", "Full inventory tracking", "Calendar scheduling", "Priority support"], cta: "Start free trial", highlight: true },
              { name: "Business", price: "$149", period: "/mo", desc: "For multi-crew operations", features: ["Everything in Pro", "Multi-crew management", "Advanced Techo analytics", "Custom quote templates", "API access", "Dedicated account manager"], cta: "Contact sales", highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col card-hover-lift ${
                  plan.highlight
                    ? "border-2 border-accent bg-gradient-to-b from-accent/10 to-transparent relative animate-border-glow"
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
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-300 ${
                    plan.highlight
                      ? "bg-accent text-charcoal-950 hover:bg-accent-light hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20"
                      : "border border-charcoal-700 text-cream-200 hover:bg-charcoal-800 hover:border-charcoal-600"
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
      <section className="py-20 sm:py-28 relative" ref={ctaView.ref}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/8 rounded-full animate-hero-glow" />
        </div>
        <div className={`relative max-w-2xl mx-auto px-6 text-center transition-all duration-700 ${ctaView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 tracking-tight">
            Your next job starts here.
          </h2>
          <p className="mt-4 text-charcoal-400 text-base">
            Join hundreds of hardscaping contractors running their business with Techo-Pro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Get started for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
              <a href="#features" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors duration-300">Features</a>
              <a href="#pricing" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors duration-300">Pricing</a>
              <a href="#testimonials" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors duration-300">Testimonials</a>
            </div>
            <p className="text-xs text-charcoal-600">&copy; 2026 Techo-Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
