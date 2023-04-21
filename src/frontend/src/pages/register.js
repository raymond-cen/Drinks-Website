import React from 'react';
import {
  Grid,
} from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import { apiCall } from '../util/api';
import { useNavigate } from 'react-router-dom';
// import logo from '../img/bigbrain-logo.png';

// TODO: Make centered with navbar
// TODO: Test works with backend

function Register () {
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');
  // React.useEffect(_ => {
  //   if (token) {
  //     // navigate('/')
  //   }
  // })

  const handleRegister = async (email, password, name) => {
    console.log('reg ' + email + ' ' + password + ' ' + name);
    try {
      // TODO: Update to actual API
      const response = await apiCall('register', 'POST', {
        email: email,
        password: password,
        username: name
      });
      // TODO: do something with userid
      localStorage.setItem('token', response.token);
      navigate('/')
    } catch (error) {
      // account already exists??
      console.log('err: ' + error);
    }
  }

  return (
    <Grid container justifyContent='center' height='100vh' alignItems='center' sx={{
      // background: '-moz-linear-gradient(45deg, rgba(245,202,195,1) 0%, rgba(132,165,157,1) 100%)',
      // background: '-webkit-linear-gradient(45deg, rgba(245,202,195,1) 0%, rgba(132,165,157,1) 100%)',
      background: 'linear-gradient(45deg, rgba(245,202,195,1) 0%, rgba(132,165,157,1) 100%)',
      bgcolor: 'background.default',
    }}>
      <Grid item xs={12} md={9} lg={6} xl={5}>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={6}>
            <RegisterForm submit={handleRegister} />
          </Grid>
          {/* <Grid item>
            <img src={logo} alt='Bigbrain' style={{ maxWidth: 300, marginLeft: 40 }} />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Register;
