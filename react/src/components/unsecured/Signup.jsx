import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import loginImg from '../../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    firstName: Yup.string().required('Firstname is required'),
    lastName: Yup.string().required('Lastname is required'),
    userName: Yup.string().required('Username is required'),
    photo: Yup.mixed().required('Photo is required'), // Add validation for photo
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
  });

  const navigate = useNavigate();

  return (
    <div className='unsecured-common-height flex items-center justify-center w-full h-full bg-primary my-10'>
      <div className='flex items-center justify-center gap-6 min-w-[60%] bg-gray-200 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100'>
        <div className='flex-1 p-8'>
          <h2 className='text-xl font-semibold mb-4 text-center'>Signup</h2>
          <Formik
            initialValues={{ firstName: '', lastName: '', userName: '', email: '', password: '', confirmPassword: '', photo: null, phone: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              console.log(values);
              try {
                const formData = new FormData();
                formData.append('firstName', values.firstName);
                formData.append('lastName', values.lastName);
                formData.append('userName', values.userName);
                formData.append('email', values.email);
                formData.append('password', values.password);
                formData.append('photo', values.photo); // Add the photo to the FormData object
                formData.append('phone', values.phone); // Add mobile number to the FormData object
                
                const res = await axios.post('https://vedic-vision-backend.onrender.com/api/user/register', values, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                console.log(res);
                if(res.status === 201) navigate("/login");
                // Handle success (e.g., navigate to another page)
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className='flex gap-5'>
                  <div className='mb-3'>
                    <label htmlFor='firstName' className='block text-gray-700'>Firstname</label>
                    <Field
                      type='text'
                      id='firstName'
                      name='firstName'
                      className='mt-1 p-2 w-full border rounded'
                      placeholder='Enter Firstname'
                    />
                    <ErrorMessage name='firstName' component='div' className='text-red-600 text-sm mt-1' />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='lastName' className='block text-gray-700'>Lastname</label>
                    <Field
                      type='text'
                      id='lastName'
                      name='lastName'
                      className='mt-1 p-2 w-full border rounded'
                      placeholder='Enter Lastname'
                    />
                    <ErrorMessage name='lastName' component='div' className='text-red-600 text-sm mt-1' />
                  </div>
                </div>

                <div className='mb-3'>
                  <label htmlFor='userName' className='block text-gray-700'>Username</label>
                  <Field
                    type='text'
                    id='userName'
                    name='userName'
                    className='mt-1 p-2 w-full border rounded'
                    placeholder='Enter Username'
                  />
                  <ErrorMessage name='userName' component='div' className='text-red-600 text-sm mt-1' />
                </div>

                <div className='mb-3'>
                  <label htmlFor='email' className='block text-gray-700'>Email</label>
                  <Field
                    type='email'
                    id='email'
                    name='email'
                    className='mt-1 p-2 w-full border rounded'
                    placeholder='Enter Email'
                  />
                  <ErrorMessage name='email' component='div' className='text-red-600 text-sm mt-1' />
                </div>

                <div className='mb-3'>
                  <label htmlFor='phone' className='block text-gray-700'>Mobile Number</label>
                  <Field
                    type='text'
                    id='phone'
                    name='phone'
                    className='mt-1 p-2 w-full border rounded'
                    placeholder='Enter Mobile Number'
                  />
                  <ErrorMessage name='phone' component='div' className='text-red-600 text-sm mt-1' />
                </div>

                <div className='flex gap-5'>
                  <div className='mb-3'>
                    <label htmlFor='password' className='block text-gray-700'>Password</label>
                    <Field
                      type='password'
                      id='password'
                      name='password'
                      className='mt-1 p-2 w-full border rounded'
                      placeholder='Enter Password'
                    />
                    <ErrorMessage name='password' component='div' className='text-red-600 text-sm mt-1' />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='confirmPassword' className='block text-gray-700'>Confirm Password</label>
                    <Field
                      type='password'
                      id='confirmPassword'
                      name='confirmPassword'
                      className='mt-1 p-2 w-full border rounded'
                      placeholder='Enter Confirm Password'
                    />
                    <ErrorMessage name='confirmPassword' component='div' className='text-red-600 text-sm mt-1' />
                  </div>
                </div>

                <div className='mb-3'>
                  <label htmlFor='photo' className='block text-gray-700'>Upload Photo</label>
                  <input
                    id='photo'
                    name='photo'
                    type='file'
                    accept='image/*'
                    className='mt-1 p-2 w-full border rounded'
                    onChange={(event) => {
                      setFieldValue('photo', event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage name='photo' component='div' className='text-red-600 text-sm mt-1' />
                </div>

                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
                  disabled={isSubmitting}
                >
                  Signup
                </button>
                <div className='flex gap-2 justify-center mt-5'>
                  <span className='font-semibold'>New user?</span>
                  <span className='underline text-blue-600 hover:cursor-pointer' onClick={() => navigate('/')}> Login</span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='w-1/2'>
          <img src={loginImg} alt='Login Illustration' className='w-full object-cover rounded-tr-lg rounded-br-lg h-full' />
        </div>
      </div>
    </div>
  );
};

export default Signup;
