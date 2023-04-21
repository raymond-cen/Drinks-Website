import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
} from '@mui/material';
import FormInputField from './FormInputField';
import { Link } from 'react-router-dom';

function LoginForm ({ submit }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container maxWidth='md' sx={{
      bgcolor: 'background.paper',
      boxShadow: 1,
      borderRadius: 1,
      p: 2,
      minWidth: 300,
    }}>
      <h1>Login</h1>
      <form onSubmit={ e => { e.preventDefault(); submit(name, password) } }>
        <FormInputField
          id='loginName'
          label='Username'
          variant='outlined'
          onChange={e => setName(e.target.value)}
        /><br />
        <FormInputField
          id='loginPassword'
          label='Password'
          variant='outlined'
          type='password'
          onChange={e => setPassword(e.target.value)}
        /><br />
        <Button
          id='loginSubmit'
          // variant='contained'
          type='submit'
          size='large'
        >
          Login
        </Button>
      </form>
      <Typography>Don&apos;t have an account? <Link to='/register'>Register here.</Link></Typography>
    </Container>
  )
}


export default LoginForm;