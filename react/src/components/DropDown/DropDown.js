import React from 'react';

function DropDown({ poseList, currentPose, setCurrentPose }) {
  return (
    <select
      value={currentPose}
      onChange={(e) => setCurrentPose(e.target.value)} 
    >
      {poseList?.map((pose) => (
        <option key={pose} value={pose}>
          {pose}
        </option>
      ))}
    </select>
  );
}

export default DropDown;
