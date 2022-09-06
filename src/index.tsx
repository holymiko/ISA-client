import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterRoot} from './routes';
import {BrowserRouter} from "react-router-dom";
import {SidebarISA} from "./components/SidebarISA";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
          <SidebarISA>
            <RouterRoot />
          </SidebarISA>
        </BrowserRouter>
    </React.StrictMode>
);

