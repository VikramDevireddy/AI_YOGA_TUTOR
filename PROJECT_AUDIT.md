# PROJECT AUDIT — AI Yoga Assistant
**Audit Date:** 2026-08-10  
**Auditor:** Antigravity (AI Assistant)  
**Project Owner (New):** Vikram  
**Audit Phase:** Phase 0 — Discovery (NO MODIFICATIONS MADE)

---

## 1. EXECUTIVE SUMMARY

This is an AI-powered Yoga Assistant built as a hackathon project by team **DECODERZ**. The application uses Google's MoveNet pose detection model via TensorFlow.js to recognize yoga poses from a live webcam feed in real time.

The project is split into two separate directories:
- `react/` — Frontend (React + Vite + TailwindCSS)
- `backend/vedic-vision-backend/` — Backend (Node.js + Express + MongoDB)

### Critical Findings (Overview)
| Category | Severity | Count |
|---|---|---|
| Security: Credentials committed to source | 🔴 CRITICAL | 3 |
| Broken authentication guard | 🔴 CRITICAL | 1 |
| Personal files committed to repo | 🔴 HIGH | 2 |
| Team/hackathon identity in code | 🔴 HIGH | 6+ |
| Hardcoded production URLs | 🟠 HIGH | 8+ |
| Duplicate functions in same file | 🟠 HIGH | 1 |
| Incomplete/placeholder features | 🟠 HIGH | 7 |
| Dead/commented-out code | 🟡 MEDIUM | Multiple |
| Missing validation/error handling | 🟡 MEDIUM | Multiple |
| Bug: dotenv never loaded in server | 🟠 HIGH | 1 |
| Bug: `isModified` called not invoked | 🟠 HIGH | 1 |
| Unused packages | 🟡 LOW | 5+ |

---

## 2. ARCHITECTURE

### A. Current Architecture Overview

```
USER BROWSER
    │
    ├── React (Vite) — Frontend SPA
    │       ├── React Router v6 (client-side routing)
    │       ├── TailwindCSS v3 (utility-first styling)
    │       ├── TensorFlow.js + MoveNet (in-browser AI)
    │       ├── Axios (HTTP client)
    │       ├── Formik + Yup (forms and validation)
    │       ├── React Hot Toast (notifications)
    │       ├── React Webcam (camera access)
    │       └── localStorage (session persistence)
    │
    └── Node.js + Express — Backend API
            ├── MongoDB (via Mongoose) — Database
            ├── Nodemailer + Gmail SMTP — Email
            ├── JWT — Authentication tokens
            ├── bcryptjs — Password hashing
            ├── Multer — File uploads
            └── Deployed: Render.com (vedic-vision-backend.onrender.com)
```

### B. Frontend Architecture

**Framework:** React 18 + Vite 5  
**Styling:** TailwindCSS v3 (utility classes, no component library)  
**State:** Local component state only (no global state manager like Redux or Context)  
**Auth persistence:** `localStorage` (stores userId, email, username, phone, calories)

**Routing structure:**
```
/ (UnsecuredNavigation layout)
├── /           → Home (landing page)
├── /about      → About
├── /contact    → Contact / Feedback
├── /login      → Login
└── /sign-up    → Signup

/secured (ProtectedRoute layout — BROKEN, always allows access)
├── /secured/home (SecuredHome layout — HomeNavigation sidebar)
│   ├── /secured/home/recents        → Dashboard/Recents
│   ├── /secured/home/daysplan       → Yoga pose selection
│   ├── /secured/home/upcoming-activity → Upcoming activities
│   ├── /secured/home/notifications  → Notifications
│   ├── /secured/home/history        → Workout history (placeholder)
│   └── /secured/home/startworkout   → Yoga session (MoveNet AI)
├── /secured/blogs                   → Blog articles
└── /secured/contact                 → Contact (duplicate of unsecured contact)
```

### C. Backend Architecture

**Framework:** Express.js (CommonJS, not ESM)  
**Database:** MongoDB Atlas (`vedicVisson` database)  
**Auth:** JWT (30-day expiry)  
**Email:** Nodemailer via Google Gmail SMTP  

**API routes (all under `/api/user`):**
```
POST /api/user/login          → loginController
POST /api/user/register       → registerController
POST /api/user/sendotp        → sendEmail (misnamed — sends summary email, not OTP)
POST /api/user/updatecal      → updateCalories (also sends summary email)
POST /api/user/fetchyogadata  → yogaFetchData
```

**Note:** The `/sendotp` route sends an email summary. Despite the name, no actual OTP generation or verification is implemented.

### D. Database Architecture

**Database name:** `vedicVisson` (likely a typo of "vedicVision")

**Collections:**

| Collection | Model File | Description |
|---|---|---|
| `users` | `userModel.js` | User accounts |
| `Yogadata` | `yogaData.js` | Per-user yoga/calorie data |
| `plandata` | `planModel.js` | Yoga plans (UNUSED in any route) |

**User schema:**
```
firstName (String, required)
lastName  (String, required)
userName  (String, required)
email     (String, required)
password  (String, required) — bcrypt hashed
phone     (String, required)
timeStamp (option key typo: should be "timestamps" not "timeStamp")
```

