import React, { useState } from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import SolazLogo from "../../assets/SolazLogo.png"; 

const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

  .footer {
    font-family: 'DM Sans', sans-serif;
    background: #1e2e12;
    color: #F0EFE4;
    padding: 40px 24px 20px;
  }

  .footer-content {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  @media (max-width: 768px) {
    .footer-content { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .footer-content { grid-template-columns: 1fr; }
  }

  .footer-section h4 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 16px 0;
    color: #a8c47a;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 10px;
  }

  .footer-links a {
    color: rgba(240, 239, 228, 0.6);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: #a8c47a;
  }

  .footer-bottom {
    max-width: 1100px;
    margin: 32px auto 0;
    padding-top: 20px;
    border-top: 1px solid rgba(240, 239, 228, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 13px;
    color: rgba(240, 239, 228, 0.4);
  }

  .social-links {
    display: flex;
    gap: 16px;
  }

  .social-links a {
    color: rgba(240, 239, 228, 0.6);
    transition: color 0.2s;
  }

  .social-links a:hover {
    color: #a8c47a;
  }

  .footer-logo {
    height: 40px;
    width: auto;
    margin-bottom: 12px;
    filter: brightness(0) invert(1);
  }
`;

export default function Footer() {
  return (
    <>
      <style>{FOOTER_STYLES}</style>
      <footer className="footer">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-section">
            <img src={SolazLogo} alt="Solaz" className="footer-logo" />
            <div className="social-links">
              <a href="#"><Instagram size={18} /></a>
              <a href="#"><Facebook size={18} /></a>
              <a href="#"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-section">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><a href="#rooms-section">Rooms</a></li>
              <li><a href="#gallery-section">Gallery</a></li>
              <li><a href="#faqs-section">FAQs</a></li>
              <li><a href="#contact-section">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>solazhotels@gmail.com</li>
              <li>+63 932 517 8889</li>
              <li>Victor Wahing Street, Alegria, Cordova, 6017 Cebu, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Solaz Resort</span>
          <span>Made for quiet souls</span>
        </div>
      </footer>
    </>
  );
}