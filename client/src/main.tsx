import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import IndexScreen from "./screens/index";
import LoginPage from "./screens/LoginPage"
import Layout from "./screens/layout"
import SignUpPage from "./screens/SignUpPage"
import UserPage from "./screens/UserPage"
import CreateArticlePage from "@/screens/CreateArticlePage.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import {ApolloProvider} from "@apollo/client";
import client from './apolloClient';
import {AuthProvider} from "@/context/AuthContext.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import GuestRoute from "@/components/GuestRoute.tsx";
import {ArticleProvider} from "@/context/ArticleContext.tsx"; // Chemin vers votre Apollo Client

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <ArticleProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout/>
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<IndexScreen/>}/>
                        <Route path="/user" element={<UserPage/>}/>
                        <Route path="/createarticle" element={<CreateArticlePage/>}/>

                    </Route>
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <LoginPage/>
                            </GuestRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <GuestRoute>
                                <SignUpPage/>
                            </GuestRoute>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </ArticleProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
