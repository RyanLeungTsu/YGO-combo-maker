import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { login, register } from "../../api/authApi";

export function AuthPanel() {
  const { token, userEmail, setAuth, logout } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const result = mode === "login" ? await login(email, password) : await register(email, password);
      setAuth(result.access_token, email);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (token) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
        <span>{userEmail}</span>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: 140 }} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: 100 }} />
      <button type="submit">{mode === "login" ? "Log in" : "Register"}</button>
      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ fontSize: 11 }}>
        {mode === "login" ? "Need an account?" : "Have an account?"}
      </button>
      {error && <span style={{ color: "#e74c3c" }}>{error}</span>}
    </form>
  );
}