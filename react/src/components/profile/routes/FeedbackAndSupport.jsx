import React from 'react';

const Contact = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-purple-200 p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-center text-2xl font-bold mb-2 text-black">Feed Back Form</h1>
        <p className="text-center text-sm mb-4 text-black">Please enter your feedback below</p>

        <div className="mb-4">
          <p className="text-center font-semibold text-black">How do you rate your overall experience?</p>
          <div className="flex justify-around mt-2">
            <label className="flex flex-col items-center text-black">
              <input type="radio" name="rating" value="bad" className="mb-1" />
              <span>Bad</span>
            </label>
            <label className="flex flex-col items-center text-black">
              <input type="radio" name="rating" value="average" className="mb-1" />
              <span>Average</span>
            </label>
            <label className="flex flex-col items-center text-black">
              <input type="radio" name="rating" value="good" className="mb-1" />
              <span>Good</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block font-semibold mb-1 text-black">Full Name *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-black bg-white" />
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1 text-black">E mail *</label>
            <input type="email" className="w-full p-2 border border-gray-300 rounded-md text-black bg-white" />
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1 text-black">Age *</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded-md text-black bg-white" />
          </div>
          <div className="col-span-1">
            <label className="block font-semibold mb-1 text-black">Phone *</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-black bg-white" />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold mb-1 text-black">Message *</label>
            <textarea className="w-full p-2 border border-gray-300 rounded-md h-24 text-black bg-white"></textarea>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-200">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;

