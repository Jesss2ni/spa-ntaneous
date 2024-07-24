import React, { useState , useEffect, useCallback} from 'react';
import { FaTachometerAlt, FaUsers, FaBriefcase, FaCalendarAlt, FaUserFriends, FaUserTie } from 'react-icons/fa';
import Logo from '../assets/img/Logo.png';
import swal from 'sweetalert';

const Admin = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [adminData, setAdminData] = useState([]);
  const [changePassword, setChangePassword] = useState({
    admin_id: null,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Function to check login status and admin data
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
        setAdminData(data.admin);
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

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      window.location.href = '/adminlogin';
    }
  }, [isLoggedIn]);
   

  const openPassModal = () => {
    if(adminData && adminData.admin_id){
      setChangePassword(prevState => ({
        ...prevState,
        admin_id: adminData.admin_id
      }));
    }
    setShowPasswordModal(true);
  }

  const closePassModal = () => {
    setShowPasswordModal(false);
    setChangePassword({
      admin_id: null,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }

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
      const response = await fetch('http://localhost:5000/admin/update-password', {
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

  
  const Logout = async (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    try {
      const response = await fetch('http://localhost:5000/admin/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies in the request
      });
      if (response.ok) {
        // Logout successful
        console.log('Logout successful');
        // Redirect to the login page
        window.location.href = '/adminlogin';
      } else {
        // Logout failed
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error, display error message or any appropriate action
    }
  };

  // Content components
  const DashboardContent = () => {
    const [revenue, setRevenue] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [pendingAppointment, setPendingAppointment] = useState([]);
    const [acceptedAppointment, setAcceptedAppointment] = useState([]);
    const [completedAppointment, setCompletedAppointment] = useState([]);
    const [appointmentsToday, setAppointmentsToday] = useState([]);
    const [employees, setEmployees] = useState([]); // State to store employees fetched from the database
    const [employeePerformance, setEmployeePerformance] = useState([]);
    const [users, setUsers] = useState([]); // State to store users fetched from the database
    const [services, setServices] = useState({
      'All': [],
      'Massage': [],
      'Facial': [],
      'Nail Treatment': [],
      'Body Treatment': [],
      'Packages': []
    });
    const [category, setCategory] = useState([]);

    const fetchRevenue = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/revenue');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue');
        }
        const data = await response.json();
        setRevenue(data.revenue[0].revenue);
      } catch (error) {
        console.error('Error fetching revenue:', error);
      }
    };    

    useEffect(() => {
      fetchRevenue();
    })

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
        setBookings(data.appointments);
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
      const pendingAppointment = bookings.filter(booking => booking.request_status === 0);
      setPendingAppointment(pendingAppointment);
      const acceptedAppointment = bookings.filter(booking => booking.request_status === 1);
      setAcceptedAppointment(acceptedAppointment);
      const completedAppointment = bookings.filter(booking => booking.appointment_status === 1);
      setCompletedAppointment(completedAppointment);
    }, [bookings]);
    
    
    // Function to fetch data and update state
    const fetchData = async () => {
      // Fetch data for KPIs
      const kpiData = await fetchKPIsData();
      setOccupancyRate(kpiData.occupancyRate);
      setAverageTreatmentTime(kpiData.averageTreatmentTime);
  
    };
  
    // Mock functions for fetching data (replace with actual API calls)
    const fetchKPIsData = async () => {
      // Example data fetching logic for KPIs
      return {
        occupancyRate: 0,
        averageTreatmentTime: 0,
      };
    };
  
    const fetchEmployeeData = async () => {
      try {
        // Make a GET request to the /employee endpoint
        const response = await fetch('http://localhost:5000/staffs');
        if (!response.ok) {
          throw new Error('Failed to fetch staffs');
        }
        const data = await response.json();
        // Update the staffs state with the fetched employee
        setEmployeePerformance(data.staffs);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };

    useEffect(() => {
      // Fetch data for employee performance
      fetchEmployeeData();
    });
  
  
    // Trigger data fetching on component mount
    useEffect(() => {
      fetchData();
    }, []);

    // function to get the appointments for today
    const getAppointmentsToday = () => {
      // Get the current date
      const currentDate = new Date().toDateString();

      // Filter appointments for today with request_status === 1
      const todayAppointments = bookings.filter(appointment => {
        // Extract the date part from the appointment's date_appointed property
        const appointmentDate = new Date(appointment.date_appointed).toDateString();
        // Compare with the current date and check request_status
        return appointmentDate === currentDate && appointment.request_status === 1;
      });

      // Set the appointments for today
      setAppointmentsToday(todayAppointments);
    };

    useEffect(() => {
      getAppointmentsToday();
    }, [bookings]);

    // Function to compile tasks for each staff member
    const compileTasks = (employeePerformance) => {
      const compiledTasks = {};
      employeePerformance.forEach((staff) => {
        const { name, task, completedTasks, pendingTasks } = staff;
        if (!compiledTasks[name]) {
          compiledTasks[name] = { name, tasks: [{ task, completedTasks, pendingTasks }] };
        } else {
          compiledTasks[name].tasks.push({ task, completedTasks, pendingTasks });
        }
      });
      return Object.values(compiledTasks);
    };

    // Function to fetch employees data from the /employees endpoint
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        if (response.ok) {
          setEmployees(data.users);
        } else {
          console.error('Error fetching employees:', data.message);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  
    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchEmployees();
    }, []); // Empty dependency array ensures this effect runs only once, equivalent to componentDidMount

    // Function to fetch clients data from the /clients endpoint
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/clients');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          console.error('Error fetching clients:', data.message);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchUsers();
    }, []); // Empty dependency array ensures this effect runs only once, equivalent to componentDidMount

    // Define fetchServices function
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    useEffect(() => {
      // Call fetchServices function when the component mounts
      fetchServices();
    }, []); // Empty dependency array to fetch data only once when the component mounts
  
    return (
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-1">
          {/* Revenue */}
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue</h3>
            {revenue.length > 0 ? (
              <p className="text-4xl font-bold text-blue-500">
                PHP {revenue}
              </p>
            ) : (
              <p className="text-4xl font-bold text-blue-500">
                PHP 0.00
              </p>
            )}            
          </div>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
          {/* No. of Services Offered */}
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">No. of Services Offered</h3>
            <p className="text-4xl font-bold text-center text-blue-500">{services.All.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Total Category</h3>
            <p className="text-4xl font-bold text-center text-green-500">5</p>
          </div>
          {/* Completed Transactions */}
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Completed Transactions</h3>
            <p className="text-4xl font-bold text-center text-purple-500">{completedAppointment.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Appointments</h3>
            <p className="text-4xl font-bold text-center text-blue-500">{pendingAppointment.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Accepted Appointments</h3>
            <p className="text-4xl font-bold text-center text-green-500">{acceptedAppointment.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Total Appointments</h3>
            <p className="text-4xl font-bold text-center text-purple-500">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">No. Employee accounts</h3>
            <p className="text-4xl font-bold text-center text-blue-500">{employees.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">No. User accounts</h3>
            <p className="text-4xl font-bold text-center text-green-500">{users.length}</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Total No. of Users</h3>
            <p className="text-4xl font-bold text-center text-purple-500">{employees.length + users.length}</p>
          </div>
        </div>
  
        {/* Appointment Scheduling and Availability */}
        <div className="bg-white rounded-md shadow-md p-6 mt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Appointments Today */}
            <div>
              <h4 className="text-xl font-semibold mb-2">Appointments Today</h4>
              <div className="bg-gray-100 p-4 rounded-md">
                {/* Display available appointment slots */}
                {appointmentsToday.length > 0 ? (
                <>
                  {appointmentsToday.map((appointment, index) => (
                    <div key={index} >
                      <ul className="divide-y divide-gray-200">
                        <li className="py-2">
                          Name: {appointment.name} - Schedule: {new Date(appointment.date_appointed).toLocaleDateString()} {new Date(appointment.date_appointed).toLocaleTimeString()}
                        </li>
                      </ul>
                    </div>
                  ))}
                </>
                ) : (
                  <p className="text-gray-500">No Appointments Today</p>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* Employee Performance */}
        <div className="bg-white rounded-md shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
          {compileTasks(employeePerformance).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {compileTasks(employeePerformance).map((employee, index) => (
                <div key={index} className="bg-white rounded-md shadow-md p-6">
                  <h4 className="text-xl font-semibold mb-2">{employee.name}</h4>
                  <p className="text-gray-700 mb-2">Pending Task: {employee.tasks.reduce((total, task) => total + parseInt(task.pendingTasks), 0)}</p>
                  <p className="text-gray-700 mb-2">Tasks Completed: {employee.tasks.reduce((total, task) => total + parseInt(task.completedTasks), 0)}</p>
                  {/* Add more performance metrics if needed */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No employee performance metrics available.</p>
          )}
        </div>
      </div>
    );
  };

  const Calendar = () => {
    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    // Get number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
    // Get first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
    // Generate array of days in the month
    const daysArray = [...Array(daysInMonth).keys()].map(day => day + 1);
  
    // Generate array of days to display in the calendar
    const calendarDays = [];
  
    // Add empty placeholders for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push('');
    }
  
    // Add days of the month
    calendarDays.push(...daysArray);
  
    // Render calendar
    return (
      <div className="calendar">
        <h4 className="text-xl font-semibold mb-2">Calendar</h4>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Sun</th>
              <th className="px-4 py-2">Mon</th>
              <th className="px-4 py-2">Tue</th>
              <th className="px-4 py-2">Wed</th>
              <th className="px-4 py-2">Thu</th>
              <th className="px-4 py-2">Fri</th>
              <th className="px-4 py-2">Sat</th>
            </tr>
          </thead>
          <tbody>
            {calendarDays.map((day, index) => (
              <td key={index} className="border px-4 py-2">{day}</td>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const UsersContent = () => {
    const [activeTab, setActiveTab] = useState('clients'); // State to track active tab
    const [searchQuery, setSearchQuery] = useState(''); // State to track search query
    const [clients, setClients] = useState([]); // State to store clients fetched from the database
    const [employees, setEmployees] = useState([]); // State to store employees fetched from the database
  
    // Function to fetch clients data from the /clients endpoint
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/clients');
        const data = await response.json();
        if (response.ok) {
          setClients(data.users);
        } else {
          console.error('Error fetching clients:', data.message);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
  
    // Function to fetch employees data from the /employees endpoint
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        if (response.ok) {
          setEmployees(data.users);
        } else {
          console.error('Error fetching employees:', data.message);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  
    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchClients();
      fetchEmployees();
    }, []); // Empty dependency array ensures this effect runs only once, equivalent to componentDidMount
  
    // Function to delete a client
    const deleteClient = async (clientId) => {
      try {
        const response = await fetch(`http://localhost:5000/clients/${clientId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          swal({
            title: 'Deleted',
            text: 'This account is being deleted succesfully',
            icon: 'success',
            buttons: false,
            timer: 1500,
          });
          setClients(clients.filter(client => client.user_id !== clientId));
        } else {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          console.error('Failed to delete client');
        }
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error deleting client:', error);
      }
    };
    

    // Function to delete an employee
    const deleteEmployee = async (employeeId) => {
      try {
        const response = await fetch(`http://localhost:5000/employees/${employeeId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          swal({
            title: 'Deleted',
            text: 'This account is being deleted succesfully',
            icon: 'success',
            buttons: false,
            timer: 1500,
          });
          setEmployees(employees.filter(employee => employee.employee_id !== employeeId));
        } else {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          console.error('Failed to delete employee');
        }
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error deleting employee:', error);
      }
    };
    
    // Function to filter users based on search query
    const filteredClients = clients.filter(client =>
      (client.Fname + ' ' + client.Lname).toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery)
    );


    const filteredEmployees = employees.filter(employee =>
      (employee.Fname + ' ' + employee.Lname).toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.includes(searchQuery)
    );

    function capitalizeEachWord(str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }    

    return (
      <main className="container mx-auto h-screen">
        <div className="p-8">
          <div>
            <h1 className="text-center text-custom font-semibold">User Management</h1>
          </div>
          
          {/* Tab content */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold m-4">User Accounts</h2>
            {/* Dropdown for switching between clients and employees */}
            <select
              className="mb-4 px-4 py-2 bg-light text-md border border-gray-300 rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="clients">Users</option>
              <option value="employees">Employees</option>
            </select>
            {/* Search input */}
            <div className="mb-4">
              <input
                type="text"
                className="px-4 py-2 bg-light text-md border border-gray-300 rounded-md"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === 'clients' && (
              <div className="max-h-96 overflow-y-auto">
                {filteredClients.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-300 text-center bg-light">
                    <thead className="bg-light">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client, index) => {
                        //console.log("Client:", client);
                        return (
                          <tr key={`client_${client.user_id}`} className="hover:bg-gray-100">
                            <td className="p-2">{client.user_id}</td>
                            <td className="p-2">{capitalizeEachWord(client.Fname) + " " + capitalizeEachWord(client.Lname)}</td>
                            <td className="p-2">{client.email}</td>
                            <td className="p-2">{client.contact}</td>
                            <td className="p-2">
                              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded" onClick={() => deleteClient(client.user_id)}>Delete</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center">No users found.</p>
                )}
              </div>
            )}
            
            {activeTab === 'employees' && (
              <div className="max-h-96 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  <table className="w-full border-collapse bg-light border border-gray-300 text-center">
                    <thead className="bg-light">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(employee => (
                        <tr key={`employee_${employee.employee_id}`} className="hover:bg-gray-100">
                          <td className="p-2">{employee.employee_id}</td>
                          <td className="p-2">{capitalizeEachWord(employee.Fname) + " " + capitalizeEachWord(employee.Lname)}</td>
                          <td className="p-2">{employee.email}</td>
                          <td className="p-2">{employee.contact}</td>
                          <td className="p-2">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded" onClick={() => deleteEmployee(employee.employee_id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center">No employees found.</p>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    );
  };

  const ServicesContent = () => {
    const [services, setServices] = useState({
      'All': [],
      'Massage': [],
      'Facial': [],
      'Nail Treatment': [],
      'Body Treatment': [],
      'Packages': []
    });
  
    // State for new service form
    const [newService, setNewService] = useState({
      service_name: '',
      description: '',
      price: '',
      category: '',
      image: '',
    });
  
    // State for managing modal visibility and selected service for update
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All'); // State to track active category
  
    // Define fetchServices function
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    useEffect(() => {
      // Call fetchServices function when the component mounts
      fetchServices();
    }, []); // Empty dependency array to fetch data only once when the component mounts

    // Function to handle form input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewService(prevService => ({
        ...prevService,
        [name]: value
      }));
    };
  
    // Function to handle image upload
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
    
      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setNewService(prevService => ({
          ...prevService,
          image: file.name, // Set image name or any other identifier
          image_path: data.imagePath // Save the image path in the state
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };    
  
    // Function to add a new service
    const addService = async () => {
      try {
        const formData = new FormData();
        formData.append('service_name', newService.service_name);
        formData.append('description', newService.description);
        formData.append('price', newService.price);
        formData.append('category', newService.category);
        formData.append('image', newService.image);
        formData.append('image_path', newService.image_path); // Include image path in the FormData
        const response = await fetch('http://localhost:5000/services', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Field with * is required',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to add service');
        }

        swal({
          title: 'Success',
          text: 'New service added successfully',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });
        
        // Clear the file input value to clear the selection
        document.getElementById('imageInput').value = '';
        // Clear the form fields after adding the service
        setNewService({
          service_name: '',
          description: '',
          category: '',
          price: '',
          image: '',
          image_path: '', // Clear the image path
        });
        
        // Fetch services data again to update the list
        fetchServices();
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Field with * is required',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error adding service:', error);
      }
    };

  
    // Function to open the modal for updating a service
    const openUpdateModal = (service) => {
      setSelectedService(service);
      setIsModalOpen(true);
    };
  
    // Function to close the modal
    const closeUpdateModal = () => {
      setIsModalOpen(false);
      setSelectedService(null);
    };

    const handleUpdateChange = (e) => {
      const { name, value } = e.target;
      setSelectedService(prevService => ({
        ...prevService,
        [name]: value
      }));
    };

    // Function to handle image upload
    const handleUpateImageUpload = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
    
      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setSelectedService(prevService => ({
          ...prevService,
          image: file.name, // Set image name or any other identifier
          image_path: data.imagePath // Save the image path in the state
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };    

    // Update service function
    const updateService = async () => {
      try {
        const formData = new FormData();

        // Append updated service data to the FormData object
        formData.append('service_name', selectedService.service_name);
        formData.append('description', selectedService.description);
        formData.append('price', selectedService.price);
        formData.append('category', selectedService.category);
        formData.append('image', selectedService.image); // Use selectedService.image
        formData.append('image_path', selectedService.image_path); // Use selectedService.image_path

        // Make a PUT request to update the service
        const response = await fetch(`http://localhost:5000/services/${selectedService.service_id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to update service');
        }

        swal({
          title: 'Success',
          text: 'Service updated successfully',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });

        // If the update is successful, close the update modal
        closeUpdateModal();
        // Fetch services data again to update the list
        fetchServices();
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error updating service:', error);
        // Handle errors if necessary
      }
    };
        
    // Function to delete a service
    const deleteService = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/services/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to delete service');
        }

        swal({
          title: 'Success',
          text: 'Service deleted successfully',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });

        // Update services state to reflect the deletion
        setServices(prevServices => ({
          ...prevServices,
          [activeCategory]: prevServices[activeCategory].filter(service => service.service_id !== id)
        }));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    };
  
    return (
      <div className='container mx-auto'>
        <h2 className="text-2xl font-bold mb-4">Manage Services</h2>
        
        {/* Category dropdown */}
        <div className="mb-4">
          <label htmlFor="categorySelect" className="mr-2">Select Category:</label>
          <select
            id="categorySelect"
            className="px-4 py-2 bg-light text-md border border-gray-300 rounded-md"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {Object.keys(services).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
  
        {/* New service form */}
        <form className="mb-8">
          {/* Form fields for new service */}
          
          <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            name="service_name"
            value={newService.service_name}
            onChange={handleChange}
            placeholder="Service Name"
            className="px-4 py-2 border rounded mr-2"
          />
          <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            name="description"
            value={newService.description}
            onChange={handleChange}
            placeholder="Description"
            className="px-4 py-2 border rounded mr-2"
          />
          <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            name="price"
            value={newService.price}
            onChange={handleChange}
            placeholder="Price"
            className="px-4 py-2 border rounded mr-2"
          />
          <span style={{ color: 'red' }}>*</span>
          <select
            name="category"
            value={newService.category}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded mr-2"
          >
            <option value='' disabled>Select category</option>
            <option value="Massage">Massage</option>
            <option value="Facial">Facial</option>
            <option value="Nail Treatment">Nail Treatment</option>
            <option value="Body Treatment">Body Treatment</option>
            <option value="Packages">Packages</option>
          </select>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageUpload}
            className="mr-2"
          />
          <button 
            type="button" 
            onClick={addService} 
            className="px-4 py-2 bg-dark hover:bg-dark/90 text-white rounded">Add Service</button>
        </form>
  
        {/* Service list */}
        <div className="grid-container h-screen" style={{ maxHeight: '630px', overflowY: 'auto' }}>
        {services[activeCategory].length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services[activeCategory].map(service => (
              <div key={service.service_id} className="bg-white rounded shadow p-4">
                {/* Service details */}
                <img src={`http://localhost:5000/${service.image_path}`} alt={service.service_name} className="w-full h-40 object-cover mb-4" />
                <h3 className="text-lg font-semibold mb-2">{service.service_name}</h3>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <p className="text-lg font-bold text-primary">
                  PHP {service.price.toFixed(2)}
                </p>
                <button className='px-4 py-2 m-2 bg-dark text-white rounded hover:bg-dark/90 duration-300' onClick={() => openUpdateModal(service)}>Update</button>
                <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 duration-300' onClick={() => deleteService(service.service_id)}>Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No services available in this category.</p>
        )}
      </div>
  
        {/* Update Service Modal */}
        {selectedService && (
        <div className={`fixed inset-0 z-50 ${isModalOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            <div className="bg-white rounded-lg p-8 max-w-md z-50">
              <h2 className="text-2xl font-bold mb-4">Update Service</h2>
              <form>
                {/* Update form fields */}
                <input
                  type="text"
                  name="service_name" 
                  defaultValue={selectedService.service_name}
                  value={selectedService.update_service_name} // Make sure to use the correct property name
                  onChange={handleUpdateChange}
                  placeholder="Service Name"
                  className="px-4 py-2 border rounded mr-2"
                />
                <input
                  type="text"
                  name="description"
                  defaultValue={selectedService.description}
                  value={selectedService.update_description} // Make sure to use the correct property name
                  onChange={handleUpdateChange}
                  placeholder="Description"
                  className="px-4 py-2 border rounded mr-2"
                />
                <input
                  type="text"
                  name="price"
                  defaultValue={selectedService.price}
                  value={selectedService.update_price} // Make sure to use the correct property name
                  onChange={handleUpdateChange}
                  placeholder="Price"
                  className="px-4 py-2 border rounded mr-2"
                />
                <select
                  name="category"
                  defaultValue={selectedService.category}
                  value={selectedService.update_category}
                  onChange={handleUpdateChange}
                  className="px-4 py-2 border rounded mr-2"
                >
                  <option value="Massage">Massage</option>
                  <option value="Facial">Facial</option>
                  <option value="Nail Treatment">Nail Treatment</option>
                  <option value="Body Treatment">Body Treatment</option>
                  <option value="Packages">Packages</option>
                </select>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleUpateImageUpload}
                  className="mr-2"
                />
                <button type="button" onClick={updateService} className="px-4 py-2 bg-blue-500 text-white rounded">Update Service</button>
                <button type="button" onClick={closeUpdateModal} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  };

  const BookingContent = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [employees, setEmployees] = useState([]); // State to store employees 
    const [showModal, setShowModal] = useState(false);  
    const [pendingAppointment, setPendingAppointment] = useState([]);
    const [appointmentAccepted, setAppointmentAccepted] = useState([]);
  
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
        setBookings(data.appointments);
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

    // Function to fetch employees data from the /employees endpoint
    const fetchAssignedEmployee = async () => {
      try {
        const response = await fetch('http://localhost:5000/assigned_employee');
        const data = await response.json();
        if (response.ok) {
          // Sort the appointments by date
          data.appointments.sort((a, b) => new Date(a.date_appointed) - new Date(b.date_appointed));
          setAppointmentAccepted(data.appointments);
        } else {
          console.error('Error fetching employees:', data.message);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchAssignedEmployee();
      return () => {
      };
    }, []); 
   
    // Function to fetch employees data from the /employees endpoint
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        if (response.ok) {
          setEmployees(data.users);
        } else {
          console.error('Error fetching employees:', data.message);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchEmployees();
      return () => {
      };  
    }, []); 
   
    const handleAccept = (bookingId) => {
      setSelectedBookingId(bookingId);
      setShowModal(true);
    };

    //assign the appointment to the employee
    const handleAssign = async (employeeId, bookingId) => {
      try {
        const response = await fetch('http://localhost:5000/assigned-employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: employeeId,
            appointment_id: bookingId, 
            status: 0, 
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to assign employee');
        }

        try {
          // Make a PUT request to update the request status to 3 (declined)
          const response = await fetch(`http://localhost:5000/appointments/${bookingId}/request-status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request_status: 1 }),
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
            title: 'Success',
            text: 'Appointment accepted',
            icon: 'success',
            buttons: false,
            timer: 1500,
          });
  
          // Remove the declined booking from the local state
          setPendingAppointment(pendingAppointment.filter(booking => booking.appointment_id !== bookingId));
        } catch (error) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          console.error('Error declining appointment:', error);
        }
    
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error assigning employee:', error);
      }
      
      // Add the selected booking to the appointmentAccepted state
      fetchAssignedEmployee();
      setShowModal(false);
    };    

    const handleDeclined = async (bookingId) => {
      try {
        // Make a PUT request to update the request status to 3 (declined)
        const response = await fetch(`http://localhost:5000/appointments/${bookingId}/request-status`, {
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
          title: 'Success',
          text: 'Appointment declined',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });

        // Remove the declined booking from the local state
        setPendingAppointment(pendingAppointment.filter(booking => booking.appointment_id !== bookingId));
      } catch (error) {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error',
          buttons: false,
          timer: 1500,
        });
        console.error('Error declining appointment:', error);
      }
    };

    useEffect(() => {
      const pendingAppointment = bookings.filter(booking => booking.request_status === 0);
      // Sort the pending appointments by date
      pendingAppointment.sort((a, b) => new Date(a.date_appointed) - new Date(b.date_appointed));
      setPendingAppointment(pendingAppointment);
    }, [bookings]);

    function capitalizeEachWord(str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }    
  
    return (
      <div className="p-8 container mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">Pending Appointments</h2>
        <div className="overflow-y-auto max-h-[600px]">
          {pendingAppointment.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pendingAppointment.map((booking) => (
                <div key={booking.appointment_id} className="bg-white rounded-md shadow-md p-6">
                  <p className="text-lg font-semibold mb-4">Name: {booking.name}</p>
                  <p className="text-gray-700 mb-2">Email: {booking.email}</p>
                  <p className="text-gray-700 mb-2">Phone: {booking.contact}</p>
                  <p className="text-gray-700 mb-2">Service: {booking.service}</p>
                  <p className="text-gray-700 mb-2">Date: {new Date(booking.date_appointed).toLocaleDateString()}</p>
                  <p className="text-gray-700 mb-2">Time: {new Date(booking.date_appointed).toLocaleTimeString()}</p> 
                  <p className="text-gray-700 mb-2">Message: {booking.message || 'No message'}</p>
                  <div className="flex gap-4">
                    <button
                      className="bg-dark hover:bg-dark/90 text-white font-bold py-2 px-4 rounded-full mt-4 mr-2"
                      onClick={() => handleAccept(booking.appointment_id)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-4"
                      onClick={() => handleDeclined(booking.appointment_id)}
                    >
                      Declined
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
          ) : (
            <p className="text-gray-500 text-center p-10">
              No pending appointments at the moment.
            </p>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white p-8 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-center">Choose employee(s):</h3>
              <table className="border-collapse w-full mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Employee ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Availability</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                {employees.map(employee => (
                  <tr key={employee.employee_id}>
                    <td className="p-2">{employee.employee_id}</td>
                    <td className="p-2">{capitalizeEachWord(employee.Fname) + " " + capitalizeEachWord(employee.Lname)}</td>
                    <td className="p-2">Available</td>
                    <td className="p-2 text-center">
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                        onClick={() => handleAssign(employee.employee_id, selectedBookingId)}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>          
              </div>
            </div>
          </div>
        )}
       <div className="mt-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Confirmed Appointment</h2>
          <div className="overflow-auto max-h-[300px]">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Accepted</th>
                  <th className="px-4 py-2">Assigned Employee</th>                  
                </tr>
              </thead>
              <tbody className='text-center'>
                {appointmentAccepted.length > 0 ? (
                  <>
                    {appointmentAccepted.map((appointment) => (
                      <tr key={appointment.appointment_id}>
                        <td className="border px-4 py-2">{appointment.name}</td>
                        <td className="border px-4 py-2">{appointment.email}</td>
                        <td className="border px-4 py-2">{appointment.contact}</td>
                        <td className="border px-4 py-2">{appointment.service}</td>
                        <td className="border px-4 py-2">{new Date(appointment.date_appointed).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{new Date(appointment.date_appointed).toLocaleTimeString()}</td>
                        <td className="border px-4 py-2">
                          {appointment.request_status ? 'Accepted' : 'Pending'}
                        </td>
                        <td className="border px-4 py-2">{appointment.assignedEmployee}</td>                    
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan="8" className="text-gray-500 text-center p-20">
                      Accepted appointments will display here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const CustomerManagementContent = () => {
    // Sample data for customer overview
    const [customers, setCustomers] = useState([]);
    const [acceptedAppointment, setAcceptedAppointment] = useState([]);
    const [paidCustomersHistory, setPaidCustomersHistory] = useState([]);
    
    // Define a function to fetch appointments from the server
    const fetchCustomers = async () => {
      try {
        // Make a GET request to the /appointments endpoint
        const response = await fetch('http://localhost:5000/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        // Update the bookings state with the fetched appointments
        setCustomers(data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    useEffect(() => {
      // Call the fetchAppointments function when the component mounts
      fetchCustomers();
      return () => {
        // Perform any clean-up if needed
      };
    }, []);

    //useEffects to populate Customer Overview for accepted appointment
    useEffect(() => {
      const acceptedApp = customers.filter(customer => customer.request_status === 1);
      setAcceptedAppointment(acceptedApp);
    }, [customers]);

    // useEffect to populate paidCustomersHistory with customers where payment_status is 1
    useEffect(() => {
      const paidCustomers = customers.filter(customer => customer.payment_status === 1);
      setPaidCustomersHistory(paidCustomers);
    }, [customers]);

    // Function to toggle the paid status of a customer
    const togglePaidStatus = async (appointmentId) => {
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

        // Fetch the updated list of customers after updating the payment status
        const updatedData = await fetch('http://localhost:5000/appointments');
        if (!updatedData.ok) {
          swal({
            title: 'Something went wrong',
            text: 'Please try again',
            icon: 'error',
            buttons: false,
            timer: 1500,
          });
          throw new Error('Failed to fetch updated customers');
        }

        swal({
          title: 'Paid',
          text: 'This is mark as paid',
          icon: 'success',
          buttons: false,
          timer: 1500,
        });

        const updatedCustomersData = await updatedData.json();
        setCustomers(updatedCustomersData.appointments);
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
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Overview</h2>
        {acceptedAppointment.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto max-h-96">
              {acceptedAppointment.map((customer) => (
                <div key={customer.appointment_id} className="bg-white rounded-md shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{customer.name}</h3>
                  <p className="text-gray-700 mb-2">Email: {customer.email}</p>
                  <p className="text-gray-700 mb-2">Phone: {customer.contact}</p>
                  <p className="text-gray-700 mb-2">Service: {customer.service}</p>
                  <p className="text-gray-700 mb-2">Appointment Status: {customer.appointment_status ? 'Done' : 'Ongoing'}</p>
                  <p className="text-gray-700 mb-2">
                    Total Amount to Pay: PHP{customer.price_final ? customer.price_final.toFixed(2) : 'N/A'}
                  </p>
                  <p className="text-gray-700 mb-2">Paid: {customer.payment_status ? 'Yes' : 'No'}</p>
                  {!customer.payment_status && (
                    <button
                      className="bg-dark hover:bg-dark/90 duration-300 text-white rounded-md px-4 py-2 mr-2"
                      onClick={() => {
                        togglePaidStatus(customer.appointment_id);
                      }}
                    >
                      Mark as Paid
                    </button>
                  )}
                
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center p-10">
            Customer overview will be display here.
          </p>
        )}
       {/* Display paid customers history in a table */}
        <div className="mt-8 overflow-auto max-h-96">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Paid Customers History</h2>
          {paidCustomersHistory.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {paidCustomersHistory.map((customer) => (
                  <tr key={customer.appointment_id}>
                    <td className="border px-4 py-2">{customer.name}</td>
                    <td className="border px-4 py-2">{customer.email}</td>
                    <td className="border px-4 py-2">{customer.contact}</td>
                    <td className="border px-4 py-2">{customer.service}</td>
                    <td className="border px-4 py-2">PHP{customer.price_final.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">Paid customer history will display here.</p>
          )}
        </div>
      </div>
    );
  };

  const StaffManagementContent = () => {
    const [staffMembers, setStaffMembers] = useState([]);

    // Define a function to fetch the staff from the Employee from the server
    const fetchStaffs = async () => {
      try {
        // Make a GET request to the /employee endpoint
        const response = await fetch('http://localhost:5000/staffs');
        if (!response.ok) {
          throw new Error('Failed to fetch staffs');
        }
        const data = await response.json();
        // Update the staffs state with the fetched employee
        setStaffMembers(data.staffs);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };

    useEffect(()  => {
      // Call the fetchEmployees function when the component mounts
      fetchStaffs();
      return () => {
        //perform any clean-up if needed
      };
    }, []);

    // Function to compile tasks for each staff member
    const compileTasks = (employeePerformance) => {
      const compiledTasks = {};
      employeePerformance.forEach((staff) => {
        const { name, task, completedTasks, pendingTasks } = staff;
        if (!compiledTasks[name]) {
          compiledTasks[name] = { name, tasks: [{ task, completedTasks, pendingTasks }] };
        } else {
          compiledTasks[name].tasks.push({ task, completedTasks, pendingTasks });
        }
      });
      return Object.values(compiledTasks);
    };

    return (
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Staff Overview</h2>
        <div className="overflow-auto max-h-96">
          {compileTasks(staffMembers).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {compileTasks(staffMembers).map((staff, index) => (
                <div key={index} className="bg-white rounded-md shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{staff.name}</h3>
                  <div className="mb-2">
                    <table className="table-auto w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Assigned Tasks</th>
                          <th className="px-4 py-2">Pending Tasks</th>
                          <th className="px-4 py-2">Completed Tasks</th>
                        </tr>
                      </thead>
                      <tbody className='text-center'>
                        {staff.tasks.map((task, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2">
                              {task.task ? task.task : "None"}
                            </td>
                            <td className="border px-4 py-2">
                              {task.pendingTasks}
                            </td>
                            <td className="border px-4 py-2">
                              {task.completedTasks}
                            </td>
                          </tr>
                        ))}
                        {/* Total row */}
                        <tr>
                          <td className="border px-4 py-2 font-semibold">
                            Total
                          </td>
                          <td className="border px-4 py-2 font-semibold">
                            {staff.tasks.reduce((total, task) => total + parseInt(task.pendingTasks), 0)}
                          </td>
                          <td className="border px-4 py-2 font-semibold">
                            {staff.tasks.reduce((total, task) => total + parseInt(task.completedTasks), 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No staff overview available.</p>
          )}
        </div>

      </div>
    );
  };
    
  // Function to render content based on active tab...
    
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UsersContent />;
      case 'services':
        return <ServicesContent />;
      case 'booking':
        return <BookingContent />;
      case 'customer_management':
        return <CustomerManagementContent />;
      case 'staff_management':
        return <StaffManagementContent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-56 bg-dark ">
        <div className="flex items-center justify-center h-20 border-b border-light">
          <img className="w-40 h-16 object-contain m-4" src={Logo} alt="Logo" />
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {/* Sidebar links */}
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'dashboard' && 'text-primary'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                <FaTachometerAlt className="mr-2" />
                Dashboard
                {activeTab === 'dashboard' && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all rounded-r-full duration-300"
                    style={{ borderBottomWidth: '2px' }}
                  />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'users' && 'text-primary'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <FaUsers className="mr-2" />
                Users
                {activeTab === 'users' && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all duration-300"
                    style={{ borderBottomWidth: '2px' }}
                  />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'services' && 'text-primary'
                }`}
                onClick={() => setActiveTab('services')}
              >
                <FaBriefcase className="mr-2" />
                Services
                {activeTab === 'services' && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all duration-300"
                    style={{ borderBottomWidth: '2px' }}
                  />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'booking' && 'text-primary'
                }`}
                onClick={() => setActiveTab('booking')}
              >
                <FaCalendarAlt className="mr-2" />
                Booking
                {activeTab === 'booking' && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all duration-300"
                    style={{ borderBottomWidth: '2px' }}
                  />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'customer_management' && 'text-primary'
                }`}
                onClick={() => setActiveTab('customer_management')}
              >
                <FaUserFriends className="mr-2" />
                Customer Management
                {activeTab === 'customer_management' && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all duration-300"
                    style={{ borderBottomWidth: '2px' }}
                  />
                )}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-light-dark rounded-r-full relative ${
                  activeTab === 'staff_management' && 'text-primary'
                }`}
                onClick={() => setActiveTab('staff_management')}
              >
                <FaUserTie className="mr-2" />
                Staff Management
                {activeTab === 'staff_management' && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-light-dark transition-all duration-300"
                    style={{ borderBottomWidth: '2px' }}
                  />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-gray-200">
        {/* Content Header */}
        <header className="bg-light flex justify-end items-center px-4 py-2 border-b border-dark">
          <h1 className="text-xl font-bold text-dark m-4">Admin Dashboard</h1>
          <button  className="text-white px-4 py-2 bg-dark rounded-full hover:bg-light-dark transition-colors duration-300 mr-2" onClick={openPassModal}>
            Change  password
          </button>
          <button  className="text-white px-4 py-2 bg-dark rounded-full hover:bg-light-dark transition-colors duration-300" onClick={Logout}>
            Logout
          </button>
        </header>
        {alertMessage && (
          <div className="mb-4 bg-green-500 text-white py-2 px-4 ">
            {alertMessage}
          </div>
        )}
        {/* Page Content */}
        <div className="p-6">{renderContent()}</div>
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
                  {/* Add other fields here */}
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
      </main>
    </div>
  );
};

export default Admin;