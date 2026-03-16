// User-side/pages/LoginAndSignUp.jsx
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:   #F0EFE4;
    --cream2:  #E8E7DA;
    --forest:  #2D5016;
    --forest2: #3D6B20;
    --rust:    #8B3A2A;
    --text:    #2A2A2A;
    --muted:   #6B6B5A;
    --border:  #D0CFC0;
    --white:   #FFFFFF;
    --gold:    #C6A43F;
    --error:   #dc2626;
    --success: #059669;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'DM Sans', sans-serif;
  }

  .auth-container {
    min-height: 100vh;
    display: flex;
    background: linear-gradient(135deg, var(--cream) 0%, var(--cream2) 100%);
    position: relative;
  }

  /* Back button */
  .auth-back-btn {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 100px;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    text-decoration: none;
  }

  .auth-back-btn:hover {
    transform: translateX(-5px);
    border-color: var(--rust);
    color: var(--rust);
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  }

  /* Left side - Branding/Image */
  .auth-brand-side {
    flex: 1;
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest2) 100%);
    display: none;
    position: relative;
    overflow: hidden;
    padding: 60px;
  }

  @media (min-width: 1024px) {
    .auth-brand-side {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .auth-brand-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
  }

  .auth-brand-content {
    position: relative;
    z-index: 1;
    color: white;
    max-width: 500px;
  }

  .auth-brand-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 600;
    margin-bottom: 30px;
    letter-spacing: 1px;
  }

  .auth-brand-logo span {
    color: var(--gold);
    font-style: italic;
  }

  .auth-brand-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 20px;
  }

  .auth-brand-quote {
    font-size: 18px;
    line-height: 1.8;
    opacity: 0.9;
    font-style: italic;
    margin-bottom: 40px;
    border-left: 4px solid var(--gold);
    padding-left: 20px;
  }

  .auth-brand-features {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .auth-brand-feature {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .auth-brand-feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }

  .auth-brand-feature-text {
    font-size: 16px;
    font-weight: 500;
  }

  .auth-brand-footer {
    position: relative;
    z-index: 1;
    color: rgba(255,255,255,0.7);
    font-size: 14px;
  }

  .auth-brand-stats {
    display: flex;
    gap: 40px;
    margin-bottom: 30px;
  }

  .auth-brand-stat {
    text-align: center;
  }

  .auth-brand-stat-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: white;
    margin-bottom: 5px;
  }

  .auth-brand-stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Right side - Form */
  .auth-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
  }

  .auth-form-container {
    width: 100%;
    max-width: 440px;
    background: var(--white);
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    border: 1px solid var(--border);
    animation: slideUpFade 0.5s ease;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .auth-form-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .auth-form-subtitle {
    font-size: 14px;
    color: var(--rust);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .auth-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    color: var(--text);
    margin-bottom: 10px;
  }

  .auth-form-title span {
    color: var(--forest);
    font-style: italic;
  }

  .auth-form-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
  }

  /* Toggle buttons */
  .auth-toggle {
    display: flex;
    background: var(--cream);
    border-radius: 100px;
    padding: 4px;
    margin-bottom: 30px;
    border: 1px solid var(--border);
  }

  .auth-toggle-btn {
    flex: 1;
    padding: 12px;
    border: none;
    background: transparent;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }

  .auth-toggle-btn.active {
    background: var(--white);
    color: var(--forest);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  /* Form */
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .auth-input-group {
    position: relative;
  }

  .auth-input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    width: 20px;
    height: 20px;
  }

  .auth-input {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    transition: all 0.2s;
    color: var(--text);
  }

  .auth-input:focus {
    outline: none;
    border-color: var(--forest);
    box-shadow: 0 0 0 4px rgba(45,80,22,0.1);
  }

  .auth-input::placeholder {
    color: #b0b0b0;
  }

  .auth-password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .auth-password-toggle:hover {
    color: var(--forest);
  }

  .auth-forgot-password {
    text-align: right;
    margin-top: -10px;
  }

  .auth-forgot-link {
    color: var(--muted);
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s;
  }

  .auth-forgot-link:hover {
    color: var(--forest);
    text-decoration: underline;
  }

  .auth-submit-btn {
    background: linear-gradient(135deg, var(--forest), var(--forest2));
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 10px;
    box-shadow: 0 4px 15px rgba(45,80,22,0.3);
  }

  .auth-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(45,80,22,0.4);
  }

  /* Terms */
  .auth-terms {
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    margin-top: 25px;
    line-height: 1.6;
  }

  .auth-terms a {
    color: var(--forest);
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
  }

  .auth-terms a:hover {
    text-decoration: underline;
  }

  /* Error message */
  .auth-error {
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--error);
    font-size: 13px;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  /* Success message */
  .auth-success {
    background: #d1fae5;
    border: 1px solid #a7f3d0;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--success);
    font-size: 13px;
  }

  /* Loading state */
  .auth-submit-btn.loading {
    opacity: 0.7;
    cursor: not-allowed;
    position: relative;
  }

  .auth-submit-btn.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Modal styles for Terms and Privacy */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: var(--white);
    border-radius: 24px;
    max-width: 800px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 40px;
    position: relative;
    animation: slideUp 0.3s ease;
    border: 1px solid var(--border);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--muted);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: var(--cream);
    color: var(--rust);
  }

  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    color: var(--forest);
    margin-bottom: 20px;
    padding-right: 40px;
  }

  .modal-section {
    margin-bottom: 30px;
  }

  .modal-section h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: var(--rust);
    margin-bottom: 10px;
  }

  .modal-section p, .modal-section ul {
    color: var(--text);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .modal-section ul {
    padding-left: 20px;
  }

  .modal-section li {
    margin-bottom: 5px;
  }

  .modal-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    text-align: right;
    color: var(--muted);
    font-size: 12px;
  }

  .modal-accept-btn {
    background: linear-gradient(135deg, var(--forest), var(--forest2));
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 20px;
  }

  .modal-accept-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(45,80,22,0.4);
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .auth-form-container {
      padding: 30px 20px;
    }

    .auth-form-title {
      font-size: 28px;
    }

    .auth-back-btn {
      top: 20px;
      left: 20px;
      padding: 8px 16px;
      font-size: 13px;
    }

    .modal-content {
      padding: 30px 20px;
    }
  }

  /* Phone input hint */
  .input-hint {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
    margin-left: 16px;
  }
