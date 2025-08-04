import './Footer.css';
import { Link } from 'react-router-dom'; 

const Footer = () => {
  const phoneNumber = '+966500684837';
  const whatsappMessage = 'مذهل! لدي استفسار؟';
  
  const emailAddress = 'contact@modhil.net';
  const emailSubject = 'استفسار عن الخدمات';
  const emailBody = 'السلام عليكم،\n\nأرغب في الاستفسار عن...';

  return (
    <div className="footer">
      <div className="footer-contact">
        <p>للتواصل معنا</p>
      </div>

      <div className="footer-apps">
        {/* رابط البريد الإلكتروني */}
        <a 
          href={`mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            className="footer-apps-mail" 
            src="https://ik.imagekit.io/8wpbbs3fv/photos/mail%20white.png?updatedAt=1754285935952" 
            alt="البريد الإلكتروني" 
          />
        </a>
        
        {/* رابط الواتساب مع رسالة مسبقة */}
        <a 
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            className="footer-apps-whatsapp" 
            src="https://ik.imagekit.io/8wpbbs3fv/photos/whatsapp%20white.png?updatedAt=1754285935761" 
            alt="واتساب" 
          />
        </a>
      </div>

      <div className="footer-links">
        <Link to="/">الرئيسية</Link>
        <Link to="/partner">شركائنا</Link>
        <Link to="/about">عنا</Link>
      </div>

      <div className="footer-rights">
        جميع الحقوق محفوظة © 2025
        <br />
        اصدار الموقع 1.0.0
      </div>
      
      <div className='powerd'>
        <a href="https://modhil.net/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://ik.imagekit.io/8wpbbs3fv/photos/powerd%20by%20white.png?updatedAt=1754285935953" 
            alt="Powerd by modhil-site" 
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;