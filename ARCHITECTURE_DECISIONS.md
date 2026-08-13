# ARCHITECTURE DECISIONS
**Project:** AI Yoga Assistant  
**Author:** Vikram (via Antigravity architectural analysis)  
**Date:** 2026-08-10  
**Status:** APPROVED — ready for Gemini implementation

---

## ADR-001: Authentication Architecture

**Decision:** Use JWT stored in `localStorage` with Authorization header pattern, with a proper React Context auth layer.

**Problem:**  
The current implementation generates a JWT at login, returns it to the frontend, and then immediately discards it. The frontend stores only raw user fields in `localStorage`. The `ProtectedRoute.jsx` hardcodes `isAuthenticated = true`, meaning every page behind `/secured` is freely accessible without any login.

**Current Implementation:**
```javascript
// Login.jsx — token received and discarded
if (res.status === 200) {
  localStorage.setItem("username", ...);
  localStorage.setItem("email", ...);
  // token = res.data.token  ← never stored
}

// ProtectedRoute.jsx — completely broken
const isAuthenticated = true;  // HARDCODED
```

**Recommended Implementation:**

```
Login →
  Backend returns { token, userDetails, calories } →
  Frontend stores token in localStorage as "authToken" →
  AuthContext created, reads token on mount →
  ProtectedRoute reads from AuthContext, redirects if no token →
  All API calls attach "Authorization: Bearer <token>" header →
  Axios default headers set once in api service layer →
  Logout clears localStorage + resets AuthContext
```

**Architecture:**
1. `src/context/AuthContext.jsx` — React Context that holds `{ user, token, login, logout }`. On mount, reads `localStorage.getItem("authToken")` and validates it is present (not expired — decode the JWT client-side to check `exp` claim without network call).
2. `src/services/api.js` — Axios instance with `baseURL` from env var and a request interceptor that attaches `Authorization: Bearer ${token}` automatically.
3. `src/authconfig/ProtectedRoute.jsx` — Reads `token` from `AuthContext`. If null → redirect to `/login`. If present → render `<Outlet />`.
4. `src/hooks/useAuth.js` — Simple hook: `const { user, token, login, logout } = useContext(AuthContext)`.

**Why localStorage over httpOnly cookies?**  
HttpOnly cookies are theoretically more XSS-resistant for token storage. However:
- This app's backend is on a different domain (Render.com) from the frontend (local dev or another host) — cross-domain cookies require `SameSite=None; Secure` and explicit CORS `credentials: true`, adding complexity.
- The existing architecture is localStorage-based and changing to cookies would require backend changes (cookie parsing, `Set-Cookie` headers) on top of everything else being fixed.
- The real XSS risk in this app is minimal since there is no user-generated content rendering.
- **Decision:** Keep localStorage for now. Add httpOnly cookie support as a future P7 task AFTER the product is stabilized. Document the tradeoff clearly.

**What NOT to do:**  
- Do NOT store token in `sessionStorage` — this breaks on browser refresh.
- Do NOT decode the JWT on backend just for auth routes that don't need it — the `protect` middleware already handles this correctly.
- Do NOT implement refresh tokens at this stage — adds complexity without user-facing benefit yet.

**Affected Files:**
- `react/src/authconfig/ProtectedRoute.jsx` (rewrite)
- `react/src/authconfig/Auth.jsx` (replace with AuthContext)
- `react/src/components/unsecured/Login.jsx` (store token)
- `react/src/navigation/HomeNavigation.jsx` (logout via context)
- New: `react/src/context/AuthContext.jsx`
- New: `react/src/hooks/useAuth.js`
- New: `react/src/services/api.js`

**Risks:**
- Token expiry (30 days) not checked client-side → add `jwtDecode` utility to check `exp` on context mount
- If token exists but backend rotated JWT_SECRET, API calls will fail with 401 → handle 401 globally in Axios interceptor to call `logout()`

**Testing Strategy:**
1. Log in → check `localStorage.authToken` exists
2. Navigate to `/secured/home/recents` while logged in → renders
3. Clear localStorage → navigate to `/secured/home/recents` → redirects to `/login`
4. Send request with expired/invalid token → backend returns 401 → frontend auto-logs out

