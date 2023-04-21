import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddNewRecipe() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          height: "20vh",
          // backgroundColor: 'primary.main',
        }}
      >
        <Typography
          sx={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#88504D",
          }}
        >
          Can't find what you're looking for?
          <br></br>
          Add Your Own!
        </Typography>
        <Button
          sx={{
            fontSize: 50,
            height: 52,
            width: 52,
          }}
          onClick={(_) => navigate("/recipe/add")}
        >
          <b>+</b>
        </Button>
      </Box>
    </>
  );
}

export default AddNewRecipe;
