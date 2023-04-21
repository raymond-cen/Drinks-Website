import React from "react";
import PropTypes from "prop-types";
import { Button, Box, Rating, TextField, Typography } from "@mui/material";
import Comments from "./comments";
import { apiCall } from "../util/api";

// import InfiniteScroll from 'react-infinite-scroll-component';

function Reviews({ reviews }) {
  return (
    <>
      {reviews && (
        <>
          <Box sx={{ bgcolor: "#C8957C" }}>
            {reviews ? (
              <>
                <Box sx={{}}></Box>
                {reviews.length === 0 ? (
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: "acumin-pro-condensed, sans-serif",
                      fontStyle: "normal",
                    }}
                  >
                    No Reviews Yet
                  </Typography>
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontSize: "30px",
                        textAlign: "left",
                        p: 1,
                        paddingTop: 0,
                        fontWeight: "600",
                        fontFamily: "acumin-pro-condensed, sans-serif",
                        fontStyle: "normal",
                      }}
                    >
                      Reviews
                    </Typography>
                    {reviews.map((review) => {
                      return <Review review={review} />;
                    })}
                  </>
                )}
              </>
            ) : (
              <Box>No Reviews</Box>
            )}
          </Box>
        </>
      )}
    </>
  );
}

Reviews.propTypes = {
  reviews: PropTypes.array,
  averageRate: PropTypes.number,
  reload: PropTypes.func,
  deleteReview: PropTypes.func,
};

export default Reviews;

function Review(review) {
  review = review.review;
  const [commentText, setCommentText] = React.useState("");
  const [commentBox, setCommentBox] = React.useState(false);
  const [isShown, setIsShown] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [editReviewText, setEditReviewText] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const editMenu = (event) => {
    setShowEdit((current) => !current);
  };
  function refreshPage() {
    window.location.reload();
  }

  const deleteReview = async (id) => {
    try {
      await apiCall(`review/${id}`, "DELETE");
      console.log("success");
      // console.log(JSON.stringify(reload));
      window.location.reload();
    } catch (error) {
      console.log("broken");
      console.log(error);
    }
  };

  const editReview = async (id) => {
    try {
      await apiCall(`review/${id}`, "PUT", {
        reviewText: editReviewText,
        rating: rating,
      });

      console.log("success");
      // console.log(JSON.stringify(reload));
      window.location.reload();
    } catch (error) {
      console.log("broken");
      console.log(error);
    }
  };

  const postComment = async (id) => {
    console.log(commentText);
    try {
      await apiCall(`comment/${id}`, "POST", { commentText: commentText });
      refreshPage();
    } catch (error) {
      console.log(error);
    }
  };

  const getDate = (dateString) => {
    const date = dateString.split(" ");
    return date[0];
  };
  return (
    <>
      {review && (
        <>
          <Box
            key={review.reviewid}
            sx={{
              border: "1px solid black",
              borderRadius: 1,
              background: "white",
              margin: 1,
              p: 1,
            }}
          >
            <Box
              sx={{
                borderBottom: "1px solid #DEDEDE",
                "&:hover": {
                  backgroundColor:
                    isShown && !commentBox && !showEdit ? "#ECECEC" : "inherit",
                },
              }}
              onMouseEnter={() => setIsShown(true)}
              onMouseLeave={() => setIsShown(false)}
            >
              {isShown && !commentBox && !showEdit && (
                <>
                  <Button
                    sx={{ float: "right", margin: "0px 10px" }}
                    onClick={() => deleteReview(review.reviewid)}
                  >
                    Delete Review
                  </Button>
                  <Button sx={{ float: "right" }} onClick={editMenu}>
                    Edit Review
                  </Button>
                  <Button
                    sx={{ float: "right", margin: "0px 10px" }}
                    onClick={() => setCommentBox((current) => !current)}
                  >
                    Add Comment
                  </Button>
                </>
              )}

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Box sx={{ margin: "0px 20px" }}>
                  <b>{review.creatorname}</b>
                </Box>
                <Box sx={{ margin: "0px 5px" }}>
                  {!showEdit ? (
                    <Rating
                      name="read-only"
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#4B0F20",
                        },
                        fontSize: "1.6rem",
                      }}
                    />
                  ) : (
                    <Rating
                      name="simple-controlled"
                      value={rating}
                      onChange={(e, value) => setRating(value)}
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#4B0F20",
                        },
                        fontSize: "1.6rem",
                      }}
                    />
                  )}
                </Box>
                <Box>{getDate(review.creationtime)}</Box>
              </Box>
              {!showEdit ? (
                <Typography
                  sx={{
                    textAlign: "left",
                    paddingLeft: "25px",
                    fontFamily: "acumin-pro-condensed, sans-serif",
                    fontStyle: "normal",
                    fontSize: "20px",
                  }}
                >
                  {review.reviewtext}
                </Typography>
              ) : (
                <>
                  <TextField
                    id="standard-textarea"
                    label="Editted Review"
                    multiline
                    variant="standard"
                    onChange={(e) => setEditReviewText(e.target.value)}
                    sx={{
                      p: 1,
                      m: 1,
                      width: "95%",
                    }}
                  />
                  <Button
                    onClick={editMenu}
                    sx={{
                      m: 1,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => editReview(review.reviewid)}
                    sx={{
                      m: 1,
                    }}
                  >
                    Confirm Edit
                  </Button>
                </>
              )}

              <Box sx={{ marginBottom: "30px" }}>
                {commentBox ? (
                  <>
                    <TextField
                      id="outlined-multiline-static"
                      label="add comment"
                      multiline
                      rows={5}
                      onChange={(e) => setCommentText(e.target.value)}
                      sx={{
                        margin: "1%",
                        width: "95%",
                      }}
                    />
                    <Button
                      onClick={() => setCommentBox((current) => !current)}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{ m: 1, flexBasis: "20%" }}
                      onClick={() => postComment(review.reviewid)}
                    >
                      Add Comment
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            {review.comments ? (
              <Box
                sx={{
                  marginBottom: "10px",
                }}
              >
                Comments: {review.comments.length}
              </Box>
            ) : (
              <>Comments: 0</>
            )}
            <Comments comments={review.comments} reviewId={review.reviewId} />
          </Box>
        </>
      )}
    </>
  );
}
