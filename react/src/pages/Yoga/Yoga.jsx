import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import Instructions from '../../components/Instrctions/Instructions';
import { drawPoint, drawSegment } from '../../utils/helper';
import { POINTS, keypointConnections } from '../../utils/data';
import Start from '../../guidance/start.mp3';
import Correct from '../../guidance/correct.mp3';
import Incorrect from '../../guidance/incorrect.mp3';
import axios from 'axios';
import { eventMap } from '@testing-library/user-event/dist/cjs/event/eventMap.js';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

let skeletonColor = 'rgb(255,255,255)';
let poseList = [
  'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
  'Shoulderstand', 'Traingle'
];

const MET_VALUES = {
  Tree: 2.5,
  Chair: 2.3,
  Cobra: 2.3,
  Warrior: 3.3,
  Dog: 3.0,
  Shoulderstand: 2.5,
  Traingle: 2.5
};


let interval;
let incorrectInterval;
let flag = false;

function Yoga() {
  const location = useLocation();
  console.log(location.state.data);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState(location.state.data.title);
  const [isStartPose, setIsStartPose] = useState(false);

  // Audio files
  const countAudio = new Audio(Start);
  const startAudio = new Audio(Start);
  const correctPoseAudio = new Audio(Correct);
  const incorrectPoseAudio = new Audio(Incorrect);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if (timeDiff > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [startingTime, bestPerform, currentTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
  };

  function calculateCalories(pose, timeInSeconds, weightInKg = 70) {
    const metValue = MET_VALUES[pose];
    const timeInHours = timeInSeconds / 3600;
    return metValue * weightInKg * timeInHours;
  }
  

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center_new = tf.expandDims(pose_center_new, 1);

    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);

    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0));

    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
    return pose_size;
  }

  function speakFeedback(feedback) {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(feedback);
      utterance.lang = 'en-US';
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
    } else {
      console.warn('Text-to-Speech not supported in this browser.');
    }
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);

    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  }

  function landmarks_to_embedding(landmarks) {
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1, 34]);
    return embedding;
  }

  const runMovenet = async () => {
    try {
      await tf.setBackend('webgpu');
      await tf.ready();
      console.log("WebGPU backend Ready, Proceeding Further...");
    } catch (err) {
      console.warn("WebGPU backend not available. Rectifying Error...");
      await tf.setBackend('cpu');
      await tf.ready();
    }

    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json');

    // countAudio.loop = true;

    interval = setInterval(() => {
      detectPose(detector, poseClassifier);
    }, 50);

    // Start continuous feedback for incorrect pose
    incorrectInterval = setInterval(() => {
      if (!flag) {
        incorrectPoseAudio.play();
      }
    }, 2000); // Play every 1 second

    // correctInterval = setInterval(() => {
    //   if (flag) {
    //     correctPoseAudio.play();
    //   }
    // }, 4000); 
  };

function giveDynamicFeedback(keypoints) {
  console.log(keypoints,"posture points"," - is posture correct? ",flag);
  const leftShoulder = keypoints.find(point => point.name === 'left_shoulder');
  const rightShoulder = keypoints.find(point => point.name === 'right_shoulder');
  const nose = keypoints.find(point => point.name === 'nose');
  const leftEye = keypoints.find(point => point.name === 'left_eye');
  const rightEye = keypoints.find(point => point.name === 'right_eye');
  const leftHip = keypoints.find(point => point.name === 'left_hip');
  const rightHip = keypoints.find(point => point.name === 'right_hip');

  // Check if the head is too low
  // if (nose.y > 300) {
  //   speakFeedback('Raise your head');
  // }

  // // Check if the eyes are not level
  // if (Math.abs(leftEye.y - rightEye.y) > 20) {
  //   speakFeedback('Align your head');
  // }

  // // Check if the shoulders are not level
  // if (Math.abs(leftShoulder.y - rightShoulder.y) > 20) {
  //   speakFeedback('Straighten your shoulders');
  // }

  // // Check if the hips are not aligned
  // if (Math.abs(leftHip.y - rightHip.y) > 20) {
  //   speakFeedback('Align your hips');
  // }
}

