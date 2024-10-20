import React from 'react';
import axios from 'axios';
import { FaWhatsapp } from "react-icons/fa";

const Notifications = () => {
  const phoneNumber = '917386431360';
  const message = 'Hello, this is a test message!';
  const apiEndpoint = 'https://vedic-vision-backend.onrender.com/api/user/sendotp';

  const handleSendMessage = () => {
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
      const response = await axios.post(apiEndpoint, { email:email,userName:localStorage.getItem("username") });
      alert('Email sent successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <div>
      
      <div>
        
      <button onClick={handleSendMessage}>
        <FaWhatsapp size={40} color='black'/>
        Send WhatsApp 
      </button>
      </div>
      <button onClick={handleSendEmail}>
        Send Email
      </button>
    </div>
  );
};

export default Notifications;
