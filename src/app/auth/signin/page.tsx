"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layers, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-charcoal-950" />
          </div>
          <h1 className="text-2xl font-bold text-cream-100 tracking-tight">
            Techo<span className="text-accent">-Pro</span>
          </h1>
          <p className="text-sm text-charcoal-400 mt-1">Sign in to manage your hardscaping business</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-charcoal-900 rounded-2xl p-6 sm:p-8 border border-charcoal-800 space-y-5">
          <h2 className="text-lg font-semibold text-cream-100">Welcome back</h2>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mike@prohardscaping.com"
              required
              className="w-full px-4 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-cream-100 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-300 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
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
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-charcoal-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-accent hover:text-accent-light font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
