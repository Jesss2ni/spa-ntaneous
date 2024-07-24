
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { HiOutlineArrowUp } from 'react-icons/hi'; 
import { animateScroll as scroll } from 'react-scroll'; 
import Nav from '../components/Nav';
import bg from '../assets/img/back.jpg';
import Footer from '../sections/Footer';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';

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

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState({
     'All': [],
    'Massage': [],
    'Facial': [],
    'Nail Treatment': [],
    'Body Treatment': [],
    'Packages': []
  });

  // State for set an appointment form
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    customer_id: '',
    service_id: '',
    message: ''
  });  

  const [userData, setUserData] = useState([]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
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
        setUserData(data.user);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      // Handle error, e.g., show an error message to the user
    }
  };  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    // Call the function to check login status when the component mounts
    checkLoginStatus();
  }, []);

  // Function to handle form input changes
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
      // For other inputs, update the state normally
      setNewAppointment(prevAppointment => ({
        ...prevAppointment,
        [name]: value
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

  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  const handleReserveClick = () => { // Onclick
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in first!',
        text: '',
        showCancelButton: false,
        confirmButtonText: 'OK',
        confirmButtonColor: '#21312d'
      });
    } 
    else {
      setIsModalOpen(!isModalOpen);
    }
  };

  const addAppointment = async () => {
    try {
      const requestData = {
        date: newAppointment.date,
        time: newAppointment.time,
        customer_id: userData.user_id,
        service_id: selectedService.service_id,
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
        //throw new Error('Failed to set an appointment');
      }
      else if (response.ok) {
        swal({
          title: 'Success!',
          text: ' ',
          icon: 'success',
          buttons: false,
          timer: 1500,
        }).then(() => {   
          setIsModalOpen(false);
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
  
  return (
    <main>
      <section>
        <Nav />
      </section>

      <header className="mx-auto h-[20rem] flex justify-center items-center bg-center bg-cover border-b-8 border-dark" style={{ backgroundImage: `url(${bg})` }}>
        <div>
          <h1 className='text-[6rem] text-dark font-extrabold font-palanquin text-center'>Services</h1>
          <h1 className='text-center tracking-widest bg-dark p-2 text-light '><a className='mr-2 hover:text-light-dark transition-colors duration-200 hover:underline' href='/'><span>Home</span></a>/<span className='ml-2'>Services</span></h1>
        </div>
      </header>

      <section className='bg-light-dark/10' >
        <Tabs
          className="mx-auto max-w-7xl px-4 py-8"
          selectedIndex={activeTab}
          onSelect={handleTabSelect}
        >
          <TabList className="flex justify-center mb-8 flex-wrap sm:flex-nowrap gap-9">
            <Tab className={`text-dark hover:text-light focus:outline-none focus:text-text-light font-medium text-lg py-4 px-6 cursor-pointer hover:bg-dark ${activeTab === 0 ? 'border-b-4 border-dark' : ''}`} onClick={() => handleTabSelect(0)}>All</Tab>
            <Tab className={`text-dark hover:text-light focus:outline-none focus:text-text-light font-medium text-lg py-4 px-6 cursor-pointer hover:bg-dark ${activeTab === 1 ? 'border-b-4 border-dark' : ''}`} onClick={() => handleTabSelect(1)}>Massage</Tab>
            <Tab className={`text-dark hover:text-light focus:outline-none focus:text-text-light font-medium text-lg py-4 px-6 cursor-pointer hover:bg-dark ${activeTab === 2 ? 'border-b-4 border-dark' : ''}`} onClick={() => handleTabSelect(2)}>Facial</Tab>
            <Tab className={`text-dark hover:text-light focus:outline-none focus:text-text-light font-medium text-lg py-4 px-6 cursor-pointer hover:bg-dark ${activeTab === 3 ? 'border-b-4 border-dark' : ''}`} onClick={() => handleTabSelect(3)}>Nail Treatment</Tab>
            <Tab className={`text-dark hover:text-light focus:outline-none focus:text-text-light font-medium text-lg py-4 px-6 cursor-pointer hover:bg-dark ${activeTab === 4 ? 'border-b-4 border-dark' : ''}`} onClick={() => handleTabSelect(4)}>Body Treatment</Tab>
            <Tab className={`text-dark hover:text-light focus:outline-none focus:text-text-light font-medium text-lg py-4 px-6 cursor-pointer hover:bg-dark ${activeTab === 5 ? 'border-b-4 border-dark' : ''}`} onClick={() => handleTabSelect(4)}>Packages</Tab>
          </TabList>

          {/* Render services dynamically based on active tab */}      
            {Object.keys(services).map((category, index) => (
              <TabPanel key={index} className={`transition duration-300 ease-in-out ${activeTab === index ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-2xl font-bold m-9 text-center">{category} Services</h2>
                {services[category].length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services[category].map((service, serviceIndex) => (
                        <div key={serviceIndex} className="bg-white rounded-lg shadow-md p-6">
                          <img src={`http://localhost:5000/${service.image_path}`} alt={service.service_name} className="w-full h-[20rem] bg-gray-300 mb-4 rounded-lg bg-cover bg-center" />
                          <h3 className="text-lg font-semibold mb-2">{service.service_name}</h3>
                          <p className="text-gray-800">{service.description}</p>
                          <p className="text-gray-600 mt-2">Price: PHP {service.price}</p>
                          <button onClick={() => { handleServiceSelect(service); handleReserveClick();}} className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out">Reserve</button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center">No available</p>
                )};
              </TabPanel>
            ))}
        </Tabs>
      </section>
      {/* Modal for reservation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-light p-8 rounded-lg overflow-auto">
            <h2 className="text-3xl  mb-6 text-center font-palanquin font-semibold">Reservation Form</h2>
            <form className="grid grid-cols-2 gap-4">
              <input type="hidden" name="service_id" value={selectedService.service_id} />
              {/* <input type="hidden" name="customer_id" value={customerId} /> */}
              <div>
                <div className="mb-4">
                  <label htmlFor="service" className="block text-sm font-medium text-dark">Service</label>
                  <input 
                    type="text" 
                    id="service" 
                    name="service" 
                    value={selectedService.service_name} 
                    readOnly 
                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md  p-2" 
                    />
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-dark">
                    Date
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={newAppointment.date}
                    onChange={handleChange}
                    className="mt-1  block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md  p-2" 
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-dark">Price</label>
                  <input 
                    type="text" 
                    id="price" 
                    name="price" 
                    value={`PHP ${selectedService.price}`} 
                    readOnly 
                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md  p-2" />
                </div>
                <div className="mb-4">
                  <label htmlFor="time" className="block text-sm font-medium text-dark">
                    Time
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    type="time" 
                    id="time" 
                    name="time" 
                    value={newAppointment.time}
                    onChange={handleChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md  p-2" />
                </div>
              </div>
              <div className="col-span-2 mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-dark">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="3" 
                  value={newAppointment.message}
                  onChange={handleChange}
                  className="mt-1  block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md  p-2"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={addAppointment}
                  className="bg-dark hover:bg-light-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Reserve Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )} 
      <section>
        <Footer />
      </section>
      <ScrollToTopButton />
    </main>
    
  );
}
export default Services;
