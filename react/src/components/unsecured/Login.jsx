import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import loginImg from '../../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast';

const Login = () => {
  const [text,setText] = useState("Login");
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  });

  const navigate = useNavigate();

  return (
    <div className='unsecured-common-height flex items-center justify-center w-full px-4 py-10'>
      <div className='flex w-full max-w-5xl flex-col gap-6 overflow-hidden rounded-3xl bg-gray-200 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100 md:flex-row'>
        <div className='flex-1 p-8'>
          <h2 className='text-xl font-semibold mb-4 text-center'>Login</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setText("Loading...")
                const res = await axios.post('https://vedic-vision-backend.onrender.com/api/user/login', {
                  email: values.email,
                  password: values.password
                }, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                console.log(res);

                if (res.status === 200) {
                  localStorage.setItem("username",res.data.userDetails.firstName+" "+res.data.userDetails.lastName);
                  console.log("https://vedic-vision-backend.onrender.com/image/"+res.data.userDetails.photo)
                  localStorage.setItem("userImg","https://vedic-vision-backend.onrender.com/upload/"+res.data.userDetails.photo);
                  toast.success('Login successful!');
                  localStorage.setItem("email",res.data.userDetails.email);
                  localStorage.setItem("userId",res.data.userDetails.id);
                  localStorage.setItem("phone",res.data.userDetails.phone);
                  localStorage.setItem("calories",res.data.calories);

                  navigate("/secured/home/recents");
                }
              } catch (error) {
                toast.error('Login failed! Please check your credentials.'
                );
                console.log(error);
              }
              finally{
                setText("Login");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className='mb-6'>
                  <label htmlFor='email' className='block text-gray-700 font-medium text-sm mb-2'>Email</label>
                  <Field
                    type='email'
                    id='email'
                    name='email'
                    className='mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                    placeholder="Enter email or username"
                    autoComplete='email'
                  />
                  <ErrorMessage name='email' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                </div>

                <div className='mb-6'>
                  <label htmlFor='password' className='block text-gray-700 font-medium text-sm mb-2'>Password</label>
                  <Field
                    type='password'
                    id='password'
                    name='password'
                    className='mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                    placeholder="Enter password"
                    autoComplete='current-password'
                  />
                  <ErrorMessage name='password' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                </div>

                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  disabled={isSubmitting}
                >
                  {text}
                </button>
                <div className='flex gap-2 justify-center mt-6'>
                  <span className='font-semibold text-sm text-gray-700'>New user?</span>
                  <button 
                    type='button'
                    className='underline text-blue-600 hover:text-blue-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1' 
                    onClick={() => navigate("/sign-up")}
                  >
                    Register
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='w-full md:w-1/2'>
          <img src={loginImg} alt="Login Illustration" className='w-full max-h-96 object-cover rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none md:max-h-full' />
        </div>
      </div>
    </div>
  );
};

export default Login;
