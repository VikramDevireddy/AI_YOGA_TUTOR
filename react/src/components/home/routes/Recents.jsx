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
    <div className='w-full p-4 pr-20'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Recents</h1>
      {/* <p className='mt-4 mb-2 font-bold text-xl'>You've Completed a 30mins Workout...!</p> */}
      <div className='relative'>
        <img 
          src={bg} 
          alt="Background" 
          className='w-full h-auto object-fill rounded-lg max-h-72 shadow-2xl opacity-60' 
        />
        <h1 className='absolute bottom-4 left-5 text-white text-2xl font-bold'>You've burned in your lastworkout {parseFloat(calories).toFixed(2)} calories</h1>
      </div>
      <h1 className='font-bold mt-4'>1/30</h1>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
        <div
          className="bg-blue-500 h-full"
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <p className='mt-2'>Days Completed</p>
      <div className='mt-2'>
        <button className='float-right bg-blue-500 text-white px-4 py-2 rounded-lg'>
          Continue →
        </button>
      </div>
    </div>
  );
}

export default Recents;
