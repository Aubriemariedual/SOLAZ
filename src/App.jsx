import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './User-side/pages/Home';
import Rooms from './User-side/pages/Rooms';
import Chat from './User-side/pages/Chat';
import Gallery from './User-side/pages/Gallery';
import LoginAndSignup from './User-side/pages/LoginAndSignUp';
import Navbar from './User-side/components/Navbar';
import Footer from './User-side/components/Footer';

function App() {
  // Temporarily always use user navbar/footer
  // const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home/>} />
            <Route path="/rooms" element={<Rooms/>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<LoginAndSignup/>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;