import React from "react";
import DrinkInfo from "../components/drinkInfo";

function Drink() {
  const path = window.location.pathname;
  const drinkId = path.split("/")[2];
  return (
    <>
      <DrinkInfo drinkId={drinkId} form="fullForm" />
    </>
  );
}

export default Drink;
