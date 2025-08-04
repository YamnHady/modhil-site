import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import './Partner.css';

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}partner`);
      const sortedPartners = response.data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setPartners(sortedPartners);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setLoading(false);
    }
  };

  const handlePartnerClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="partner-container">
      <h1 className="partner-title">شركاؤنا</h1>
      <div>
        <h3 className='join'>هل تريد الإنضمام لقائمة الشركاء؟</h3>
        <div className='btn'>
          <a 
              href="/about"
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-link"
            >
              اكتشف المزيد
            </a>
        </div>
      </div>
      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : partners.length === 0 ? (
        <div className="no-partners">لا يوجد شركاء متاحين حالياً</div>
      ) : (
        <div className="partners-grid">
          {partners.map((partner) => (
            <div 
              key={partner._id} 
              className="partner-card"
              onClick={() => handlePartnerClick(partner.link)}
              style={{ cursor: partner.link ? 'pointer' : 'default' }}
            >
              <div className="partner-image-container">
                <img 
                  src={partner.image} 
                  alt={partner.name} 
                  className="partner-image"
                  loading="lazy"
                />
              </div>
              <div className="partner-info">
                <h3>{partner.name}</h3>
                {partner.description && <p>{partner.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Partner;