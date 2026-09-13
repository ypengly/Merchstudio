import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password, name || undefined);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-xl font-semibold">MerchStudio</Link>
        <h1 className="mt-8 font-display text-2xl font-semibold">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-control border border-line px-3 py-2 focus:border-cobalt outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-control border border-line px-3 py-2 focus:border-cobalt outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-control border border-line px-3 py-2 focus:border-cobalt outline-none"
            />
            <p className="mt-1 text-xs text-steel">At least 8 characters.</p>
          </div>
          {error && <p className="text-sm text-signal">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-control bg-ink text-paper font-medium hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            {isLoading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-steel">
          Already have an account? <Link to="/login" className="text-cobalt font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
