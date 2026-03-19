'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './globals.css';

// Инициализация Supabase
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
    const GNEWS_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
    
    if (GNEWS_KEY) {
      fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=12&apikey=${GNEWS_KEY}`)
        .then(res => res.json())
        .then(data => {
          setGlobalNews(data.articles || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Ошибка API:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Ошибка: " + error.message);
    else alert("Регистрация успешна!");
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Ошибка: " + error.message);
    else setUser(data.user);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">News<span>Hub</span></h1>
        <div className="auth-box">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Войти</button>
          <button className="reg-btn" onClick={handleSignUp}>Регистрация</button>
        </div>
      </header>

      <main className="content">
        <h2 className="section-title">Топ новостей</h2>
        {loading ? (
          <div className="loader">Загружаем...</div>
        ) : (
          <div className="news-grid">
            {globalNews.map((article, index) => (
              <div key={index} className="news-card">
                <div className="card-image">
                  <img src={article.image || 'https://via.placeholder.com/400x200'} alt={article.title} />
                </div>
                <div className="card-content">
                  <span className="source">{article.source?.name}</span>
                  <h3>{article.title}</h3>
                  <p>{article.description?.substring(0, 100)}...</p>
                  <a href={article.url} target="_blank" className="read-more">Читать далее</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}