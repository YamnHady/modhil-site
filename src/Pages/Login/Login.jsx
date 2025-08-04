import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config.js";
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const admintoken = localStorage.getItem("admintoken");
    const token = localStorage.getItem("token");
    if (token || admintoken) {
      window.location.href = '/'; 
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleLogin = async () => {
    try {
      await axios.post(`${API_BASE_URL}admins/login`, { email, password });
      setStep(2);
      setTimer(120);
      toast.success("ادخل رمز التحقق الي وصلك");
    } catch (err) {
      toast.error(err.response?.data?.error || "خطأ في تسجيل الدخول");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}admins/verify`, { email, otp });
      localStorage.setItem("admintoken", res.data.admintoken);
      window.location.reload();
      window.location.href = '/';
      toast.success("اهلا بك من جديد يامشرف 🫡");
    } catch (err) {
      toast.error(err.response?.data?.error || "رمز التحقق غير صحيح");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${API_BASE_URL}admins/resend-otp`, { email });
      setTimer(120);
      toast.success("تم إرسال رمز جديد");
    } catch (err) {
      toast.error(err.response?.data?.error || "خطأ في إعادة إرسال الرمز");
    }
  };

  const handleRequestPasswordReset = async () => {
    try {
      await axios.post(`${API_BASE_URL}admins/request-password-reset`, { email });
      setStep(4);
      setTimer(120);
      toast.success("تم إرسال رمز التحقق لإعادة تعيين كلمة المرور");
    } catch (err) {
      toast.error(err.response?.data?.error || "خطأ في إرسال رمز إعادة تعيين كلمة المرور");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(`${API_BASE_URL}admins/reset-password`, { email, otp, newPassword });
      toast.success("تم تحديث كلمة المرور بنجاح، يرجى تسجيل الدخول");
      setStep(1);
      setOtp("");
      setNewPassword("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "خطأ في تحديث كلمة المرور");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="https://ik.imagekit.io/8wpbbs3fv/photos/logo%20icon.png?updatedAt=1754224442298" alt="Logo" className="auth-logo" />
          <h2>مرحباً بك من جديد</h2>
          <p>هذه الصفحة مخصصة فقط للمشرفين</p>
        </div>

        {step === 1 && (
          <div className="auth-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="auth-btn primary" onClick={handleLogin}>
              دخول
            </button>
            <p className="auth-link" onClick={() => setStep(3)}>
              نسيت كلمة المرور؟
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="auth-form">
            <p className="auth-message">تم إرسال رمز التحقق إلى بريدك الإلكتروني</p>
            <div className="input-group">
              <input
                placeholder="رمز التحقق"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button className="auth-btn primary" onClick={handleVerifyOtp}>
              تحقق
            </button>
            <div className="resend-otp">
              <button
                onClick={handleResendOtp}
                disabled={timer > 0}
                className={`auth-btn secondary ${timer > 0 ? 'disabled' : ''}`}
              >
                إعادة إرسال رمز التحقق
              </button>
              {timer > 0 && (
                <p className="timer">يمكنك إعادة الإرسال خلال: {formatTime(timer)}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="auth-form">
            <p className="auth-message">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
            <div className="input-group">
              <input
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="auth-btn primary" onClick={handleRequestPasswordReset}>
              إرسال رمز التحقق
            </button>
            <p className="auth-link" onClick={() => setStep(1)}>
              العودة لتسجيل الدخول
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="auth-form">
            <p className="auth-message">أدخل رمز التحقق وكلمة المرور الجديدة</p>
            <div className="input-group">
              <input
                placeholder="رمز التحقق"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button className="auth-btn primary" onClick={handleResetPassword}>
              تحديث كلمة المرور
            </button>
            <p className="auth-link" onClick={() => setStep(1)}>
              العودة لتسجيل الدخول
            </p>
            <div className="resend-otp">
              <button
                onClick={handleRequestPasswordReset}
                disabled={timer > 0}
                className={`auth-btn secondary ${timer > 0 ? 'disabled' : ''}`}
              >
                إعادة إرسال رمز التحقق
              </button>
              {timer > 0 && (
                <p className="timer">يمكنك إعادة الإرسال خلال: {formatTime(timer)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}