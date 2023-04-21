import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FormInputField from "../components/FormInputField";
import { apiCall } from "../util/api";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
const ingredData = require("../data/ingreds.json");
const tagData = require("../data/tags.json");

function AddRecipe() {
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [imageUrl, setImageUrl] = useState("");
  let [selectIngredients, setSelectIngredients] = useState([]);

  let [selectTags, setSelectTags] = useState([]);
  let [selectedIngred, setSelectedIngred] = useState(null);
  // let [ingredients, setIngredients] = useState([]);
  let ingredients = ingredData.ingredients;
  let tags = tagData.tags;
  // let [method, setMethod] = useState([]);
  let [steps, setSteps] = useState(["", ""]);
  let [value, setValue] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   //setIngredients(apiCall('ingredients', 'GET').)
  //   async function fetchIngredients () {
  //     const response = await apiCall('ingredients', 'GET');
  //     setIngredients(response.ingredients);
  //   }
  //   fetchIngredients()
  // }, [])
  const getIngredientMeasureUnit = () => {
    // data = {
    //   ingredient_info: [{ ingredientid: { quantity: "q", measurement: "m" } }],
    // };

    let ingredientQtyUnit = {};
    for (let i = 0; i < selectIngredients.length; i++) {
      let data = {
        [selectIngredients[i].ingredientid]: {
          quantity: selectIngredients[i].measure,
          measurement: selectIngredients[i].unit,
        },
      };
      ingredientQtyUnit = { ...ingredientQtyUnit, ...data };
    }
    return ingredientQtyUnit;
  };
  const submitRecipe = async () => {
    steps = steps.filter((n) => n);
    let ingredientQtyUnit = getIngredientMeasureUnit();
    if (selectIngredients.length === 0) {
      alert("missing ingredients");
    } else if (steps.length === 0) {
      alert("Missing Method");
    } else {
      // do stuff
      try {
        await apiCall("recipe/add", "POST", {
          name: name,
          description: description,
          ingredients: selectIngredients.map((obj) => obj.ingredientid),
          ingredient_info: ingredientQtyUnit,
          tags: selectTags.map((obj) => obj.tagid),
          imageurl: imageUrl,
          // method: method
          method: steps.join("|"),
        });
        navigate("/home");
      } catch (error) {}
    }
  };

  const setStep = (str, index) => {
    //
    const newSteps = steps;
    newSteps[index] = str;
    setSteps(newSteps);
    setValue(value + 1);
  };

  const removeStep = (index) => {
    const newSteps = steps;
    newSteps.splice(index, 1);
    setSteps(newSteps);
    setValue(value + 1);
  };

  const addStep = () => {
    // steps.push('');
    const newSteps = steps;
    newSteps.push("");
    setSteps(newSteps);
    setValue(value + 1);
  };

  const addIngred = (ingred) => {
    if (ingred === null) return;
    ingred.unit = "";
    ingred.measure = 0;
    let newSelect = selectIngredients;
    newSelect.push(ingred);
    setSelectIngredients(newSelect);
    setValue(value + 1);
  };

  const removeIngred = (ingred) => {
    let newSelect = selectIngredients;
    newSelect.splice(newSelect.indexOf(ingred), 1);
    setSelectIngredients(newSelect);
    setValue(value + 1);
  };

  const changeMeasure = (ingred, measure) => {
    let newSelect = selectIngredients;
    newSelect.find((e) => e === ingred).measure = measure;
    setSelectIngredients(newSelect);
    setValue(value + 1);
  };
  const changeUnit = (ingred, unit) => {
    //
    // console.log(ingred)
    let newSelect = selectIngredients;
    newSelect.find((e) => e === ingred).unit = unit;
    setSelectIngredients(newSelect);
    setValue(value + 1);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FAEBD9",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            border: "2px solid #4B0F20",
            maxWidth: "60vh",
            minHeight: "60vh",
            margin: "20px auto",
            fontFamily: "acumin-pro-condensed, sans-serif",
            fontStyle: "normal",
          }}
        >
          <Typography variant="h3" sx={{ color: "#4B0F20" }}>
            Add Your Recipe
          </Typography>
          {/* <Grid container> */}
          <FormInputField
            id="addRecipeName"
            label="Drink Name"
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "90%" }}
            // value={name}
          />
          <br />
          <FormInputField
            id="addRecipeUrl"
            label="Image Url"
            variant="outlined"
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ width: "90%" }}

            // value={name}
          />
          <br />
          <FormInputField
            id="addRecipeDescription"
            label="Description"
            multiline
            rows={5}
            variant="outlined"
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: "90%", m: 1, marginBottom: "20px" }}

            // value={name}
          />
          <Box sx={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
            <Autocomplete
              id="addIngred"
              sx={{ width: "50%", marginLeft: "38px" }}
              options={ingredients.filter(
                (i) => !selectIngredients.includes(i)
              )}
              onChange={(e, value) => {
                setSelectedIngred(value);
              }}
              value={selectedIngred}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Find an Ingredient Here!"
                  placeholder="Ingredient Name"
                />
              )}
            />
            {/* Add ingred button */}
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={(_) => {
                addIngred(selectedIngred);
                setSelectedIngred(null);
              }}
            >
              Add Ingredient
            </Button>
          </Box>

          {/* Ingredients with measurements */}
          {selectIngredients.map((ingred, index) => {
            return (
              <>
                <Box
                  key={"selectedIngred" + ingred.ingredientid}
                  sx={{
                    margin: "20px 0",
                    p: 3,
                    borderBottom: "1px solid black",
                    borderTop: index === 0 && "1px solid black",
                  }}
                >
                  <TextField
                    disabled
                    label="Name"
                    variant="outlined"
                    value={ingred.name}
                  />
                  <TextField
                    label="Measurement"
                    variant="filled"
                    value={ingred.measure}
                    type="number"
                    sx={{ margin: "0 20px" }}
                    onChange={(e) => changeMeasure(ingred, e.target.value)}
                  />
                  <FormControl>
                    <InputLabel htmlFor={"units-" + ingred.ingredientid}>
                      Unit
                    </InputLabel>
                    {/* <FormControlLabel id={"units-"+ingred.ingredientid}>Units</FormControlLabel> */}
                    <Select
                      id={"units-" + ingred.ingredientid}
                      sx={{ minWidth: 200 }}
                      inputProps={{ sx: { color: "black" } }}
                      label="Unit"
                      value={ingred.unit} // Measurement unit
                      // endAdornment={<InputAdornment position="end">{ingred.unit}</InputAdornment>}
                      onChange={(e) => changeUnit(ingred, e.target.value)}
                    >
                      <MenuItem value="">none</MenuItem>
                      <MenuItem value={"mL"}>mL</MenuItem>
                      <MenuItem value={"g"}>gram(s)</MenuItem>
                      <MenuItem value={"cup(s)"}>cup(s)</MenuItem>
                      <MenuItem value={"tablespoon(s)"}>tablespoon(s)</MenuItem>
                      <MenuItem value={"teaspoon(s)"}>teaspoon(s)</MenuItem>
                      <MenuItem value="dashes">dashes</MenuItem>
                      <MenuItem value="leaves">leaves</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    aria-label="delete"
                    onClick={(_) => removeIngred(ingred)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <br />
                </Box>
              </>
            );
          })}
          <Autocomplete
            multiple
            id="addRecipeTags"
            value={selectTags}
            onChange={(e, newValue) => {
              setSelectTags(newValue);
            }}
            options={tags}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Tags"
                placeholder="Tag Name"
              />
            )}
            sx={{ width: "90%", margin: "auto", marginBottom: "20px" }}
          />

          {/* <FormInputField
            id='addRecipeMethod'
            label='Method'
            multiline
            rows={5}
            variant='outlined'
            onChange={e => setMethod(e.target.value)}
            // value={name}
          /><br /> */}
          {/* TODO: put multiple steps in here */}
          <Box
            sx={{
              textAlign: "left",
              padding: "10px 40px",
              borderTop: "1px solid black",
            }}
          >
            <Typography variant="h5" sx={{ color: "#4B0F20" }}>
              Method
            </Typography>
            {steps.map((step, index) => {
              if (index === 0) {
                // Can't remove all steps
                return (
                  <Box key={index}>
                    <FormInputField
                      label={"Step " + (index + 1)}
                      variant="outlined"
                      value={step}
                      onChange={(e) => setStep(e.target.value, index)}
                      sx={{ width: "93%", margin: "" }}
                    />
                    <br />
                  </Box>
                );
              } else {
                return (
                  <Box key={index} sx={{ display: "flex", gap: "0" }}>
                    <FormInputField
                      label={"Step " + (index + 1)}
                      variant="outlined"
                      // value={step}
                      onChange={(e) => setStep(e.target.value, index)}
                      sx={{ width: "100%", marginLeft: "8px" }}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={(_) => removeStep(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <br />
                  </Box>
                );
              }
            })}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={(_) => addStep()}
              sx={{
                float: "left",
                marginLeft: "73px",
                marginTop: "10px",
                marginBottom: "30px",
                width: "130px",
              }}
            >
              Add Step
            </Button>
            <Button
              id="addRecipeSubmit"
              type="button"
              size="large"
              onClick={(_) => submitRecipe()}
              sx={{ margin: "auto", marginBottom: "10px" }}
            >
              Add recipe
            </Button>
          </Box>

          {/* TODO: Verification steps can't be empty */}
          {/* </Grid> */}
        </Box>
      </Box>
    </>
  );
}

export default AddRecipe;
