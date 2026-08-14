import React, { useEffect, useState } from 'react';
import bg from '../../../assets/bg.jpg';
import api from '../../../services/api';
import { FaFire } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Recents = () => {
  const progress = 1;
  const goal = 30;
  const percentage = (progress / goal) * 100;
  const [calories, setCalories] = useState(0);
  const nav = useNavigate();

  const getCalories = async () => {
    try {
      const res = await api.post("/api/user/fetchyogadata")
      setCalories(res?.data?.totalCalories || 0);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCalories();
  }, [])

  return (
    <div className='w-full'>
      <div className="flex flex-col gap-1 mb-8">
        <h1 className='text-3xl font-display font-bold text-gray-900'>Your Dashboard</h1>
        <p className="text-gray-500">Pick up right where you left off.</p>
      </div>

      <div className='relative overflow-hidden rounded-[2rem] shadow-glass-strong border border-white/50 group'>
        <div className="absolute inset-0 bg-gray-900/40 z-10 group-hover:bg-gray-900/30 transition-colors duration-500"></div>
        <img
          src={bg}
          alt='Background'
          className='w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700'
        />

        <div className='absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10'>
          <div className="self-end">
            <div className="glass-card !bg-white/20 !border-white/30 backdrop-blur-md px-4 py-2 flex items-center gap-2">
              <FaFire className="text-orange-400" />
              <span className="text-white font-bold">{parseFloat(calories).toFixed(1)} kcal burned</span>
            </div>
          </div>

          <div className="mt-auto">
            <h2 className='text-3xl sm:text-4xl font-display font-bold text-white mb-2 drop-shadow-md'>Warrior II Pose</h2>
            <p className="text-white/90 text-lg mb-6 max-w-lg drop-shadow">You held your last pose perfectly for 45 seconds. Keep up the great work!</p>

            <div className='glass-card !bg-white/10 !border-white/20 backdrop-blur-xl p-6 relative overflow-hidden'>
              <div className='flex items-center justify-between gap-4 mb-3'>
                <p className='font-bold text-white text-lg'>30-Day Goal Progress</p>
                <span className='text-sm text-white/80 font-medium bg-white/20 px-3 py-1 rounded-full'>Day {progress} of {goal}</span>
              </div>
              <div className='w-full overflow-hidden rounded-full bg-white/20 h-2.5 mb-5'>
                <div className='bg-gradient-to-r from-primary-400 to-accent h-full rounded-full transition-all duration-1000 ease-out relative' style={{ width: `${percentage}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-sm rounded-full"></div>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={() => nav('/secured/home/startworkout')}
                  className='bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-xl hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2'
                >
                  Continue Journey <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="glass-card p-6 bg-white/60">
          <h4 className="text-gray-500 font-medium mb-1">Weekly Streak</h4>
          <p className="text-3xl font-display font-bold text-gray-900">3 Days</p>
        </div>
        <div className="glass-card p-6 bg-white/60">
          <h4 className="text-gray-500 font-medium mb-1">Total Time</h4>
          <p className="text-3xl font-display font-bold text-gray-900">125 Min</p>
        </div>
        <div className="glass-card p-6 bg-white/60">
          <h4 className="text-gray-500 font-medium mb-1">Avg Accuracy</h4>
          <p className="text-3xl font-display font-bold text-gray-900 text-green-600">92%</p>
        </div>
      </div>
    </div>
  );
}

export default Recents;
