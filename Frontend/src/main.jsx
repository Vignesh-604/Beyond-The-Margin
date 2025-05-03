import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ArticlePage from "./Pages/Articles/Article";
import NotFound from "./Pages/NotFound";
import ProfilePage from "./Pages/Profile";
import EditorPage from './Pages/Articles/Editor.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} >
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/article" element={<ArticlePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    ))

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
    </GoogleOAuthProvider>
)
