'use client';
import React from 'react'; // Добавили явный импорт React
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [globalNews, setGlobalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Этот хук теперь импортирован правильно и не вызовет ошибку
  useEffect(() => {
    const GNEWS_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
    if (GNEWS_KEY) {
      fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${GNEWS_KEY}`)
        .then(res => res.json())
        .then(data => {
          setGlobalNews(data.articles || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">News<span>Hub</span></h1>
        <div className="auth-box">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => alert('В разработке')}>Войти</button>
        </div>
      </header>
      <main className="news-grid">
        {loading ? <p>Загрузка...</p> : globalNews.map((art, i) => (
          <div key={i} className="news-card">
            <img src={art.image} alt="" />
            <h3>{art.title}</h3>
            <a href={art.url} target="_blank">Подробнее</a>
          </div>
        ))}
      </main>
    </div>
  );
}