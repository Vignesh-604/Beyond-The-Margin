# Beyond The Margin

**Beyond The Margin** is a full-stack MERN-based digital journal platform that allows users to publish, explore, and interact with articles on a wide range of topics across various categories. It supports community-driven content, user engagement, and personalized profiles.

## Tech Stack

### Frontend

* **React** with **Vite**
* **React Router DOM** for navigation
* **Tailwind CSS**
* **Axios** for API communication
* **React Markdown** for article rendering
* **Toastify & SweetAlert2** for notifications
* **Deployment**: Vercel

### Backend

* **Node.js**, **Express.js**
* **MongoDB** with **Mongoose**
* **Google OAuth 2.0** 
* **Cookie-based JWT Authentication** (secure, HTTP-only cookies)
* **Multer** for file uploads
* **Cloudinary** for image hosting and optimization
* **CORS** and **dotenv** for configuration
* **Deployment**: Render

---

## Core Features

* **User Authentication**

  * Google OAuth login/signup
  * Encrypted JWT stored in cookies
  * Auto session persistence with refresh tokens

* **Markdown-powered Article Editor**

  * Rich text with support for headings, code, links, images
  * Live preview support on frontend

* **Content Publishing**

  * Authenticated users can create, edit, delete articles
  * Image support via Cloudinary (handled by Multer)

* **User Interactions**

  * Like / Dislike articles
  * Bookmark articles for future reading
  * Follow / Unfollow users

* **Public Profiles**

  * View articles by user
  * See followers/following

* **Routing & Navigation**

  * Clean SPA experience with React Router
  * Protected routes for user-specific content

---

## Future Enhancements

* [ ] **Pagination** for articles in user profiles
* [ ] **Follow status indicators** (followed/not followed) in follower/following list
* [ ] **Similar Articles** suggestion on article detail view
* [ ] **Improved Error Handling** for frontend and backend responses
* [ ] **Category-based Article Showcase** with filters and tags
* [ ] **Clickable Category Badges** to show related articles

---

## Installation Prerequisites

* Node.js, npm
* MongoDB instance (local or Atlas)
* Cloudinary account (for images)
* Google OAuth credentials

## Running Locally

Backend and frontend run **separately** (matching how they're deployed — backend on Render, frontend on Vercel).

Install dependencies:

```bash
cd Backend
npm install
```

```bash
cd Frontend
npm install
```

Run each in its own terminal:

```bash
cd Backend
npm run dev    # → http://localhost:5000
```

```bash
cd Frontend
npm run dev    # → http://localhost:5173
```

The frontend proxies `/api/*` to the backend automatically
(`http://localhost:5000`, configurable via `VITE_PROXY`). In development the
backend allows CORS from any `localhost` origin, so the frontend works
regardless of which port it runs on.

> Note: Google OAuth requires the frontend origin (`http://localhost:<port>`)
> to be registered in Google Cloud Console → OAuth Client.

## Deployment

* **Frontend**: Deployed on **Vercel**
* **Backend**: Deployed on **Render**
* Environment variables securely stored on both platforms
