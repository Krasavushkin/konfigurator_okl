import React from 'react';
import './App.css';
import {Konfigurator2} from "./konfigurator_okl/Konfigurator2";
import {HelpSidebar} from "./konfigurator_okl/services/HelpSidebar";

function App() {
    return (
        <div className="App">
            <HelpSidebar />

            <Konfigurator2 />
        </div>
    );
}

export default App;
