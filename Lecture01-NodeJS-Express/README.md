# Lecture 01 – Introduction to Node.js & Express

## What We Covered

* What Node.js is and why we use it
* What Express.js is and why we use it on top of Node.js
* Installing Node.js and setting up a project
* Installing and using Express
* `require()` and why we use it
* Building a basic server with routes
* `req` and `res` objects
* `app.listen()` and ports
* User-defined vs predefined names
* Synchronous vs Asynchronous code

## 1. What is Node.js?

Node.js is a runtime that lets us run JavaScript outside the browser — for example, on a server. This is what allows us to use JavaScript to build backend applications instead of only using it for frontend/browser scripts.

## 2. What is Express.js?

Express is a lightweight framework built on top of Node.js. Node.js by itself can create servers, but it requires a lot of manual work (handling routes, requests, responses, etc.). Express simplifies all of this and gives us a much cleaner way to build servers and APIs.

## 3. Installing Node.js

* Download and install Node.js (LTS version) from the official Node.js website.
* Verify the installation:

  ```bash
  node -v
  npm -v
  ```

## 4. Setting Up the Project

```bash
npm init -y
npm install express
```

* `npm init -y` creates a `package.json` file, which keeps track of the project and the packages it depends on.
* `npm install express` downloads Express into a `node_modules/` folder and adds it as a dependency inside `package.json`.

## 5. Why Do We Use `require`?

`require()` is Node.js's way of importing something we need into our file — a built-in module, an installed npm package, or even our own file. In `server.js`, we use it to bring in the Express package:

```js
const express = require("express");
```

## 6. Walking Through `server.js`

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Student API is working");
})

app.get("/home", (req, res) => {
    res.send("Home Route is working");
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
```

* `const app = express();` — creates our Express application instance. Everything (routes, middleware, etc.) is built on top of this `app` object.
* `app.get("/", (req, res) => { ... })` — defines a **route**. This one says: "when someone makes a GET request to `/`, run this function."
* `req` (request) — an object containing details about the incoming request (URL, headers, data sent by the client, etc.).
* `res` (response) — an object we use to send something back to the client. `res.send(...)` sends a simple text response.
* `app.listen(3000, () => { ... })` — starts the server and makes it listen for incoming requests on port `3000`. Port 3000 is just a common convention for local development — any free port would work.

## 7. Routing

A **route** is a combination of an HTTP method (like GET) and a URL path (like `/` or `/home`), tied to a function that runs when that combination is requested. `server.js` currently has two routes: `/` and `/home`.

## 8. User-Defined vs Predefined Names

* **Predefined (built-in) names** already have a fixed meaning given to them by JavaScript or a library — we can't change what they do. Examples: `require`, `console`, and methods provided by Express like `.get()` and `.listen()`.
* **User-defined names** are names *we* choose ourselves — variable names, function names, and even file names. `app` could just as easily be called `server` or `myApp`; the file `server.js` could just as easily be named `index.js`, `main.js`, or anything else. The name itself does not matter to Node.js — what matters is the code inside it.

## 9. Synchronous vs Asynchronous

* JavaScript code runs **synchronously** by default — line by line, in order, one statement finishing before the next one starts. We don't need to write anything special for this; it's the normal behavior.
* **Asynchronous** code is used when an operation takes time (like reading a file, calling a database, or making a network request) and we don't want it to block the rest of the program while it waits. This is done using `async`/`await` (or promises/callbacks).
* We will see `async`/`await` in action starting in [Lecture 02](../Lecture02-MongoDB-REST-Postman/README.md), once we start talking to MongoDB — database calls take time, so those functions need to be `async`.

## 10. Common Questions / Confusions

**Is Node.js a programming language?**
No. Node.js is a **backend runtime environment** — it lets us run JavaScript outside the browser (for example, on a server). JavaScript is the language; Node.js is what executes it on the backend.

**How is Node.js different from React?**
This is a common point of confusion because both use JavaScript, but they solve different problems:

* **Node.js** is a **backend runtime environment** — it runs on the server, handles requests, talks to databases, etc.
* **React** is a **client-side (frontend) library** — it runs in the browser and is used to build the user interface that the user actually sees and interacts with.

Later in this course, we will build a backend with Node.js/Express and a separate frontend with React, then connect the two — the React frontend will send requests to the Node.js/Express backend to get or send data.

**Is Express a different language from JavaScript?**
No. Express is a **framework/library** built on top of Node.js — it's still plain JavaScript, just with extra tools that make building servers easier.

**Do we have to call the file `server.js`?**
No — see [User-Defined vs Predefined Names](#8-user-defined-vs-predefined-names) above. The filename is completely up to us.

**Why port 3000 specifically?**
No special reason — `3000` is just a common convention for local development. Any free port (e.g. `4000`, `5000`, `8080`) would work the same way.

**Do we need to write `async` on every function?**
No. Only when the function performs an operation that takes time (like a database call) and we need to `await` its result. Plain synchronous code — like the routes in this lecture — doesn't need it.

## 11. Running This Lecture

```bash
cd Lecture01-NodeJS-Express
npm install
node server.js
```

Then visit in a browser:

* http://localhost:3000/
* http://localhost:3000/home
