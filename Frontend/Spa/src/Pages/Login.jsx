import React, { useEffect, useRef, useState } from 'react';
import Logo from '../assets/img/Logo.png';
import bg from '../assets/img/mt.jpg';
import swal from 'sweetalert';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupData, setSignupData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpSentForSignup, setIsOtpSentForSignup] = useState(false); // Separate state for signup OTP
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [canResend, setCanResend] = useState(false);

  const otpInputs = useRef([]);

  useEffect(() => {
    document.title = 'Login/Signup - Spa-ntaneous';

    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/check-login', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if ((isOtpSent || isOtpSentForSignup) && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 10);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
      swal({
        title: 'OTP Expired!',
        text: 'Please request a new OTP.',
        icon: 'error',
        buttons: false,
        timer: 2000,
      });
    }
  }, [isOtpSent, isOtpSentForSignup, timeLeft]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          identifier: identifier,
          password: loginPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsOtpSent(true);
        setCanResend(false);
        setTimeLeft(300); // reset the timer
      } else {
        swal({
          title: 'Login Failed!',
          text: 'Invalid username or password',
          icon: 'error',
          buttons: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join('');
    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`
        },
        credentials: 'include',
        body: JSON.stringify({ otp: enteredOtp })
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true); // Set isLoggedIn to true on successful OTP verification
        swal({
          title: 'OTP Verified!',
          text: ' ',
          icon: 'success',
          buttons: false,
          timer: 1500,
        }).then(() => {
          window.location.href = '/';
        });
      } else {
        swal({
          title: 'OTP Verification Failed!',
          text: 'Invalid OTP',
          icon: 'error',
          buttons: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while verifying OTP. Please try again later.');
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('http://localhost:5000/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTimeLeft(300); // reset timer to 5 minutes
        setCanResend(false);
        swal({
          title: 'OTP Resent!',
          text: 'A new OTP has been sent to your email.',
          icon: 'success',
          buttons: false,
          timer: 2000,
        });
      } else {
        swal({
          title: 'Error!',
          text: data.message,
          icon: 'error',
          buttons: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      swal({
        title: 'Error!',
        text: 'An error occurred while resending OTP. Please try again later.',
        icon: 'error',
        buttons: false,
        timer: 2000,
      });
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prevFields => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(signupData)
      });
      const data = await response.json();
      if (data.success) {
        setIsOtpSentForSignup(true); // Set OTP state for signup
        setCanResend(false);
        setTimeLeft(300); // reset the timer
        swal({
          title: 'Signup Initiated!',
          text: 'Please verify the OTP sent to your email.',
          icon: 'success',
          buttons: false,
          timer: 2000,
        });
      } else {
        swal({
          title: 'Signup Failed!',
          text: data.error,
          icon: 'error',
          buttons: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while signing up. Please try again later.');
    }
  };

  const handleOtpVerifyForSignup = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join('');
    try {
      const response = await fetch('http://localhost:5000/verify-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`
        },
        credentials: 'include',
        body: JSON.stringify({ otp: enteredOtp })
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true); // Set isLoggedIn to true on successful OTP verification
        swal({
          title: 'Signup Successful!',
          text: ' ',
          icon: 'success',
          buttons: false,
          timer: 1500,
        }).then(() => {
          window.location.href = '/';
        });
      } else {
        swal({
          title: 'OTP Verification Failed!',
          text: 'Invalid OTP',
          icon: 'error',
          buttons: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while verifying OTP. Please try again later.');
    }
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      window.location.href = '/';
    }
  }, [isLoggedIn]);

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) { // Allow only one digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < otpInputs.current.length - 1) {
        otpInputs.current[index + 1].focus(); // Move to the next input
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <main>
      <section className="flex justify-center items-center min-h-screen bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }}>
        <div className="w-full max-w-lg ">
          <a href="/" className="mb-8 flex justify-center m-[5rem]">
            <img className=' rounded-xl' src={Logo} alt="Logo" width={250} />
          </a>
          <div className="flex mb-4">
            <button
              className={`w-1/2 py-2 px-4 ${activeTab === 'login' ? 'bg-dark text-white' : 'bg-light text-gray-700'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 px-4 ${activeTab === 'signup' ? 'bg-light-dark text-white' : 'bg-light text-gray-700'}`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </div>
          {activeTab === 'login' && (
            <form onSubmit={isOtpSent ? handleOtpSubmit : handleLoginSubmit} className="bg-light shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-center text-2xl mb-4">{isOtpSent ? 'Enter OTP' : 'Login'}</h2>
              {isOtpSent ? (
                <>
                  <div className="mb-4 flex justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (otpInputs.current[index] = el)}
                        className="w-12 h-12 text-center text-2xl border rounded focus:outline-none focus:border-blue-500"
                      />
                    ))}
                  </div>
                  <div className="mb-4 text-center">
                    <p>Time left: {formatTime(timeLeft)}</p>
                    <button
                      type="button"
                      onClick={handleResend}
                      className={`mt-2 text-dark-500 underline ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!canResend}
                    >
                      Resend OTP
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Verify OTP
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
                      Email or Username
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your email or username"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
                      Password
                    </label>
                    <input
                      id="loginPassword"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                      Login
                    </button>
                    {/* <a
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </a> */}
                  </div>
                </>
              )}
            </form>
          )}
          {activeTab === 'signup' && (
            <form onSubmit={isOtpSentForSignup ? handleOtpVerifyForSignup : handleSignupSubmit} className="bg-light shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-center text-2xl mb-4">{isOtpSentForSignup ? 'Enter OTP' : 'Signup'}</h2>
              {isOtpSentForSignup ? (
                <>
                  <div className="mb-4 flex justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (otpInputs.current[index] = el)}
                        className="w-12 h-12 text-center text-2xl border rounded focus:outline-none focus:border-blue-500"
                      />
                    ))}
                  </div>
                  <div className="mb-4 text-center">
                    <p>Time left: {formatTime(timeLeft)}</p>
                    <button
                      type="button"
                      onClick={handleResend}
                      className={`mt-2 text-dark-500 underline ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!canResend}
                    >
                      Resend OTP
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Verify OTP
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={signupData.username}
                      onChange={handleSignupChange}
                      placeholder="Enter your username"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={signupData.firstName}
                      onChange={handleSignupChange}
                      placeholder="Enter your first name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      placeholder="Enter your last name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="Enter your email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Enter your password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      placeholder="Enter your phone number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Signup
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Login;
