const express = require('express');
const mysql = require('mysql2'); // npm install mysql2
const cors = require('cors'); // npm install cors
const multer = require('multer'); // npm install multer
const path = require('path'); // path is a built-in Node.js module, no need to install
const session = require('express-session'); // npm install express-session
const MySQLStore = require('express-mysql-session')(session); // npm install express-mysql-session
const bcrypt = require('bcrypt'); //install bcrypt using this commant 'npm install bcrypt'
const nodemailer = require('nodemailer'); // npm install nodemailer
const crypto = require('crypto'); // crypto is a built-in Node.js module, no need to install

// Setup nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vargasjestoni23@gmail.com',
    pass: 'hgra jdgz yvhn vrfm'
  }
});

const app = express();
// app.use(cors());
// Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); // Parse JSON bodies

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0511',
  database: 'spantaneous'
});

// Error handling for database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// MySQL session store configuration
const sessionStore = new MySQLStore({
  database: 'spantaneous',
  table: 'sessions',
  host: 'localhost',
  user: 'root',
  password: '0511',
  expiration: 86400000, // Session expiration time in milliseconds
  createDatabaseTable: true, // Automatically create sessions table if not exists
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, connection);

// Log session store configuration
console.log('Session store configuration:', sessionStore.options);

// Error handling for session store initialization
sessionStore.on('error', (error) => {
  console.error('Session store error:', error);
});

// Configure session middleware
app.use(session({
  secret: 'you-always-on-my-mind',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false, // Set to true if using HTTPS
    httpOnly: true // Prevents client-side access to the cookie
  }
}));

// Error handling middleware for Express
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  const sql = 'SELECT * FROM users WHERE (username = ? OR email = ?)';
  connection.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length > 0) {
      const user = results[0];
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          // Generate OTP
          const otp = crypto.randomInt(100000, 999999).toString();
          req.session.otp = otp;
          req.session.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
          req.session.userId = user.user_id; // Store user ID in session
          req.session.email = user.email; // Store email in session

          // Send OTP via email
          const mailOptions = {
            from: 'vargasjestoni23@gmail.com',
            to: user.email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              return res.status(500).json({ success: false, message: 'Error sending OTP' });
            } else {
              console.log('Email sent:', info.response);
              return res.json({ success: true, message: 'OTP sent to email' });
            }
          });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid password' });
        }
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
  });
});

app.post('/verify-otp', (req, res) => {
  const { otp } = req.body;

  // Log the received OTP
  console.log('Received OTP:', otp);
  
  if (req.session.otp === otp && Date.now() < req.session.otpExpires) {
    req.session.user = { user_id: req.session.userId }; // Set user session
    return res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
});

app.post('/resend-otp', (req, res) => {
  if (!req.session.otp || !req.session.email) {
    return res.status(400).json({ success: false, message: 'No OTP request found' });
  }

  // Generate new OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  req.session.otp = otp;
  req.session.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  // Send OTP via email
  const mailOptions = {
    from: 'vargasjestoni23@gmail.com',
    to: req.session.email, // Use stored email
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Error sending OTP' });
    } else {
      console.log('Email sent:', info.response);
      return res.json({ success: true, message: 'OTP resent to email' });
    }
  });
});


// Endpoint for checking login status
app.get('/check-login', (req, res) => {
  // Retrieve session data from the database
  sessionStore.get(req.sessionID, (err, session) => {
    if (err) {
      console.error('Error fetching session from database:', err);
      return res.status(500).json({ isLoggedIn: false, error: 'Internal server error' });
    }

    // Check if session exists and has user data
    if (session && session.user) {
      // User is logged in
      return res.status(200).json({ isLoggedIn: true, user: session.user });
    } else {
      // Session not found or user not logged in
      return res.status(200).json({ isLoggedIn: false });
    }
  });
});

