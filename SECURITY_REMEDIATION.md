# SECURITY REMEDIATION PLAN
**Project:** AI Yoga Assistant  
**Author:** Vikram (via Antigravity architectural analysis)  
**Date:** 2026-08-10  
**Classification:** SENSITIVE — Do not commit this file with actual secret values filled in

---

## ⚠️ CRITICAL NOTICE

All credentials discovered in this codebase must be treated as **compromised**. They exist in git history even if removed from the working tree. Rotating credentials does not require git history cleanup — it means changing the actual passwords/secrets immediately so that the old values in history are useless.

---

## 1. SECRETS DISCOVERED

The following sensitive data was found in the repository. **No actual values are recorded in this document.**

### 1.1 Backend `.env` (committed to git)

| Type | Variable Name | Status | Action Required |
|---|---|---|---|
| MongoDB Atlas connection string | `Mongo_uri` | 🔴 COMPROMISED | Rotate MongoDB password immediately |
| JWT signing secret | `JWT_SECRET` | 🔴 COMPROMISED — weak, name-based value | Generate new 256-bit random secret |
| Gmail address | `EMAIL` | 🔴 EXPOSED | Revoke Gmail App Password immediately |
| Gmail App Password | `PASSWORD` | 🔴 COMPROMISED | Revoke this App Password in Google Account settings |

### 1.2 README.md (committed to git)

| Type | Location | Status | Action Required |
|---|---|---|---|
| User email address | `react/README.md` line 10 | 🔴 EXPOSED | Remove from README |
| Plain-text password | `react/README.md` line 11 | 🔴 EXPOSED | Remove from README; change account password |

### 1.3 Source Code

| Type | Location | Status | Action Required |
|---|---|---|---|
| Personal phone number | `react/src/components/secured/Notifications.jsx` | 🟠 EXPOSED | Remove from code |
| Personal CV | `react/src/assets/jhushi_CV.pdf` | 🟠 PERSONAL FILE | Delete from repo |
| Personal resume | `react/src/assets/jhushi_resume.pdf` | 🟠 PERSONAL FILE | Delete from repo |

---

## 2. REQUIRED CREDENTIAL ROTATION

### 2.1 MongoDB Atlas — Rotate Database Password

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to **Database Access** → edit the database user
3. **Generate a new strong password** (use the MongoDB "Autogenerate Secure Password" option)
4. Copy the new connection string
5. Update your local `backend/vedic-vision-backend/.env` with the new `MONGO_URI`
6. Update the production environment (Render.com) with the new connection string
7. **Do NOT commit the new `.env` to git**

### 2.2 Gmail — Revoke and Recreate App Password

1. Log in to your Google account
2. Go to **Security** → **2-Step Verification** → **App Passwords**
3. Find the App Password used for this project → **Delete/Revoke it**
4. Create a new App Password: Google Account → Security → App Passwords → Other (Custom name) → "AI Yoga Tutor"
5. Copy the new 16-character app password
6. Update `EMAIL_PASSWORD` in your local `.env`
7. Update production environment on Render.com

### 2.3 JWT Secret — Generate New Random Secret

The current JWT secret is a person's name. This is extremely weak — dictionary attacks would trivially forge tokens.

**Generate a proper secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This outputs a 64-character hex string (256-bit). Use this as your new `JWT_SECRET`.

**Impact of rotating JWT secret:**  
All existing JWT tokens issued under the old secret will immediately become invalid. All logged-in users will be logged out. This is acceptable and desirable given the old secret was compromised.

Update in:
1. Your local `backend/vedic-vision-backend/.env`
2. Production environment on Render.com

### 2.4 User Account Password (README)

The README contained a plain-text password for what appears to be a demo/test account. If this account exists:
1. Log into the account at the production URL
2. Change the password immediately
3. If you cannot log in (account may not exist), ignore this step

---

## 3. ENVIRONMENT VARIABLE ARCHITECTURE

### 3.1 Frontend Environment Variables

**File:** `react/.env` (local only — never commit)  
**Template:** `react/.env.example` (commit this)

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Note on Vite environment variables:**
- Variables must be prefixed with `VITE_` to be accessible in client code
- Access in code with: `import.meta.env.VITE_API_BASE_URL`
- Variables are baked into the build at build time — not runtime
- For production, set the correct value before running `npm run build`

**For Render.com static site hosting (if used):**
Set environment variable `VITE_API_BASE_URL=https://your-backend.onrender.com` in the Render dashboard before deploying.

### 3.2 Backend Environment Variables

**File:** `backend/vedic-vision-backend/.env` (local only — never commit)  
**Template:** `backend/vedic-vision-backend/.env.example` (commit this)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<new-username>:<new-password>@cluster0.xxxx.mongodb.net/aiyoga?retryWrites=true&w=majority

# Authentication
JWT_SECRET=<64-char-hex-from-crypto.randomBytes>

# Email (Gmail SMTP)
EMAIL=<your-gmail>@gmail.com
EMAIL_PASSWORD=<new-16-char-app-password>

