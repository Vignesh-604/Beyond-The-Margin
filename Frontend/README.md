# React + Vite
Great questions. Let's go through it step by step:

---

## ✅ Which is Better: Passport or Manual OAuth Flow?

### 📌 **Manual Flow (like in your video)**
You just saw this method being used. It’s:
- ✅ **Lightweight** (no need to learn Passport strategies)
- ✅ **Easier to customize**
- ✅ **Good for simple Google login**
- ✅ **Flexible with JWT and your existing auth system**
- ❌ Slightly more code to handle tokens manually

✅ **Recommended** for your case — especially since you're already using JWT, building your own APIs, and want full control.

---

### 📌 Passport (with `passport-google-oauth20`)
- ✅ Built-in strategy for OAuth
- ✅ Handles session automatically (unless using JWT separately)
- ❌ Tighter coupling with Express middleware flow
- ❌ More to learn and configure

👎 Not needed if you're already comfortable with JWT and want a cleaner frontend flow.

---

## ✅ What You Need to Get Started

### 1. **Set Up Google Console**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a project
- Enable **OAuth Consent Screen**
- Create **OAuth Client ID** (type: Web)
- Add `http://localhost:5173` to "Authorized JavaScript origins"


**Copy:**
- `Client ID`
- `Client Secret`

---

### 2. **Install Dependencies**
**Frontend:**
```bash
npm install @react-oauth/google axios
```

**Backend:**
```bash
npm install google-auth-library googleapis axios jsonwebtoken dotenv
```

---

### 3. **Create `oauth2Client`**
Create a utility file like `utils/googleClient.js`:

```js
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5173"
);

export { oauth2Client };
```

---

### 4. **Set Up Environment Variables**
`.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
JWT_TIMEOUT=1d
```

---

### 5. **Google Auth Controller**
Get code from `/src/contollers/user.controller.js` for googleAuth()

---

### 6. **Frontend Wrapper**
Wrap your app in the provider:  
(Use the same env as used in backend)
```jsx
// index.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
```

### 7. Make GoogleLogin.jsx component
- Get code from `/src/Components/GoogleLogin.jsx` for googleAuth().   
- Use the component in your Login.jsx page.

### 8. Changes made in vite config file too
