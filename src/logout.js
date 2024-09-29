import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Get the JWT token from localStorage or sessionStorage
        const token = localStorage.getItem('jwtToken');

        // Call the backend logout endpoint (optional)
        if (token) {
          await axios.post(
            'https://localhost:8081/api/users/logout',  
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        
        localStorage.removeItem('jwtToken');

        
        localStorage.removeItem('user');

        
        navigate('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;