"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  Loader2,
  Copy,
  Wand2,
} from "lucide-react";

const quotes = [
  { id: "QT-2048", client: "David Thompson", project: "Backyard Patio with Fire Pit", value: "$14,200", status: "Sent", date: "Mar 20, 2026", aiGenerated: true },
  { id: "QT-2047", client: "Sarah Chen", project: "Front Walkway & Steps", value: "$6,400", status: "Draft", date: "Mar 19, 2026", aiGenerated: true },
  { id: "QT-2046", client: "Riverside Mall", project: "Phase 2 - Retaining Wall Extension", value: "$32,500", status: "Accepted", date: "Mar 15, 2026", aiGenerated: false },
  { id: "QT-2045", client: "James Wilson", project: "Driveway Paver Installation", value: "$11,800", status: "Sent", date: "Mar 14, 2026", aiGenerated: true },
  { id: "QT-2044", client: "Oakwood HOA", project: "Community Entrance Redesign", value: "$28,600", status: "Declined", date: "Mar 10, 2026", aiGenerated: false },
  { id: "QT-2043", client: "Maria Garcia", project: "Pool Deck Pavers", value: "$9,200", status: "Accepted", date: "Mar 8, 2026", aiGenerated: true },
];

const statusIcons: Record<string, React.ReactNode> = {
  Draft: <Clock className="w-3.5 h-3.5" />,
  Sent: <Send className="w-3.5 h-3.5" />,
  Accepted: <CheckCircle2 className="w-3.5 h-3.5" />,
  Declined: <XCircle className="w-3.5 h-3.5" />,
};

const statusColors: Record<string, string> = {
  Draft: "bg-stone-100 text-stone-600",
  Sent: "bg-info/10 text-info",
  Accepted: "bg-success/10 text-success",
  Declined: "bg-danger/10 text-danger",
};

export default function QuotesPage() {
  const [showAiBuilder, setShowAiBuilder] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);
  const [projectDesc, setProjectDesc] = useState("");

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedQuote(`QUOTE #QT-2049
Pro Hardscaping Co.
━━━━━━━━━━━━━━━━━━━━━━━━

Client: ${projectDesc.includes("Thompson") ? "David Thompson" : "New Customer"}
Project: ${projectDesc || "Custom Hardscaping Project"}
Date: March 24, 2026

MATERIALS
─────────
• Techo-Bloc Blu 60 Smooth (Charcoal) — 480 sq ft    $4,320
• Techo-Bloc Mini-Creta Wall (Shale Grey) — 60 lin ft  $2,100
• Polymeric Sand (HP Nextgel) — 8 bags                  $320
• Crushed Gravel Base (3/4") — 12 tons                   $840
• Geotextile Fabric — 500 sq ft                          $175

LABOR
─────
• Site Preparation & Excavation — 2 days                $2,400
• Base Installation & Compaction — 1.5 days             $1,800
• Paver Installation — 3 days                           $3,600
• Wall Construction — 2 days                            $2,400
• Finishing & Cleanup — 0.5 day                          $600

SUBTOTAL                                               $18,555
HST (13%)                                               $2,412
━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL                                                  $20,967

Terms: 30% deposit, 40% at midpoint, 30% on completion
Warranty: 5-year workmanship guarantee
Valid for: 30 days`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">Techo Quote Builder</h1>
          <p className="text-sm text-stone-500 mt-0.5">Create professional quotes in seconds with AI</p>
        </div>
        <div className="flex gap-3">
          <button className="px-3 sm:px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-stone-50 flex items-center gap-2">
            <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Templates</span>
          </button>
          <button
            onClick={() => setShowAiBuilder(!showAiBuilder)}
            className="px-3 sm:px-4 py-2 bg-charcoal-900 rounded-lg text-sm font-medium text-cream-100 hover:bg-charcoal-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline">{showAiBuilder ? "View Quotes" : "Techo Quote Builder"}</span>
            <span className="sm:hidden">{showAiBuilder ? "Quotes" : "Techo Builder"}</span>
          </button>
        </div>
      </div>

      {showAiBuilder ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Input */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-charcoal-900">Describe the Project</h2>
              </div>
              <textarea
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="e.g., Client wants a 20x24 patio with Techo-Bloc Blu 60 pavers in charcoal, a small retaining wall along the back edge about 3 feet high, and polymeric sand joints. Site is relatively flat with easy access."
                className="w-full h-40 p-4 bg-stone-50 border border-stone-200 rounded-lg text-sm text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="text-xs font-medium text-stone-500 mb-1 block">Customer</label>
                  <select className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                    <option>Select customer...</option>
                    <option>David Thompson</option>
                    <option>Sarah Chen</option>
                    <option>James Wilson</option>
                    <option>New Customer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 mb-1 block">Markup %</label>
                  <input
                    type="number"
                    defaultValue={35}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full mt-4 py-3 bg-gradient-to-r from-accent to-accent-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating Quote...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Techo Quote
                  </>
                )}
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-accent/5 border border-accent/15 rounded-xl p-4">
              <p className="text-sm font-medium text-charcoal-900 mb-2">Techo Tips for Better Quotes</p>
              <ul className="space-y-1.5 text-xs text-stone-600">
                <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" /> Include dimensions (sq ft, linear ft) for accurate material estimates</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" /> Mention specific Techo-Bloc products for precise pricing</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" /> Describe site conditions (slope, access, soil type) for labor accuracy</li>
                <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" /> Mention any extras: lighting, drainage, steps, seating walls</li>
              </ul>
            </div>
          </div>

          {/* Generated Quote Preview */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal-900">Quote Preview</h2>
              {generatedQuote && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-stone-100 rounded-lg text-xs font-medium text-charcoal-700 hover:bg-stone-200 flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                  <button className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Send to Client
                  </button>
                </div>
              )}
            </div>
            {generatedQuote ? (
              <pre className="text-xs font-mono text-charcoal-800 bg-stone-50 rounded-lg p-5 whitespace-pre-wrap leading-relaxed border border-stone-200 overflow-y-auto max-h-[500px]">
                {generatedQuote}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-stone-400">
                <FileText className="w-12 h-12 mb-3 text-stone-300" />
                <p className="text-sm font-medium">No quote generated yet</p>
                <p className="text-xs mt-1">Describe a project and click Generate</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quotes List */
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Quote</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Client</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Project</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Value</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-stone-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-charcoal-900">{quote.id}</span>
                        {quote.aiGenerated && <Sparkles className="w-3.5 h-3.5 text-accent" />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-charcoal-700">{quote.client}</td>
                    <td className="px-5 py-3.5 text-sm text-charcoal-700">{quote.project}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-charcoal-900">{quote.value}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[quote.status]}`}>
                        {statusIcons[quote.status]} {quote.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-500">{quote.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal-900">{quote.id}</span>
                    {quote.aiGenerated && <Sparkles className="w-3.5 h-3.5 text-accent" />}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[quote.status]}`}>
                    {statusIcons[quote.status]} {quote.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-charcoal-900">{quote.client}</p>
                <p className="text-xs text-stone-500 mt-0.5">{quote.project}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <span className="text-base font-bold text-charcoal-900">{quote.value}</span>
                  <span className="text-xs text-stone-500">{quote.date}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
