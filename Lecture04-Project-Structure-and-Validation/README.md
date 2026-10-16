# Lecture 04 – Project Structure, Environment Variables & Validation

## What We Covered

* Why a real project needs a folder structure (and not one big `server.js`)
* Splitting the code into `config`, `models`, `controllers`, `routes` and `middleware`
* `express.Router()`
* Environment variables with `dotenv`, and why `.env` must never be uploaded
* Validation rules inside a Mongoose schema
* Correct HTTP status codes (200, 201, 400, 404, 409, 500)
* A 404 handler and a central error handler
* Async errors in Express 5

> Note: Lectures 04 to 09 are prepared study material that completes the course outline. They continue the same Student API from Lecture 03.

## 1. Why Do We Need a Structure?

In Lecture 03 everything lived in `server.js`: the connection, the schema and every route. That is fine for learning, but in a real project it becomes hard to read and hard to change. We split the code by **responsibility**:

```
Lecture04-Project-Structure-and-Validation/
├── server.js                  starts the app
├── config/db.js               database connection
├── models/Student.js          schema and model
├── controllers/               what each route actually does
│   └── studentController.js
├── routes/                    which URL goes to which controller
│   └── studentRoutes.js
├── middleware/errorHandler.js 404 and error handling
├── .env.example               example of the settings we need
└── package.json
```

A simple way to remember it: **routes** decide *where*, **controllers** decide *what*, **models** decide *the shape of the data*.

> Two changes from Lecture 03: the routes now live under `/api`, so `/students` becomes `/api/students`, and the data goes to a new database called `fullstackApp`. The students you saved in Lecture 03 will not appear here.

## 2. Environment Variables (`dotenv`)

Settings such as the database address or the port can change between your laptop and a real server. We keep them outside the code, in a file called `.env`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/fullstackApp
```

```js
require("dotenv").config();   // loads .env into process.env

const PORT = process.env.PORT || 3000;
```

* Copy `.env.example` to `.env` and fill in your own values.
* `.env` is in `.gitignore`, so it is never uploaded to GitHub. Passwords and secret keys must never be committed.
* `.env.example` is uploaded, because it only shows the *names* of the settings, not the real values.

## 3. Validation in the Schema

In Lecture 03 anyone could save a student without a name or with marks of 5000. Now the schema protects the data:

```js
marks: {
    type: Number,
    min: [0, "Marks cannot be less than 0"],
    max: [100, "Marks cannot be more than 100"],
    default: 0,
},
```

Useful options: `required`, `unique`, `trim`, `lowercase`, `minlength`, `min`, `max`, `match` (a regular expression), `default`.
`{ timestamps: true }` adds `createdAt` and `updatedAt` for free.

On updates we pass `runValidators: true`, otherwise Mongoose skips the rules:

```js
await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
```

## 4. HTTP Status Codes

| Code | Meaning | We use it when |
|---|---|---|
| 200 | OK | reading, updating or deleting worked |
| 201 | Created | a new student was saved |
| 400 | Bad Request | the data or the id is invalid |
| 404 | Not Found | no student with that id, or no such route |
| 409 | Conflict | the email already exists |
| 500 | Server Error | something broke on our side |

## 5. Error Handling Middleware

A middleware with **four** parameters `(err, req, res, next)` is an error handler. We place it after all routes. It turns messy errors into clean answers:

* `ValidationError` becomes a 400 with a list of messages
* error code `11000` (duplicate key) becomes a 409
* a request body that is not valid JSON becomes a 400
* everything else becomes a 500, and we only log the details on the server

In **Express 5**, if an `async` route throws an error, it reaches this handler automatically. In Express 4 we needed `try/catch` or a wrapper in every route.

## 6. Run It

```bash
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm run dev               # restarts automatically when you save a file
```

## 7. Test in Postman

| Request | Expected result |
|---|---|
| `GET /` | `200` "Student API is working" |
| `POST /api/students` with name, email, course, marks | `201` the saved student |
| `POST /api/students` with no name | `400` "Validation failed" and a list of errors |
| `POST /api/students` with the same email twice | `409` "email already exists" |
| `POST /api/students` with `"marks": 150` | `400` |
| `POST /api/students` with broken JSON (for example a missing quote) | `400` "The request body is not valid JSON" |
| `GET /api/students/abc` | `400` "Invalid student id" |
| `GET /api/students/` + a valid but unknown id | `404` |
| `GET /nothing-here` | `404` "Route not found" |

## Exercises

1. Add a `city` field that is optional but must be at least 3 characters if given.
2. Make `course` accept only three values using `enum`.
3. Add a custom message for a missing `email`.
4. Why is it a mistake to send `err.stack` back to the client?
