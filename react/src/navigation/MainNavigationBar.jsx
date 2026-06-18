import React from 'react'
import { NavLink } from 'react-router-dom'


const MainNavigationBar = () => {
  const links = [
    {id:1, name: 'Home', path: '/' },
    {id:2, name: 'About', path: '/about'},
    {id:4, name: 'Login', path: '/login'},
    {id:5, name: 'Contact', path: '/contact'},

  ]
  return (
    <div className='flex flex-wrap justify-center gap-4 py-3 px-4 sm:px-6 lg:px-16'>
      {
        links?.map(link=>{
          return (
          <NavLink key={link.id} to={link.path} className='text-sm font-medium text-slate-700 hover:text-blue-700'>
            {link.name}
          </NavLink>
          );
        })
      }
    </div>
  )
}

export default MainNavigationBar