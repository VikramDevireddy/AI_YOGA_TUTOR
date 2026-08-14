import React from 'react'
import CountUp from 'react-countup';
// import { FaArrowRight } from "react-icons/fa6";
// import { useNavigate } from 'react-router-dom';
// import i1 from "../../assets/home1.png";
// import i2 from "../../assets/home2.png";
// import i3 from "../../assets/home3.png";
// import i4 from "../../assets/home4.png";
// import i5 from "../../assets/home5.png";
// import i6 from "../../assets/home6.png";
// import i7 from "../../assets/home7.png";
// import i8 from "../../assets/home8.png";


import { FaArrowRight, FaBrain, FaLeaf, FaDumbbell, FaVideo } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import i1 from "../../assets/home1.png";
import i2 from "../../assets/home2.png";
import i3 from "../../assets/home3.png";
import i4 from "../../assets/home4.png";
import i5 from "../../assets/home5.png";
import i6 from "../../assets/home6.png";
import i7 from "../../assets/home7.png";
import i8 from "../../assets/home8.png";

const Home = () => {
  const nav = useNavigate();
  return (
    <div className='bg-surface-50 min-h-screen relative overflow-hidden'>
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Hero Section */}
      <section className='relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-8'>
        <div className='flex-1 text-center lg:text-left'>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100/80 text-primary-700 text-sm font-semibold mb-6 shadow-sm border border-primary-200/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
            </span>
            Meet your AI Yoga Coach
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.15] tracking-tight mb-6'>
            Find your center with <span className='inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent'>Ai Yoga Assistant</span>
          </h1>
          <p className='mt-4 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-600 leading-relaxed'>
            Transform your practice with real-time AI guidance, personalized routines, and a community dedicated to mindful living.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button onClick={() => nav('/sign-up')} className='w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-medium shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group text-lg'>
              Start Free Trial
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => nav('/about')} className='w-full sm:w-auto px-8 py-4 bg-white/70 hover:bg-white text-gray-800 rounded-2xl font-medium shadow-sm border border-gray-200 backdrop-blur-md transition-colors text-lg'>
              How it works
            </button>
          </div>

          <div className='mt-12 pt-8 border-t border-gray-200/60 grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className="text-center lg:text-left">
              <p className="text-4xl font-display font-bold text-gray-900"><CountUp end={100} suffix="+" duration={2.5} /></p>
              <p className="text-sm font-medium text-gray-500 mt-1">Guided Poses</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-4xl font-display font-bold text-gray-900"><CountUp end={10} suffix="k+" duration={2.5} /></p>
              <p className="text-sm font-medium text-gray-500 mt-1">Active Yogis</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-4xl font-display font-bold text-gray-900"><CountUp end={24} suffix="/7" duration={2} /></p>
              <p className="text-sm font-medium text-gray-500 mt-1">AI Feedback</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-4xl font-display font-bold text-gray-900">4.9</p>
              <p className="text-sm font-medium text-gray-500 mt-1">App Rating</p>
            </div>
          </div>
        </div>
        <div className='w-full lg:w-[45%] relative perspective-1000'>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out z-10 border border-white/20">
            <img className='w-full h-auto object-cover' src={i1} alt='AI Yoga Coach Interface' />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent p-6 pt-20 flex justify-between items-end">
              <div>
                <p className="text-white font-semibold text-lg drop-shadow-md">Warrior II Pose</p>
                <p className="text-white/80 text-sm flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Perfect alignment</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 text-white font-medium text-sm">
                98% Accuracy
              </div>
            </div>
          </div>
          {/* Decorative floating cards behind hero image */}
          <div className="absolute -top-6 -right-6 lg:-right-12 w-32 h-32 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 -z-10 animate-fade-in flex flex-col items-center justify-center p-3 transform rotate-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-2 text-primary-600 text-xl"><FaBrain /></div>
            <span className="text-xs font-semibold text-gray-800 text-center">AI Powered</span>
          </div>
          <div className="absolute -bottom-8 -left-6 lg:-left-12 w-36 h-36 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 -z-10 animate-fade-in flex flex-col items-center justify-center p-3 transform -rotate-3 animation-delay-500">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600 text-xl"><FaLeaf /></div>
            <span className="text-xs font-semibold text-gray-800 text-center">Mindful Living</span>
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className='relative z-10 py-16 bg-white/50 backdrop-blur-lg border-y border-gray-200/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center gap-12'>
            <div className='w-full md:w-1/2 relative group'>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500 blur-xl"></div>
              <img className='w-full rounded-3xl object-cover shadow-card relative z-10' src={i2} alt='Yoga practice on mobile' />
            </div>
            <div className='flex-1 md:pl-10'>
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl mb-6 shadow-sm border border-primary-100"><FaVideo /></div>
              <h2 className='text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6'>Personalized virtual coaching, anywhere.</h2>
              <p className='text-lg text-gray-600 leading-relaxed mb-8'>
                Transform your practice with AI-driven yoga guidance that adapts to your body and goals in real-time. Just set up your camera and start moving.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time posture correction and feedback",
                  "Personalized routines based on your goals",
                  "Progress tracking and analytics over time"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className='relative z-10 py-20 lg:py-32'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col-reverse md:flex-row items-center gap-12'>
            <div className='flex-1 md:pr-10'>
              <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-bold tracking-wider uppercase mb-5">Mind & Body</div>
              <h2 className='text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight'>Bring Happiness To Good Health.</h2>
              <p className='text-lg text-gray-600 leading-relaxed'>
                If you take care of your physical health, you naturally nurture your mental wellbeing. Build a balanced, vibrant lifestyle with positive thoughts and mindful movement every single day.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="glass-card p-5 bg-white/40">
                  <h4 className="font-bold text-gray-900 mb-2">Mental Clarity</h4>
                  <p className="text-sm text-gray-600">Reduce stress and increase focus through guided breathwork.</p>
                </div>
                <div className="glass-card p-5 bg-white/40">
                  <h4 className="font-bold text-gray-900 mb-2">Physical Strength</h4>
                  <p className="text-sm text-gray-600">Build core strength, flexibility, and balance naturally.</p>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2'>
              <img className='w-full rounded-3xl object-cover shadow-2xl' src={i3} alt='Healthy living meditation' />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 */}
      <section className='relative z-10 py-16 bg-gradient-to-b from-transparent to-gray-100/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center gap-12 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-glass border border-white/50'>
            <div className='w-full md:w-1/2 flex justify-center'>
              <div className="relative w-full max-w-sm aspect-square rounded-full flex items-center justify-center p-4 border border-dashed border-gray-300">
                <div className="absolute inset-0 rounded-full bg-primary-100/50 animate-pulse"></div>
                <img className='w-full h-full rounded-full object-cover shadow-xl relative z-10' src={i4} alt='Yoga anywhere circle' />
              </div>
            </div>
            <div className='flex-1 md:pl-8 text-center md:text-left'>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl mb-6 shadow-sm border border-orange-100 mx-auto md:mx-0"><FaDumbbell /></div>
              <h2 className='text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-5'>Anytime, Any Place, Any Workout</h2>
              <p className='text-lg text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0'>
                Master every pose with real-time AI feedback. Your virtual yoga coach is ready to guide you whether you're in your living room, a hotel, or a park.
              </p>
              <button onClick={() => nav('/sign-up')} className='mt-8 glass-button !px-8 !py-3 inline-flex mx-auto md:mx-0'>
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Instagram Section */}
      <section className='relative z-10 py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4'>Join our Community</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-16">Connect with thousands of yogis worldwide. Follow our journey on Instagram for daily inspiration and tips.</p>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            <div className="hidden lg:flex w-[25%] flex-col gap-6 transform translate-y-12">
              <img className='w-full aspect-square rounded-3xl object-cover shadow-lg hover:-translate-y-2 transition-transform duration-300' src={i5} alt='Instagram feature 1' />
              <img className='w-full aspect-square rounded-3xl object-cover shadow-lg hover:-translate-y-2 transition-transform duration-300' src={i6} alt='Instagram feature 2' />
            </div>

            <div className="w-full lg:w-[40%] bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-glass border border-white/50 flex flex-col items-center justify-center z-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1 mb-6 shadow-xl transform group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-3xl">
                  📸
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">@aiyogacoach</h3>
              <p className="text-gray-500 mb-8 max-w-xs">Follow us for daily poses, mindful tips, and community spotlights.</p>
              <button
                className='px-8 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-medium shadow-md hover:shadow-xl transition-all flex items-center gap-2'
                onClick={() => window.open("https://instagram.com", "_blank")}
              >
                Follow on Instagram <FaArrowRight className="text-sm" />
              </button>
            </div>

            <div className="flex lg:hidden w-full gap-4 mt-8">
              <img className='w-1/2 aspect-square rounded-2xl object-cover shadow-md' src={i5} alt='Instagram feature 1 mobile' />
              <img className='w-1/2 aspect-square rounded-2xl object-cover shadow-md' src={i6} alt='Instagram feature 2 mobile' />
            </div>

            <div className="hidden lg:flex w-[25%] flex-col gap-6 transform -translate-y-8">
              <img className='w-full aspect-square rounded-3xl object-cover shadow-lg hover:-translate-y-2 transition-transform duration-300' src={i7} alt='Instagram feature 3' />
              <img className='w-full aspect-square rounded-3xl object-cover shadow-lg hover:-translate-y-2 transition-transform duration-300' src={i8} alt='Instagram feature 4' />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home