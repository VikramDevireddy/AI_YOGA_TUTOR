import React, { useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const Notifications = () => {
  const phoneNumber = localStorage.getItem("phone") // Phone number in international format without '+'
  const message = 'Hello, this is a test message!';
  const apiEndpoint = 'https://vedic-vision-backend.onrender.com/api/user/sendotp';

  const handleSendMessage = () => {
    // Open WhatsApp with pre-filled message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = async () => {
    const email = localStorage.getItem("email");
    
    if (!email) {
      alert("No email found in localStorage.");
      return;
    }

    try {
      const response = await axios.post(apiEndpoint, { email });
      toast.success('Email sent successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email.');
    }
  };

  useEffect(()=>{
    handleSendEmail();
  },[])
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md rounded-3xl bg-white p-6 shadow-xl'>
        <div className='flex flex-col items-center gap-6'>
          <FaWhatsapp size={48} color='green' />
          <h1 className='text-xl font-semibold text-slate-900'>Notifications</h1>
          <p className='text-center text-sm text-slate-600'>Tap the button to send a WhatsApp message with a prefilled text.</p>
          <button
            onClick={handleSendMessage}
            className='w-full rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600'
          >
            Send WhatsApp Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
