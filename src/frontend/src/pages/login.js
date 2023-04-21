import React from 'react';
import {
  Grid,
} from '@mui/material';
import LoginForm from '../components/LoginForm';
import { apiCall } from '../util/api';
import { useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import logo from '../img/bigbrain-logo.png';

// TODO: Make centered with navbar
// TODO: Test works with backend

function Login () {
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');
  // React.useEffect(_ => {
  //   if (token) {
  //     // navigate('/')
  //   }
  // }, []);

  const handleLogin = async (username, password) => {
    console.log('login ' + username + ' ' + password);
    try {
      // TODO: Update to actual API
      const response = await apiCall('login', 'POST', {
        username: username,
        password: password
      });
      // TODO: do something with response.userid
      console.log(response);
      localStorage.setItem('token', response.token);
      navigate('/');
      
    } catch (error) {
      // invalid login
      console.log(error);
    }
  }
  return (
    <Grid 
      container
      justifyContent='center'
      alignItems='center'
      height='100vh'
      sx={{
        background: 'linear-gradient(45deg, rgba(245,202,195,1) 0%, rgba(132,165,157,1) 100%)',
        bgcolor: 'background.default'
      }}
    >
      <Grid item xs={12} md={9} lg={6} xl={5}>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
        >
          <Grid item xs={12} md={6}>
          <LoginForm submit={handleLogin} />
          </Grid>
          {/* <Grid item>
            <img src={logo} alt='Bigbrain' style={{ maxWidth: 300, marginLeft: 40 }} />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Login;
