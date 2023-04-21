import React, { useEffect, useState } from "react";
import apiCall from "../util/api";
import { Box, Button, Typography } from "@mui/material";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

function EditModal ({userInfo, editModalOpen, setEditModalOpen}) {
  const [username, setUsername] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState(null);
  const [imageurl, setImageurl] = useState(userInfo.image_url);

  const handleClose = () => {
    setEditModalOpen(false)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(username)
    console.log(email)
    console.log(password)
    console.log(imageurl)
    try {
      await apiCall("user", "PUT", {
        username: username,
        email: email,
        password: password,
        imageurl: imageurl
      })
      window.location.reload()
    } catch (error) {
      alert(error)
    }
  }

  const style = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "darkgray",
    border: "2px solid #000",
    fontFamily: "acumin-pro-condensed, sans-serif",
    boxShadow: 24,
    p: 4,
  };

  return <>
    <Modal
        open={editModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <h3 style={{textAlign: "center"}}>Edit Your Profile</h3>
          <TextField id="outlined-basic" label="Username" variant="outlined" defaultValue={userInfo.username}
            onChange={(e) => setUsername(e.target.value)}/>
          <TextField id="outlined-basic" label="Email" variant="outlined" defaultValue={userInfo.email} 
            onChange={(e) => setEmail(e.target.value)}/>
          <TextField id="outlined-basic" label="Password" type="password" variant="outlined" 
            onChange={(e) => setPassword(e.target.value)}/>
          <TextField id="outlined-basic" label="Profile Image Url" variant="outlined" defaultValue={userInfo.image_url} 
            onChange={(e) => setImageurl(e.target.value)}/>

          <Button type="submit">Submit</Button> {/* Handle form submit on click*/}
        </Box>
      </Modal>
  </>
}

export default EditModal