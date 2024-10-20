import React from 'react'
import { Outlet } from 'react-router-dom'
import HomeNavigation from '../../navigation/HomeNavigation'

const Home = () => {
  return (
    <div className='flex gap-16'>
      <div>
         <HomeNavigation />
      </div>
      <div>
      <h1>Welcome to my home page</h1>
      <Outlet />
      </div>
    </div>
  )
}

export default Home