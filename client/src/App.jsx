import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={appStyle}>
          {/* Header appears on all pages */}
          <Header />

          {/* Main content */}
          <main style={mainStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer appears on all pages */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

// 🔍 Simple 404 Page
const NotFound = () => {
  return (
    <div style={notFoundStyle}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

//  Styles
const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainStyle = {
  flex: 1,
};

const notFoundStyle = {
  textAlign: 'center',
  padding: '4rem',
};

export default App;

