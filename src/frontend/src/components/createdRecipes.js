import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function CreatedRecipes ({recipes, setDetailedRecipe}) {
  const[createdRecipes, setCreatedRecipes] = useState(recipes);
  console.log(createdRecipes)

  const handleClickOnRecipe = (recipe) => {
    setDetailedRecipe({
      type: "created",
      recipe: recipe
    });
  }

  const renderRecipeList = () => {
    return (
    <>
      {createdRecipes.map((recipe, key) => {
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
      {createdRecipes.length !== 0 ? (
          <InfiniteScroll
            dataLength={createdRecipes.length}
            loader={<p>Loading...</p>}
            endMessage={<p>No more recipes</p>}
          >
            {renderRecipeList()}
          </InfiniteScroll>
        ) : (
          <>Nothing here</>
        )}
    </>
}

export default CreatedRecipes;