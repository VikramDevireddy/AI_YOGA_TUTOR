import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

const SecuredNavigation = () => {
  const links = [
    {id:1, name: 'Home', path: '/secured/home' },
    {id:2, name: 'Blogs', path: '/secured/blogs'},
    // {id:4, name: 'Notifications', path: '/secured/notifications'},
    {id:5, name: 'Contact', path: '/secured/contact'},
  ]
  return (
    <div className='static top-0'>
        <div className='flex justify-end gap-10 py-3 px-16 '>
      {
        links?.map(link=>{
          return (
          <NavLink 
            key={link.id} 
            to={link.path}
          >
            {link.name}
          </NavLink>
          );
        })
      }
      </div>
    </div>
  )
}

export default SecuredNavigation;
