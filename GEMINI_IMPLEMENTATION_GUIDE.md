# GEMINI IMPLEMENTATION GUIDE
**Project:** AI Yoga Assistant  
**Written by:** Antigravity (Senior Architect)  
**For:** Gemini (implementing AI agent)  
**Date:** 2026-08-10

---

## READ THIS FIRST

You are implementing stabilization and security fixes for an existing React + Node.js AI Yoga application. **Do not redesign, rewrite, or replace working functionality.** Your goal is to make the codebase secure, stable, and correctly architecturally structured.

### Key Rules
1. **Never break the pose detection** — `react/src/pages/Yoga/Yoga.jsx` is the most critical component. Changes to its TF.js inference logic or model loading must be surgical and minimal.
2. **Never change the database collection names** or existing schema field names (only add fields and fix types).
3. **Never change routing paths** visible to the user (e.g., `/secured/home/recents`) — existing links may depend on them.
4. **Always implement in priority order** — complete all P0 security tasks before touching P1+ tasks.
5. **Read the whole function before editing** — especially in `userController.js` which has multiple functions that share patterns.
6. **Never hardcode credentials or URLs** — everything must come from environment variables or the `api.js` service.

### Project Structure Reference
```
E:/aiyoga/
├── react/               ← React 18 + Vite + TailwindCSS frontend
│   ├── src/
│   │   ├── App.jsx               ← Routing configuration
│   │   ├── main.jsx              ← Entry point (update to wrap with AuthProvider)
│   │   ├── authconfig/
│   │   │   └── ProtectedRoute.jsx  ← rewrite this
│   │   ├── components/
│   │   │   ├── unsecured/
│   │   │   │   ├── Login.jsx       ← update to use AuthContext + api.js
│   │   │   │   └── Signup.jsx      ← remove photo field
│   │   │   └── home/routes/
│   │   │       ├── Notifications.jsx  ← remove useEffect auto-fire
│   │   │       └── Recents.jsx        ← use api.js
│   │   ├── navigation/
│   │   │   └── HomeNavigation.jsx     ← update logout to use AuthContext
│   │   └── pages/
│   │       └── Yoga/
│   │           └── Yoga.jsx           ← intervals, refs, tf.tidy cleanup
│   ├── .env                           ← update VITE_API_BASE_URL
│   └── package.json
│
└── backend/vedic-vision-backend/   ← Node.js + Express + MongoDB backend
    ├── index.js                    ← add dotenv.config() first + fix CORS
    ├── controllers/
    │   └── userController.js       ← multiple bug fixes; split later
    ├── models/
    │   ├── userModel.js            ← fix isModified bug + timestamps typo
    │   └── yogaData.js             ← fix Number types + add sessionCount
    ├── routes/
    │   └── userRoutes.js           ← add protect middleware (AFTER frontend sends tokens)
    └── middlewares/
        └── authMiddleware.js       ← DO NOT MODIFY — works correctly
```

---

## IMPLEMENTATION TASKS (IN ORDER)

---

## 🔴 P0: SECURITY TASKS

### [TASK-SEC-01] Delete personal PDF files

**What to inspect:**  
Check `react/src/assets/` — you will find `jhushi_CV.pdf` and `jhushi_resume.pdf`.

**What to do:**
1. Delete both files from disk
2. Run `git rm "react/src/assets/jhushi_CV.pdf"` and `git rm "react/src/assets/jhushi_resume.pdf"`
3. Verify no source file imports these: `grep -r "jhushi" react/src/` must return nothing
4. Commit: `git add -A && git commit -m "security: remove personal PDF files from assets directory"`

**What NOT to modify:** Nothing else in `assets/`

**Acceptance Criteria:**
```bash
ls react/src/assets/jhushi*   # should: No such file
grep -r "jhushi" react/src/   # should: no output
git log --oneline -1          # should show the security commit
```

---

### [TASK-SEC-02] Sanitize README.md

**What to inspect:** `react/README.md` — it contains:
```
username: vikramdevireddy888@gmail.com
password : 12345678
```

**What to do:** Replace the entire file content with:
```markdown
# AI Yoga Tutor

An AI-powered yoga assistant that uses Google MoveNet for real-time pose detection and classification.

## Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, TensorFlow.js, MoveNet  
**Backend:** Node.js, Express, MongoDB Atlas, Nodemailer, JWT

## Getting Started

### Frontend
```bash
cd react
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### Backend
```bash
cd backend/vedic-vision-backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

## Environment Variables
See `.env.example` in `react/` and `backend/vedic-vision-backend/` for required variables.
```

**Commit:** `git commit -m "docs: replace README with proper setup instructions"`

---

### [TASK-SEC-03] Create .env.example files

**What to do:**

Create `react/.env.example`:
```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:5000
```

