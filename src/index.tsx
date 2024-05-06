import "./i18n";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterRoot} from './routes';
import {BrowserRouter} from "react-router-dom";
import {HeaderISA} from "./components/HeaderISA";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <HeaderISA/>
            <RouterRoot/>
        </BrowserRouter>
    </React.StrictMode>
);

