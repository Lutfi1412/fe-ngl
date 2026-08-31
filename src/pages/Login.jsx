import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import "../assets/styles/Login.css";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName === "admin" && password === "admin") {
      localStorage.setItem("key", "admin");
      navigate("/data");
    } else {
      setError("Nama pengguna atau kata sandi salah.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <svg
          className="key-icon"
          viewBox="0 0 48 48"
          width="34"
          height="34"
          aria-hidden="true"
        >
          <circle
            cx="17"
            cy="24"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M24 24 H41 M35 24 V31 M41 24 V29"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="login-heading">Buka kotak bisikan.</h1>
        <p className="login-subtext">Hanya kamu yang punya kuncinya.</p>

        <label className="login-field">
          <span>Nama pengguna</span>
          <input
            type="text"
            className="login-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="login-field">
          <span>Kata sandi</span>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && (
          <Alert variant="danger" className="login-alert">
            {error}
          </Alert>
        )}

        <Button type="submit" className="key-button">
          Masuk
        </Button>
      </form>
    </div>
  );
}
