import { useEffect, useState, useCallback } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi'; 
import { animateScroll as scroll } from 'react-scroll'; 
import Nav from '../components/Nav';
import Footer from '../sections/Footer';
import bg from '../assets/img/back.jpg';
import logo from '../assets/img/Logo.png';
import back from '../assets/img/white.jpg';


const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500, 
    });
  };

  return (
    <button
    className={`fixed right-4 bottom-12 z-50 bg-dark hover:bg-light-dark text-white rounded-xl p-3 ${isVisible ? 'opacity-100 transition-opacity duration-300 animate-bounce' : 'opacity-0 transition-opacity duration-300'}`}
    onClick={scrollToTop}
  >
    <HiOutlineArrowUp className="w-5 h-12" />
  </button>
  
  );
};

const Booking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  // State for set an appointment form
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    customer_id: '',
    service_id: '',
    message: ''
  });  
  const [userData, setUserData] = useState([]);
  const [services, setServices] = useState({
    'Massage': [],
    'Facial': [],
    'Nail Treatment': [],
    'Body Treatment': [],
    'Packages': []
  });

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

  // Function to fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/get-userData', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });
      if (response.ok) {
        const data = await response.json();
        // Set isLoggedIn state
        setUserData(data.userData);
      } else {
        console.error('Failed to fetch user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      // Handle error
    }
  }, []); 

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the changed input is 'time', adjust the value
    if (name === 'time') {
      // Extract the selected hour from the time input
      const selectedHour = value.split(':')[0];
      // Set the minutes to '00'
      const formattedTime = `${selectedHour}:00`;
      // Update the state with the formatted time
      setNewAppointment(prevAppointment => ({
        ...prevAppointment,
        [name]: formattedTime
      }));
    } else {
      setNewAppointment(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const fetchServices = async () => {
    try {
      // Make a GET request to fetch services from the server
      const response = await fetch('http://localhost:5000/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      // Parse the JSON response
      const data = await response.json();
      // Set the fetched services in the state
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Handle errors if necessary
    }
  };

  useEffect(() => {
    // Fetch services from the server when the component mounts
    fetchServices();
  }, []);

  const addAppointment = async () => {
    try {
      const requestData = {
        date: newAppointment.date,
        time: newAppointment.time,
        customer_id: userData.user_id,
        service_id: newAppointment.service_id,
        message: newAppointment.message
      };

      // Log the data being sent
      //console.log('Sending appointment data:', requestData);

      // Sending the form data in the request body
      const response = await fetch('http://localhost:5000/set-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
      });
    
      // Handling the response
      if (!response.ok) {
        swal({
          title: 'Failed! ',
          text: 'Field with * should not be empty.',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        throw new Error('Failed to set an appointment');
      }
      else if (response.ok) {
        swal({
          title: 'Success!',
          text: ' ',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });
      }
  
      // Clearing the form fields after setting an appointment
      setNewAppointment({
        date: '',
        time: '',
        customer_id: '',
        service_id: '',
        message: ''
      });
    } catch (error) {
      console.error('Error setting an appointment:', error);
    }
  };  

  useEffect(() => {
    document.title = 'Booking - Spa-ntaneous';
  }, []);

  return (
    <main>
      <section>
        <Nav />
      </section>

      <header className="h-[20rem] flex flex-col justify-center items-center bg-center bg-cover border-b-8 border-dark" style={{ backgroundImage: `url(${bg})` }}>
        <div>
          <h1 className='text-[6rem] text-dark font-extrabold font-palanquin text-center'>Book with US</h1>
          <p className='text-center tracking-widest bg-dark p-2 text-light'>
            <a className='mr-2 hover:text-light-dark transition-colors duration-200 hover:underline' href='/'>
              <span>Home</span>
            </a>/
            <span className='ml-2'>Booking</span>
          </p>
        </div>
      </header>

      <section className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${back})` }}>
        <div className="max-w-[50rem] bg-white p-9 rounded-lg shadow-lg">
          <img src={logo} alt="Logo" className="mx-auto" />
          <form className='grid grid-cols-2 gap-4'>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
                <span className='text-gray-500'> (Default)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={`${userData.Fname || ''} ${userData.Lname || ''}`}
                disabled
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                <span className='text-gray-500'> (Default)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={userData.email}
                disabled
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
                <span className='text-gray-500'> (Default)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={userData.contact}
                disabled
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                Service
                <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                id="service"
                name="service"
                value={newAppointment.service_id} // Use service_id instead of service
                onChange={(e) => {
                  const selectedServiceId = e.target.value;
                  setNewAppointment(prevState => ({
                    ...prevState,
                    service_id: selectedServiceId,
                  }));
                }}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">-- Select a service --</option>
                {Object.entries(services).map(([category, servicesList]) => (
                  <optgroup label={category} key={category}>
                    {servicesList.map(service => (
                      <option key={service.service_id} value={service.service_id}>{service.service_name} - PHP{service.price.toFixed(2)}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newAppointment.date}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={newAppointment.time}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={newAppointment.message}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              ></textarea>
            </div>
            <div className="col-span-2 flex justify-center">
              <button
                type="button"
                onClick={addAppointment}
                className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <Footer />
      </section>
      <ScrollToTopButton />
    </main>
  );
};

export default Booking;
