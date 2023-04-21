import React from 'react';
import { Box,  Button,InputLabel, FormControl, Select, MenuItem, Grid, ToggleButton, ToggleButtonGroup, Alert } from "@mui/material";
import { apiCall } from "../util/api";
import PropTypes from "prop-types";

import DrinkRandom from '../components/drinkRandom';

function DrinkQuiz () {
  const [randomDrink, setRandomDrink] = React.useState(null);
  const [filters, setFilters] = React.useState([]);
  const [ingredients, setIngredients] = React.useState([]);
  const [qIndex, setQIndex] = React.useState(-1);
  const [status, setStatus] = React.useState(true);
  const [questions, setQuestions] = React.useState([
    {
      question: 'What season do you feel like right now?',
      answers: [
        {
          text: 'Summer',
          filter: ['cold'],
          ingred: ['ice'],
        },
        {
          text: 'Autumn',
          tag: ['hot'],
          ingred: '',
        },
        {
          text: 'Winter',
          tag:['hot'],
          ingred: '',
        },
        {
          text: 'Spring',
          tag: ['cold'],
          ingred: ['ice'],
        }
      ]
    },
    {
      question: 'What is your favourite time of day?',
      answers: [
        {
          text: 'Morning',
          tag: ['caffeine', 'caffein'],
          ingred: '',
        },
        {
          text: 'Midday',
          tag: ['fruit'],
          ingred: '',
        },
        {
          text: 'Afternoon',
          tag: ['tea'],
          ingred: ['tea'],
        },
        {
          text: 'Night',
          tag: '',
          ingred: ['milk'],
        }
      ]
    },
    {
      question: 'Are we feeling like today is a healthy day?',
      answers: [
        {
          text: 'Yes',
          tag: '',
          ingred: ['vegetable', 'fruit'],
        },
        {
          text: 'No',
          tag: ['fizzy'],
          ingred:'',
        },
        {
          text: 'Maybe?',
          tag: '',
          ingred: ['vegetable', 'fruit', 'soft drink'],
        },
        {
          text: "Can't decide",
          tag: '',
          ingred: ['vegetable', 'fruit', 'soft drink'],
        }
      ]
    },
    {
      question: 'What is your favourite kind of pie',
      answers: [
        {
          text: 'Apple Pie',
          tag: '',
          ingred: ['apple'],
        },
        {
          text: 'Cherry Pie',
          tag: '',
          ingred: ['cherries'],
        },
        {
          text: 'Raspberry Pie',
          tag: '',
          ingred: ['raspberry'],
        },
        {
          text: 'Pumpkin Pie',
          tag: '',
          ingred: ['pumpkin'],
        }
      ]
    },
    {
      question: 'What game do you like to play more',
      answers: [
        {
          text: 'Minecraft',
          tag: '',
          ingred: ['watermelon'],
        },
        {
          text: 'Tetris',
          tag: '',
          ingred: ['soft drink'],
        },
        {
          text: 'Fortnite',
          tag: ['sugar'],
          ingred: ['sugar'],
        },
        {
          text: 'No Games, They are all Terrible!',
          tag: '',
          ingred: ['celery'],
        }
      ]
    },
    {
      question: 'If you could have any super power, what would it be?',
      answers: [
        {
          text: 'Flight',
          tag: '',
          ingred: ['nuts'],
        },
        {
          text: 'Mind Reading',
          tag: '',
          ingred: ['carrot'],
        },
        {
          text: 'Telekinesis',
          tag: ['vegetarian'],
          ingred: '',
        },
        {
          text: 'Teleportation',
          tag: '',
          ingred: ['matcha'],
        }
      ]
    }
  ]);
  const over18 = [{
    question: 'Alcohol?',
    answers: [
      {
        text: 'Yes',
        filter: ['alcohol'],
        ingred: '',
      },
      {
        text: 'No',
        tag: 'non-alcoholic',
        ingred: '',
      },
      {
        text: 'Maybe',
        tag: ['alcohol'],
        ingred: '',
      },
      {
        text: 'IDK You Choose',
        tag: ['alcohol'],
        ingred: '',
      }
    ]
  }]
  const checkAge = (age) => {
    // set filter, array should be empty at the start
    if (age < 18) {
      const temp = filters;
      temp.push('non-alcoholic');
      setFilters(temp);
    } else {
      const temp = [...over18, ...questions]
      setQuestions(temp);
    }
    setQIndex(qIndex + 1);
  }

  const nextQuestion = (answer, stat) => {
    //add the answer tags to the stuffs
    if (answer.tag) {
      const temp = [...filters, ...answer.tag]
      setFilters(temp);
    }
    if (answer.ingred) {
      const temp = [...ingredients, ...answer.ingred]
      setIngredients(temp);
    }

    if (!stat) {
      submit();
    } else {
      if (!questions[qIndex + 2]) {
        setStatus(false);
      }
      if (questions[qIndex + 1]) {
        setQIndex(qIndex + 1);
      }  
    }
  }
  
  const submit = async() => {
    console.log('submit');
    try {
      const response = await apiCall("recipe/search", "POST", {
        random: true,
        ingredients: ingredients ? ingredients.map((ingred) => ingred.ingredientid) : [],
        filters: filters ? filters.map((filter) => filter.ingredientid) : [],
      })
      setRandomDrink(response.recipes[0]);
    } catch (error) {
      console.log("random is broken");
      console.log(error)
    }
  }

  return <>
    <Box sx={{marginTop: 3}}>
      {randomDrink
      ? <DrinkRandom randomDrink={randomDrink}/>
      : <>
        {qIndex === -1
        ? <>
          <FormControl fullWidth>
            <InputLabel 
              sx={{fontFamily: 'acumin-pro-condensed, sans-serif',
              fontSize: '3vw',
              fontWeight: 300,
              fontStyle: 'normal',
              textAlign: 'center',
              color: 'secondary.dark'
            }}>AGE</InputLabel>
            <Select
              value={10}
              label="Age"
              onChange={e => {
                checkAge(e.target.value);}
              }
              sx={{
                backgroundColor: 'primary.main',
                color: 'secondary.dark'
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={17}>17</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={21}>21</MenuItem>
              <MenuItem value={100}>21+</MenuItem>
            </Select>
          </FormControl>
        </>
        : <>
          <CardFormat
            question={questions[qIndex].question}
            answers={questions[qIndex].answers}
            changed={nextQuestion}
            status={status}/>
        </>}
      </>}  
    </Box>
  </>
}

export default DrinkQuiz;

function CardFormat ({question, answers, changed, status}) {
  const [alignment, setAlignment] =  React.useState(null);
  const [alertStat, setAlertStat] = React.useState(false);

  const handleChange = (event) => {
    setAlertStat(false);
    setAlignment(event.target.value);
  }

  const nextQuestion = () => {
    const ans = parseInt(alignment);
    console.log(answers[ans]);
    if (alignment) {
      changed(answers[ans], status);   
    }
    else {
      setAlertStat(true);
    }
  }

  return <>
  {alertStat
  ? <>
    <Alert severity="error">Please Choose an Answer</Alert>
  </>
  : <></>}
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          sx={{
            fontFamily: 'acumin-pro-condensed, sans-serif',
            fontSize: '3vw',
            fontWeight: 400,
            fontStyle: 'normal',
            textAlign: 'center',
          }}
        >
          {question}  
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="0"
            sx={{
              fontFamily: 'acumin-pro-condensed, sans-serif',
              fontSize: '3vw',
              fontWeight: 300,
              fontStyle: 'light',
              textAlign: 'center',
            }}
          >
            {answers[0].text}
          </ToggleButton>
          <ToggleButton value="1"
            sx={{
              fontFamily: 'acumin-pro-condensed, sans-serif',
              fontSize: '3vw',
              fontWeight: 300,
              fontStyle: 'light',
              textAlign: 'center',
            }}
          >
            {answers[1].text}
          </ToggleButton>
          <ToggleButton value="2"
            sx={{
              fontFamily: 'acumin-pro-condensed, sans-serif',
              fontSize: '3vw',
              fontWeight: 300,
              fontStyle: 'light',
              textAlign: 'center',
            }}
          >
            {answers[2].text}
          </ToggleButton>
          <ToggleButton value="3"
            sx={{
              fontFamily: 'acumin-pro-condensed, sans-serif',
              fontSize: '3vw',
              fontWeight: 300,
              fontStyle: 'light',
              textAlign: 'center',
            }}
          >
            {answers[3].text}
          </ToggleButton>
        </ToggleButtonGroup>  
      </Grid>
    </Grid>
    {status
    ?<><Button onClick={nextQuestion}>Next</Button></>
    :<><Button onClick={nextQuestion}>Show me my Results</Button></>} 
  </>
}

CardFormat.propTypes = {
  question: PropTypes.string,
  answers: PropTypes.array,
  changed: PropTypes.func,
  status: PropTypes.bool,
};
