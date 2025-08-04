import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config.js';
import './Highlight.css';

const Highlight = () => {
  const [highlights, setHighlights] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchHighlights();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && highlights.length > 0) {
        nextSlide();
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [isHovered, highlights]);

  const fetchHighlights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}highlights`);
      const data = await response.json();
      
      // ترتيب الصور من الأقدم إلى الأحدث حسب التاريخ
      const sortedHighlights = data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      
      setHighlights(sortedHighlights);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    }
  };

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === highlights.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 200);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? highlights.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 200);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 200);
    }
  };

  if (highlights.length === 0) return null;

  const currentHighlight = highlights[currentIndex];

  return (
    <div 
      className="highlight-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`highlight-slide ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <img 
          src={currentHighlight.image} 
          alt="Highlight" 
          className="highlight-image"
          loading="lazy"
        />
        
        {currentHighlight.link && (
          <a 
            href={currentHighlight.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="highlight-link"
          >
            اكتشف المزيد
          </a>
        )}
      </div>

      <div className={`highlight-controls ${isHovered ? 'visible' : ''}`}>
        <div className="highlight-dots-container">
          {highlights.map((_, index) => (
            <button
              key={index}
              className={`highlight-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`انتقل إلى الشريحة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highlight;