// Endpoint to get userData from users table based on user_id
app.get('/get-userData', (req, res) => {
  // Check if user is logged in and session contains user_id
  if (req.session.user && req.session.user.user_id) {
    const userId = req.session.user.user_id;
    const sql = 'SELECT user_id, Fname, Lname, username, contact, email FROM users WHERE user_id = ?';

    connection.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (results.length > 0) {
        const userData = results[0];
        return res.json({ success: true, userData });
      } else {
        return res.status(404).json({ success: false, message: 'User data not found' });
      }
    });
  } else {
    // If user is not authenticated or session user_id is not set
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
});

// Endpoint for updating user profile
app.put('/update-profile', async (req, res) => {
  try {
    // Retrieve updated user profile data from the request body
    const { user_id, Fname, Lname, username, email, contact } = req.body;

    //console.log('Received Updated Profile request:', req.body);

    // Update the user profile in the database
    const sql = 'UPDATE users SET Fname = ?, Lname = ?, username = ?, email = ?, contact = ? WHERE user_id = ?';
    connection.query(sql, [Fname, Lname, username, email, contact, user_id], (err, results) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Check if the user profile was successfully updated
      if (results.affectedRows > 0) {
        return res.json({ success: true, message: 'Profile updated successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint for updating user password
app.put('/update-password', async (req, res) => {
  try {
    // Retrieve updated user password data from the request body
    const { user_id, currentPassword, newPassword, confirmNewPassword } = req.body;

    console.log('Received Updated Password request:', req.body);

    // Check if newPassword and confirmPassword are equal
    if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match or are empty" });
    }

    // Fetch the hashed password of the user from the database
    const sql = 'SELECT password FROM users WHERE user_id = ?';
    connection.query(sql, [user_id], async (err, results) => {
      if (err) {
        console.error('Error fetching user password:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user password in the database
      const updateSql = 'UPDATE users SET password = ? WHERE user_id = ?';
      connection.query(updateSql, [hashedPassword, user_id], (err, updateResults) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (updateResults.affectedRows > 0) {
          return res.json({ success: true, message: 'Password Changed Successfully' });
        } else {
          return res.status(500).json({ success: false, message: 'Failed to update password' });
        }
      });
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Signup Endpoint with OTP
app.post('/signup', async (req, res) => {
  const { username, password, firstName, lastName, phone, email } = req.body;

  // Log the received signup data
  console.log('Signup data received:', { username, firstName, lastName, phone, email });

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  req.session.otp = otp;
  req.session.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
  req.session.signupData = { username, password, firstName, lastName, phone, email }; // Store signup data in session
  req.session.email = email;

  // Send OTP via email
  const mailOptions = {
    from: 'vargasjestoni23@gmail.com',
    to: email,
    subject: 'Your OTP Code for Signup',
    text: `Your OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Error sending OTP' });
    } else {
      console.log('Email sent:', info.response);
      return res.json({ success: true, message: 'Signup initiated. OTP sent to email' });
    }
  });
});

// Verify Signup OTP and Complete Signup
app.post('/verify-signup-otp', async (req, res) => {
  const { otp } = req.body;

  // Log the received OTP
  console.log('Received OTP for signup:', otp);

  if (req.session.otp === otp && Date.now() < req.session.otpExpires) {
    const { username, password, firstName, lastName, phone, email } = req.session.signupData;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (username, password, Fname, Lname, contact, email) VALUES (?, ?, ?, ?, ?, ?)';

      connection.query(sql, [username, hashedPassword, firstName, lastName, phone, email], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
        }

        req.session.user = { user_id: results.insertId }; // Set user session
        // req.session.userId = results.insertId; // Store user ID in session
        // Clear OTP and session data
        req.session.otp = null;
        req.session.otpExpires = null;
        req.session.signupData = null;

        return res.json({ success: true, message: 'OTP verified successfully. Signup complete.' });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ success: false, message: 'Error hashing password' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
});


app.post('/resend-signup-otp', (req, res) => {
  if (!req.session.otp || !req.session.email) {
    return res.status(400).json({ success: false, message: 'No OTP request found' });
  }

  // Generate new OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  req.session.otp = otp;
  req.session.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  // Send OTP via email
  const mailOptions = {
    from: 'vargasjestoni23@gmail.com',
    to: req.session.email, // Use stored email
    subject: 'Your OTP Code for Signup',
    text: `Your new OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Error sending OTP' });
    } else {
      console.log('Email sent:', info.response);
      return res.json({ success: true, message: 'OTP resent to email' });
    }
  });
});

// Endpoint for user logout
app.post('/logout', (req, res) => {
  // Check if user session exists
  if (req.session.user) {
    // Remove user data from the session
    delete req.session.user;
  } 

  // Check if both admin and user sessions are zero
  if (!req.session.admin && !req.session.user && !req.session.employee) {
    // Destroy the session in the database using the session ID
    sessionStore.destroy(req.sessionID, (err) => {
      if (err) {
        console.error('Error destroying session in database:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      res.clearCookie('connect.sid');

      // Destroy the session on the server
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        // Session destroyed successfully
        return res.json({ success: true, message: 'Admin logout successful, session destroyed' });
      });
    });
  } else {
    // If either admin or user session exists, respond with success message
    return res.json({ success: true, message: 'Logout successful' });
  }

});

// Admin Login Endpoint
app.post('/admin/login', (req, res) => {
  const { identifier, password } = req.body; // Use 'identifier' to accept either username or email
  const sql = 'SELECT * FROM admin WHERE (username = ? OR email = ?)'; // Update SQL query to retrieve admin by username or email
  connection.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length > 0) {
      const admin = results[0];
      try {
        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (passwordMatch) {
          // Set admin data in the session upon successful login
          req.session.admin = {
            admin_id: admin.admin_id
          };
          console.log('Admin logged in:', req.session.admin);
          return res.json({ success: true, message: 'Admin login successful' });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid password' });
        }
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
  });
});

// Endpoint for checking login status
app.get('/admin/check-login', (req, res) => {
  // Retrieve session data from the database
  sessionStore.get(req.sessionID, (err, session) => {
    if (err) {
      console.error('Error fetching session from database:', err);
      return res.status(500).json({ isLoggedIn: false, error: 'Internal server error' });
    }

    // Check if session exists and has user data
    if (session && session.admin) {
      // User is logged in
      return res.status(200).json({ isLoggedIn: true, admin: session.admin });
    } else {
      // Session not found or user not logged in
      return res.status(200).json({ isLoggedIn: false });
    }
  });
});

// Endpoint for updating user password
app.put('/admin/update-password', async (req, res) => {
  try {
    // Retrieve updated user password data from the request body
    const { admin_id, currentPassword, newPassword, confirmNewPassword } = req.body;

    console.log('Received Updated Password request:', req.body);

    // Check if newPassword and confirmPassword are equal
    if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match or are empty" });
    }

    // Fetch the hashed password of the user from the database
    const sql = 'SELECT password FROM admin WHERE admin_id = ?';
    connection.query(sql, [admin_id], async (err, results) => {
      if (err) {
        console.error('Error fetching user password:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user password in the database
      const updateSql = 'UPDATE admin SET password = ? WHERE admin_id = ?';
      connection.query(updateSql, [hashedPassword, admin_id], (err, updateResults) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (updateResults.affectedRows > 0) {
          return res.json({ success: true, message: 'Password Changed Successfully' });
        } else {
          return res.status(500).json({ success: false, message: 'Failed to update password' });
        }
      });
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin Logout Endpoint
app.post('/admin/logout', (req, res) => {
  // Check if admin session exists
  if (req.session.admin) {
    // Remove admin data from the session
    delete req.session.admin;
  } 
  
  // Check if both admin and user sessions are zero
  if (!req.session.admin && !req.session.user && !req.session.employee) {
    // Destroy the session in the database using the session ID
    sessionStore.destroy(req.sessionID, (err) => {
      if (err) {
        console.error('Error destroying session in database:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      
      res.clearCookie('connect.sid');

      // Destroy the session on the server
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        // Session destroyed successfully
        return res.json({ success: true, message: 'Admin logout successful, session destroyed' });
      });
    });
  } else {
    // If either admin or user session exists, respond with success message
    return res.json({ success: true, message: 'Logout successful' });
  }
});

// Employee Login Endpoint
app.post('/employee/login', (req, res) => {
  const { identifier, password } = req.body; // Use 'identifier' to accept either username or email
  const sql = 'SELECT * FROM employee WHERE (username = ? OR email = ?)'; // Update SQL query to retrieve admin by username or email
  connection.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.length > 0) {
      const employee = results[0];
      try {
        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, employee.password);
        if (passwordMatch) {
          // Set admin data in the session upon successful login
          req.session.employee = {
            employee_id: employee.employee_id
          };
          console.log('Employee logged in:', req.session.employee);
          return res.json({ success: true, message: 'Employee login successful' });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid password' });
        }
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
  });
});

// Endpoint for checking login status
app.get('/employee/check-login', (req, res) => {
  // Retrieve session data from the database
  sessionStore.get(req.sessionID, (err, session) => {
    if (err) {
      console.error('Error fetching session from database:', err);
      return res.status(500).json({ isLoggedIn: false, error: 'Internal server error' });
    }

    // Check if session exists and has user data
    if (session && session.employee) {
      // User is logged in
      return res.status(200).json({ isLoggedIn: true, employee: session.employee });
    } else {
      // Session not found or user not logged in
      return res.status(200).json({ isLoggedIn: false });
    }
  });
});

// Endpoint to get userData from users table based on user_id
app.get('/get-employeeData', (req, res) => {
  // Check if employee is logged in and session contains employee_id
  if (req.session.employee && req.session.employee.employee_id) {
    const employeeId = req.session.employee.employee_id;
    const sql = 'SELECT employee_id, Fname, Lname, username, contact, email FROM employee WHERE employee_id = ?';

    connection.query(sql, [employeeId], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (results.length > 0) {
        const employeeData = results[0];
        return res.json({ success: true, employeeData });
      } else {
        return res.status(404).json({ success: false, message: 'Employee data not found' });
      }
    });
  } else {
    // If user is not authenticated or session user_id is not set
    return res.status(401).json({ success: false, message: 'Employee not authenticated' });
  }
});

// Endpoint for updating user profile
app.put('/update-employee', async (req, res) => {
  try {
    // Retrieve updated user profile data from the request body
    const { employee_id, Fname, Lname, username, email, contact } = req.body;

    //console.log('Received Updated Profile request:', req.body);

    // Update the user profile in the database
    const sql = 'UPDATE employee SET Fname = ?, Lname = ?, username = ?, email = ?, contact = ? WHERE employee_id = ?';
    connection.query(sql, [Fname, Lname, username, email, contact, employee_id], (err, results) => {
      if (err) {
        console.error('Error updating employee profile:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Check if the user profile was successfully updated
      if (results.affectedRows > 0) {
        return res.json({ success: true, message: 'Employee Profile updated successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'employee not found' });
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint for updating user password
app.put('/employee/update-password', async (req, res) => {
  try {
    // Retrieve updated user password data from the request body
    const { employee_id, currentPassword, newPassword, confirmNewPassword } = req.body;

    console.log('Received Updated Password request:', req.body);

    // Check if newPassword and confirmPassword are equal
    if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match or are empty" });
    }

    // Fetch the hashed password of the user from the database
    const sql = 'SELECT password FROM employee WHERE employee_id = ?';
    connection.query(sql, [employee_id], async (err, results) => {
      if (err) {
        console.error('Error fetching user password:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user password in the database
      const updateSql = 'UPDATE employee SET password = ? WHERE employee_id = ?';
      connection.query(updateSql, [hashedPassword, employee_id], (err, updateResults) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (updateResults.affectedRows > 0) {
          return res.json({ success: true, message: 'Password Changed Successfully' });
        } else {
          return res.status(500).json({ success: false, message: 'Failed to update password' });
        }
      });
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Employee Signup Endpoint
app.post('/employee/signup', async (req, res) => {
  const { username, password, firstName, lastName, phone, email } = req.body;

  //console.log('Received signup request:', req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO employee (username, password, Fname, Lname, contact, email) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [username, hashedPassword, firstName, lastName, phone, email], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
      }

      console.log('Signup successful. Affected rows:', results.affectedRows);

      // Return a success response
      return res.json({ success: true, message: 'Signup successful' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ success: false, message: 'Error hashing password' });
  }
});

// Employee Logout Endpoint
app.post('/employee/logout', (req, res) => {
  // Check if admin session exists
  if (req.session.employee) {
    // Remove admin data from the session
    delete req.session.employee;
  } 
  
  // Check if both admin and user sessions are zero
  if (!req.session.admin && !req.session.user && !req.session.employee) {
    // Destroy the session in the database using the session ID
    sessionStore.destroy(req.sessionID, (err) => {
      if (err) {
        console.error('Error destroying session in database:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      
      res.clearCookie('connect.sid');

      // Destroy the session on the server
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        // Session destroyed successfully
        return res.json({ success: true, message: 'Admin logout successful, session destroyed' });
      });
    });
  } else {
    // If either admin or user session exists, respond with success message
    return res.json({ success: true, message: 'Logout successful' });
  }
});

// Endpoint for revenue
app.get('/admin/revenue', (req, res) => {
  //SQL query to select all revenue
  const sql = ' SELECT * FROM revenue';

  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Send the list of users as the response
    return res.json({ success: true, revenue: results });
  });
});

// Endpoint for admin list of client
app.get('/clients', (req, res) => {
  // SQL query to select all users
  const sql = 'SELECT * FROM users';

  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Send the list of users as the response
    return res.json({ success: true, users: results });
  });
});

// Endpoint for admin list of employee
app.get('/employees', (req, res) => {
  // SQL query to select all users
  const sql = 'SELECT * FROM employee';

  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Send the list of users as the response
    return res.json({ success: true, users: results });
  });
});

// Endpoint to delete a client by ID
app.delete('/clients/:id', (req, res) => {
  const clientId = req.params.id;
  const sql = 'DELETE FROM users WHERE user_id = ?';
  connection.query(sql, [clientId], (error, results) => {
    if (error) {
      console.error('Error deleting client:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete client' });
    }
    if (results.affectedRows === 0) {
      // No client found with the given ID
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    return res.json({ success: true, message: 'Client deleted successfully' });
  });
});

// Endpoint to delete an employee by ID
app.delete('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const sql = 'DELETE FROM employee WHERE employee_id = ?';
  connection.query(sql, [employeeId], (error, results) => {
    if (error) {
      console.error('Error deleting employee:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete employee' });
    }
    if (results.affectedRows === 0) {
      // No employee found with the given ID
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    return res.json({ success: true, message: 'Employee deleted successfully' });
  });
});

// Endpoint to get all services
app.get('/services', (req, res) => {
  const sql = 'SELECT * FROM services'; 
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Initialize an empty object to store categorized services
    const categorizedServices = {
      'All': [],
      'Massage': [],
      'Facial': [],
      'Nail Treatment': [],
      'Body Treatment': [],
      'Packages': []
    };
    // Iterate over the results and push each service into the corresponding category
    results.forEach(service => {
      // Create a copy of the service object to avoid modifying the original object
      const categorizedService = { ...service };
      // Initialize the category array if it's not already initialized
      if (!categorizedServices[service.category]) {
        categorizedServices[service.category] = [];
      }
      // Push the service into the corresponding category
      categorizedServices[service.category].push(categorizedService);
      // Also push each service into the 'All' category
      categorizedServices['All'].push(categorizedService);
    });
    
    // Send the categorized services data as the response
    return res.json({ success: true, services: categorizedServices });
  });
});

// Multer configuration for storing uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Endpoint for uploading images
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Return the file path or URL
  return res.json({ success: true, imagePath: req.file.path });
});

// Endpoint for creating a new service with an image
app.post('/services', upload.single('image'), (req, res) => {
  // Extract service data from request body
  const { service_name, description, price, category, image, image_path } = req.body;

  if (service_name === '' || description === '' ||  description === '' ||  category === ''){
    return res.status(500).json({ success: false, message: 'No field should not be empty.' });
  }
  // Insert service data into the database
  const sql = 'INSERT INTO services (service_name, description, price, category, image, image_path) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [service_name, description, price, category, image, image_path], (err, results) => {
    if (err) {
      console.error('Error creating service:', err);
      return res.status(500).json({ success: false, message: 'Failed to create service' });
    }
    return res.json({ success: true, message: 'Service created successfully' });
  });
});

// Endpoint for updating service
app.put('/services/:id', upload.single('image'), (req, res) => {
  //console.log(req.file); // Log the file upload object
  console.log(req.body); // Log the request body

  const serviceId = req.params.id;
  // Extract updated service data from request body
  const { service_name, description, price, category, image, image_path} = req.body;

  // Update service data in the database
  let sql;
  let params;

  sql = 'UPDATE services SET service_name = ?, description = ?, price = ?, category = ?, image = ?, image_path = ? WHERE service_id = ?';
  params = [service_name, description, price, category, image, image_path, serviceId];

  console.log(sql, params); // Log SQL query and params for debugging

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ success: false, message: 'Failed to update service' });
    }
    if (results.affectedRows === 0) {
      // No service found with the given ID
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, message: 'Service updated successfully' });
  });
});

const fs = require('fs');
const { connect } = require('http2');

// Endpoint for deleting a service by ID
app.delete('/services/:id', (req, res) => {
  const serviceId = req.params.id;

  // Get the image path from the database before deleting the service
  const sqlSelectImagePath = 'SELECT image_path FROM services WHERE service_id = ?';
  connection.query(sqlSelectImagePath, [serviceId], (err, results) => {
    if (err) {
      console.error('Error selecting image path:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    // Delete the image file from the folder
    const imagePath = results[0].image_path;
    if (imagePath) {
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting image file:', unlinkErr);
          // Continue with deleting the service even if there's an error deleting the image
        }
        
        // Delete service from the database after removing the image file
        const sqlDeleteService = 'DELETE FROM services WHERE service_id = ?';
        connection.query(sqlDeleteService, [serviceId], (deleteErr, deleteResults) => {
          if (deleteErr) {
            console.error('Error deleting service:', deleteErr);
            return res.status(500).json({ success: false, message: 'Failed to delete service' });
          }
          if (deleteResults.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Service not found' });
          }
          return res.json({ success: true, message: 'Service deleted successfully' });
        });
      });
    } else {
      // If the service does not have an image, just delete the service from the database
      const sqlDeleteService = 'DELETE FROM services WHERE service_id = ?';
      connection.query(sqlDeleteService, [serviceId], (deleteErr, deleteResults) => {
        if (deleteErr) {
          console.error('Error deleting service:', deleteErr);
          return res.status(500).json({ success: false, message: 'Failed to delete service' });
        }
        if (deleteResults.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }
        return res.json({ success: true, message: 'Service deleted successfully' });
      });
    }
  });
});

// Endpoint to fetch appointments
app.get('/appointments', (req, res) => {
  // SQL query to join appointments, users, and services tables to get relevant data
  const sql = `
    SELECT 
      appointments.appointment_id,
      appointments.customer_id,
      users.username,
      CONCAT(
        UPPER(SUBSTRING(users.Fname, 1, 1)),
        LOWER(SUBSTRING(users.Fname, 2)),
        ' ',
        UPPER(SUBSTRING(users.Lname, 1, 1)),
        LOWER(SUBSTRING(users.Lname, 2))
      ) AS name,
      users.email,
      users.contact,
      services.service_name AS service,
      services.category,
      appointments.date_appointed,
      appointments.message,
      services.price AS price_final,
      appointments.request_status,
      appointments.appointment_status,
      appointments.payment_status
    FROM 
      appointments
    INNER JOIN 
      users ON appointments.customer_id = users.user_id
    INNER JOIN 
      services ON appointments.service_booked = services.service_id
    ORDER BY appointments.payment_status
  `;
  
  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Send the list of appointments as the response
    return res.json({ success: true, appointments: results });
  });
});

// Endpoint to add an appointment
app.post('/set-appointment', async (req, res) => {
  const { date, time, customer_id, service_id, message } = req.body;

  console.log('Received appointment request:', req.body);
 
  // Combine date and time into a single Date object
  const date_appointed = new Date(`${date} ${time}`);

  const sql = `INSERT INTO appointments (date_appointed, customer_id, service_booked, message) VALUES (?, ?, ?, ?)`;

  connection.query(sql, [date_appointed, customer_id, service_id, message], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server', error: err.message });
    }

    console.log('Appointment sent successfully. Affected rows:', results.affectedRows);

    return res.json({ success: true, message: 'Appointment sent successfully' });
  });
});