`;

// Terms of Service Content Component
const TermsOfService = ({ onClose, onAccept }) => (
  <div className="modal-content">
    <button className="modal-close" onClick={onClose}>×</button>
    <h2 className="modal-title">Terms of Service</h2>
    
    <div className="modal-section">
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing or using Solaz's services, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, please do not use our services.</p>
    </div>

    <div className="modal-section">
      <h3>2. Booking and Reservations</h3>
      <p>All bookings made through Solaz are subject to availability and confirmation. We reserve the right to cancel or modify bookings where circumstances arise beyond our control. You agree to provide accurate and complete information when making reservations.</p>
    </div>

    <div className="modal-section">
      <h3>3. Payment Terms</h3>
      <p>Payments for bookings must be made in full at the time of reservation unless otherwise specified. We accept major credit cards and other payment methods as indicated on our platform. All prices are in Philippine Peso (PHP) unless stated otherwise.</p>
    </div>

    <div className="modal-section">
      <h3>4. Cancellation and Refund Policy</h3>
      <p>Cancellation policies vary by property and room type. Please review the specific cancellation policy provided during the booking process. Refunds, if applicable, will be processed within 10-15 business days.</p>
    </div>

    <div className="modal-section">
      <h3>5. User Responsibilities</h3>
      <ul>
        <li>You must be at least 18 years old to use our services</li>
        <li>You are responsible for maintaining the confidentiality of your account</li>
        <li>You agree not to use our services for any illegal purposes</li>
        <li>You will respect property rules and regulations during your stay</li>
      </ul>
    </div>

    <div className="modal-section">
      <h3>6. Intellectual Property</h3>
      <p>All content on Solaz's platform, including logos, text, images, and software, is the property of Solaz and protected by copyright and other intellectual property laws.</p>
    </div>

    <div className="modal-section">
      <h3>7. Limitation of Liability</h3>
      <p>Solaz shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or any bookings made through our platform.</p>
    </div>

    <div className="modal-section">
      <h3>8. Changes to Terms</h3>
      <p>We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.</p>
    </div>

    <div className="modal-footer">
      <p>Last Updated: March 15, 2026</p>
      {onAccept && (
        <button className="modal-accept-btn" onClick={onAccept}>I Accept</button>
      )}
    </div>
  </div>
);

// Privacy Policy Content Component
const PrivacyPolicy = ({ onClose, onAccept }) => (
  <div className="modal-content">
    <button className="modal-close" onClick={onClose}>×</button>
    <h2 className="modal-title">Privacy Policy</h2>
    
    <div className="modal-section">
      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly, including:</p>
      <ul>
        <li>Name, email address, phone number</li>
        <li>Payment information (processed securely through third-party providers)</li>
        <li>Booking preferences and history</li>
        <li>Communications with our customer service</li>
      </ul>
    </div>

    <div className="modal-section">
      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>Process and manage your bookings</li>
        <li>Communicate about your reservations</li>
        <li>Improve our services and user experience</li>
        <li>Send promotional offers (with your consent)</li>
        <li>Ensure security and prevent fraud</li>
      </ul>
    </div>

    <div className="modal-section">
      <h3>3. Information Sharing</h3>
      <p>We share your information only with:</p>
      <ul>
        <li>Hotels and properties you book (for accommodation purposes)</li>
        <li>Payment processors to complete transactions</li>
        <li>Legal authorities when required by law</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>
    </div>

    <div className="modal-section">
      <h3>4. Data Security</h3>
      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    </div>

    <div className="modal-section">
      <h3>5. Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of marketing communications</li>
      </ul>
    </div>

    <div className="modal-section">
      <h3>6. Cookies and Tracking</h3>
      <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.</p>
    </div>

    <div className="modal-section">
      <h3>7. Third-Party Links</h3>
      <p>Our platform may contain links to third-party websites. We are not responsible for their privacy practices and encourage you to review their policies.</p>
    </div>

    <div className="modal-section">
      <h3>8. Contact Us</h3>
      <p>For privacy-related inquiries, contact our Data Protection Officer at:<br />
      Email: privacy@solaz.com<br />
      Phone: +63 (2) 1234 5678<br />
      Address: 123 Luxury Lane, Makati City, Philippines</p>
    </div>

    <div className="modal-footer">
      <p>Last Updated: March 15, 2026</p>
      {onAccept && (
        <button className="modal-accept-btn" onClick={onAccept}>I Accept</button>
      )}
    </div>
  </div>
);

export default function LoginAndSignup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow numbers and limit to 11 digits
    if (name === 'phone') {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, '');
      // Limit to 11 digits
      const truncatedValue = numericValue.slice(0, 11);
      setFormData(prev => ({
        ...prev,
        [name]: truncatedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    setError('');
  };

  const validateForm = () => {
    if (!isLogin) {
      // Signup validation
      if (!formData.fullName.trim()) {
        setError('Full name is required');
        return false;
      }
      
      // Email validation - must be @gmail.com
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.email.endsWith('@gmail.com')) {
        setError('Only Gmail addresses (@gmail.com) are allowed');
        return false;
      }
      if (!/\S+@gmail\.com$/.test(formData.email)) {
        setError('Please enter a valid Gmail address');
        return false;
      }
      
      // Phone validation - must be exactly 11 digits
      if (!formData.phone.trim()) {
        setError('Phone number is required');
        return false;
      }
      if (formData.phone.length !== 11) {
        setError('Phone number must be exactly 11 digits');
        return false;
      }
      if (!/^\d{11}$/.test(formData.phone)) {
        setError('Phone number must contain only numbers');
        return false;
      }
      
      // Password validation
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      // Terms acceptance
      if (!termsAccepted) {
        setError('You must accept the Terms of Service and Privacy Policy');
        return false;
      }
    } else {
      // Login validation
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.email.endsWith('@gmail.com')) {
        setError('Please use your Gmail address');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Simulate successful login
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/rooms'); // Redirect to rooms page after login
        }, 1500);
      } else {
        // Simulate successful signup
        setSuccess('Account created successfully! Welcome to Solaz.');
        // Reset form after successful signup
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
        setTermsAccepted(false);
        // Optionally switch to login after signup
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 3000);
      }
      setLoading(false);
    }, 1500);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handlePrivacyAccept = () => {
    setTermsAccepted(true);
    setShowPrivacy(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-container">
        {/* Back button */}
        <button className="auth-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Left side - Branding */}
        <div className="auth-brand-side">
          <div className="auth-brand-bg"></div>
          
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
            </div>
            
            <h2 className="auth-brand-title">
              Experience True Filipino Hospitality
            </h2>
            
            <p className="auth-brand-quote">
              "Where every stay becomes a memory, and every guest becomes family."
            </p>

            <div className="auth-brand-features">
              <div className="auth-brand-feature">
                <div className="auth-brand-feature-icon">
                  <Heart size={20} />
                </div>
                <div className="auth-brand-feature-text">
                  Curated luxury experiences across the Philippines
                </div>
              </div>
              
              <div className="auth-brand-feature">
                <div className="auth-brand-feature-icon">
                  <Star size={20} />
                </div>
                <div className="auth-brand-feature-text">
                  5-star service with personalized attention
                </div>
              </div>
              
              <div className="auth-brand-feature">
                <div className="auth-brand-feature-icon">
                  <Lock size={20} />
                </div>
                <div className="auth-brand-feature-text">
                  Secure booking with best price guarantee
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <div className="auth-form-subtitle">WELCOME TO SOLAZ</div>
              <h1 className="auth-form-title">
                <span>Sign</span> {isLogin ? 'In' : 'Up'}
              </h1>
              <p className="auth-form-desc">
                {isLogin 
                  ? 'Access your account to manage bookings and preferences'
                  : 'Create an account to start your luxury journey with us'}
              </p>
            </div>

            {/* Toggle between Login and Signup */}
            <div className="auth-toggle">
              <button
                className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
              >
                Sign In
              </button>
              <button
                className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setSuccess('');
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success messages */}
            {error && (
              <div className="auth-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </div>
            )}

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  {/* Full Name - Signup only */}
                  <div className="auth-input-group">
                    <User className="auth-input-icon" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      className="auth-input"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Phone - Signup only with 11-digit validation */}
                  <div>
                    <div className="auth-input-group">
                      <Phone className="auth-input-icon" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="auth-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength="11"
                        pattern="\d*"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email - Both with Gmail validation */}
              <div>
                <div className="auth-input-group">
                  <Mail className="auth-input-icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="auth-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password - Both */}
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="auth-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password - Signup only */}
              {!isLogin && (
                <div className="auth-input-group">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="auth-input"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {/* Forgot Password - Login only */}
              {isLogin && (
                <div className="auth-forgot-password">
                  <a href="#" className="auth-forgot-link">Forgot password?</a>
                </div>
              )}

              {/* Terms checkbox - Signup only */}
              {!isLogin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="terms" style={{ fontSize: '13px', color: 'var(--text)' }}>
                    I accept the{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Terms */}
            <div className="auth-terms">
              {isLogin ? (
                <>By signing in, you agree to our <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms of Service</a> and{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a></>
              ) : (
                <>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Sign In</a></>
              )}
            </div>
          </div>
        </div>

        {/* Terms of Service Modal */}
        {showTerms && (
          <div className="modal-overlay" onClick={() => setShowTerms(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <TermsOfService 
                onClose={() => setShowTerms(false)} 
                onAccept={!isLogin ? handleTermsAccept : null}
              />
            </div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {showPrivacy && (
          <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <PrivacyPolicy 
                onClose={() => setShowPrivacy(false)} 
                onAccept={!isLogin ? handlePrivacyAccept : null}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}