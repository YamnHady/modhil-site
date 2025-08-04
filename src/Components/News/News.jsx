import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { useNavigate } from 'react-router-dom';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

const fetchNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}news`);
    
    // استخراج المصفوفة من response.data.news
    const newsArray = response.data.news || response.data.data || response.data || [];
    
    const sortedNews = newsArray.sort((a, b) => {
      return new Date(b.newsDate) - new Date(a.newsDate);
    });
    
    setNews(sortedNews);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching news:', error);
    setLoading(false);
  }
};

  const handleNewsClick = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="news-container">
      <h1 className="news-title">الأخبار</h1>
      
      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : news.length === 0 ? (
        <div className="no-news">لا يوجد أخبار متاحة حالياً</div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div 
              key={item._id} 
              className="news-card"
              onClick={() => handleNewsClick(item._id)}
            >
              <div className="news-image-container">
                <img 
                  src={item.mainImage} 
                  alt={item.title} 
                  className="news-image"
                  loading="lazy"
                />
                {item.isFeatured && (
                  <div className="featured-badge">مميز</div>
                )}
              </div>
              <div className="news-info">
                <h3>{item.title}</h3>
                <p className="news-date">
                  {new Date(item.newsDate).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="news-description">
                  {item.details.length > 100 
                    ? `${item.details.substring(0, 100)}...` 
                    : item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;