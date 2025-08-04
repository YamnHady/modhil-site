import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className='About'>
      <div className="about-section">
        <h2>للتواصل معنا</h2>
        <div className="contact-method">
          <p>عبر الواتس آب أو الإتصال</p>
          <a href="https://api.whatsapp.com/message/N4VWEUZLFJMDL1?autoload=1&app_absent=0">966500684837+</a>
        </div>
        
        <div className="contact-method">
          <p>عبر البريد الإلكتروني</p>
          <a href="mailto:contact@modhil.net">contact@modhil.net</a>
        </div>
      </div>
      
      <div className="about-section">
        <h1>من نحن؟</h1>
        <p className="about-text">
        نقدم خدمات عديدة وفريدة, برمجة المواقع الإلكترونية وإخراجها مع صيانة و ضمان طوال مدة الخدمة, لدينا خدمات تصميم الهويات البصرية و تصميم الأطقم الرياضية, يمكنكم الإستفسار عبر ارقام التواصل أو البريد الإلكتروني في الموقع أعلاه, <strong>وفي الأسعار لا تقلق!</strong>
        </p>
      </div>
    </div>
  )
}

export default About