// Endpoint to fetch assignedEmployee
app.get('/assigned_employee', (req, res) => {
  // SQL query to join appointments, users, and services tables to get relevant data
  const sql = `
    SELECT 
      appointments.appointment_id,
      users.username,
      CONCAT(
        UPPER(SUBSTRING(users.Fname, 1, 1)),
        LOWER(SUBSTRING(users.Fname, 2)),
        ' ',
        UPPER(SUBSTRING(users.Lname, 1, 1)),
        LOWER(SUBSTRING(users.Lname, 2))
      ) AS name,
      users.email,
      users.contact,
      services.service_name AS service,
      appointments.date_appointed,
      appointments.request_status,
      appointments.appointment_status,
      appointments.payment_status,
      assigned_employee.employee_id,
      CONCAT(
        UPPER(SUBSTRING(employee.Fname, 1, 1)),
        LOWER(SUBSTRING(employee.Fname, 2)),
        ' ',
        UPPER(SUBSTRING(employee.Lname, 1, 1)),
        LOWER(SUBSTRING(employee.Lname, 2))
      ) AS assignedEmployee
    FROM 
      appointments
    INNER JOIN 
      users ON appointments.customer_id = users.user_id
    INNER JOIN 
      services ON appointments.service_booked = services.service_id
    INNER JOIN
      assigned_employee ON appointments.appointment_id = assigned_employee.appointment_id
    INNER JOIN
      employee ON assigned_employee.employee_id = employee.employee_id
    ORDER BY appointments.payment_status
  `;

  
  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Send the list of appointments as the response
    return res.json({ success: true, appointments: results });
  });
});

