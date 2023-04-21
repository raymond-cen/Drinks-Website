import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Button, Menu, MenuItem, AppBar } from '@mui/material';
import { apiCall } from '../util/api';

function NavBar () {
  const navigate = useNavigate();
  const token = `Bearer ${localStorage.getItem('token')}`;
  
  const [menuStatus, setMenuStatus] = React.useState(null);
  const open = Boolean(menuStatus);

  const menuClicked = (event) => {
    setMenuStatus(event.currentTarget);
  }

  const menuClosed = (path) => {
    setMenuStatus(null);
    navigate(path);
  }

  const logOut = async() => {
    try {
      await apiCall(`logout`, 'POST');
    } catch (error) {
      console.log('broken');
    } finally {
      localStorage.removeItem('token');
      menuClosed('/home');
    }
  }

  return <>
    <AppBar position='static'>
      <Toolbar
        sx={{
          backgroundColor: '#C8957C'
        }}
        >
        <Button
          sx={{
            fontFamily: 'acumin-pro-condensed, sans-serif',
            fontSize: 20,
            fontWeight: 600,
            fontStyle: 'normal',
            textAlign: 'center',
            marginLeft: 1,
          }}
          onClick={() => navigate('/home')}
        >                   
          Home
        </Button>
        <Button
          sx={{
            fontFamily: 'acumin-pro-condensed, sans-serif',
            fontSize: 20,
            fontWeight: 600,
            fontStyle: 'normal',
            textAlign: 'center',
            marginLeft: 1,
          }}
          onClick={() => navigate('/randomDrinkGenerator')}
        >
          Random
        </Button>
        <Button
          sx={{
            fontFamily: 'acumin-pro-condensed, sans-serif',
            fontSize: 20,
            fontWeight: 600,
            fontStyle: 'normal',
            textAlign: 'center',
            marginLeft: 1,
          }}
          onClick={() => navigate('/drinkQuiz')}
        >
          Quiz
        </Button>
        <Button
          id='accountMenu'
          aria-controls={open ? 'accountMenu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={menuClicked}
          sx={{
            position: 'absolute',
            right: 10,
            fontFamily: 'acumin-pro-condensed, sans-serif',
            fontSize: 20,
            fontWeight: 600,
            fontStyle: 'normal',
            textAlign: 'center',
          }}
        >
          Account
        </Button>
        {/* Shows Login/Regsiter if no token exists */}
        {/* TODO: clarify how token is stored */}
        {token === 'Bearer null' 
          ? <>
            <Menu
              id='accountMenu'
              aria-labelledby="demo-positioned-button"
              anchorEl={menuStatus}
              open={open}
              onClose={menuClosed}
            >
              <MenuItem onClick={() => menuClosed('/login')}>Login</MenuItem>
              <MenuItem onClick={() => menuClosed('/register')}>Register</MenuItem>
            </Menu>
          </>
          : <>
            <Menu
              id='accountMenu'
              aria-labelledby="demo-positioned-button"
              anchorEl={menuStatus}
              open={open}
              onClose={menuClosed}
            >
              <MenuItem onClick={() => menuClosed('/profile')}>View Profile</MenuItem>
              <MenuItem onClick={() => logOut()}>Logout</MenuItem> {/* MAKE THIS SO THAT IT DEPENDS ON TOKEN*/}
            </Menu>
          </>
        }
      </Toolbar> 
    </AppBar>
    
  </>    
}

export default NavBar
