import React, { useEffect, useState } from 'react';
import bg from '../../../assets/bg.jpg';
import axios from 'axios';

const Recents = () => {
  const progress = 1; 
  const goal = 30; 
  const percentage = (progress / goal) * 100; // Calculate the percentage
  const [calories,setCalories] = useState(0);

  const getCalories = async() =>{
    const data = {
      userId: localStorage.getItem("userId"),

    }
      try {
        const res = await axios.post("https://vedic-vision-backend.onrender.com/api/user/fetchyogadata",data,{
          headers:{
            'Content-Type': 'application/json',
          }
          
        })
        setCalories(res?.data?.totalCalories);
        console.log(res?.data);
      } catch (error) {
        console.error(error);
      }
  }
useEffect(()=>{
  getCalories();
},[])
  return (
    <div className='w-full p-4 sm:p-6 lg:p-8'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Recents</h1>
      <div className='relative overflow-hidden rounded-3xl shadow-2xl'>
        <img
          src={bg}
          alt='Background'
          className='w-full h-auto max-h-96 object-cover opacity-80'
        />
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6'>
          <h1 className='text-lg sm:text-2xl font-bold text-white'>You've burned in your last workout {parseFloat(calories).toFixed(2)} calories</h1>
        </div>
      </div>
      <div className='mt-6 space-y-4'>
        <div>
          <div className='flex items-center justify-between gap-4'>
            <p className='font-bold text-slate-900'>Progress</p>
            <span className='text-sm text-slate-500'>1/30 days</span>
          </div>
          <div className='mt-2 w-full overflow-hidden rounded-full bg-gray-200 h-3'>
            <div className='bg-blue-500 h-full transition-all duration-300' style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <div className='flex justify-end'>
          <button className='rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600'>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Recents;
