'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './globals.css';


// Замени свои строки 7-11 на эти:
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;


export default function Home() {
  const [globalNews, setGlobalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {

    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setGlobalNews(data.articles || []);
        setLoading(false);
      });
  }, []);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Ошибка: " + error.message);
    else alert("Регистрация успешна! Проверь таблицу Users в Supabase.");
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Ошибка: " + error.message);
    else setUser(data.user);
  };

  return (
    <html lang="ru">
      <body>
        <div className="container">
          <header className="header">
            <h1 className="logo">News<span>Hub</span></h1>
            <div className="auth-section">
              {user ? (
                <div className="user-profile">
                  <span>{user.email}</span>
                  <button onClick={() => setUser(null)} className="btn btn-secondary">Выйти</button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <input type="email" placeholder="Email" className="input-field" onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Пароль" className="input-field" onChange={(e) => setPassword(e.target.value)} />
                  <button onClick={handleLogin} className="btn btn-secondary">Войти</button>
                  <button onClick={handleSignUp} className="btn btn-primary">Регистрация</button>
                </div>
              )}
            </div>
          </header>

          <main className="news-grid">
            {loading ? <p>Загрузка...</p> : globalNews.map((art, i) => (
              <div key={i} className="news-card">
                {art.urlToImage && <img src={art.urlToImage} className="news-img" alt="" />}
                <div className="news-info">
                  <h3>{art.title}</h3>
                  <a href={art.url} target="_blank" className="read-more">Читать далее →</a>
                </div>
              </div>
            ))}
          </main>
        </div>
      </body>
    </html>
  );
}