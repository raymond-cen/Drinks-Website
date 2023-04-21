import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import apiCall from "../util/api";
import PropTypes from "prop-types";
// import ForceUpdate from '../util/forceUpdate';

const ingredData = require('../data/ingreds.json');
const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

// function ForceUpdate(){
//   // eslint-disable-next-line
//   const [value, setValue] = useState(0); // integer state
//   return () => setValue(value => value + 1); // update state to force render
//   // An function that increment 👆🏻 the previous state like here
//   // is better than directly setting `value + 1`
// }

function SearchIngreds({ setIngredients, setIngredLogic }) {
  // const [ingreds, setIngreds] = useState([]);
  const ingreds = ingredData.ingredients;
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [logic, setLogic] = useState('and');
  const [value, setValue] = useState(0);

  // useEffect(() => {
  //   // TODO: change when full ingredients added
  //   const getIngredients = async () => {
  //     try {
  //       const response = await apiCall("ingredients", "GET");
  //       console.log(response);
  //       setIngreds(response.ingredients);
  //     } catch (error) {
  //       console.log("Get ingreds broken");
  //     }
  //   };

  //   getIngredients().catch(console.error);
  // }, []);

  useEffect(() => {
    setIngredients(selected);
    setIngredLogic(logic);
    setValue(value+1);
    // console.log(value);
    // ForceUpdate();
  }, [selected, logic]);

  // get ingreds

  const selectIngredient = (ingred) => {
    //if ([selected].includes(ingred)) return;
    // console.log(ingred);
    // console.log(selected);
    if (selected.includes(ingred)) {
      console.log('already selected');
      return;
    }
    const newSelect = selected;
    newSelect.push(ingred);
    // console.log("Thing:");
    // console.log(newSelect);
    setSelected(newSelect);
    setIngredients(newSelect);
    setValue(value + 1);
  };

  const unselectIngred = (ingred) => {
    const newSelect = selected;
    setSelected(newSelect.filter((i) => i !== ingred));
    setIngredients(newSelect.filter((i) => i !== ingred));
    setValue(value + 1);
  };

  const getLogicDescription = () => {
    if (logic === "or") {
      return "Matches recipes with any selected ingredients";
    } else if (logic === "and") {
      return "Matches recipes with all selected ingredients";
    } else if (logic === "all") {
      return "Matches recipes that only contain selected ingredients";
    } else {
      return "Gives ingreds I guess" //FIXME:
    }
  }

  const sectionHeight = "35vh";

  const chipsHeight = "calc(" + sectionHeight + " - 113px)";

  return (
    <>
      <Box
        id="searchByIngredHome"
        sx={{
          height: sectionHeight,
          backgroundColor: "primary.main",
          border: "2px solid #4B0F20",
          borderRadius: "10px",
          marginBottom: "15px",
          overflow: "hidden"
        }}
      >
        <Box
          id="ingredSearchBar"
          sx={{
            backgroundColor: "#88504D",
            width: "100%",
          }}
        >
          <TextField
            id="searchBar"
            sx={{
              backgroundColor: "#88504D",
              width: "100%",
              height: 48,
              marginTop: 1,
            }}
            InputProps={{
              style: {
                width: "100%",
                fontWeight: "bold",
                color: "#FFFFFF",
                opacity: "1",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="large"
                    sx={{
                      color: "#EFDABD",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            placeholder="search for ingredients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
          />
          <Box sx={{backgroundColor: "#88504D"}}>
            <FormControl sx={{width: "90%"}} size="small">
              <Select
                value={logic}
                onChange={e => setLogic(e.target.value)}
                inputProps={{sx: {color: "#FFFFFF"}}}
              >
                <MenuItem value="all">Match only</MenuItem>
                <MenuItem value="and">Match all</MenuItem>
                <MenuItem value="or">Match any</MenuItem>
              </Select>
              <FormHelperText sx={{color: "#FFFFFF", textAlign: "center"}}>{getLogicDescription()}</FormHelperText>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ overflow: "auto", height: chipsHeight }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              listStyle: "none",
              p: 0.5,
              m: 0,
              overflow: "hidden",
            }}
            component="ul"
          >
            {/* List of chips for ingredients */}
            {selected.map((data) => {
              return (
                <ListItem key={data.ingredientid}>
                  <Chip
                    label={data.name}
                    onClick={(_) => unselectIngred(data)}
                  />
                </ListItem>
              );
            })}
            {/* TODO: filter not working well */}
            {ingreds &&
              ingreds
                .filter(
                  (ingred) =>
                    !selected.includes(ingred) &&
                    ingred.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((data) => {
                  return (
                    <ListItem key={data.ingredientid}>
                      <Chip
                        label={data.name}
                        variant="outlined"
                        onClick={(_) => selectIngredient(data)}
                      />
                    </ListItem>
                  );
                })}
          </Box>
        </Box>
      </Box>
    </>
  );
}

SearchIngreds.propTypes = {
  setIngredients: PropTypes.func,
  setIngredLogic: PropTypes.func
};

export default SearchIngreds;
