import React from 'react'
import ProfileNavigationBar from '../../navigation/ProfileNavigationBar'
import { Outlet } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-7xl flex-col gap-8 md:flex-row'>
        <div className='w-full md:w-80'>
          <ProfileNavigationBar />
        </div>
        <div className='w-full'>
          <div className='rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm'>
            <h1 className='text-2xl font-semibold text-white'>Welcome to your profile</h1>
            <p className='mt-2 text-sm text-slate-300'>Manage your account and view your progress in one place.</p>
          </div>
          <div className='mt-6 rounded-3xl bg-white p-6 shadow-2xl'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile