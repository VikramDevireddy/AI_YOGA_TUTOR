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
    <div className='flex justify-center items-center common-height'>
      <div className='flex flex-col items-center'>
        <FaWhatsapp size={40} color='black'/>
      <button onClick={handleSendMessage}>
        Send WhatsApp Message
      </button>
      </div>

      {/* <button onClick={handleSendEmail}>
        Send Email
      </button> */}
    </div>
  );
};

export default Notifications;
