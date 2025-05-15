
//import './App.css';
import React from "react";
import AppRoutes from './routes';
import Footer from "./components/Footer/index";
import NavSideBar from "./components/NavSideBar/index";
import TopicSideBar from "./components/TopicSideBar/index";
import { useLocation } from 'react-router-dom';

import './app.css';



function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/Login' || location.pathname === '/Register';

  return (
    <>
    <div id="header"></div>
      <div id="content">
        {!isAuthPage && <NavSideBar />}
        <AppRoutes />
        {!isAuthPage && <TopicSideBar />}
      </div>
    <Footer />
    </>
  );
}

export default App;