function speakFeedback(feedback) {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(feedback);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    synth.speak(utterance);
  } else {
    console.warn('Text-to-Speech not supported in this browser.');
  }
}

  
  const detectPose = async (detector, poseClassifier) => {
    
    if (
     
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      if (!pose || pose.length === 0 || !pose[0].keypoints) {
        return;
      }
  
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      try {
        const keypoints = pose[0]?.keypoints;
        console.log(keypoints," keypoints srkr")
        let input = keypoints?.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)');
              let connections = keypointConnections[keypoint.name];
              try {
                connections?.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                    [keypoints[POINTS[conName]].x,
                    keypoints[POINTS[conName]].y]
                    , skeletonColor);
                });
              } catch (err) {
                console.error(err);
              }
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });
  
        if (notDetected > 2) {
          skeletonColor = 'rgb(255,255,255)';
          return;
        }
  
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);
  
        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          console.log(data[0][classNo]);
          if (data[0][classNo] > 0.97) {
            if (!flag) {
              startAudio.play();
              countAudio.play();
              setStartingTime(new Date().getTime());
              flag = true;
              skeletonColor = 'rgb(0,255,0)';
              correctPoseAudio.play();
            }
            setCurrentTime(new Date().getTime());
            console.log(keypoints,"points true")
          } else {
            flag = false;
            skeletonColor = 'rgb(255,255,255)';
            console.log(keypoints,"points false")
            giveDynamicFeedback(keypoints); // Call feedback function when the pose is incorrect
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  function startYoga() {
    setIsStartPose(true);
    runMovenet();
  }

  async function stopPose() {
    const caloriesBurned =  calculateCalories(currentPose, bestPerform);
    const data = {
      userId: localStorage.getItem("userId"),
      time: bestPerform,
      pose: currentPose,
      score:caloriesBurned,
      email: localStorage.getItem("email"),
      userName:localStorage.getItem("username")
    };
    try{
    const res =  await axios.post("https://vedic-vision-backend.onrender.com/api/user/updatecal", data,{
      headers:{
        "Content-Type": "application/json"
      }
    });
    toast.success("Data sent to your email");
  }
  catch(err){
      toast.error("Something went wrong");
  }
    

    console.log(bestPerform," time");
    setIsStartPose(false);
    
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (webcamRef.current) {
      webcamRef.current.video.srcObject.getTracks()?.forEach(track => track.stop());
    }
    // Stop all audio
    countAudio.pause();
    countAudio.currentTime = 0;
    startAudio.pause();
    startAudio.currentTime = 0;
    correctPoseAudio.pause();
    correctPoseAudio.currentTime = 0;
    incorrectPoseAudio.pause();
    incorrectPoseAudio.currentTime = 0;

    

  }

  if (isStartPose) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          <div className="pose-performance">
            <h4>Pose Time: {poseTime} s</h4>
          </div>
          <div className="pose-performance">
            <h4>Best: {bestPerform} s</h4>
          </div>
        </div>
        <div>
          <Webcam
            width='640px'
            height='480px'  
            id="webcam"
            ref={webcamRef}
            style={{
              position: 'absolute',
              padding: '0px',
              left: '35.5%',
              top: '47%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9,
              visibility: isStartPose ? 'visible' : 'hidden'
            }}
          />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: '35.5%',
              top: '47%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9,
            }}
          ></canvas>
        </div>
        <div className="pose-selection">
        {/* <select
      value={currentPose}
      onChange={(e) => setCurrentPose(e.target.value)} 
    >
      {poseList?.map((pose) => (
        <option key={pose} value={pose}>
          {pose}
        </option>
      ))}
    </select> */}
          <Instructions currentPose={currentPose} />
        </div>
        <div className="footer" style={{display:'flex',justifyContent:'center',alignItems:'center', marginTop:30}}>
          <button onClick={()=>stopPose()} className="secondary-btn bg-black text-white px-5 py-2 mt-5 rounded-lg  font-semibold">Stop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="yoga-container">
      <div className="pose-selection">
        <span className='font-semibold text-center text-lg'>{location.state.data.title} Pose</span>
      {/* <select
      value={currentPose}
      onChange={(e) => setCurrentPose(e.target.value)} 
    >
      {poseList?.map((pose) => (
        <option key={pose} value={pose}>
          {pose}
        </option>
      ))}
    </select> */}
        <Instructions currentPose={currentPose} />
      </div>
      <div className="footer" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <button onClick={startYoga} className="primary-btn bg-black text-white px-10 py-2 mt-5 rounded-lg  font-semibold z-50">Start</button>
      </div>
    </div>
  );
}

export default Yoga;
