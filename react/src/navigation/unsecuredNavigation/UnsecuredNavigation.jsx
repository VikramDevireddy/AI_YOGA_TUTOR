import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

const UnsecuredNavigation = () => {
    const links = [
        {id:1, name: 'Home', path: '/' },
        {id:2, name: 'About', path: '/about'},
        {id:4, name: 'Contact', path: '/contact'},
        {id:5, name: 'Login', path: '/login'},
      ]
      return (
        <div className=' '>
            <div className='flex justify-end gap-10 px-16 sticky top-0 h-full w-full bg-gray-200 bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-100
z-50 py-5'>
          {
            links?.map(link=>{
              return (
              <NavLink key={link.id} to={link.path}>{link.name}</NavLink>
              );
            })
          }
          </div>
          <Outlet />
        </div>
      )
}

export default UnsecuredNavigation