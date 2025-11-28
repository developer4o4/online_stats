import React, { useState, useEffect } from 'react';
import './Statistics.css';

// BACKEND URL
const API_URL = "https://aiday.infinite-co.uz/statistics/dev_404_1212/";

interface DirectionItem {
  name: string;
  total: number;
  male: number;
  female: number;
}

interface StatisticsData {
  total: {
    all_users: number;
    all_male: number;
    all_female: number;
  };
  directions: {
    [key: string]: DirectionItem;
  };
}

const Statistics: React.FC = () => {
  // 🔐 PAROL STATE
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // STATISTIKA STATE
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // PAROL TEKSHIRISH
  const checkPassword = () => {
    if (password === "dev_404_1212") {
      setIsAuthorized(true);
    } else {
      alert("❌ Noto‘g‘ri parol!");
    }
  };

  // MA'LUMOTNI OLISH
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Backend bilan bog'lanib bo'lmadi");

      const jsonData = await response.json();
      setData(jsonData);
      setLastUpdated(new Date());

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // useEffect doim chaqiriladi, shartli emas
  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

  // 🔐 Agar hali authorized bo'lmasa, parol oynasi
  if (!isAuthorized) {
    return (
      <div className="statistics auth-page">
        <div className="auth-box">
          <h2>🔐 Statistika uchun parol kerak</h2>

          <input
            type="password"
            placeholder="Parol..."
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" onClick={checkPassword}>
            Kirish
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // STATISTIKA RENDER QISMI
  // -------------------------
  if (loading) {
    return (
      <div className="statistics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics">
        <div className="error-container">
          <h2>⚠️ Xatolik</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">Qayta urinish</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="statistics">
        <h2>Ma'lumot topilmadi</h2>
      </div>
    );
  }

  const { total, directions } = data;

  const directionList = Object.entries(directions).map(([key, value]) => ({
    key,
    ...value
  }));

  const malePercentage = total.all_users > 0 ? (total.all_male / total.all_users) * 100 : 0;
  const femalePercentage = total.all_users > 0 ? (total.all_female / total.all_users) * 100 : 0;

  return (
    <div className="statistics">
      <header className="statistics-header">
        <div className="header-top">
          <h1>📊 Statistika</h1>
          <button onClick={fetchData} className="refresh-button">🔄 Yangilash</button>
        </div>

        {lastUpdated && (
          <div className="last-updated">
            Oxirgi yangilangan: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </header>

      <section className="total-stats">
        <h2>👥 Umumiy statistika</h2>
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Jami foydalanuvchilar</h3>
            <div className="stat-number">{total.all_users}</div>
          </div>

          <div className="stat-card male">
            <h3>🔵 Erkaklar</h3>
            <div className="stat-number">{total.all_male}</div>
            <div className="stat-percentage">{malePercentage.toFixed(1)}%</div>
          </div>

          <div className="stat-card female">
            <h3>🔴 Ayollar</h3>
            <div className="stat-number">{total.all_female}</div>
            <div className="stat-percentage">{femalePercentage.toFixed(1)}%</div>
          </div>
        </div>
      </section>

      <section className="directions-stats">
        <h2>🎯 Yo'nalishlar bo'yicha</h2>
        <div className="directions-grid">
          {directionList.map((dir) => (
            <div key={dir.key} className="direction-card">
              <h3>{dir.name}</h3>
              <div className="direction-total">Jami: {dir.total}</div>

              <div className="gender-stats">
                <div className="gender-item">
                  <span>🔵 Erkak:</span> <span>{dir.male}</span>
                </div>
                <div className="gender-item">
                  <span>🔴 Ayol:</span> <span>{dir.female}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-male"
                    style={{ width: `${(dir.male / dir.total) * 100 || 0}%` }}
                  ></div>
                  <div
                    className="progress-female"
                    style={{ width: `${(dir.female / dir.total) * 100 || 0}%` }}
                  ></div>
                </div>

                <div className="progress-labels">
                  <span>Erkak: {(dir.male / dir.total * 100 || 0).toFixed(1)}%</span>
                  <span>Ayol: {(dir.female / dir.total * 100 || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Statistics;
