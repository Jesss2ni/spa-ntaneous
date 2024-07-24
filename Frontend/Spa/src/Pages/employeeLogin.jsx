import React, { useEffect, useState } from 'react';
import Logo from '../assets/img/Logo.png';
import bg from '../assets/img/mt.jpg';
import swal from 'sweetalert';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [identifier, setIdentifier] = useState(''); // Update state to hold identifier (username or email)
  const [loginPassword, setLoginPassword] = useState('');

  const [signupData, setSignupData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state to track login status

  useEffect(() => {
    document.title = 'Login/Signup - Spa-ntaneous';

    // Check login status when the component mounts
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/employee/check-login', {
          method: 'GET',
          credentials: 'include', // Include credentials
        });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus(); // Call the function
  }, []);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}` // Include session ID in the headers
        },
        credentials: 'include',
        body: JSON.stringify({
          identifier: identifier, // Send identifier instead of username
          password: loginPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        swal({
          title: 'Login Successful!',
          text: ' ',
          icon: 'success',
          buttons: false,
          timer: 1500,
        }).then(() => {         
          window.location.href = '/Employee'; // Redirect to home page after the alert is closed
        });
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
      alert('An error occurred while logging in. Please try again later.'); // Display a generic error message to the user      
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
      const response = await fetch('http://localhost:5000/employee/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify(signupData)
      });
      const data = await response.json();
      console.log(data);
      if(data.success){
        swal({
          title: 'Signup Successful!',
          text: ' ',
          icon: 'success',
          buttons: false,
          timer: 1500,
        }).then(() => {          
          window.location.href = '/Employeelogin'; // Redirect to home page after the alert is closed
        });
      }
      else{
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
      alert('An error occurred while signing up. Please try again later.'); // Display a generic error message to the user
    }
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      window.location.href = '/Employee';
    }
  }, [isLoggedIn]);
  
  return (
    <main>
      <section className="flex justify-center items-center min-h-screen bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }}>
          <div className="w-full max-w-lg ">
            <div className="mb-8 flex justify-center m-[5rem]">
              <img className=' rounded-xl' src={Logo} alt="Logo" width={250} />
            </div>
            <div className="flex mb-4">
              <button
                className={`w-1/2 py-2 px-4 ${activeTab === 'login' ? 'bg-dark text-white' : 'bg-light text-gray-700'}`}
                onClick={() => setActiveTab('login')}
              >
                Employee Login
              </button>
              <button
                className={`w-1/2 py-2 px-4 ${activeTab === 'signup' ? 'bg-light-dark text-white' : 'bg-light text-gray-700'}`}
                onClick={() => setActiveTab('signup')}
              >
                Signup
              </button>
            </div>
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="bg-light shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl mb-4 font-bold">Login as Employee</h2>
                <div className="mb-4">
                  <label htmlFor="login-identifier" className="block text-gray-700 text-sm font-bold mb-2">Username or Email:</label>
                  <input
                    type="text"
                    id="login-identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="login-password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                  <input
                    type="password"
                    id="login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-dark hover:bg-dark-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Login
                  </button>
                </div>
              </form>
            )}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="bg-light shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
                <h2 className="text-xl mb-4 font-bold">Signup</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
                <div className="mb-4">
                  <label htmlFor="signup-firstname" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                  <input
                    type="text"
                    id="signup-firstname"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-lastname" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                  <input
                    type="text"
                    id="signup-lastname"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-Username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                  <input
                    type="text"
                    id="signup-username"
                    name="username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-email" className="block text-gray-700 text-sm font-bold mb-2">Email Address:</label>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                  <input
                    type="tel"
                    id="signup-phone"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-dark hover:bg-dark-darker text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Signup
                  </button>
                </div>
              </form>
            )}
          </div>
      </section>
    </main>
  );
};

export default Login;
