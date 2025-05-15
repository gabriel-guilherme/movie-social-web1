
//import './App.css';
import React from "react";
import Home from "./pages/Home";
import { Link } from 'react-router-dom';
import AppRoutes from './routes';

import './app.css';

function App() {
  return (
    <>
      <div id="content">
        <AppRoutes />
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
