import React from 'react'
import CountUp from 'react-countup';
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import i1 from "../../assets/home1.png";
import i2 from "../../assets/home2.png";
import i3 from "../../assets/home3.png";
import i4 from "../../assets/home4.png";
import i5 from "../../assets/home5.png";
import i6 from "../../assets/home6.png";
import i7 from "../../assets/home7.png";
import i8 from "../../assets/home8.png";


const Home = () => {
  const nav = useNavigate();
  return (
    <div className=' bg-primary h-full'>
      <div className='flex'>
      <div className='flex flex-col px-14'>
      <h1 className='text-[6rem] w-[70%] text-blue-950 font-semibold'>
  Choose your best <span className='rotate-[10deg] text-[4rem]  mr-5 inline-block px-5 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-lg text-white'>YOGA</span> routine
</h1>


        <p className='w-[40%] text-2xl  text-blue-800'>calm your mind and body with the best yoga plans avalaible</p>
        <button className='bg-black rounded-full float-left my-5 ml-[20rem] px-8 py-4 text-white capitalize font-semibold flex justify-center gap-5 items-center hover:shadow-2xl hover: shadow-white'><span>get started</span><span className='hover:rotate-[90deg] duration-200'><FaArrowRight/></span></button>
        <div className='flex flex-row justify-around'>
          <CountUp className=' text-blue-950 text-6xl' end={100} duration={5}/>
        <CountUp className=' text-blue-950 text-6xl' end={1000} duration={5}/>
        </div>
      </div>
      <div>
        <img className='w-[70%] h-[90%]' src={i1} alt="img" />
      </div>
    </div>
    <div className='flex my-28 items-center'>
      <img className='w-[50%] h-[50%]' src={i2} alt="" />
      <p className='text-3xl w-[40%] text-[#4B3E65]'>Transform Your Practice with AI-Driven Yoga Guidance Personalized Yoga Coaching, Anytime, Anywhere.</p>

    </div>
     <div className='flex my-28 h-screen'>
      <div className='flex flex-col pl-20 mt-36'>
        <p className='text-5xl w-[40%] text-[#4B3E65] font-bold'>Bring Happiness To Good Health!.</p>
      <p className='text-2xl text-[#4B3E65] mt-16'>If you take care of your good health, take care of your mentality and lead a healthy life with positive thoughts every day.</p>
      </div>
    <img className='w-[50%] h-[70%]' src={i3} alt="" />
    </div>
    <div className='flex my-28 h-screen'>
      <div className='flex flex-col pl-20 mt-36'>
        <p className='text-5xl w-[40%] text-[#4B3E65] font-bold'>Anytime, Any Place, Any Workout</p>
      <p className='text-2xl text-[#4B3E65] mt-16'>Master Every Pose with Real-Time AI Feedback.Your Virtual Yoga Coach, Ready to Guide You.</p>
      </div>
    <img className='w-[50%] h-[70%] rounded-full border-gray-100' src={i4} alt="" />
    </div>

    <div className='flex flex-col'>
      <div className='flex flex-row justify-center items-center h-[10%]'>
        <img className='w-[20%] h-[30rem] rounded-full border-gray-100' src={i5} alt="" />
        <div className='flex flex-col justify-center items-center' > <p className='text-5xl text-[#4B3E65] font-bold'>Follow Us On Instagram </p>
        <button className='bg-black text-white mt-5 rounded-[50%] p-10' onClick={()=> window.open("https://instagram.com", "_blank")}><FaArrowRight/></button>
        </div>
        <img className='w-[20%] h-[30rem] rounded-full border-gray-100' src={i6} alt="" />
      </div>
      <div className='pt-10 flex flex-row justify-evenly'>
        <img className='w-[20%] h-[40%] rounded-full border-gray-100' src={i7} alt="" />
        <img className='w-[20%] h-[40%] rounded-full border-gray-100' src={i8} alt="" />
      </div>
    </div>
    </div>
  )
}

export default Home