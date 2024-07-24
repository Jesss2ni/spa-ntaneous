import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import Logo from '../assets/img/Logo.png'; 
import HamburgerIcon from '../assets/icons/hamburger.svg';
import User from '../assets/img/user.png';
import close from '../assets/icons/close.svg';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const navRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const location = useLocation();
  const [userData, setUserData] = useState('');

  useEffect(() => {
    // Update activeLink when location changes
    setActiveLink(location.pathname);

  }, [location]);

  const showNavbar = () => {
    setIsOpen(!isOpen);
  }

  const closeNavbar = () => {
    setIsOpen(false);
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };
   

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies in the request
      });
      if (response.ok) {
        // Logout successful
        console.log('Logout successful');
        // Redirect to the login page
        window.location.href = '/login';
      } else {
        // Logout failed
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error, display error message or any appropriate action
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Function to check login status
  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/check-login', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });
      if (response.ok) {
        const data = await response.json(); // Parse response body as JSON
        // Check the value of isLoggedIn
        setIsLoggedIn(data.isLoggedIn);
        
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      // Handle error, e.g., show an error message to the user
    }
  };  

  useEffect(() => {
    // Call the function to check login status when the component mounts
    checkLoginStatus();
  }, []);

  // Fetch username from the server
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-userData', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });
      const data = await response.json();
      setUserData(data.userData);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  useEffect(() => {
    // Fetch username if user is logged in
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  return (
    <header className='px-4 w-full padding-x'>
      <nav ref={navRef} className={`flex gap-16 justify-center items-center ${isOpen ? 'responsive_nav' : ''}`}>
        <a href="/" className="mr-16 relative"> 
          <img src={Logo} alt="Logo" width={300} /> 
        </a>

        <ul className="flex items-center gap-12 font-medium text-base max-xl:hidden" onClick={closeNavbar}>
          <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/' ? 'underline' : ''}`}>
            <a href="/">Home</a>
          </li>
          <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/about' ? 'underline' : ''}`}>
            <a href="/about">About</a>
          </li>
          <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/services' ? 'underline' : ''}`}>
            <a href="/services">Services</a>
          </li>
          <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/contact' ? 'underline' : ''}`}>
            <a href="/contact">Contact</a>
          </li>
        </ul>
        
        {/* profile icon function */}
        <div className='text-light max-xl:hidden justify-center flex items-center gap-9 ml-16'>
          {isLoggedIn ? ( //if true 
          <div className="relative" onClick={toggleDropdown}>
            <div className="flex items-center justify-center hover:bg-gray-300 duration-500 text-dark text-xs font-semibold cursor-pointer px-3 py-2 rounded-md">
              <img src={User} alt="User Profile" className="w-6 h-6 mr-2" />
              <span>{userData.username}</span>
            </div>
            {/* Dropdown content */}
            {showDropdown && (
              <div className="absolute bg-white right-0 mt-2 rounded-md shadow-lg z-20">
                <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
                <a href="#!" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLogout}>Logout</a>
              </div>
            )}
          </div>
          ) : ( //if false
            <a href="/login"> 
              <img className='hover:bg-slate-200 rounded-3xl duration-500' src={User} alt="user" width={35}/>
            </a>
          )} 
        </div>

        <div className="xl:hidden block">
          <button onClick={showNavbar}> <img src={isOpen ? close : HamburgerIcon} alt={isOpen ? "Close" : "Hamburger"} width={25} height={25}/></button>
        </div>
      </nav>
      
      {isOpen && (
        <div className=' xl:hidden block m-9'>
          <nav className="bg-dark text-white py-4 xl:hidden flex flex-wrap justify-center items-center rounded-3xl">
            <ul className="flex gap-9 flex-wrap max-sm:flex-col text-center justify-center items-center">
              <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/' ? 'underline' : ''}`}>
                <a href="/" onClick={() => setActiveLink('/')}>Home</a>
              </li>
              <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/about' ? 'underline' : ''}`}>
                <a href="/about" onClick={() => setActiveLink('/about')}>About</a>
              </li>
              <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/services' ? 'underline' : ''}`}>
                <a href="/services" onClick={() => setActiveLink('/services')}>Services</a>
              </li>
              <li className={`hover:text-light-dark transition-colors duration-200 ${activeLink === '/contact' ? 'underline' : ''}`}>
                <a href="/contact" onClick={() => setActiveLink('/contact')}>Contact</a>
              </li>

              {isLoggedIn ? (
              <div className="relative" onClick={toggleDropdown}>
                <div className="flex items-center justify-center bg-light hover:bg-gray-300 duration-500 text-dark text-xs font-semibold cursor-pointer px-3 py-2 rounded-md">
                  <img src={User} alt="User Profile" className="w-6 h-6 mr-2" />
                  <span>{userData.username}</span>
                </div>
                {/* Dropdown content */}
                {showDropdown && (
                  <div className="absolute bg-white right-0 mt-2 rounded-md shadow-lg z-20">
                    <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
                    <a 
                      href="#!" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200" 
                      onClick={handleLogout}>
                      Logout
                    </a>
                  </div>
                )}
              </div>
              ) : (
                <li className=" bg-white text-black size-9 rounded-3xl hover:bg-slate-200  duration-500">
                  <a href="/login"><img src={User}/> </a>
                </li>
              )}
            </ul> 
          </nav>
        </div>
      )}
    </header>
  );
};

export default Nav;
