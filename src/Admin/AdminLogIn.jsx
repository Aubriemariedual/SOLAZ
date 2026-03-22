// Admin/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            // Redirect to bookings instead of home
            navigate('/admin/bookings', { replace: true });
          }
        } catch (err) {
          console.error('Error checking auth:', err);
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!form.password.trim()) {
      setError('Password is required.');
      return false;
    }
    return true;
  };

  // Function to create admin user document (for first-time setup)
  const createAdminUserDoc = async (userId, email) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        email: email,
        role: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Admin user document created successfully');
      return true;
    } catch (err) {
      console.error('❌ Failed to create admin user document:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Attempting to sign in with:', form.email);
      
      // 1. Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      console.log('✅ Authentication successful!');
      console.log('User UID:', user.uid);
      console.log('User email:', user.email);

      // 2. Check if user has admin role in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      
      try {
        userDoc = await getDoc(userDocRef);
      } catch (err) {
        // If permission denied, try to create the document
        if (err.code === 'permission-denied') {
          console.log('⚠️ Permission denied. Trying to create user document...');
          const created = await createAdminUserDoc(user.uid, user.email);
          if (created) {
            userDoc = await getDoc(userDocRef);
          } else {
            throw new Error('Unable to create admin profile. Please check Firebase rules.');
          }
        } else {
          throw err;
        }
      }
      
      console.log('📄 Firestore document exists?', userDoc?.exists());

      if (userDoc && userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data from Firestore:', userData);
        console.log('User role:', userData.role);
        
        // Check if the user has admin role
        if (userData.role === 'admin') {
          // Admin login successful - store admin info in localStorage/session
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('adminEmail', user.email);
          localStorage.setItem('adminUID', user.uid);
          
          console.log('✅ Admin role confirmed! Redirecting to Admin Bookings...');
          setSuccess('Access granted. Redirecting to admin dashboard...');
          
          // Immediate redirect with slight delay for success message
          setTimeout(() => {
            navigate('/admin/bookings', { replace: true });
          }, 1000);
        } else {
          // User is logged in but not an admin
          console.log('❌ User is not admin. Role:', userData.role);
          setError('Access denied. Admin privileges required.');
          await signOut(auth);
        }
      } else {
        // User document doesn't exist - create it as admin for first-time setup
        console.log('⚠️ No Firestore document found. Creating admin profile...');
        const created = await createAdminUserDoc(user.uid, user.email);
        
        if (created) {
          console.log('✅ Admin profile created successfully! Redirecting...');
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('adminEmail', user.email);
          localStorage.setItem('adminUID', user.uid);
          setSuccess('Admin profile created! Redirecting to dashboard...');
          
          setTimeout(() => {
            navigate('/admin/bookings', { replace: true });
          }, 1000);
        } else {
          setError('Unable to create admin profile. Please check Firebase configuration.');
          await signOut(auth);
        }
      }
      
    } catch (err) {
      console.error('🔥 Admin login error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Admin account not found. Please check your email or contact administrator.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        case 'permission-denied':
          setError('Permission denied. Please check Firebase Security Rules configuration.');
          break;
        default:
          setError(`Login failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#F4F2EA' }}>

      {/* ── Left Panel ── */}
      <div
        className="flex flex-col justify-center px-12 lg:px-20 w-full lg:w-[50%] xl:w-[45%]"
        style={{ backgroundColor: '#F4F2EA' }}
      >
        <div className="max-w-sm mx-auto w-full">

          {/* Logo */}
          <div className="mb-10">
            <img
              src="/SolazLogo.png"
              alt="Solaz"
              className="h-14 w-auto mb-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/56x56?text=Solaz';
              }}
            />
            <span
              className="text-xs tracking-widest uppercase font-semibold"
              style={{ color: '#A89878', letterSpacing: '0.12em' }}
            >
              Admin Panel
            </span>
          </div>

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-normal mb-0" style={{ color: '#231C0F' }}>
              Hello,{' '}
              <span className="font-light italic" style={{ color: '#2D5016', fontFamily: 'Georgia, serif' }}>
                Welcome Back!
              </span>
            </h1>
            <p className="text-sm mt-2" style={{ color: '#6B6B5A' }}>
              Sign in to manage your resort
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div
              className="flex items-start gap-2 rounded-lg px-4 py-3 mb-5 text-xs animate-[shake_0.28s_ease]"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
            >
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
          )}
          {success && (
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 mb-5 text-xs"
              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#059669' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="relative">
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#B0A992',
                  zIndex: 1
                }} 
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: '#FDFCF7',
                  border: '1.5px solid #D8D4C7',
                  color: '#231C0F',
                  fontFamily: "'DM Sans', sans-serif",
                  paddingLeft: '44px'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#2D5016';
                  e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.08)';
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#D8D4C7';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#FDFCF7';
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#B0A992',
                  zIndex: 1
                }} 
              />
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                className="w-full px-5 py-4 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: '#FDFCF7',
                  border: '1.5px solid #D8D4C7',
                  color: '#231C0F',
                  fontFamily: "'DM Sans', sans-serif",
                  paddingLeft: '44px'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#2D5016';
                  e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.08)';
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#D8D4C7';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#FDFCF7';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center transition-colors duration-150"
                style={{ color: '#B0A992', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2D5016'}
                onMouseLeave={e => e.currentTarget.style.color = '#B0A992'}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Forgot */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-xs transition-colors duration-150"
                style={{ color: '#A89878', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = '#2D5016'}
                onMouseLeave={e => e.currentTarget.style.color = '#A89878'}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-1"
              style={{
                background: loading ? 'rgba(45,80,22,0.6)' : '#2D5016',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#3D6B20'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = '#2D5016'; e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  <Shield size={14} />
                  Log In
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 flex flex-col items-center gap-2" style={{ borderTop: '1px solid #E4E0D4' }}>
            <span className="flex items-center gap-1 text-xs" style={{ color: '#C8C2B0' }}>
              <Shield size={11} /> Restricted access
            </span>
            <button
              className="text-xs transition-colors duration-150"
              style={{ color: '#A89878', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => navigate('/login')}
              onMouseEnter={e => e.currentTarget.style.color = '#2D5016'}
              onMouseLeave={e => e.currentTarget.style.color = '#A89878'}
            >
              ← Back to guest login
            </button>
          </div>

        </div>
      </div>

      {/* ── Right Panel — Hero Image ── */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=85&fit=crop"
          alt="Solaz Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(244,242,234,0.18) 0%, transparent 20%)',
            pointerEvents: 'none',
          }}
        />
      </div>

    </div>
  );
}