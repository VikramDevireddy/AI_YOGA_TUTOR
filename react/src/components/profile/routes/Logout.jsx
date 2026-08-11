import React from 'react'
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='min-h-[60vh] rounded-3xl bg-white p-6 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Logout</h2>
      <p className='mt-3 text-sm text-slate-600 mb-4'>Use this section to sign out cleanly from your account.</p>
      <button
        onClick={handleLogout}
        className='rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 text-sm font-semibold text-white transition duration-200 hover:shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
      >
        Confirm Logout
      </button>
    </div>
  )
}

export default Logout