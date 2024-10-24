// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';  
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticateUser } from '../api/authApi'; // API function for authentication
import logo from '../assets/maulogo.png';
import backgroundImageAuth from '../assets/table4.png';
import chefhat from '../assets/chefhat.png';

const AuthenticationScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const initialValues = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
    firstName: isLogin ? Yup.string().nullable() : Yup.string().required('Required'),
    lastName: isLogin ? Yup.string().nullable() : Yup.string().required('Required'),
    email: isLogin ? Yup.string().nullable() : Yup.string().email('Invalid email').required('Required'),
    contactNumber: isLogin ? Yup.string().nullable() : Yup.string().optional(),
  });
  

  const handleSubmit = async (values) => {
    try {
      localStorage.setItem('username', values.username);
      const data = await authenticateUser(values, isLogin);
  
      localStorage.setItem('userId', data.userId);
      navigate('/home');
    } catch (error) {
      console.error('Error details:', error.message);
      if (error.message.includes('User already exists')) {
        setFormError("The user already exists. Please use a different email or username.");
      } else if (error.message.includes('Invalid email')) {
        setFormError("The email format is invalid. Please enter a valid email address.");
      } else if (error.message.includes('User not found')) {
        setFormError("The user does not exist. Please register or try again.");
      } else if (error.message.includes('Invalid credentials')) {
        setFormError("The username or password is incorrect. Please try again.");
      } else {
        setFormError("Something went wrong. Please try again later.");
      }
    }
  };

  // eslint-disable-next-line react/prop-types
  const FieldWithError = ({ name, placeholder, type = 'text', showPasswordToggle }) => (
    <div className="relative w-full sm:w-80">
      <Field
        type={showPasswordToggle && showPassword ? 'text' : type}
        name={name}
        placeholder={placeholder}
        className="p-2 border rounded w-full"
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      )}
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );

  // eslint-disable-next-line react/prop-types
  const ToggleLoginLink = ({ isLogin, setIsLogin }) => (
    <p className="mt-4 text-center">
      {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
      <Link 
        to="#" 
        onClick={() => setIsLogin(!isLogin)} 
        className="text-blue-500 underline"
      >
        {isLogin ? 'Register' : 'Login'}
      </Link>
    </p>
  );

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsBlurred(true);
    }, 2500);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <section 
      className={`flex flex-col min-h-screen transition-all duration-500 ${isBlurred ? '' : 'opacity-0 blur-sm'}`}
      style={{
        backgroundImage: `url(${backgroundImageAuth})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
      }}
    >
      <nav className="flex items-center justify-center p-4 bg-white shadow" style={{ backgroundColor: 'rgba(211, 211, 211, 0.4)' }} >
        <Link to="/">
          <img src={logo} alt="Ma! Anong ulam? Logo" className="h-24 sm:h-32 -mt-7 -mb-5 item"/>
        </Link>
      </nav>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
        {() => (
          <Form className="flex flex-col items-center mt-20 bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md mx-auto w-full space-y-4 relative z-10 border-t-4 border-orange-400">
            <h1 className="text-3xl sm:text-4xl font-semibold text-red-900 mb-6 font-marmelad">
              {isLogin ? 'Login' : 'Register'}
            </h1>
            {!isLogin && (
              <>
                <FieldWithError name="firstName" placeholder="First Name" />
                <FieldWithError name="lastName" placeholder="Last Name" />
                <FieldWithError type="email" name="email" placeholder="Email" />
                <FieldWithError name="contactNumber" placeholder="Contact Number (optional)" />
              </>
            )}
            <FieldWithError name="username" placeholder="Username" />
            <FieldWithError 
              type="password" 
              name="password" 
              placeholder="Password" 
              showPasswordToggle
            />
            {formError && <div className="text-red-500 mt-2">{formError}</div>}
            <button type="submit" className="w-full sm:w-72 p-2 bg-orange-400 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-lg shadow-md transition-all">
              {isLogin ? 'Login' : 'Register'}
            </button>
            <ToggleLoginLink isLogin={isLogin} setIsLogin={setIsLogin} />
          </Form>
        )}
      </Formik>

      <div className="flex flex-col justify-center items-end text-right p-4 sm:p-8 fixed right-4 sm:right-20 top-2/3 z-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2 sm:mb-4 font-marmelad">
          Discover, Share, and Cook <br/> with Confidence!
        </h1>
        <p className="text-lg sm:text-xl text-red-900 max-w-xs font-marmelad">
          Your trusted culinary hub for reliable, time-saving recipes, crafted by real people, loved by the community.
        </p>
      </div>

      <div className="food-animation">
        <img src={chefhat} alt="Chef Hat" className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    </section>
  );
};

export default AuthenticationScreen;