**YogaData schema:**
```
userId       (ObjectId ref User, required)
day          (String, default "0")  — never updated in any route
calories     (String, default "0")  — last session calories
totalCalories (String, default "0") — accumulated calories
plan         (ObjectId ref plans, default null) — never set
timestamps   (correct option)
```

**PlanModel schema:**
```
planName (String)
photos   ([String], default [])
— This model is imported nowhere and used nowhere.
```

### E. Authentication Architecture

**Frontend:**
- Credentials sent to `/api/user/login`
- JWT token received but **NEVER STORED** — discarded after login
- User data stored in `localStorage`
- `ProtectedRoute.jsx` hardcodes `const isAuthenticated = true;` — ALL routes are accessible without login

**Backend:**
- JWT middleware (`authMiddleware.js`) exists and works correctly
- BUT no backend route uses the `protect` middleware — all routes are public
- Tokens expire in 30 days but the frontend never sends them

**Assessment:** Authentication is completely non-functional as a security mechanism. Anyone can access `/secured/*` routes without logging in. The token is generated at login but never used by either side.

### F. AI / Pose Detection Architecture

```
User Camera (react-webcam)
    │
    ▼ video frames (every 50ms interval)
MoveNet SINGLEPOSE_THUNDER model
    │
    ▼ 17 keypoints (x, y, confidence score)
Custom landmark normalization
    ├── get_center_point()
    ├── get_pose_size()
    ├── normalize_pose_landmarks()
    └── landmarks_to_embedding() → [1, 34] tensor
    │
    ▼ Custom TF.js classifier model
    (loaded from IBM Cloud Object Storage S3)
    https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json
    │
    ▼ Classification (8 classes):
    Chair, Cobra, Dog, No_Pose, Shoulderstand, Traingle, Tree, Warrior
    │
    ▼ Confidence threshold: 0.97
    │
    ├── > 0.97 → CORRECT pose
    │           skeleton turns green
    │           audio plays (startAudio, correctPoseAudio)
    │           timer tracks hold duration
    │
    └── ≤ 0.97 → INCORRECT pose
                skeleton stays white
                incorrectPoseAudio plays every 2s
                giveDynamicFeedback() called — ALL COMMENTED OUT (does nothing)
```

**What actually works:**
- ✅ Camera capture and rendering
- ✅ MoveNet keypoint detection
- ✅ Skeleton overlay on canvas (mirrored with CSS rotateY)
- ✅ Pose classification via second TF model
- ✅ Hold time tracking (poseTime, bestPerform)
- ✅ Calorie calculation (MET formula)
- ✅ Audio feedback (correct/incorrect sounds)

**What does NOT work:**
- ❌ Dynamic textual feedback (`giveDynamicFeedback` is fully commented-out)
- ❌ Speech synthesis feedback (implemented but not called)
- ❌ Pose switching during session (dropdown commented out)
- ❌ Camera/model cleanup on unmount (interval not cleared)
- ❌ WebGPU → CPU fallback may leave stale backend state
- ⚠️ External model URL dependency (IBM Cloud) — fragile

---

## 3. FOLDER STRUCTURE

