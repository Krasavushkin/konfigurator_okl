import React from 'react';
import './App.css';
import {Konfigurator} from "./konfigurator_okl/Konfigurator";
import {OnboardingSidebar} from "./konfigurator_okl/services/OnboardingSidebar";

function App() {
    return (
        <div className="App">
            <OnboardingSidebar/>
            <Konfigurator/>
        </div>
    );
}

export default App;
