# Lecture 09 – Deployment & Final Project

## What We Covered

* What "deploying" means, and what changes between your laptop and the internet
* A cloud database with MongoDB Atlas
* Environment variables in production
* Deploying the API (Node.js) to a hosting platform
* Deploying the React app to Vercel
* The three classic deployment bugs: CORS, refresh giving 404, and `http` vs `https`
* A security checklist before you share your app
* The final project

> This folder contains the finished application: `server/` is the API from Lecture 06 and `client/` is the React app from Lecture 08, ready to deploy. Platform menus and free-plan rules change from time to time, so treat the exact button names below as a guide and check each platform's own documentation.

## 1. What Changes in Production?

| On your laptop | On the internet |
|---|---|
| MongoDB on `localhost` | A cloud database (Atlas) |
| API at `http://localhost:3000` | API at `https://your-api.example.com` |
| React at `http://localhost:5173` | React at `https://your-app.example.com` |
| `.env` file on your computer | Environment variables set in the hosting dashboard |
| `npm run dev` | `npm start` (no auto-restart, no dev tools) |

Everything that differed between your laptop and the server must come from **environment variables**. That is why we did not hard-code any address or secret.

## 2. The Plan

```
Browser ─▶ React app (Vercel) ─▶ API (Node hosting) ─▶ Database (MongoDB Atlas)
```

Deploy in this order: **database, then API, then React app**, because each one needs the address of the previous one.

## 3. Step 1: Database on MongoDB Atlas

1. Create a free account at mongodb.com/atlas and create a free cluster.
2. **Database Access:** create a database user with a strong password. Save it.
3. **Network Access:** allow the hosting platform to connect. Free hosting platforms use changing addresses, so beginners usually allow `0.0.0.0/0` (everywhere). This is acceptable for a learning project **only if** the database password is strong. For a real business, restrict the addresses.
4. **Connect, Drivers:** copy the connection string. It looks like:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/fullstackApp?retryWrites=true&w=majority`
   Put your database name (`fullstackApp`) before the `?`.
5. If your password contains special characters (`@`, `#`, `/`), they must be URL-encoded, or choose a password with only letters and numbers.

## 4. Step 2: Deploy the API (`server/`)

On a Node hosting platform (for example Render, Railway or similar):

1. Push this repository to GitHub.
2. Create a new **Web Service** and connect the repository.
3. Set the **root directory** to `Lecture09-Deployment-and-Final-Project/server`.
4. **Build command:** `npm install` **Start command:** `npm start`
5. Add these **environment variables** in the dashboard (never in the code):

| Name | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random text (at least 32 characters). Make a new one. Do not reuse your local one |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | the address of your React app (you get it in Step 3). Leave it for now, and come back |

6. Set the **health check path** to `/api/health` if the platform asks for one.
7. Deploy. Open `https://your-api.example.com/api/health`. You should see `{"status":"ok"}`.

The platform sets `PORT` itself. Our code already uses `process.env.PORT`.

**Create the first admin in production.** The seed script reads `.env`, so run it **from your laptop**, pointing at Atlas, once:

```bash
cd server
# in your local .env, temporarily set MONGO_URI to the Atlas string, and set ADMIN_EMAIL / ADMIN_PASSWORD
npm run seed
# then put your local MONGO_URI back to localhost
```

## 5. Step 3: Deploy the React App (`client/`)

1. In Vercel, **Add New Project** and import the same repository.
2. Set the **root directory** to `Lecture09-Deployment-and-Final-Project/client`. The framework is detected as **Vite**.
3. Add one environment variable: `VITE_API_URL` = the address of your API from Step 2 (with `https://`, and no slash at the end).
4. Deploy. You get an address like `https://your-app.vercel.app`.
5. Go back to the API's environment variables and set `CLIENT_URL` to this address. Redeploy the API.

`client/vercel.json` contains one rewrite rule. Read the next section to see why.

## 6. The Three Classic Bugs

**1. CORS error in the browser console.**
The API refuses your website. Check that `CLIENT_URL` on the API is **exactly** the address of the React app (same `https`, same spelling, no slash at the end). After changing it, redeploy.

**2. Refreshing a page gives "404 Not Found".**
React Router creates `/students` in the browser. The server has no file with that name. The rewrite rule in `vercel.json` sends every URL to `index.html`, so React can take over.

**3. Mixed content: `http` and `https`.**
A page served over `https` is not allowed to call an `http` API. Always use `https://` in `VITE_API_URL`.

Two more things you will meet:

* **`VITE_API_URL` is baked in at build time.** If you change it, redeploy the React app.
* **Free plans may "sleep".** The first request after a quiet period can take 30 to 60 seconds. That is normal on free hosting.

## 7. Security Checklist Before You Share

* [ ] `.env` is in `.gitignore` and was never committed (check your Git history, not just today's files)
* [ ] `JWT_SECRET` in production is long, random and different from your local one
* [ ] The database password is strong and not used anywhere else
* [ ] The admin password is strong, and no default password remains in the data
* [ ] `CLIENT_URL` lists only your own websites (never `*`)
* [ ] Passwords are hashed (they are, with bcrypt) and never returned by the API
* [ ] If a secret was ever pushed to GitHub by mistake, **change it**. Deleting the file is not enough, because Git remembers old versions

## 8. Final Project

Build **your own** full-stack application using everything from Lectures 01 to 09. It must be **different** from the Student API (choose one or propose your own):

* Library Management (books, members, issuing and returning)
* Clinic Appointments (patients, doctors, bookings)
* Inventory and Sales for a small shop
* Course and Enrollment Manager
* Task and Project Tracker for a team

**Minimum requirements**

1. **API:** Express and Mongoose, with the folder structure from Lecture 04
2. **At least two related resources** (for example books and members), each with validation
3. **Authentication:** register, login, JWT, and at least two roles
4. **One list endpoint** with search, filter and pagination
5. **React app:** at least 5 pages, protected routes, and full CRUD for one resource
6. **Errors handled properly:** messages from the API are shown to the user
7. **Deployed:** a live link for the frontend and the API
8. **README:** what the app does, how to run it, a list of the API routes, and screenshots

**How it will be judged**

| Area | What we look for |
|---|---|
| Structure | clean folders, readable code, no secrets in Git |
| API design | correct methods, status codes, validation, security |
| Frontend | the app is easy to use, and loading and error states exist |
| Deployment | it works on the internet |
| Understanding | you can explain every file in your project |

## Where to Go Next

Testing (Jest and Supertest), TypeScript, a relational database with PostgreSQL, file uploads, real-time features with WebSockets, and Docker. Each of them builds on exactly what you learned in this course.
