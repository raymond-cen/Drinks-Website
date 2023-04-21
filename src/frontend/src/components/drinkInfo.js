import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { apiCall } from "../util/api";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import Reviews from "./reviews";
import BriefForm from "./briefForm";
import FullForm from "./fullForm";

function DrinkInfo({ drinkId, form }) {
  const [alertStatus, setAlertStatus] = React.useState(false);
  const [drink, setDrink] = React.useState({});
  const [drinkRating, setDrinkRating] = React.useState(0);
  React.useEffect(() => {
    // Move outside of the useEffect if its needed outside
    const getDrink = async () => {
      try {
        const response = await apiCall(`recipe/${drinkId}`, "GET");
        setDrink(response);
        setAlertStatus(false);
        setDrinkRating(response.average_rating);
      } catch (error) {
        console.log("broken");
        setAlertStatus(true);
      }
    };

    if (drinkId) {
      getDrink();
    }
  }, [drinkId]);

  return (
    <>
      {form === "briefForm" ? (
        <>
          {alertStatus || !drinkId ? (
            <> Nothing to see here </>
          ) : (
            <>
              <BriefForm drink={drink} drinkId={drinkId} />
            </>
          )}
        </>
      ) : (
        <>
          {form === "fullForm" ? (
            <>
              <FullForm drink={drink} drinkId={drinkId} />
            </>
          ) : (
            <>Oh No Something Went Wrong</>
          )}
        </>
      )}
    </>
  );
}

DrinkInfo.propTypes = {
  drinkId: PropTypes.string,
  form: PropTypes.string,
};

export default DrinkInfo;
