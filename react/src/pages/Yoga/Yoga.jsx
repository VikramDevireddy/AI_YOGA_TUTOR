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
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlay, FaStop, FaBrain, FaClock, FaTrophy, FaArrowLeft } from 'react-icons/fa6';

let skeletonColor = 'rgb(255,255,255)';

const MET_VALUES = {
  Tree: 2.5,
  Chair: 2.3,
  Cobra: 2.3,
  Warrior: 3.3,
  Dog: 3.0,
  Shoulderstand: 2.5,
  Traingle: 2.5
};

function Yoga() {
  const location = useLocation();
  const nav = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const intervalRef = useRef(null);
  const incorrectIntervalRef = useRef(null);
  const flagRef = useRef(false);
  const detectorRef = useRef(null);
  const classifierRef = useRef(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState(location?.state?.data?.title || 'Tree');
  const [isStartPose, setIsStartPose] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCorrectPose, setIsCorrectPose] = useState(false);

  // Audio files
  const countAudio = new Audio(Start);
  const startAudio = new Audio(Start);
  const correctPoseAudio = new Audio(Correct);
  const incorrectPoseAudio = new Audio(Incorrect);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flagRef.current) {
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
    const metValue = MET_VALUES[pose] || 2.5;
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

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(incorrectIntervalRef.current);

      if (webcamRef.current?.video?.srcObject) {
        webcamRef.current.video.srcObject.getTracks().forEach(t => t.stop());
      }

      if (classifierRef.current) {
        classifierRef.current.dispose();
      }
      if (detectorRef.current && typeof detectorRef.current.dispose === 'function') {
        detectorRef.current.dispose();
      }

      flagRef.current = false;
    };
  }, []);

  const resizeCanvas = () => {
    if (webcamRef.current && canvasRef.current && containerRef.current) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }

  const runMovenet = async () => {
    setIsAiLoading(true);
    try {
      await tf.setBackend('webgpu');
      await tf.ready();
    } catch (err) {
      await tf.setBackend('cpu');
      await tf.ready();
    }

    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const modelUrl = import.meta.env.VITE_AI_MODEL_URL || 'https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json';
    const poseClassifier = await tf.loadLayersModel(modelUrl);

    detectorRef.current = detector;
    classifierRef.current = poseClassifier;

    setIsAiLoading(false);

    intervalRef.current = setInterval(() => {
      detectPose(detector, poseClassifier);
    }, 50);

    incorrectIntervalRef.current = setInterval(() => {
      if (!flagRef.current && isStartPose) {
        incorrectPoseAudio.play().catch(e => console.log(e));
      }
    }, 3000);
  };

  function giveDynamicFeedback(keypoints) {
    // Basic dynamic feedback stub
  }

  const detectPose = async (detector, poseClassifier) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video;

      // Match canvas dimensions to video automatically
      if (canvasRef.current.width !== video.videoWidth) {
        resizeCanvas();
      }

      const pose = await detector.estimatePoses(video);
      if (!pose || pose.length === 0 || !pose[0].keypoints) return;

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      try {
        const keypoints = pose[0]?.keypoints;
        let input = keypoints?.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, skeletonColor);
              let connections = keypointConnections[keypoint.name];
              try {
                connections?.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  if (keypoints[POINTS[conName]]) {
                    drawSegment(ctx, [keypoint.x, keypoint.y],
                      [keypoints[POINTS[conName]].x,
                      keypoints[POINTS[conName]].y], skeletonColor);
                  }
                });
              } catch (err) { }
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });

        if (notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)';
          setIsCorrectPose(false);
          return;
        }

        const processedInput = tf.tidy(() => landmarks_to_embedding(input));
        const classification = poseClassifier.predict(processedInput);

        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          if (data[0][classNo] > 0.97) {
            if (!flagRef.current) {
              startAudio.play().catch(e => console.log(e));
              setStartingTime(new Date().getTime());
              flagRef.current = true;
              skeletonColor = 'rgb(34, 197, 94)'; // Tailwind green-500
              correctPoseAudio.play().catch(e => console.log(e));
              setIsCorrectPose(true);
            }
            setCurrentTime(new Date().getTime());
          } else {
            flagRef.current = false;
            skeletonColor = 'rgb(255,255,255)';
            setIsCorrectPose(false);
            giveDynamicFeedback(keypoints);
          }
        }).finally(() => {
          processedInput.dispose();
          classification.dispose();
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startYoga = () => {
    setIsStartPose(true);
    // Add small delay to ensure DOM is ready for camera
    setTimeout(() => {
      runMovenet();
    }, 100);
  }

  const stopPose = async () => {
    clearInterval(intervalRef.current);
    clearInterval(incorrectIntervalRef.current);
    intervalRef.current = null;
    incorrectIntervalRef.current = null;
    flagRef.current = false;

    const caloriesBurned = calculateCalories(currentPose, bestPerform);
    const data = {
      time: bestPerform,
      pose: currentPose,
      score: caloriesBurned
    };

    if (bestPerform > 2) {
      try {
        await api.post("/api/user/updatecal", data);
        toast.success("Progress saved successfully!");
      } catch (err) {
        toast.error("Failed to save progress");
      }
    }

    setIsStartPose(false);
    setIsCorrectPose(false);
    skeletonColor = 'rgb(255,255,255)';

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    // Attempt to stop camera tracks properly
    if (webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      webcamRef.current.video.srcObject = null;
    }

    // Stop all audio cleanly
    try {
      countAudio.pause(); countAudio.currentTime = 0;
      startAudio.pause(); startAudio.currentTime = 0;
      correctPoseAudio.pause(); correctPoseAudio.currentTime = 0;
      incorrectPoseAudio.pause(); incorrectPoseAudio.currentTime = 0;
    } catch (e) { }
  }

  return (
    <div className="w-full flex-1">
      {/* Header section with back button and title */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => isStartPose ? stopPose() : nav(-1)} className="p-2 rounded-xl text-gray-500 hover:bg-white/50 hover:text-gray-800 transition-colors">
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-display font-bold text-gray-900 bg-white/40 px-6 py-2 rounded-2xl border border-white/50 shadow-sm backdrop-blur-md">
          {currentPose} Pose Session
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Side: Camera or Pre-start State */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className={`glass-card p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-gray-900 shadow-glass-strong border-gray-700/50 ${isCorrectPose ? 'ring-4 ring-green-500/50' : 'ring-1 ring-white/10'}`}>

            {!isStartPose ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/80 rounded-2xl border border-gray-700 w-full h-full max-w-md mx-auto backdrop-blur-sm z-10 my-10">
                <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-6">
                  <FaBrain className="text-4xl text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">AI Vision Ready</h2>
                <p className="text-gray-400 mb-8 max-w-sm">Position your device so your full body is visible in the frame. The AI will guide your posture automatically.</p>

                <button
                  onClick={isAiLoading ? null : startYoga}
                  disabled={isAiLoading}
                  className={`w-full max-w-xs flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg text-white shadow-xl transition-all ${isAiLoading ? 'bg-gray-600 cursor-wait' : 'bg-gradient-to-r from-primary-500 to-accent hover:shadow-primary-500/25 hover:-translate-y-1'}`}
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading Engine...
                    </>
                  ) : (
                    <>
                      <FaPlay /> Start Session
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div ref={containerRef} className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-black object-contain aspect-video">
                {isAiLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-20 backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-medium">Initializing Vision Model...</p>
                  </div>
                )}

                {/* Status Overlay */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 backdrop-blur-md border ${isCorrectPose ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-800/60 text-gray-300 border-gray-600/50'}`}>
                    <div className={`w-2 h-2 rounded-full ${isCorrectPose ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    {isCorrectPose ? 'Perfect Alignment' : 'Adjusting Pose...'}
                  </div>
                </div>

                <Webcam
                  ref={webcamRef}
                  mirrored={true}
                  className="absolute w-full h-full object-contain"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute w-full h-full object-contain z-10"
                />
              </div>
            )}
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 bg-white/60 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 text-xl">
                <FaClock />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Hold</p>
                <p className="text-2xl font-display font-bold text-gray-900">{poseTime.toFixed(1)}<span className="text-lg text-gray-400 font-medium ml-1">s</span></p>
              </div>
            </div>
            <div className="glass-card p-5 bg-white/60 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 text-xl">
                <FaTrophy />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Best Record</p>
                <p className="text-2xl font-display font-bold text-gray-900">{bestPerform.toFixed(1)}<span className="text-lg text-gray-400 font-medium ml-1">s</span></p>
              </div>
            </div>
          </div>

          {isStartPose && (
            <div className="flex justify-center mt-2">
              <button
                onClick={stopPose}
                className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-1"
              >
                <FaStop /> End Session & Save
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Instructions */}
        <div className="flex-1 lg:max-w-sm flex flex-col gap-6">
          <div className="glass-card p-6 bg-white/60 h-full">
            <Instructions currentPose={currentPose} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Yoga;