```
E:/aiyoga/
├── .git/                          Git repository (root)
├── backend/
│   └── vedic-vision-backend/      Node.js + Express backend
│       ├── .git/                  NESTED git repo inside monorepo (problem)
│       ├── .env                   🔴 CREDENTIALS — MongoDB URI, Gmail password, JWT secret
│       ├── config/
│       │   └── createToken.js     JWT token generator (simple utility)
│       ├── controllers/
│       │   └── userController.js  All business logic (monolithic, ~290 lines)
│       ├── middlewares/
│       │   ├── authMiddleware.js   JWT verification middleware (correct implementation)
│       │   └── uploadMiddleware.js Multer upload config (DUPLICATE of inline code in routes)
│       ├── models/
│       │   ├── planModel.js        Plan model (UNUSED)
│       │   ├── userModel.js        User model (has bug on line 38)
│       │   └── yogaData.js         Yoga/calorie tracking model
│       ├── node_modules/
│       ├── public/                Upload destination path (referenced but may not exist)
│       ├── routes/
│       │   └── userRoutes.js       All routes (multer duplicated here AND in uploadMiddleware)
│       ├── utils/
│       │   └── connectDb.js        MongoDB connection
│       ├── index.js                Entry point (bug: dotenv never .config()'d here)
│       ├── package.json            Backend deps
│       └── package-lock.json
│
└── react/                         React + Vite frontend
    ├── anu/                       EMPTY directory (vestigial)
    ├── dist/                      Production build output (should be gitignored)
    ├── public/
    │   └── logo.jpg               App logo
    ├── src/
    │   ├── App.jsx                 Root routing component
    │   ├── App.css                 Minimal styles
    │   ├── index.css               Global styles + Tailwind directives
    │   ├── main.jsx                React entry point
    │   │
    │   ├── assets/                 Static images
    │   │   ├── bg.jpg, bg1-3...    Background images
    │   │   ├── home1-8.png         Landing page images
    │   │   ├── login.webp          Auth page illustration
    │   │   ├── jhushi_CV.pdf       🔴 PERSONAL FILE — team member CV committed to repo
    │   │   ├── jhushi_resume.pdf   🔴 PERSONAL FILE — team member resume committed to repo
    │   │   └── react.svg           Vite scaffold leftover
    │   │
    │   ├── authconfig/
    │   │   ├── Auth.jsx            UNUSED placeholder component ("Auth" renders <div>Auth</div>)
    │   │   └── ProtectedRoute.jsx  🔴 BROKEN — hardcodes isAuthenticated = true
    │   │
    │   ├── components/
    │   │   ├── DropDown/
    │   │   │   ├── DropDown.css    Dropdown styles
    │   │   │   └── DropDown.js     Unused dropdown component
    │   │   │
    │   │   ├── Instrctions/        (typo: should be "Instructions")
    │   │   │   ├── Instructions.css
    │   │   │   └── Instructions.jsx Pose instruction + image panel
    │   │   │
    │   │   ├── PoseStart/
    │   │   │   ├── PoseStart.css   Empty CSS
    │   │   │   └── PoseStart.jsx   Almost empty (128 bytes)
    │   │   │
    │   │   ├── auth/
    │   │   │   └── Signup.jsx      Tiny stub — just renders <div>signup</div>
    │   │   │
    │   │   ├── home/
    │   │   │   ├── Home.jsx        Small stub wrapper
    │   │   │   ├── StartWorkout.js Empty file (0 bytes)
    │   │   │   └── routes/
    │   │   │       ├── DaysPlan.jsx       Pose card grid (working)
    │   │   │       ├── History.jsx        Placeholder only
    │   │   │       ├── Notifications.jsx  WhatsApp + email triggers
    │   │   │       ├── Recents.jsx        Dashboard with calorie fetch
    │   │   │       ├── StratWorkout.jsx   Small stub
    │   │   │       └── UpcomingActivity.jsx Hardcoded activities
    │   │   │
    │   │   ├── profile/
    │   │   │   ├── Profile.jsx     Profile layout shell
    │   │   │   └── routes/
    │   │   │       ├── FeedbackAndSupport.jsx Static form (no submit handler)
    │   │   │       ├── Logout.jsx           Unknown (not audited)
    │   │   │       ├── PersonalInfo.jsx     Placeholder text only
    │   │   │       ├── Progress.jsx         Placeholder text only
    │   │   │       └── Settings.jsx         Unknown (not audited)
    │   │   │
    │   │   ├── secured/
    │   │   │   ├── Blogs.jsx       Blog grid (external image URLs, hotlinked)
    │   │   │   ├── Contact.jsx     Duplicate contact/feedback form
    │   │   │   ├── Home.jsx        Secured home layout with sidebar outlet
    │   │   │   └── Notifications.jsx  Unused duplicate of home/routes/Notifications
    │   │   │
    │   │   └── unsecured/
    │   │       ├── About.jsx       Feature cards (duplicate image URL for all cards)
    │   │       ├── Contact.jsx     Static feedback form (no submit handler)
    │   │       ├── Home.jsx        Landing page
    │   │       ├── Login.jsx       Login form (working)
    │   │       └── Signup.jsx      Registration form (partially working — photo not sent)
    │   │
    │   ├── guidance/               Audio files for pose feedback
    │   │   ├── correct.mp3
    │   │   ├── incorrect.mp3
    │   │   └── start.mp3
    │   │
    │   ├── navigation/
    │   │   ├── AuthNavIndex.js       Re-exports Login
    │   │   ├── HomeNavIndex.js       Re-exports 5 home route components
    │   │   ├── HomeNavigation.jsx    Sidebar for authenticated section
    │   │   ├── MainNavIndex.js       Re-exports About, Contact
    │   │   ├── MainNavigationBar.jsx Minimal unused navigation
    │   │   ├── ProfileNavIndex.js    Re-exports profile route components
    │   │   ├── ProfileNavigationBar.jsx Profile sidebar (links to unregistered routes)
    │   │   ├── securedNavigation/
    │   │   │   └── SecuredNavigation.jsx  Top navbar for authenticated users
    │   │   └── unsecuredNavigation/
    │   │       └── UnsecuredNavigation.jsx Top navbar for public pages + Outlet
    │   │
    │   ├── pages/
    │   │   └── Yoga/
    │   │       ├── Yoga.css          Session screen CSS
    │   │       └── Yoga.jsx          🧠 CORE: MoveNet AI session (441 lines)
    │   │
    │   └── utils/
    │       ├── data/
    │       │   └── index.jsx         Pose instructions, POINTS enum, keypointConnections
    │       ├── helper/
    │       │   └── index.jsx         drawPoint, drawSegment canvas utilities
    │       ├── images/
    │       │   └── yoga_pose.png     Single large pose image (696KB)
    │       ├── music/
    │       │   ├── count.wav         Large audio file (1.1MB)
    │       │   └── index.jsx         Empty export
    │       └── pose_images/
    │           ├── chair.jpg, cobra.jpg, dog.jpg, etc.  Pose reference images
    │           └── index.jsx         pose images map export
    │
    ├── .env                         VITE env (only PUBLIC_URL set but never used — uses hardcoded URL)
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html                   App entry HTML
    ├── MOBILE_UX_IMPROVEMENTS.md    Previous improvement notes
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── README.md                    🔴 Contains plaintext credentials (username + password)
    ├── tailwind.config.js           Minimal config (primary color: #c8bce1)
    └── vite.config.js               Minimal Vite config
```