---

## ADR-002: Backend Authentication Middleware

**Decision:** Apply `protect` middleware to all routes that require authentication.

**Problem:**  
`authMiddleware.js` implements correct JWT verification but is imported nowhere in `userRoutes.js`. Every endpoint (`login`, `register`, `updatecal`, `fetchyogadata`, `sendotp`) is fully public. A malicious user could call `POST /api/user/updatecal` with any `userId` and corrupt another user's data.

**Current Implementation:**
```javascript
// userRoutes.js — protect imported but never used
const { protect } = require('../middlewares/authMiddleware');
router.post('/updatecal', updateCalories);       // UNPROTECTED
router.post('/fetchyogadata', yogaFetchData);    // UNPROTECTED
router.post('/sendotp', sendEmail);              // UNPROTECTED
```

**Recommended Implementation:**
```javascript
// Public routes (no auth required)
router.post('/login', loginController);
router.post('/register', registerController);

// Protected routes (require valid JWT)
router.post('/sendotp', protect, sendEmail);
router.post('/updatecal', protect, updateCalories);
router.post('/fetchyogadata', protect, yogaFetchData);
```

Additionally, once `protect` middleware is active, **stop reading `userId` from the request body**. Instead, read it from `req.user._id` (which the middleware already populates). This prevents a user from sending another user's `userId` in the request body to access their data.

**Affected Files:**
- `backend/vedic-vision-backend/routes/userRoutes.js`
- `backend/vedic-vision-backend/controllers/userController.js` (use `req.user._id` instead of `req.body.userId`)

**Risks:**
- Frontend must attach `Authorization: Bearer ${token}` header to all `/updatecal`, `/fetchyogadata`, `/sendotp` calls — ensure `api.js` service sets this automatically before enabling middleware.
- Test in sequence: implement `api.js` → update frontend calls → then enable `protect` middleware. Do NOT enable middleware before frontend is sending tokens or the app breaks.

---

## ADR-003: Environment Variable Architecture

**Decision:** Use a single `.env` file per environment with `VITE_` prefix for frontend variables. Use `.env.example` with no real values. Both `.env` files must be in `.gitignore`.

**Problem:**  
- Frontend: `.env` defines `PUBLIC_URL` but Vite requires `VITE_` prefix for client-accessible variables. The variable is read nowhere in code — all API URLs are hardcoded strings.
- Backend: `.env` contains real credentials that are committed to git.
- Both `.env` files should be in `.gitignore` (user has now added backend `.gitignore`).

**Frontend `.env` structure:**
```env
VITE_API_BASE_URL=http://localhost:5000
```
For production: `VITE_API_BASE_URL=https://vedic-vision-backend.onrender.com`

**Backend `.env` structure:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0...
JWT_SECRET=<random-256-bit-hex>
EMAIL=<gmail-address>
EMAIL_PASSWORD=<gmail-app-password>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env.example`:**
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Backend `.env.example`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/
JWT_SECRET=<generate-with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
EMAIL=<your-gmail-address>
EMAIL_PASSWORD=<gmail-app-password-from-google-account-settings>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Affected Files:**
- `react/.env` (update variable name)
- `react/.env.example` (new file)
- `backend/vedic-vision-backend/.env` (replace values after credential rotation)
- `backend/vedic-vision-backend/.env.example` (new file)
- `backend/vedic-vision-backend/utils/connectDb.js` (use `MONGO_URI` consistently)
- `backend/vedic-vision-backend/index.js` (call `dotenv.config()` before anything else)
- New: `react/src/services/api.js` (use `import.meta.env.VITE_API_BASE_URL`)

**Risks:**
- Frontend Vite env: `import.meta.env.VITE_API_BASE_URL` is only available at build time, not runtime. For production builds, the build must be made with the correct env set.
- Must verify that `react/.gitignore` includes `.env` before committing updated frontend env file.

---

## ADR-004: Frontend API Service Layer

**Decision:** Create a centralized `src/services/api.js` Axios instance that all components use. No component should contain a hardcoded API URL.

**Problem:**  
The API base URL `https://vedic-vision-backend.onrender.com` is hardcoded in 8+ places:
- `Login.jsx` line 30
- `Signup.jsx` line 46
- `Recents.jsx` line 17
- `Notifications.jsx` (home/routes) line 9
- `Yoga.jsx` line 319
- `secured/Notifications.jsx` line 8

This means changing the API URL requires touching 8 files.

**Recommended Implementation:**
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — auto-logout
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

All existing `axios.post(hardcodedUrl, ...)` calls become `api.post('/api/user/...', ...)`.

**Affected Files:**
- New: `react/src/services/api.js`
- `react/src/components/unsecured/Login.jsx`
- `react/src/components/unsecured/Signup.jsx`
- `react/src/components/home/routes/Recents.jsx`
- `react/src/components/home/routes/Notifications.jsx`
- `react/src/pages/Yoga/Yoga.jsx`
- `react/src/components/secured/Notifications.jsx` (or delete — see ADR-010)

---

## ADR-005: Password Hashing Bug Fix

**Decision:** Fix the `isModified` check in `userModel.js` pre-save hook.

**Problem:**  
```javascript
// Current — BROKEN
UserModel.pre("save", async function(next) {
  if(!this.isModified) {   // ← isModified is a FUNCTION REFERENCE, always truthy
    next()                 // ← next() is NEVER called
  }
  // Always runs even on non-password updates
  const salt = await bycrypt.genSalt(10)
  this.password = await bycrypt.hash(this.password, salt)
})
```

The guard `if(!this.isModified)` evaluates `this.isModified` as a function reference (which is always truthy), so `!truthy = false`, meaning the `next()` inside is never called. The hashing code always runs — even on updates where the password hasn't changed. This means if any other field (e.g. phone) were ever updated via `.save()`, the already-hashed password would be rehashed, permanently corrupting it.

Currently this doesn't break registration because registration always sets a new password. But it IS a latent bug that will break any future update-profile functionality, and it means `next()` inside the conditional is dead code.

**Correct Implementation:**
```javascript
UserModel.pre("save", async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Affected Files:**
- `backend/vedic-vision-backend/models/userModel.js`

**Risks:** Low. Registration still works as-is. This fix makes future safe.

---

## ADR-006: Backend Server Initialization

**Decision:** Call `dotenv.config()` at the very top of `index.js`, before any imports that require env vars.

**Problem:**  
```javascript
// index.js current
const express = require('express')  // executed before dotenv
const mongoose = require('mongoose')
require('dotenv')  // ← .config() never called; dotenv loaded but not applied
```

`require('dotenv')` loads the package but does not load the `.env` file — that requires `.config()`. The app works currently only because `userController.js` and `connectDb.js` each call `dotenv.config()` independently. This is fragile and will break if the order of module loading changes.

**Correct Implementation:**
```javascript
// index.js — correct
require('dotenv').config();  // MUST be first line before other requires
const express = require('express');
// ...
```

**Affected Files:**
- `backend/vedic-vision-backend/index.js`

---

## ADR-007: Backend Controller/Service Separation

**Decision:** Refactor `userController.js` into separate focused files without over-engineering.

**Problem:**  
`userController.js` at 288 lines combines: login logic, registration logic, OTP email generation, calorie email sending, calorie update, calorie fetch, and Nodemailer transport creation (three separate times). This is a maintenance problem.

**Recommended Structure:**
```
controllers/
├── authController.js      — login, register
├── yogaController.js      — updateCalories, fetchYogaData
└── notificationController.js — sendEmail (summary), future OTP

services/
├── emailService.js        — Nodemailer setup (ONE transporter, reused)
└── tokenService.js        — generateToken (move from config/)
```

**Key Rule:** The Nodemailer transporter should be created ONCE in `emailService.js` and exported. Controllers import the service. Do not create the transporter inside request handlers.

```javascript
// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();   // only needed if not called in index.js first

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,  // note corrected env key name
  },
});

const sendSessionSummary = async ({ to, userName, calories, pose }) => { ... };
const sendDailySummary = async ({ to, userName, calories }) => { ... };

module.exports = { transporter, sendSessionSummary, sendDailySummary };
```

**Affected Files:**
- New: `backend/vedic-vision-backend/services/emailService.js`
- New: `backend/vedic-vision-backend/controllers/authController.js`
- New: `backend/vedic-vision-backend/controllers/yogaController.js`
- Modified: `backend/vedic-vision-backend/routes/userRoutes.js` (import new controllers)
- Delete: `backend/vedic-vision-backend/controllers/userController.js` (after migration)

---

## ADR-008: Nodemailer `from` Field Bug Fix

**Decision:** Fix the `from` field env variable reference in email options.

**Problem:**  
```javascript
const mailOptions = {
  from: process.env.email,   // lowercase — evaluates to undefined
  to: email,
  ...
};
```
The env variable is `EMAIL` (uppercase) but the code uses `process.env.email` (lowercase). Node.js environment variables are case-sensitive on Linux/Mac. This means the `from` field is `undefined` and emails are sent without a sender address (they may be rejected or land in spam).

**Fix:**
```javascript
from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
```

**Affected Files:**
- `backend/vedic-vision-backend/controllers/userController.js` (lines 137, 217 — both occurrences)
- After refactor: `backend/vedic-vision-backend/services/emailService.js`

---

## ADR-009: Yoga Session Lifecycle (React + TensorFlow.js)

**Decision:** Move all detection state into `useRef` where appropriate, clear intervals on unmount, clean up camera stream on unmount, and use a proper `useEffect` cleanup function.

**Problem:**  
```javascript
// Current — module-level mutable variables (global state, not React state)
let interval;
let incorrectInterval;
let flag = false;

// runMovenet sets intervals but never clears them
interval = setInterval(() => { detectPose(...) }, 50);
incorrectInterval = setInterval(() => { ... }, 2000);
// No cleanup on component unmount!
```

When the user navigates away from the session, the intervals keep firing, calling `detectPose()` on a destroyed webcam reference. This is both a memory leak and a potential React error.

**Recommended Implementation:**

```javascript
function Yoga() {
  // Use useRef for mutation without re-render
  const intervalRef = useRef(null);
  const incorrectIntervalRef = useRef(null);
  const flagRef = useRef(false);
  const detectorRef = useRef(null);
  const classifierRef = useRef(null);

  // Cleanup function — called on Stop and on unmount
  const stopDetection = useCallback(() => {
    clearInterval(intervalRef.current);
    clearInterval(incorrectIntervalRef.current);
    intervalRef.current = null;
    incorrectIntervalRef.current = null;

    // Stop camera stream
    if (webcamRef.current?.video?.srcObject) {
      webcamRef.current.video.srcObject.getTracks().forEach(t => t.stop());
    }

    // Dispose TF tensors (models)
    if (classifierRef.current) {
      classifierRef.current.dispose();
      classifierRef.current = null;
    }
    // MoveNet detector: dispose if method exists
    if (detectorRef.current?.dispose) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    flagRef.current = false;
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);
```

**Audio Objects:**  
Audio objects are currently created in component render function body. They should be created in `useRef` OR outside the component (module level is acceptable for static audio assets, but `useRef` is cleaner for React):
```javascript
const correctAudioRef = useRef(new Audio(Correct));
const incorrectAudioRef = useRef(new Audio(Incorrect));
const startAudioRef = useRef(new Audio(Start));
```

**Dead `giveDynamicFeedback` function:**  
Currently implemented but all body code is commented out. Decision: **Keep the function signature but implement actual simple text feedback for MVP.** See ADR-012.

**TensorFlow tensor lifecycle:**  
The `landmarks_to_embedding` and related functions create TF tensors inside a setInterval. These tensors must be disposed or the GPU memory accumulates. The correct pattern:
```javascript
let embedding;
try {
  embedding = landmarks_to_embedding(input);
  const classification = poseClassifier.predict(embedding);
  // use classification
} finally {
  embedding?.dispose();
  classification?.dispose(); // only if not using .array() which already extracts
}
```
However, calling `tf.tidy()` around the entire inference block is the cleanest approach:
```javascript
const result = tf.tidy(() => {
  const embedding = landmarks_to_embedding(input);
  return poseClassifier.predict(embedding);
});
result.array().then(data => { ... result.dispose(); });
```

**Affected Files:**
- `react/src/pages/Yoga/Yoga.jsx` (significant refactor of lifecycle management)

---

## ADR-010: Component Deduplication

**Decision:** Remove or consolidate clearly duplicate components.

**Duplicates found:**
| Component | Duplicate | Action |
|---|---|---|
| `components/secured/Notifications.jsx` | `components/home/routes/Notifications.jsx` | Delete `secured/Notifications.jsx` — it is never used in routing |
| `components/secured/Contact.jsx` | `components/unsecured/Contact.jsx` | Keep `unsecured/Contact.jsx`; remove `secured/Contact.jsx` if identical |
| `speakFeedback()` in Yoga.jsx | Defined twice on lines 113 and 209 | Remove the first definition (lines 113-124) |
| `components/auth/Signup.jsx` stub | `components/unsecured/Signup.jsx` real | Delete stub in `components/auth/Signup.jsx` |
| `AuthNavIndex.js` exports stub Signup | Should export real Signup | Fix export to point to `components/unsecured/Signup.jsx` |

**Dead files to delete:**
- `react/src/components/home/StartWorkout.js` (empty, unused)
- `react/src/utils/music/index.jsx` (empty export)
- `react/src/authconfig/Auth.jsx` (renders `<div>Auth</div>`, unused)
- `react/anu/` directory (empty)

**Affected Files:** Multiple — see above.

---

## ADR-011: Notification Auto-Fire Bug Fix

**Decision:** Remove `useEffect` on mount that fires email send automatically in `Notifications.jsx`.

**Problem:**  
```javascript
// components/home/routes/Notifications.jsx
useEffect(() => {
  handleSendEmail();   // Sends email every time this page renders
}, [])
```
This sends an email to the user's address every single time they navigate to the Notifications page. This is clearly unintentional — it was likely a test that was committed accidentally.

**Fix:** Remove the `useEffect` entirely. The email should be sent only on explicit user action (button click). The page should provide a "Send Report" button and only fire on click.

**Affected Files:**
- `react/src/components/home/routes/Notifications.jsx`

---

## ADR-012: AI Feedback Architecture

**Decision:** Implement simple rule-based text feedback derived from keypoints. Do not build complex angle-calculation feedback at this stage.

**Problem:**  
`giveDynamicFeedback(keypoints)` is called when pose classification returns < 0.97 confidence. The function body contains 7 commented-out checks. As a result, incorrect pose gives no textual guidance — only an audio chime.

**Recommended Implementation (MVP tier):**  
Add a React state `feedbackText` that is updated when the pose is incorrect:
```javascript
const [feedbackText, setFeedbackText] = useState('');

// Inside classification callback
if (data[0][classNo] > 0.97) {
  setFeedbackText('✓ Perfect form! Hold the pose.');
  flagRef.current = true;
  skeletonColor = 'rgb(0,255,0)';
} else {
  setFeedbackText('Adjust to match the reference pose.');
  flagRef.current = false;
  skeletonColor = 'rgb(255,255,255)';
}
```

Display `feedbackText` as an overlay on the yoga session UI. This gives meaningful user feedback without requiring complex angle calculations.

**Phase 2 feedback (future, not now):**  
Implement angle-based analysis for specific poses. This requires:
1. Writing `calculateAngle(a, b, c)` — standard 3-point angle formula
2. Defining per-pose angle constraints (e.g., Tree pose: right knee angle > 90°)
3. Generating specific guidance strings ("Raise your right knee higher")

Do NOT implement Phase 2 feedback as part of the stabilization phase.

**Affected Files:**
- `react/src/pages/Yoga/Yoga.jsx`

---

## ADR-013: Database Schema Improvements

**Decision:** Fix type inconsistency in `YogaData` model. Add `timestamps: true` to User model. Do not change collection names (breaking migration risk).

**Problems:**
1. `calories` and `totalCalories` are stored as `String` type but used as numbers in calculations. `Number(prevyoga.totalCalories)` is called every update — fragile if the value is `""` or `null`.
2. `userModel.js` option key is `timeStamp: true` — should be `timestamps: true` (Mongoose option). The typo means timestamps are NOT being added to user documents.
3. `planModel.js` is unused. Keep in codebase for now but document as unused.

**Recommended Changes:**
```javascript
// yogaData.js
calories: { type: Number, default: 0 },         // Number not String
totalCalories: { type: Number, default: 0 },    // Number not String
sessionCount: { type: Number, default: 0 },     // NEW — track session count

// userModel.js
}, {
  timestamps: true,   // Fix typo: was "timeStamp"
})
```

**Migration note for `calories`/`totalCalories`:** If existing DB documents have string values, a one-time migration script would be needed. In practice for a fresh-start hackathon project with few real users, inserting new documents with Number type is safe. Mongoose will attempt to cast on read.

**Add `sessionCount` field** to `YogaData` so the 30-Day Plan progress can be calculated from real data instead of hardcoded `1/30`.

**Affected Files:**
- `backend/vedic-vision-backend/models/yogaData.js`
- `backend/vedic-vision-backend/models/userModel.js`
- `backend/vedic-vision-backend/controllers/userController.js` (remove `Number()` casts)

---

## ADR-014: CORS Configuration

**Decision:** Restrict CORS to known origins rather than allowing all.

**Problem:**  
```javascript
app.use(cors())  // Allows ANY origin
```

**Recommended:**
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://your-production-frontend-url.com',  // add when deploying
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
}));
```

