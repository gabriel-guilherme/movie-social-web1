import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavSideBar from '../../components/NavSideBar';

import Footer from '../../components/Footer';

import useUser from '../../hooks/useUser';
import useAuthCheck from "../../hooks/useAuthCheck";
import { UserProvider } from "../../contexts/UserContext";


import './index.css';

export default function MainLayout() {

  const { user } = useUser();
  const loading = useAuthCheck();
  const [artificialLoading, setArtificialLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setArtificialLoading(false);
    }, 2900);

    return () => clearTimeout(timer);
  }, []);

 
  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  if (loading || artificialLoading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <div className="loader2"></div>
      <div className="loader3"></div>
    </div>
  );

  if (!user) return null;

  return (
    <UserProvider value={user}>
      <>
  
        <button
          className="hamburger-btn"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <div id="content" className={menuOpen ? "menu-open" : ""}>
          <NavSideBar className="NavSideBar" onClose={() => setMenuOpen(false)} />

          <Outlet />

          
          
        </div>

        <Footer />
      </>
    </UserProvider>
  );
}
