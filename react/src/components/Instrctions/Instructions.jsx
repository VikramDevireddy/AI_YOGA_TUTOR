import React, { useState } from 'react'
import { poseInstructions } from '../../utils/data'
import { poseImages } from '../../utils/pose_images'
import { FaInfoCircle, FaCheckCircle } from 'react-icons/fa'

export default function Instructions({ currentPose }) {
    const [instructions] = useState(poseInstructions)

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <FaInfoCircle className="text-primary-500 text-xl" />
                <h3 className="font-display font-bold text-xl text-gray-900">How to perform</h3>
            </div>

            <div className="w-full bg-primary-50 rounded-2xl p-4 flex items-center justify-center border border-primary-100/50 shadow-inner">
                {poseImages[currentPose] ? (
                    <img
                        className="h-48 md:h-56 object-contain rounded-xl mix-blend-multiply"
                        alt={`${currentPose} Yoga pose demonstration`}
                        src={poseImages[currentPose]}
                    />
                ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">Preview not available</div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ul className="flex flex-col gap-4">
                    {instructions[currentPose]?.map((instruction, index) => {
                        return (
                            <li key={index} className="flex gap-4 items-start group">
                                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold group-hover:bg-primary-500 group-hover:text-white transition-colors shadow-sm">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-900 transition-colors">
                                    {instruction}
                                </p>
                            </li>
                        )
                    }) || (
                            <p className="text-gray-500 text-sm text-center py-4">Instructions not available for this pose.</p>
                        )}
                </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3 border border-green-100">
                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-800 leading-tight">Focus on your breathing. Keep it steady and deep throughout the entire posture.</p>
            </div>
        </div>
    )
}
