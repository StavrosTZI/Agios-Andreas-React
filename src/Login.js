import React, { useState } from 'react';
import axios from 'axios';
import teacher from "./assets/teacher.png";
import './welcome.css';
import { useNavigate } from 'react-router-dom';

const Login = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
  
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
    const handlePasswordChange = (event) =>{
      setPassword(event.target.value);
    };
  
    const goToRegister = async(event)=>{
      navigate("/welcome");
    }
  
    const handleLogin = async (event) => {
      event.preventDefault();
      console.log('Submitting username:', username);
      console.log('Submitting password:', password);
  
      try {
        // Send a POST request to register the user
        const response = await axios.post('https://localhost:8081/api/users/login', {
          username: username, 
          password: password 
        }, {
          headers: {
            'Content-Type': 'application/json'  // Set headers for JSON request
          }
        });
  
        const token = response.data.token;
        localStorage.setItem('token', token);
        const userId=response.data.userId;
        localStorage.setItem('userId', userId);
  
        console.log('Response from backend:', response.data);
  
        // Handle the response - clear errors if successful
        setError(''); 
  
        // If the registration is successful, navigate to the next page
        if (!response.data.error) {
          navigate('/theory-part-1', { state: { myData: response.data } });
        } else {
          // If there is an error in the response, display it
          setError(response.data.error);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setError('Υπήρξε σφάλμα κατά την εγγραφή. Προσπαθήστε ξανά.');
      }
    };
  
    return (
      <div className='title'>
        <h2>Καλώς ήρθες στο μάθημα για τον ναό <br></br>του Αγίου Aνδρέα Πατρών!!</h2>
        <div className="registration-container">
          <img src={teacher} alt="Left" className="side-image left" />
          <div className="form-container">
            <h3>Συνδεθήτε με τα στοιχεία σας.</h3>
            <form onSubmit={handleLogin}>
              <label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleUsernameChange}
                />
                <input
                  type="text"
                  name="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
              </label>
              <br />
              <button type="submit">Επόμενο &#8594;</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
        <div className='change-button'>
          <h3>Δημιουργία Λογαριασμού.</h3>
          <button onClick={goToRegister}>Εγγραφή</button>
  
        </div>
      </div>
    );


};
export default Login;