# CORS
FRONTEND_URL=http://localhost:5173
```

**For Production (Render.com backend):**
Add all these variables in the Render dashboard → Service → Environment:
- `NODE_ENV=production`
- `MONGO_URI=<production connection string>`
- `JWT_SECRET=<same as local or a separate production secret>`
- `EMAIL=<gmail>`
- `EMAIL_PASSWORD=<app password>`
- `FRONTEND_URL=<production frontend URL>`
- Note: `PORT` is usually set automatically by Render — you may not need to set it

---

## 4. .GITIGNORE REQUIREMENTS

### 4.1 Frontend (`react/.gitignore`)

Verify these entries exist (add if missing):
```gitignore
# Environment variables — NEVER COMMIT
.env
.env.local
.env.production
.env.staging
.env.*.local

# Build output — generate on deploy, not tracked
dist/
dist-ssr/

# Dependencies
node_modules/
```

### 4.2 Backend (`backend/vedic-vision-backend/.gitignore`)

Already updated by repo owner. Verify:
```gitignore
node_modules
.env
```

Recommend adding:
```gitignore
.env.local
.env.production
*.log
logs/
```

### 4.3 Root `.gitignore`

If a root `.gitignore` exists, add:
```gitignore
# IDE and OS
.DS_Store
Thumbs.db
.vscode/
.idea/

# Dist builds
react/dist/
```

---

## 5. GIT HISTORY CLEANUP STRATEGY

### 5.1 Assessment

The committed `.env` file with real credentials exists in git history at `backend/vedic-vision-backend/.env`. The personal PDFs and README credentials also exist in history.

**⚠️ Critical Decision Point:**

Rewriting git history removes the committed secrets from the repository itself, but:
1. Anyone who already cloned the repository still has the old history
2. If the repository is public, search engines and archive services may have crawled it
3. History rewriting requires `git push --force` which can disrupt collaborators

**Recommended strategy given this is a solo project transitioning to personal ownership:**

#### Option A: Credential Rotation Only (Recommended for solo projects)

**Do:**
1. Rotate all credentials immediately (Section 2 above)
2. Add `.env` to `.gitignore` (already done)
3. Remove personal files from current working tree with `git rm`
4. Commit the removal
5. Do NOT rewrite history

**Why this is acceptable:**
- The old credentials are now invalid — even if someone finds them in history, they cannot use them
- No force-push risk to shared remotes
- History is preserved — audit trail of project evolution is maintained

**If the repository is private (most likely):** Option A is fully sufficient.

#### Option B: BFG Repo Cleaner (If repository is/was public)

If the repository has been public at any point, consider rewriting history to remove the secrets file. Use [BFG Repo Cleaner](https://rtyler.github.io/bfg-repo-cleaner/), which is safer than `git filter-branch`.

```bash
# 1. Make a fresh clone
git clone --mirror https://github.com/your-username/your-repo.git repo-mirror.git

# 2. Run BFG to remove .env file from all history
java -jar bfg.jar --delete-files .env repo-mirror.git

# 3. Run BFG to strip specific text patterns (credentials)
# Create a file 'passwords.txt' with one password per line (the actual values)
java -jar bfg.jar --replace-text passwords.txt repo-mirror.git

# 4. Clean up
cd repo-mirror.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# 5. Force push — WARNING: this changes history for all collaborators
git push --force
```

**⚠️ Warnings for Option B:**
- This invalidates all existing clones and pull requests
- GitHub may need to enable "Allow force-push" on the repository settings
- You MUST rotate credentials first regardless — BFG doesn't change what services already know
- This is irreversible — backup your repo first

**Recommendation:** Since credentials are rotated (making old ones useless), since this appears to be a private or recently public repo, and since rewriting history adds complexity and risk — **use Option A only**. The rotated credentials make the historical exposure harmless.

### 5.2 Minimum Required Git Actions (Option A)

```bash
# 1. Remove personal PDF files
git rm react/src/assets/jhushi_CV.pdf
git rm react/src/assets/jhushi_resume.pdf
git commit -m "security: remove personal PDF files"

# 2. Update README
# (edit react/README.md to remove credentials)
git add react/README.md
git commit -m "docs: remove credentials from README"

# 3. Ensure .env files are not tracked
git ls-files backend/vedic-vision-backend/.env
# If tracked, run:
git rm --cached backend/vedic-vision-backend/.env
git commit -m "security: remove .env from tracking"

# 4. Remove dist/ if tracked
git rm -r --cached react/dist/ 2>/dev/null
git commit -m "cleanup: remove build artifacts from tracking" 2>/dev/null || echo "dist not tracked"

