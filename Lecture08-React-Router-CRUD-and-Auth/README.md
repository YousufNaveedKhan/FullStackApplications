# Lecture 08 – React Router, Auth Context, Protected Routes & Full CRUD

## What We Covered

* Pages and real URLs with React Router
* `Routes`, `Route`, `Link`, `Navigate`, `useNavigate`, `useParams`, `useLocation`
* The Context API and a custom hook (`useAuth`)
* Protected routes, and admin-only routes
* Remembering where the visitor wanted to go before login
* Create, read, update and delete from the screen
* One form component for both "add" and "edit"
* Showing validation errors that come from the API
* Why hiding a button is **not** security

> This lecture builds on Lecture 07 and uses the same API (Lecture 06). Start the API first.

## 1. React Router

Lecture 07 had one screen. A real app has many pages, each with its own URL. React Router changes what is on screen when the URL changes, **without reloading the page**.

```jsx
<Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/students" element={<StudentsPage />} />
    <Route path="/students/:id/edit" element={<StudentFormPage />} />
    <Route path="*" element={<NotFoundPage />} />
</Routes>
```

| Piece | What it does |
|---|---|
| `BrowserRouter` | wraps the app (in `main.jsx`) so routing works |
| `Link to="/students"` | a link that does not reload the page (use it instead of `<a>`) |
| `Navigate` | redirects when it is rendered |
| `useNavigate()` | redirects from code, e.g. after a form is saved |
| `useParams()` | reads `:id` from the URL |
| `useLocation()` | reads where we are (and any `state` we passed) |
| `path="*"` | matches everything else: our "not found" page |

## 2. Folder Structure

```
src/
├── main.jsx               BrowserRouter + AuthProvider
├── App.jsx                the route table
├── api.js
├── context/AuthContext.jsx
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
└── pages/
    ├── LoginPage.jsx
    ├── StudentsPage.jsx
    ├── StudentFormPage.jsx
    └── NotFoundPage.jsx
```

## 3. Context API: Sharing the Logged-In User

In Lecture 07 `App` held the token and passed it down through props. With more pages, passing it through every level becomes painful ("prop drilling"). **Context** lets any component read shared data directly:

```jsx
const { user, token, isAdmin, login, logout } = useAuth();
```

* `AuthProvider` holds the state and wraps the whole app.
* `useAuth()` is a small **custom hook** (a function starting with `use` that uses other hooks).
* `useCallback` and `useMemo` keep the same function and object between renders, so effects that depend on them do not run again for no reason.

## 4. Protected Routes

```jsx
<Route path="/students/new" element={
    <ProtectedRoute adminOnly>
        <StudentFormPage />
    </ProtectedRoute>
} />
```

`ProtectedRoute` checks two things:

1. No token? Send the visitor to `/login` and remember where they wanted to go (`state={{ from: location }}`).
2. `adminOnly` and the user is not an admin? Send them back to `/students`.

After login, `LoginPage` reads `location.state.from` and takes the visitor to the page they originally asked for.

## 5. Create, Read, Update, Delete

| Action | Request | Where in the code |
|---|---|---|
| Read | `GET /api/students?page=1&search=` | `StudentsPage` |
| Create | `POST /api/students` | `StudentFormPage` |
| Update | `PUT /api/students/:id` | `StudentFormPage` |
| Delete | `DELETE /api/students/:id` | `StudentsPage` |

* **One form for two jobs:** `useParams()` returns an `id` on `/students/:id/edit` and nothing on `/students/new`. If there is an id we load the student into the form and use `PUT`, otherwise we use `POST`.
* **One handler for all inputs:** each input has a `name`, so `setForm({ ...form, [name]: value })` updates the right field.
* **Delete** asks for confirmation with `window.confirm`, then reloads the list. If we deleted the last student on a page, we go back one page.

## 6. Showing API Errors

The API answers a failed save with `{ message, errors: [...] }`. `apiFetch` puts the list into `error.details`, and the form shows each message. Try saving the same email twice, and you will see "email already exists" from the server.

## 7. UI Checks Are Not Security

We hide the **Add**, **Edit** and **Delete** buttons from students. That is good for the user, but a student could still open the browser's network tab and send the request by hand. The **real protection** is in the API (`authorize("admin")`, Lecture 05). Rule of the course:

> The frontend decides what to *show*. The backend decides what is *allowed*.

## 8. Run It

```bash
npm install
cp .env.example .env       # on Windows: copy .env.example .env
npm run dev                # http://localhost:5173
```

Log in as a student (register through Postman) and as the admin, and compare what each one can see and do.

## Exercises

1. Add a student **detail page** at `/students/:id` that shows all the fields.
2. Add a "Register" page that calls `POST /api/auth/register`.
3. Show a small message ("Student saved") on the list page after a successful save.
4. Add a `Dashboard` page for admins that shows the total number of students and the average marks (you will need a new API route).
