"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Layers,
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
  Mic,
  BarChart3,
  CheckCircle2,
  ArrowDown,
  Globe,
  Smartphone,
  Lock,
  ChevronDown,
} from "lucide-react";

// ── Hooks ──
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function AnimatedCounter({ value }: { value: string }) {
  const { ref, isVisible } = useInView(0.3);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!isVisible) return;
    const m = value.match(/[\d.]+/);
    if (!m) { setDisplay(value); return; }
    const target = parseFloat(m[0]);
    const pre = value.slice(0, value.indexOf(m[0]));
    const post = value.slice(value.indexOf(m[0]) + m[0].length);
    const isF = m[0].includes(".");
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / 40, 3);
      setDisplay(`${pre}${isF ? (target * p).toFixed(1) : Math.round(target * p)}${post}`);
      if (step >= 40) { setDisplay(value); clearInterval(interval); }
    }, 37);
    return () => clearInterval(interval);
  }, [isVisible, value]);
  return <span ref={ref}>{display}</span>;
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-accent/30"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animation: `floatOrb ${5 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`, transform: "none" }} />
      ))}
    </div>
  );
}

// ── FAQ Accordion ──
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-charcoal-800 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-sm font-medium text-cream-100 pr-4 group-hover:text-accent transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-charcoal-500 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-charcoal-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ── Data ──
const features = [
  { icon: FileText, title: "Techo Quote Builder", desc: "Describe a project in plain English — dimensions, materials, site conditions. Get a fully itemized quote with Techo-Bloc product pricing, labor estimates, markup, and HST calculated automatically. Send it to the client in one click.", accent: "from-amber-500/20 to-amber-500/5", iconBg: "bg-amber-500/10 text-amber-400", wide: true },
  { icon: MessageSquare, title: "Smart Messages", desc: "Choose from 7 templates — quote follow-ups, job completion notices, payment reminders, review requests, referral asks. Personalized per customer. Toggle email or text. Copy and paste or send directly.", accent: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/10 text-blue-400" },
  { icon: Users, title: "Customer CRM", desc: "Every lead, active client, and past customer in one place. See job count, total spent, last contact, status. One-click message, quote, edit, or voice note from every row.", accent: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/10 text-emerald-400" },
  { icon: Briefcase, title: "Job Management", desc: "Create jobs tied to customers with type, address, crew, dates, materials, and progress tracking. Switch between grid, list, or calendar views. Drag to schedule, click to update progress.", accent: "from-violet-500/20 to-violet-500/5", iconBg: "bg-violet-500/10 text-violet-400" },
  { icon: Package, title: "Inventory Tracking", desc: "Track every Techo-Bloc paver, bag of polymeric sand, and roll of geotextile. Set reorder points. Get automatic low-stock alerts. See total inventory value at a glance.", accent: "from-rose-500/20 to-rose-500/5", iconBg: "bg-rose-500/10 text-rose-400" },
  { icon: Receipt, title: "Invoicing & Payments", desc: "Generate invoices from jobs or manually. Track sent, partial, paid, and overdue statuses. Techo drafts payment reminder messages for you to copy and send to overdue clients.", accent: "from-cyan-500/20 to-cyan-500/5", iconBg: "bg-cyan-500/10 text-cyan-400", wide: true },
];

const metrics = [
  { value: "3.2x", label: "Faster quoting" },
  { value: "47%", label: "More jobs closed" },
  { value: "12h", label: "Saved per week" },
  { value: "$0", label: "To get started" },
];

const testimonials = [
  { quote: "We used to spend 2 hours on every quote. Now it takes 5 minutes. Techo knows Techo-Bloc products better than I do. The material costs are always accurate.", name: "Carlos Rivera", title: "Owner, Rivera Hardscaping", location: "Toronto, ON", metric: "5 min quotes" },
  { quote: "The calendar view alone changed how we schedule crews. No more double-bookings, no more missed starts. My foremen finally have visibility into what's coming next.", name: "Sarah Mitchell", title: "Operations Manager, Mitchell Paving Co.", location: "Mississauga, ON", metric: "Zero double-bookings" },
  { quote: "Voice notes are a game-changer. I record the site visit, and Techo gives me clean notes. My office staff doesn't need to call me back asking what the client said.", name: "James Park", title: "Founder, Precision Landscapes", location: "Burlington, ON", metric: "50% fewer callbacks" },
  { quote: "We went from chasing overdue invoices to getting paid on time. The payment reminders are professional and the clients actually respond to them.", name: "Angela Torres", title: "Office Manager, Torres Hardscapes", location: "Oakville, ON", metric: "85% on-time payments" },
];

const logos = ["Rivera Hardscaping", "Mitchell Paving", "Precision Landscapes", "StoneWorks Pro", "Maple Outdoor Living", "Elite Pavers Inc.", "GTA Stoneworks", "Northern Pave Co."];

const howItWorks = [
  { step: "01", title: "Sign up in 30 seconds", desc: "Create your free account. No credit card. No setup fee. Start adding customers immediately." },
  { step: "02", title: "Add your customers & crew", desc: "Import your customer list or add them one by one. Set up your employees, teams, and inventory." },
  { step: "03", title: "Let Techo do the heavy lifting", desc: "Generate quotes, schedule jobs, track inventory, send invoices. Techo handles the busywork so you can focus on building." },
];

const faqs = [
  { q: "Is Techo-Pro specifically for hardscaping, or landscaping in general?", a: "Techo-Pro is built from the ground up for hardscaping contractors. Our quote engine knows Techo-Bloc products, paver pricing, retaining wall materials, and hardscape-specific labor estimates. It's not a generic landscaping tool with a rebrand." },
  { q: "Do I need to install anything?", a: "No. Techo-Pro is a web app that works in your browser on desktop, tablet, and phone. There's nothing to install, no IT setup, and it works on any device." },
  { q: "Can my whole team use it?", a: "Yes. The Pro plan includes unlimited users. Your office staff, crew leads, and foremen can all have their own accounts with access to the data they need." },
  { q: "How does voice notes work?", a: "On the Customers tab, click the mic icon next to any customer. Record your site visit or phone call. Techo transcribes it in real-time and generates a summary with key action items, materials discussed, and follow-ups needed." },
  { q: "Is my data secure?", a: "Absolutely. All data is encrypted in transit and at rest. We use MongoDB Atlas with enterprise-grade security. Your data is yours — we never share it or use it to train models." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. You can downgrade to the free plan anytime and keep your data." },
];

export default function LandingPage() {
  const featuresView = useInView(0.05);
  const howView = useInView(0.1);
  const techView = useInView(0.1);
  const voiceView = useInView(0.1);
  const testimonialsView = useInView(0.1);
  const comparisonView = useInView(0.1);
  const pricingView = useInView(0.1);
  const faqView = useInView(0.1);
  const ctaView = useInView(0.2);

  return (
    <div className="bg-charcoal-950 text-cream-200 min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-charcoal-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Layers className="w-5 h-5 text-charcoal-950" />
            </div>
            <span className="text-base font-bold text-cream-100 tracking-tight">Techo<span className="text-accent">-Pro</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Testimonials", "Pricing", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="text-sm text-charcoal-400 hover:text-cream-200 transition-colors duration-300">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-charcoal-300 hover:text-cream-100 transition-colors duration-300 hidden sm:block">Sign in</Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-accent text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-accent-light hover:scale-105 transition-all duration-300">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/8 rounded-full animate-hero-glow" />
          <div className="absolute top-0 left-0 right-0 h-full animate-grid-pulse" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <FloatingParticles />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-sparkle" />
              <span className="text-xs font-medium text-accent">The #1 platform built for hardscape contractors</span>
            </div>
            <h1 className="animate-fade-in-up animate-delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight leading-[1.1]">
              Run your hardscape<br />
              <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">business smarter.</span>
            </h1>
            <p className="animate-fade-in-up animate-delay-400 mt-6 text-base sm:text-lg text-charcoal-400 max-w-2xl mx-auto leading-relaxed">
              Generate quotes in seconds, schedule crews on a calendar, track inventory in real-time,
              record voice notes on site, and send invoices that actually get paid.
              All in one platform built for hardscaping.
            </p>
            <div className="animate-fade-in-up animate-delay-500 flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link href="/auth/signup" className="w-full sm:w-auto px-7 py-3.5 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 flex items-center justify-center gap-2 group">
                Start for free — no credit card <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-6 py-3.5 border border-charcoal-700 text-cream-200 rounded-xl text-sm font-medium hover:border-charcoal-500 hover:bg-charcoal-900 transition-all duration-300 text-center flex items-center justify-center gap-2">
                See how it works <ArrowDown className="w-4 h-4" />
              </a>
            </div>
            <p className="animate-fade-in-up animate-delay-600 mt-5 text-xs text-charcoal-500">Free forever for solo contractors. No credit card required.</p>
          </div>

          {/* Product Screenshot */}
          <div className="relative mt-16 sm:mt-20 animate-fade-in-scale animate-delay-700">
            <div className="absolute -inset-4 bg-gradient-to-t from-accent/10 via-accent/5 to-transparent rounded-2xl blur-2xl animate-hero-glow" />
            <div className="relative rounded-xl border border-charcoal-800 bg-charcoal-900 shadow-2xl shadow-black/50 overflow-hidden hover:border-charcoal-700 transition-colors duration-500">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-charcoal-800 bg-charcoal-900/80">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" /></div>
                <div className="flex-1 flex justify-center"><div className="px-4 py-1 bg-charcoal-800 rounded-md text-xs text-charcoal-500 font-mono">app.techo-pro.com/dashboard</div></div>
              </div>
              <div className="p-4 sm:p-6 bg-stone-50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[{ label: "Revenue", value: "$124,500", color: "text-emerald-600" }, { label: "Customers", value: "48", color: "text-blue-600" }, { label: "Active Jobs", value: "12", color: "text-amber-600" }, { label: "Quotes", value: "7", color: "text-violet-600" }].map((s) => (
                    <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-3 hover:shadow-md transition-shadow duration-300">
                      <p className="text-[10px] sm:text-xs text-stone-500">{s.label}</p>
                      <p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 bg-white rounded-lg border border-stone-200 p-3">
                    <p className="text-xs font-semibold text-stone-900 mb-2">Recent Jobs</p>
                    {["Thompson — Patio · $12,500", "Riverside — Retaining Wall · $28,900", "Garcia — Driveway · $8,750"].map((j) => (
                      <div key={j} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                        <span className="text-xs text-stone-700">{j}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">In Progress</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-charcoal-900 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2"><Sparkles className="w-3 h-3 text-accent animate-sparkle" /><p className="text-xs font-semibold text-cream-100">Techo Insights</p></div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-charcoal-400 leading-relaxed">3 quotes pending — follow up to close $47K</p>
                      <p className="text-[10px] text-charcoal-400 leading-relaxed">Blu 60 stock low — reorder 12 pallets</p>
                      <p className="text-[10px] text-charcoal-400 leading-relaxed">INV-892 overdue 15 days — send reminder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOGOS ═══ */}
      <section className="border-y border-white/5 py-10 bg-charcoal-950 overflow-hidden">
        <p className="text-center text-xs text-charcoal-500 uppercase tracking-widest mb-6 font-medium">Trusted by 200+ hardscape contractors across Ontario</p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-charcoal-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-charcoal-950 to-transparent z-10" />
          <div className="flex animate-marquee w-max">
            {[...logos, ...logos].map((name, i) => (
              <span key={`${name}-${i}`} className="text-sm font-semibold text-cream-200/30 whitespace-nowrap mx-8 hover:text-cream-200/60 transition-colors duration-300">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METRICS ═══ */}
      <section className="py-20 sm:py-28 relative">
        <FloatingParticles />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 tracking-tight"><AnimatedCounter value={m.value} /></p>
                <p className="text-sm text-charcoal-400 mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-20 sm:py-28" ref={featuresView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${featuresView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Everything you need to run your hardscape business.</h2>
            <p className="mt-4 text-charcoal-400 text-base">Six core modules. Zero busywork. Built specifically for contractors who install pavers, walls, and outdoor living spaces.</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children ${featuresView.isVisible ? "is-visible" : ""}`}>
            {features.map((f) => (
              <div key={f.title} className={`group relative rounded-2xl border border-charcoal-800 bg-gradient-to-br ${f.accent} p-6 sm:p-8 card-hover-lift cursor-default ${f.wide ? "md:col-span-2" : ""}`}>
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}><f.icon className="w-5 h-5" /></div>
                <h3 className="text-lg font-semibold text-cream-100 mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed max-w-lg">{f.desc}</p>
                <ChevronRight className="absolute top-6 right-6 w-5 h-5 text-charcoal-700 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-20 sm:py-28 border-t border-white/5" ref={howView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${howView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Up and running in 5 minutes.</h2>
            <p className="mt-4 text-charcoal-400 text-base">No onboarding calls, no training sessions, no implementation fees.</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children ${howView.isVisible ? "is-visible" : ""}`}>
            {howItWorks.map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-charcoal-800 bg-charcoal-900/30 p-6 card-hover-lift">
                <span className="text-5xl font-bold text-accent/20 absolute top-4 right-6">{s.step}</span>
                <div className="relative">
                  <h3 className="text-base font-semibold text-cream-100 mb-2">{s.title}</h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECHO INTELLIGENCE ═══ */}
      <section className="py-20 sm:py-28 relative" ref={techView.ref}>
        <div className="absolute inset-0 overflow-hidden"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/6 rounded-full animate-float-orb-2" /></div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${techView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-sparkle" /><span className="text-xs font-medium text-accent">Powered by Techo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Techo speaks hardscaping.</h2>
            <p className="mt-4 text-charcoal-400 text-base">Not a generic tool. Techo knows Techo-Bloc products, real material costs, labor rates, and how contractors actually work on site.</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children ${techView.isVisible ? "is-visible" : ""}`}>
            {[
              { icon: Zap, title: "Instant Quotes", desc: "Describe a project. Techo itemizes materials, labor, markup, and HST into a professional quote." },
              { icon: Clock, title: "Smart Scheduling", desc: "Spots gaps in crew schedules. Suggests optimal assignments by skills and availability." },
              { icon: Shield, title: "Proactive Alerts", desc: "Low stock, overdue invoices, stale leads — Techo flags it before you have to think about it." },
              { icon: Mic, title: "Voice Notes", desc: "Record site visits. Techo transcribes and summarizes into clean notes with action items." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-accent/10 bg-accent/[0.03] p-6 card-hover-lift group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300"><item.icon className="w-6 h-6 text-accent" /></div>
                <h3 className="text-base font-semibold text-cream-100 mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VOICE NOTES HIGHLIGHT ═══ */}
      <section className="py-20 sm:py-28 border-t border-white/5" ref={voiceView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${voiceView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
                <Mic className="w-3.5 h-3.5 text-violet-400" /><span className="text-xs font-medium text-violet-400">New Feature</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Record the call.<br />Get clean notes.</h2>
              <p className="mt-4 text-charcoal-400 text-base leading-relaxed">Walk a site with a customer. Hit record. Talk about dimensions, materials, timeline, budget. When you stop, Techo transcribes everything and pulls out the key details — project scope, materials mentioned, budget discussed, next steps.</p>
              <ul className="mt-6 space-y-3">
                {["Real-time speech-to-text transcription", "Automatic summary with key topics", "Saved per customer — view past notes anytime", "Works on mobile in the field"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-charcoal-300"><CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center animate-pulse"><Mic className="w-5 h-5 text-white" /></div>
                <div><p className="text-sm font-semibold text-cream-100">Recording... 2:34</p><p className="text-xs text-charcoal-500">Thompson Residence — Site Visit</p></div>
              </div>
              <div className="bg-charcoal-800 rounded-xl p-4 mb-4 text-xs text-charcoal-400 leading-relaxed">
                &ldquo;...so the patio would be about 20 by 24 feet, using the Blu 60 Smooth in charcoal. They want a small retaining wall along the back, maybe 3 feet high. And a fire pit area off to the right side...&rdquo;
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2"><Sparkles className="w-3.5 h-3.5 text-accent" /><p className="text-xs font-semibold text-cream-100">Techo Summary</p></div>
                <ul className="space-y-1 text-xs text-charcoal-400">
                  <li>- Patio: 20x24 ft, Blu 60 Smooth (Charcoal)</li>
                  <li>- Retaining wall: 3ft high, back edge</li>
                  <li>- Fire pit area: right side of patio</li>
                  <li>- Follow up: send quote this week</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section className="py-20 sm:py-28" ref={comparisonView.ref}>
        <div className="max-w-4xl mx-auto px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${comparisonView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Stop juggling 5 different tools.</h2>
            <p className="mt-4 text-charcoal-400 text-base">Replace spreadsheets, text threads, paper quotes, and sticky notes with one platform.</p>
          </div>
          <div className={`grid grid-cols-2 gap-4 transition-all duration-700 ${comparisonView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/30 p-6">
              <p className="text-sm font-semibold text-red-400 mb-4">Without Techo-Pro</p>
              <ul className="space-y-3 text-sm text-charcoal-400">
                {["Quotes in Excel — 2 hours each", "Texting crews with no paper trail", "Invoices in QuickBooks, customers in a notebook", "Forgetting to follow up on leads", "Inventory surprises mid-job", "Payment chasing via phone calls"].map((item) => (
                  <li key={item} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-gradient-to-b from-accent/10 to-transparent p-6">
              <p className="text-sm font-semibold text-accent mb-4">With Techo-Pro</p>
              <ul className="space-y-3 text-sm text-charcoal-300">
                {["Quotes in 5 minutes with auto-pricing", "Job calendar with crew assignments", "Customers, jobs, invoices all linked", "Auto follow-up reminders on stale leads", "Real-time inventory with reorder alerts", "Professional payment reminders in 2 clicks"].map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-20 sm:py-28 border-t border-white/5" ref={testimonialsView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${testimonialsView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Contractors love Techo-Pro.</h2>
            <p className="mt-4 text-charcoal-400 text-base">Don&apos;t take our word for it. Here&apos;s what contractors are saying.</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children ${testimonialsView.isVisible ? "is-visible" : ""}`}>
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-charcoal-800 bg-charcoal-900/50 p-6 flex flex-col card-hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-accent fill-accent" />))}</div>
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">{t.metric}</span>
                </div>
                <p className="text-sm text-charcoal-300 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-charcoal-800">
                  <p className="text-sm font-semibold text-cream-100">{t.name}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">{t.title} · {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLATFORM HIGHLIGHTS ═══ */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Globe, label: "Works everywhere", desc: "Browser-based. Desktop, tablet, phone." },
              { icon: Smartphone, label: "Mobile-first", desc: "Use it on job sites from your phone." },
              { icon: Lock, label: "Enterprise security", desc: "Encrypted data. MongoDB Atlas." },
              { icon: BarChart3, label: "Real-time analytics", desc: "Revenue, pipeline, crew utilization." },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-charcoal-800 flex items-center justify-center mx-auto mb-3"><item.icon className="w-5 h-5 text-charcoal-400" /></div>
                <p className="text-sm font-semibold text-cream-100">{item.label}</p>
                <p className="text-xs text-charcoal-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20 sm:py-28" ref={pricingView.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${pricingView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Simple pricing. No surprises.</h2>
            <p className="mt-4 text-charcoal-400 text-base">Start free. Upgrade when your business grows. Cancel anytime.</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto stagger-children ${pricingView.isVisible ? "is-visible" : ""}`}>
            {[
              { name: "Starter", price: "Free", period: "", desc: "For solo contractors", features: ["1 user", "Up to 10 customers", "Techo quote builder", "Basic invoicing", "Voice notes", "Email support"], cta: "Get started free", highlight: false },
              { name: "Pro", price: "$49", period: "/mo", desc: "For growing businesses", features: ["Unlimited users", "Unlimited customers", "Techo quotes & messages", "Full inventory tracking", "Calendar scheduling", "Voice notes with summaries", "Priority support"], cta: "Start 14-day free trial", highlight: true },
              { name: "Business", price: "$149", period: "/mo", desc: "For multi-crew operations", features: ["Everything in Pro", "Multi-crew management", "Advanced Techo analytics", "Custom quote templates", "API access", "Dedicated account manager", "Phone support"], cta: "Contact sales", highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 sm:p-8 flex flex-col card-hover-lift ${plan.highlight ? "border-2 border-accent bg-gradient-to-b from-accent/10 to-transparent relative animate-border-glow" : "border border-charcoal-800 bg-charcoal-900/30"}`}>
                {plan.highlight && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-charcoal-950 text-xs font-bold rounded-full">Most popular</div>)}
                <h3 className="text-base font-semibold text-cream-100">{plan.name}</h3>
                <div className="mt-3 mb-1"><span className="text-4xl font-bold text-cream-50">{plan.price}</span>{plan.period && <span className="text-sm text-charcoal-400">{plan.period}</span>}</div>
                <p className="text-sm text-charcoal-500 mb-6">{plan.desc}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-charcoal-300"><CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />{f}</li>))}
                </ul>
                <Link href="/auth/signup" className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-300 block ${plan.highlight ? "bg-accent text-charcoal-950 hover:bg-accent-light hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20" : "border border-charcoal-700 text-cream-200 hover:bg-charcoal-800 hover:border-charcoal-600"}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-20 sm:py-28 border-t border-white/5" ref={faqView.ref}>
        <div className="max-w-3xl mx-auto px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${faqView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-50 tracking-tight">Frequently asked questions.</h2>
          </div>
          <div className={`transition-all duration-700 ${faqView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {faqs.map((faq) => (<FAQItem key={faq.q} q={faq.q} a={faq.a} />))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-28 relative" ref={ctaView.ref}>
        <div className="absolute inset-0 overflow-hidden"><div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/8 rounded-full animate-hero-glow" /></div>
        <div className={`relative max-w-2xl mx-auto px-6 text-center transition-all duration-700 ${ctaView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 tracking-tight">Your next job starts here.</h2>
          <p className="mt-4 text-charcoal-400 text-base">Join 200+ hardscape contractors who switched to Techo-Pro. Free to start, no credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/auth/signup" className="w-full sm:w-auto px-8 py-3.5 bg-accent text-charcoal-950 rounded-xl text-sm font-semibold hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 flex items-center justify-center gap-2 group">
              Get started for free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center"><Layers className="w-4 h-4 text-charcoal-950" /></div>
                <span className="text-sm font-bold text-cream-100">Techo<span className="text-accent">-Pro</span></span>
              </div>
              <p className="text-xs text-charcoal-500 leading-relaxed">Smart business management for hardscape contractors. Built in Toronto.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">Product</p>
              <ul className="space-y-2">
                {["Features", "Pricing", "Voice Notes", "Quote Builder"].map((l) => (
                  <li key={l}><a href="#features" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">Company</p>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">Legal</p>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <li key={l}><a href="#" className="text-xs text-charcoal-500 hover:text-charcoal-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-charcoal-800">
            <p className="text-xs text-charcoal-600">&copy; 2026 Techo-Pro. All rights reserved.</p>
            <p className="text-xs text-charcoal-600">Made with hardscape contractors, for hardscape contractors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
