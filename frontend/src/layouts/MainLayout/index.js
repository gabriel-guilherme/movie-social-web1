import React from 'react';
import { Outlet } from 'react-router-dom';
import NavSideBar from '../../components/NavSideBar';
import TopicSideBar from '../../components/TopicSideBar';
import Footer from '../../components/Footer';

import './index.css';

export default function MainLayout() {
  return (
    <>
      <div id="content">
        <NavSideBar />

          <Outlet />

        <TopicSideBar />
      </div>

      <Footer />
    </>
  );
}
