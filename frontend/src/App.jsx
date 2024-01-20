
import './App.css'
import {Main} from './pages/Main'
import {Login} from './pages/Login'
import {Editor} from './pages/Editor'

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/" element={<Main />} />
          <Route path="login" element={<Login />} />
          {/* <Route path="register" element={<Register />} /> */}
          <Route path="editor" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
