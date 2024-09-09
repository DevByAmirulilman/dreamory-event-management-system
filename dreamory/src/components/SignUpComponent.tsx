import { Modal, Box, IconButton, Typography, TextField, Button } from '@mui/material'
import { error } from 'console'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface SignUpComponentProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }
  

const SignUpComponent : React.FC<SignUpComponentProps> = ({ isOpen, setIsOpen }) => {
    const { user, login } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name,setName] = useState('')
    const [error, setError] = useState('');

    const handleModalClose = () => {
        setIsOpen(false);
      };
    
      const SignUp = async () => {
        if (!email || !password || !name) {
          setError('Email and password are required');
          return;
        }
    
        try {
          const response = await axios.post('http://localhost:8000/api/register', {
            name:name,
            email: email,
            password: password,
          });
    
          // Handle login errors from the server
          if (response.data.error) {
            setError(response.data.error);
          } else {
            // Handle successful login
            console.log('Sign Up successful:', response.data);
            const {token,user} = response.data
            login(user.name,token,user.userId)
            handleModalClose(); // Close modal on successful login
          }
        } catch (err) {
          // Handle request errors
          setError('An error occurred during login. Please try again.');
          console.error(err);
        }
      };
    

  return (
    <Modal
    open={isOpen}
    onClose={handleModalClose}
    aria-labelledby="login-modal-title"
    aria-describedby="login-modal-description"
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Full viewport height
      }}
    >
      <Box
        sx={{
          width: 400,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 1,
          boxShadow: 24,
          position: 'relative', // For positioning the close button
        }}
      >
        <IconButton
          onClick={handleModalClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="login-modal-title" variant="h6" component="h2" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          onChange={e => setName(e.target.value)}
          id="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
        />
        <TextField
          onChange={e => setEmail(e.target.value)}
          id="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
        />
        <TextField
          onChange={e => setPassword(e.target.value)}
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
        />
        {error && (
          <Typography color="error" variant="body2" mt={2}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={SignUp}
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  </Modal>
  )
}

export default SignUpComponent
