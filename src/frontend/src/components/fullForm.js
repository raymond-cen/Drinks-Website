import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { apiCall } from "../util/api";
import Divider from "@mui/material/Divider";
import Reviews from "./review";
import ReviewForm from "./reviewForm";

import { Rating } from "@mui/material";

function FullForm({ drink, drinkId }) {
  const [alertStatus, setAlertStatus] = React.useState(false);
  const [drinkIngredients, setDrinkIngredients] = React.useState([""]);
  const [ingredientQuantityMeasurements, setIngredientQuantityMeasurements] =
    React.useState([""]);
  const [drinkMethod, setDrinkMethod] = React.useState([""]);
  const [addReviewForm, setAddReviewForm] = React.useState(false);
  React.useEffect(() => {
    if (drink) {
      setDrinkIngredients(drink.ingredients);
      setIngredientQuantityMeasurements(drink.quantity_and_measurements);
      if (drink.method) {
        setDrinkMethod(drink.method.split("\n"));
      }

      setAlertStatus(true);
    }
  }, [drink]);

  const ingredientBox = (ingredientName, key) => {
    return (
      <Box sx={{ display: "flex" }} key={key}>
        <Typography
          sx={{
            display: "list-item",
            textAlign: "left",
            listStylePosition: "inside",
            listStyleType: "square",
            color: "#4B0F20",
            fontSize: "20px",
            fontFamily: "acumin-pro-condensed, sans-serif",
            fontStyle: "normal",
          }}
        >
          {ingredientName}
        </Typography>
        <Typography
          sx={{
            color: "#4B0F20",
            fontSize: "20px",
            fontFamily: "acumin-pro-condensed, sans-serif",
            fontStyle: "normal",
            fontWeight: "600",
            marginLeft: "6px",
          }}
        >
          {ingredientQuantityMeasurements[key]}
        </Typography>
      </Box>
    );
  };
  const methodBox = (method, key) => {
    return (
      <Box
        sx={{
          paddingRight: "15px",
          width: "100%",
        }}
        key={key}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {method.split("|").map((step, index) => {
            return (
              <>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{
                      whiteSpace: "nowrap",
                      fontFamily: "acumin-pro-condensed, sans-serif",
                      fontSize: "20px",
                      // flex: "1",
                    }}
                  >
                    {index + 1}.
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: "8px",
                      fontFamily: "acumin-pro-condensed, sans-serif",
                      fontSize: "20px",
                    }}
                  >
                    {step}
                  </Typography>
                </Box>
              </>
            );
          })}
        </Box>
      </Box>
    );
  };
  const saveRecipe = async (id) => {
    try {
      await apiCall(`recipe/save/${id}`, "PUT", {
        recipeId: id,
      });
      // window.location.reload();
    } catch (error) {
      console.log("broken");
      console.log(error);
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FAEBD9",
          minHeight: "100vh",
          fontFamily: "acumin-pro-condensed, sans-serif",
          fontStyle: "normal",
        }}
      >
        <Box
          sx={{
            display: "flex",
            m: 1,
            p: 1,
            backgroundColor: "#FAEBD9",
            borderBottom: "2px solid #4B0F20",
          }}
        >
          <Box
            sx={{
              flexBasis: "35%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {drink.imageurl === "" ? (
              <>
                <Box
                  component="img"
                  sx={{
                    border: "1px solid #88504D",
                    width: "100%",
                    maxHeight: "40vh",
                    minHeight: "35vh",
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
                    maxHeight: "40vh",
                    minHeight: "35vh",

                    backgroundSize: "cover",
                    objectFit: "cover",
                  }}
                  src={drink.imageurl}
                />
              </>
            )}

            <Box>
              <Rating
                name="read-only"
                value={drink.average_rating ?? null}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#4B0F20",
                  },
                  fontSize: "2.5rem",
                  float: "left",
                }}
              />
              <Button
                sx={{
                  float: "right",
                  m: 1,
                  backgroundColor: "#C8957C",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#88504D",
                    color: "black",
                  },
                }}
                onClick={() => {
                  if (localStorage.getItem("token")) {
                    setAddReviewForm(true);
                  } else {
                    alert("Must be Logged In to Add a Review");
                  }
                }}
              >
                Add Review
              </Button>
            </Box>
            <Box sx={{ m: 1, marginTop: 0, textAlign: "left" }}>
              <Typography
                sx={{
                  color: "#88504D",
                  fontFamily: "acumin-pro-condensed, sans-serif",
                  fontSize: "20px",
                }}
              >
                Num Reviews|
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "inline",
                    color: "#4B0F20",
                    m: 1,
                    fontFamily: "acumin-pro-condensed, sans-serif",
                    fontSize: "20px",
                  }}
                >
                  {drink.reviews ? drink.reviews.length : 0}
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexBasis: "75%" }}>
            <Button
              sx={{
                float: "right",
                marginRight: "30px",
                backgroundColor: "#C8957C",
                color: "black",
                "&:hover": {
                  backgroundColor: "#88504D",
                  color: "black",
                },
              }}
              onClick={() => saveRecipe(drinkId)}
            >
              Save Recipe
            </Button>
            <Typography
              sx={{
                fontSize: "65px",
                m: 1,
                marginLeft: "25px",
                textAlign: "left",
                fontFamily: "acumin-pro-condensed, sans-serif",
                fontStyle: "normal",
              }}
            >
              {drink.name}
            </Typography>
            <Divider
              sx={{
                background: "#88504D",
                borderBottomWidth: 5,
                marginLeft: 0.2,
              }}
            />
            <Box
              id="description"
              sx={{
                textAlign: "left",
                m: 1,
                marginLeft: "25px",
                p: 1,
              }}
            >
              <Box></Box>
              <Box sx={{}}>
                <Typography
                  sx={{
                    fontSize: "23.5px",
                    display: "inline-block",
                    fontFamily: "acumin-pro-condensed, sans-serif",
                    fontStyle: "normal",
                  }}
                >
                  {drink.description}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                textAlign: "left",
                p: 1,
                paddingLeft: "40px",
              }}
            >
              <Box sx={{ flexBasis: "30%" }}>
                <Typography sx={{ fontWeight: "bold", color: "#4B0F20" }}>
                  INGREDIENTS
                </Typography>
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
              <Box sx={{ flexBasis: "65%" }}>
                <Typography sx={{ fontWeight: "bold", color: "#4B0F20" }}>
                  METHOD
                </Typography>
                <Box>
                  {drinkMethod?.map((data, index) => methodBox(data, index))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <ReviewForm
          addReviewForm={addReviewForm}
          setAddReviewForm={setAddReviewForm}
          drinkId={drinkId}
        />

        <Box sx={{ p: 3, bgcolor: "#C8957C" }}>
          {drink.reviews && <Reviews reviews={drink.reviews} />}
        </Box>
      </Box>
    </>
  );
}

FullForm.propTypes = {
  drink: PropTypes.object,
  drinkId: PropTypes.string,
};

export default FullForm;
