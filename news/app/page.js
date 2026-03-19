'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './globals.css';

// Инициализация Supabase через переменные окружения Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [globalNews, setGlobalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Берем ключ GNews из настроек Vercel
    const GNEWS_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
    
    if (GNEWS_KEY) {
      fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=12&apikey=${GNEWS_KEY}`)
        .then(res => res.json())
        .then(data => {
          // У GNews массив новостей лежит в data.articles
          setGlobalNews(data.articles || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Ошибка при загрузке GNews:", err);
          setLoading(false);
        });
    } else {
      console.error("Ключ NEXT_PUBLIC_GNEWS_API_KEY не найден в настройках Vercel");
      setLoading(false);
    }
  }, []);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Ошибка: " + error.message);
    else alert("Регистрация успешна! Проверь почту или таблицу Users в Supabase.");
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Ошибка: " + error.message);
    else {
      alert("Вы успешно вошли!");
      setUser(data.user);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">News<span>Hub</span></h1>
        <div className="auth-box">
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <div className="button-group">
            <button onClick={handleLogin}>Войти</button>
            <button className="reg-btn" onClick={handleSignUp}>Регистрация</button>
          </div>
        </div>
      </header>

      <main className="content">
        <h2 className="section-title">Последние новости</h2>
        
        {loading ? (
          <div className="loader">Загрузка свежих новостей...</div>
        ) : (
          <div className="news-grid">
            {globalNews.length > 0 ? (
              globalNews.map((article, index) => (
                <div key={index} className="news-card">
                  {article.image && (
                    <div className="card-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                  )}
                  <div className="card-content">
                    <span className="source">{article.source.name}</span>
                    <h3>{article.title}</h3>
                    <p>{article.description?.substring(0, 100)}...</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                      Читать полностью
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>Новостей пока нет. Проверьте API ключ.</p>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2026 NewsHub. Все права защищены.</p>
      </footer>
    </div>
  );
}