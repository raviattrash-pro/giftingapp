import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Award, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useUiStore((state) => state.addToast);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: 'Executive Concierge',
    budgetCapacity: '5000',
    avatarUrl: ''
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.email) newErrors.email = 'Corporate email is required';
    if (!formData.password) newErrors.password = 'Secure password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phone: '',
        avatarUrl: formData.avatarUrl || null
      });
      addToast('Membership approved. Welcome to your private conciergery.', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Registration request failed.', 'error');
    }
  };

  return (
    <Card hoverable={false} className="glow-pink-pulse">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '8px' }}>
          {step === 1 ? 'Request Membership' : 'Company Calibration'}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {step === 1 ? 'Step 1 of 2: Create your private credentials.' : 'Step 2 of 2: Setup your business capacity.'}
        </p>
      </div>

      <form onSubmit={handleRegister}>
        {step === 1 ? (
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
              label="Legal Full Name"
              type="text"
              icon={User}
              placeholder="Alexander Sterling"
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
              error={errors.name}
            />

            <Input
              label="Corporate Email Address"
              type="email"
              icon={Mail}
              placeholder="alex@sterlingholdings.com"
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
              onClick={handleNext}
              variant="primary"
              icon={ArrowRight}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Continue Configuration
            </Button>
          </>
        ) : (
          <>
            <Input
              label="Company / Enterprise Name"
              type="text"
              icon={Briefcase}
              placeholder="Sterling Holdings Ltd"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />

            <Select
              label="Your Professional Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'Executive Concierge', label: 'Executive Concierge' },
                { value: 'Department Head', label: 'Department Head / Director' },
                { value: 'People Ops Manager', label: 'People Ops / HR Director' },
                { value: 'CEO / Founder', label: 'CEO / Board Founder' }
              ]}
            />

            <Select
              label="Annual Departmental Budget Capacity"
              value={formData.budgetCapacity}
              onChange={(e) => setFormData({ ...formData, budgetCapacity: e.target.value })}
              options={[
                { value: '2500', label: '$2,500 - $5,000 / year' },
                { value: '5000', label: '$5,000 - $10,000 / year' },
                { value: '15000', label: '$10,000 - $25,000 / year' },
                { value: '50000', label: '$25,000+ / year' }
              ]}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button
                onClick={() => setStep(1)}
                variant="glass"
                icon={ArrowLeft}
                style={{ flex: 1 }}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                loading={isLoading}
                variant="secondary"
                icon={Award}
                style={{ flex: 1 }}
              >
                Submit Request
              </Button>
            </div>
          </>
        )}
      </form>

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
