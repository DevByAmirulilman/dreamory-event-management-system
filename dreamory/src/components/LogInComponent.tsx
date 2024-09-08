import { Box, Modal, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface LogInComponentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const LogInComponent: React.FC<LogInComponentProps> = ({ isOpen, setIsOpen }) => {
    const { user, login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleModalClose = () => {
    setIsOpen(false);
  };

  // Clear error when email or password changes
  useEffect(() => {
    setError('');
    console.log({user})
  }, [email, password]);

  const loginUser = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password,
      });

      // Handle login errors from the server
      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Handle successful login
        console.log('Login successful:', response.data);
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
            Log In
          </Typography>
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
            onClick={loginUser}
            fullWidth
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LogInComponent;