// Endpoint to handle POST requests for assigning employees
app.post('/assigned-employees', (req, res) => {
  // Extract data from the request body
  const { employee_id, appointment_id, status } = req.body;

  console.log('Received assidned-employee request:', req.body);
  // SQL query to insert data into the assigned_employee table
  const sql = `
    INSERT INTO assigned_employee (employee_id, appointment_id, status)
    VALUES (?, ?, ?)
  `;

  // Execute the SQL query
  connection.query(sql, [employee_id, appointment_id, status], (err, results) => {
    if (err) {
      console.error('Error assigning employee:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Check if the assignment was successful
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee assignment failed' });
    }
    // Send success response

    return res.json({ success: true, message: 'Employee assigned successfully' });
  });
});
 

// Endpoint to set request status of appointments to 3 for declined appointment
app.put('/appointments/:appointmentId/request-status', (req, res) => {
  const { appointmentId } = req.params;
  const { request_status } = req.body;

  // Validate input
  if (typeof request_status !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid request status' });
  }

  // SQL query to update request status
  const sql = `
    UPDATE appointments
    SET request_status = ?
    WHERE appointment_id = ?
  `;

  // Execute the SQL query
  connection.query(sql, [request_status, appointmentId], (err, results) => {
    if (err) {
      //console.error('Error updating request status:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Check if the appointment was found and updated
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    // Send success response
    return res.json({ success: true, message: 'Request status updated successfully' });
  });
});

// Endpoint to set appointment status of appointments to 1 for completed appointment
app.put('/appointments/:appointmentId/appointment-status', (req, res) => {
  const { appointmentId } = req.params;
  const { appointment_status } = req.body;

  // Validate input
  if (typeof appointment_status !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid request status' });
  }

  // SQL query to update request status
  const sql = `
    UPDATE appointments
    SET appointment_status = ?
    WHERE appointment_id = ?
  `;

  // Execute the SQL query
  connection.query(sql, [appointment_status, appointmentId], (err, results) => {
    if (err) {
      //console.error('Error updating request status:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Check if the appointment was found and updated
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    // Send success response
    return res.json({ success: true, message: 'Request status updated successfully' });
  });
});

// Endpoint to update payment status of appointments
app.put('/appointments/:appointmentId/payment-status', (req, res) => {
  const { appointmentId } = req.params;
  const { payment_status } = req.body;

  // Validate input
  if (typeof payment_status !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid payment status' });
  }

  // SQL query to update payment status
  const sql = `
    UPDATE appointments
    SET payment_status = ?
    WHERE appointment_id = ?
  `;

  // Execute the SQL query
  connection.query(sql, [payment_status, appointmentId], (err, results) => {
    if (err) {
      //console.error('Error updating payment status:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    // Check if the appointment was found and updated
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    // Send success response
    return res.json({ success: true, message: 'Payment status updated successfully' });
  });
});


// Endpoint for booking appointments
app.post('/bookings', (req, res) => {
  // Extract booking data from request body
  const { name, email, phone, service, date, time, message } = req.body;

  // Insert booking data into the database
  const sql = 'INSERT INTO appointments (name, email, phone, service, date, time, message) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, email, phone, service, date, time, message], (err, results) => {
    if (err) {
      console.error('Error creating appointment:', err);
      return res.status(500).json({ success: false, message: 'Failed to create appointment' });
    }
    return res.json({ success: true, message: 'Appointment booked successfully' });
  });
});

// End point for getting the list of the staffs with their taks
app.get('/staffs', (req, res) => {
  // SQL query to select all the users from the emplyoee and the task done in the assigned_emmployee table
  const sql = `
    SELECT 
      e.employee_id AS employee_id,
      CONCAT(
          UPPER(SUBSTRING(e.Fname, 1, 1)),
          LOWER(SUBSTRING(e.Fname, 2)),
          ' ',
          UPPER(SUBSTRING(e.Lname, 1, 1)),
          LOWER(SUBSTRING(e.Lname, 2))
      ) AS name,
      s.category AS task,
      a.date_appointed AS sched,
      COALESCE(SUM(ae.status = 1), 0) AS completedTasks,
      COALESCE(SUM(ae.status = 0), 0) AS pendingTasks
    FROM
      employee e
    LEFT JOIN
      assigned_employee ae ON e.employee_id = ae.employee_id
    LEFT JOIN
      appointments a ON a.appointment_id = ae.appointment_id
    LEFT JOIN
      services s ON s.service_id = a.service_booked
    GROUP BY
      employee_id,
      name,
      task,
      sched
    `;

    // Execute the SQL query
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ success: false, message: 'Internal server error'});
      }
      // Send the list of the staffs with their task done as the response
      return res.json({ success: true, staffs: results})
    });  
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
