import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import loginImg from '../../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [text, setText] = useState("Sign In");
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className='unsecured-common-height flex items-center justify-center w-full px-4 py-8 md:py-12 hero-gradient'>
      <div className='flex w-full max-w-5xl flex-col-reverse md:flex-row overflow-hidden rounded-3xl glass-card animate-fade-in'>
        <div className='flex-1 p-8 md:p-12 flex flex-col justify-center relative'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob'></div>
          <div className='absolute bottom-0 left-0 w-32 h-32 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000'></div>

          <div className='relative z-10'>
            <div className='mb-8 text-center md:text-left'>
              <h2 className='text-3xl font-display font-bold text-gray-900 mb-2'>Welcome back</h2>
              <p className='text-gray-600'>Enter your details to access your account.</p>
            </div>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  setText("Signing in...")
                  const res = await api.post('/api/user/login', {
                    email: values.email,
                    password: values.password
                  });
                  if (res.status === 200) {
                    login({
                      token: res.data.token,
                      userDetails: res.data.userDetails
                    });
                    localStorage.setItem("calories", res.data.calories);
                    if (res.data.userDetails.photo) {
                      localStorage.setItem("userImg", "https://vedic-vision-backend.onrender.com/upload/" + res.data.userDetails.photo);
                    }
                    toast.success('Successfully logged in!');
                    navigate("/secured/home/recents");
                  }
                } catch (error) {
                  toast.error('Invalid credentials. Please try again.');
                }
                finally {
                  setText("Sign In");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className='space-y-5 relative z-10'>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
                    <Field
                      type='email'
                      id='email'
                      name='email'
                      className='glass-input'
                      placeholder="name@example.com"
                      autoComplete='email'
                    />
                    <ErrorMessage name='email' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                  </div>

                  <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id='password'
                        name='password'
                        className='glass-input pr-12'
                        placeholder="••••••••"
                        autoComplete='current-password'
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name='password' component='div' className='text-red-500 text-xs mt-1.5 font-medium px-1' />
                  </div>

                  <div className="flex items-center justify-between mt-2 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</a>
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
                  <div className='flex gap-2 justify-center mt-6 pt-4 border-t border-gray-200/50'>
                    <span className='text-sm text-gray-600'>Don't have an account?</span>
                    <button
                      type='button'
                      className='text-primary-600 hover:text-primary-800 font-semibold text-sm transition-colors'
                      onClick={() => navigate("/sign-up")}
                    >
                      Sign up for free
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className='w-full md:w-[45%] relative min-h-[300px] md:min-h-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-gray-900/60 before:to-transparent before:z-10'>
          <img src={loginImg} alt="Yoga Practice" className='w-full h-full object-cover absolute inset-0' />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
            <h3 className="text-white text-2xl font-display font-bold mb-3">Begin your journey</h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              Find peace and focus with personalized, AI-driven yoga sessions designed to help you reach your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
