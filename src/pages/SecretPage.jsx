import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../assets/styles/SecretPage.css";

const MAX_LENGTH = 700;

export default function SecretPage() {
  const [secretMessage, setSecretMessage] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");
  const textareaRef = useRef(null);
  const [date, setDate] = useState("");

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Ambil kira-kira dari mana pesan ini dikirim, untuk "cap pos" saja —
    // gagal diam-diam kalau layanan lokasi tidak bisa diakses.

    const d = new Date();
    const text = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setDate(text);
    const getRegion = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json");
        setRegion(res.data.region || "");
      } catch {
        setRegion("");
      }
    };
    getRegion();
  }, []);

  const handleChange = (event) => {
    setSecretMessage(event.target.value.slice(0, MAX_LENGTH));
  };

  const handleSend = async () => {
    if (secretMessage.trim() === "") {
      textareaRef.current?.focus();
      return;
    }
    setStatus("sending");
    setErrorMessage("");
    try {
      await axios.post(`${api}/input`, {
        pesan: secretMessage,
        data_pengirim: region,
        tanggal: date,
      });
      setStatus("sent");
      setSecretMessage("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error?.response?.data?.message || "Pesan gagal terkirim. Coba lagi.",
      );
    }
  };

  const handleWriteAnother = () => {
    setStatus("idle");
    setErrorMessage("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const remaining = MAX_LENGTH - secretMessage.length;

  return (
    <div className="whisper-page">
      <div className="whisper-card">
        {status === "sent" ? (
          <div className="whisper-sent">
            <svg
              className="seal-icon"
              viewBox="0 0 64 64"
              width="48"
              height="48"
              aria-hidden="true"
            >
              <path
                d="M8 16 L32 34 L56 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="8"
                y="14"
                width="48"
                height="34"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <circle cx="32" cy="48" r="9" fill="currentColor" />
            </svg>
            <h2 className="whisper-heading">Pesan mu telah terkirim.</h2>
            <Button
              variant="link"
              className="whisper-again-link"
              onClick={handleWriteAnother}
            >
              Tulis satu lagi
            </Button>
          </div>
        ) : (
          <>
            <h1 className="whisper-heading">Secret Message</h1>
            <p className="whisper-subtext">Kirim pesan anonim ke lutpi.</p>

            <div className="paper-wrap">
              <textarea
                ref={textareaRef}
                className="paper-input"
                placeholder="ketikan pesan rahasia ....."
                value={secretMessage}
                onChange={handleChange}
                rows={5}
                disabled={status === "sending"}
                aria-label="Pesan rahasia"
              />
              <span
                className={
                  "char-count" + (remaining <= 20 ? " char-count-low" : "")
                }
              >
                {remaining}
              </span>
            </div>

            {status === "error" && (
              <Alert variant="danger" className="whisper-alert">
                {errorMessage}
              </Alert>
            )}

            <Button
              className="seal-button"
              onClick={handleSend}
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Mengirim
                </>
              ) : (
                "Kirim"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
