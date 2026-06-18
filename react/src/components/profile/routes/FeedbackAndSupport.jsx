import React from 'react';

const Contact = () => {
  return (
    <div className='min-h-[60vh] rounded-3xl bg-white p-6 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Feedback & Support</h2>
      <p className='mt-3 text-sm text-slate-600'>Share your feedback or contact support for help with your account.</p>
      <form className='mt-6 space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='block font-semibold mb-2 text-slate-700'>Full Name</label>
            <input type='text' className='w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900' />
          </div>
          <div>
            <label className='block font-semibold mb-2 text-slate-700'>Email</label>
            <input type='email' className='w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900' />
          </div>
        </div>
        <div>
          <label className='block font-semibold mb-2 text-slate-700'>Message</label>
          <textarea className='w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 h-24'></textarea>
        </div>
        <div className='text-center'>
          <button type='submit' className='rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;

