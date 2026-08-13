# IMPLEMENTATION PLAN
**Project:** AI Yoga Assistant  
**Author:** Vikram (via Antigravity architectural analysis)  
**Date:** 2026-08-10  
**Philosophy:** Fix, stabilize, secure — then improve. No UI changes until P0-P3 are resolved.

---

## PRIORITY LEGEND
| Priority | Label | Meaning |
|---|---|---|
| P0 | 🔴 Security | Credentials, personal files, data exposure |
| P1 | 🟠 Authentication | Auth architecture, broken guards |
| P2 | 🟡 Stability | Runtime bugs, crashes, memory leaks |
| P3 | 🔵 Architecture | Config, API structure, service separation |
| P4 | 🟢 AI Lifecycle | TensorFlow cleanup, inference quality |
| P5 | ⚪ Functionality | Completing real features |
| P6 | 🎨 UI/UX | Design system, visual redesign |

---

## P0 — SECURITY TASKS

---

### TASK-SEC-01
**Title:** Remove personal PDF files from repository  
**Priority:** P0  
**Objective:** Delete committed personal CV/resume files belonging to a hackathon team member.

**Files to Modify:**
- `react/src/assets/jhushi_CV.pdf` → DELETE
- `react/src/assets/jhushi_resume.pdf` → DELETE

**Exact Changes:**
1. Delete both files from disk
2. `git rm "react/src/assets/jhushi_CV.pdf"`
3. `git rm "react/src/assets/jhushi_resume.pdf"`
4. Commit with message: `security: remove personal PDF files from assets`
5. Verify no other files reference these paths (grep for `jhushi`)

**Dependencies:** None

**Acceptance Criteria:**
- Files do not exist on disk
- Files do not appear in `git ls-files`
- No import or reference to these files anywhere in React code

**How to Test:**
```bash
git ls-files | grep jhushi  # should return nothing
grep -r "jhushi" react/src/  # should return nothing
```

**Potential Risks:**
- These files may be referenced by someone's portfolio link. Low risk for application. They should stay out of the repo permanently.

---

### TASK-SEC-02
**Title:** Sanitize README.md credentials  
**Priority:** P0  
**Objective:** Remove plaintext email/password from `react/README.md`.

**Files to Modify:**
- `react/README.md` — replace content entirely

**Exact Changes:**  
Replace the entire README with a proper project README:
```markdown
# AI Yoga Tutor

An AI-powered yoga assistant using Google MoveNet for real-time pose detection.

## Tech Stack
- Frontend: React 18, Vite, TailwindCSS, TensorFlow.js
- Backend: Node.js, Express, MongoDB Atlas

## Getting Started

### Frontend
```bash
cd react
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### Backend
```bash
cd backend/vedic-vision-backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Environment Variables
See `.env.example` in each directory.
```

**Dependencies:** None

**Acceptance Criteria:**
- `react/README.md` contains no email addresses or passwords
- README provides correct setup instructions  

**How to Test:** Read the file. Check for `@gmail.com`, `password`, `12345678`.

---

### TASK-SEC-03
**Title:** Create `.env.example` files for both frontend and backend  
**Priority:** P0  
**Objective:** Provide safe template env files with no real values.

**Files to Create:**
- `react/.env.example`
- `backend/vedic-vision-backend/.env.example`

**react/.env.example:**
```env
# API base URL — local development
VITE_API_BASE_URL=http://localhost:5000
```

**backend/vedic-vision-backend/.env.example:**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DBNAME>?retryWrites=true&w=majority

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<your-256-bit-random-hex-string>

# Gmail SMTP (use an App Password, not your real Gmail password)
# Enable 2FA on Google, then create App Password at: myaccount.google.com/apppasswords
EMAIL=<your-gmail-address>@gmail.com
EMAIL_PASSWORD=<16-character-google-app-password>

