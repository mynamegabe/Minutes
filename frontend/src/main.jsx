import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Main } from './pages/Main'
import { Login } from './pages/Login'
import { Editor } from './pages/Editor'
import { Register } from './pages/Register';
import { Nav } from './components/Navbar'

export default function App() {
  return (
    <NextUIProvider>
    <main className="dark text-foreground bg-background">
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="/" element={<Main />} />
            <Route path="login" element={<Login />} />
            {/* <Route path="register" element={<Register />} /> */}
            <Route path="editor" element={<Editor />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
    </NextUIProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
