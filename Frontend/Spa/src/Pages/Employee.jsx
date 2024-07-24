import React, { useState, useEffect, useCallback} from 'react';
import { FaUserAlt, FaCalendarAlt, FaTasks } from 'react-icons/fa';
import Logo from '../assets/img/Logo.png';
import swal from 'sweetalert';

const Employee = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const Profile = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeUpdate, setEmployeeUpdate] = useState(null);
    const [changePassword, setChangePassword] = useState({
      employee_id: null,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

    // Function to check login status and employee data
    const checkLoginStatus = useCallback(async () => {
      try {
        const response = await fetch('http://localhost:5000/employee/check-login', {
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

    useEffect(() => {
      if (isLoggedIn === false) {
        window.location.href = '/employeelogin';
      }
    }, [isLoggedIn]);

    // Function to fetch employee data
    const fetchEmployeeData = useCallback(async () => {
      try {
        const response = await fetch('http://localhost:5000/get-employeeData', {
          method: 'GET',
          credentials: 'include' // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          // Set isLoggedIn state
          setEmployeeData(data.employeeData);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle error
      }
    }, []); 

    useEffect(() => {
      fetchEmployeeData();
    }, [fetchEmployeeData])

  
    const openModal = (employeeData) => {
      setEmployeeUpdate(employeeData);
      setShowModal(true);
    };
  
    const closeModal = () => {
      setEmployeeUpdate(null);
      setShowModal(false);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEmployeeUpdate(prevFields => ({
        ...prevFields,
        [name]: value
      }));
    };
    
    const updateProfile = async (e) => {
      e.preventDefault();
      try {

        // Send the user data to the backend
        const response = await fetch('http://localhost:5000/update-employee', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(employeeUpdate),
        });
    
        // Check if the request was successful
        if (response.ok) {
          // If successful, close the modal and show success message
          closeModal();
          setAlertMessage("You have successfully updated your profile!");
          setTimeout(() => {
            setAlertMessage("");
          }, 3000);
          fetchEmployeeData();
        } else {
          // If there was an error, log it
          console.error('Failed to update profile:', response.statusText);
          // Optionally, show an error message to the user
          setAlertMessage("Failed to update profile. Please try again later.");
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        // Optionally, show an error message to the user
        setAlertMessage("Failed to update profile. Please try again later.");
      }
    };

    const openPassModal = () => {
      // Check if userData is not empty and set the user_id in changePassword state
    if (employeeData && employeeData.employee_id) {
      setChangePassword(prevState => ({
        ...prevState,
        employee_id: employeeData.employee_id
      }));
    }
      setShowPasswordModal(true);
    };
  
    const closePassModal = () => {
      setShowPasswordModal(false);
      setChangePassword({
        user_id: null,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    };

    const handleChangePassword = (e) => {
      const { name, value } = e.target;
      setChangePassword(prevFields => ({
        ...prevFields,
        [name]: value
      }));
    };
  
    const handleUpdatePassword = async (e) => {
      e.preventDefault();
      try {
  
        // Send the data to the backend
        const response = await fetch('http://localhost:5000/employee/update-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(changePassword),
        });
  
        if (response.ok) {
          closePassModal();
          setAlertMessage("Password changed successfully!");
          setTimeout(() => {
            setAlertMessage("");
          }, 3000);
        } else {
          closePassModal();
          console.error('Failed to change password:', response.statusText);
          // Optionally, show an error message to the user
          setAlertMessage("Failed to change password. Please try again later.");
          setTimeout(() => {
            setAlertMessage("");
          }, 3000);
        }
      } catch (error) {
        closePassModal();
        console.error('Error changing password:', error);
        // Optionally, show an error message to the user
        setAlertMessage("Failed to change password. Please try again later.");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      }
    };
  
    return (
      
      <div className="border-light-dark p-4 lg:p-8 bg-white border-2 rounded-lg shadow-md  ">
        {alertMessage && (
          <div className="mb-4 bg-green-500 text-white py-2 px-4 rounded-md">
            {alertMessage}
          </div>
        )}
        <h2 className="text-lg lg:text-4xl font-semibold mb-4">Welcome, {employeeData.Fname}!</h2>
        <div className="mb-4 space-y-2">
          <h2 className="text-2xl font-palanquin font-bold">Profile Information:</h2>
          <p className="text-gray-700 text-sm lg:text-base"><span className="font-semibold">First Name:</span> {employeeData.Fname}</p>
          <p className="text-gray-700 text-sm lg:text-base"><span className="font-semibold">Last Name:</span> {employeeData.Lname}</p>
          <p className="text-gray-700 text-sm lg:text-base"><span className="font-semibold">Username:</span> {employeeData.username}</p>
          <p className="text-gray-700 text-sm lg:text-base"><span className="font-semibold">Email:</span> {employeeData.email}</p>
          <p className="text-gray-700 text-sm lg:text-base"><span className="font-semibold">Contact:</span> {employeeData.contact}</p>
          <button className="bg-dark hover:bg-light-dark text-white px-4 py-2 rounded-md mb-2 lg:mb-0 mr-0 lg:mr-2" onClick={() => openModal(employeeData)}>Update Profile</button>
        </div>
        <div className="mb-4 space-y-2">
          <h2 className="text-2xl font-palanquin font-bold">Password and Security:</h2>
          <button className="bg-dark hover:bg-light-dark text-white px-4 py-2 rounded-md mb-2 lg:mb-0 mr-0 lg:mr-2" onClick={openPassModal}>Change Password</button>
        </div>
  
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-center">
            <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
            <div className="modal-container bg-white w-full max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-content py-4 text-left px-6">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-semibold">Update Profile</p>
                  <button className="modal-close" onClick={closeModal}>
                    <span className="text-3xl">&times;</span>
                  </button>
                </div>
                <form onSubmit={updateProfile}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="firstName"
                      type="text"
                      name="Fname"
                      placeholder="First Name"
                      value={employeeUpdate.Fname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="lastName"
                      type="text"
                      name="Lname"
                      placeholder="Last Name"
                      value={employeeUpdate.Lname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                      Username
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={employeeUpdate.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={employeeUpdate.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
                      Contact
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="contact"
                      type="text"
                      name="contact"
                      placeholder="Contact"
                      value={employeeUpdate.contact}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
  
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-center">
            <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
            <div className="modal-container bg-white w-full max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-content py-4 text-left px-6">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-semibold">Change Password</p>
                  <button className="modal-close" onClick={closePassModal}>
                    <span className="text-3xl">&times;</span>
                  </button>
                </div>
                <form onSubmit={handleUpdatePassword}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                      Current Password
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={changePassword.currentPassword}
                      onChange={handleChangePassword}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                      New Password
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={changePassword.newPassword}
                      onChange={handleChangePassword}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
                      Confirm New Password
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="confirmNewPassword"
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Confirm New Password"
                      value={changePassword.confirmNewPassword}
                      onChange={handleChangePassword}
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      onClick={closePassModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-dark hover:bg-light-dark duration-300 text-white font-bold py-2 px-4 rounded"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [pendingAppointment, setPendingAppointment] = useState([]);

    // Define a function to fetch appointments from the server
    const fetchAppointments = async () => {
      try {
        // Make a GET request to the /appointments endpoint
        const response = await fetch('http://localhost:5000/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        // Update the bookings state with the fetched appointments
        setAppointments(data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    // Call the fetchAppointments function when the component mounts
    useEffect(() => {
      fetchAppointments();
      return () => {
      };
    }, []);

    useEffect(() => {
      const pendingAppointment = appointments.filter(appointment => appointment.request_status === 0  );
      // Sort the pending appointments by date
      pendingAppointment.sort((a, b) => new Date(a.date_appointed) - new Date(b.date_appointed));
      setPendingAppointment(pendingAppointment);
     // setAppointmentAccepted(acceptedAppointment);
    }, [appointments]);

    // Function to fetch employee data
    const fetchEmployeeData = useCallback(async () => {
      try {
        const response = await fetch('http://localhost:5000/get-employeeData', {
          method: 'GET',
          credentials: 'include' // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          // Set isLoggedIn state
          setEmployeeData(data.employeeData);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle error
      }
    }, []); 

    useEffect(() => {
      fetchEmployeeData();
    }, [fetchEmployeeData])

    const handleAccept = async (appointmentId) =>  {
      try {
        const response = await fetch('http://localhost:5000/assigned-employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: employeeData.employee_id,
            appointment_id: appointmentId,
            status: 0, 
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to assign employee');
        }

        try {
          // Make a PUT request to update the request status to 3 (declined)
          const response = await fetch(`http://localhost:5000/appointments/${appointmentId}/request-status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request_status: 1 }), // Assuming "request_status" is the field name
          });
  
          if (!response.ok) {
            swal({
              title: 'Something went wrong',
              text: 'Please try again',
              icon: 'error',
              buttons: false,
              timer: 1500,
            });
            throw new Error('Failed to update request status');
          }

          swal({
            title: 'Accepted',
            text: 'This appointment is being accepted',
            icon: 'success',
            buttons: false,
            timer: 1500,
          });
          
          // Remove the declined booking from the local state
          setPendingAppointment(pendingAppointment.filter(appointment => appointment.appointment_id !== appointmentId));
        } catch (error) {
          console.error('Error declining appointment:', error);
        }

      } catch (error) {
        console.error('Error assigning employee:', error);
      }
    };

    const handleDeclined = async (appointmentId) => {
      try {
        // Make a PUT request to update the request status to 3 (declined)
        const response = await fetch(`http://localhost:5000/appointments/${appointmentId}/request-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request_status: 2 }),
        });

        if (!response.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to update request status');
        }

        swal({
          title: 'Declined',
          text: 'This appointment is being declined',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });

        // Remove the declined booking from the local state
        setPendingAppointment(pendingAppointment.filter(appointment => appointment.appointment_id !== appointmentId));
      } catch (error) {
        console.error('Error declining appointment:', error);
      }
    };
    
    return (
      <div className='container mx-auto'>
        <h2 className='text-4xl font-semibold text-center mb-9'>Appointments</h2>
        <div className='overflow-y-auto max-h-[600px]'>
          {pendingAppointment.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-screen overflow-y-auto">
              {pendingAppointment.map((appointment, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md bg-light">
                  <h3 className="text-lg font-bold mb-2">Appointment {index + 1}</h3>
                  <p><span className="font-medium">Name:</span> {appointment.name}</p>
                  <p><span className="font-medium">Email:</span> {appointment.email}</p>
                  <p><span className="font-medium">Phone:</span> {appointment.contact}</p>
                  <p><span className="font-medium">Service:</span> {appointment.service}</p>
                  <p><span className="font-medium">Date:</span> {new Date(appointment.date_appointed).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {new Date(appointment.date_appointed).toLocaleTimeString()}</p>
                  <p><span className="font-medium">Message:</span> {appointment.message || 'No message'}</p>
                  <div className='flex gap-4 mt-4'> 
                    <button 
                      className="px-4 py-2 bg-dark text-white rounded-md hover:bg-dark/90 duration-300 "
                      onClick={() => handleAccept(appointment.appointment_id)}
                    >
                      Accept
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-300 text-end "
                      onClick={() => handleDeclined(appointment.appointment_id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No pending appointments</p>
          )}
        </div>
      </div>
    );
  };
  
  const Tasks = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [completedFilter, setCompletedFilter] = useState({
      date: '',
      time: '',
    });
    const [completedDates, setCompletedDates] = useState([]);
    const [completedTimes, setCompletedTimes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState({
      appointment_id: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('');

    // Function to fetch employee data
    const fetchEmployeeData = useCallback(async () => {
      try {
        const response = await fetch('http://localhost:5000/get-employeeData', {
          method: 'GET',
          credentials: 'include' // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          // Set isLoggedIn state
          setEmployeeData(data.employeeData);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle error
      }
    }, []); 

    useEffect(() => {
      fetchEmployeeData();
    }, [fetchEmployeeData])

    const fetchTask = async () => {
      try {
        const response = await fetch('http://localhost:5000/assigned_employee');
        const data = await response.json();
        if (response.ok) {
          setTasks(data.appointments);
        } else {
          console.error('Error fetching employees:', data.message);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };    

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchTask();
    }, []); 

    useEffect(() => {
      const assignedTasks = tasks.filter(tasks => tasks.employee_id === employeeData.employee_id);
      const pendingTasks = assignedTasks.filter(task => task.appointment_status === 0);
      const completedTasks = assignedTasks.filter(task => task.appointment_status === 1);
      setAssignedTasks(assignedTasks);
      setPendingTasks(pendingTasks);
      setCompletedTasks(completedTasks);
    }, [tasks]);
  
    useEffect(() => {
      const dates = [...new Set(completedTasks.map(task => new Date(task.date_appointed).toLocaleDateString()))];
      const times = [...new Set(completedTasks.map(task => new Date(task.date_appointed).toLocaleTimeString()))];
      setCompletedDates(dates);
      setCompletedTimes(times);
    }, [completedTasks]);
  
    const handleCompletedFilterChange = (e) => {
      const { name, value } = e.target;
      setCompletedFilter(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const filteredCompletedTasks = completedTasks.filter(task => {
      const isDateMatch = !completedFilter.date || new Date(task.date_appointed).toLocaleDateString() === completedFilter.date;
      const isTimeMatch = !completedFilter.time || new Date(task.date_appointed).toLocaleTimeString() === completedFilter.time;
      return isDateMatch && isTimeMatch;
    });
  
    const markAsCompleted = async (appointmentId) => {
      try {
        // Make a PUT request to update the request status to 3 (declined)
        const response = await fetch(`http://localhost:5000/appointments/${appointmentId}/appointment-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ appointment_status: 1 }),
        });

        if (!response.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to update request status');
        }

        swal({
          title: 'Completed',
          text: 'This tasks is mark completed',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });

        fetchTask();
      } catch (error) {
        console.error('Error declining appointment:', error);
      }      
    };

    const openPaymentModal = (taskID) => {      
      setSelectedTaskId(taskID);
      setShowModal(true);
    };

    const closePaymentModal = () => {
      setShowModal(false);
      setSelectedTaskId({
        appointment_id: ''
      });
    };
  
    const handlePaymentMethodChange = (e) => {
      setPaymentMethod(e.target.value);
    };
  
    const markAsPaid = async (appointmentId) => {
      try {
        // Make a PUT request to update the payment status of the customer
        const response = await fetch(`http://localhost:5000/appointments/${appointmentId}/payment-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payment_status: 1 }),
        });
        
        if (!response.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to update payment status');
        }
    
        // Fetch the updated completed tasks
        const updatedResponse = await fetch('http://localhost:5000/assigned_employee');
        const updatedData = await updatedResponse.json();
    
        if (updatedResponse.ok) {
          fetchTask();
        } else {
          console.error('Error fetching updated completed tasks:', updatedData.message);
        }

        swal({
          title: 'Paid',
          text: 'This task is mark as paid',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });
    
        setShowModal(false);
    
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error toggling paid status:', error);
      }
    };
    
  
    return (
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Task Management</h2>
  
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Pending Tasks</h3>
          {pendingTasks.length > 0 ? (
            pendingTasks.map(task => (
              <div key={task.appointment_id} className="bg-white shadow-md rounded-md p-6 mb-4">
                <p className="text-lg font-semibold">{task.name}</p>
                <p className="text-gray-600">{task.service}</p>
                <p>{new Date(task.date_appointed).toLocaleDateString()}, {new Date(task.date_appointed).toLocaleTimeString()}</p>
                <button
                  onClick={() => markAsCompleted(task.appointment_id)}
                  className="px-4 py-2 mt-4 rounded-md text-white bg-dark hover:bg-dark/90 duration-300"
                >
                  Mark as Completed
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No pending tasks</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Completed Tasks</h3>
          <div className="flex items-center mb-4">
            <label className="mr-2">Filter by Date:</label>
            <select
              name="date"
              value={completedFilter.date}
              onChange={handleCompletedFilterChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">All Dates</option>
              {completedDates.map((date, index) => (
                <option key={index} value={date}>{date}</option>
              ))}
            </select>
            <label className="ml-4 mr-2">Filter by Time:</label>
            <select
              name="time"
              value={completedFilter.time}
              onChange={handleCompletedFilterChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">All Times</option>
              {completedTimes.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
          {filteredCompletedTasks.length > 0 ? (
            filteredCompletedTasks.map(task => (
              <div key={task.appointment_id} className="bg-white shadow-md rounded-md p-6 mb-4">
                <p className="text-lg font-semibold">{task.name}</p>
                <p className="text-gray-600">{task.service}</p>
                <p>{new Date(task.date_appointed).toLocaleDateString()}, {new Date(task.date_appointed).toLocaleTimeString()}</p>
                {task.payment_status ? (
                  <div>
                    <p>Paid</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => openPaymentModal(task.appointment_id)}
                    className="px-4 py-2 mt-4 rounded-md text-white bg-dark hover:bg-dark/90 duration-300"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No completed tasks</p>
          )}

        </div>
  
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                        Select Payment Method
                      </h3>
                      <div className="mt-2">
                        <select
                          value={paymentMethod}
                          onChange={handlePaymentMethodChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="" disabled>Select Payment Method</option>
                          <option value="GCash">GCash</option>
                          <option value="PayMaya">PayMaya</option>
                          <option value="Credit Card">Credit Card</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button onClick={() => closePaymentModal()} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Close
                  </button>
                  <button 
                    onClick={() => markAsPaid(selectedTaskId)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                    Mark as Paid
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Profile />;
      case 'appointment':
        return <Appointment />;
      case 'tasks':
        return <Tasks />;
      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    try {
      const response = await fetch('http://localhost:5000/employee/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies in the request
      });
      if (response.ok) {
        // Logout successful
        console.log('Logout successful');
        // Redirect to the login page
        window.location.href = '/EmployeeLogin';
      } else {
        // Logout failed
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error, display error message or any appropriate action
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="lg:w-56 bg-dark  ">
        <div className="flex items-center justify-center h-20 border-b border-light">
          <img className="w-40 h-16 object-contain m-4" src={Logo} alt="Logo" />
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'dashboard' && 'text-primary'
                }`}
                onClick={() => handleTabClick('dashboard')}
              >
                <FaUserAlt className="mr-2" />
                Profile
                {activeTab === 'dashboard' && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all rounded-r-full duration-300" style={{ borderBottomWidth: '2px' }} />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'appointment' && 'text-primary'
                }`}
                onClick={() => handleTabClick('appointment')}
              >
                <FaCalendarAlt className="mr-2" />
                Appointments
                {activeTab === 'appointment' && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all rounded-r-full duration-300" style={{ borderBottomWidth: '2px' }} />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'tasks' && 'text-primary'
                }`}
                onClick={() => handleTabClick('tasks')}
              >
                <FaTasks className="mr-2" />
                Tasks
                {activeTab === 'tasks' && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all rounded-r-full duration-300" style={{ borderBottomWidth: '2px' }} />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-200 min-h-screen ">
        <header className="bg-light flex justify-end items-center px-4 py-2 border-b border-dark">
          <h1 className="text-xl font-bold text-dark m-4">Employee Dashboard</h1>
          <button 
          className="text-white px-4 py-2 bg-dark rounded-full hover:bg-light-dark transition-colors duration-300" 
          onClick={handleLogout}>
            Logout
          </button>
        </header>
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Employee;
