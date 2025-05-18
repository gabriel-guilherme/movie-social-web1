import React from "react";
import './index.css';

import SideBar from "../SideBar";

export default function TopicSideBar() {
    return (
        <SideBar title={"Topics Side Bar"} className="topic-side-bar">
            <ul>
                <li>Topic1</li>
                <li>Topic2</li>
                <li>Topic3</li>
            </ul>
        </SideBar>
    );
}