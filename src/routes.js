import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio";

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Main}></Route>
        <Route exact path="/repositorio/:repositorio" Component={Repositorio}></Route>
      </Routes>
    </BrowserRouter>
  );
}
