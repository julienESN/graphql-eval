import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import IndexScreen from "./screens/index";
import LoginPage from "./screens/LoginPage"
import Layout from "./screens/layout"
import {BrowserRouter, Route, Routes} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route element={<Layout />}>
          <Route path="/" element={<IndexScreen/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
