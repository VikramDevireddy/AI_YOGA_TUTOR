import React from 'react'
import { NavLink, useNavigate, useNavigation } from 'react-router-dom';
import { MdOutlineHistory } from "react-icons/md";
import { GrYoga } from "react-icons/gr";
import { MdEvent } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { FaUser } from "react-icons/fa6";

const HomeNavigation = () => {
    const navigation = useNavigate();
    const links = [
        {id:1, name:'Recents', path:"/secured/home/recents", img:MdOutlineTimer},
        {id:2, name:'30-Days Plan', path:"/secured/home/daysplan", img:GrYoga},
        {id:3, name:'Upcoming Activity', path:"/secured/home/upcoming-activity", img:MdEvent},
        {id:4, name:'Notifications', path:"/secured/home/notifications", img:IoIosNotificationsOutline},
        {id:5, name:'History', path:"/secured/home/history", img:MdOutlineHistory},
    ];

    return (
        <div className='flex flex-col gap-5 bg-white common-height p-5 rounded-xl relative'>
            <div className='flex items-center justify-center flex-col mt-5 gap-3'>
                <FaUser size={40} color='black'/>
                <h2 className='text-lg font-bold text-black'>{localStorage.getItem("username")}</h2>
            </div>
            <div className='flex flex-col gap-5 text-slate-600 my-5'>
                {links.map(link => {
                    const Icon = link.img; // Get the icon component
                    return (
                        <NavLink key={link.id} to={link.path} className='flex items-center gap-2'>
                            <Icon className='text-xl' /> {/* Render the icon */}
                            {link.name}
                        </NavLink>
                    );
                })}
            </div>
            <div className='absolute bottom-5 right-5'>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg' onClick={()=>{
                    navigation("/")
                    localStorage.clear();
                    }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default HomeNavigation;
