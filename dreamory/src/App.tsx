import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Card, Typography } from '@mui/material';
import ThumbnailGallery from './components/ThumbnailGallery'
import LogInComponent from './components/LogInComponent';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddEventComponent from './components/AddEventComponent';
import SignUpComponent from './components/SignUpComponent';

function App() {
  const { user } = useAuth(); 
  const [isLoginOpen,setIsLoginOpen] = useState(false)
  const [isSignOpen,setIsSignOpen] = useState(false)
  const [addEventModal,setAddEventModal] = useState(false)
  return (
    
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          user.token.length !== 0 ? 
          <Card 
          style={{ 
            backgroundColor:'#282c34',
            width: '80%', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-evenly', 
            alignItems: 'center', 
            padding: '16px'  // Optional for better spacing
          }}
        >
          <Typography style={{color:'white'}}> Welcome {user.name}</Typography>
          <Button onClick={()=>setAddEventModal(true)} style={{padding:30,backgroundColor:'#61dafb',color:'#282c34'}} variant="contained">Add Event</Button>
        </Card>
        :<>
        <Typography>Please Sign up or Log in as Admin to Edit and Delete Events</Typography>
        <Card 
        style={{ 
          backgroundColor:'#282c34',
          width: '80%', 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-evenly', 
          alignItems: 'center', 
          padding: '16px'  // Optional for better spacing
        }}
      >

   
        <Button onClick={()=>setIsLoginOpen(true)} style={{padding:30,backgroundColor:'#61dafb',color:'#282c34'}} variant="contained">Login</Button>
        <Button onClick={()=>setIsSignOpen(true)} style={{padding:30,backgroundColor:'#61dafb',color:'#282c34'}} variant="contained">Sign Up</Button>
      </Card>
        </>

        }

      </header>
      <ThumbnailGallery/>
      <LogInComponent isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
      <SignUpComponent isOpen={isSignOpen} setIsOpen={setIsSignOpen} />
      <AddEventComponent isOpen={addEventModal} setIsOpen={setAddEventModal}/>
    </div>
 
  );
}


export default App;
