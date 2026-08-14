import React from 'react'
import HomeNavigation from '../../navigation/HomeNavigation'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-screen w-full relative'>
      {/* Background blobs for secured area */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-accent rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

      {/* Secured App header on desktop */}
      <header className="hidden md:flex sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/40 h-20 items-center px-8 lg:px-12 shadow-sm">
        <span className="font-display font-bold text-2xl text-primary-600 tracking-tight">Ai Yoga Assistant</span>
        <div className="ml-auto flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors bg-white rounded-full shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <div className='flex flex-col md:flex-row w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 gap-6 md:gap-8 lg:gap-10 relative z-10'>
        <div className='w-full md:w-auto flex-shrink-0'>
          <HomeNavigation />
        </div>
        <div className='flex flex-col flex-1 w-full max-w-full overflow-hidden'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Home