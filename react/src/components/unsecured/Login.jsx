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
    <div className='unsecured-common-height flex items-center justify-center w-full'>
      <div className='flex gap-6  min-w-[60%] bg-gray-200 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100'>
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
                <div className='mb-4'>
                  <label htmlFor='email' className='block text-gray-700'>Email</label>
                  <Field
                    type='email'
                    id='email'
                    name='email'
                    className='mt-1 p-2 w-full border rounded'
                    placeholder="Enter email or username"
                  />
                  <ErrorMessage name='email' component='div' className='text-red-600 text-sm mt-1' />
                </div>

                <div className='mb-6'>
                  <label htmlFor='password' className='block text-gray-700'>Password</label>
                  <Field
                    type='password'
                    id='password'
                    name='password'
                    className='mt-1 p-2 w-full border rounded'
                    placeholder="Enter password"
                  />
                  <ErrorMessage name='password' component='div' className='text-red-600 text-sm mt-1' />
                </div>

                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
                  disabled={isSubmitting}
                >
                  {text}
                </button>
                <div className='flex gap-2 justify-center mt-5'>
                  <span className='font-semibold'>New user?</span>
                  <span className='underline text-blue-600 hover:cursor-pointer' onClick={() => navigate("/sign-up")}>
                    Register
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='w-1/2'>
          <img src={loginImg} alt="" className='h-96 w-full object-cover rounded-tr-lg rounded-br-lg' />
        </div>
      </div>
    </div>
  );
};

export default Login;
