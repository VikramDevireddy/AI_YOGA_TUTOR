import React from 'react'
import HomeNavigation from '../../navigation/HomeNavigation'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex gap-8 w-full'>
      <div className='sticky top-0'>
         <HomeNavigation />
      </div>
      <div className='flex flex-col items-center  flex-1 '>
      {/* <h1>Welcome to my home page</h1> */}
      <Outlet />
      </div>
    </div>
  )
}

export default Home