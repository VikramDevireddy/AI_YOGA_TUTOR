/* eslint-disable react/jsx-key */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { poseImages } from '../../../utils/pose_images';

const DaysPlan = () => {

  let poseList = [
    'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
    'Shoulderstand', 'Traingle'
  ];
  const data=[
    {
      id:1,
      title:"Tree",
      imag:poseImages["Tree"],
      benefit : "This pose promotes balance and directs your attention to the present moment"
    },
    {
      id:2,
      title:"Chair",
      imag:poseImages["Chair"],
      benefit : "This strengthens your legs, upper back, and shoulders"
    },
    {
      id:3,
      title:"Dog",
      imag:poseImages["Dog"],
      benefit : "This is useful for creating length in the spine, without all the weight on your upper body"
    },
    {
      id:4,
      title:"Cobra",
      imag:poseImages["Cobra"],
      benefit : "This pose lengthens your spine, and stretches your hamstrings"
    },
    {
      id:5,
      title:"Warrior",
      imag:poseImages["Warrior"],
      benefit : "This pose strengthens your legs and ankles while increasing stamina"
    },
    {
      id:6,
      title:"Triangle",
      imag:poseImages["Traingle"],
      benefit : "This pose promote balance, stretch the hamstrings and inner thighs, and create a feeling of expansion in the body"
    },
    {
      id:7,
      title:"Shoulderstand",
      imag:poseImages["Shoulderstand"],
      benefit : "This pose helps improve concentration and your ability to balance"
    },
    {
      id:8,
      title:"Bridge Pose (Setu Bandha Sarvangasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/bridge.gif",
      benefit : "This energizing backbend opens your chest and stretches your neck and spine"
    },
    {
      id:9,
      title:"Bound Ankle Pose (Baddha Konasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/BoundAngle.jpg",
      benefit : "You’ll give your inner thighs and groin a nice stretch, while the forward bend creates a calming, cooling effect"
    },
    {
      id:10,
      title:"Seated Forward Fold (Paschimottanasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/SeatedForwardFold.jpg",
      benefit:"This feel-good fold elongates the back of your body, lengthens your spine, and stretches your hamstrings"
    },
    {
      id:11,
      title:"Corpse Pose (Savasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/CorpsePose.jpg",
      benefit:"Relaxes the whole body and gives you space to absorb the benefits of the practice"
    },
    {
      id:12,
      title:"Plank Pose (Kumbhakasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/Plank_B.jpg",
      benefit:" Plank Pose strengthens your abdominals and promotes stability."
    },
    {
      id:13,
      title:"Four-Limbed Staff Pose (Kumbhakasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/chaturanga.gif",
      benefit:"It promotes core stability and strengthens your abdominals and triceps."
    },
    {
      id:14,
      title:"Upward-Facing Dog (Urdhva Mukha Svanasana)",
      imag:"https://media.post.rvohealth.io/wp-content/uploads/sites/2/2019/05/UpwardDog.gif",
      benefit:"You’ll open up your chest and shoulders, while stretching the abdominals and hip flexors."
    }
  ]

  const navigation = useNavigate();
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {data.map((w) => (
          <div key={w.id} className="rounded-3xl border border-slate-300 bg-white p-5 shadow-sm transition hover:shadow-lg">
            <div className="flex flex-col gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
                <img
                  src={w.imag}
                  alt={w.title}
                  className="h-28 w-28 rounded-3xl object-cover shadow-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">Day-{w.id}</h1>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{w.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{w.benefit}</p>
                </div>
              </div>
              <button className="mx-auto mt-4 inline-flex rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 md:mx-0 md:mt-0"
                onClick={() => navigation('/secured/home/startworkout', { state: { data: w } })}
              >
                Start Workout
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysPlan;