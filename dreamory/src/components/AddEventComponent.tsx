import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface AddEventProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface FormProps {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  thumbnail: File | null;
  createdby: string;
}

const AddEventComponent: React.FC<AddEventProps> = ({ isOpen, setIsOpen }) => {
  // State for form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState('');

  const { user } = useAuth(); 

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const addEvent = async (eventData: FormProps) => {
    try {
      const formData = new FormData();

      // Append the form fields to the FormData object
      formData.append('name', eventData.name);
      formData.append('location', eventData.location);
      formData.append('startDate', eventData.startDate); 
      formData.append('endDate', eventData.endDate);
      formData.append('createdby', eventData.createdby);
      if (eventData.thumbnail) {
        formData.append('thumbnail', eventData.thumbnail);
      }

      const response = await axios.post('http://localhost:8000/api/event', formData, {
        headers: {
          Authorization: `${user?.token}`, // Add the Authorization header
          'Content-Type': 'multipart/form-data', // Specify that the content type is form data
        },
      });

      console.log('Event added successfully:', response.data);
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !startDate || !endDate || !thumbnail) {
      setError('All fields, including the thumbnail, are required');
    } else {
      setError('');
      addEvent({
        name,
        location,
        startDate,
        endDate,
        thumbnail,
        createdby: user?.userId || '',
      });
      // Reset form values after submission
      setName('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setThumbnail(null);
      handleModalClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="add-event-modal-title"
      aria-describedby="add-event-modal-description"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 1,
            boxShadow: 24,
            position: 'relative',
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

          <Typography id="add-event-modal-title" variant="h6" component="h2" gutterBottom>
            Add Event
          </Typography>

          <form onSubmit={handleSubmit} style={{ padding: '20px 0' }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                id="location"
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>Start Date</Typography>
              <TextField
                id="start-date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>End Date</Typography>
              <TextField
                id="end-date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>Thumbnail</Typography>
              <TextField
                id="thumbnail"
                variant="outlined"
                fullWidth
                margin="normal"
                type="file"
                inputProps={{ accept: 'image/*' }} // Accept image files only
                onChange={handleFileChange}
              />
              {thumbnail && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {thumbnail.name}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>Create By</Typography>
              <TextField
                id="createdby"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.userId || ''} // Set the default or dynamic value you want to display
                InputProps={{
                  readOnly: true, // Makes the field read-only
                }}
              />
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEventComponent;