Create `backend/vedic-vision-backend/.env.example`:
```env
# Server configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DBNAME>?retryWrites=true&w=majority

# JWT secret — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<your-256-bit-random-hex>

# Gmail SMTP (use an App Password, NOT your real Gmail password)
# Enable 2FA → Google Account → Security → App Passwords
EMAIL=<your-gmail>@gmail.com
EMAIL_PASSWORD=<16-character-app-password>

# Allowed frontend origin for CORS
FRONTEND_URL=http://localhost:5173
```

Update `react/.env` (replace existing content):
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Commit both:** `git commit -m "config: add .env.example files for frontend and backend"`

**What NOT to do:** Do not commit real credentials. Do not alter the actual `.env` files (which contain real credentials and should NOT be committed).

---

### [TASK-SEC-04] Verify .gitignore coverage

**What to inspect:**
1. `react/.gitignore` — check if `.env` is listed
2. `react/.gitignore` — check if `dist/` is listed
3. `backend/vedic-vision-backend/.gitignore` — already updated by user; verify `.env` and `node_modules` are there

**What to do:**

If `react/.gitignore` does not contain `.env`, add these lines:
```
.env
.env.local
.env.production
dist/
```

**Test:**
```bash
# Test frontend gitignore
cd react
echo "TEST=1" > .env.test
git status   # .env.test should be "untracked" NOT "staged"
rm .env.test
```

---

### [TASK-SEC-05] Remove hardcoded phone number

**What to inspect:**  
`react/src/components/secured/Notifications.jsx` — check if it contains a hardcoded phone number like `917386431360`.

**FIRST: Determine if this file is used in routing.**  
Open `react/src/App.jsx` and search for `secured/Notifications`. If it is NOT imported and NOT in any `<Route>` element, the safest action is to delete the file:
```bash
git rm react/src/components/secured/Notifications.jsx
git commit -m "cleanup: remove unused secured/Notifications component with hardcoded phone"
```

If it IS used in routing, replace the hardcoded value:
```javascript
// BEFORE
const phoneNumber = '917386431360';

// AFTER
const phoneNumber = localStorage.getItem('phone') || '';
```

**Verify:**
```bash
grep -r "917386" react/src/   # should return nothing after fix
```

---

## 🟠 P1: AUTHENTICATION TASKS

**Important sequencing note:** Complete P0 tasks first, then implement P1 in this exact order:
1. TASK-AUTH-01 (AuthContext)
2. TASK-AUTH-02 (api.js service)
3. TASK-AUTH-03 (ProtectedRoute)
4. TASK-AUTH-04 (Login component)
5. **VERIFY** the full login → protected route flow works in browser
6. TASK-AUTH-05 (backend protect middleware — only after frontend sends tokens)
7. TASK-AUTH-06 (req.user._id in controllers)
8. TASK-AUTH-07 (logout)

---

### [TASK-AUTH-01] Create AuthContext

**New file:** `react/src/context/AuthContext.jsx`

