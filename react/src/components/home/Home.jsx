import React from 'react'
import { Outlet } from 'react-router-dom'
import HomeNavigation from '../../navigation/HomeNavigation'

const Home = () => {
  return (
    <div className='flex flex-col gap-8 w-full md:flex-row'>
      <div className='w-full md:w-auto'>
         <HomeNavigation />
      </div>
      <div className='w-full px-4 md:px-0'>
      <h1>Welcome to my home page</h1>
      <Outlet />
      </div>
    </div>
  )
}

export default Home