import React, { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';

const UnsecuredNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { id: 1, name: 'Home', path: '/' },
    { id: 2, name: 'About', path: '/about' },
    { id: 4, name: 'Contact', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className='w-full'>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className={`mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300 ${scrolled ? 'glass rounded-2xl mx-4 sm:mx-6 md:mx-auto shadow-glass' : 'bg-transparent'}`}>
          <div className='flex items-center justify-between h-14'>
            <div className='flex-shrink-0 flex items-center pr-8'>
              {/* Add a subtle logo or text here */}
              <span className="font-display font-bold text-xl text-primary-600 tracking-tight">VedicVision</span>
            </div>
            <nav className='hidden sm:flex items-center gap-1 flex-1 justify-end'>
              {links?.map(link => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) => `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                      ? 'text-primary-700 bg-primary-100 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 hover:shadow-sm'
                    }`}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-6 w-px bg-gray-200 mx-3"></div>
              <NavLink to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">Log in</NavLink>
              <NavLink to="/sign-up" className="ml-2 glass-button !py-2 !px-5 text-sm !rounded-xl !shadow-sm">Sign Up</NavLink>
            </nav>

            <button
              onClick={toggleMenu}
              className='sm:hidden p-2 rounded-xl text-gray-600 hover:bg-white/50 hover:text-primary-600 transition-colors'
            >
              {isOpen ? <MdClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 sm:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-[80%] max-w-sm glass z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className='flex flex-col h-full'>
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100/30">
            <span className="font-display font-bold text-xl text-primary-600">VedicVision</span>
            <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-700 bg-white/50 rounded-full">
              <MdClose size={20} />
            </button>
          </div>
          <div className='flex-1 overflow-y-auto p-6 flex flex-col gap-3'>
            {links?.map(link => (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={handleNavClick}
                className={({ isActive }) => `px-4 py-3.5 rounded-xl font-medium transition-all text-base ${isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 bg-white/50 hover:bg-white hover:text-primary-600 border border-transparent hover:border-gray-100 shadow-sm'
                  }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="p-6 border-t border-gray-100/30">
            <div className="flex flex-col gap-3">
              <NavLink
                to="/login"
                onClick={handleNavClick}
                className="w-full glass-button-secondary text-center"
              >
                Log in
              </NavLink>
              <NavLink
                to="/sign-up"
                onClick={handleNavClick}
                className="w-full glass-button text-center"
              >
                Sign up for free
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  )
}

export default UnsecuredNavigation