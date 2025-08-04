import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config.js';
import './NewsDetails.css';

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}news/${id}`);
        setNews(response.data.news);
        setMainImage(response.data.news.mainImage);
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء جلب تفاصيل الخبر');
        setLoading(false);
        console.error(err);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!news) {
    return <div className="no-news">الخبر غير موجود</div>;
  }

  return (
    <div className="news-details-container">
      <div className="news-images-section">
        <div className="main-image-container">
          <img 
            src={mainImage} 
            alt={news.title} 
            className="main-image"
          />
        </div>
        
        {news.images && news.images.length > 0 && (
          <div className="thumbnails-container">
            {[news.mainImage, ...news.images].map((image, index) => (
              <div 
                key={index} 
                className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
                <img 
                  src={image} 
                  alt={`thumbnail-${index}`} 
                  className="thumbnail-image"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="news-content">
        <h1 className="news-title">{news.title}</h1>
        
        <div className="news-meta">
          <span className="news-date">
            {new Date(news.newsDate).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>        
        <div className="news-description">
          {news.details.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;