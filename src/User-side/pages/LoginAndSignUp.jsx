// User-side/pages/LoginAndSignUp.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Heart, Star, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../../firebase";

// ─── Tailwind custom font injection ───────────────────────────────────────────
const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
`;

// ─── Modal: Terms of Service ───────────────────────────────────────────────────
const TermsOfService = ({ onClose, onAccept }) => (
  <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-10 relative shadow-2xl border border-stone-100">
    <button
      onClick={onClose}
      className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-rose-600 transition-all text-xl leading-none"
    >
      ×
    </button>
    <h2 className="font-['Playfair_Display'] text-3xl text-emerald-800 mb-7">Terms of Service</h2>

    {[
      { title: '1. Acceptance of Terms', body: "By accessing or using Solaz's services, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, please do not use our services." },
      { title: '2. Booking and Reservations', body: "All bookings made through Solaz are subject to availability and confirmation. We reserve the right to cancel or modify bookings where circumstances arise beyond our control. You agree to provide accurate and complete information when making reservations." },
      { title: '3. Payment Terms', body: "Payments for bookings must be made in full at the time of reservation unless otherwise specified. We accept major credit cards and other payment methods as indicated on our platform. All prices are in Philippine Peso (PHP) unless stated otherwise." },
      { title: '4. Cancellation and Refund Policy', body: "Cancellation policies vary by property and room type. Please review the specific cancellation policy provided during the booking process. Refunds, if applicable, will be processed within 10–15 business days." },
    ].map(s => (
      <div key={s.title} className="mb-6">
        <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">{s.title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{s.body}</p>
      </div>
    ))}

    <div className="mb-6">
      <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">5. User Responsibilities</h3>
      <ul className="list-disc list-inside text-stone-600 text-sm leading-relaxed space-y-1">
        <li>You must be at least 18 years old to use our services</li>
        <li>You are responsible for maintaining the confidentiality of your account</li>
        <li>You agree not to use our services for any illegal purposes</li>
        <li>You will respect property rules and regulations during your stay</li>
      </ul>
    </div>

    {[
      { title: '6. Intellectual Property', body: "All content on Solaz's platform, including logos, text, images, and software, is the property of Solaz and protected by copyright and other intellectual property laws." },
      { title: '7. Limitation of Liability', body: "Solaz shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or any bookings made through our platform." },
      { title: '8. Changes to Terms', body: "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms." },
    ].map(s => (
      <div key={s.title} className="mb-6">
        <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">{s.title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{s.body}</p>
      </div>
    ))}

    <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
      <p className="text-stone-400 text-xs">Last Updated: March 15, 2026</p>
      {onAccept && (
        <button
          onClick={onAccept}
          className="bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          I Accept
        </button>
      )}
    </div>
  </div>
);

// ─── Modal: Privacy Policy ─────────────────────────────────────────────────────
const PrivacyPolicy = ({ onClose, onAccept }) => (
  <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-10 relative shadow-2xl border border-stone-100">
    <button
      onClick={onClose}
      className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-rose-600 transition-all text-xl leading-none"
    >
      ×
    </button>
    <h2 className="font-['Playfair_Display'] text-3xl text-emerald-800 mb-7">Privacy Policy</h2>

    <div className="mb-6">
      <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">1. Information We Collect</h3>
      <ul className="list-disc list-inside text-stone-600 text-sm leading-relaxed space-y-1">
        <li>Name, email address, phone number</li>
        <li>Payment information (processed securely through third-party providers)</li>
        <li>Booking preferences and history</li>
        <li>Communications with our customer service</li>
      </ul>
    </div>

    <div className="mb-6">
      <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">2. How We Use Your Information</h3>
      <ul className="list-disc list-inside text-stone-600 text-sm leading-relaxed space-y-1">
        <li>Process and manage your bookings</li>
        <li>Communicate about your reservations</li>
        <li>Improve our services and user experience</li>
        <li>Send promotional offers (with your consent)</li>
        <li>Ensure security and prevent fraud</li>
      </ul>
    </div>

    {[
      { title: '3. Information Sharing', body: "We share your information only with hotels and properties you book, payment processors to complete transactions, and legal authorities when required by law. We do not sell your personal information to third parties." },
      { title: '4. Data Security', body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." },
    ].map(s => (
      <div key={s.title} className="mb-6">
        <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">{s.title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{s.body}</p>
      </div>
    ))}

    <div className="mb-6">
      <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">5. Your Rights</h3>
      <ul className="list-disc list-inside text-stone-600 text-sm leading-relaxed space-y-1">
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of marketing communications</li>
      </ul>
    </div>

    {[
      { title: '6. Cookies and Tracking', body: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings." },
      { title: '7. Third-Party Links', body: "Our platform may contain links to third-party websites. We are not responsible for their privacy practices and encourage you to review their policies." },
    ].map(s => (
      <div key={s.title} className="mb-6">
        <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">{s.title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{s.body}</p>
      </div>
    ))}

    <div className="mb-6">
      <h3 className="font-['Playfair_Display'] text-lg text-rose-700 mb-2">8. Contact Us</h3>
      <p className="text-stone-600 text-sm leading-relaxed">
        Email: privacy@solaz.com<br />
        Phone: +63 (2) 1234 5678<br />
        Address: 123 Luxury Lane, Makati City, Philippines
      </p>
    </div>

    <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
      <p className="text-stone-400 text-xs">Last Updated: March 15, 2026</p>
      {onAccept && (
        <button
          onClick={onAccept}
          className="bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          I Accept
        </button>
      )}
    </div>
  </div>
);

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, rightSlot, hint, children, ...rest }) => (
  <div>
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      <input
        className="w-full pl-11 pr-12 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400
                   focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10
                   disabled:opacity-50 transition-all duration-200 font-['Outfit']"
        {...rest}
      />
      {rightSlot}
    </div>
    {hint && <p className="mt-1.5 ml-1 text-[11px] text-stone-400">{hint}</p>}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LoginAndSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get the return URL from location state (where to redirect after login)
  // FIXED: Check for returnTo from location state
  const from = location.state?.from?.pathname || location.state?.returnTo || '/selectroom';

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const num = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: num }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.fullName.trim()) return setError('Full name is required'), false;
      if (!formData.email.trim()) return setError('Email is required'), false;
      if (!formData.email.endsWith('@gmail.com')) return setError('Only Gmail addresses (@gmail.com) are allowed'), false;
      if (!/\S+@gmail\.com$/.test(formData.email)) return setError('Please enter a valid Gmail address'), false;
      if (!formData.phone.trim()) return setError('Phone number is required'), false;
      if (formData.phone.length !== 11) return setError('Phone number must be exactly 11 digits'), false;
      if (!/^\d{11}$/.test(formData.phone)) return setError('Phone number must contain only numbers'), false;
      if (formData.password.length < 8) return setError('Password must be at least 8 characters long'), false;
      if (formData.password !== formData.confirmPassword) return setError('Passwords do not match'), false;
      if (!termsAccepted) return setError('You must accept the Terms of Service and Privacy Policy'), false;
    } else {
      if (!formData.email.trim()) return setError('Email is required'), false;
      if (!formData.email.endsWith('@gmail.com')) return setError('Please use your Gmail address'), false;
      if (!formData.password) return setError('Password is required'), false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // LOGIN - Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('User logged in:', userCredential.user);
        
        // Store user info in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', userCredential.user.email);
        localStorage.setItem('userName', userCredential.user.displayName || formData.email.split('@')[0]);
        
        setSuccess('Login successful! Redirecting...');
        
        // FIXED: Redirect to selectroom page after successful login
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        // SIGN UP - Create new account
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.fullName });
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
          uid: userCredential.user.uid,
        });
        console.log('User signed up:', userCredential.user);
        
        // Auto-login after signup
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', userCredential.user.email);
        localStorage.setItem('userName', formData.fullName);
        
        setSuccess('Account created successfully! Redirecting...');
        
        // FIXED: Redirect to selectroom page after successful signup
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      const map = {
        'auth/user-not-found': 'No account found with this email. Please sign up first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account already exists with this email. Please sign in instead.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/invalid-email': 'Invalid email address format.',
      };
      setError(map[err.code] || err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTermsAccept = () => { setTermsAccepted(true); setShowTerms(false); };
  const handlePrivacyAccept = () => { setTermsAccepted(true); setShowPrivacy(false); };

  const eyeBtn = (show, setShow) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-700 transition-colors"
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <>
      <style>{FONT_IMPORT}</style>

      <div className="min-h-screen flex font-['Outfit'] bg-stone-50">

        {/* ── Left brand panel ── */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden bg-emerald-950 p-14">
          {/* photo overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80')" }}
          />
          {/* subtle grain */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
          />

          {/* top logo */}
          <div className="relative z-10">
            <span className="font-['Playfair_Display'] text-white text-3xl font-semibold tracking-widest">SOLAZ</span>
          </div>

          {/* center copy */}
          <div className="relative z-10 space-y-8">
            <h2 className="font-['Playfair_Display'] text-white text-5xl leading-[1.15]">
              Experience True<br /><em>Filipino</em> Hospitality
            </h2>
            <p className="text-emerald-200 text-base leading-relaxed italic border-l-2 border-amber-400 pl-5 max-w-sm">
              "Where every stay becomes a memory, and every guest becomes family."
            </p>

            <div className="space-y-4 pt-2">
              {[
                { icon: Heart, text: 'Curated luxury experiences across the Philippines' },
                { icon: Star, text: '5-star service with personalized attention' },
                { icon: ShieldCheck, text: 'Secure booking with best price guarantee' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-amber-300" />
                  </div>
                  <span className="text-stone-200 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* bottom tagline */}
          <div className="relative z-10">
            <p className="text-emerald-400 text-xs tracking-widest uppercase">Since 2019 · Philippines</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative">

          {/* back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-7 left-7 flex items-center gap-2 text-stone-500 hover:text-emerald-800 text-sm font-medium transition-all hover:-translate-x-1 group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>

          <div className="w-full max-w-[400px] animate-[fadeUp_0.4s_ease_both]">

            {/* heading */}
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold tracking-[3px] text-amber-600 uppercase mb-3">Welcome to Solaz</p>
              <h1 className="font-['Playfair_Display'] text-4xl text-stone-800">
                {isLogin ? <>Sign <em>In</em></> : <>Sign <em>Up</em></>}
              </h1>
              <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                {isLogin
                  ? 'Access your account to manage bookings and preferences'
                  : 'Create an account to start your luxury journey with us'}
              </p>
            </div>

            {/* toggle */}
            <div className="flex bg-stone-100 border border-stone-200 rounded-2xl p-1 mb-7">
              {['Sign In', 'Sign Up'].map((label, i) => {
                const active = isLogin ? i === 0 : i === 1;
                return (
                  <button
                    key={label}
                    onClick={() => { setIsLogin(i === 0); setError(''); setSuccess(''); }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                      ${active
                        ? 'bg-white text-emerald-800 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* alerts */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 animate-[shake_0.3s_ease]">
                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-5">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <>
                  <InputField
                    icon={User}
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <InputField
                    icon={Phone}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    maxLength="11"
                    inputMode="numeric"
                    hint="Enter 11-digit mobile number"
                  />
                </>
              )}

              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />

              <InputField
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                rightSlot={eyeBtn(showPassword, setShowPassword)}
              />

              {!isLogin && (
                <InputField
                  icon={Lock}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  rightSlot={eyeBtn(showConfirmPassword, setShowConfirmPassword)}
                />
              )}

              {isLogin && (
                <div className="text-right -mt-1">
                  <a href="#" className="text-xs text-stone-400 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-start gap-3 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                  />
                  <span className="text-xs text-stone-500 leading-relaxed">
                    I accept the{' '}
                    <button type="button" onClick={() => setShowTerms(true)} className="text-emerald-700 font-medium hover:underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" onClick={() => setShowPrivacy(true)} className="text-emerald-700 font-medium hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-3.5 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-200
                  bg-emerald-800 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-800/20
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
                  ${loading ? 'relative' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Please wait…
                  </span>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* bottom link */}
            <p className="mt-6 text-center text-xs text-stone-400">
              {isLogin ? (
                <>
                  By signing in, you agree to our{' '}
                  <button onClick={() => setShowTerms(true)} className="text-stone-500 hover:text-emerald-700 transition-colors">Terms</button>
                  {' '}and{' '}
                  <button onClick={() => setShowPrivacy(true)} className="text-stone-500 hover:text-emerald-700 transition-colors">Privacy Policy</button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setIsLogin(true)} className="text-emerald-700 font-semibold hover:underline">Sign In</button>
                </>
              )}
            </p>

          </div>
        </div>

        {/* ── Modals ── */}
        {showTerms && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease]"
            onClick={() => setShowTerms(false)}
          >
            <div onClick={e => e.stopPropagation()}>
              <TermsOfService onClose={() => setShowTerms(false)} onAccept={!isLogin ? handleTermsAccept : null} />
            </div>
          </div>
        )}

        {showPrivacy && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease]"
            onClick={() => setShowPrivacy(false)}
          >
            <div onClick={e => e.stopPropagation()}>
              <PrivacyPolicy onClose={() => setShowPrivacy(false)} onAccept={!isLogin ? handlePrivacyAccept : null} />
            </div>
          </div>
        )}

      </div>

      {/* keyframe animations (not covered by Tailwind base) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0);  }
          25%      { transform: translateX(-5px); }
          75%      { transform: translateX(5px);  }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}