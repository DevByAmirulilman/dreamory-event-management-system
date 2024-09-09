import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, TextField, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import EditEventComponent from './EditEventComponent';
import { useAuth } from '../context/AuthContext';
import DetailsComponent from './DetailsComponent';

const fetchEvents = async () => {
  const response = await axios.get('http://localhost:8000/api/events');
  const events = response.data;

  // Fetch thumbnails in parallel for each event
  const eventsWithThumbnails = await Promise.all(
    events.map(async (event: any) => {
      try {
        const thumbnailResponse = await axios.get(`http://localhost:8000/api/event/thumbnail/${event._id}`, {
          responseType: 'blob', // Ensure the response type is blob for binary data
        });

        const thumbnailUrl = URL.createObjectURL(thumbnailResponse.data); // Convert Blob to Object URL

        return { ...event, thumbnail: thumbnailUrl };
      } catch (error) {
        console.error(`Error fetching thumbnail for event ${event._id}:`, error);
        return { ...event, thumbnail: null }; // Handle error case
      }
    })
  );

  return eventsWithThumbnails;
};

const ThumbnailGallery = () => {
  const queryClient = useQueryClient();
  const [openEventDetails, setOpenEventDetails] = useState<any>(null);
  const [openEvent, setOpenEvent] = useState<any>(null);
  const { user } = useAuth();
  
  // Filters
  const [filters, setFilters] = useState({
    name: '',
    location: '',
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return axios.delete(`http://localhost:8000/api/event/${eventId}`, {
        headers: {
          Authorization: `${user?.token}`, // Use the token from the auth context
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err: any) => {
      console.error('Error deleting event:', err);
    },
  });

  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredData = data?.filter((event: any) => {
    return (
      (filters.name === '' || event.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.location === '' || event.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  }) || []; 
  
 
  useEffect(() => {
    return () => {
      if (data) {
        data.forEach((event: any) => {
          if (event.thumbnail) {
            URL.revokeObjectURL(event.thumbnail);
          }
        });
      }
    };
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading events: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>No events found</div>;
  }
  console.log(data)

  return (
    <>
      {/* Filter Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
        <TextField
          name="name"
          label="Filter by Name"
          variant="outlined"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <TextField
          name="location"
          label="Filter by Location"
          variant="outlined"
          value={filters.location}
          onChange={handleFilterChange}
        />
      </Box>

      <Grid container spacing={3} justifyContent="center" marginTop={3}>
        {filteredData.map((res: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card onClick={() => user.token.length > 0 ? console.log('admin'):setOpenEventDetails(res)}>
              <CardMedia
                component="img"
                height="150"
                image={res.thumbnail} // Use placeholder if no thumbnail
                alt={res.title}
              />
              <CardContent>
                <Typography variant="subtitle1" align="center">
                  {res.name}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  {res.location}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Start Date: {format(new Date(res.startdate), "MM/dd/yyyy")}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  End Date: {format(new Date(res.enddate), "MM/dd/yyyy")}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Status: {res.status}
                </Typography>
              </CardContent>
              {
                user.token.length > 0 ? 
                <CardActions>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button onClick={() => setOpenEvent(res)}>Edit</Button>
                  <Button onClick={() => handleDeleteEvent(res._id)} style={{ color: 'red' }}>
                    Delete
                  </Button>
                </Box>
              </CardActions>
              :
              <CardActions>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {/* Disabled buttons for guests */}
              </Box>
              </CardActions>
              }
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {openEventDetails && (
        <DetailsComponent
          isOpen={!!openEventDetails}
          setIsOpen={() => setOpenEventDetails(null)}
          eventName={openEventDetails.name}
          eventLocation={openEventDetails.location}
          eventEndDate={format(new Date(openEventDetails.enddate), "yyyy-MM-dd")}
          eventStartDate={format(new Date(openEventDetails.startdate), "yyyy-MM-dd")}
          eventThumbnail={openEventDetails.thumbnail}
          eventId={openEventDetails._id}
          eventStatus={openEventDetails.status}
        />
      )}

      {openEvent && (
        <EditEventComponent
          isOpen={!!openEvent}
          setIsOpen={() => setOpenEvent(null)}
          eventName={openEvent.name}
          eventLocation={openEvent.location}
          eventEndDate={format(new Date(openEvent.enddate), "yyyy-MM-dd")}
          eventStartDate={format(new Date(openEvent.startdate), "yyyy-MM-dd")}
          eventThumbnail={openEvent.thumbnail}
          eventId={openEvent._id}
          eventStatus={openEvent.status}
        />
      )}
    </>
  );
};

export default ThumbnailGallery;
