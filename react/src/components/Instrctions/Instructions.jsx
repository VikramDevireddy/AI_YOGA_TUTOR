import React, { useState } from 'react'

import { poseInstructions } from '../../utils/data'

import { poseImages } from '../../utils/pose_images'

import './Instructions.css'

export default function Instructions({ currentPose }) {

    const [instructions] = useState(poseInstructions)

    return (
        <div className="instructions-container">
            <ul className="instructions-list bg-black text-white ">
                {instructions[currentPose]?.map((instruction, index) => {
                    return(
                        <li key = {index} className="instruction">{instruction}</li>
                    )
                    
                })}
            </ul>
            <img 
                className="pose-demo-img mr-16"
                alt = "Yoga poses Loading ..."
                src={poseImages[currentPose]}
            />
        </div>
    )
}
