import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth, db} from "../firebase";

// User-side Pages
import Home from './User-side/pages/Home';
import Rooms from './User-side/pages/Rooms';
import Gallery from './User-side/pages/Gallery';
import LoginAndSignup from './User-side/pages/LoginAndSignUp';
import SelectRoom from './User-side/pages/SelectRoom';
import Navbar from './User-side/components/Navbar';
import Footer from './User-side/components/Footer';

// Admin-side Pages
import AdminLogin from './Admin/AdminLogIn';
import AdminHome from './Admin/AdminHome';
import Booking from './Admin/Booking';
import GalleryManagement from './Admin/GalleryManagement';
import RoomManagement from './Admin/RoomManagement';
import { AdminLayout } from './Admin/AdminNavbar';
import BookNow from './User-side/pages/BookNow';
import AdminContacts from './Admin/AdminContacts';


function AppContent() {
  const location = useLocation();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      
      if (user) {
        try {
          // Check if user has admin role in Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || 'user';
            setUserRole(role);
            
            // Set admin logged in based on role
            const isAdmin = role === 'admin';
            setIsAdminLoggedIn(isAdmin);
            if (isAdmin) {
              setAdminUser(user);
              console.log('Admin logged in successfully:', user.email);
            } else {
              console.log('User is not admin, role:', role);
            }
          } else {
            console.log('User document not found');
            setIsAdminLoggedIn(false);
            setUserRole('user');
            setAdminUser(null);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          setIsAdminLoggedIn(false);
          setUserRole('user');
          setAdminUser(null);
        }
      } else {
        console.log('No user logged in');
        setIsAdminLoggedIn(false);
        setUserRole(null);
        setAdminUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdminLoggedIn(false);
      setAdminUser(null);
      setUserRole(null);
      console.log('Admin logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Protected Route component for admin pages
  const ProtectedAdminRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    
    // If not logged in or not admin, redirect to admin login
    if (!isAdminLoggedIn) {
      console.log('Not admin, redirecting to /admin/login');
      return <Navigate to="/admin/login" replace />;
    }
    
    // Wrap admin pages with AdminLayout and pass logout function
    return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>
  };

  // Public route that redirects to admin bookings if already logged in as admin
  const PublicAdminRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    
    // If already logged in as admin, redirect to admin bookings (homepage)
    if (isAdminLoggedIn) {
      console.log('Already logged in as admin, redirecting to /admin/bookings');
      return <Navigate to="/admin/bookings" replace />;
    }
    
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar: only show user navbar for non-admin routes */}
      {!isAdminRoute && !isLoginPage && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<LoginAndSignup />} />
          <Route path="/signup" element={<LoginAndSignup />} />
          
          {/* ADD THIS NEW ROUTE - SelectRoom Page */}
          <Route path="/selectroom" element={<SelectRoom />} />
          
          <Route path="/booknow" element={<BookNow />} /> 

          {/* Admin Routes */}
          <Route 
            path="/admin/login" 
            element={
              <PublicAdminRoute>
                <AdminLogin />
              </PublicAdminRoute>
            } 
          />
          
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedAdminRoute>
                <Booking />
              </ProtectedAdminRoute>
            } 
          />
          
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedAdminRoute>
                <GalleryManagement />
              </ProtectedAdminRoute>
            } 
          />
          
          <Route 
            path="/admin/rooms" 
            element={
              <ProtectedAdminRoute>
                <RoomManagement />
              </ProtectedAdminRoute>
            } 
          />
          
          {/* Admin Dashboard Redirect - now goes to bookings instead of home */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Navigate to="/admin/bookings" replace />
              </ProtectedAdminRoute>
            } 
          />
           <Route 
            path="/admin/contacts" 
            element={
              <ProtectedAdminRoute>
                <AdminContacts />
              </ProtectedAdminRoute>
            } 
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer only for user pages and not login pages */}
      {!isAdminRoute && !isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;