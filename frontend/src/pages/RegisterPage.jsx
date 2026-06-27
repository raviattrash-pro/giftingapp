import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import AnimatedAvatar from '../components/ui/AnimatedAvatar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const verifyRegistration = useAuthStore((state) => state.verifyRegistration);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useUiStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatarUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: reader.result
        }));
        addToast('Avatar uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email or phone number is required';
    if (!formData.password) newErrors.password = 'Secure password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phone: '',
        avatarUrl: formData.avatarUrl || null
      });
      addToast(response.message || 'Registration successful. Check console for OTP.', 'success');
      setStep(2);
    } catch (err) {
      addToast(err.message || 'Registration request failed.', 'error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      addToast('Please enter a valid 6-digit OTP', 'error');
      return;
    }
    
    try {
      await verifyRegistration(formData.email, otp);
      addToast('Email verified. Welcome to your private conciergery.', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'OTP Verification failed.', 'error');
    }
  };

  return (
    <Card hoverable={false} className="glow-pink-pulse">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '8px' }}>
          Request Membership
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Create your private credentials.
        </p>
      </div>

      {step === 1 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  await googleLogin(credentialResponse.credential);
                  addToast('Membership approved via Google.', 'success');
                  navigate('/');
                } catch (err) {
                  addToast(err.message || 'Google Login failed.', 'error');
                }
              }}
              onError={() => {
                addToast('Google Login Failed', 'error');
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0' }} />
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', padding: '0 10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>or</span>
          </div>

        <form onSubmit={handleRegister}>
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <AnimatedAvatar src={formData.avatarUrl} name={formData.name || 'GUEST'} size="lg" />
              <label 
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Upload photo or enjoy our custom animated avatar.
              </span>
            </div>

            <Input
              label="Name"
              type="text"
              icon={User}
              placeholder="Alexander Sterling"
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
              error={errors.name}
            />

            <Input
              label="Email or Phone Number"
              type="text"
              icon={Mail}
              placeholder="alex@sterlingholdings.com or +1234567890"
              value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
              error={errors.email}
            />

            <Input
              label="Secure Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
              error={errors.password}
            />

            <Button
              type="submit"
              loading={isLoading}
              variant="primary"
              icon={Award}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Submit Request
            </Button>
          </>
        </form>
        </>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter the 6-digit code sent to <strong>{formData.email}</strong>
          </div>
          <Input
            label="Verification Code (OTP)"
            type="text"
            icon={Lock}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <Button
            type="submit"
            loading={isLoading}
            variant="primary"
            style={{ width: '100%', marginTop: '16px' }}
          >
            Verify & Continue
          </Button>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Back to Registration
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem' }}>
          Already have an invitation?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default RegisterPage;
