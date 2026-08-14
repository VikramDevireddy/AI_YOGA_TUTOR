import React from 'react'
import { NavLink, useNavigate, useNavigation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MdOutlineHistory } from "react-icons/md";
import { GrYoga } from "react-icons/gr";
import { MdEvent } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const HomeNavigation = () => {
    const navigation = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);
    const links = [
        { id: 1, name: 'Recents', path: "/secured/home/recents", img: MdOutlineTimer },
        { id: 2, name: '30-Days Plan', path: "/secured/home/daysplan", img: GrYoga },
        { id: 3, name: 'Upcoming Activity', path: "/secured/home/upcoming-activity", img: MdEvent },
        { id: 4, name: 'Notifications', path: "/secured/home/notifications", img: IoIosNotificationsOutline },
        { id: 5, name: 'History', path: "/secured/home/history", img: MdOutlineHistory },
    ];

    const { logout } = useAuth();
    const username = localStorage.getItem("username") || "User";
    const userImg = localStorage.getItem("userImg");

    const handleLogout = () => {
        logout();
        navigation("/");
    };

    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className='md:hidden sticky top-0 z-40 flex items-center justify-between glass px-4 py-3 m-4 rounded-2xl'>
                <div className='flex items-center gap-3'>
                    {userImg ? (
                        <img src={userImg} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <FaUser size={14} />
                        </div>
                    )}
                    <h2 className='text-base font-semibold text-gray-800'>Welcome, {username.split(' ')[0]}</h2>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='flex items-center justify-center p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none'
                    aria-label='Toggle menu'
                    aria-expanded={isOpen}
                >
                    {isOpen ? <MdClose size={22} /> : <GiHamburgerMenu size={22} />}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className='md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity duration-300'
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Navigation Content (Sidebar on Desktop, Drawer on Mobile) */}
            <div className={`md:sticky md:top-24 w-64 xl:w-72 flex-shrink-0 flex flex-col z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'fixed inset-y-0 left-0 bg-white shadow-2xl h-full' : 'fixed inset-y-0 -left-full md:left-0 md:relative bg-transparent md:h-[calc(100vh-140px)]'
                }`}>
                <div className='flex flex-col h-full glass-card p-6 border border-white/50 bg-white/70 shadow-soft md:pb-6 overflow-y-auto'>

                    {/* User Profile Area */}
                    <div className='flex items-center flex-col mt-4 mb-8 gap-4 pb-8 border-b border-gray-200/60'>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-400 to-accent rounded-full animate-spin [animation-duration:8s] opacity-70 blur-md"></div>
                            {userImg ? (
                                <img src={userImg} alt="Profile" className="relative w-20 h-20 rounded-full object-cover border-[3px] border-white shadow-md z-10" />
                            ) : (
                                <div className="relative w-20 h-20 rounded-full bg-white border-[3px] border-white shadow-md flex items-center justify-center text-primary-300 z-10">
                                    <FaUser size={30} />
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h2 className='text-lg font-bold text-gray-900'>{username}</h2>
                            <p className="text-xs font-medium text-primary-600">Pro Member</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className='flex flex-col gap-2 flex-1'>
                        {links.map(link => {
                            const Icon = link.img;
                            return (
                                <NavLink
                                    key={link.id}
                                    to={link.path}
                                    onClick={handleNavClick}
                                    className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-medium group ${isActive
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-white/60 hover:text-primary-600 border border-transparent hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    <Icon className={`text-xl transition-transform group-hover:scale-110`} />
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Logout Button */}
                    <div className='mt-8 pt-6 border-t border-gray-200/60'>
                        <button
                            onClick={handleLogout}
                            className='w-full flex items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition duration-200 hover:text-gray-900'
                        >
                            <FiLogOut className="text-lg" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile close button inside drawer */}
                    {isOpen && (
                        <button onClick={handleNavClick} className="absolute top-4 right-4 p-2 md:hidden text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                            <MdClose size={20} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default HomeNavigation;
