// src/layouts/MainLayout/index.jsx
import React from 'react';
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

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <p>Você precisa estar logado.</p>;

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