---

## 4. FEATURE INVENTORY

| Feature | Status | Implementation Quality | Problems | Recommended Action |
|---|---|---|---|---|
| **Landing page** | ✅ Working | Basic | No CTA link, static counters, generic images | Redesign with real hero |
| **User registration** | ⚠️ Partial | Incomplete | Photo sent in FormData but API endpoint receives JSON (mismatch); no success/error UI messages | Fix photo upload or remove field |
| **User login** | ✅ Working | Acceptable | JWT discarded; error message too generic; console.log of URL in production | Fix token storage, improve errors |
| **Protected routes** | ❌ Broken | None | `isAuthenticated = true` hardcoded — anyone can access /secured | Implement real auth check |
| **JWT authentication** | ❌ Broken | None | Token generated but never stored/used on frontend; no route uses `protect` middleware | Implement token flow properly |
| **Logout** | ⚠️ Partial | Minimal | Clears localStorage + navigates to `/` — works but no token invalidation on server | Acceptable for localStorage-based auth |
| **Yoga pose selection** | ✅ Working | Basic | 7 AI-detectable poses + 7 demo-only poses (no AI for Bridge, etc.) | Clearly separate AI vs demo poses |
| **AI pose detection (MoveNet)** | ✅ Working | Good | Memory leak (intervals not cleared on unmount); no text feedback; stale flag variable | Fix cleanup, improve feedback |
| **Pose classification** | ✅ Working | Good | External model URL (IBM Cloud) — dependency risk; 0.97 threshold (reasonable but rigid) | Consider bundling model |
| **Hold time tracking** | ✅ Working | Basic | Correct implementation using timestamp diff | Minor cleanup |
| **Calorie calculation** | ✅ Working | Acceptable | MET formula (correct); stored as String not Number in DB | Fix DB schema type |
| **Session stop + calorie save** | ✅ Working | Acceptable | Saves and sends email — works; interval not cleared | Fix interval cleanup |
| **Email notification (post-session)** | ✅ Working | Acceptable | Sends HTML email with calorie summary; signs as "Team DECODERZ" | Update sender name |
| **"Send OTP" / summary email** | ⚠️ Misnamed | Confusing | Route is `/sendotp` but sends a summary email, not OTP | Rename route and function |
| **OTP verification** | ❌ Not implemented | None | OTP is generated in code but never stored or verified anywhere | Implement or remove completely |
| **Calorie fetch (dashboard)** | ✅ Working | Basic | Fetches total calories — works | Minor cleanup |
| **Dashboard (Recents)** | ⚠️ Partial | Partial | Shows total calories; progress bar hardcoded at 1/30 | Make dynamic |
| **Workout history** | ❌ Placeholder | None | Just shows a heading | Needs implementation |
| **30-Days Plan** | ⚠️ Partial | Partial | Shows pose cards; only 7 have AI detection; 7+ are display-only | Clarify which have AI |
| **Upcoming Activity** | ⚠️ Placeholder | Poor | Hardcoded YouTube links; one entry titled "something" | Clean up or remove |
| **Blogs** | ⚠️ Functional | Basic | Hardcoded articles with external image hotlinks (may break) | Use stable images |
| **About page** | ⚠️ Functional | Poor | All 6 feature cards use the same broken Bing image URL | Fix images |
| **Contact/Feedback forms** | ❌ Non-functional | None | No submit handler; forms are purely decorative | Implement or remove |
| **Profile section** | ❌ Placeholder | None | PersonalInfo, Progress, Settings all show only placeholder text | Implement |
| **WhatsApp notification** | ⚠️ Partial | Minimal | Opens `wa.me` link — basic WhatsApp Web link, not actual API | Clarify purpose |
| **Notification auto-email** | 🔴 Bug | Poor | `handleSendEmail()` fires in `useEffect` on mount — sends email every time page loads | Remove auto-fire |
| **Speech feedback** | ❌ Not working | Implemented but unused | `speakFeedback` defined twice (duplicate function), never called | Remove dup, connect to feedback |
| **Mobile responsiveness** | ✅ Mostly working | Good | Navigation drawers work well; camera interface breaks on mobile | Session UI needs mobile work |
| **Progress tracking** | ❌ Not implemented | Placeholder | No session history stored, no streak, no trend tracking | Design and implement |

---

## 5. DEPENDENCY AUDIT

### Frontend (react/package.json)