# CORS allowed origin for frontend
FRONTEND_URL=http://localhost:5173
```

**Dependencies:** None

**Acceptance Criteria:**
- Both `.env.example` files exist
- Neither contains real credentials
- Both are committed to git

---

### TASK-SEC-04
**Title:** Verify `.gitignore` covers both `.env` files  
**Priority:** P0  
**Objective:** Ensure real `.env` files can never be accidentally committed.

**Files to Modify:**
- `react/.gitignore` — verify `.env` is listed
- `backend/vedic-vision-backend/.gitignore` — already added by user; verify

**Exact Changes:**  
Check `react/.gitignore` — it should contain:
```
.env
.env.local
.env.*.local
```
If not present, add them.

**Also add to `react/.gitignore`:**
```
dist/
```
The `dist/` folder (production build) is currently committed and should not be.

**Dependencies:** None

**Acceptance Criteria:**
- `echo "test" > react/.env && git status` shows `.env` as untracked (not staged)
- `dist/` not tracked by git

---

### TASK-SEC-05
**Title:** Remove hardcoded phone number from Notifications component  
**Priority:** P0  
**Objective:** A personal phone number is hardcoded in the secured Notifications component.

**Files to Modify:**
- `react/src/components/secured/Notifications.jsx`

**Exact Changes:**  
Replace `const phoneNumber = '917386431360';` with `const phoneNumber = localStorage.getItem('phone') || '';`

Note: This component (`secured/Notifications.jsx`) is distinct from `home/routes/Notifications.jsx`. Check whether it is actually used in any route in `App.jsx`. If it is NOT registered in any route, delete the file (see TASK-CLEAN-01).

**Dependencies:** TASK-CLEAN-01 (check if file is used)

**Acceptance Criteria:**
- No hardcoded phone number in any source file
```bash
grep -r "917386" react/src/  # should return nothing
```

---

## P1 — AUTHENTICATION TASKS

---

### TASK-AUTH-01
**Title:** Create React AuthContext  
**Priority:** P1  
**Objective:** Replace scattered `localStorage.getItem()` calls with a centralized React Context for authentication state.

**Files to Create:**
- `react/src/context/AuthContext.jsx`
- `react/src/hooks/useAuth.js`

**AuthContext.jsx implementation:**
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, read persisted session
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setToken(storedToken);
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = ({ token: t, userDetails }) => {
    localStorage.setItem('authToken', t);
    localStorage.setItem('user', JSON.stringify(userDetails));
    // Keep individual keys for components that read them directly (until migrated)
    localStorage.setItem('userId', userDetails.id);
    localStorage.setItem('email', userDetails.email);
    localStorage.setItem('username', `${userDetails.firstName} ${userDetails.lastName}`);
    localStorage.setItem('phone', userDetails.phone || '');
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
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
```

**useAuth.js:**
```js
export { useAuth } from '../context/AuthContext';
```

**Then wrap App in `main.jsx`:**
```jsx
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```

**Files to Modify:**
- `react/src/main.jsx` (wrap with `<AuthProvider>`)

**Dependencies:** None — can be implemented first

**Acceptance Criteria:**
- `useAuth()` returns `{ user, token, login, logout, loading }` from any component
- On page refresh: token and user are restored from localStorage
- No console errors

---

### TASK-AUTH-02
**Title:** Create Axios API service layer  
**Priority:** P1  
**Objective:** Single Axios instance with base URL from env var and automatic token attachment.

**Files to Create:**
- `react/src/services/api.js`

**api.js implementation:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally
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

**Also update `react/.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, set: `VITE_API_BASE_URL=https://vedic-vision-backend.onrender.com`

**Dependencies:** TASK-AUTH-01

**Acceptance Criteria:**
- `api.get('/api/user/...')` works in any component
- Token is attached automatically if logged in
- 401 response redirects to `/login` and clears localStorage

---

### TASK-AUTH-03
**Title:** Fix ProtectedRoute to use AuthContext  
**Priority:** P1  
**Objective:** Replace the hardcoded `isAuthenticated = true` with real token check.

**Files to Modify:**
- `react/src/authconfig/ProtectedRoute.jsx`

**Current (broken):**
```jsx
const isAuthenticated = true;
```

**Replacement:**
```jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  // While checking localStorage on mount, show nothing
  if (loading) return null;

  // No token? Send to login
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
```

**Dependencies:** TASK-AUTH-01 (AuthContext must exist)

**Acceptance Criteria:**
- Navigating to `/secured/home/recents` without login redirects to `/login`
- Navigating after login renders the page correctly
- Browser back button after redirect does not show the protected page

---

### TASK-AUTH-04
**Title:** Update Login component to store JWT and use AuthContext  
**Priority:** P1  
**Objective:** Store the returned token in localStorage via AuthContext and use the `api` service.

**Files to Modify:**
- `react/src/components/unsecured/Login.jsx`

**Key Changes:**

1. Import `useAuth` and `api`:
```javascript
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
```

2. In the submit handler, replace hardcoded axios call:
```javascript
// BEFORE
const res = await axios.post("https://vedic-vision-backend.onrender.com/api/user/login", values);

// AFTER
const { login } = useAuth();
const res = await api.post('/api/user/login', values);
```

3. On success, call `login()` instead of individual `localStorage.setItem`:
```javascript
// BEFORE (many scattered setItem calls)
localStorage.setItem("username", res.data.userDetails.firstName + " " + res.data.userDetails.lastName);
// ... 5 more setItem calls

// AFTER (single login call)
login({ token: res.data.token, userDetails: res.data.userDetails });
navigate('/secured/home/recents');
```

**Dependencies:** TASK-AUTH-01, TASK-AUTH-02

**Acceptance Criteria:**
- After login: `localStorage.getItem('authToken')` is not null
- `localStorage.getItem('user')` contains valid JSON
- User sees the dashboard after login
- Invalid credentials show error message (keep existing Formik validation)

---

### TASK-AUTH-05
**Title:** Apply `protect` middleware to backend routes  
**Priority:** P1 (implement AFTER TASK-AUTH-02 and TASK-AUTH-04)  
**Objective:** Secure backend routes so only authenticated users can call them.

**Files to Modify:**
- `backend/vedic-vision-backend/routes/userRoutes.js`

**IMPORTANT:** This task must be implemented AFTER the frontend is sending tokens (TASK-AUTH-02 and TASK-AUTH-04 complete). Enabling this before would break all protected API calls.

**Current:**
```javascript
router.post('/sendotp', sendEmail);
router.post('/updatecal', updateCalories);
router.post('/fetchyogadata', yogaFetchData);
```

**New:**
```javascript
const { protect } = require('../middlewares/authMiddleware');
// Public
router.post('/login', loginController);
router.post('/register', registerController);
// Protected
router.post('/sendotp', protect, sendEmail);
router.post('/updatecal', protect, updateCalories);
router.post('/fetchyogadata', protect, yogaFetchData);
```

**Dependencies:** TASK-AUTH-02, TASK-AUTH-04 must be deployed/tested first

**Acceptance Criteria:**
- `curl -X POST http://localhost:5000/api/user/updatecal` without token returns `{ message: "Not authorized, no token" }`
- With valid `Authorization: Bearer <token>`, request proceeds normally

---

### TASK-AUTH-06
**Title:** Replace `req.body.userId` with `req.user._id` in protected controllers  
**Priority:** P1 (immediately after TASK-AUTH-05)  
**Objective:** Prevent users from passing another user's ID in the request body to access their data.

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js`

**For `updateCalories` function:**
```javascript
// BEFORE
const { score, email, userName, userId, pose } = req.body;

// AFTER — userId comes from the verified JWT, not the request body
const { score, pose } = req.body;
const userId = req.user._id;
const email = req.user.email;
const userName = `${req.user.firstName} ${req.user.lastName}`;
```

**For `yogaFetchData` function:**
```javascript
// BEFORE
const { userId } = req.body;

// AFTER
const userId = req.user._id;
```

**For `sendEmail` function:**
```javascript
// BEFORE
const { email, userName, userId } = req.body;

// AFTER
const userId = req.user._id;
const email = req.user.email;
const userName = `${req.user.firstName} ${req.user.lastName}`;
```

**Note:** `authMiddleware.js` already populates `req.user` with the full user object from DB: `req.user = await User.findById(decoded.id).select('-password')`. This means email, firstName, lastName are all available on `req.user`.

**Dependencies:** TASK-AUTH-05

**Acceptance Criteria:**
- Removing `userId` from the request body of `/updatecal` does not break the endpoint
- `req.user._id` is correctly used in the DB query
- Test by calling the API with a different userId in the body — it should use the token identity, not the body

---

### TASK-AUTH-07
**Title:** Update Logout to use AuthContext  
**Priority:** P1  
**Objective:** Ensure logout clears all state and redirects properly.

**Files to Modify:**
- `react/src/navigation/HomeNavigation.jsx` (has existing logout button)
- `react/src/components/profile/routes/Logout.jsx` (placeholder — make functional)

**HomeNavigation.jsx current logout:**
```javascript
// Finds: some localStorage.clear() + navigate('/') pattern
```

**Update to use context:**
```javascript
import { useAuth } from '../hooks/useAuth';
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/');
};
```

**Dependencies:** TASK-AUTH-01

---

## P2 — STABILITY TASKS

---

### TASK-STAB-01
**Title:** Fix dotenv initialization in backend index.js  
**Priority:** P2  
**Objective:** Ensure environment variables are loaded before any module requires them.

**Files to Modify:**
- `backend/vedic-vision-backend/index.js`

**Current first lines:**
```javascript
const express = require('express')
const mongoose = require('mongoose')
require('dotenv')   // loaded but NOT configured
```

**Fixed first lines:**
```javascript
require('dotenv').config();    // MUST be the first line
const express = require('express');
const mongoose = require('mongoose');
```

Then also remove the duplicate `require('dotenv').config()` calls from:
- `backend/vedic-vision-backend/utils/connectDb.js`
- `backend/vedic-vision-backend/controllers/userController.js`

Once `index.js` loads dotenv first, all subsequently required modules inherit the env vars.

**Acceptance Criteria:**
- `console.log(process.env.PORT)` in any controller returns the value from `.env`
- Server starts without `undefined` appearing in connection strings

---

### TASK-STAB-02
**Title:** Fix password hashing bug in userModel.js  
**Priority:** P2  
**Objective:** Correct the `isModified` check in the Mongoose pre-save hook.

**Files to Modify:**
- `backend/vedic-vision-backend/models/userModel.js`

**Current (broken):**
```javascript
UserModel.pre("save", async function(next) {
  if(!this.isModified) {   // function reference, always truthy → next() never called
    next()
  }
  const salt = await bycrypt.genSalt(10)
  this.password = await bycrypt.hash(this.password, salt)
})
```

**Fixed:**
```javascript
UserModel.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();    // early return prevents fall-through
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

Also fix the import: Current code uses `bycrypt` (typo) — check the actual import statement at top of file.

**Acceptance Criteria:**
- New user registration still produces a bcrypt-hashed password (not plaintext)
- Login with the registered password still works after this fix
- If a non-password field were updated and saved, password is NOT re-hashed

---

### TASK-STAB-03
**Title:** Fix Yoga.jsx interval cleanup on unmount  
**Priority:** P2  
**Objective:** Prevent memory leak when user navigates away from yoga session.

**Files to Modify:**
- `react/src/pages/Yoga/Yoga.jsx`

**Changes required:**

1. Convert module-level mutable let variables to `useRef`:
```javascript
// REMOVE from module scope:
let interval;
let incorrectInterval;
let flag = false;

// ADD inside component function:
const intervalRef = useRef(null);
const incorrectIntervalRef = useRef(null);
const flagRef = useRef(false);
```

2. Replace all uses:
- `interval = setInterval(...)` → `intervalRef.current = setInterval(...)`
- `clearInterval(interval)` → `clearInterval(intervalRef.current)`
- `flag = true/false` → `flagRef.current = true/false`
- `if(flag)` → `if(flagRef.current)`

3. Add cleanup useEffect:
```javascript
useEffect(() => {
  return () => {
    // Called on unmount
    clearInterval(intervalRef.current);
    clearInterval(incorrectIntervalRef.current);
    // Stop camera
    if (webcamRef.current?.video?.srcObject) {
      const tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    // Dispose TF models
    if (classifierRef.current) {
      classifierRef.current.dispose();
      classifierRef.current = null;
    }
  };
}, []); // empty deps — only run on unmount
```

4. The "Stop" button click handler should also call the cleanup:
```javascript
const stopSession = () => {
  clearInterval(intervalRef.current);
  clearInterval(incorrectIntervalRef.current);
  intervalRef.current = null;
  incorrectIntervalRef.current = null;
  // camera and canvas cleanup...
  setIsStartPose(false);
};
```

5. Store model refs properly:
```javascript
const detectorRef = useRef(null);
const classifierRef = useRef(null);

// In runMovenet:
const detector = await poseDetection.createDetector(...);
detectorRef.current = detector;
const poseClassifier = await tf.loadLayersModel(...);
classifierRef.current = poseClassifier;

// Use detectorRef.current and classifierRef.current in detection loop
```

**Acceptance Criteria:**
- Navigate to session → start → click back → no JS errors in console
- `clearInterval` not called multiple times on the same ID (check if `intervalRef.current !== null` before clearing)
- No TensorFlow.js memory growth after multiple starts/stops (check `tf.memory()` in console)

---

### TASK-STAB-04
**Title:** Fix duplicate `speakFeedback` function in Yoga.jsx  
**Priority:** P2  
**Objective:** Remove the duplicate function definition.

**Files to Modify:**
- `react/src/pages/Yoga/Yoga.jsx`

**Action:** The function `speakFeedback` appears twice (approximately lines 113-124 and lines 209-220). Remove the FIRST definition (lines 113-124). Keep the second definition. Verify neither version is called for now (the call site is also to be activated in TASK-STAB-07).

**Acceptance Criteria:**
- No duplicate function name warning in ESLint/browser console
- `speakFeedback` defined exactly once in the file

---

### TASK-STAB-05
**Title:** Fix Notifications page auto-email on mount  
**Priority:** P2  
**Objective:** Remove the `useEffect` that auto-fires email on every page visit.

**Files to Modify:**
- `react/src/components/home/routes/Notifications.jsx`

**Exact change:** Remove lines 35-37:
```javascript
// REMOVE:
useEffect(() => {
  handleSendEmail();
}, [])
```
The `handleSendEmail` function should only be triggered by explicit user action (button press). The existing `handleSendEmail` function body is fine — keep it. Just remove the auto-fire.

**Acceptance Criteria:**
- Navigating to `/secured/home/notifications` does NOT send an email
- Clicking "Send Email" button DOES send an email

---

### TASK-STAB-06
**Title:** Fix `registerController` response flow  
**Priority:** P2  
**Objective:** Fix multiple `res.send()` calls that may cause "headers already sent" errors.

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js` (`registerController` function)

**Problems:**
1. Multiple `res.send()` calls in same execution path (missing `return` statements)
2. Typo in success message: `"register successsfull"` (triple s)
3. No HTTP status code on some error paths

**Exact changes:**
```javascript
// Every early-return path must use `return res.status(XXX).json(...)`:
if (userNameExist) return res.status(409).json({ message: "Username already exists" });
if (emailExist) return res.status(409).json({ message: "Email already exists" });
// Success:
return res.status(201).json({ message: "Registration successful" });
```

**Acceptance Criteria:**
- No "Cannot set headers after they are sent" errors in backend logs
- Duplicate email registration returns 409 with message
- Duplicate username registration returns 409 with message
- Successful registration returns 201

---

### TASK-STAB-07
**Title:** Fix email `from` field env variable case  
**Priority:** P2  
**Objective:** Fix `process.env.email` → `process.env.EMAIL` in mail options.

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js`

**All occurrences of:**
```javascript
from: process.env.email,   // lowercase — evaluates to undefined
```
Change to:
```javascript
from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
```

**Also fix** the env variable name inconsistency:
- Current `.env` uses `PASSWORD` but the code in one function uses `process.env.pass` and another uses `process.env.PASSWORD`. Standardize to `EMAIL_PASSWORD` in both `.env` and code.

**Acceptance Criteria:**
- Sent emails show "AI Yoga Assistant" in the From field
- Emails are not rejected by Gmail due to missing sender

---

### TASK-STAB-08
**Title:** Fix `loginController` crash when no YogaData exists  
**Priority:** P2  
**Objective:** Handle the case where a user has no associated YogaData record.

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js` (`loginController`)

**Problem:**
```javascript
const yoga = await Yoga.findOne({ userId: user._id });
// If yoga is null and login was just after a fresh registration:
res.status(200).json({
  id: yoga._id,  // ← crash: Cannot read properties of null
  ...
})
```

**Fix:**
```javascript
const yoga = await Yoga.findOne({ userId: user._id });
// If somehow no yoga record, create a default one
if (!yoga) {
  yoga = await Yoga.create({ userId: user._id });
}
res.status(200).json({
  id: yoga._id,
  day: yoga.day,
  calories: yoga.calories,
  totalCalories: yoga.totalCalories,
  userDetails: { ... },
  token: createToken(user._id),
});
```

**Acceptance Criteria:**
- Login works even if YogaData document is missing for a user
- No 500 errors on login

---

### TASK-STAB-09  
**Title:** Fix `fetchyogadata` empty response on error  
**Priority:** P2  
**Objective:** Ensure all code paths return a response body.

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js` (`yogaFetchData` or similar)

**Problem:**
```javascript
const yoga = await Yoga.findOne({ userId: data.userId });
if (!yoga) {
  res.status(400);  // Sends status but NO body — client hangs waiting
}
```

**Fix:**
```javascript
if (!yoga) {
  return res.status(404).json({ message: "No yoga data found for this user" });
}
```

**Acceptance Criteria:**
- All API endpoints return a valid JSON body on all code paths
- No requests hang indefinitely

---

## P3 — ARCHITECTURE TASKS

---

### TASK-ARCH-01
**Title:** Create backend services/emailService.js  
**Priority:** P3  
**Objective:** Consolidate the Nodemailer transporter from its three definitions into one service module.

**Files to Create:**
- `backend/vedic-vision-backend/services/emailService.js`

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js` (remove duplicate transporters; import service)

**emailService.js:**
```javascript
const nodemailer = require('nodemailer');

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

const sendSessionSummary = async ({ to, userName, pose, calories }) => {
  const mailOptions = {
    from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
    to,
    subject: 'Your Yoga Session Summary',
    html: `
      <h2>Great workout, ${userName}!</h2>
      <p>You completed the <strong>${pose}</strong> pose.</p>
      <p>Calories burned this session: <strong>${parseFloat(calories).toFixed(2)}</strong></p>
      <p>Keep up the great work!</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

const sendDailySummary = async ({ to, userName, totalCalories }) => {
  const mailOptions = {
    from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
    to,
    subject: 'Your Yoga Progress Update',
    html: `
      <h2>Hello, ${userName}!</h2>
      <p>Total calories burned so far: <strong>${parseFloat(totalCalories).toFixed(2)}</strong></p>
      <p>Stay consistent — every session counts!</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendSessionSummary, sendDailySummary };
```

**Dependencies:** TASK-STAB-07

**Acceptance Criteria:**
- Emails are sent using the service functions
- Transporter is created only once per server startup
- Both summary types render proper HTML

---

### TASK-ARCH-02
**Title:** Split userController.js into separate controllers  
**Priority:** P3  
**Objective:** Separate auth logic from yoga/business logic.

**Files to Create:**
- `backend/vedic-vision-backend/controllers/authController.js` (login, register)
- `backend/vedic-vision-backend/controllers/yogaController.js` (updateCalories, fetchYogaData, sendEmail)

**Files to Delete (after migration):**
- `backend/vedic-vision-backend/controllers/userController.js`

**Files to Modify:**
- `backend/vedic-vision-backend/routes/userRoutes.js` (update requires)

**Note:** Implement this AFTER all P2 bug fixes are done so you don't accidentally re-introduce bugs while splitting.

**Dependencies:** All TASK-STAB-* tasks

**Acceptance Criteria:**
- All routes still function correctly
- No duplicate code between the two new controllers
- `userController.js` is deleted

---

### TASK-ARCH-03
**Title:** Update all frontend components to use `api.js` service  
**Priority:** P3  
**Objective:** Remove all hardcoded API URLs from components.

**Files to Modify:**
- `react/src/components/unsecured/Login.jsx`
- `react/src/components/unsecured/Signup.jsx`
- `react/src/components/home/routes/Recents.jsx`
- `react/src/components/home/routes/Notifications.jsx`
- `react/src/pages/Yoga/Yoga.jsx`

**Pattern for each:**
```javascript
// BEFORE
import axios from 'axios';
const res = await axios.post("https://vedic-vision-backend.onrender.com/api/user/...", data);

// AFTER
import api from '../../services/api';  // adjust relative path
const res = await api.post('/api/user/...', data);
```

**Dependencies:** TASK-AUTH-02

**Acceptance Criteria:**
- `grep -r "onrender.com" react/src/` returns no results
- All API calls use the `api` service instance
- Changing `VITE_API_BASE_URL` in `.env` changes where all calls go

---

### TASK-ARCH-04
**Title:** Fix backend CORS configuration  
**Priority:** P3  
**Objective:** Restrict CORS to known frontend origins.

**Files to Modify:**
- `backend/vedic-vision-backend/index.js`
- `backend/vedic-vision-backend/.env` (add FRONTEND_URL)
- `backend/vedic-vision-backend/.env.example` (document FRONTEND_URL)

**Implementation:**
```javascript
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
}));
```

**Dependencies:** TASK-STAB-01

---

### TASK-ARCH-05
**Title:** Fix database model types and options  
**Priority:** P3  
**Objective:** Correct `String` → `Number` types for calorie fields and fix typo in User model timestamps option.

**Files to Modify:**
- `backend/vedic-vision-backend/models/yogaData.js`
- `backend/vedic-vision-backend/models/userModel.js`

**yogaData.js changes:**
```javascript
calories: { type: Number, default: 0 },
totalCalories: { type: Number, default: 0 },
// Add session tracking:
sessionCount: { type: Number, default: 0 },
```

**userModel.js changes:**
```javascript
// Option typo fix:
{ timestamps: true }   // was: { timeStamp: true }
```

**Also:** Remove the `Number()` casts from the controller since the field is now natively a number.

**Dependencies:** None for schema fix; coordinate with TASK-ARCH-02 for controller changes.

---

## P4 — AI LIFECYCLE TASKS

---

### TASK-AI-01
**Title:** Wrap TF.js inference in tf.tidy() to prevent tensor memory leaks  
**Priority:** P4  
**Objective:** Ensure all intermediate tensors created during each inference cycle are disposed after use.

**Files to Modify:**
- `react/src/pages/Yoga/Yoga.jsx` (inside `detectPose` function and `runMovenet` interval callback)

**Pattern:**
```javascript
// Wrap the pose classification portion in tf.tidy()
const predictions = tf.tidy(() => {
  const input = keypoints
    .filter(k => (minPoseConfidence === undefined ? true : k.score > minPoseConfidence))
    .map(k => [k.x, k.y])
    .flat();

  if (input.length < 34) return null;

  const embedding = landmarks_to_embedding(tf.tensor2d([input]));
  return classifierRef.current.predict(embedding);
});

if (predictions) {
  predictions.array().then(data => {
    predictions.dispose();  // important — arrays are extracted, tensor can be released
    // process data[0]...
  });
}
```

**Dependencies:** TASK-STAB-03

**Acceptance Criteria:**
- `tf.memory().numTensors` does not grow unboundedly over a 60-second session
- Run `console.log(tf.memory())` before and after a session — tensor count should return to baseline

---

### TASK-AI-02
**Title:** Add model loading state to Yoga session UI  
**Priority:** P4  
**Objective:** Show a loading indicator while TF.js models are being initialized.

**Files to Modify:**
- `react/src/pages/Yoga/Yoga.jsx`

**Changes:**
```javascript
const [isModelLoading, setIsModelLoading] = useState(false);
const [modelLoadError, setModelLoadError] = useState(null);

// At start of runMovenet():
setIsModelLoading(true);
try {
  // ... existing model setup code
} catch (err) {
  setModelLoadError('Failed to load AI models. Please refresh and try again.');
  return;
} finally {
  setIsModelLoading(false);
}
```

**In JSX:**
```jsx
{isModelLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
    <p className="text-white text-lg">Loading AI models…</p>
  </div>
)}
{modelLoadError && (
  <div className="text-red-400 p-4">{modelLoadError}</div>
)}
```

**Dependencies:** TASK-STAB-03

---

### TASK-AI-03
**Title:** Implement basic text feedback for current pose in session UI  
**Priority:** P4  
**Objective:** Show visible on-screen text indicating whether the user is in the correct pose.

**Files to Modify:**
- `react/src/pages/Yoga/Yoga.jsx`

**Changes:**
```javascript
const [poseFeedback, setPoseFeedback] = useState('Get into position...');

// In classification result handler:
if (data[0][classNo] > 0.97) {
  setPoseFeedback('✓ Great! Hold the pose.');
} else {
  setPoseFeedback('Adjust your position to match the reference.');
}
```

**In JSX (add below canvas):**
```jsx
<div className={`text-center text-xl font-bold mt-2 ${flagRef.current ? 'text-green-400' : 'text-white'}`}>
  {poseFeedback}
</div>
```

**Dependencies:** TASK-STAB-03, TASK-STAB-04

---

## P5 — FUNCTIONALITY TASKS

---

### TASK-FEAT-01
**Title:** Remove photo upload from Signup form  
**Priority:** P5  
**Objective:** Fix the non-functional photo upload by removing it rather than implementing it incorrectly.

**Files to Modify:**
- `react/src/components/unsecured/Signup.jsx`

**Changes:**
1. Remove the photo/file input field from JSX
2. Remove `photo` from Formik `initialValues`
3. Remove photo from Yup validation schema
4. Remove `FormData` construction — send plain `values` object as JSON
5. Remove `enctype="multipart/form-data"` from form or equivalent

**Dependencies:** TASK-ARCH-03

---

### TASK-FEAT-02
**Title:** Remove dead/empty files and stubs  
**Priority:** P5  
**Objective:** Clean up the project structure by removing files that serve no purpose.

**Files to Delete:**
- `react/src/authconfig/Auth.jsx` (renders `<div>Auth</div>`, unused)
- `react/src/components/auth/Signup.jsx` (renders `<div>signup</div>`, stub)
- `react/src/components/home/StartWorkout.js` (empty — 0 bytes)
- `react/src/utils/music/index.jsx` (empty export)
- `react/anu/` directory (empty)
- `react/src/App.css` (Vite scaffold default CSS never used — but verify no import uses it before deleting)

**Also:**
- Remove `react-scripts` from `react/package.json` dependencies (wrong package — this is a Vite project)
- Remove `@mediapipe/pose`, `@tensorflow-models/posenet`, `@testing-library/*`, `ajv`, `ajv-keywords`, `web-vitals`, `wbm`, `react-whatsapp` from `react/package.json` if unused

**Dependencies:** TASK-ARCH-03, all P1 tasks (verify nothing new imports these files before deletion)

---

### TASK-FEAT-03
**Title:** Update email templates to use project owner identity  
**Priority:** P5  
**Objective:** Replace "Team DECODERZ" with appropriate branding.

**Files to Modify:**
- `backend/vedic-vision-backend/controllers/userController.js` (both email HTML blocks)
- After TASK-ARCH-01: `backend/vedic-vision-backend/services/emailService.js`

**Find and replace:**
- `"Your Team DECODERZ"` → `"AI Yoga Tutor"`
- Any other hackathon references

---

## P6 — UI/UX TASKS (Future — do not start until P0-P5 complete)

These tasks are listed for planning purposes. Gemini should NOT implement these until P0-P5 are stable and verified.

- TASK-UI-01: Design system tokens (colors, typography, spacing)
- TASK-UI-02: Landing page redesign
- TASK-UI-03: Auth pages (Login/Signup) visual redesign
- TASK-UI-04: Dashboard redesign
- TASK-UI-05: Yoga session screen redesign (UI only, not AI logic)
- TASK-UI-06: History page implementation
- TASK-UI-07: Progress page implementation
- TASK-UI-08: Profile/Settings pages
- TASK-UI-09: Blog page redesign
- TASK-UI-10: About page redesign

---

## TASK EXECUTION ORDER

```
PHASE 0 (Security — do immediately):
SEC-01 → SEC-02 → SEC-03 → SEC-04 → SEC-05

PHASE 1 (Auth architecture — in sequence):
AUTH-01 (AuthContext) →
AUTH-02 (api.js) →
AUTH-03 (ProtectedRoute) →
AUTH-04 (Login component) →
[VERIFY login works end-to-end] →
AUTH-05 (protect middleware) →
AUTH-06 (req.user._id) →
AUTH-07 (logout)

PHASE 2 (Stability — can be done in parallel per file):
STAB-01 (dotenv)
STAB-02 (isModified bug) — backend
STAB-03 (interval cleanup) — frontend
STAB-04 (duplicate function) — frontend
STAB-05 (notifications auto-fire) — frontend
STAB-06 (registerController response) — backend
STAB-07 (email from field) — backend
STAB-08 (login crash) — backend
STAB-09 (empty response) — backend

PHASE 3 (Architecture — after Phase 2):
ARCH-01 (emailService) →
ARCH-02 (split controllers) →
ARCH-03 (api.js in all components) →
ARCH-04 (CORS config) →
ARCH-05 (DB schema types)

PHASE 4 (AI lifecycle — after STAB-03):
AI-01 (tf.tidy) →
AI-02 (loading state) →
AI-03 (text feedback)

PHASE 5 (Features):
FEAT-01 → FEAT-02 → FEAT-03
CLEAN-01 (duplicate component removal)

PHASE 6 (UI — LAST):
UI tasks in order
```

---

## TASK DEPENDENCY GRAPH

```
SEC-01 ─┐
SEC-02 ─┤ (no deps — do first)
SEC-03 ─┤
SEC-04 ─┘

AUTH-01 → AUTH-02 → AUTH-03
                  → AUTH-04 → AUTH-05 → AUTH-06
                  → AUTH-07

STAB-01 (enables clean dotenv everywhere)
STAB-02 (independent)
STAB-03 → AI-01 → AI-02 → AI-03
STAB-04
STAB-05
STAB-06, STAB-07, STAB-08, STAB-09 (independent backend fixes)

STAB-07 → ARCH-01 → ARCH-02 → routes update
AUTH-02 → ARCH-03 (replaces hardcoded URLs)
STAB-01 → ARCH-04 (CORS uses dotenv)
```
