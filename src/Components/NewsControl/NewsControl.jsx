import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config.js';
import './NewsControl.css';

const NewsControl = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    newsDate: new Date().toISOString().split('T')[0],
    isFeatured: false,
    tags: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(`${API_BASE_URL}news`);
      
      // Handle different response formats
      let newsData = [];
      if (Array.isArray(response.data)) {
        newsData = response.data;
      } else if (response.data && Array.isArray(response.data.news)) {
        newsData = response.data.news;
      } else if (response.data && Array.isArray(response.data.data)) {
        newsData = response.data.data;
      }
      
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error(error.response?.data?.error || 'فشل في تحميل الأخبار');
      setNews([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryImages(prev => [...prev, ...files]);
      setGalleryPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage && !editingId) {
      toast.error('الصورة الرئيسية مطلوبة');
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('newsDate', formData.newsDate);
    formDataToSend.append('isFeatured', formData.isFeatured);
    formDataToSend.append('tags', formData.tags);

    if (mainImage) formDataToSend.append('mainImage', mainImage);
    galleryImages.forEach(img => formDataToSend.append('images', img));

    try {
      const token = localStorage.getItem('admintoken');
      if (editingId) {
        await axios.put(`${API_BASE_URL}news/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('تم تحديث الخبر بنجاح');
      } else {
        await axios.post(`${API_BASE_URL}news`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('تم إضافة الخبر بنجاح');
      }
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingId(newsItem._id);
    setFormData({
      title: newsItem.title,
      details: newsItem.details,
      newsDate: new Date(newsItem.newsDate).toISOString().split('T')[0],
      isFeatured: newsItem.isFeatured,
      tags: newsItem.tags?.join(',') || ''
    });
    setMainImagePreview(newsItem.mainImage);
    setGalleryPreviews(newsItem.images || []);
    setGalleryImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;

    try {
      const token = localStorage.getItem('admintoken');
      await axios.delete(`${API_BASE_URL}news/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('تم حذف الخبر بنجاح');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء الحذف');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      newsDate: new Date().toISOString().split('T')[0],
      isFeatured: false,
      tags: ''
    });
    setMainImage(null);
    setGalleryImages([]);
    setMainImagePreview('');
    setGalleryPreviews([]);
    setEditingId(null);
  };

  const removeGalleryImage = (index) => {
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);

    const newImages = [...galleryImages];
    newImages.splice(index, 1);
    setGalleryImages(newImages);
  };

  return (
    <div className="news-control-container">
      <ToastContainer rtl={true} />
      <h1 className="news-title">إدارة الأخبار</h1>
      
      <div className="news-form-container">
        <form onSubmit={handleSubmit} className="news-form">
          <div className="form-row">
            <div className="form-group">
              <label>الصورة الرئيسية *</label>
              <label htmlFor="main-image" className="file-upload-label">
                {mainImagePreview ? (
                  <img src={mainImagePreview} alt="Main Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>+</span>
                    <p>اختر الصورة الرئيسية</p>
                  </div>
                )}
                <input
                  id="main-image"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="file-input"
                />
              </label>
            </div>

            <div className="form-group">
              <label>صور المعرض (اختياري)</label>
              <label htmlFor="gallery-images" className="file-upload-label multiple">
                {galleryPreviews.length > 0 ? (
                  <div className="gallery-previews">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="gallery-preview-item">
                        <img src={preview} alt={`Gallery ${index}`} />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="add-more-container">
                      <span>+</span>
                      <p>إضافة المزيد</p>
                      <input
                        id="gallery-images"
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryImagesChange}
                        className="file-input"
                        multiple
                      />
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span>+</span>
                    <p>اختر صور المعرض</p>
                    <input
                      id="gallery-images"
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImagesChange}
                      className="file-input"
                      multiple
                    />
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="عنوان الخبر *"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="details"
              placeholder="تفاصيل الخبر *"
              value={formData.details}
              onChange={handleInputChange}
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="date"
                name="newsDate"
                value={formData.newsDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                خبر مميز
              </label>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="tags"
              placeholder="الكلمات الدلالية (مفصولة بفواصل)"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : editingId ? 'تحديث' : 'إضافة'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={resetForm}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="news-list">
        <h2 className="list-title">قائمة الأخبار</h2>
        {isFetching ? (
          <div className="loading-spinner">جاري تحميل الأخبار...</div>
        ) : news.length === 0 ? (
          <p className="no-news">لا توجد أخبار مضافة</p>
        ) : (
          <div className="news-grid">
            {news.map((newsItem) => (
              <div key={newsItem._id} className="news-card">
                <div className="news-image-container">
                  <img 
                    src={newsItem.mainImage} 
                    alt={newsItem.title} 
                    className="news-image"
                  />
                  {newsItem.isFeatured && (
                    <span className="featured-badge">مميز</span>
                  )}
                </div>
                <div className="news-info">
                  <h3>{newsItem.title}</h3>
                  <p className="news-details">
                    {newsItem.details.length > 100 
                      ? `${newsItem.details.substring(0, 100)}...` 
                      : newsItem.details}
                  </p>
                  <p className="news-date">
                    {new Date(newsItem.newsDate).toLocaleDateString('ar-EG')}
                  </p>
                  {newsItem.tags?.length > 0 && (
                    <p className="news-tags">
                      {newsItem.tags.map(tag => `#${tag}`).join(' ')}
                    </p>
                  )}
                  <div className="news-actions">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="action-btn edit-btn"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem._id)}
                      className="action-btn delete-btn"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsControl;