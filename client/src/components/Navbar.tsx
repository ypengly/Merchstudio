import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          MerchStudio
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-steel">
          <a href="/#products" className="hover:text-ink transition-colors">Products</a>
          <a href="/#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="/#pricing" className="hover:text-ink transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-sm font-medium px-4 py-2 rounded-control hover:bg-panel transition-colors"
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm font-medium px-4 py-2 rounded-control hover:bg-panel transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm text-steel hover:text-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-control hover:bg-panel transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-control bg-ink text-paper hover:bg-ink/90 transition-colors"
              >
                Start designing
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
