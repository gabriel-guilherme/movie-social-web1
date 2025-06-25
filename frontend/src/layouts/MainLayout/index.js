// src/layouts/MainLayout/index.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavSideBar from '../../components/NavSideBar';
import TopicSideBar from '../../components/TopicSideBar';
import Footer from '../../components/Footer';

import useUser from '../../hooks/useUser';
import useAuthCheck from "../../hooks/useAuthCheck";
import { UserProvider } from "../../contexts/UserContext";

import './index.css';

export default function MainLayout() {
  const { user } = useUser();
  const loading = useAuthCheck();
  const [artificialLoading, setArtificialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setArtificialLoading(false);
    }, 2900);

    return () => clearTimeout(timer);
  }, []);

  if (loading || artificialLoading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <div className="loader2"></div>
    </div>
  );

  if (!user) return null;

  return (
    <UserProvider value={user}>
      <div id="content">
        <NavSideBar />
        <Outlet />
        <TopicSideBar />
      </div>
      <Footer />
    </UserProvider>
  );
}