| Package | Purpose | Status | Notes |
|---|---|---|---|
| `react` ^18.3.1 | Core framework | ✅ Keep | |
| `react-dom` ^18.3.1 | DOM rendering | ✅ Keep | |
| `react-router-dom` ^6.26.0 | Routing | ✅ Keep | |
| `@tensorflow/tfjs` ^4.20.0 | TF.js core | ✅ Keep | |
| `@tensorflow-models/pose-detection` ^2.1.3 | MoveNet | ✅ Keep | |
| `@tensorflow/tfjs-backend-webgpu` ^4.10.0 | GPU acceleration | ✅ Keep | Fallback to CPU exists |
| `react-webcam` ^7.2.0 | Camera access | ✅ Keep | |
| `axios` ^1.7.4 | HTTP client | ✅ Keep | |
| `formik` ^2.4.6 | Form management | ✅ Keep | |
| `yup` ^1.4.0 | Validation schema | ✅ Keep | |
| `react-hot-toast` ^2.4.1 | Toasts | ✅ Keep | |
| `react-toastify` ^10.0.5 | Toasts | ❌ DUPLICATE | Both `react-hot-toast` AND `react-toastify` imported; only hot-toast actually used |
| `react-icons` ^5.3.0 | Icon library | ✅ Keep | |
| `react-countup` ^6.5.3 | Count animation | ⚠️ Consider | Only used in Home; imported but `CountUp` not actually rendered |
| `@mediapipe/pose` ^0.5 | MediaPipe fallback | ⚠️ Unused | Not referenced in any component code |
| `@tensorflow-models/posenet` ^2.2.2 | Older model | ❌ UNUSED | MoveNet is used; PoseNet is a different/older model |
| `@testing-library/jest-dom` ^6.4.8 | Testing | ⚠️ Not used | No tests exist |
| `@testing-library/react` ^16.0.0 | Testing | ⚠️ Not used | No tests exist |
| `@testing-library/user-event` ^14.5.2 | Testing | ⚠️ Not used | No tests exist |
| `ajv` ^8.17.1 | JSON schema validator | ❌ UNUSED | Not used anywhere |
| `ajv-keywords` ^5.1.0 | AJV plugin | ❌ UNUSED | Not used anywhere |
| `final` file: | Self-reference | ❌ BUG | `"final": "file:"` is a package.json artifact/error |
| `icons` ^1.0.0 | Unknown | ❌ SUSPICIOUS | Likely an accidental/wrong package |
| `react-scripts` ^5.0.1 | CRA scripts | ❌ WRONG | Project uses Vite, not CRA; this is leftover |
| `react-whatsapp` ^0.3.0 | WhatsApp integration | ❌ UNUSED | WhatsApp done via `wa.me` URL, not this package |
| `semver` ^7.6.3 | Semver utility | ❌ UNUSED | Not used in app code |
| `wbm` ^1.1.16 | WhatsApp Bot | ❌ UNUSED/RISKY | WhatsApp automation bot — not used and potentially against ToS |
| `web-vitals` ^4.2.3 | Performance metrics | ⚠️ Unused | No measurement code |
| `tailwindcss` ^3.4.9 | CSS framework | ✅ Keep | Dev dependency |

### Backend (vedic-vision-backend/package.json)

| Package | Purpose | Status | Notes |
|---|---|---|---|
| `express` ^4.19.2 | Web framework | ✅ Keep | |
| `mongoose` ^8.5.2 | MongoDB ODM | ✅ Keep | |
| `bcryptjs` ^2.4.3 | Password hashing | ✅ Keep | |
| `jsonwebtoken` ^9.0.2 | JWT | ✅ Keep | |
| `nodemailer` ^6.9.14 | Email | ✅ Keep | |
| `dotenv` ^16.4.5 | Env vars | ✅ Keep | Bug: not loaded in `index.js` |
| `cors` ^2.8.5 | CORS | ✅ Keep | Currently too permissive (allows all origins) |
| `multer` ^1.4.5-lts.1 | File uploads | ⚠️ Partially used | Upload handler defined twice; upload route not actually in use |
| `express-async-handler` ^1.2.0 | Async error handling | ✅ Keep | |
| `nodemon` ^3.1.4 | Dev server restart | ✅ Keep | Should be devDependency |
| `two-step-auth` ^1.1.2 | OTP library | ❌ UNUSED | Listed as dep but not imported anywhere |

---

## 6. TECHNICAL DEBT

### A. Critical Bugs

1. **`ProtectedRoute.jsx` line 7:** `const isAuthenticated = true;`  
   Impact: ALL routes under `/secured` are publicly accessible without authentication.

2. **`userModel.js` line 38:** `if(!this.isModified)` — should be `if(!this.isModified('password'))` or at minimum `if(!this.isModified())`.  
   Current bug: `this.isModified` is a function reference (always truthy), so the `next()` is NEVER called. This means **every save, including updates, re-hashes the already-hashed password**, corrupting it on any update.

3. **`index.js` (backend) line 8:** `require('dotenv')` — missing `.config()` call.  
   `dotenv` is required but `.config()` is never called in `index.js`. The env vars only load because `userController.js` and `connectDb.js` each call `dotenv.config()` separately. Fragile.

4. **`Yoga.jsx` — duplicate `speakFeedback` function:** Lines 113-124 and lines 209-220 define the exact same function. The second one shadows the first. JavaScript does not raise an error but the duplication is a code quality bug.

5. **Intervals never cleared in `Yoga.jsx`:** `interval` and `incorrectInterval` are module-level `let` variables. When the user navigates away from the session, neither `clearInterval` is called. The inference loop continues running in the background, consuming CPU and GPU resources.

6. **`Notifications.jsx` (home/routes) line 35-37:** `handleSendEmail()` fires in `useEffect` on every mount — sends an email to the user every time they visit this page. This is unintentional.

### B. Poor Structure / Abstractions

- **No global state management:** Auth state, user data, and calories all live in `localStorage` and are accessed with raw `localStorage.getItem()` calls scattered throughout components. Fragile and hard to maintain.