**Exact content:**
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = ({ token: t, userDetails }) => {
    localStorage.setItem('authToken', t);
    localStorage.setItem('user', JSON.stringify(userDetails));
    // Keep legacy keys for components that still use them directly
    localStorage.setItem('userId', userDetails.id || userDetails._id);
    localStorage.setItem('email', userDetails.email);
    localStorage.setItem('username', `${userDetails.firstName} ${userDetails.lastName}`);
    localStorage.setItem('phone', userDetails.phone || '');
    localStorage.setItem('calories', userDetails.calories || '0');
    setToken(t);
    setUser(userDetails);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
```

**New file:** `react/src/hooks/useAuth.js`
```js
export { useAuth } from '../context/AuthContext';
```

**Modify:** `react/src/main.jsx`

**What to inspect:** Current content — it has `<BrowserRouter>` wrapping `<App />`.

**What to change:** Add `AuthProvider` wrapping (inside `BrowserRouter`):
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```

**Verify:** Open browser console. Import and call `useAuth()` from the React DevTools — it should return `{ user, token, login, logout, loading }`.

---

### [TASK-AUTH-02] Create api.js service

**New file:** `react/src/services/api.js`

**Exact content:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Verify:** Check `react/.env` has `VITE_API_BASE_URL=http://localhost:5000`. If you change the env value, you must restart Vite dev server for it to take effect.

---

### [TASK-AUTH-03] Fix ProtectedRoute

**File to modify:** `react/src/authconfig/ProtectedRoute.jsx`

**Inspect first:** Current content has `const isAuthenticated = true;`. Note how it uses Outlet vs children pattern.

**Replacement content:**
```jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  // Still initializing from localStorage — show nothing
  if (loading) return null;

  // Not authenticated — redirect to login
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
```

**What NOT to change:** The `App.jsx` routing structure. `ProtectedRoute` wraps `/secured` children — do not modify `App.jsx` routes.

**Verify (browser):**
1. Clear `localStorage` (DevTools → Application → Local Storage → Clear all)
2. Navigate to `http://localhost:5173/secured/home/recents`
3. Should redirect to `/login`

---

### [TASK-AUTH-04] Update Login component

**File to modify:** `react/src/components/unsecured/Login.jsx`

**What to inspect first:** Read the entire file. Notice:
- It uses `useFormik` from formik
- It has an `axios.post` call with hardcoded URL
- It sets multiple `localStorage.setItem` calls on success

**Changes:**

1. Add imports at top:
```javascript
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
```

2. Remove old axios import IF no other axios calls remain in this file.

3. Inside the component function, add:
```javascript
const { login } = useAuth();
```

4. In the formik `onSubmit` or the submit handler, replace the axios call:
```javascript
// BEFORE:
const res = await axios.post("https://vedic-vision-backend.onrender.com/api/user/login", values);

// AFTER:
const res = await api.post('/api/user/login', values);
```

5. Replace the scattered `localStorage.setItem` calls on success:
```javascript
// BEFORE: (multiple setItem calls)

// AFTER:
login({
  token: res.data.token,
  userDetails: res.data.userDetails,
});
// Note: calories are a separate concern, keep localStorage.setItem('calories', res.data.calories) if needed for now
```

**Preserve:** Form validation, error display logic, loading state, navigation after login.

**Verify:**
1. Submit login form with valid credentials
2. Check `localStorage` in DevTools — `authToken` must be set to a JWT string
3. Should navigate to `/secured/home/recents`

---

### ⚠️ VERIFY BEFORE CONTINUING ⚠️

Before implementing TASK-AUTH-05 (backend protect middleware):

Run this verification:
1. Start the backend: `cd backend/vedic-vision-backend && npm start`
2. Start the frontend: `cd react && npm run dev`
3. Log in → navigate to recents → calorie data loads ✓
4. Start a yoga session → stop → email received ✓
5. Check browser Network tab — `Authorization: Bearer xxx` header is present on API calls ✓

Only proceed to TASK-AUTH-05 after all three checks pass.

---

### [TASK-AUTH-05] Apply protect middleware on backend routes

**File to modify:** `backend/vedic-vision-backend/routes/userRoutes.js`

**What to inspect first:** Read the full file. Note the current route registrations.

**Change** (add `protect` to non-public routes):
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import controllers (update names once controllers are split in TASK-ARCH-02)
const {
  loginController,
  registerController,
  sendEmail,
  updateCalories,
  yogaFetchData,
} = require('../controllers/userController');

// multer setup (keep existing if photo upload is in any route)

// Public routes
router.post('/login', loginController);
router.post('/register', registerController);

// Protected routes — require valid JWT
router.post('/sendotp', protect, sendEmail);
router.post('/updatecal', protect, updateCalories);
router.post('/fetchyogadata', protect, yogaFetchData);

module.exports = router;
```

**What NOT to change:** The `authMiddleware.js` file — it is correct as-is.

**Verify:**
```bash
# Without token — should get 401
curl -X POST http://localhost:5000/api/user/updatecal \
  -H "Content-Type: application/json" \
  -d '{"score": 50}' 

# Expected response: {"message":"Not authorized, no token"} or similar 401
```

---

### [TASK-AUTH-06] Use req.user._id in protected controllers

**File to modify:** `backend/vedic-vision-backend/controllers/userController.js`

**What to inspect first:** Read the full `updateCalories`, `yogaFetchData`, and `sendEmail` functions. Note where `userId`, `email`, `userName` are destructured from `req.body`.

**For `updateCalories`:**
```javascript
// BEFORE:
const { score, email, userName, userId, pose } = req.body;

// AFTER:
const { score, pose } = req.body;
const userId = req.user._id;
const email = req.user.email;
const userName = `${req.user.firstName} ${req.user.lastName}`;
```

**For `yogaFetchData`:**
```javascript
// BEFORE:
const { userId } = req.body;

// AFTER:
const userId = req.user._id;
```

**For `sendEmail`:**
```javascript
// BEFORE:
const { email, userName, userId } = req.body;

// AFTER:
const userId = req.user._id;
const email = req.user.email;
const userName = `${req.user.firstName} ${req.user.lastName}`;
```

**What NOT to change:** The DB query logic, the email sending logic, or any other part of these functions.

**Verify:**
```bash
# With valid token, call updatecal WITHOUT userId in body
curl -X POST http://localhost:5000/api/user/updatecal \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"score": 50, "pose": "Tree"}'
# Should succeed and update the correct user's data
```

---

### [TASK-AUTH-07] Update Logout in HomeNavigation

**File to modify:** `react/src/navigation/HomeNavigation.jsx`

**What to inspect first:** Find the logout button or logout click handler. It likely calls `localStorage.clear()` and `navigate('/')`.

**Changes:**

Add import:
```javascript
import { useAuth } from '../hooks/useAuth';
```

In component:
```javascript
const { logout } = useAuth();
```

Replace existing logout handler:
```javascript
const handleLogout = () => {
  logout();      // clears localStorage and auth state
  navigate('/'); // or navigate('/login')
};
```

**Verify:** Click logout → `localStorage` in DevTools is empty → renders at `/`

---

## 🟡 P2: STABILITY TASKS

---

### [TASK-STAB-01] Fix dotenv in backend index.js

**File to modify:** `backend/vedic-vision-backend/index.js`

**What to inspect:** The first few lines. Note `require('dotenv')` without `.config()`.

**Change:** Make `require('dotenv').config()` the very first line:
```javascript
require('dotenv').config();  // MUST be first — before all other requires

const express = require('express');
// ... rest of file unchanged
```

**Then:** Remove `require('dotenv').config()` calls from:
- `backend/vedic-vision-backend/utils/connectDb.js` (first line)
- `backend/vedic-vision-backend/controllers/userController.js` (top of file)

Do NOT remove the `require('dotenv')` statement itself from those files — just remove the `.config()` call to avoid duplicate loading.

Actually, the safest approach: leave the `require('dotenv').config()` in those files as-is. Calling `.config()` multiple times is safe — subsequent calls are no-ops by default. The important thing is to also call it in `index.js` first.

**Verify:**
```javascript
// Add temporary log to index.js to verify:
console.log('PORT from env:', process.env.PORT);
// Should print 5000 (or whatever is in .env), not undefined
// Remove this log after verification
```

---

### [TASK-STAB-02] Fix password hashing bug in userModel.js

**File to modify:** `backend/vedic-vision-backend/models/userModel.js`

**What to inspect first:** Read the `pre('save')` hook. Note the import statement — it uses `bycrypt` (typo in variable name).

**Verify the import name:**
```javascript
const bycrypt = require('bcryptjs');  // note: variable name is 'bycrypt' not 'bcrypt'
```
This is a typo in the variable name but the import path `'bcryptjs'` is correct. Do NOT change the variable name — doing so would break the references below. Just fix the logic.

**Change the pre-save hook:**
```javascript
UserModel.pre('save', async function (next) {
  // isModified() — call it as a FUNCTION with the field name
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
  next();
});
```

**Verify (manual test):**
1. Register a new user
2. Check MongoDB Atlas → users collection → the `password` field should start with `$2b$` (bcrypt prefix)
3. Log in with that user → succeeds

---

### [TASK-STAB-03] Fix Yoga.jsx interval cleanup

**File to modify:** `react/src/pages/Yoga/Yoga.jsx`

**This is the most critical stability fix. Read the entire file before making changes.**

**What to inspect:**
- Module-level variables: `let interval;`, `let incorrectInterval;`, `let flag = false;`
- The `runMovenet` function that sets these intervals
- The "Stop" button click handler that clears them

**Step 1:** Find the module-level `let` declarations and move them to `useRef` inside the component:

Look for these lines (approximately at the top, before the component function):
```javascript
let interval;
let incorrectInterval;
let flag = false;
```

Remove them from module scope and add inside the `Yoga` component function (after `const webcamRef = useRef(null)` etc.):
```javascript
const intervalRef = useRef(null);
const incorrectIntervalRef = useRef(null);
const flagRef = useRef(false);
const detectorRef = useRef(null);
const classifierRef = useRef(null);
```

**Step 2:** Replace all uses of the old variables throughout the component. These are equivalent:

| Old | New |
|---|---|
| `interval = setInterval(...)` | `intervalRef.current = setInterval(...)` |
| `clearInterval(interval)` | `clearInterval(intervalRef.current)` |
| `clearInterval(incorrectInterval)` | `clearInterval(incorrectIntervalRef.current)` |
| `incorrectInterval = setInterval(...)` | `incorrectIntervalRef.current = setInterval(...)` |
| `flag = true` | `flagRef.current = true` |
| `flag = false` | `flagRef.current = false` |
| `if(flag)` or `if(!flag)` | `if(flagRef.current)` / `if(!flagRef.current)` |

**Step 3:** If the models are stored in local variables inside `runMovenet`, store them in refs instead:
```javascript
// Inside runMovenet, after creation:
detectorRef.current = detector;
classifierRef.current = poseClassifier;
```

**Step 4:** Add cleanup useEffect:
```javascript
// Add this AFTER all the existing useEffects in the component:
useEffect(() => {
  return () => {
    // Cleanup on unmount
    clearInterval(intervalRef.current);
    clearInterval(incorrectIntervalRef.current);
    
    // Stop camera
    if (webcamRef.current?.video?.srcObject) {
      webcamRef.current.video.srcObject.getTracks().forEach(t => t.stop());
    }
    
    // Dispose TF models to free GPU memory
    if (classifierRef.current) {
      classifierRef.current.dispose();
      classifierRef.current = null;
    }
    // Note: MoveNet detector may not have a dispose() method — check before calling
    if (detectorRef.current && typeof detectorRef.current.dispose === 'function') {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    flagRef.current = false;
  };
}, []); // empty deps — runs only on unmount
```

**What NOT to change:**
- The `runMovenet` function's model loading logic
- The `detectPose` function's inference logic
- The skeleton drawing code
- The calorie calculation
- The audio playback

**Verify:**
1. Start a yoga session
2. Open Chrome DevTools → Performance → Memory tab
3. Before session: note `tf.memory().numTensors` in console
4. Start detection → let run 30 seconds
5. Navigate away (e.g., go to Dashboard)
6. No console errors about `Cannot read properties of null`
7. Navigate back to Start Workout — works again

---

### [TASK-STAB-04] Remove duplicate speakFeedback function

**File to modify:** `react/src/pages/Yoga/Yoga.jsx`

**What to inspect:** Search for `speakFeedback` in the file. There are two function definitions with the same name.

**Action:** Remove the FIRST definition only. Keep the second. 

To identify which is "first": it is the one that appears earlier in the file (lower line number). Verify both definitions are identical before removing.

**Verify:**
```bash
grep -n "speakFeedback" react/src/pages/Yoga/Yoga.jsx
# Should show exactly 1 function definition (const speakFeedback or function speakFeedback)
# Plus any call sites
```

---

### [TASK-STAB-05] Remove auto-fire email in Notifications.jsx

**File to modify:** `react/src/components/home/routes/Notifications.jsx`

**What to inspect:** Find the `useEffect` call in the component. It calls `handleSendEmail()`.

**Remove these lines:**
```javascript
useEffect(() => {
  handleSendEmail();
}, [])
```

Also remove the `useEffect` import from the top if it's no longer used:
```javascript
// BEFORE:
import React, { useEffect } from 'react';

// AFTER (if useEffect not used elsewhere in this file):
import React from 'react';
```

**Keep:** The `handleSendEmail` function itself (it should fire on button click), the `handleSendMessage` function, the JSX.

**Verify:** Navigate to `/secured/home/notifications` — check browser Network tab — no POST request to `/sendotp` fires on page load.

---

### [TASK-STAB-06] Fix registerController response flow

**File to modify:** `backend/vedic-vision-backend/controllers/userController.js`

**What to inspect:** The `registerController` function. Read it fully.

**Look for:**
1. Missing `return` statements before `res.send()` calls in conditional branches
2. Multiple code paths that could reach multiple `res.send()` calls

**Fix pattern — add `return` before every early res call:**
```javascript
const registerController = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, phone } = req.body;
    
    const userNameExist = await User.findOne({ userName });
    if (userNameExist) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ message: "Email already exists" });
    }
    
    const user = await User.create({ firstName, lastName, userName, email, password, phone });
    await Yoga.create({ userId: user._id });
    
    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};
