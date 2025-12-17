import { useState } from "react";
import { API_URL } from "../../services/api";
import "./DoctorLogin.css";

function DoctorLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch(`${API_URL}/api/auth/doctor/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    localStorage.setItem("token", data.token);
    localStorage.setItem("doctor", JSON.stringify(data.doctor));
    onLogin();
  };

  return (
    <div className="doctor-login-container">
      <div className="doctor-login-card">
        <h2>Doctor Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default DoctorLogin;