- **No API service layer:** API calls are made directly in components with hardcoded URLs. The base URL appears 8+ times hardcoded across files.

- **`userController.js` does too much:** Login, register, email sending, calorie update, calorie fetch — all in one 288-line file. No service layer separation.

- **Multer defined in two places:** `middlewares/uploadMiddleware.js` defines multer config, but `routes/userRoutes.js` defines its own separate multer config inline. The middleware file is never imported by any route.

- **Nodemailer transport created 3 times:** The transporter is created at module top-level, then again inside `updateCalories` and again inside `sendEmail`. Should be created once.

- **Naming inconsistencies:** `Instrctions` (typo), `Traingle` (typo), `vedicVisson` (typo in DB name), `StratWorkout` (typo), `connectot.js` → `connectDb.js`

### C. Missing Features / Stubs

- `Auth.jsx` — renders `<div>Auth</div>`, unused
- `components/auth/Signup.jsx` — renders `<div>signup</div>`, unused  
- `components/home/Home.jsx` — minimal wrapper
- `components/home/StartWorkout.js` — empty file (0 bytes)
- `utils/music/index.jsx` — empty export
- `History.jsx`, `PersonalInfo.jsx`, `Progress.jsx`, `Settings.jsx` — all placeholder-only

### D. Dead Code

- Commented-out `<select>` dropdowns in `Yoga.jsx` (lines 398-407, 421-430)
- Commented-out `correctInterval` (lines 171-175)
- Commented-out `countAudio.loop = true` (line 158)
- All feedback inside `giveDynamicFeedback` is commented out (lines 188-206)
- Commented-out import in `App.jsx` (line 14)
- `ToastContainer` imported but not rendered (App.jsx line 12)
- `toast` imported from `react-hot-toast` in `App.jsx` but not used

---

## 7. SECURITY AUDIT

### 🔴 CRITICAL ISSUES

**1. Credentials committed to source control:**
```
backend/vedic-vision-backend/.env contains:
  Mongo_uri = mongodb+srv://praveenkaikala25:VXelCAJNU1KlXg3x@cluster0.groyljh.mongodb.net/...
  JWT_SECRET = praveenkaikala25
  EMAIL     = praveenkaikala25@gmail.com  
  PASSWORD  = bhqa jkoa dznb zefo        ← Gmail App Password
```
**Action required:** Change all credentials immediately. Remove from git history.

**2. README.md contains plaintext demo credentials:**
```
username: vikramdevireddy888@gmail.com
password: 12345678
```
**Action required:** Remove from README.

**3. Personal CV/resume files committed to repo:**
```
react/src/assets/jhushi_CV.pdf      ← Team member's personal CV
react/src/assets/jhushi_resume.pdf  ← Team member's personal resume
```
**Action required:** Remove from repo and git history.

**4. JWT secret is weak:** `JWT_SECRET = praveenkaikala25` — uses developer's name. Should be a random 256-bit hex string.

**5. Insecure JWT storage:** The frontend doesn't actually store the JWT (which is ironically safer than `localStorage`). But the intent was to use localStorage for the token — which is XSS-vulnerable. Should use `httpOnly` cookies.

**6. CORS is fully open:** `app.use(cors())` with no configuration allows requests from any origin.

**7. No rate limiting:** No protection against brute-force attacks on login, no request limiting.

**8. No input sanitization:** Backend receives user data and puts it directly into DB queries without sanitization (MongoDB injection risk is low with Mongoose but still poor practice).

**9. No authorization on API routes:** The `protect` middleware exists but is NOT applied to ANY route. All endpoints are public. A malicious user could call `/api/user/updatecal` for any `userId`.

**10. Hardcoded phone number in secured/Notifications.jsx:**
```javascript
const phoneNumber = '917386431360';  ← Someone's personal phone number
```

---

## 8. HACKATHON IDENTITY / PERSONALIZATION AUDIT

The following items need to be replaced/removed to transfer ownership to Vikram:

| Location | Hackathon Content | Action |
|---|---|---|
| `backend/.env` | `praveenkaikala25` (MongoDB username, JWT secret, email) | 🔴 Change all credentials |
| `backend/userController.js` line 174 | `"Your Team DECODERZ"` in email HTML | Replace with "Vikram" |
| `backend/userController.js` line 254 | `"Your Team DECODERZ"` in email HTML | Replace with "Vikram" |
| `backend/utils/connectDb.js` line 7 | `dbName: "vedicVisson"` | Rename to "aiyoga" (optional, careful) |
| `react/README.md` | Default Vite template README + plain credentials | Replace with real README |
| `react/src/assets/jhushi_CV.pdf` | Team member's personal CV | 🔴 DELETE |
| `react/src/assets/jhushi_resume.pdf` | Team member's personal resume | 🔴 DELETE |
| `react/src/components/secured/Notifications.jsx` line 6 | Hardcoded personal phone number | Remove/replace |
| `react/package.json` line 2 | `"name": "final"` (hackathon artifact name) | Rename to "ai-yoga-assistant" |
| `react/MOBILE_UX_IMPROVEMENTS.md` | Document references AI assistant work from prior session | Keep (historical context, no personal names) |

---

## 9. API DOCUMENTATION (Current State)

