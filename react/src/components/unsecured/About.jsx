import React from 'react';

const About = () => {
  const sections = [
    {
      title: 'Personalized Assistant',
      description: 'Yoga AI adapts to your unique needs and fitness level, tailoring sessions to your goals while refining recommendations over time.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.gRSXVoDgHQYsfZlbWuvOhwHaES&pid=Api&P=0&h=180',
    },
    {
      title: 'Real Time Feedback',
      description: 'Advanced pose detection analyzes your posture and offers instant corrections to improve alignment and reduce injury risk.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.gRSXVoDgHQYsfZlbWuvOhwHaES&pid=Api&P=0&h=180',
    },
    {
      title: 'Progress Training',
      description: 'Effortlessly track improvements over time so you can see how your strength, flexibility, and performance evolve.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.gRSXVoDgHQYsfZlbWuvOhwHaES&pid=Api&P=0&h=180',
    },
    {
      title: 'Advanced Pose Training',
      description: 'Break down challenging asanas into manageable steps and receive expert guidance to master your practice.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.gRSXVoDgHQYsfZlbWuvOhwHaES&pid=Api&P=0&h=180',
    },
    {
      title: 'Flexibility Improvement',
      description: 'AI-designed routines gradually increase your flexibility while keeping the practice safe and sustainable.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.gRSXVoDgHQYsfZlbWuvOhwHaES&pid=Api&P=0&h=180',
    },
    {
      title: 'Convenience and Accessibility',
      description: 'Practice anytime, anywhere with AI guidance that fits your schedule and environment.',
      image: 'https://tse1.mm.bing.net/th?id=OIP.gRSXVoDgHQYsfZlbWuvOhwHaES&pid=Api&P=0&h=180',
    },
  ];

  return (
    <div className="min-h-screen bg-purple-100 py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 p-8 shadow-2xl">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-white">BENEFITS OF AI-ASSISTED YOGA</h1>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-3xl bg-white p-6 shadow-lg">
            <img src={section.image} alt={section.title} className="mb-4 h-24 w-24 rounded-3xl object-cover" />
            <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
