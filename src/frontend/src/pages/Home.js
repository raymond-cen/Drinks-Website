import React, { useEffect, useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import SearchSort from "../components/searchSort";
import SearchIngreds from "../components/searchIngreds";
import SearchFilter from "../components/searchFilter";
import DrinkList from "../components/drinkList";
import AddNewRecipe from "../components/addNewRecipe";
import apiCall from "../util/api";
// import throttleFunction from '../util/throttle';
// import throttle from "../util/throttle";
import debounce from "../util/debounce";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drinkData, setDrinkData] = useState([]);
  const [alertStatus, setAlertStatus] = useState(false);
  const [selectedIngreds, setSelectedIngreds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [value, setValue] = useState(0);
  const [ingredLogic, setIngredLogic] = useState("");
  const [sortbyhome, setSortbyhome] = useState("name");
  const [sortreverse, setSortreverse] = useState(false);

  useEffect(() => {
    getListDrink();
  }, []);

  useEffect(() => {
    // Do search
    // but throttle it

    async function getSearchResults(str, ingreds, tags) {
      console.log(`Searching: ${str}`);
      if (str === "" && ingreds.length === 0 && tags.length === 0) {
        getListDrink();
        return;
      }
      console.log("selectedIngreds");
      console.log(ingreds);
      try {
        const response = await apiCall("recipe/search", "POST", {
          name: str,
          ingredients: ingreds.map((ingred) => ingred.ingredientid),
          tags: tags.map((tag) => tag.tagid),
          ingredient_logic: ingredLogic,
          sortby: sortbyhome,
          reverse: sortreverse,
        });
        setDrinkData(response.recipes);
        // console.log(response.recipes);
        setAlertStatus(false);
      } catch (error) {
        console.log("Search name broken");
        setAlertStatus(true);
      }
    }
    console.log("searching stuff");
    getSearchResults(searchTerm, selectedIngreds, selectedTags);
    // debounce(getSearchResults(searchTerm, selectedIngreds, selectedTags), 500);
  }, [
    searchTerm,
    selectedIngreds,
    ingredLogic,
    selectedTags,
    value,
    sortbyhome,
    sortreverse,
  ]); // Make just value?

  const getListDrink = async () => {
    try {
      const response = await apiCall("recipes", "GET");
      setDrinkData(response.recipes);
      setAlertStatus(false);
    } catch (error) {
      console.log("broken");
      setAlertStatus(true);
    }
  };

  const handleSearchName = (str) => {
    // do shit
    setSearchTerm(str);
    setValue(value + 1);
    // throttle(getSearchResults(str), 500);
    // throttleFunction(getSearchResults(str), 500);
  };

  const updateSelectIngredients = (ingreds) => {
    setSelectedIngreds(ingreds);
    setValue(value + 1);
  };

  const updateTags = (tags) => {
    setSelectedTags(tags);
    setValue(value + 1);
  };

  return (
    <>
      <Box>
        <Box
          id="homeSearchBar"
          sx={{
            backgroundColor: "#EFDABD",
            width: "100%",
            height: 85,
          }}
        >
          <TextField
            sx={{
              width: "95%",
              height: 40,
              marginTop: 2,
            }}
            onChange={(e) => handleSearchName(e.target.value)}
            // value={searchTerm}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="10" />
                </InputAdornment>
              ),
            }}
            label="search for your drink"
            variant="outlined"
          />
        </Box>
        <Box display="flex">
          <Box
            id="leftSideHome"
            sx={{
              width: "25vw",
              backgroundColor: "#FAEBD9",
              padding: "10px",
              borderRight: "3px solid #88504D",
              minHeight: "87vh",
            }}
          >
            <SearchSort
              setsort={(i) => setSortbyhome(i)}
              setreverse={(i) => setSortreverse(i)}
            />
            <SearchIngreds
              setIngredients={(i) => updateSelectIngredients(i)}
              setIngredLogic={(i) => setIngredLogic(i)}
            />
            <SearchFilter setFilter={(i) => updateTags(i)} />
          </Box>
          <Box
            id="rightSideHome"
            sx={{
              width: "75vw",
              margin: "0 15px",
            }}
          >
            <DrinkList drinkData={drinkData} alertStatus={alertStatus} />
            <AddNewRecipe />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Home;
