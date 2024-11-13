const UserRepository = require('./UserRepository');
const bcrypt = require('bcryptjs');
const axios = require('axios');

class UserService {
  async register(userData) {
    // Validate user request data
    // const { error } = validateRegisterRequest(userData);
    // if (error) {
    //   throw new Error(error.details[0].message);
    // }

    // Check if the user already exists
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create a new user
    const newUser = {
      ...userData,
      password: hashedPassword,
      isVerified: false,
      createAt: Date.now,
    };

    const user = await UserRepository.create(newUser);
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP email via EmailService
    fetch('http://172.18.0.2:3001/charitan/api/v1/send/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add other necessary headers, e.g., authorization
      },
      body: JSON.stringify({
        receiver: user.email,
        OTP: OTP
      }),
      credentials: 'include' // If required by your API
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('OTP email sent successfully', data);
    })
    .catch(error => {
      console.error('Error sending OTP email:', error);
    });

    return { user: user, OTP: OTP };
  }

  async verifyUser(id) {
    return await UserRepository.update(id, { isVerified: 'true' });
  }

  async isVerified(id) {
    return await UserRepository.isVerified(id);
  }

  async login(email, password, res) {
    // Find the user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not Found');
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return {
      id: user.id,
      role: user.role
    };
  }

  async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();