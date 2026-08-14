import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import loginImg from '../../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Signup = () => {
  const [text, setText] = useState("Create Account");
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    firstName: Yup.string().required('Firstname is required'),
    lastName: Yup.string().required('Lastname is required'),
    userName: Yup.string().required('Username is required'),
    photo: Yup.mixed().required('Photo is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
  });

  const navigate = useNavigate();

  return (
    <div className='unsecured-common-height flex items-center justify-center w-full px-4 py-8 md:py-12 hero-gradient'>
      <div className='flex w-full max-w-6xl flex-col-reverse md:flex-row overflow-hidden rounded-3xl glass-card animate-fade-in'>
        <div className='flex-[1.2] p-6 md:p-10 flex flex-col justify-center relative'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob'></div>
          <div className='absolute bottom-0 left-0 w-32 h-32 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000'></div>

          <div className='relative z-10'>
            <div className='mb-6 md:mb-8 text-center md:text-left'>
              <h2 className='text-3xl font-display font-bold text-gray-900 mb-2'>Create an Account</h2>
              <p className='text-gray-600'>Join us to start your personalized yoga journey.</p>
            </div>

            <Formik
              initialValues={{ firstName: '', lastName: '', userName: '', email: '', password: '', confirmPassword: '', photo: null, phone: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  setText("Creating...");
                  const formData = new FormData();
                  formData.append('firstName', values.firstName);
                  formData.append('lastName', values.lastName);
                  formData.append('userName', values.userName);
                  formData.append('email', values.email);
                  formData.append('password', values.password);
                  formData.append('photo', values.photo);
                  formData.append('phone', values.phone);

                  const res = await api.post('/api/user/register', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  if (res.status === 201) {
                    toast.success("Account created successfully!");
                    navigate("/login");
                  }
                } catch (error) {
                  toast.error("An error occurred during signup.");
                } finally {
                  setText("Create Account");
                }
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className='space-y-4 md:space-y-5 relative z-10'>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-1.5'>First Name</label>
                      <Field
                        type='text'
                        id='firstName'
                        name='firstName'
                        className='glass-input'
                        placeholder='First Name'
                        autoComplete='given-name'
                      />
                      <ErrorMessage name='firstName' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                    </div>

                    <div>
                      <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-1.5'>Last Name</label>
                      <Field
                        type='text'
                        id='lastName'
                        name='lastName'
                        className='glass-input'
                        placeholder='Last Name'
                        autoComplete='family-name'
                      />
                      <ErrorMessage name='lastName' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='userName' className='block text-sm font-medium text-gray-700 mb-1.5'>Username</label>
                      <Field
                        type='text'
                        id='userName'
                        name='userName'
                        className='glass-input'
                        placeholder='Username'
                        autoComplete='username'
                      />
                      <ErrorMessage name='userName' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                    </div>

                    <div>
                      <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1.5'>Mobile Number</label>
                      <Field
                        type='tel'
                        id='phone'
                        name='phone'
                        className='glass-input'
                        placeholder='10-digit Mobile Number'
                        autoComplete='tel'
                        inputMode='numeric'
                      />
                      <ErrorMessage name='phone' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
                    <Field
                      type='email'
                      id='email'
                      name='email'
                      className='glass-input'
                      placeholder='name@example.com'
                      autoComplete='email'
                    />
                    <ErrorMessage name='email' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
                      <Field
                        type='password'
                        id='password'
                        name='password'
                        className='glass-input'
                        placeholder='Min. 8 characters'
                        autoComplete='new-password'
                      />
                      <ErrorMessage name='password' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                    </div>

                    <div>
                      <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1.5'>Confirm Password</label>
                      <Field
                        type='password'
                        id='confirmPassword'
                        name='confirmPassword'
                        className='glass-input'
                        placeholder='Re-enter Password'
                        autoComplete='new-password'
                      />
                      <ErrorMessage name='confirmPassword' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='photo' className='block text-sm font-medium text-gray-700 mb-1.5'>Profile Photo</label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white/40 hover:bg-white/60 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-3 pb-4">
                          <svg className="w-6 h-6 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                          <p className="mb-0 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        </div>
                        <input id="photo" name="photo" type="file" accept="image/*" className="hidden" onChange={(event) => {
                          setFieldValue('photo', event.currentTarget.files[0]);
                          toast.success("Photo selected");
                        }} />
                      </label>
                    </div>
                    <ErrorMessage name='photo' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                  </div>

                  <button
                    type='submit'
                    className='glass-button w-full mt-6 shadow-md'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {text}
                  </button>
                  <div className='flex gap-2 justify-center mt-4 pt-4 border-t border-gray-200/50'>
                    <span className='text-sm text-gray-600'>Already have an account?</span>
                    <button
                      type='button'
                      className='text-primary-600 hover:text-primary-800 font-semibold text-sm transition-colors'
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className='w-full md:w-[0.8fr] relative min-h-[220px] md:min-h-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-gray-900/60 before:to-transparent before:z-10'>
          <img src={loginImg} alt='Signup Illustration' className='w-full h-full object-cover absolute inset-0' />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
            <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-2">Transform your body</h3>
            <p className="text-gray-200 text-xs md:text-sm leading-relaxed hidden sm:block">
              Unlock a healthier you with guided meditations, detailed yoga poses, and AI-powered feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