### Base URL
- **Production (hardcoded):** `https://vedic-vision-backend.onrender.com`
- **Local:** `http://localhost:5000`
- **Env variable defined but unused:** `VITE_PUBLIC_URL` in `react/.env` — note: Vite requires prefix `VITE_` for client exposure, and the variable is named `PUBLIC_URL` (not `VITE_PUBLIC_URL`), so it is never accessible in components.

### Endpoints

#### POST `/api/user/login`
- **Auth:** None
- **Request:** `{ email, password }`
- **Response 200:** `{ id, day, calories, totalCalories, userDetails: { id, firstName, lastName, userName, phone, email }, token }`
- **Response 400:** "user not found"
- **Issues:** Returns token but crashes if no YogaData record exists for user (Yoga.findOne returns null, then `yoga._id` throws)

#### POST `/api/user/register`
- **Auth:** None
- **Request:** `{ firstName, lastName, userName, email, password, phone }`
- **Response 201:** `{ message: "register successsfull" }` (typo)
- **Issues:** Multiple `res.send()` calls possible without `return` — potential header-already-sent errors; no proper HTTP status codes before send; photo field referenced in frontend but backend ignores it

#### POST `/api/user/sendotp`
- **Auth:** None (despite name, it's an email summary sender)
- **Request:** `{ email, userName, userId }`
- **Response 200:** `{ message: "email send" }`
- **Issues:** Misnamed (not OTP); generates OTP value but never uses it; `from:` field uses `process.env.email` (lowercase) not `process.env.EMAIL`

#### POST `/api/user/updatecal`
- **Auth:** None
- **Request:** `{ score, email, userName, userId, pose }`
- **Response 200:** `{ message: "email send" }`
- **Issues:** Updates calories AND sends email in same call; duplicates nodemailer setup; console.log in production code; email `from` field uses wrong env key

#### POST `/api/user/fetchyogadata`
- **Auth:** None
- **Request:** `{ userId }`
- **Response 200:** `{ totalCalories, lastyoga }`
- **Issues:** `res.status(400)` without `.json()` or `.send()` on error — sends no response body; unhandled crash if userId not found

---

## 10. UI/UX AUDIT

### Screens Assessed

| Screen | Path | Assessment | Problems |
|---|---|---|---|
| Landing page | `/` | Basic, functional | Cannot navigate to login from CTA button; generic counters (100, 1000) not linked to real data; Instagram section irrelevant |
| Login | `/login` | Acceptable | Nothing to differentiate; generic |
| Signup | `/sign-up` | Acceptable | Photo field sends FormData but API uses JSON; no confirm after success |
| About | `/about` | Poor | All 6 cards use the same broken image URL (Bing proxy) |
| Contact | `/contact` | Non-functional | Static form; no submit handler |
| Dashboard (Recents) | `/secured/home/recents` | Basic | Progress hardcoded at 1/30; calories real; no visual hierarchy |
| 30-Days Plan | `/secured/home/daysplan` | Functional | Mixes AI-capable and non-AI poses without labeling |
| Yoga session | `/secured/home/startworkout` | Core feature — works | No text feedback; camera+canvas alignment uses hardcoded pixel positions; no loading state for model |
| Upcoming Activity | `/secured/home/upcoming-activity` | Placeholder | One item titled "something"; Brave search proxy image URLs (will break) |
| Blogs | `/secured/blogs` | Basic | External image hotlinks will break; links all open YouTube |
| Notifications | `/secured/home/notifications` | Broken | Sends email on every page mount; misleadingly named |
| History | `/secured/home/history` | Placeholder | No data |

### Visual Design Assessment
- **TailwindCSS used inconsistently** — some components use Tailwind, Yoga.jsx uses plain CSS with specific pixel values
- **Primary color** `#c8bce1` (lavender) used as background but not applied to most components
- **No design system** — button styles, card styles, and typography differ significantly between pages
- **No branding** — no logo in navigation, just text links
- **Yoga session** has orange gradient (`#FF8C00 → #FFA500`) which is completely different from the rest of the app's blue/purple palette
- **No loading states** for model loading (user sees nothing while MoveNet loads ~a few seconds)
- **No empty states** (History shows heading only)

---

## 11. PERFORMANCE OBSERVATIONS

- **Model loading:** MoveNet THUNDER model is loaded on every session start. No caching.
- **Inference frequency:** Every 50ms (20fps) — reasonable but with no frame-skip logic
- **Memory:** Audio objects created fresh in render function on every re-render
- **Bundle size:** Multiple heavy TF.js packages. No code-splitting.
- **Assets:** `utils/music/count.wav` is 1.1MB — not used anywhere in code
- **Images:** `utils/images/yoga_pose.png` is 696KB — not used in visible UI

---

## 12. PRIORITIZED IMPLEMENTATION PLAN

### IMMEDIATE PRIORITIES (Before any redesign)

**P0 — Security:**
1. Remove `jhushi_CV.pdf` and `jhushi_resume.pdf` from repo
2. Remove credentials from `backend/.env` (rotate MongoDB & Gmail credentials)
3. Remove plaintext credentials from `README.md`
4. Replace hardcoded phone number in `Notifications.jsx`

**P1 — Broken Core:**
1. Fix `ProtectedRoute.jsx` — implement real auth check from localStorage token
2. Fix `userModel.js` pre-save hook bug (`this.isModified()` → `this.isModified('password')`)
3. Fix intervals in `Yoga.jsx` — clear on unmount via `useEffect` cleanup
4. Fix `Notifications.jsx` — remove auto-fire on mount
5. Fix `speakFeedback` duplicate function

**P2 — Identity:**
1. Replace "Team DECODERZ" in email templates
2. Rename `package.json` name field
3. Update `index.html` title (already good: "AI - Yoga Tutor")

### PHASE 1 — STABILIZATION (Bugs + broken imports)
- Fix all P0/P1 above
- Add `.env` file for frontend with `VITE_API_BASE_URL`
- Create API service layer (`src/services/api.js`)
- Fix Signup — send JSON not FormData (remove photo field or fix backend)
- Fix backend dotenv loading

### PHASE 2 — OWNERSHIP & PERSONALIZATION
- Replace all DECODERZ references
- Remove personal files
- Rename project to AI Yoga Tutor
- Update email templates

### PHASE 3 — ARCHITECTURE
- Extract auth state to React Context
- Create centralized API service
- Refactor large `userController.js` into separate service files
- Apply `protect` middleware to appropriate routes

### PHASE 4 — DESIGN SYSTEM
- Define color tokens (indigo/purple + accent)
- Typography scale (Inter)
- Component library (buttons, cards, inputs, badges)
- Session UI overhaul

### PHASE 5 — UI REDESIGN
- Landing page with real hero
- Authentication screens
- Dashboard with real metrics
- Yoga session experience improvements
- Consistent styling across all screens

### PHASE 6 — FUNCTIONAL IMPROVEMENTS
- Real auth check on ProtectedRoute
- Session history storage (requires new backend endpoint + DB field)
- Working contact/feedback form
- AI feedback text in session UI
- Profile section with real user data

### PHASE 7 — PERFORMANCE & SECURITY
- CORS origin restriction
- Rate limiting (express-rate-limit)
- Input validation (joi or express-validator)
- Remove unused packages

### PHASE 8 — TESTING & VERIFICATION
- Manual browser testing of all routes
- Authentication flow test
- Pose detection smoke test
- Mobile responsive check

---

## 13. HOW THIS PROJECT WORKS (End-to-End)

### Registration
```
User fills form → POST /api/user/register (JSON)
Backend:
  1. Validates required fields (incomplete validation)
  2. Checks email uniqueness
  3. Checks username uniqueness  
  4. Creates User document (password is bcrypt-hashed by pre-save hook)
  5. Creates YogaData document linked to user
  6. Returns 201 { message: "register successsfull" }
Frontend:
  7. Navigates to /login
```

### Login
```
User enters email + password → POST /api/user/login
Backend:
  1. Finds user by email OR username
  2. bcrypt.compare(entered, storedHash)
  3. Fetches associated YogaData
  4. Returns user details + calories + JWT token
Frontend:
  5. Stores firstName+lastName, email, userId, phone, calories in localStorage
  6. JWT token received but DISCARDED (bug)
  7. Navigates to /secured/home/recents
```

### Yoga Session
```
User selects pose → navigates to /secured/home/startworkout
  (route state carries { data: { title, imag, benefit } })

User clicks "Start":
  1. TF.js backend initialized (WebGPU → CPU fallback)
  2. MoveNet SINGLEPOSE_THUNDER model loaded from TF Hub
  3. Custom classifier loaded from IBM Cloud S3
  4. setInterval at 50ms:
     a. Captures video frame from webcam
     b. MoveNet estimates 17 keypoints
     c. Keypoints with score > 0.4 drawn to canvas
     d. Keypoints mapped to [x,y] pairs
     e. Normalized via custom TF.js math (center + scale)
     f. Embedded to [1, 34] tensor
     g. Classifier predicts 8-class probabilities
     h. If target pose class > 0.97:
        - skeleton turns green
        - start/correct audio play
        - timer starts (setStartingTime)
     i. If < 0.97:
        - skeleton stays white
        - incorrect audio plays every 2s

User clicks "Stop":
  1. calculateCalories(pose, bestPerform) using MET formula
  2. POST /api/user/updatecal { userId, time, pose, score (calories), email, userName }
  3. Backend updates YogaData.calories + YogaData.totalCalories
  4. Backend sends summary HTML email to user
  5. Canvas cleared, camera stream stopped
  6. Audio paused
  7. isStartPose → false (returns to pre-session UI)
```

---

## 14. KNOWN LIMITATIONS

1. Pose detection model is hosted externally — if IBM Cloud goes down, sessions fail
2. Pose classifier supports only 7 poses (Chair, Cobra, Dog, Tree, Warrior, Shoulderstand, Triangle)
3. Session history is not persisted — only latest session calories are stored
4. No multi-user isolation on `/updatecal` — endpoint accepts any userId
5. Email summary is triggered on session stop (user cannot opt out)
6. No offline support
7. Camera requires HTTPS in production (Vite dev server is http — may cause issues)
8. React StrictMode removed from main.jsx render (was maybe removed to prevent double invocations)
9. TailwindCSS `bg-primary` class works on landing but most internal pages override with own backgrounds

---

*Audit complete. No code modifications have been made. This document represents the project state as-found.*
