import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import IndexScreen from "./screens/index";
import LoginPage from "./screens/LoginPage"
import Layout from "./screens/layout"
import SignUpPage from "./screens/SignUpPage"
import {BrowserRouter, Route, Routes} from "react-router";
import {ApolloProvider} from "@apollo/client";
import client from './apolloClient';
import {AuthProvider} from "@/context/AuthContext.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx"; // Chemin vers votre Apollo Client

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                   <Route element={<Layout />}>
                      <Route path="/" element={<IndexScreen/>}/>
                   </Route>
                </ProtectedRoute>
              }
            />
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/signup"} element={<SignUpPage/>}/>

          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </ApolloProvider>
  </StrictMode>,
)
