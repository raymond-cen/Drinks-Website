import React from "react";
import { Box, Button } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
// import { apiCall } from '../util/api';
import PropTypes from "prop-types";

import DrinkInfo from "./drinkInfo";

function DrinkList({ drinkData, alertStatus }) {
  const [drinkId, setDrinkId] = React.useState("");
  const [currentDrinks, setCurrentDrinks] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    fetchDrinks();
  }, [currentPage, drinkData]);

  const fetchDrinks = () => {
    const next20 = drinkData.slice(0, currentPage * 20);
    setCurrentDrinks(next20);
  };

  return (
    <>
      {alertStatus ? (
        <>
          <Box
            id="listDrinksHomeError"
            sx={{
              height: 340,
              backgroundColor: "secondary.main",
              border: "1px solid black",
              overflow: "auto",
            }}
          >
            {" "}
            Uh Oh Something Went Wrong
          </Box>
          <Box
            id="briefDrinkDescription"
            sx={{
              height: 300,
              backgroundColor: "secondary.light",
              border: "1px solid black",
              overflow: "auto",
            }}
          >
            Nothing To See Here
          </Box>
        </>
      ) : (
        <>
          <Box
            id="listDrinksHome"
            sx={{
              height: 340,
              backgroundColor: "secondary.main",
              border: "1px solid black",
              overflow: "auto",
            }}
          >
            <InfiniteScroll
              dataLength={currentDrinks.length}
              next={() => setCurrentPage(currentPage + 1)}
              hasMore={true}
              height={340}
              endMessage={<h4>No More Drinks</h4>}
              scrollableTarget="listDrinksHome"
            >
              {drinkData &&
                currentDrinks.map((data, index) => (
                  <Box
                    id={index}
                    sx={{
                      height: 50,
                      border: "0.5px solid white",
                      display: "flex",
                    }}
                    key={index}
                  >
                    <Box
                      className="recipe-name"
                      sx={{
                        width: 100,
                      }}
                    >
                      <Button
                        variant="text"
                        sx={{
                          color: "secondary.dark",
                        }}
                        onClick={() => {
                          setDrinkId(`${data.recipeid}`);
                        }}
                      >
                        {data.name}
                      </Button>
                    </Box>
                    <Box>{data.description}</Box>
                  </Box>
                ))}
            </InfiniteScroll>
          </Box>
          <Box
            id="briefDrinkDescription"
            sx={{
              height: 302,
              backgroundColor: "secondary.light",
              border: "1px solid black",
              overflow: "auto",
            }}
          >
            <DrinkInfo drinkId={drinkId} form="briefForm" />
          </Box>
        </>
      )}
    </>
  );
}
DrinkList.propTypes = {
  drinkData: PropTypes.array,
  alertStatus: PropTypes.bool.isRequired,
};

export default DrinkList;
