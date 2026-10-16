# FullStackApplications

A practical learning repository for building full-stack web applications with modern JavaScript: **Node.js, Express, MongoDB, Mongoose, JWT authentication, React and deployment.**

Created by **Yousuf Naveed Khan**, Senior Instructor at Aptech Gulshan-2, Karachi.

## About

This course takes a student from backend fundamentals to a complete, deployed full-stack application, one lecture at a time. Students are expected to know MongoDB fundamentals before starting; that material is not repeated here (see [ManagingLargeDatasetsWithMongoDB](https://github.com/YousufNaveedKhan/ManagingLargeDatasetsWithMongoDB)).

Lectures 01 to 03 are the code from the class sessions, with notes for Lectures 01 and 02. Lectures 04 to 09 are prepared study material that completes the course outline, so any student can finish the course on their own.

## Lectures

| # | Lecture | You learn |
|---|---|---|
| 01 | [Node.js and Express](./Lecture01-NodeJS-Express) | what Node and Express are, routes, `req` and `res` |
| 02 | [MongoDB, REST and Postman](./Lecture02-MongoDB-REST-Postman) | APIs, REST, HTTP methods, Postman, connecting to MongoDB, CRUD |
| 03 | [Mongoose](./Lecture03-Mongoose-with-NodeJS) | schemas, models and CRUD with Mongoose |
| 04 | [Project structure and validation](./Lecture04-Project-Structure-and-Validation) | folders, `dotenv`, schema validation, status codes, error handling |
| 05 | [Authentication with JWT](./Lecture05-Authentication-with-JWT) | password hashing, JWT, login, protected routes, roles |
| 06 | [Search, filter, pagination and CORS](./Lecture06-Search-Filter-Pagination-and-CORS) | query strings, searching, sorting, pagination, CORS |
| 07 | [React basics and fetching data](./Lecture07-React-Basics-and-Fetching-Data) | components, state, effects, `fetch`, login in the browser |
| 08 | [React Router, CRUD and auth](./Lecture08-React-Router-CRUD-and-Auth) | pages and URLs, context, protected routes, full CRUD screens |
| 09 | [Deployment and final project](./Lecture09-Deployment-and-Final-Project) | MongoDB Atlas, deploying the API and the React app, the final project |

## Technologies

* Node.js, Express 5
* MongoDB and Mongoose
* REST APIs, Postman
* `dotenv`, `bcryptjs`, `jsonwebtoken`, `cors`
* React 19, Vite, React Router
* MongoDB Atlas, Vercel and a Node hosting platform

## Running a Lecture

Every `LectureXX/` folder is independent. Inside a folder, first install the packages:

```bash
npm install
```

**Lectures 01 to 03** have no settings file. Start them with `node server.js` (Lectures 01 and 03) or `node app.js` (Lecture 02). MongoDB must be running on your computer for Lectures 02 and 03.

**Lectures 04 to 08** use a `.env` file:

```bash
cp .env.example .env     # on Windows: copy .env.example .env
npm run dev
```

Lectures 07 and 08 are React apps and need the API from Lecture 06 running. Lecture 09 contains the finished `server/` and `client/` side by side: run the same commands inside each of them. Before `npm run seed`, put your own admin password in `.env`.

## Learning Approach

Concepts are learned by building: APIs, databases, secure logins and a real frontend, tested at every step. Each lecture starts from a working version of the previous one, so the code grows in small, understandable steps. Earlier lectures stay simple on purpose and may look basic compared to later ones.

## Final Project

Students finish by building and deploying an application of their own. The requirements are in [Lecture 09](./Lecture09-Deployment-and-Final-Project#8-final-project).
