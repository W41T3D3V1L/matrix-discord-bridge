import { useState } from "react";
import { login } from "../api";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await login(email, password);
    localStorage.setItem("token", res.token);
    window.location.reload();
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p onClick={()=>setPage("register")}>Create account</p>
    </div>
  );
}
