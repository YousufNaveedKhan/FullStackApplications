# Lecture 02 – APIs, REST, Postman & MongoDB Integration

## What We Covered

* What an API is, and the different types of APIs (Public, Private, Partner)
* API architectures/structures, REST and RESTful APIs, Web APIs
* HTTP methods
* Request/Response structure — Headers and Body
* Testing APIs with Postman (and alternatives: cURL, Insomnia)
* Installing MongoDB and connecting to it from Node.js/Express
* Middleware
* Async/await with database operations
* Basic CRUD routes (GET and POST)

## 1. What is an API?

API stands for **Application Programming Interface**. It's a way for two applications to talk to each other — one sends a request, the other sends back a response. Our Express server is itself an API: other applications (a frontend, Postman, another server) can send it requests and get data back.

### Types of APIs

* **Public API** — open for anyone to use, e.g. public weather APIs, payment gateway sandbox APIs.
* **Private API** — used internally within an organization or application, not exposed to outside users.
* **Partner API** — shared only with specific external partners/businesses under an agreement, not fully open to the public.

## 2. API Architectures / Structures

APIs can be designed using different architectural styles (REST, SOAP, GraphQL, etc.). In this course, we focus on **REST**, since it's the most widely used style for building web APIs.

## 3. REST and RESTful APIs

* **REST** (Representational State Transfer) is a set of architectural rules/guidelines for designing APIs.
* An API that follows REST principles is called a **RESTful API**.
* The core idea: resources (like "students") are identified by URLs (e.g. `/students`), and HTTP methods describe what action to perform on that resource.

## 4. What is a Web API?

A Web API is simply an API that is accessed over the web using HTTP. Our Express server, running on `http://localhost:3000`, is a Web API.

## 5. HTTP Methods

* **GET** — retrieve/read data
* **POST** — create new data
* **PUT/PATCH** — update existing data (covered in a later lecture)
* **DELETE** — remove data (covered in a later lecture)

This lecture uses **GET** and **POST**, seen in the `/students` routes below.

## 6. Request & Response Structure

* **Headers** — metadata sent along with a request/response (e.g. `Content-Type: application/json`, which tells the server the body is JSON).
* **Body** — the actual data being sent, e.g. the student details we send when creating a new student with POST.

## 7. Testing APIs

* **Postman** — a GUI tool for sending requests and inspecting responses. This is the main tool we use in this course because it's beginner-friendly and lets us save/organize requests.
* **cURL** — a command-line alternative; useful for quick tests or scripting.
* **Insomnia** — another GUI alternative to Postman.

Postman is preferred here for ease of use, but any of the above can test the same API.

## 8. MongoDB Installation

MongoDB fundamentals (installation, `mongosh`, databases, collections, CRUD, etc.) were already covered separately before this course. For this lecture, MongoDB is expected to be installed and running locally on its default port, `27017`.

## 9. Connecting Node.js/Express to MongoDB

If you've worked with PHP and MySQL before, connecting to MongoDB from Node.js is a similar idea:

* In PHP: `mysqli_connect("host", "user", "pass", "db")` opens a connection to a MySQL database.
* In Node.js: `new MongoClient("mongodb://localhost:27017")` opens a connection — just to MongoDB instead of MySQL, using JavaScript instead of PHP.

Walking through `app.js`:

```js
const { MongoClient, ObjectId } = require("mongodb");
```
Imports the official MongoDB driver for Node.js.

```js
app.use(express.json());
```
This is **middleware** — code that runs on every incoming request before it reaches our routes. `express.json()` tells Express to automatically read and parse JSON data sent in a request body, so we can access it as `req.body`. Without this, `req.body` in our POST route would be empty.

```js
const meraConnection = new MongoClient("mongodb://localhost:27017");
const dbName = "studentsDB";
const meriCollection = "info";
```
`meraConnection`, `dbName`, and `meriCollection` are just variable names we chose ourselves — user-defined names, same idea as discussed in [Lecture 01](../Lecture01-NodeJS-Express/README.md). They could be named anything; what matters is what they store (a connection, a database name, a collection name).

```js
async function connectDB() {
    await meraConnection.connect();
    console.log("MongoDB Connected Successfully!");
}
```
Connecting to a database takes time, so this function is declared `async` and uses `await` to pause until the connection finishes. Recall from Lecture 01: JavaScript is synchronous by default, and we only reach for `async`/`await` when an operation (like this one) needs time to complete.

## 10. Routes in `app.js`

```js
app.get("/students", async (req, res) => {
    const db = meraConnection.db(dbName);
    const students = await db.collection(meriCollection).find().toArray();
    res.json(students);
})
```
Fetches every document from the `info` collection and sends it back as JSON.

```js
app.post("/students", async (req, res) => {
    const db = meraConnection.db(dbName);
    const student = req.body;
    const result = await db.collection(meriCollection).insertOne(student);
    res.json(student);
})
```
Reads the new student's data from the request body (`req.body`, made available thanks to the `express.json()` middleware) and inserts it into the `info` collection.

Both route handlers are `async` because `find()` and `insertOne()` are asynchronous database operations — we must `await` them to get their result.

## 11. Common Questions / Confusions

**Is MongoDB the only way to build a backend/API?**
No. MongoDB is the database we're using in this course, but Node.js/Express can be connected to many different databases (MySQL, PostgreSQL, etc.). The concepts of routes, requests, and responses stay the same no matter which database is used underneath.

**Why use Postman instead of just opening the URL in a browser?**
A browser address bar can only easily send **GET** requests. Postman lets us send any HTTP method (POST, PUT, DELETE), attach headers, and send a request body — things we can't easily do by just typing a URL into a browser.

**Is every Web API a REST API?**
No. **REST** is one specific style/architecture for building Web APIs. Other styles exist too (like GraphQL or SOAP), though REST is the most common and the one used in this course.

**What's the difference between "Public/Private/Partner" and "REST"?**
These describe two different things:

* Public/Private/Partner describes **who is allowed to access** the API.
* REST describes **how the API is structured/designed**.

An API can be, for example, both "Private" and "RESTful" at the same time — the two ideas are independent of each other.

**Do we need `express.json()` for GET requests too?**
Not strictly — it's only needed when we want to read data sent in a request **body**, like in our `POST /students` route. It doesn't cause any harm on GET requests, which is why we apply it globally with `app.use(...)` rather than per-route.

**Why is `connectDB()` called once, outside the routes, instead of connecting inside every route?**
We only need one connection to MongoDB for the app's entire lifetime — opening a brand-new connection on every single request would be slow and wasteful. So we connect once when the server starts, and every route reuses that same connection.

**How does this relate to Node.js vs React (from Lecture 01)?**
Everything in this lecture — Express routes, MongoDB, Postman testing — is still on the **backend** side. Later, a React frontend will be the one actually calling these same routes (`/students`) to display or submit data, instead of us testing them manually with Postman. See [Lecture 01's notes on Node.js vs React](../Lecture01-NodeJS-Express/README.md#10-common-questions--confusions) for that comparison.

## 12. Running This Lecture

Make sure MongoDB is running locally, then:

```bash
cd Lecture02-MongoDB-REST-Postman
npm install
node app.js
```

Test with Postman:

* `GET http://localhost:3000/students`
* `POST http://localhost:3000/students` with a JSON body, e.g.:

  ```json
  { "name": "Ali", "age": 20 }
  ```
