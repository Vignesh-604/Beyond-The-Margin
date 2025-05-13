import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Utils/context.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from "./Pages/Home";
import ArticlePage from "./Pages/Articles/Article";
import NotFound from "./Pages/NotFound";
import ProfilePage from "./Pages/Account/Profile";
import EditorPage from './Pages/Articles/Editor.jsx';
import ArticlesList from './Pages/Articles/ArticlesList.jsx';
import AboutPage from './Pages/About.jsx';
import PendingArticle from './Pages/Articles/PendingArticle.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} >
            <Route index element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/articles" element={<ArticlesList />} />
            <Route path="/articles/:articleId" element={<ArticlePage />} />
            <Route path="/publish" element={<EditorPage />} />
            <Route path="/pending/:articleId" element={<PendingArticle />} />
            <Route path="/about" element={<AboutPage />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
    ))

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </GoogleOAuthProvider>
)
