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
    <div className='unsecured-common-height flex items-center justify-center w-full bg-primary py-10 px-4'>
      <div className='flex w-full max-w-6xl flex-col gap-6 overflow-hidden rounded-3xl bg-gray-200 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100 md:flex-row'>
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
              <Form className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='firstName' className='block text-gray-700 font-medium text-sm mb-2'>First Name</label>
                    <Field
                      type='text'
                      id='firstName'
                      name='firstName'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                      placeholder='Enter First Name'
                      autoComplete='given-name'
                    />
                    <ErrorMessage name='firstName' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                  </div>

                  <div>
                    <label htmlFor='lastName' className='block text-gray-700 font-medium text-sm mb-2'>Last Name</label>
                    <Field
                      type='text'
                      id='lastName'
                      name='lastName'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                      placeholder='Enter Last Name'
                      autoComplete='family-name'
                    />
                    <ErrorMessage name='lastName' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                  </div>
                </div>

                <div>
                  <label htmlFor='userName' className='block text-gray-700 font-medium text-sm mb-2'>Username</label>
                  <Field
                    type='text'
                    id='userName'
                    name='userName'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                    placeholder='Choose a Username'
                    autoComplete='username'
                  />
                  <ErrorMessage name='userName' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                </div>

                <div>
                  <label htmlFor='email' className='block text-gray-700 font-medium text-sm mb-2'>Email</label>
                  <Field
                    type='email'
                    id='email'
                    name='email'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                    placeholder='Enter Email'
                    autoComplete='email'
                  />
                  <ErrorMessage name='email' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                </div>

                <div>
                  <label htmlFor='phone' className='block text-gray-700 font-medium text-sm mb-2'>Mobile Number</label>
                  <Field
                    type='tel'
                    id='phone'
                    name='phone'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                    placeholder='Enter 10-digit Mobile Number'
                    autoComplete='tel'
                    inputMode='numeric'
                  />
                  <ErrorMessage name='phone' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='password' className='block text-gray-700 font-medium text-sm mb-2'>Password</label>
                    <Field
                      type='password'
                      id='password'
                      name='password'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                      placeholder='Min. 8 characters'
                      autoComplete='new-password'
                    />
                    <ErrorMessage name='password' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                  </div>

                  <div>
                    <label htmlFor='confirmPassword' className='block text-gray-700 font-medium text-sm mb-2'>Confirm Password</label>
                    <Field
                      type='password'
                      id='confirmPassword'
                      name='confirmPassword'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base'
                      placeholder='Re-enter Password'
                      autoComplete='new-password'
                    />
                    <ErrorMessage name='confirmPassword' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                  </div>
                </div>

                <div>
                  <label htmlFor='photo' className='block text-gray-700 font-medium text-sm mb-2'>Profile Photo</label>
                  <input
                    id='photo'
                    name='photo'
                    type='file'
                    accept='image/*'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base cursor-pointer'
                    onChange={(event) => {
                      setFieldValue('photo', event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage name='photo' component='div' className='text-red-600 text-sm mt-2 font-medium' />
                </div>

                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  disabled={isSubmitting}
                >
                  Create Account
                </button>
                <div className='flex gap-2 justify-center mt-6'>
                  <span className='font-semibold text-sm text-gray-700'>Already have an account?</span>
                  <button 
                    type='button'
                    className='underline text-blue-600 hover:text-blue-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1' 
                    onClick={() => navigate('/')}
                  >
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='w-full md:w-1/2'>
          <img src={loginImg} alt='Signup Illustration' className='w-full max-h-96 object-cover rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none md:max-h-full' />
        </div>
      </div>
    </div>
  );
};

export default Signup;
