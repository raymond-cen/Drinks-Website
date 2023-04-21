import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function SavedRecipes ({recipes, setDetailedRecipe}) {
  const[savedRecipes, setSavedRecipes] = useState(recipes);
  console.log(savedRecipes)

  const handleClickOnRecipe = (recipe) => {
    setDetailedRecipe({
      type: "saved",
      recipe: recipe
    });
  }

  const renderRecipeList = () => {
    return (
    <>
      {savedRecipes.map((recipe) => {
        return (
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              handleClickOnRecipe(recipe);
            }}>
              <ListItemText primary={recipe.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </>
    );
  }
    return <>
      {savedRecipes.length !== 0 ? (
          <InfiniteScroll
            dataLength={savedRecipes.length}
            loader={<p>Loading...</p>}
            endMessage={<p>No more recipes</p>}
          >
            <List>
              {renderRecipeList()}
            </List>
          </InfiniteScroll>
        ) : (
          <>Nothing here</>
        )}
    </>
}

export default SavedRecipes;