import React from "react";
import { Button, Rating } from "@mui/material";
import FormInputField from "./FormInputField";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

import { apiCall } from "../util/api";

function ReviewForm({ addReviewForm, setAddReviewForm, drinkId }) {
  const [reviewText, setReviewText] = React.useState("");
  const [rating, setRating] = React.useState(0);

  const addReviewApi = async () => {
    const body = {
      rating: rating,
      reviewText: reviewText,
    };
    try {
      await apiCall(`review/${drinkId}`, "POST", body);
      window.location.reload();
    } catch (error) {
      console.log("broken");
      // setAlertStatus(true);
    }
  };

  return (
    <>
      {addReviewForm && (
        <>
          <Box
            sx={{
              p: 1,
              border: "1.5px solid #4B0F20",
              width: "50%",
              margin: "auto",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Add Your Review
            </Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#4B0F20",
                },
              }}
              onChange={(e, value) => setRating(value)}
            />
            <br></br>
            <TextField
              label="Add Review Text"
              multiline
              rows={4}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ width: "60%" }}
            />
            <br />
            <Button
              onClick={() => {
                setReviewText("");
                setRating(0);
                setAddReviewForm(false);
              }}
              sx={{
                m: 1,
                // "&:hover": {
                //   backgroundColor: "#FAEBD9",
                //   color: "black",
                // },
              }}
            >
              Cancel
            </Button>
            <Button
              // sx={{
              //   backgroundColor: "#C8957C",
              //   color: "black",
              //   "&:hover": {
              //     backgroundColor: "#88504D",
              //     color: "black",
              //   },
              // }}
              onClick={() => addReviewApi()}
            >
              Post Review
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

ReviewForm.propTypes = {
  drinkId: PropTypes.string,
  reload: PropTypes.func,
};

export default ReviewForm;
