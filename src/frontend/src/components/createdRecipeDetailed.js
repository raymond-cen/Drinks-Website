import React, { useEffect, useState } from "react";
import apiCall from "../util/api";
import { Box, Button, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";

function CreatedRecipeDetailed ({detailedRecipe}) {
  const navigate = useNavigate()

  const handleSeeMore = () => {
    navigate(`/recipe/${detailedRecipe.recipe.recipeid}`);
  }

  const handleDelete = async () => {
    try {
      await apiCall(`recipe/${detailedRecipe.recipe.recipeid}`, "DELETE");
      window.location.reload()

    } catch (error) {
      console.log(error)
    }
  }

  console.log(detailedRecipe)
  return <>
    <Box>
      <Box>
        <Typography sx={{
          fontSize: "42px",
          fontWeight: "bold",
          color: "#4B0F20",
          textAlign: "left"
        }}>
          {detailedRecipe.recipe.name}
        </Typography>
        <Divider sx={{borderBottomWidth: 5}}/>
      </Box>
      <Box sx={{display: "flex", marginTop: "10px"}}>
        <Box>
          <Box component="img" sx={{
            border: "1px solid #88504D",
            borderRadius: "18px",
            height: 250,
            width: 250,
          }} src={detailedRecipe.recipe.imageurl} />
          <Box sx={{
            display: "flex", 
            justifyContent: "center",
            gap: "10px",
            }}>
            <Button onClick={handleSeeMore} fx={{backgroundColor: "#c8957c", color: "#4b0f20"}}>See more</Button>
            <Button onClick={handleDelete} fx={{backgroundColor: "#c8957c", color: "#4b0f20"}}>Delete Recipe</Button>
          </Box>
        </Box>
        <Box sx={{textAlign: "justify", marginLeft: "5px", width: "100%", color: "#4b0f20"}}>
          <h4  style={{color: "#4B0F20"}}>DESCRIPTION</h4>
          <Typography sx={{
            fontSize: "24px",
            color: "#4B0F20",
          }}>
            {detailedRecipe.recipe.description}
          </Typography>
          <Divider sx={{borderBottomWidth: 5}}/>
          <Box sx={{
            display: "flex",
            justifyContent: "space-around",
            fontWeight: "bold"}}>
            <Box sx={{
              display: "flex",
              overflow: "auto",
              flexDirection: "column",
              flexWrap: "wrap",
              margin: "0px 15px 15px",
              }}>
              INGREDIENTS
              <Typography>
                {detailedRecipe.recipe.ingredients.map((ingredient, index) => {
                  return (<>
                    <Typography sx={{
                      display: "list-item",
                      textAlign: "left",
                      listStylePosition: "inside",
                      fontSize: "18px",
                      fontWeight: "bold"
                    }}>
                      {ingredient}
                    </Typography>
                  </>)
                })}
              </Typography>

            </Box>
            <Box sx={{
              overflow: "auto"}}>
              METHOD
              <Typography
                noWrap
                sx={{
                  fontSize: "18px",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}
              >
                {detailedRecipe.recipe.method.split('|').map((step, index) => {
                  return <>{index+1}. {step}<br/></>
                })}
              </Typography>
            </Box>
          </Box>  
        </Box>
      </Box>
    </Box>
  </>
}

export default CreatedRecipeDetailed