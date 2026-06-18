import React from 'react'
import { useLocation } from 'react-router-dom'
import Yoga from '../../../pages/Yoga/Yoga';

const StratWorkout = () => {
    const location = useLocation();
    console.log(location?.state?.data)
  return (
    <div className='min-h-screen w-full'>
      <Yoga/>
    </div>
  )
}

export default StratWorkout