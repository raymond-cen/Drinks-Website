import React from "react";
import { Button, Box, Rating, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function DrinkRandom({ randomDrink }) {
  const navigate = useNavigate();

  return (
    <Box>
      {console.log(randomDrink)}
      <Button
        variant="text"
        sx={{
          backgroundColor: "#FAEBD9",
        }}
        onClick={() => navigate(`/recipe/${randomDrink.recipeid}`)}
      >
        <Typography
          variant="h1"
          sx={{
            textTransform: "uppercase",
            fontFamily: "acumin-pro-condensed, sans-serif",
          }}
        >
          {randomDrink.name}
        </Typography>
      </Button>
      <br />
      <Rating
        name="read-only"
        readOnly
        value={randomDrink.average_rating ?? null}
        sx={{
          "& .MuiRating-iconFilled": {
            color: "#4B0F20",
          },
          fontSize: "2.5rem",
          alignContent: "left",
        }}
        precision={0.5}
      />
      <br />

      {randomDrink.imageurl === "" ? (
        <>
          <Box
            component="img"
            sx={{
              border: "1px solid #88504D",
              width: "100%",
              maxHeight: { xs: 400, md: 250 },
              maxWidth: { xs: 450, md: 400 },
              backgroundSize: "cover",
              objectFit: "cover",
            }}
            // DUmmy image
            src="https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png"
          />
        </>
      ) : (
        <>
          <Box
            component="img"
            sx={{
              border: "1px solid #88504D",
              width: "100%",
              maxHeight: { xs: 400, md: 250 },
              maxWidth: { xs: 450, md: 400 },

              backgroundSize: "cover",
              objectFit: "cover",
            }}
            src={randomDrink.imageurl}
          />
        </>
      )}
    </Box>
  );
}

export default DrinkRandom;
