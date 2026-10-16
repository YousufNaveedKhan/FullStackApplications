# Lecture 05 – Authentication & Authorization with JWT

## What We Covered

* Authentication vs authorization
* Why passwords are never stored as plain text, and what hashing is
* Hashing passwords with `bcryptjs`
* What a JWT (JSON Web Token) is and how login works with it
* Register and login routes
* The `protect` middleware (are you logged in?)
* The `authorize` middleware (are you allowed to do this?)
* Roles: `student` and `admin`
* Creating the first admin with a seed script

> This lecture builds on Lecture 04. The folder structure is the same, with a new `User` model, auth routes, auth middleware and a seed script.

## 1. Authentication vs Authorization

* **Authentication** answers: *who are you?* (login)
* **Authorization** answers: *what are you allowed to do?* (permissions)

In our API: anyone who is logged in can **read** students, but only an **admin** can **create, update or delete** them.

## 2. Never Store Plain Passwords

If a database is ever leaked, plain passwords would let attackers log in everywhere. Instead we store a **hash**: a one-way scrambled version. We can check a password against the hash, but we cannot turn the hash back into the password.

```js
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);   // 10 = how much work the hashing does
});
```

* `pre("save")` is a Mongoose hook that runs just before a document is saved.
* At login we compare with `bcrypt.compare(typedPassword, storedHash)`.
* `select: false` on the password field hides it from normal queries. At login we ask for it explicitly with `.select("+password")`.

## 3. What is a JWT?

After a successful login the server sends the browser a **token**, a signed piece of text:

```
header.payload.signature
```

* The **payload** holds a little information, like the user id.
* The **signature** is made with `JWT_SECRET`. If someone changes the token, the signature no longer matches and the server rejects it.
* The token is **signed**, not hidden. Anyone can read the payload, so never put passwords or private data in it.

The flow:

1. `POST /api/auth/login` with email and password
2. The server checks the password and returns a token
3. The client sends the token with every later request:
   `Authorization: Bearer <token>`
4. The `protect` middleware verifies it and finds the user

## 4. The Two Middleware Functions

```js
router.use(protect);                              // all routes below need a login
router.get("/", getStudents);                     // any logged-in user
router.post("/", authorize("admin"), createStudent);   // admins only
```

* `protect` returns **401 Unauthorized** when there is no token or it is invalid.
* `authorize("admin")` returns **403 Forbidden** when you are logged in but your role is not allowed.

## 5. Two Security Details Worth Remembering

* **The role is never taken from the request.** In `register` we pick only `name`, `email` and `password`. Otherwise anybody could send `"role": "admin"`.
* **One message for both login failures:** "Invalid email or password". If we said "email not found", an attacker could find out which emails are registered.

## 6. Creating the First Admin

Nobody can register as an admin, so we create the first one with a script:

```bash
npm run seed
```

It reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env` (so no password is written in the code) and is safe to run twice.

## 7. Run It

```bash
npm install
cp .env.example .env       # on Windows: copy .env.example .env
# edit .env: set JWT_SECRET to a long random text, and your admin email/password
npm run seed
npm run dev
```

## 8. Test in Postman

| Request | Expected result |
|---|---|
| `POST /api/auth/register` `{ name, email, password }` | `201`, a token and the user (role is `student`) |
| `POST /api/auth/login` with a wrong password | `401` "Invalid email or password" |
| `POST /api/auth/login` with the admin account | `200` and a token |
| `GET /api/students` with no token | `401` |
| `GET /api/students` with a student token | `200` |
| `POST /api/students` with a student token | `403` |
| `POST /api/students` with the admin token | `201` |
| `GET /api/auth/me` with any token | `200` the logged-in user |

In Postman: **Authorization** tab, type **Bearer Token**, paste the token.

## Exercises

1. Add `PUT /api/auth/password` so a logged-in user can change their own password.
2. Add a third role, `teacher`, who can create and update students but not delete them.
3. Why do we use `expiresIn` on the token? What happens if it is stolen and never expires?
4. Print a token on https://jwt.io and read its payload. What do you see?
