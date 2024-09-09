import { Modal, Box, IconButton, Typography, TextField, Button } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

interface DetailsEventProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  eventName: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventThumbnail: string | null;
  eventId: string;
}

const DetailsComponent: React.FC<DetailsEventProps> = ({
  isOpen,
  setIsOpen,
  eventName,
  eventLocation,
  eventStartDate,
  eventEndDate,
  eventThumbnail,
  eventId,
}) => {
  const { user } = useAuth();

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="event-details-modal-title"
      aria-describedby="event-details-modal-description"
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

          <Typography id="event-details-modal-title" variant="h6" component="h2" gutterBottom>
            Event Details
          </Typography>

          <form style={{ padding: '20px 0' }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                disabled
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={eventName}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                disabled
                id="location"
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                value={eventLocation}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>Start Date</Typography>
              <TextField
                disabled
                id="start-date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={eventStartDate}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>End Date</Typography>
              <TextField
                disabled
                id="end-date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={eventEndDate}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>Thumbnail</Typography>
              {eventThumbnail ? (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={eventThumbnail}
                    alt="Event Thumbnail"
                    style={{ maxWidth: '100%', height: 'auto', margin: '10px 0' }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No thumbnail available
                </Typography>
              )}
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetailsComponent;
