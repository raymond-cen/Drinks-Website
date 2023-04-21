import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import apiCall from "../util/api";
import PropTypes from "prop-types";

const tagData = require('../data/tags.json');
// TODO: Make other file??
const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


function SearchFilter({ setFilter }) {
  // const [tags, setTags] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  // const [logic, setLogic] = useState('and');
  const [value, setValue] = useState(0);
  const tags = tagData.tags;

  // useEffect(() => {
  //   // TODO: change when full tags added
  //   const getTags = async () => {
  //     try {
  //       const response = await apiCall("tag/search", "GET"); // TODO: Check api path
  //       console.log(response);
  //       setTags(response.tags);
  //     } catch (error) {
  //       console.log("Get tags broken");
  //     }
  //   };

  //   getTags().catch(console.error);
  // }, []);

  useEffect(() => {
    setFilter(selected);
    // setFilterLogic(logic);
    setValue(value+1);
    // console.log(value);
    // ForceUpdate();
  }, [selected]);

  // get ingreds

  const selectTag = (tag) => {
    //if ([selected].includes(ingred)) return;
    // console.log(ingred);
    // console.log(selected);
    if (selected.includes(tag)) {
      console.log('already selected');
      return;
    }
    const newSelect = selected;
    newSelect.push(tag);
    // console.log("Thing:");
    // console.log(newSelect);
    setSelected(newSelect);
    setFilter(newSelect);
    setValue(value + 1);
  };

  const unselectTag = (ingred) => {
    const newSelect = selected;
    setSelected(newSelect.filter((i) => i !== ingred));
    setFilter(newSelect.filter((i) => i !== ingred));
    setValue(value + 1);
  };

  // const getLogicDescription = () => {
  //   if (logic === "or") {
  //     return "Matches recipes with any selected ingredients";
  //   } else if (logic === "and") {
  //     return "Matches recipes with all selected ingredients";
  //   } else if (logic === "all") {
  //     return "Matches recipes that only contain selected ingredients";
  //   } else {
  //     return "Gives ingreds I guess" //FIXME:
  //   }
  // }

  const sectionHeight = "35vh";

  const chipsHeight = "calc(" + sectionHeight + " - 48px)";
  return (
    <>
      <Box
        id="filterTagsHome"
        sx={{
          height: sectionHeight,
          backgroundColor: "primary.main",
          border: "2px solid #4B0F20",
          borderRadius: "10px",
          marginBottom: "15px",
          overflow: "hidden",
        }}
      >
        <Box
          id="filterTags"
          sx={{
            backgroundColor: "#88504D",
            width: "100%",
            height: 48,
          }}
        >
          <TextField
            sx={{
              width: "100%",
              height: 5,
              marginTop: 1,
            }}
            InputProps={{
              style: {
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
            placeholder="search for filter"
            variant="standard"
          />
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
            {/* List of chips for tags */}
            {selected.map((data) => {
              return (
                <ListItem key={data.tagid}>
                  <Chip
                    label={data.name}
                    onClick={(_) => unselectTag(data)}
                  />
                </ListItem>
              );
            })}
            {/* TODO: filter not working well */}
            {tags &&
              tags
                .filter((tag) => !selected.includes(tag))
                .map((data) => {
                  return (
                    <ListItem key={data.tagid}>
                      <Chip
                        label={data.name}
                        variant="outlined"
                        onClick={(_) => selectTag(data)}
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

export default SearchFilter;
