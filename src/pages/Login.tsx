import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-chess-offwhite dark:bg-zinc-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-display text-2xl font-bold text-chess-charcoal dark:text-zinc-100 tracking-tight cursor-pointer">
              CHESS<span className="text-chess-bronze dark:text-white">.</span>
            </span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-semibold text-chess-charcoal dark:text-zinc-100">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground dark:text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-chess-bronze hover:underline font-medium dark:text-white">
              Create one
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg border border-border dark:border-zinc-800 p-6 space-y-4 shadow-sm transition-colors">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-transparent dark:bg-zinc-950 border border-border dark:border-zinc-800 rounded-sm text-sm text-chess-charcoal dark:text-zinc-200 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-chess-bronze/30 focus:border-chess-bronze transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-chess-charcoal dark:text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-transparent dark:bg-zinc-950 border border-border dark:border-zinc-800 rounded-sm text-sm text-chess-charcoal dark:text-zinc-200 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-chess-bronze/30 focus:border-chess-bronze transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-chess-charcoal dark:hover:text-zinc-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bronze-gradient-black text-white dark:text-chess-charcoal dark:bg-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