```

**What NOT to change:** The User.create and Yoga.create logic.

---

### [TASK-STAB-07] Fix email from field and env variable names

**File to modify:** `backend/vedic-vision-backend/controllers/userController.js`

**What to inspect:** Search for `process.env.email` (lowercase) and `process.env.pass` in the file.

**Replace all occurrences of:**
```javascript
from: process.env.email    // wrong case
```
With:
```javascript
from: `"AI Yoga Assistant" <${process.env.EMAIL}>`
```

**Replace all occurrences of:**
```javascript
pass: process.env.PASSWORD  // or process.env.pass
```
With:
```javascript
pass: process.env.EMAIL_PASSWORD
```

**Update `backend/.env`:** Change `PASSWORD=xxx` to `EMAIL_PASSWORD=xxx` (same value, new key name).

**Verify:** Send a session email → check received email → `From:` shows "AI Yoga Assistant" not `undefined`.

---

### [TASK-STAB-08] Fix login crash when no YogaData exists

**File to modify:** `backend/vedic-vision-backend/controllers/userController.js`

**What to inspect:** The `loginController` function. Find where `Yoga.findOne({ userId: user._id })` is called and how the result is used.

**Fix:**
```javascript
let yoga = await Yoga.findOne({ userId: user._id });

// Guard against null (shouldn't happen normally but handle gracefully)
if (!yoga) {
  yoga = await Yoga.create({ userId: user._id });
}

