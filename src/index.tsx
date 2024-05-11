import "./i18n";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterRoot} from './routes';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <RouterRoot/>
        </BrowserRouter>
    </React.StrictMode>
);

