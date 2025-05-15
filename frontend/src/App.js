
//import './App.css';
import React from "react";
import Home from "./pages/Home";
import { Link } from 'react-router-dom';
import AppRoutes from './routes';
import NavSideBar from "./components/NavSideBar/index";
import TopicSideBar from "./components/TopicSideBar/index";

import './app.css';

function App() {
  return (
    <>
      <div id="content">
        <NavSideBar/>
        <AppRoutes />
        <TopicSideBar/>
      </div>
      <div id="footer">
        <p>Made with ❤️ by me</p>
        <p>Copyright © 2025</p>
        <p>All rights reserved</p>
      </div>

      
    </>
  );
}

export default App;
