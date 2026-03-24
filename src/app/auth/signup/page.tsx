"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HardHat, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <HardHat className="w-8 h-8 text-charcoal-950" />
          </div>
          <h1 className="text-2xl font-bold text-cream-100 tracking-tight">
            Techo<span className="text-accent">-Pro</span>
          </h1>
          <p className="text-sm text-charcoal-400 mt-1">Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-charcoal-900 rounded-2xl p-6 sm:p-8 border border-charcoal-800 space-y-4">
          <h2 className="text-lg font-semibold text-cream-100">Create Account</h2>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Mike Johnson"
              required
              className="w-full px-4 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="Pro Hardscaping Co."
              className="w-full px-4 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="mike@prohardscaping.com"
              required
              className="w-full px-4 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="(416) 555-1000"
              className="w-full px-4 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full px-4 py-2.5 pr-10 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent text-charcoal-950 rounded-lg text-sm font-semibold hover:bg-accent-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-charcoal-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-accent hover:text-accent-light font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
