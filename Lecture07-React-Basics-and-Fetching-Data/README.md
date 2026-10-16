# Lecture 07 – React Basics & Fetching Data from Our API

## What We Covered

* Frontend and backend as two separate apps that talk over HTTP
* Creating a React app with Vite
* Components and JSX, and props
* State with `useState`
* Side effects with `useEffect`, and its dependency array
* Fetching data from our API with `fetch`
* Loading and error states
* Controlled inputs and forms
* Saving the login token in `localStorage`
* Conditional rendering (a login screen or the student list)
* Search and pagination in the browser

> Before you start: run the API from **Lecture 06** (`npm run dev` there). This React app talks to it. In Lectures 07 and 08 the frontend and backend are two different folders and two different terminals.

## 1. Two Apps, One System

```
Browser (React, port 5173)  ──fetch──▶  API (Express, port 3000)  ──▶  MongoDB
```

* React shows the screens and holds what the user sees.
* Express checks the rules and reads/writes the database.
* They only talk through HTTP requests and JSON. That is why Lecture 06 had to enable **CORS**.

## 2. Create the Project

We use **Vite**, a fast tool for starting and building React apps:

```bash
npm create vite@latest client -- --template react
```

In this lecture the project is already created. To run it:

```bash
npm install
cp .env.example .env       # on Windows: copy .env.example .env
npm run dev                # opens at http://localhost:5173
```

`VITE_API_URL` in `.env` is the address of the API. Only variables that start with `VITE_` are available in the browser code (`import.meta.env.VITE_API_URL`). **Never put secrets in a frontend `.env`**, because anything in the browser can be seen by the user.

## 3. Folder Structure

```
src/
├── main.jsx                 starts React
├── App.jsx                  login or student list, plus the top bar
├── api.js                   one function for every request
├── styles.css
└── components/
    ├── LoginForm.jsx
    └── StudentList.jsx
```

## 4. Components, JSX and Props

A component is a function that returns JSX (HTML written inside JavaScript):

```jsx
<StudentList token={token} onLogout={handleLogout} />
```

`token` and `onLogout` are **props**, values the parent hands to the child. Data flows **down** through props. When a child needs to tell the parent something (for example "the user logged in"), the parent passes a **function** as a prop and the child calls it.

## 5. State with `useState`

```jsx
const [page, setPage] = useState(1);
```

* `page` is the current value, `setPage` changes it.
* When state changes, React runs the component again and updates the screen.
* **Never** change state directly (`page = 2`). Always use the setter.

## 6. `useEffect` and Fetching

```jsx
useEffect(() => {
    load();            // fetch the students
}, [search, page]);    // run again whenever search or page changes
```

* The effect runs after the first render, and again when something in the **dependency array** changes.
* An empty array `[]` means "run once".
* The function we return is a **cleanup**. We use `ignore = true` there, so a slow, old response can never overwrite a newer one.

## 7. `api.js`: One Place for Requests

Every request needs the same things: the base URL, the JSON headers and the token. We write them once in `apiFetch`. It also turns a server error (like `401` or `400`) into a JavaScript `Error`, so our components can use `try/catch`.

```js
const data = await apiFetch("/api/students?page=1", { token });
```

## 8. Controlled Inputs and Forms

```jsx
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

The input always shows what is in state (`value`), and every key press updates state (`onChange`). On submit we call `event.preventDefault()`, otherwise the browser reloads the page.

## 9. Login and `localStorage`

After a successful login we save the token:

```js
localStorage.setItem("token", data.token);
```

On the next page load `useState(() => localStorage.getItem("token"))` reads it back, so a refresh does not log the user out. If the API ever answers `401`, we log the user out.

> A note on security: `localStorage` is simple and fine for learning, but any script running on the page can read it. For high-security apps, teams use `httpOnly` cookies instead. We will keep `localStorage` in this course.

## 10. Test It

1. Start the API (Lecture 06) and make sure the admin exists (`npm run seed`).
2. Start this app. Log in with the admin email and password. A wrong password shows the server message.
3. Add some students with Postman, then try **Search**, **Next** and **Previous**.
4. Refresh the page. You should still be logged in. Click **Log out**.

## Exercises

1. Add a **Course** dropdown that filters the list (the API already supports `?course=`).
2. Show the table in sorted order and add a "Marks" button that sorts by `-marks`.
3. Disable the Search button while loading.
4. What would happen if we removed the cleanup function (`ignore = true`) and typed in the search box quickly?
