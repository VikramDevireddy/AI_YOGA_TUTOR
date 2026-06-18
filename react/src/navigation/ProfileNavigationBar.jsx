import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';

const ProfileNavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className='md:hidden sticky top-0 z-40 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 p-4 shadow-lg rounded-lg mb-4'>
        <h2 className='text-lg font-bold text-white'>Profile</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
          aria-label='Toggle menu'
          aria-expanded={isOpen}
        >
          {isOpen ? <MdClose size={24} className='text-white' /> : <GiHamburgerMenu size={24} className='text-white' />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-200'
          onClick={() => setIsOpen(false)}
        />
      )}
    
      <div className={`rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 p-6 shadow-2xl md:block ${
        isOpen ? 'fixed top-20 left-4 right-4 z-40 md:relative md:top-0' : 'hidden md:block'
      }`}>
        <h2 className='mb-6 text-xl font-bold text-white hidden md:block'>Profile Menu</h2>
        <nav className='flex flex-col gap-3'>
        <Link
          to='/profile'
          onClick={handleNavClick}
          className='block rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 hover:shadow-lg sm:text-base'
        >
          Personal Info
        </Link>
        <Link
          to='/profile/progress'
          onClick={handleNavClick}
          className='block rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 hover:shadow-lg sm:text-base'
        >
          Progress
        </Link>
        <Link
          to='/profile/settings'
          onClick={handleNavClick}
          className='block rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 hover:shadow-lg sm:text-base'
        >
          Settings
        </Link>
        <Link
          to='/profile/feedback'
          onClick={handleNavClick}
          className='block rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 hover:shadow-lg sm:text-base'
        >
          Feedback
        </Link>
        <Link
          to='/profile/logout'
          onClick={handleNavClick}
          className='block rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 hover:shadow-lg sm:text-base'
        >
          Logout
        </Link>
      </nav>
      </div>
    </>
  )
}

export default ProfileNavigationBar
