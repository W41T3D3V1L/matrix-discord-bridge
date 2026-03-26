import { useState } from "react";
import { register } from "../api";

export default function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    await register(email, password);
    alert("Registered!");
    setPage("login");
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p onClick={()=>setPage("login")}>Back to login</p>
    </div>
  );
}
