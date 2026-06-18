import React from 'react'
import { NavLink, useNavigate, useNavigation } from 'react-router-dom';
import { MdOutlineHistory } from "react-icons/md";
import { GrYoga } from "react-icons/gr";
import { MdEvent } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

const HomeNavigation = () => {
    const navigation = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);
    const links = [
        {id:1, name:'Recents', path:"/secured/home/recents", img:MdOutlineTimer},
        {id:2, name:'30-Days Plan', path:"/secured/home/daysplan", img:GrYoga},
        {id:3, name:'Upcoming Activity', path:"/secured/home/upcoming-activity", img:MdEvent},
        {id:4, name:'Notifications', path:"/secured/home/notifications", img:IoIosNotificationsOutline},
        {id:5, name:'History', path:"/secured/home/history", img:MdOutlineHistory},
    ];

    const handleLogout = () => {
        navigation("/")
        localStorage.clear();
    };

    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className='md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 p-4 shadow-md'>
                <h2 className='text-lg font-bold text-slate-900'>Menu</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    aria-label='Toggle menu'
                    aria-expanded={isOpen}
                >
                    {isOpen ? <MdClose size={24} /> : <GiHamburgerMenu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-200'
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Navigation Content */}
            <div className={`flex flex-col gap-5 bg-white p-5 rounded-xl relative min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-96px)] md:block ${
                isOpen ? 'fixed top-16 left-0 right-0 z-40 h-auto max-h-[calc(100vh-80px)] overflow-y-auto md:relative md:top-0 md:z-auto' : 'hidden md:flex'
            }`}>
                <div className='flex items-center justify-center flex-col mt-5 gap-3'>
                    <FaUser size={40} color='black'/>
                    <h2 className='text-lg font-bold text-black'>{localStorage.getItem("username")}</h2>
                </div>
                <div className='flex flex-col gap-2 text-slate-600 my-5'>
                    {links.map(link => {
                        const Icon = link.img;
                        return (
                            <NavLink 
                                key={link.id} 
                                to={link.path}
                                onClick={handleNavClick}
                                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-medium ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                                }`}
                            >
                                <Icon className='text-xl' />
                                {link.name}
                            </NavLink>
                        );
                    })}
                </div>
                <div className='mt-4 md:mt-auto'>
                    <button 
                        onClick={handleLogout}
                        className='w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}


export default HomeNavigation;
