import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-200 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl bg-purple-200 p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold mb-2 text-black">Feedback Form</h1>
        <p className="text-center text-sm mb-6 text-black">Please enter your feedback below.</p>

        <div className="mb-6">
          <p className="text-center font-semibold text-black">How do you rate your overall experience?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-around">
            <label className="flex items-center gap-2 text-black">
              <input type="radio" name="rating" value="bad" />
              <span>Bad</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input type="radio" name="rating" value="average" />
              <span>Average</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input type="radio" name="rating" value="good" />
              <span>Good</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-semibold mb-1 text-black">Full Name *</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-2xl text-black bg-white" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Email *</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-2xl text-black bg-white" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Age *</label>
            <input type="number" className="w-full p-3 border border-gray-300 rounded-2xl text-black bg-white" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Phone *</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-2xl text-black bg-white" />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1 text-black">Message *</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-2xl h-32 text-black bg-white"></textarea>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="w-full rounded-full bg-purple-600 py-3 px-6 text-white transition hover:bg-purple-700 sm:w-auto">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;

