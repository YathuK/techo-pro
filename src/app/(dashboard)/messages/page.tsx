"use client";

import { useState } from "react";
import {
  Sparkles,
  Mail,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  User,
  Send,
} from "lucide-react";

const templates = [
  { id: "quote-follow", label: "Quote Follow-Up", desc: "Remind client about a pending quote" },
  { id: "job-complete", label: "Job Completion", desc: "Notify client their project is done" },
  { id: "schedule-confirm", label: "Schedule Confirmation", desc: "Confirm upcoming job dates" },
  { id: "payment-reminder", label: "Payment Reminder", desc: "Friendly overdue invoice reminder" },
  { id: "seasonal-promo", label: "Seasonal Promotion", desc: "Offer seasonal hardscaping deals" },
  { id: "review-request", label: "Review Request", desc: "Ask for a Google/Yelp review" },
  { id: "warranty-check", label: "Warranty Check-In", desc: "Annual warranty follow-up" },
  { id: "referral-ask", label: "Referral Request", desc: "Ask happy clients for referrals" },
];

const generatedMessages: Record<string, { email: string; text: string }> = {
  "quote-follow": {
    email: `Subject: Your Hardscaping Quote — Ready When You Are

Hi David,

Hope you're doing well! I wanted to follow up on the quote we put together for your backyard patio project (QT-2048 — $14,200).

We spec'd out the Techo-Bloc Blu 60 Smooth in Charcoal with that fire pit area you mentioned. It's going to look incredible with your home's exterior.

A couple of things to keep in mind:
• Spring is our busiest season — locking in now guarantees your preferred start date
• Current Techo-Bloc pricing is valid through April 15th
• We can adjust the scope or payment terms if needed

Would you like to hop on a quick call this week to go over any questions? I'm free Tuesday or Thursday afternoon.

Looking forward to building something great for you.

Best,
Mike Johnson
Pro Hardscaping Co.
(416) 555-1000`,
    text: `Hi David! It's Mike from Pro Hardscaping. Just following up on your patio quote ($14,200). Spring slots are filling up fast — want to lock in your dates? Happy to chat if you have any Qs. 😊`,
  },
  "job-complete": {
    email: `Subject: Your Project is Complete! 🎉

Hi David,

Great news — your backyard patio project is officially complete!

Our crew finished up today and everything looks fantastic. Here's a quick summary:

✅ 480 sq ft Techo-Bloc Blu 60 patio installed
✅ Custom fire pit area with seating wall
✅ All joints filled with polymeric sand
✅ Site cleaned up and ready to enjoy

A few care tips:
• Wait 24 hours before placing heavy furniture
• Avoid power washing for 30 days (polymeric sand needs to fully cure)
• Your 5-year workmanship warranty starts today

We'll send the final invoice separately. If you love the results, a quick Google review would mean the world to us!

Thank you for trusting Pro Hardscaping with your project.

Best,
Mike Johnson`,
    text: `Hi David! Your patio project is DONE! 🎉 Everything looks amazing. Quick reminder: wait 24hrs before heavy furniture, no power washing for 30 days. Your 5-year warranty starts today. Enjoy! - Mike`,
  },
};

export default function MessagesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"email" | "text">("email");
  const [copied, setCopied] = useState(false);
  const [customer, setCustomer] = useState("David Thompson");

  const currentMessage = selectedTemplate
    ? generatedMessages[selectedTemplate] || generatedMessages["quote-follow"]
    : null;

  const handleCopy = () => {
    if (!currentMessage) return;
    const text = messageType === "email" ? currentMessage.email : currentMessage.text;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">AI Message Center</h1>
          <p className="text-sm text-stone-500 mt-0.5">Generate professional emails and texts — copy, paste, send</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h2 className="text-sm font-semibold text-charcoal-900 mb-3">Message Templates</h2>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedTemplate === t.id
                      ? "bg-accent/10 border border-accent/30"
                      : "hover:bg-stone-50 border border-transparent"
                  }`}
                >
                  <p className={`text-sm font-medium ${selectedTemplate === t.id ? "text-accent-dark" : "text-charcoal-900"}`}>
                    {t.label}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Select */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h2 className="text-sm font-semibold text-charcoal-900 mb-3">Recipient</h2>
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
              <div className="w-8 h-8 bg-charcoal-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-charcoal-600" />
              </div>
              <div>
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="text-sm font-medium text-charcoal-900 bg-transparent focus:outline-none"
                >
                  <option>David Thompson</option>
                  <option>Sarah Chen</option>
                  <option>Riverside Mall Corp</option>
                  <option>Maria Garcia</option>
                  <option>James Wilson</option>
                </select>
                <p className="text-xs text-stone-500">david@thompson.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Message */}
        <div className="lg:col-span-2">
          {selectedTemplate && currentMessage ? (
            <div className="bg-white rounded-xl border border-stone-200">
              <div className="flex items-center justify-between p-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-charcoal-900">AI Generated Message</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                  <div className="flex bg-stone-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setMessageType("email")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        messageType === "email"
                          ? "bg-white text-charcoal-900 shadow-sm"
                          : "text-stone-500 hover:text-charcoal-700"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                    <button
                      onClick={() => setMessageType("text")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        messageType === "text"
                          ? "bg-white text-charcoal-900 shadow-sm"
                          : "text-stone-500 hover:text-charcoal-700"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Text
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <pre className="text-sm text-charcoal-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {messageType === "email" ? currentMessage.email : currentMessage.text}
                </pre>
              </div>
              <div className="flex items-center gap-3 p-4 border-t border-stone-100 bg-stone-50 rounded-b-xl">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-charcoal-900 text-cream-100 rounded-lg text-sm font-medium hover:bg-charcoal-800 flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
                <button className="px-4 py-2 bg-white border border-stone-200 text-charcoal-700 rounded-lg text-sm font-medium hover:bg-stone-50 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
                <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark flex items-center gap-2 ml-auto">
                  <Send className="w-4 h-4" /> Send Directly
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 flex flex-col items-center justify-center h-96 text-stone-400">
              <MessageSquare className="w-12 h-12 mb-3 text-stone-300" />
              <p className="text-sm font-medium">Select a template to generate a message</p>
              <p className="text-xs mt-1">AI will personalize it for the selected customer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
