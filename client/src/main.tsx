import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import IndexScreen from "./screens/index";
import LoginPage from "./screens/LoginPage"
import Layout from "./screens/layout"
import SignUpPage from "./screens/SignUpPage"
import UserPage from "./screens/UserPage"
import CreateArticlePage from "@/screens/CreateArticlePage.tsx";
import UpdateArticlePage from "@/screens/UpdateArticlePage.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import {ApolloProvider} from "@apollo/client";
import client from './apolloClient';
import {AuthProvider} from "@/context/AuthContext.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import GuestRoute from "@/components/GuestRoute.tsx";
import {ArticleProvider} from "@/context/ArticleContext.tsx";
import {CommentProvider} from "@/context/CommentContext.tsx";
import ArticlePage from "@/screens/ArticlePage.tsx";

createRoot(document.getElementById('root')!).render(
<StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <ArticleProvider>
                    <CommentProvider>
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
                                    <Route
                                        path="/articlepage/:id"
                                        element={
                                            <ArticlePage/>
                                        }
                                    />
                                                              <Route path="/updatearticle/:id" element={<UpdateArticlePage/>}/>

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
                    </CommentProvider>
                </ArticleProvider>
            </AuthProvider>
        </ApolloProvider>
    </StrictMode>,
)