# 5. Verify clean state
git status
git ls-files | grep -E "\.env$|jhushi|password"  # Should be empty
```

---

## 6. README SECURITY REVIEW

### Current Content (DO NOT REPRODUCE VALUES):
The README at `react/README.md` contains:
- An email address that is a real Gmail account
- A plain-text password for that account

### Required Cleanup:
Replace entire README with the version specified in TASK-SEC-02 (IMPLEMENTATION_PLAN.md).

The replacement README:
- Documents how to set up the project
- References `.env.example` for configuration
- Contains NO credentials, email addresses, or passwords
- Is safe to make public if needed

---

## 7. SECURITY ARCHITECTURE (POST-FIX TARGET)

### 7.1 Transport Security
- All production traffic must use HTTPS
- Enforce HTTPS in production: Render.com handles TLS automatically for deployed services
- Local development over HTTP is acceptable (WebRTC camera requires HTTPS in production)

### 7.2 Authentication Security

**Current design (post-fix):**
- JWT tokens stored in `localStorage`
- Tokens expire in 30 days
- Tokens use HS256 algorithm with a 256-bit secret

**Tradeoffs acknowledged:**
- `localStorage` is accessible to JavaScript — XSS attacks can steal tokens
- This app has no user-generated content that could cause XSS
- The risk is low for this application's current threat model
- Best practice would be httpOnly cookies, but that requires cross-domain cookie configuration which adds complexity

**XSS mitigation:**
- React's JSX auto-escapes all dynamic content (prevents most XSS vectors)
- No `dangerouslySetInnerHTML` usage detected in codebase
- Content Security Policy header can be added future (not required now)

### 7.3 Authorization

**Target (post-fix):**
- `protect` middleware on all non-auth routes
- `userId` derived from verified JWT (`req.user._id`), never from request body
- One user cannot access/modify another user's data

### 7.4 Password Security
- bcryptjs with salt rounds = 10 (appropriate)
- Pre-save hook correctly guards unnecessary re-hashing (after bug fix)
- Passwords never returned in API responses (User model uses `.select('-password')` in auth middleware)

### 7.5 Input Validation (Current Gap — Future Work)
- Backend has no input validation beyond basic existence checks
- Future: add `joi` or `express-validator` to validate all request bodies
- Particularly important for: email format, password strength, phone format

### 7.6 Rate Limiting (Current Gap — Future Work)
- No protection against brute-force login attacks
- Future: add `express-rate-limit` to `/api/user/login` and `/api/user/register`
- Recommended limits: 10 requests per 15 minutes per IP for login

### 7.7 CORS
- Currently: `app.use(cors())` — allows all origins
- Target: whitelist approach using `FRONTEND_URL` env variable
- Production: only the deployed frontend URL is allowed

---

## 8. SECURITY CHECKLIST

Use this to verify security posture after all remediation tasks are complete.

### Credentials
- [ ] MongoDB Atlas password rotated
- [ ] Gmail App Password revoked and new one created
- [ ] JWT secret replaced with 256-bit random value
- [ ] All services (Render.com) updated with new credentials
- [ ] Local `.env` files updated with new credentials
- [ ] User account password changed (if account is real)

### Repository
- [ ] `backend/vedic-vision-backend/.env` NOT tracked by git (`git ls-files | grep backend.*\.env` = empty)
- [ ] `react/.env` NOT tracked by git (`git ls-files | grep ^react/\.env` = empty)
- [ ] `jhushi_CV.pdf` removed from git tracking
- [ ] `jhushi_resume.pdf` removed from git tracking
- [ ] `react/README.md` contains no credentials
- [ ] `react/dist/` NOT tracked by git

### Code
- [ ] No hardcoded phone numbers in any source file
- [ ] No hardcoded API URLs in any source file
- [ ] No `console.log` statements in production controllers that might log sensitive data
- [ ] `isAuthenticated = true` vulnerability fixed in `ProtectedRoute.jsx`
- [ ] `protect` middleware applied to all protected backend routes
- [ ] `req.user._id` used in controllers (not `req.body.userId`)

### Environment
- [ ] `.env.example` committed for frontend
- [ ] `.env.example` committed for backend
- [ ] `.gitignore` covers `.env` in both locations
- [ ] CORS is restricted to known origins (not open wildcard)

### Authentication
- [ ] Login response includes JWT token
- [ ] Frontend stores JWT token in `localStorage.authToken`
- [ ] All authenticated API calls include `Authorization: Bearer` header
- [ ] 401 responses auto-logout the user
- [ ] ProtectedRoute redirects unauthenticated users to `/login`

---

## 9. SECURITY TIMELINE

| Action | Priority | Risk if Delayed |
|---|---|---|
| Rotate MongoDB password | Immediate | DB data accessible to anyone with the connection string |
| Revoke Gmail App Password | Immediate | Email account activity can be spoofed under project identity |
| Generate new JWT secret | Immediate (after credential rotation) | Old tokens cannot be invalidated without this |
| Remove personal PDFs | Before next push | Team member's personal information exposed |
| Remove credentials from README | Before next push | Credentials visible to anyone with repo access |
| Fix ProtectedRoute | This sprint | All protected pages publicly accessible |
| Apply protect middleware | After frontend sends tokens | All API endpoints publicly writable |
| CORS restriction | This sprint | Backend callable from any origin including malicious |

---

*Security remediation is never "done" — it is an ongoing process. This document covers the critical immediate actions for this project's current state.*
