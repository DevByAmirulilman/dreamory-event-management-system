import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import React from 'react';
import Grid from '@mui/material/Grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';

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
  
  const { isLoading, error, data } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents, // Use the modified fetch function that fetches thumbnails as well
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading events: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>No events found</div>;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      {data.map((res, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card onClick={()=>console.log(res._id)}>
            <CardMedia
              component="img"
              height="150"
              image={res.thumbnail || 'https://via.placeholder.com/150'} // Use placeholder if no thumbnail
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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ThumbnailGallery;
