import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../../config.js';
import './HighlightControl.css';

const HighlightControl = () => {
  const [highlights, setHighlights] = useState([]);
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}highlights`);
      setHighlights(response.data);
    } catch (error) {
      toast.error('فشل في تحميل الهايلايتس');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('link', link);

    try {
      const token = localStorage.getItem('admintoken');
      await axios.post(`${API_BASE_URL}highlights`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('تم إضافة الهايلايت بنجاح');
      setImage(null);
      setLink('');
      setPreview('');
      fetchHighlights();
    } catch (error) {
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء الإضافة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الهايلايت؟')) return;

    try {
      const token = localStorage.getItem('admintoken');
      await axios.delete(`${API_BASE_URL}highlights/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('تم الحذف بنجاح');
      fetchHighlights();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div className="highlight-control-container">
      <ToastContainer rtl={true} />
      <h1 className="highlight-title">إدارة العروض</h1>
      
      <div className="highlight-form-container">
        <form onSubmit={handleSubmit} className="highlight-form">
          <div className="form-group">
            <label htmlFor="image" className="file-upload-label">
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>+</span>
                  <p>اختر صورة</p>
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </label>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="رابط الهايلايت (اختياري)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="link-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'جاري الإرسال...' : 'إضافة هايلايت'}
          </button>
        </form>
      </div>

      <div className="highlights-list">
        <h2 className="list-title">العروض المضافة</h2>
        {highlights.length === 0 ? (
          <p className="no-highlights">لا توجد عروض مضافة</p>
        ) : (
          <div className="highlights-grid">
            {highlights.map((highlight) => (
              <div key={highlight._id} className="highlight-item">
                <img 
                  src={highlight.image} 
                  alt="Highlight" 
                  className="highlight-thumbnail"
                />
                <div className="highlight-actions">
                  {highlight.link && (
                    <a 
                      href={highlight.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-btn view-btn"
                    >
                      عرض الرابط
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(highlight._id)}
                    className="action-btn delete-btn"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightControl;