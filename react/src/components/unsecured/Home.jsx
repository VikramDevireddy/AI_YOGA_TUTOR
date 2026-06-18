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
    <div className='bg-primary min-h-screen'>
      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:px-8 lg:px-12'>
        <div className='flex-1'>
          <h1 className='text-3xl font-semibold leading-tight text-blue-950 sm:text-4xl md:text-5xl'>
            Choose your best <span className='inline-block rotate-[10deg] text-2xl sm:text-3xl md:text-4xl mr-0 md:mr-5 px-3 md:px-5 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-lg text-white'>YOGA</span> routine
          </h1>
          <p className='max-w-2xl mt-6 text-base text-blue-800 sm:text-lg md:text-xl'>Calm your mind and body with the best yoga plans available.</p>
          <button className='mt-6 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-white text-sm font-semibold hover:shadow-2xl'>
            <span>get started</span>
            <span className='transition-transform duration-200 hover:translate-x-1'><FaArrowRight/></span>
          </button>
          <div className='mt-8 flex flex-wrap gap-6'>
            <div className='text-3xl font-bold text-blue-950 md:text-6xl'>100</div>
            <div className='text-3xl font-bold text-blue-950 md:text-6xl'>1000</div>
          </div>
        </div>
        <div className='w-full md:w-1/2'>
          <img className='w-full rounded-xl object-cover' src={i1} alt='Yoga hero' />
        </div>
      </div>

      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:px-8 lg:px-12'>
        <img className='w-full rounded-xl object-cover md:w-1/2' src={i2} alt='Yoga practice' />
        <p className='text-base text-[#4B3E65] md:w-1/2 md:text-lg'>Transform your practice with AI-driven yoga guidance and personalized coaching anytime, anywhere.</p>
      </div>

      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:px-8 lg:px-12'>
        <div className='md:w-1/2'>
          <p className='text-3xl font-bold text-[#4B3E65] sm:text-4xl md:text-5xl'>Bring Happiness To Good Health.</p>
          <p className='mt-6 text-base text-[#4B3E65] md:text-lg'>If you take care of your good health, take care of your mentality and lead a healthy life with positive thoughts every day.</p>
        </div>
        <img className='w-full rounded-xl object-cover md:w-1/2' src={i3} alt='Healthy living' />
      </div>

      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:px-8 lg:px-12'>
        <div className='md:w-1/2'>
          <p className='text-3xl font-bold text-[#4B3E65] sm:text-4xl md:text-5xl'>Anytime, Any Place, Any Workout</p>
          <p className='mt-6 text-base text-[#4B3E65] md:text-lg'>Master every pose with real-time AI feedback. Your virtual yoga coach is ready to guide you.</p>
        </div>
        <img className='w-full rounded-full border border-gray-100 object-cover md:w-1/2' src={i4} alt='Yoga anywhere' />
      </div>

      <div className='flex flex-col gap-8 px-4 py-10 md:px-14'>
        <div className='flex flex-col items-center gap-6 md:flex-row md:justify-center'>
          <img className='w-full max-w-xs rounded-full border border-gray-100 object-cover md:w-[20%]' src={i5} alt='Instagram 1' />
          <div className='text-center md:text-left'>
            <p className='text-3xl font-bold text-[#4B3E65] md:text-5xl'>Follow Us On Instagram</p>
            <button className='mt-5 inline-flex items-center justify-center rounded-full bg-black p-5 text-white' onClick={()=> window.open("https://instagram.com", "_blank")}>
              <FaArrowRight />
            </button>
          </div>
          <img className='w-full max-w-xs rounded-full border border-gray-100 object-cover md:w-[20%]' src={i6} alt='Instagram 2' />
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <img className='w-full rounded-full border border-gray-100 object-cover' src={i7} alt='Instagram 3' />
          <img className='w-full rounded-full border border-gray-100 object-cover' src={i8} alt='Instagram 4' />
        </div>
      </div>
    </div>
  )
}

export default Home