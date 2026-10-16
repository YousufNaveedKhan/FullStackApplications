# Lecture 06 – Search, Filter, Sort, Pagination & CORS

## What We Covered

* Query strings (`?search=ali&page=2`) and `req.query`
* Searching with a regular expression (and why we escape user text)
* Filtering by course and by minimum marks
* Sorting, with a whitelist of allowed fields
* Pagination with `skip` and `limit`
* A response that carries `total` and `totalPages`
* What CORS is and why a browser blocks our API
* Using the `cors` package, and a health-check route

> This lecture builds on Lecture 05. The only new files are changes to `getStudents`, `server.js` and `.env.example`, so a React frontend can use the API in the next lectures.

## 1. Why Not Send Everything?

With 10,000 students, `GET /api/students` returning everything would be slow and heavy. Real APIs send **one page at a time**, and let the client **search, filter and sort**.

```
GET /api/students?search=ali&course=React&minMarks=50&sort=-marks&page=2&limit=5
```

Everything after `?` is the **query string**. In Express it is available as `req.query`.

## 2. The Response Shape

The list is now wrapped in an object so the frontend knows how many pages exist:

```json
{
  "data": [ { "name": "Ali Raza", "course": "Node.js", "marks": 70 } ],
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```

## 3. Search and Filter

```js
const pattern = new RegExp(escapeRegex(search), "i");     // "i" = ignore case
filter.$or = [{ name: pattern }, { email: pattern }];     // match the name OR the email
filter.marks = { $gte: Number(minMarks) };                // marks greater than or equal
```

**Important:** a user could type `(` or `.*` in the search box. In a regular expression these have a special meaning and can break the query. `escapeRegex` turns them into plain characters. Never put raw user input into a `RegExp`.

## 4. Sorting

`sort=-marks` means highest marks first (the minus sign reverses the order). We only accept fields from a **whitelist** (`name`, `marks`, `createdAt`). Otherwise a client could sort by any field, including ones we do not want to expose.

## 5. Pagination

```js
const skip = (page - 1) * limit;
Student.find(filter).sort(sortBy).skip(skip).limit(limit);
```

* Page 1 skips 0 documents, page 2 skips `limit` documents, and so on.
* `Student.countDocuments(filter)` gives the total, so we can calculate `totalPages = Math.ceil(total / limit)`.
* We **clamp** the numbers: the page is at least 1 and the limit is between 1 and 100. A client can never ask for a million rows.

## 6. What is CORS?

Your React app will run on `http://localhost:5173` and your API on `http://localhost:3000`. These are two different **origins** (a different port counts). By default the **browser** refuses to let a page on one origin read answers from another. This rule is called the **Same-Origin Policy**.

**CORS** (Cross-Origin Resource Sharing) is how a server says: *"this website is allowed to talk to me."*

```js
app.use(cors({ origin: ["http://localhost:5173"] }));
```

* Postman does not care about CORS. Only **browsers** enforce it. That is why an API can work in Postman and still fail from React.
* Before some requests the browser sends a "preflight" `OPTIONS` request to ask permission. The `cors` package answers it for us.
* We keep the allowed addresses in `CLIENT_URL` (in `.env`), so production can use a different address.
* Never use `origin: "*"` on an API that uses logins.

## 7. Health Check

```js
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
```

Hosting platforms call a route like this to check that your server is alive. We will use it in the deployment lecture.

## 8. Run It

```bash
npm install
cp .env.example .env       # on Windows: copy .env.example .env
npm run seed               # creates the admin
npm run dev
```

## 9. Test in Postman

Log in as the admin first, then use the token for these:

| Request | Expected result |
|---|---|
| `GET /api/students` | the first 10 students, plus `total` and `totalPages` |
| `GET /api/students?page=2&limit=5` | students 6 to 10 |
| `GET /api/students?search=ali` | students whose name or email contains "ali" |
| `GET /api/students?course=react` | only React students (any letter case) |
| `GET /api/students?minMarks=80` | marks of 80 or more |
| `GET /api/students?sort=-marks&limit=3` | the top 3 by marks |
| `GET /api/students?search=(` | `200` and an empty list, no crash |

## Exercises

1. Add a `maxMarks` filter and combine it with `minMarks`.
2. Add `sort=name` and check that it works in both directions.
3. Add a `city` filter to the schema and the controller.
4. Open your API from a plain HTML file on your computer using `fetch`. Does the browser block it? What does the console say?
