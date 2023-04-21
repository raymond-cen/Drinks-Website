import React, { useEffect, useState } from "react";
import apiCall from "../util/api";
import { Box, Button, Modal, Typography } from "@mui/material";
import PropTypes from "prop-types";
import SavedRecipes from "../components/savedRecipes";
import CreatedRecipes from "../components/createdRecipes";
import SavedRecipeDetailed from "../components/savedRecipeDetailed";
import CreatedRecipeDetailed from "../components/createdRecipeDetailed";
import EditModal from "../components/editModal";

function Profile () {
  const[userInfo, setUserInfo] = useState({});
  const[savedRecipes, setSavedRecipes] = useState(null);
  const[myRecipes, setMyRecipes] = useState(null);
  const [displayStatus, setDisplayStatus] = useState(null);
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const profileResp = await apiCall("user", "GET");
        console.log(profileResp);
        setUserInfo(profileResp);
        setSavedRecipes(profileResp.saved_recipes);
        setMyRecipes(profileResp.my_recipes)
      } catch (error) {
        console.log("broken");
      }
    };

    getUserInfo();
  }, []);
    // return userInfo.username, userInfo.email, userInfo.image_url, userInfo.saved_recipes, userInfo.my_recipes

  if (savedRecipes === null || myRecipes === null) {
    return null;
  }

  const handleSaved = () => {
    setDisplayStatus("Saved")
    console.log("saved")
  }

  const handleCreated = () => {
    setDisplayStatus("Created")
    console.log("created")
  }

  const renderDetailed = () => {
    if (detailedRecipe === null) {
      return (
        <>
          <p>Click on a recipe</p>
        </>
      )
    }
    else if (detailedRecipe.type === "saved") {
      return (
        <>
          <SavedRecipeDetailed detailedRecipe={detailedRecipe}/>            {/* Detailed saved recipe component here*/}
        </>
      )
    }
    else {
      return (
        <>
          <CreatedRecipeDetailed detailedRecipe={detailedRecipe}/>           {/* Detailed created recipe component here*/}
        </>
      )
    }
  }

  const detailsSection = () => {
    let image = userInfo.image_url;

    if (image === "" || image === null) {
      image = "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png";
    }
    return (
      <Box sx={{
        display: "flex",
        margin: "15px",
        gap: "30%",
        flexWrap: "wrap"

      }}>
        <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
        }}>
          <Box
            component="img"
            sx={{
              display: "inline-block",
              border: "1px solid #88504D",
              borderRadius: "18px",
              height: 250,
              width: 350,
              maxHeight: { xs: 260, md: 210 },
              maxWidth: { xs: 350, md: 300 },
                
            }}
            src={image}
          />
          <Box sx={{ display: "inline-block" }}>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                textAlign: "left",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                color: "#4B0F20",
                fontSize: "36px",
              }}
            >
              {/*USERNAME: {userInfo.username} <br/>
              EMAIL: {userInfo.email}*/}

              <Box>
                USERNAME:
              </Box>
              <Box>
                {userInfo.username}
              </Box>
              <Box>
                EMAIL:
              </Box>
              <Box>
                {userInfo.email}
              </Box>

            </Typography>
          </Box>
        </Box>
        
        <Button sx={{
          backgroundColor: "#c8957c",
          color: "black",
          fontWeight: "bold",
          width: 100,
          height: 60
        }} onClick={() => {setEditModalOpen(true)}}> {/*Display popup for edit onclick*/}
          Edit
        </Button>
        <EditModal userInfo={userInfo} editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen}/>
      </Box>

    );
  };

  const recipesSection = () => {
    return (
      <>
        <Box sx={{
          textAlign: "left",
          marginLeft: "15px"
        }}>
          <Button onClick={handleSaved} sx={{
              backgroundColor: "#88504d",
              borderRadius: "10px",
              color: "white",
              width: 400,
              height: 40,
              fontSize: "36px",
              fontWeight: "bold"
          }}>
            Saved
          </Button>
          <Button onClick={handleCreated} sx={{
              backgroundColor: "#88504d",
              borderRadius: "10px",
              color: "white",
              width: 400,
              height: 40,
              fontSize: "36px",
              fontWeight: "bold"
          }}>
            Created
          </Button> 
        </Box>
        <div style={{
            display: "flex",
            backgroundColor: "#efdabd",
            color: "#4b0f20",
            height: "50%",
            padding: "5px",
            borderRadius: "18px",
            marginLeft: "15px",
            marginRight: "15px",}}>
          {displayStatus !== "Created" ? (
            <>
            <Box sx={{
              height: "90%",
              width: "25%",
              border: "1px solid #88504D",
              margin: "15px",
              borderRadius: "18px",
              backgroundColor: "#faebd9",
              overflow: "auto"
            }}>
              <SavedRecipes recipes={savedRecipes} setDetailedRecipe={setDetailedRecipe}/>
            </Box>
          </>
          ) : (
            <Box sx={{
              height: "90%",
              width: "25%",
              border: "1px solid #88504D",
              margin: "15px",
              backgroundColor: "#faebd9",
              borderRadius: "18px",
              overflow: "auto"
            }}>
              <CreatedRecipes recipes={myRecipes} setDetailedRecipe={setDetailedRecipe}/>
            </Box>
          )}
          <Box sx={{
            display: "inline-block",
            height: "85%",
            width: "75%",
            border: "1px solid #88504D",
            margin: "15px",
            backgroundColor: "#faebd9",
            borderRadius: "18px",
            padding: "10px",
            overflow: "auto"
          }}>
            {renderDetailed()}
          </Box>
        </div>
      </>
    );
  };

  const globalProfileStyle = {
    backgroundColor: "#faebd9",
    textAlign: "center",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "acumin-pro-condensed, sans-serif"

  }
    return <>
      <div style={globalProfileStyle}>
        {detailsSection()}
        {recipesSection()}
      </div>
    </>
}

export default Profile;