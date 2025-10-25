import React from 'react';
import './App.css';
import {OnboardingSidebar} from "./konfigurator_okl/services/OnboardingSidebar";
import {Konfigurator2} from "./konfigurator_okl/Konfigurator2";

function App() {
    return (
        <div className="App">
            <OnboardingSidebar/>
            <Konfigurator2 />
        </div>
    );
}

export default App;
