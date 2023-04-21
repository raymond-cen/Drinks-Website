import React from 'react';
import { Button, Box, Typography } from "@mui/material";
import { apiCall } from "../util/api";

import SearchIngreds from './searchIngreds';
import SearchFilter from './searchFilter';
import DrinkRandom from './drinkRandom';

function Generator () {
  const [randomDrink, setRandomDrink] = React.useState(null);
  const [ingredients, setIngredients] = React.useState(null);
  const [ingredLogic, setIngredLogic] = React.useState('');
  const [filters, setFilters] = React.useState(null);

  const generateRandom = async () => {
    try {
      const response = await apiCall("recipe/search", "POST", {
        random: true,
        ingredients: ingredients ? ingredients.map((ingred) => ingred.ingredientid) : [],
        tags: filters.map((tag) => tag.tagid),
        ingredient_logic: ingredLogic,
      })
      setRandomDrink(response.recipes[0]);
    } catch (error) {
      console.log("random is broken");
      console.log(error)
    }
  };

  return <>
    <Button
      onClick={generateRandom}
      sx={{
        width: '100vw',
        fontFamily: 'acumin-pro-condensed, sans-serif',
        fontSize: 30,
        fontWeight: 800,
        fontStyle: 'normal',
      }}
    >GENERATE A RANDOM DRINK</Button>
    <Typography
      sx={{fontFamily: 'acumin-pro-condensed, sans-serif',
        fontSize: 20,
        fontWeight: 400,
        fontStyle: 'light',
      }}
    >FILTER YOUR SEARCH</Typography>
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box sx={{width: '50vw'}}>
        <SearchIngreds setIngredients={setIngredients} setIngredLogic={setIngredLogic}/>  
      </Box>
      <Box sx={{width: '50vw'}}>
        <SearchFilter setFilter={setFilters}/> 
      </Box>
    </Box>
    {randomDrink ? <DrinkRandom randomDrink={randomDrink}/> : <></>}
  </>
};

export default Generator;