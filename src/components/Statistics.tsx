import React, { useState, useEffect } from 'react';
import { apiService, StatisticsData } from '../services/api';
import './Statistics.css';

const Statistics: React.FC = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Token authentication test qilinmoqda...');

      // Avval connection test
      const connectionTest = await apiService.testConnection();
      setDebugInfo(`Test natija: ${connectionTest.message}`);

      if (!connectionTest.success) {
        throw new Error(connectionTest.message);
      }

      setDebugInfo('Token authentication muvaffaqiyatli, ma\'lumotlar olinmoqda...');
      const statisticsData = await apiService.getStatistics();
      setData(statisticsData);
      setLastUpdated(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ma\'lumotlarni yuklab bo\'lmadi';
      setError(errorMessage);
      console.error('Xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const handleClearToken = () => {
    apiService.clearToken();
    setDebugInfo('Token tozalandi, qayta urinib ko\'ring...');
    setTimeout(() => refreshData(), 1000);
  };

  // Loading holati
  if (loading) {
    return (
      <div className="statistics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
          <p className="auth-method">Token Authentication</p>
          {debugInfo && (
            <div className="debug-info">
              <p>{debugInfo}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Xatolik holati
  if (error) {
    return (
      <div className="statistics">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Authentication Xatosi</h2>
          <p>{error}</p>
          
          {debugInfo && (
            <div className="debug-info">
              <h4>Debug Ma'lumot:</h4>
              <p>{debugInfo}</p>
            </div>
          )}

          {/* <div className="troubleshooting">
            <h3>Token Authentication:</h3>
            <ul>
              <li>✅ Django REST Framework token authentication</li>
              <li>✅ Login: root, Parol: 12</li>
              <li>✅ Endpoint: /api-token-auth/</li>
              <li>✅ Token: .../statistics/ endpointiga headerda yuboriladi</li>
            </ul>
          </div> */}

          <div className="auth-buttons">
            <button onClick={refreshData} className="retry-button">
              🔄 Qayta urinish
            </button>
            <button onClick={handleClearToken} className="clear-token-button">
              🗑️ Token ni tozalash
            </button>
            <button onClick={() => window.open('https://aiday.infinite-co.uz/admin/', '_blank')} 
                    className="login-button">
              🔐 Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="statistics">
        <div className="error-container">
          <h2>Ma'lumotlar topilmadi</h2>
          <button onClick={refreshData} className="retry-button">
            Yuklash
          </button>
        </div>
      </div>
    );
  }

  const { total, directions } = data;

  // Yo'nalishlar massiviga aylantiramiz
  const directionList = Object.entries(directions).map(([key, value]) => ({
    key,
    ...value
  }));

  // Umumiy foizlarni hisoblash
  const malePercentage = total.all_users > 0 ? (total.all_male / total.all_users) * 100 : 0;
  const femalePercentage = total.all_users > 0 ? (total.all_female / total.all_users) * 100 : 0;

  return (
    <div className="statistics">
      <header className="statistics-header">
        <div className="header-top">
          <h1>📊 Statistika</h1>
          <div className="header-buttons">
            <button onClick={refreshData} className="refresh-button">
              🔄 Yangilash
            </button>
            <button onClick={handleClearToken} className="clear-token-button small">
              🗑️ Token
            </button>
          </div>
        </div>
        <p>Loyiha yo'nalishlari bo'yicha umumiy ma'lumotlar</p>
        {lastUpdated && (
          <div className="last-updated">
            Oxirgi yangilangan: {lastUpdated.toLocaleTimeString()}
            <span className="auth-method"> (Token Authentication)</span>
          </div>
        )}
        {debugInfo && (
          <div className="connection-success">✅ {debugInfo}</div>
        )}
      </header>

      {/* Umumiy statistika */}
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

      {/* Yo'nalishlar bo'yicha statistika */}
      <section className="directions-stats">
        <h2>🎯 Yo'nalishlar bo'yicha</h2>
        <div className="directions-grid">
          {directionList.map((direction) => (
            <div key={direction.key} className="direction-card">
              <h3>{direction.name}</h3>
              <div className="direction-total">Jami: {direction.total}</div>
              
              <div className="gender-stats">
                <div className="gender-item">
                  <span className="gender-label">🔵 Erkak:</span>
                  <span className="gender-count">{direction.male}</span>
                </div>
                <div className="gender-item">
                  <span className="gender-label">🔴 Ayol:</span>
                  <span className="gender-count">{direction.female}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-male" 
                    style={{ width: `${direction.total > 0 ? (direction.male / direction.total) * 100 : 0}%` }}
                  ></div>
                  <div 
                    className="progress-female" 
                    style={{ width: `${direction.total > 0 ? (direction.female / direction.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>Erkak: {direction.total > 0 ? ((direction.male / direction.total) * 100).toFixed(1) : 0}%</span>
                  <span>Ayol: {direction.total > 0 ? ((direction.female / direction.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagramma */}
      <section className="chart-section">
        <h2>📈 Taqsimot diagrammasi</h2>
        <div className="chart">
          {directionList.map((direction) => (
            <div key={direction.key} className="chart-item">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${(direction.total / total.all_users) * 200}px`,
                  backgroundColor: getDirectionColor(direction.key)
                }}
              >
                <div className="chart-value">{direction.total}</div>
              </div>
              <div className="chart-label">{direction.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Yo'nalish ranglari
const getDirectionColor = (key: string): string => {
  const colors: { [key: string]: string } = {
    rfutbol: '#4CAF50',
    rsumo: '#FF9800',
    fixtirolar: '#2196F3',
    ai: '#9C27B0',
    contest: '#F44336'
  };
  return colors[key] || '#607D8B';
};

export default Statistics;