**Affected Files:**
- `backend/vedic-vision-backend/index.js`
- `backend/vedic-vision-backend/.env` (add `FRONTEND_URL`)

---

## ADR-015: Signup Form — Photo Field Decision

**Decision:** Remove photo upload from registration for now. Add it later as a profile-update feature.

**Problem:**  
The signup form has a "Profile Photo" field. The frontend builds a `FormData` object with `photo` appended, BUT then sends `values` (plain JS object) instead of `formData`:
```javascript
// Signup.jsx line 46 — BUG
const res = await axios.post('.../register', values, {  // sends JSON, not formData
  headers: { 'Content-Type': 'application/json' },
});
```
The backend `registerController` does not use Multer middleware on the `/register` route (it's registered separately without upload middleware). The `photo` field is never read by the backend.

**Options:**
1. Fix the full flow (use `formData`, add Multer to `/register`, store filename in User model)
2. Remove photo from registration; add as profile-edit later

**Decision: Option 2** — Remove the photo field from the signup form entirely. Multer upload infrastructure already exists in `uploadMiddleware.js`. A proper "Upload Profile Photo" flow can be added to the Profile section as a future feature with a dedicated route `/api/user/upload-photo`.

**Affected Files:**
- `react/src/components/unsecured/Signup.jsx` (remove photo field + validation)
- `react/src/components/unsecured/Signup.jsx` (remove formData, send plain JSON)

---

## ADR-016: Route Architecture Review — Profile Routes

**Decision:** Profile routes (`/profile/*`) exist in code (`ProfileNavIndex.js`, `ProfileNavigationBar.jsx`) but are NOT registered in `App.jsx`. They are dead code — navigating to `/profile` returns a 404.

**Current App.jsx routes:**
```
/           → UnsecuredNavigation
/secured    → ProtectedRoute
```
No `/profile` route exists.

**Decision:** Do not add profile routes in the stabilization phase. The Profile pages are all placeholders anyway. When Profile is implemented as a product feature (Phase 6+), add the routes properly. For now, document as "not implemented" and remove the broken ProfileNavigationBar links.

**Affected Files:**
- `react/src/navigation/ProfileNavigationBar.jsx` (remove broken links to unregistered routes, or leave as future scaffold)

---

## RECOMMENDED TARGET ARCHITECTURE

```
AI YOGA ASSISTANT — TARGET ARCHITECTURE

FRONTEND (React 18 + Vite + TailwindCSS v3)
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          ← Global auth state (user, token, login, logout)
│   ├── hooks/
│   │   └── useAuth.js               ← Convenience hook
│   ├── services/
│   │   └── api.js                   ← Axios instance with interceptors
│   ├── authconfig/
│   │   └── ProtectedRoute.jsx       ← Reads AuthContext; redirects if no token
│   ├── components/                  ← UI components (no API calls inside — use hooks)
│   ├── pages/
│   │   └── Yoga/
│   │       └── Yoga.jsx             ← Cleaned lifecycle; ref-based state for AI loop
│   └── utils/
│       ├── data/                    ← Pose constants (no business logic)
│       └── helper/                  ← Canvas drawing utilities

BACKEND (Node.js + Express, CommonJS)
├── index.js                         ← dotenv.config() FIRST; cors with origin; routes
├── config/
│   └── createToken.js               ← JWT generator
├── controllers/
│   ├── authController.js            ← login, register
│   ├── yogaController.js            ← updateCalories, fetchYogaData
│   └── notificationController.js   ← sendEmail
├── services/
│   └── emailService.js             ← Single nodemailer transporter; email templates
├── middlewares/
│   └── authMiddleware.js           ← JWT verify; protect routes
├── models/
│   ├── userModel.js                ← Fixed isModified bug; timestamps: true
│   ├── yogaData.js                 ← Number types; sessionCount field
│   └── planModel.js                ← Unused; kept for documentation
└── routes/
    └── userRoutes.js               ← Public: /login, /register; Protected: all others

DATA FLOW (Authentication):
User Login →
  POST /api/user/login (public) →
  Backend validates credentials →
  Returns { token, userDetails, calories } →
  Frontend: AuthContext.login({ token, user: userDetails }) →
  localStorage.setItem("authToken", token) →
  localStorage.setItem("user", JSON.stringify(userDetails)) →
  Navigate to /secured/home/recents

Authenticated API Call:
  api.post('/api/user/updatecal', data) →
  api.js interceptor attaches Authorization header →
  Backend authMiddleware verifies token →
  req.user populated with user from DB →
  Controller uses req.user._id (not req.body.userId) →
  Response → Frontend

Token Expiry:
  API returns 401 →
  api.js response interceptor catches →
  Calls logout() → clears localStorage →
  Redirects to /login

Logout:
  User clicks Logout →
  AuthContext.logout() →
  localStorage.clear() →
  Navigate to /

DATA FLOW (AI Session):
User clicks "Start" →
  useEffect sets up: TF backend → MoveNet → Classifier →
  Stored in detectorRef, classifierRef →
  intervalRef = setInterval(detectPose, 50) →
  detectPose reads webcamRef video frame →
  tf.tidy() wraps: normalize → embed → predict →
  Result: if pose matches (>0.97) → green skeleton + timer →
  Otherwise → white skeleton + feedback text state

User clicks "Stop" OR navigates away:
  stopDetection() called (via button OR useEffect cleanup) →
  clearInterval(intervalRef.current) →
  dispose classifier model →
  stop camera tracks →
  POST /api/user/updatecal (with token) →
  Backend updates DB, sends email →
  Navigate back to pre-session view

AUTHENTICATION SECURITY MODEL:
- Token: JWT, 30-day expiry, stored in localStorage["authToken"]
- Transport: HTTPS in production; HTTP only in local dev
- Backend: protect middleware on all non-public routes
- Authorization: req.user._id used server-side (not client-supplied userId)
- Logout: localStorage.clear() only (no server-side token blacklist — acceptable for JWT + 30d expiry)
- CORS: allowedOrigins whitelist; not open wildcard
- Password: bcryptjs, saltRounds=10, correctly guarded pre-save hook
```

---

*This document governs all implementation decisions. Any deviation requires justification.*