return res.status(200).json({
  id: yoga._id,
  day: yoga.day,
  calories: yoga.calories,
  totalCalories: yoga.totalCalories,
  userDetails: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    phone: user.phone,
    email: user.email,
  },
  token: createToken(user._id),
});
```

---

### [TASK-STAB-09] Fix empty response in fetchyogadata

**File to modify:** `backend/vedic-vision-backend/controllers/userController.js`

**What to inspect:** Find the `yogaFetchData` function (or similar name). Find any `res.status(400)` or `res.status(404)` that is NOT followed by `.json(...)` or `.send(...)`.

**Example of the bug:**
```javascript
if (!yoga) {
  res.status(400);  // Bug: no response body
}
```

**Fix:**
```javascript
if (!yoga) {
  return res.status(404).json({ message: "No yoga data found" });
}
return res.status(200).json({
  totalCalories: yoga.totalCalories,
  lastyoga: yoga.calories,
});
```

---

## 🔵 P3: ARCHITECTURE TASKS

---

### [TASK-ARCH-01] Create emailService.js

**New file:** `backend/vedic-vision-backend/services/emailService.js`

**Exact content:**
```javascript
const nodemailer = require('nodemailer');

// Single transporter instance — created once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends post-session calorie summary email
 */
const sendSessionSummary = async ({ to, userName, pose, calories }) => {
  const mailOptions = {
    from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
    to,
    subject: `Great workout, ${userName}! Your session summary`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Your Yoga Session Summary</h2>
        <p>Great work, <strong>${userName}</strong>!</p>
        <p>You completed the <strong>${pose}</strong> pose.</p>
        <p style="font-size: 1.2em;">Calories burned: <strong>${parseFloat(calories).toFixed(2)} kcal</strong></p>
        <hr />
        <p style="color: #888; font-size: 0.9em;">AI Yoga Tutor — Stay consistent, stay healthy.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

/**
 * Sends periodic progress summary email
 */
const sendProgressSummary = async ({ to, userName, totalCalories }) => {
  const mailOptions = {
    from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
    to,
    subject: `Your Yoga Progress, ${userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Your Progress Update</h2>
        <p>Hello, <strong>${userName}</strong>!</p>
        <p>Total calories burned so far: <strong>${parseFloat(totalCalories).toFixed(2)} kcal</strong></p>
        <p>Keep up the great work!</p>
        <hr />
        <p style="color: #888; font-size: 0.9em;">AI Yoga Tutor</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendSessionSummary, sendProgressSummary };
```

**Then update `userController.js`** to use this service instead of inline transporters:
```javascript
const { sendSessionSummary, sendProgressSummary } = require('../services/emailService');

// In updateCalories — replace inline transporter + sendMail:
await sendSessionSummary({ to: email, userName, pose, calories: score });

// In sendEmail — replace inline transporter + sendMail:
await sendProgressSummary({ to: email, userName, totalCalories });
```

---

### [TASK-ARCH-02] Split userController.js into separate files

**New files to create:**
- `backend/vedic-vision-backend/controllers/authController.js`
- `backend/vedic-vision-backend/controllers/yogaController.js`

Move functions:
- `loginController`, `registerController` → `authController.js`
- `updateCalories`, `yogaFetchData`, `sendEmail` → `yogaController.js`

**Update:** `backend/vedic-vision-backend/routes/userRoutes.js` to import from new files.

**Delete:** `backend/vedic-vision-backend/controllers/userController.js` after confirming all routes still work.

**Note:** Do TASK-ARCH-01 first so emailService dependencies are clean.

---

### [TASK-ARCH-03] Replace hardcoded URLs with api.js

**Files to modify:**

For each file listed, replace:
```javascript
import axios from 'axios';
// and
await axios.post("https://vedic-vision-backend.onrender.com/api/user/...", ...)
```

With:
```javascript
import api from '../../services/api';  // adjust relative path per file
// and
await api.post('/api/user/...', ...)
```

**Exact relative paths for import:**
| File | Import Path |
|---|---|
| `react/src/components/unsecured/Login.jsx` | `'../../services/api'` |
| `react/src/components/unsecured/Signup.jsx` | `'../../services/api'` |
| `react/src/components/home/routes/Recents.jsx` | `'../../../services/api'` |
| `react/src/components/home/routes/Notifications.jsx` | `'../../../services/api'` |
| `react/src/pages/Yoga/Yoga.jsx` | `'../../services/api'` |

**Verify:**
```bash
grep -rn "onrender.com" react/src/
# Must return 0 results
```

---

### [TASK-ARCH-04] Fix CORS in backend index.js

**File to modify:** `backend/vedic-vision-backend/index.js`

**Change:**
```javascript
// BEFORE:
app.use(cors());

// AFTER:
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
```

**Update backend `.env`:**
```env
FRONTEND_URL=http://localhost:5173
```

---

### [TASK-ARCH-05] Fix database model types

**File to modify:** `backend/vedic-vision-backend/models/yogaData.js`

**Change `calories` and `totalCalories` type:**
```javascript
calories: {
  type: Number,   // was: String
  default: 0,     // was: "0"
},
totalCalories: {
  type: Number,   // was: String
  default: 0,     // was: "0"
},
sessionCount: {
  type: Number,
  default: 0,
},
```

**File to modify:** `backend/vedic-vision-backend/models/userModel.js`

**Fix timestamps option:**
```javascript
// Find at the bottom of the schema definition:
// BEFORE:
{ timeStamp: true }

// AFTER:
{ timestamps: true }
```

**After this change**, update controller to remove:
- `Number(prevyoga.calories)` — no longer needed, already a Number
- `Number(prevyoga.totalCalories)` — same

**Also increment `sessionCount`** in `updateCalories`:
```javascript
yoga.sessionCount = (yoga.sessionCount || 0) + 1;
```

---

## 🟢 P4: AI LIFECYCLE TASKS

---

### [TASK-AI-01] Wrap inference in tf.tidy()

**File to modify:** `react/src/pages/Yoga/Yoga.jsx`

**Do this AFTER TASK-STAB-03** (refs must be set up first).

**What to inspect:** Find the `setInterval` callback inside `runMovenet` that calls `poseDetection` and runs the classifier. Find where `landmarks_to_embedding` is called.

**Wrap the classification portion:**
```javascript
// Around the embedding + prediction code:
let predictions;
try {
  predictions = tf.tidy(() => {
    const embedding = landmarks_to_embedding(
      tf.tensor2d([input], [1, input.length])
    );
    return classifierRef.current.predict(embedding);
  });
  
  const data = await predictions.array();
  predictions.dispose();
  
  // Now work with data[0]
  const classNo = CLASS_NO[currentPose];
  if (data[0][classNo] > 0.97) { ... }
} catch (err) {
  predictions?.dispose();
  console.error('Inference error:', err);
}
```

**Verify:** Open DevTools console → type `tf.memory()` → note `numTensors` → run session for 60 seconds → check `tf.memory()` again → `numTensors` should be stable (not growing).

---

### [TASK-AI-02] Add model loading state

**File to modify:** `react/src/pages/Yoga/Yoga.jsx`

**Add state:**
```javascript
const [isModelLoading, setIsModelLoading] = useState(false);
const [modelError, setModelError] = useState('');
```

**Wrap `runMovenet` model loading:**
```javascript
const runMovenet = async () => {
  setIsModelLoading(true);
  setModelError('');
  try {
    // existing: await tf.setBackend(...)
    // existing: detector = await poseDetection.createDetector(...)
    // existing: poseClassifier = await tf.loadLayersModel(...)
  } catch (err) {
    setModelError('Failed to load AI models. Please refresh the page and try again.');
    setIsModelLoading(false);
    return;
  }
  setIsModelLoading(false);
  // start interval...
};
```

**Add to JSX** (inside the yoga container, overlaid on the video area):
```jsx
{isModelLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-10">
    <div className="text-center text-white">
      <div className="text-2xl mb-2">⏳</div>
      <p className="text-lg font-semibold">Loading AI models…</p>
      <p className="text-sm text-slate-300 mt-1">This may take a few seconds</p>
    </div>
  </div>
)}
{modelError && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {modelError}
  </div>
)}
```

---

### [TASK-AI-03] Add text feedback display

**File to modify:** `react/src/pages/Yoga/Yoga.jsx`

**Add state:**
```javascript
const [poseFeedback, setPoseFeedback] = useState('Position yourself in front of the camera');
```

**Update classification result handler to set feedback:**
```javascript
if (data[0][classNo] > 0.97) {
  setPoseFeedback('✓ Perfect! Hold the pose steady.');
  flagRef.current = true;
} else {
  setPoseFeedback('Adjust your position to match the reference pose');
  flagRef.current = false;
}
```

**Add to JSX** (below the canvas/video area):
```jsx
{isStartPose && (
  <div className={`text-center text-lg font-bold mt-3 px-4 py-2 rounded-lg ${
    flagRef.current ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'
  }`}>
    {poseFeedback}
  </div>
)}
```

---

## ⚪ P5: FEATURE CLEANUP TASKS

---

### [TASK-FEAT-01] Remove photo upload from Signup

**File to modify:** `react/src/components/unsecured/Signup.jsx`

**What to inspect:** Find the photo/file input field and the FormData construction.

**Changes:**
1. Remove the `<input type="file" ...>` and its surrounding div from JSX
2. Remove `photo` from Formik `initialValues`: `{ photo: '', ... }` → remove `photo` key
3. Remove `photo` from Yup validation schema
4. Find where `FormData` is constructed — remove it entirely
5. Ensure `onSubmit` sends plain `values` object as JSON (not `formData`)

**Keep:** All other form fields, validation, error display.

---

### [TASK-FEAT-02] Remove dead files

**Files to delete:**
```bash
git rm react/src/authconfig/Auth.jsx
git rm react/src/components/auth/Signup.jsx
git rm react/src/components/home/StartWorkout.js
git rm react/src/utils/music/index.jsx
git rm react/src/App.css       # FIRST verify it is not imported in main.jsx or App.jsx
git commit -m "cleanup: remove dead stub files and empty components"
```

**Before deleting App.css:** 
```bash
grep -r "App.css" react/src/   # If no results, safe to delete
```

---

### [TASK-FEAT-03] Update email branding

**File to modify:** After TASK-ARCH-01 is done, `backend/vedic-vision-backend/services/emailService.js` already uses "AI Yoga Assistant" branding.

If TASK-ARCH-01 is not done yet, find and replace in `userController.js`:
```
"Team DECODERZ"  →  "AI Yoga Tutor"
```

---

## VERIFICATION CHECKLIST

Run this checklist after each priority level is complete.

### After P0:
```bash
grep -r "jhushi" react/src/                          # → no results
grep -r "917386" react/src/                          # → no results  
cat react/README.md | grep -i "password"             # → no results
cat react/README.md | grep -i "vikram.*gmail"        # → no results
git ls-files | grep ".env$"                          # → no .env files tracked
```

### After P1 (Auth):
- [ ] Clear localStorage → navigate to `/secured/*` → redirects to `/login`
- [ ] Log in → `localStorage.authToken` is non-null
- [ ] Network tab shows `Authorization: Bearer xxx` on API calls
- [ ] Logout → `localStorage` is empty → at `/`

### After P2 (Stability):
```bash
# Backend
curl -X POST http://localhost:5000/api/user/register \
  -d '{"firstName":"T","lastName":"T","userName":"test1","email":"test@test.com","password":"pass123","phone":"1234567890"}' \
  -H "Content-Type: application/json"
# → 201 {"message":"Registration successful"}

curl -X POST http://localhost:5000/api/user/register \
  -d '{"email":"test@test.com","password":"pass123"}' \
  -H "Content-Type: application/json"  
# → 409 (duplicate email)
```

- [ ] Start yoga session → stop → no console errors during or after
- [ ] Navigate away from yoga session mid-session → no JS errors
- [ ] Notification page loads → NO email sent automatically

### After P3 (Architecture):
```bash
grep -rn "onrender.com" react/src/    # → 0 results
```
- [ ] Change `VITE_API_BASE_URL` in `.env` to a different URL → restart dev server → all API calls go to the new URL

### After P4 (AI lifecycle):
- [ ] `tf.memory().numTensors` in console is stable during session (run in Chrome DevTools)
- [ ] Loading spinner visible while models initialize
- [ ] Text feedback shows on screen during session

---

## WHAT NOT TO TOUCH (EVER, WITHOUT EXPLICIT INSTRUCTION)

1. `react/src/utils/data/index.jsx` — pose instruction data and CLASS_NO mapping
2. `react/src/utils/helper/index.jsx` — canvas drawing utilities (drawPoint, drawSegment)
3. `react/src/utils/pose_images/` — pose reference images  
4. `react/src/guidance/` — audio files (correct.mp3, incorrect.mp3, start.mp3)
5. `backend/vedic-vision-backend/middlewares/authMiddleware.js` — works correctly
6. `backend/vedic-vision-backend/config/createToken.js` — works correctly
7. `react/src/App.jsx` routing paths — changing paths breaks existing navigation
8. MongoDB collection names — changing names silently loses data

---

## COMMON MISTAKES TO AVOID

1. **Do not use `window.location.href` for React navigation** — use `useNavigate()` from react-router-dom. The exception is the 401 handler in `api.js` which cannot use hooks.

2. **Do not add `async` to `useEffect` directly** — use an inner async function:
   ```javascript
   useEffect(() => {
     const fetchData = async () => { ... };
     fetchData();
   }, []);
   ```

3. **Do not read `localStorage` outside of React lifecycle** — read in `useEffect` or from `AuthContext`.

4. **Do not import `useAuth` in files outside the React tree** — it must be used inside a component.

5. **Do not forget to restart the Vite dev server** after changing `.env` variables.

6. **Do not call `res.json()` after `res.status()` without `.json()` attached** — always chain them: `res.status(400).json({...})`.

7. **Test backend with curl before frontend changes** — validate the API works independently first.
