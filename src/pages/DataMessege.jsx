import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import "../assets/styles/DataMessege.css";

export default function DataMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (localStorage.getItem("key") !== "admin") {
      navigate("/logIn2");
      return;
    }

    const getData = async () => {
      try {
        const res = await axios.get(`${api}/get-data`);
        setMessages(res.data.data_pesan || []);
      } catch {
        setLoadError("Bisikan gagal dimuat. Coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [api, navigate]);

  return (
    <div className="inbox-page">
      <div className="inbox-header">
        <h1 className="inbox-heading">Bisikan yang masuk</h1>
        <p className="inbox-subtext">
          {loading
            ? "Memuat..."
            : `${messages.length} pesan tersimpan, tanpa nama pengirim.`}
        </p>
      </div>

      {loading && (
        <div className="inbox-state">
          <Spinner animation="border" size="sm" className="me-2" />
          Memuat bisikan...
        </div>
      )}

      {!loading && loadError && (
        <div className="inbox-state inbox-state-error">{loadError}</div>
      )}

      {!loading && !loadError && messages.length === 0 && (
        <div className="inbox-state">Belum ada bisikan yang masuk.</div>
      )}

      {!loading && !loadError && messages.length > 0 && (
        <ul className="note-list">
          {messages.map((item, index) => (
            <li className="note-card" key={index}>
              <span className="note-region">
                {item.data_pengirim || "tidak diketahui"} ({item.tanggal})
              </span>
              <p className="note-text">{item.pesan}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
