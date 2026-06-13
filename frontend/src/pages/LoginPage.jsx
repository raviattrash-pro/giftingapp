import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useUiStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password);
      addToast('Welcome back to Louvion Hampers. Your private portal is ready.', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <Card hoverable={false} className="glow-purple-pulse">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '8px' }}>Authorized Access</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Please sign in to access your premium gifting portal.
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <Input
          label="Corporate Email Address"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
          error={errors.email}
        />

        <Input
          label="Portal Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
          error={errors.password}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} defaultChecked />
            Keep session secured
          </label>
          <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Forgot Password?</Link>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          variant="primary"
          icon={LogIn}
          style={{ width: '100%' }}
        >
          Verify Credentials
        </Button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem' }}>
          New to the salon?{' '}
          <Link to="/register" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
            Request Membership Invitation
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginPage;
