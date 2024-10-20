import React from 'react'
import ProfileNavigationBar from '../../navigation/ProfileNavigationBar'
import { Outlet } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='flex gap-16'>
      <div>
         <ProfileNavigationBar />
      </div>
      <div>
      <h1>Welcome to my profile page</h1>
      <Outlet />
      </div>
    </div>
  )
}

export default Profile