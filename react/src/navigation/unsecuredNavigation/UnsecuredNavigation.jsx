import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';

const UnsecuredNavigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const links = [
        {id:1, name: 'Home', path: '/' },
        {id:2, name: 'About', path: '/about'},
        {id:4, name: 'Contact', path: '/contact'},
        {id:5, name: 'Login', path: '/login'},
      ]
      
      const toggleMenu = () => {
        setIsOpen(!isOpen);
      };

      const handleNavClick = () => {
        setIsOpen(false);
      };

      return (
        <div className='w-full'>
            {/* Top Navigation Bar */}
            <div className='flex items-center justify-between gap-4 py-5 px-4 sm:px-6 lg:px-16 sticky top-0 w-full bg-gray-200 bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-90 border border-gray-100 z-50'>
              {/* Desktop Menu */}
              <div className='hidden sm:flex flex-wrap justify-center gap-4 flex-1'>
                {
                  links?.map(link=>{
                    return (
                    <NavLink 
                      key={link.id} 
                      to={link.path} 
                      className={({ isActive }) => `text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'text-blue-700 bg-blue-50 font-semibold' 
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {link.name}
                    </NavLink>
                    );
                  })
                }
              </div>
              
              {/* Mobile Hamburger Menu */}
              <button
                onClick={toggleMenu}
                className='sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                aria-label='Toggle menu'
                aria-expanded={isOpen}
              >
                {isOpen ? <MdClose size={24} /> : <GiHamburgerMenu size={24} />}
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
              <div 
                className='fixed inset-0 bg-black bg-opacity-50 sm:hidden z-40 transition-opacity duration-200'
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Mobile Menu Drawer */}
            <div
              className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out sm:hidden z-40 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className='flex flex-col gap-2 p-6 pt-20'>
                {links?.map(link => (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    onClick={handleNavClick}
                    className={({ isActive }) => `px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <Outlet />
        </div>
      )
}

export default UnsecuredNavigation