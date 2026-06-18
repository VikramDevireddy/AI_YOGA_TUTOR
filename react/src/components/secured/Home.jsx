import React from 'react'
import HomeNavigation from '../../navigation/HomeNavigation'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col gap-8 w-full px-4 py-6 md:flex-row md:px-6 lg:px-10'>
      <div className='w-full md:w-80 md:sticky md:top-6'>
         <HomeNavigation />
      </div>
      <div className='flex flex-col items-center flex-1'>
        <Outlet />
      </div>
    </div>
  )
}

export default Home