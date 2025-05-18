import React from "react";
import PostMain from "../../components/PostMain/index";
import useAuthCheck from "../../hooks/useAuthCheck";

import './index.css';

export default function Home() {
    const loading = useAuthCheck();
    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    return (
        <PostMain/> 
    );
}