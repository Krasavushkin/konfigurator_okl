import React from 'react';
import './App.css';
import {Konfigurator} from "./konfigurator_okl/Konfigurator";
import {OnboardingSidebar} from "./konfigurator_okl/services/OnboardingSidebar";
import {Konfigurator2} from "./konfigurator_okl/Konfigurator2";

function App() {
    return (
        <div className="App">
            <OnboardingSidebar/>
            {/*<Konfigurator/>*/}
            <Konfigurator2 />
        </div>
    );
}

export default App;
