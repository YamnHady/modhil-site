import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config.js';
import './PartnerControl.css';

const PartnerControl = () => {
  const [partners, setPartners] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}partner`);
      setPartners(response.data);
    } catch (error) {
      toast.error('فشل في تحميل قائمة الشركاء');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !editingId) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    if (image) formDataToSend.append('image', image);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('link', formData.link);

    try {
      const token = localStorage.getItem('admintoken');
      if (editingId) {
        await axios.put(`${API_BASE_URL}partner/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('تم تحديث بيانات الشريك بنجاح');
      } else {
        await axios.post(`${API_BASE_URL}partner`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('تم إضافة الشريك بنجاح');
      }
      resetForm();
      fetchPartners();
    } catch (error) {
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setEditingId(partner._id);
    setFormData({
      name: partner.name,
      description: partner.description,
      link: partner.link || ''
    });
    if (partner.image) setPreview(partner.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الشريك؟')) return;

    try {
      const token = localStorage.getItem('admintoken');
      await axios.delete(`${API_BASE_URL}partner/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('تم حذف الشريك بنجاح');
      fetchPartners();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      link: ''
    });
    setImage(null);
    setPreview('');
    setEditingId(null);
  };

  return (
    <div className="partner-control-container">
      <ToastContainer rtl={true} />
      <h1 className="partner-title">إدارة الشركاء</h1>
      
      <div className="partner-form-container">
        <form onSubmit={handleSubmit} className="partner-form">
          <div className="form-group">
            <label htmlFor="partner-image" className="file-upload-label">
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>+</span>
                  <p>اختر صورة الشريك</p>
                </div>
              )}
              <input
                id="partner-image"
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
              name="name"
              placeholder="اسم الشريك *"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="وصف الشريك"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <input
              type="url"
              name="link"
              placeholder="رابط الموقع (اختياري)"
              value={formData.link}
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

      <div className="partners-list">
        <h2 className="list-title">قائمة الشركاء</h2>
        {partners.length === 0 ? (
          <p className="no-partners">لا يوجد شركاء مسجلين</p>
        ) : (
          <div className="partners-grid">
            {partners.map((partner) => (
              <div key={partner._id} className="partner-card">
                <div className="partner-image-container">
                  <img 
                    src={partner.image} 
                    alt={partner.name} 
                    className="partner-image"
                  />
                </div>
                <div className="partner-info">
                  <h3>{partner.name}</h3>
                  {partner.description && <p>{partner.description}</p>}
                  {partner.link && (
                    <a 
                      href={partner.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="partner-link"
                    >
                      زيارة الموقع
                    </a>
                  )}
                </div>
                <div className="partner-actions">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="action-btn edit-btn"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(partner._id)}
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

export default PartnerControl;