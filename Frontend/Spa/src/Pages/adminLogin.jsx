import React, { useEffect, useState, useCallback } from 'react';
import Logo from '../assets/img/Logo.png';
import bg from '../assets/img/mt.jpg';
import swal from 'sweetalert';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [identifier, setIdentifier] = useState(''); // Update state to hold identifier (username or email)
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state to track login status

  // Function to check login status and user data
  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/check-login', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });
      if (response.ok) {
        const data = await response.json();
        // Set isLoggedIn state
        setIsLoggedIn(data.isLoggedIn);
      } else {
        // If response is not ok, set isLoggedIn to false
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      // Handle error, e.g., show an error message to the user
    }
  }, []); 
  
  useEffect(() => {
    // Call the function to check login status when the component mounts
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/admin/login', {
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
          window.location.href = '/admin'; // Redirect to home page after the alert is closed
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

  useEffect(() => {
    if (isLoggedIn === true) {
      window.location.href = '/admin';
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
              <label
                className={`w-1/2 py-2 px-4 ${activeTab === 'login' ? 'bg-dark text-white' : 'bg-light text-gray-700'}`}
                onClick={() => setActiveTab('login')}
              >
                Admin Login
              </label>
            </div>
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="bg-light shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl mb-4 font-bold">Login as Admin</h2>
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
          </div>
      </section>
    </main>
  );
};

export default Login;
