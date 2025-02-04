import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import IndexScreen from "./screens/index";
import {BrowserRouter, Route, Routes} from "react-router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexScreen/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
