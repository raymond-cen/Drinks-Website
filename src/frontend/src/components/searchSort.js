import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, InputAdornment, MenuItem, Select, TextField, FormGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import apiCall from "../util/api";
import PropTypes from "prop-types";
// import ForceUpdate from '../util/forceUpdate';

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function SearchSort({setsort, setreverse}) {
  const [sortby, setSortby] = useState("0");

  const setCriteria = (t) => {
	  setSortby(t);
	  if (t < 2) {
		  setsort("name");
	  } else if (t < 4) {
		  setsort("date");
	  } else if (t < 6) {
		  setsort("rating");
	  } else {
		  setsort("popularity");
	  }
	  setreverse(t % 2 == 1);
  }

  return (
      <Box
        id="searchSortHome"
        sx={{
          backgroundColor: "primary.main",
          border: "2px solid #4B0F20",
          borderRadius: "10px",
          marginBottom: "15px",
          overflow: "hidden"
        }}
      >
          <Box sx={{backgroundColor: "#88504D"}}>
            <FormControl sx={{width: "90%", paddingTop: "1em", paddingBottom: "1em"}} size="small">
              <Select
                value={sortby}
                onChange={e => setCriteria(e.target.value)}
                inputProps={{sx: {color: "#FFFFFF"}}}
              >
                <MenuItem value="0">Name (A-Z)</MenuItem>
                <MenuItem value="1">Name (Z-A)</MenuItem>
                <MenuItem value="2">Date (Old - New)</MenuItem>
                <MenuItem value="3">Date (New - Old)</MenuItem>
                <MenuItem value="4">Rating (Low - High)</MenuItem>
                <MenuItem value="5">Rating (High - Low)</MenuItem>
                <MenuItem value="6">Popularity (Low - High)</MenuItem>
                <MenuItem value="7">Popularity (High - Low)</MenuItem>
              </Select>
            </FormControl>
          </Box>
	  </Box>
  );
}

export default SearchSort;
