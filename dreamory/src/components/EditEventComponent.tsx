import { Modal, Box, IconButton, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosResponse } from 'axios';

interface EditEventProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  eventName: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventThumbnail: File | null;
  eventId: string;
}

type EditEventData = {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  thumbnail: File | null;
  createdby: string;
};

const EditEventComponent: React.FC<EditEventProps> = ({
  isOpen,
  setIsOpen,
  eventName,
  eventLocation,
  eventStartDate,
  eventEndDate,
  eventThumbnail,
  eventId,
}) => {
  const [name, setName] = useState(eventName);
  const [location, setLocation] = useState(eventLocation);
  const [startDate, setStartDate] = useState(eventStartDate);
  const [endDate, setEndDate] = useState(eventEndDate);
  const [thumbnail, setThumbnail] = useState<File | null>(eventThumbnail);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
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
  

  const mutation = useMutation<
  AxiosResponse<any>, // Response type
  Error, // Error type
  EditEventData // Variables type
>({
  mutationFn: async (eventData: EditEventData) => {
    const formData = new FormData();
    formData.append('name', eventData.name);
    formData.append('location', eventData.location);
    formData.append('startdate', eventData.startDate);
    formData.append('enddate', eventData.endDate);
    formData.append('createdby', eventData.createdby);
    if (eventData.thumbnail) {
      formData.append('thumbnail', eventData.thumbnail); // Ensure this is a File object
    }

    return axios.post(`http://localhost:8000/api/event/update/${eventId}`, formData, {
      headers: {
        Authorization: `${user?.token}`,
        'Content-Type': 'multipart/form-data', // Ensure this header is set for file uploads
      },
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    setIsOpen(false); // Close the modal on success
  },
  onError: (err: any) => {
    setError('Failed to update event. Please try again.');
    console.error('Error updating event:', err);
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !startDate || !endDate) {
      setError('All fields are required.');
    } else {
      setError('');
      mutation.mutate({
        name,
        location,
        startDate,
        endDate,
        thumbnail,
        createdby: user?.userId || '',
      });

    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="edit-event-modal-title"
      aria-describedby="edit-event-modal-description"
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

          <Typography id="edit-event-modal-title" variant="h6" component="h2" gutterBottom>
            Edit Event
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
              <Typography>Created By</Typography>
              <TextField
                id="createdby"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.userId || ''}
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

export default EditEventComponent;
