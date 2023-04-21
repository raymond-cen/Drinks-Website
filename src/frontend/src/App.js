import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import appTheme from "./themes/theme";
import Home from "./pages/Home";
import RandomDrinkGenerator from "./pages/randomDrinkGenerator";
import DrinkQuiz from "./pages/drinkQuiz";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Register from "./pages/register";
import AddRecipe from "./pages/addRecipe";
import Drink from "./pages/drink";
import NavBar from "./components/navbar";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <div className="App">
        <BrowserRouter>
          <nav>
            <NavBar />
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/randomDrinkGenerator"
              element={<RandomDrinkGenerator />}
            />
            <Route path="/drinkQuiz" element={<DrinkQuiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipe/add" element={<AddRecipe />} />
            <Route path="/recipe/:id" element={<Drink />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
