import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Typography } from "@mui/material";
import { apiCall } from "../util/api";
import TextField from "@mui/material/TextField";

function Comments({ comments, reviewId, reload }) {
  const [viewComments, setViewComments] = React.useState(false);

  return (
    <>
      {comments ? (
        <>
          {viewComments ? (
            <Box>
              <Button onClick={() => setViewComments(false)}>X</Button>
              <Box sx={{ height: "20%", m: 3 }}>
                <InfiniteScroll
                  dataLength={comments.length}
                  hasMore={true}
                  loader={<p></p>}
                >
                  {/* <hr sx={{ m: 0, paddingTop: "10px" }}></hr> */}

                  {comments.map((comment, index) => {
                    return (
                      <Comment
                        id={comment.commentid}
                        name={comment.creatorname}
                        text={comment.commenttext}
                        time={comment.creationtime}
                        index={index}
                      />
                    );
                  })}
                </InfiniteScroll>
              </Box>
            </Box>
          ) : (
            <>
              <Button onClick={() => setViewComments(true)}>
                Show Comments
              </Button>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

Comments.propTypes = {
  comments: PropTypes.array,
  reviewId: PropTypes.string,
  reload: PropTypes.func,
};

export default Comments;

function Comment({ id, name, text, time, index }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [editCommentText, setEditCommentText] = React.useState("");
  const [isShown, setIsShown] = React.useState(false);
  const deleteComment = async () => {
    try {
      await apiCall(`comment/${id}`, "DELETE");
      window.location.reload();
    } catch (error) {
      console.log("broken");
      console.log(error);
    }
  };

  const editComment = async () => {
    try {
      await apiCall(`comment/${id}`, "PUT", { commentText: editCommentText });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const editMenu = (event) => {
    setShowEdit((current) => !current);
  };

  return (
    <>
      <Box
        sx={{
          border: "1px solid #BEBEBE",
          borderTop: index !== 0 && "none",
          minHeight: "100px",
          paddingLeft: "10px",
        }}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        {isShown && !showEdit && (
          <>
            <Box>
              <Button sx={{ float: "right" }} onClick={() => deleteComment()}>
                Delete
              </Button>
              <Button sx={{ float: "right" }} onClick={editMenu}>
                Edit
              </Button>
            </Box>
          </>
        )}
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box sx={{ marginRight: "13px" }}>
            <b>{name}</b>
          </Box>

          <Box sx={{}}>
            <Typography
              sx={{
                fontSize: "0.75rem",
              }}
            >
              {time}
            </Typography>
          </Box>
        </Box>

        {!showEdit ? (
          <>
            <Box>
              <Typography
                sx={{
                  textAlign: "left",
                  fontFamily: "acumin-pro-condensed, sans-serif",
                  fontStyle: "normal",
                }}
              >
                {text}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <TextField
              id="standard-textarea"
              label="Editted Comment"
              multiline
              variant="standard"
              onChange={(e) => setEditCommentText(e.target.value)}
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
              onClick={editComment}
              sx={{
                m: 1,
              }}
            >
              Confirm Edit
            </Button>
          </>
        )}
      </Box>
    </>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  text: PropTypes.string,
};
