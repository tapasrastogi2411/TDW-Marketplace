import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./pages/Main";
import Login from "./pages/Login";
import AddItem from "./pages/AddItem";
import JoinAuction from "./components/JoinAuction";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/auction_session/:auctionId" element={<JoinAuction />} />
      <Route path="login" element={<Login />}></Route>
      <Route path="listing/new" element={<AddItem />}></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
