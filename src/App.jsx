import './App.css'
import { ToastContainer } from 'react-toastify';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import AdminProtectedRoute from './Components/AdminProtectedRoute/AdminProtectedRoute.jsx'
import Dashboard from './Pages/Dashboard/Dashboard';
import Partner from './Pages/Partner/Partner.jsx';
import NewsDetails from './Pages/NewsDetails/NewsDetails.jsx';
import Footer from './Components/Footer/Footer.jsx';
import About from './Pages/About/About.jsx';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/partner' element={<Partner />} />
        <Route path='/news/:id' element={<NewsDetails />} />
        <Route path='/about' element={<About />} />

        <Route path='/dashboard' element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
          } />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  )
}

export default App