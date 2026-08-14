import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./authconfig/ProtectedRoute";

import { Login } from "./navigation/AuthNavIndex";
import { About, Contact } from "./navigation/MainNavIndex";
import { DaysPlan, History, Notifications, Recents, UpcomingActivity } from "./navigation/HomeNavIndex";
import UnsecuredNavigation from "./navigation/unsecuredNavigation/UnsecuredNavigation";
import SecuredHome from "./components/secured/Home";
import Blogs from "./components/secured/Blogs";
import Home from "./components/unsecured/Home";
import Signup from "./components/unsecured/Signup";
import { ToastContainer } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
// import StratWorkout from "./components/home/routes/StratWorkout";
import Yoga from "./pages/Yoga/Yoga";

function App() {
  return (
    <div className='min-h-screen bg-surface-50 text-surface-900 font-sans selection:bg-primary-500/30'>
      <Routes>

        <Route path="/" element={<UnsecuredNavigation />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>

        <Route path="/secured" element={<ProtectedRoute />}>
          <Route path="blogs" element={<Blogs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="contact" element={<Contact />} />
          <Route path="home" element={<SecuredHome />}>
            <Route path="startworkout" element={<Yoga />} />
            <Route path="recents" element={<Recents />} />
            <Route path="daysplan" element={<DaysPlan />} />
            <Route path="upcoming-activity" element={<UpcomingActivity />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="history" element={<History />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#ffffff',
          color: '#111827',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.4)',
        }
      }} />
    </div>
  )
}

export default App
