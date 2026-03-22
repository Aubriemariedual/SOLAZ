// BookNow.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

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
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .booknow-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    position: relative;
  }

  .booknow-back-btn {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 20;
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
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    text-decoration: none;
  }

  .booknow-back-btn:hover {
    transform: translateX(-5px);
    border-color: var(--rust);
    color: var(--rust);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }

  .bn-hero {
    background: linear-gradient(135deg, var(--forest), var(--forest2));
    padding: 60px 40px 50px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .bn-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 90% at 50% 140%, rgba(198,164,63,0.18) 0%, transparent 65%);
    pointer-events: none;
  }

  .bn-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(-55deg, transparent, transparent 30px, rgba(255,255,255,0.018) 30px, rgba(255,255,255,0.018) 31px);
    pointer-events: none;
  }

  .bn-hero-label {
    position: relative;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }

  .bn-hero-title {
    position: relative;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
  }

  .bn-hero-subtitle {
    position: relative;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  .bn-hero-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 16px;
    position: relative;
  }

  .bn-hero-line {
    width: 48px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(198,164,63,0.55));
  }

  .bn-hero-line-right {
    background: linear-gradient(270deg, transparent, rgba(198,164,63,0.55));
  }

  .bn-hero-dot {
    width: 6px;
    height: 6px;
    background: var(--gold);
    transform: rotate(45deg);
    opacity: 0.8;
  }

  .stepper-container {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 20px 32px;
  }

  .stepper {
    display: flex;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: var(--border);
    margin: 0 4px;
    transition: background 0.3s;
  }

  .step-connector.done {
    background: var(--forest2);
  }

  .step-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    font-weight: 600;
    transition: all 0.3s;
    z-index: 10;
  }

  .step-circle.active {
    background: var(--forest);
    color: white;
    box-shadow: 0 0 0 4px rgba(45,80,22,0.15);
  }

  .step-circle.done {
    background: var(--forest2);
    color: white;
  }

  .step-circle.inactive {
    background: var(--cream);
    border: 2px solid var(--border);
    color: var(--muted);
  }

  .step-label {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    white-space: nowrap;
  }

  .step-label.active {
    color: var(--forest);
  }

  .step-label.done {
    color: var(--forest2);
  }

  .step-label.inactive {
    color: #9B9B8A;
  }

  .bn-main {
    max-width: 672px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  .bn-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(45,80,22,0.08);
    overflow: hidden;
    animation: cardIn 0.38s ease both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .bn-card-content {
    padding: 28px 32px;
  }

  @media (max-width: 640px) {
    .bn-card-content {
      padding: 20px 24px;
    }
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--forest);
  }

  .section-divider {
    width: 40px;
    height: 3px;
    background: var(--gold);
    border-radius: 4px;
    margin-top: 8px;
    margin-bottom: 28px;
  }

  .section-label-sm {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #9B9B8A;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .field-label svg {
    color: var(--forest2);
    width: 12px;
    height: 12px;
  }

  .input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 0.88rem;
    color: var(--text);
    background: #F8F7F2;
    transition: all 0.2s;
    outline: none;
    font-family: 'DM Sans', sans-serif;
  }

  .input:focus {
    border-color: var(--forest);
    background: white;
    box-shadow: 0 0 0 3px rgba(45,80,22,0.1);
  }

  .input::placeholder {
    color: #B0AF9E;
  }

  .error-message {
    font-size: 0.72rem;
    color: var(--rust);
    font-weight: 500;
    margin-top: 4px;
  }

  .phone-input-group {
    display: flex;
  }

  .phone-prefix {
    display: flex;
    align-items: center;
    padding: 0 14px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-right: none;
    border-radius: 12px 0 0 12px;
    font-size: 0.82rem;
    color: var(--muted);
    font-weight: 600;
  }

  .phone-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-left: none;
    border-radius: 0 12px 12px 0;
    font-size: 0.88rem;
    color: var(--text);
    background: #F8F7F2;
    transition: all 0.2s;
    outline: none;
  }

  .phone-input:focus {
    border-color: var(--forest);
    background: white;
    box-shadow: 0 0 0 3px rgba(45,80,22,0.1);
  }

  select.input {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B8A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
  }

  textarea.input {
    resize: vertical;
    min-height: 80px;
  }

  .summary-card {
    background: var(--forest);
    border-radius: 16px;
    padding: 24px;
    margin-top: 32px;
    position: relative;
    overflow: hidden;
  }

  .summary-card::before {
    content: '';
    position: absolute;
    right: -40px;
    bottom: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    pointer-events: none;
  }

  .summary-card::after {
    content: '';
    position: absolute;
    left: -24px;
    top: -24px;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: rgba(198,164,63,0.1);
    pointer-events: none;
  }

  .summary-label {
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    position: relative;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .summary-row-key {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.55);
  }

  .summary-row-value {
    font-size: 0.88rem;
    font-weight: 500;
    color: rgba(255,255,255,0.9);
  }

  .summary-divider {
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 16px 0 16px;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .summary-total-label {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .summary-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
  }

  .section-card {
    background: #F8F7F2;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
  }

  .section-card-title {
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #9B9B8A;
    margin-bottom: 16px;
  }

  .review-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 640px) {
    .review-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .review-item-label {
    font-size: 0.63rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #9B9B8A;
    margin-bottom: 4px;
  }

  .review-item-value {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text);
  }

  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #F8F7F2;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-top: 16px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .terms-checkbox:hover {
    border-color: rgba(45,80,22,0.3);
  }

  .terms-checkbox input {
    accent-color: var(--forest);
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .terms-checkbox-text {
    font-size: 0.83rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .terms-checkbox-text a {
    color: var(--rust);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    font-weight: 600;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--forest), var(--forest2));
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 0.87rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--forest2), var(--forest));
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45,80,22,0.25);
  }

  .btn-primary:disabled {
    background: var(--border);
    color: #9B9B8A;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 0.87rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    border-color: var(--muted);
    color: var(--text);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.22s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-container {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 28px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
    animation: modalUp 0.28s ease;
  }

  @keyframes modalUp {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--forest);
  }

  .modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: #F8F7F2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--muted);
    font-size: 0.75rem;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: var(--cream2);
    color: var(--text);
  }

  .modal-booking-details {
    background: #F8F7F2;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin: 16px 0 20px;
  }

  .modal-room-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--forest);
    margin-bottom: 4px;
  }

  .modal-dates {
    font-size: 0.82rem;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .modal-stay-info {
    font-size: 0.82rem;
    color: var(--muted);
  }

  .modal-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 12px;
    margin-top: 12px;
  }

  .modal-total-label {
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9B9B8A;
  }

  .modal-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--rust);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }

  .terms-list {
    margin: 16px 0 24px;
  }

  .terms-item {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
  }

  .terms-check {
    color: var(--forest);
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .terms-text {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mt-4 { margin-top: 16px; }
  .mt-6 { margin-top: 24px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .pt-4 { padding-top: 16px; }
  .pt-6 { padding-top: 24px; }
  .border-top { border-top: 1px solid #EBEBDF; }

  .react-datepicker-wrapper { width: 100%; }
  .react-datepicker__input-container input { width: 100%; }

  @media (max-width: 768px) {
    .booknow-back-btn {
      top: 20px;
      left: 20px;
      padding: 8px 16px;
      font-size: 13px;
    }
  }

  .loading-spinner {
    text-align: center;
    padding: 60px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border);
    border-top-color: var(--forest);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
  }

  .empty-state-icon {
    font-size: 64px;
    opacity: 0.3;
    margin-bottom: 20px;
  }

  .empty-state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    color: var(--text);
    margin-bottom: 10px;
  }

  .empty-state-text {
    color: var(--muted);
    margin-bottom: 24px;
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .success-icon {
    animation: scaleIn 0.3s ease-out;
  }
`;

const STEPS = ["Dates", "Guest Info", "Confirm"];

function Stepper({ step }) {
  return (
    <div className="stepper-container">
      <div className="stepper">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <React.Fragment key={n}>
              {i > 0 && (
                <div className={`step-connector ${done ? 'done' : ''}`} />
              )}
              <div className="step-item">
                <div className={`step-circle ${active ? 'active' : done ? 'done' : 'inactive'}`}>
                  {done ? <FaCheckCircle size={13} /> : n}
                </div>
                <span className={`step-label ${active ? 'active' : done ? 'done' : 'inactive'}`}>
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {icon && <span>{icon}</span>}
          {label}
        </label>
      )}
      {children}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`section-card ${className}`}>
      <p className="section-card-title">{title}</p>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <p className="review-item-label">{label}</p>
      <p className="review-item-value">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BookNow() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedRoom = state?.selectedRoom;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState(
    state?.checkInDate ? new Date(state.checkInDate) : null
  );
  const [checkOutDate, setCheckOutDate] = useState(
    state?.checkOutDate ? new Date(state.checkOutDate) : null
  );
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [numberOfGuests, setNumberOfGuests] = useState(state?.guests || 1);
  const [bookedDates, setBookedDates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    specialRequest: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const diff = checkOutDate - checkInDate;
      const days = diff / (1000 * 60 * 60 * 24);
      setNumberOfNights(days > 0 ? days : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
      if (user?.email) {
        setGuestInfo((prev) => ({ ...prev, email: user.email }));
        if (user.displayName) {
          const parts = user.displayName.split(" ");
          setGuestInfo((prev) => ({
            ...prev,
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
          }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !isLoggedIn && selectedRoom) {
      const bookingData = {
        selectedRoom,
        checkInDate: checkInDate?.toISOString() || null,
        checkOutDate: checkOutDate?.toISOString() || null,
        guests: numberOfGuests,
        guestInfo,
        step,
        timestamp: Date.now(),
      };
      sessionStorage.setItem("pendingBookingData", JSON.stringify(bookingData));
      navigate("/login", {
        state: { from: { pathname: "/booknow" }, returnTo: "/booknow" },
      });
    }
  }, [loading, isLoggedIn, navigate, selectedRoom, checkInDate, checkOutDate, numberOfGuests, guestInfo, step]);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      const pendingData = sessionStorage.getItem("pendingBookingData");
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);
          if (data.checkInDate) setCheckInDate(new Date(data.checkInDate));
          if (data.checkOutDate) setCheckOutDate(new Date(data.checkOutDate));
          if (data.guests) setNumberOfGuests(data.guests);
          if (data.guestInfo) setGuestInfo(data.guestInfo);
          if (data.step) setStep(data.step);
          sessionStorage.removeItem("pendingBookingData");
        } catch {
          sessionStorage.removeItem("pendingBookingData");
        }
      }
    }
  }, [loading, isLoggedIn]);

  const fetchBookedDates = async () => {
    if (!selectedRoom?.name) return;
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef, 
        where("room", "==", selectedRoom.name),
        where("status", "==", "confirmed")
      );
      const snap = await getDocs(q);
      const dates = [];
      snap.forEach((doc) => {
        const b = doc.data();
        if (b.checkInDate && b.checkOutDate) {
          const ci = new Date(b.checkInDate);
          const co = new Date(b.checkOutDate);
          if (!isNaN(ci.getTime()) && !isNaN(co.getTime())) {
            for (let d = new Date(ci); d <= co; d.setDate(d.getDate() + 1)) {
              dates.push(new Date(d));
            }
          }
        }
      });
      setBookedDates(dates);
    } catch (e) {
      console.error("Error fetching booked dates:", e);
      setBookedDates([]);
    }
  };

  useEffect(() => {
    if (selectedRoom) fetchBookedDates();
  }, [selectedRoom]);

  const isDateBooked = (date) =>
    bookedDates.some((bd) => date.toDateString() === bd.toDateString());

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateGuestInfo = () => {
    const newErrors = {};
    if (!guestInfo.firstName) newErrors.firstName = "First name is required";
    if (!guestInfo.lastName) newErrors.lastName = "Last name is required";
    if (!guestInfo.email) newErrors.email = "Email is required";
    if (!guestInfo.mobileNumber) newErrors.mobileNumber = "Phone number is required";
    else if (!/^\d{11}$/.test(guestInfo.mobileNumber))
      newErrors.mobileNumber = "Phone number must be 11 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && numberOfNights > 0) setStep(2);
    else if (step === 2 && validateGuestInfo()) setStep(3);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const saveBookingToFirebase = async (bookingData) => {
    try {
      const bookingsCollection = collection(db, "bookings");
      
      const enhancedBookingData = {
        ...bookingData,
        userId: auth.currentUser?.uid,
        status: bookingData.status || "confirmed",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(bookingsCollection, enhancedBookingData);
      console.log("Booking saved to Firebase with ID:", docRef.id);
      
      try {
        const bookedDatesRef = collection(db, "bookedDates");
        await addDoc(bookedDatesRef, {
          roomId: selectedRoom.id || selectedRoom.name,
          roomName: selectedRoom.name,
          checkInDate: checkInDate?.toISOString(),
          checkOutDate: checkOutDate?.toISOString(),
          bookingId: docRef.id,
          userId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
        });
      } catch (bookedDateError) {
        console.warn("Could not save to bookedDates:", bookedDateError);
      }
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving booking to Firebase:", error);
      throw error;
    }
  };

  const sendEmail = async (endpoint, data) => {
    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send email");
      console.log(result.message);
    } catch (e) {
      console.error(`Error sending email to ${endpoint}:`, e);
    }
  };

  const fmtShort = (d) =>
    d?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    setSaving(true);
    
    if (validateGuestInfo() && selectedRoom) {
      try {
        const checkInDateObj = checkInDate;
        const checkOutDateObj = checkOutDate;
        
        const bookingData = {
          room: selectedRoom.name,
          roomId: selectedRoom.id || selectedRoom.name,
          guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
          email: guestInfo.email,
          phone: guestInfo.mobileNumber,
          checkIn: checkInDateObj?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          checkOut: checkOutDateObj?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          checkInDate: checkInDateObj?.toISOString(),
          checkOutDate: checkOutDateObj?.toISOString(),
          guests: numberOfGuests,
          nights: numberOfNights,
          rate: selectedRoom.ratePerDay,
          total: selectedRoom.ratePerDay * numberOfNights,
          status: "confirmed",
          bookingType: "online",
          specialRequest: guestInfo.specialRequest || "None",
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          mobileNumber: guestInfo.mobileNumber,
          timestamp: new Date().toISOString(),
          userId: auth.currentUser?.uid,
        };
        
        const bookingId = await saveBookingToFirebase(bookingData);
        
        try {
          await sendEmail("/send-booking-confirmation", {
            ...bookingData,
            bookingId,
          });
          await sendEmail("/send-payment-receipt", {
            ...bookingData,
            bookingId,
          });
        } catch (emailError) {
          console.warn("Email sending failed but booking was saved:", emailError);
        }
        
        setBookingDetails({
          bookingId,
          roomName: selectedRoom.name,
          checkIn: fmtShort(checkInDateObj),
          checkOut: fmtShort(checkOutDateObj),
          guests: numberOfGuests,
          nights: numberOfNights,
          total: totalCost,
          guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
          email: guestInfo.email,
        });
        
        setShowSuccessModal(true);
        
      } catch (e) {
        console.error("Error in booking process:", e);
        alert(`Booking failed: ${e.message}. Please try again or contact support.`);
      } finally {
        setSaving(false);
      }
    } else {
      setSaving(false);
    }
  };

  const totalCost = selectedRoom ? selectedRoom.ratePerDay * numberOfNights : 0;

  const fmtLong = (d) =>
    d?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="booknow-page">
          <button className="booknow-back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft size={18} />
            Back to Home
          </button>
          <div className="bn-hero">
            <p className="bn-hero-label">Reserve Your Stay</p>
            <h1 className="bn-hero-title">Book Your Room</h1>
            <p className="bn-hero-subtitle">Simple · Secure · Instant confirmation</p>
            <div className="bn-hero-divider">
              <div className="bn-hero-line" />
              <div className="bn-hero-dot" />
              <div className="bn-hero-line bn-hero-line-right" />
            </div>
          </div>
          <div className="bn-main">
            <div className="loading-spinner">
              <div className="spinner" />
              <p style={{ color: 'var(--muted)' }}>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!selectedRoom) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="booknow-page">
          <button className="booknow-back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft size={18} />
            Back to Home
          </button>
          <div className="bn-hero">
            <p className="bn-hero-label">Reserve Your Stay</p>
            <h1 className="bn-hero-title">Book Your Room</h1>
            <p className="bn-hero-subtitle">Simple · Secure · Instant confirmation</p>
            <div className="bn-hero-divider">
              <div className="bn-hero-line" />
              <div className="bn-hero-dot" />
              <div className="bn-hero-line bn-hero-line-right" />
            </div>
          </div>
          <div className="bn-main">
            <div className="empty-state">
              <div className="empty-state-icon">🏨</div>
              <h2 className="empty-state-title">No Room Selected</h2>
              <p className="empty-state-text">Please select a room first to proceed with booking.</p>
              <button
                onClick={() => navigate("/rooms")}
                className="btn-primary"
              >
                Browse Rooms
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="booknow-page">
        <button className="booknow-back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft size={18} />
          Back to Home
        </button>

        <div className="bn-hero">
          <p className="bn-hero-label">Reserve Your Stay</p>
          <h1 className="bn-hero-title">Book Your Room</h1>
          <p className="bn-hero-subtitle">Simple · Secure · Instant confirmation</p>
          <div className="bn-hero-divider">
            <div className="bn-hero-line" />
            <div className="bn-hero-dot" />
            <div className="bn-hero-line bn-hero-line-right" />
          </div>
        </div>

        <Stepper step={step} />

        <div className="bn-main">
          <div className="bn-card">
            <div className="bn-card-content">
              {step === 1 && (
                <>
                  <h2 className="section-title">Select Dates</h2>
                  <div className="section-divider" />

                  <p className="section-label-sm">Stay Duration</p>
                  <div className="form-grid">
                    <Field label="Check-in Date" icon={<FaCalendarAlt />}>
                      <DatePicker
                        selected={checkInDate}
                        onChange={(d) => setCheckInDate(d)}
                        placeholderText="Select check-in date"
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}
                        filterDate={(d) => !isDateBooked(d)}
                        className="input"
                      />
                    </Field>
                    <Field label="Check-out Date" icon={<FaCalendarAlt />}>
                      <DatePicker
                        selected={checkOutDate}
                        onChange={(d) => setCheckOutDate(d)}
                        placeholderText="Select check-out date"
                        dateFormat="MMMM d, yyyy"
                        minDate={checkInDate || new Date()}
                        filterDate={(d) => !isDateBooked(d)}
                        className="input"
                      />
                    </Field>
                  </div>

                  <p className="section-label-sm">Number of Guests</p>
                  <Field label="Guests" icon={<FaUsers />}>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="input"
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                      <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9B9B8A', fontSize: '12px' }}>▾</span>
                    </div>
                  </Field>

                  <div className="summary-card">
                    <p className="summary-label">Booking Summary</p>
                    <div className="summary-row">
                      <span className="summary-row-key">Selected Room</span>
                      <span className="summary-row-value">{selectedRoom.name}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-row-key">Rate per Night</span>
                      <span className="summary-row-value">₱{selectedRoom.ratePerDay?.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-row-key">Number of Nights</span>
                      <span className="summary-row-value">{numberOfNights || "—"}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-total">
                      <span className="summary-total-label">Total Cost</span>
                      <span className="summary-total-value">
                        {numberOfNights > 0 ? `₱${totalCost.toLocaleString()}` : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-between pt-6 border-top" style={{ marginTop: '24px' }}>
                    <button
                      className="btn-primary"
                      onClick={handleNext}
                      disabled={!checkInDate || !checkOutDate || numberOfNights === 0}
                    >
                      Continue to Guest Information <FaArrowRight />
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="section-title">Guest Information</h2>
                  <div className="section-divider" />

                  <div className="form-grid">
                    <Field label="First Name" error={errors.firstName}>
                      <input
                        className="input"
                        type="text"
                        name="firstName"
                        value={guestInfo.firstName}
                        onChange={handleGuestInfoChange}
                        placeholder="Juan"
                      />
                    </Field>

                    <Field label="Last Name" error={errors.lastName}>
                      <input
                        className="input"
                        type="text"
                        name="lastName"
                        value={guestInfo.lastName}
                        onChange={handleGuestInfoChange}
                        placeholder="dela Cruz"
                      />
                    </Field>

                    <Field label="Email Address" error={errors.email}>
                      <input
                        className="input"
                        type="email"
                        name="email"
                        value={guestInfo.email}
                        onChange={handleGuestInfoChange}
                        placeholder="juan@email.com"
                      />
                    </Field>

                    <Field label="Phone Number" error={errors.mobileNumber}>
                      <div className="phone-input-group">
                        <span className="phone-prefix">+63</span>
                        <input
                          className="phone-input"
                          type="tel"
                          name="mobileNumber"
                          value={guestInfo.mobileNumber}
                          onChange={(e) => {
                            if (/^\d{0,11}$/.test(e.target.value)) handleGuestInfoChange(e);
                          }}
                          placeholder="9XXXXXXXXX"
                          maxLength="11"
                        />
                      </div>
                    </Field>
                  </div>

                  <Field label="Special Requests (optional)">
                    <textarea
                      className="input"
                      name="specialRequest"
                      rows={3}
                      value={guestInfo.specialRequest}
                      onChange={handleGuestInfoChange}
                      placeholder="Any special requirements or requests for your stay…"
                    />
                  </Field>

                  <div className="flex-between pt-6 border-top" style={{ marginTop: '24px' }}>
                    <button className="btn-secondary" onClick={handlePrevious}>
                      <FaArrowLeft /> Back
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleNext}
                      disabled={
                        !guestInfo.firstName ||
                        !guestInfo.lastName ||
                        !guestInfo.email ||
                        !guestInfo.mobileNumber
                      }
                    >
                      Review Booking <FaArrowRight />
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="section-title">Review & Confirm</h2>
                  <div className="section-divider" />

                  <SectionCard title="Booking Details">
                    <div className="review-grid">
                      <ReviewItem label="Check-in Date" value={fmtLong(checkInDate)} />
                      <ReviewItem label="Check-out Date" value={fmtLong(checkOutDate)} />
                      <ReviewItem label="Room Type" value={selectedRoom.name} />
                      <ReviewItem label="Guests" value={`${numberOfGuests} ${numberOfGuests === 1 ? "Guest" : "Guests"}`} />
                      <ReviewItem label="Length of Stay" value={`${numberOfNights} ${numberOfNights === 1 ? "Night" : "Nights"}`} />
                      <ReviewItem label="Payment Method" value="Pay at Property" />
                    </div>

                    <div className="pt-4 border-top" style={{ marginTop: '16px' }}>
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9B9B8A', marginBottom: '4px' }}>Rate Summary</p>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>
                            {selectedRoom.name} — {numberOfNights} {numberOfNights === 1 ? "night" : "nights"} × ₱{selectedRoom.ratePerDay?.toLocaleString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9B9B8A', marginBottom: '4px' }}>Total Amount</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 700, color: 'var(--rust)', lineHeight: 1 }}>
                            ₱{totalCost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="Guest Information" className="mt-4">
                    <div className="review-grid">
                      <ReviewItem label="Guest Name" value={`${guestInfo.firstName} ${guestInfo.lastName}`} />
                      <ReviewItem label="Email Address" value={guestInfo.email} />
                      <ReviewItem label="Phone Number" value={guestInfo.mobileNumber} />
                      {guestInfo.specialRequest && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <ReviewItem label="Special Requests" value={guestInfo.specialRequest} />
                        </div>
                      )}
                    </div>
                  </SectionCard>

                  <label className="terms-checkbox">
                    <input
                      type="checkbox"
                      checked={termsChecked}
                      onChange={(e) => setTermsChecked(e.target.checked)}
                    />
                    <p className="terms-checkbox-text">
                      I agree to the{" "}
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTerms(true);
                        }}
                      >
                        terms and conditions
                      </a>{" "}
                      and confirm that all information provided is accurate.
                    </p>
                  </label>

                  <div className="flex-between pt-6 border-top" style={{ marginTop: '24px' }}>
                    <button className="btn-secondary" onClick={handlePrevious}>
                      <FaArrowLeft /> Back
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => setIsModalOpen(true)}
                      disabled={!termsChecked || saving}
                    >
                      {saving ? "Processing..." : "Confirm Booking"} {!saving && <FaCheckCircle />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <Modal title="Confirm Booking" onClose={() => setIsModalOpen(false)}>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Are you sure you want to confirm your booking for:
            </p>
            <div className="modal-booking-details">
              <p className="modal-room-name">{selectedRoom.name}</p>
              <p className="modal-dates">{fmtShort(checkInDate)} → {fmtShort(checkOutDate)}</p>
              <p className="modal-stay-info">
                {numberOfNights} {numberOfNights === 1 ? "night" : "nights"} · {numberOfGuests} {numberOfGuests === 1 ? "guest" : "guests"}
              </p>
              <div className="modal-total">
                <span className="modal-total-label">Total</span>
                <span className="modal-total-value">₱{totalCost.toLocaleString()}</span>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#9B9B8A', lineHeight: 1.5, marginBottom: '20px' }}>
              By confirming, you agree to our booking terms and conditions.
            </p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleModalConfirm} disabled={saving}>
                {saving ? "Processing..." : "Confirm Booking"} {!saving && <FaCheckCircle />}
              </button>
            </div>
          </Modal>
        )}

        {showTerms && (
          <Modal title="Terms & Conditions" onClose={() => setShowTerms(false)}>
            <div className="terms-list">
              <p style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--muted)' }}>By completing your booking, you agree to the following:</p>
              {[
                "Booking is subject to room availability.",
                "Full payment is required upon check-in.",
                "Cancellations must be made at least 48 hours prior to arrival.",
                "No refunds will be issued for no-shows.",
                "Additional charges may apply for extra services requested during your stay.",
              ].map((t, i) => (
                <div key={i} className="terms-item">
                  <span className="terms-check">✓</span>
                  <span className="terms-text">{t}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setShowTerms(false)}>
                I accept it <FaCheckCircle />
              </button>
            </div>
          </Modal>
        )}

        {showSuccessModal && bookingDetails && (
          <Modal title="Booking Confirmed! 🎉" onClose={() => {
            setShowSuccessModal(false);
            navigate("/home");
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, var(--forest), var(--forest2))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }} className="success-icon">
                <FaCheckCircle size={32} color="white" />
              </div>
              
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem',
                color: 'var(--forest)',
                marginBottom: '8px'
              }}>
                Your booking is confirmed!
              </h3>
              
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--muted)',
                marginBottom: '24px'
              }}>
                A confirmation has been sent to your email address.
              </p>
              
              <div style={{
                background: '#F8F7F2',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.07em', 
                    textTransform: 'uppercase', 
                    color: '#9B9B8A',
                    marginBottom: '4px'
                  }}>
                    Booking ID
                  </p>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    color: 'var(--text)',
                    fontFamily: 'monospace'
                  }}>
                    {bookingDetails.bookingId}
                  </p>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.07em', 
                    textTransform: 'uppercase', 
                    color: '#9B9B8A',
                    marginBottom: '4px'
                  }}>
                    Room
                  </p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text)' }}>
                    {bookingDetails.roomName}
                  </p>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.07em', 
                    textTransform: 'uppercase', 
                    color: '#9B9B8A',
                    marginBottom: '4px'
                  }}>
                    Stay Dates
                  </p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text)' }}>
                    {bookingDetails.checkIn} — {bookingDetails.checkOut}
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border)'
                }}>
                  <div>
                    <p style={{ 
                      fontSize: '0.7rem', 
                      letterSpacing: '0.07em', 
                      textTransform: 'uppercase', 
                      color: '#9B9B8A',
                      marginBottom: '4px'
                    }}>
                      Guests
                    </p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text)' }}>
                      {bookingDetails.guests} {bookingDetails.guests === 1 ? 'Guest' : 'Guests'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '0.7rem', 
                      letterSpacing: '0.07em', 
                      textTransform: 'uppercase', 
                      color: '#9B9B8A',
                      marginBottom: '4px'
                    }}>
                      Total Amount
                    </p>
                    <p style={{ 
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: 'var(--rust)',
                      lineHeight: 1
                    }}>
                      ₱{bookingDetails.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(45, 80, 22, 0.05)',
                border: '1px solid rgba(45, 80, 22, 0.1)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '24px'
              }}>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--forest)',
                  lineHeight: '1.4'
                }}>
                  📧 A confirmation email has been sent to <strong>{bookingDetails.email}</strong>
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/home");
                  }}
                  style={{ flex: 1 }}
                >
                  Back to Home
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/my-bookings");
                  }}
                  style={{ flex: 1 }}
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}

export default BookNow;