import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
} from '@mui/material';
import FormInputField from './FormInputField';
import { Link } from 'react-router-dom';

function RegisterForm ({ submit }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Container maxWidth='md' sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 1,
        p: 2,
        minWidth: 300
      }}>
        <h1>Register</h1>
        <form onSubmit={ e => { e.preventDefault(); submit(email, password, name) } }>
          <FormInputField
            id='registerEmail'
            label='Email'
            type='email'
            variant='outlined'
            onChange={e => setEmail(e.target.value)}
            /><br />
          <FormInputField
            id='registerName'
            label='Username'
            variant='outlined'
            onChange={e => setName(e.target.value)}
          /><br />
          <FormInputField
            id='registerPassword'
            label='Password'
            variant='outlined'
            type='password'
            onChange={e => setPassword(e.target.value)}
            /><br />
          <Button
            id='registerSubmit'
            // variant='contained'
            type='submit'
            size='large'
          >
            Register
          </Button>
        </form>
        <Typography >Already have an account? <Link to='/login'>Login instead.</Link></Typography>
      </Container>
    </>
  )
}

export default RegisterForm;
