import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { apiCall } from "../util/api";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";

function BriefForm({ drink, drinkId }) {
  const [alertStatus, setAlertStatus] = React.useState(false);
  const [drinkIngredients, setDrinkIngredients] = React.useState([""]);
  const [drinkMethod, setDrinkMethod] = React.useState([""]);
  const [drinkNumRating, setDrinkNumRating] = React.useState(0);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (drink) {
      setDrinkIngredients(drink.ingredients);
      if (drink.method) {
        setDrinkMethod(drink.method.split("\n"));
      }
      if (drink.reviews) {
        setDrinkNumRating(drink.reviews.length);
      }
      setAlertStatus(true);
    }
  }, [drink]);
  const ingredientBox = (ingredientName, key) => {
    return (
      <Box sx={{}} key={key}>
        <Typography
          sx={{
            display: "list-item",
            textAlign: "left",
            listStylePosition: "inside",
            color: "#C8957C",
            // display: "inline-block",
            fontSize: "18px",
          }}
        >
          {/* <Typography
            sx={{
              display: "inline-block",
              fontSize: "18px",
            }}
          >
            {ingredientName}
          </Typography> */}
          {ingredientName}
        </Typography>
      </Box>
    );
  };
  const methodBox = (method, key) => {
    return (
      <Box
        sx={{
          flexBasis: "100%",
          paddingRight: "15px",
          maxWidth: "600px",
        }}
        key={key}
      >
        <Typography
          noWrap
          sx={{
            fontSize: "18px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {method.split("|").map((step, index) => {
            return (
              <>
                {index + 1}. {step}
                <br />
              </>
            );
          })}
        </Typography>
      </Box>
    );
  };
  return (
    <>
      {alertStatus ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            maxHeight: "400px",
            backgroundColor: "#FAEBD9",
            borderRadius: "18px",
            border: "2px solid #88504D",
          }}
        >
          <Box
            sx={{
              // width: "40%",
              // flexBasis: "33.33%",
              maxWidth: "33%",
              marginRight: "10px",
              padding: "0px 10px 10px 10px",
              alignItems: "left",
            }}
          >
            <Typography
              noWrap
              sx={{
                fontSize: "48px",
                color: "#88504D",
                textDecoration: "underline",
                display: "block",
                textDecorationColor: "#C8957C",
                textDecorationThickness: "3px",
              }}
              // link to recipe/{id} ??
            >
              {drink.name}
            </Typography>

            {/* <Box
              component="img"
              sx={{
                border: "1px solid #88504D",
                borderRadius: "18px",
                height: 250,
                width: 350,
                maxHeight: { xs: 260, md: 210 },
                maxWidth: { xs: 350, md: 300 },
                // background: "linear-gradient(-30.984deg, #C8957C, #EFDABD",
              }}
              // DUmmy image
              src="https://domf5oio6qrcr.cloudfront.net/medialibrary/7909/conversions/b8a1309a-ba53-48c7-bca3-9c36aab2338a-thumb.jpg"
            /> */}

            {drink.imageurl === "" ? (
              <>
                <Box
                  component="img"
                  sx={{
                    border: "1px solid #88504D",
                    borderRadius: "18px",
                    height: 250,
                    width: 350,
                    maxHeight: { xs: 260, md: 210 },
                    maxWidth: { xs: 350, md: 300 },
                    // background: "linear-gradient(-30.984deg, #C8957C, #EFDABD",
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
                    borderRadius: "18px",
                    height: 250,
                    width: 350,
                    maxHeight: { xs: 260, md: 210 },
                    maxWidth: { xs: 350, md: 300 },
                  }}
                  src={drink.imageurl}
                />
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingRight: "3px",

              flexBasis: "66.66%",
              // backgroundColor: "black",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexBasis: "33.3%",
                flexDirection: "column",
                paddingLeft: "15px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Rating
                  name="read-only"
                  value={drink.average_rating ?? null}
                  readOnly
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#4B0F20",
                    },
                    fontSize: "2.5rem",
                    alignContent: "left",
                  }}
                />
                <Typography
                  sx={{
                    display: "inline-block",
                    paddingTop: "5px",
                    fontSize: "17px",
                    color: "#EFDABD",
                  }}
                >
                  Num Ratings:
                </Typography>
                <Typography
                  sx={{
                    display: "inline-flex",
                    color: "#88504D",
                    paddingLeft: "5px",
                    fontSize: "17px",
                  }}
                >
                  {drinkNumRating}
                </Typography>
                <Box
                  sx={{
                    marginLeft: "20px",
                    float: "right",
                    alignSelf: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{}}
                    onClick={() => navigate(`/recipe/${drinkId}`)}
                  >
                    View All Details
                  </Button>
                </Box>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    color: "#4B0F20",
                    fontSize: "21px",
                  }}
                >
                  {drink.description}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                fontSize: "20.5px",
                color: "#C8957C",
                flexBasis: "100%",
              }}
            >
              <Box
                sx={{
                  flexBasis: "35%",
                  borderRight: "2px solid #C8957C",
                  marginBottom: "3px",
                  minHeight: "200px",
                  // bgcolor: "orange",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "left",
                    fontSize: "20.5px",
                    color: "#C8957C",
                    p: 1,
                  }}
                >
                  INGREDIENTS
                </Typography>
                <Box
                  sx={{
                    flexBasis: "66.6%",
                    display: "flex",
                    minWidth: "40%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      maxHeight: "200px",
                      flexWrap: "wrap",
                      flexDirection: "column",
                      // p: 1,
                      margin: "0px 15px 5px",
                      flexBasis: "100%",
                    }}
                  >
                    {drinkIngredients?.map((data, index) =>
                      ingredientBox(data, index)
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ textAlign: "left", paddingLeft: "5px" }}>
                <Typography
                  sx={{
                    fontSize: "20.5px",
                    color: "#C8957C",
                    p: 1,
                  }}
                >
                  METHOD
                </Typography>
                <Box sx={{}}>
                  <Box
                    sx={{
                      display: "flex",
                      maxHeight: "200px",
                      flexWrap: "wrap",
                      flexDirection: "column",
                      margin: "0px 15px 5px",
                    }}
                  >
                    {drinkMethod?.map((data, index) => methodBox(data, index))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box></Box>
      )}
    </>
  );
}

BriefForm.propTypes = {
  drink: PropTypes.object,
  drinkId: PropTypes.string,
};

export default BriefForm;
