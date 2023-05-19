import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
//
import Layout from "./pages/Layout";

import Sign from "./pages/Sign";
//redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/user";
import setAuthToken from "./utils/setAuthToken";
import { LOGOUT } from "./actions/types";

// game
import Main from './pages/game/Main';
import MainGatcha from "./pages/game/MainGatcha";
import Scoreboard from "./pages/Scoreboard";
import CharacterSelection from "./pages/CharacterSelection";
import Withdraw from "./pages/Withdraw";
import Home from "./pages/Home";
import TokenSelection from "./pages/TokenSelection";

function App() {
  useEffect(() => {
    console.log(process.env);
    // check for token in LS when app first runs
    console.log(localStorage.token);
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
      // connectWallet();
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Layout />}>
            <Route exact index element={<Home />} />
            <Route exact path="signup" element={<Sign />} />
            <Route exact path="token-selection" element={<TokenSelection />} />
            <Route exact path="scoreboard" element={<Scoreboard />} />
            <Route exact path="withdraw" element={<Withdraw />} />
          </Route>
          <Route exact path="game" element={<Main />} />
          <Route exact path="gatcha" element={<MainGatcha />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
