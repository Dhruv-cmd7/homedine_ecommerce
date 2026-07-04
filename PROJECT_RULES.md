# Homedine Project Coding Rules & Standards

Welcome to the **Homedine** project. To maintain a production-grade, highly secure, and clean codebase, all development must strictly follow the rules and guidelines outlined in this document.

---

## 1. Core Technology Stack
All code must be written strictly using the following technologies:
* **Frontend:** React.js, JavaScript (ES6+), HTML5, Vanilla CSS (CSS Modules). Compiled using Vite.
* **Backend:** Node.js, Express.js (ES Modules syntax: `import/export`).
* **Database:** MongoDB Atlas, Mongoose ODM.
* **Authentication:** Stateless JWTs, Refresh Tokens, bcrypt, and HTTP-only cookies.

### 🚫 STRICTLY FORBIDDEN
Do NOT install or use:
* **TypeScript** (use clean, documented modern JavaScript instead).
* **Next.js** or any full-stack meta-framework.
* **Firebase** or **Supabase** for database, storage, or auth.
* **PHP** or any other server-side languages.
* **SQL databases** (PostgreSQL, MySQL, SQLite, etc.).
* **Tailwind CSS** or CSS frameworks (unless explicitly approved by the user). Use Vanilla CSS Modules.

---

## 2. Architectural Boundaries (Clean Architecture)
To ensure the backend remains decoupled from framework choices and database details, we enforce a strict layered architecture:

```
[ HTTP Route ] --> [ Controller ] --> [ Usecase ] --> [ Repository ] --> [ Mongoose Model ]
                                         |
                                         +--> [ External Services ] (Stripe, SendGrid)
```

### 2.1 Layer Responsibilities:
1. **Controller Layer (`controller.js`):** Parses HTTP requests, extracts parameters, validates payloads using schemas (Zod), calls the appropriate usecase, and formats HTTP responses.
   * *Rule:* Controllers must never query Mongoose models or databases directly.
2. **Usecase Layer (`usecase.js`):** Contains the core business logic (e.g., calculating checkout totals, checking discount codes). It must remain framework-agnostic.
   * *Rule:* Usecases must not read Express request headers or construct Mongoose queries. They depend on the Repository layer for data operations.
3. **Repository Layer (`repository.js`):** Handles database queries using Mongoose models.
   * *Rule:* If we swap MongoDB for PostgreSQL, only the Repository files should change; the Usecases must remain untouched.
4. **Model Layer (`models/`):** Contains Mongoose Schema definitions, validation rules, and indexes.

---

## 3. SOLID Coding Rules

### 3.1 Single Responsibility Principle (SRP)
* A class, function, or component must have only one reason to change.
* Extract React state logic from components into custom hooks.
* Separate HTTP validation logic from controller database actions.

### 3.2 Open-Closed Principle (OCP)
* Code modules should be open for extension but closed for modification.
* Use strategy or factory design patterns to extend features (such as adding a new payment provider or shipping service) without altering core checkout logic.

### 3.3 Liskov Substitution Principle (LSP)
* Subclasses or service adapters must be substitutable for their base abstractions.
* Mock testing adapters must behave exactly like production cloud services.

### 3.4 Interface Segregation Principle (ISP)
* Keep interfaces and models focused.
* Do not force components to depend on context values or state properties they do not use.

### 3.5 Dependency Inversion Principle (DIP)
* High-level business logic (Usecases) must not depend on low-level implementation details (Database connections, Stripe API).
* Inject repositories and services into usecases at runtime rather than instantiating them internally.

---

## 4. Frontend Component Guidelines

* **Line Limits:** Component files must not exceed **200 lines of code**.
  * *Standard Practice:* If a component exceeds 200 lines, refactor by moving state logic into custom hooks and splitting large layouts into smaller, reusable UI components.
* **Styling Isolation:** All component styling must use CSS Modules (`ComponentName.module.css`).
  * *Standard Practice:* Never write global classes in page files. Reference styling objects locally: `className={styles.buttonContainer}`.
* **Reusability:** Base components (Buttons, Inputs, Modals, Cards) must be abstract, style-agnostic wrappers stored in `/src/components/`.

---

## 5. Security & Session Rules
* **Password Hashing:** Hash passwords using `bcryptjs` with `12` salt rounds.
* **Token Storage:**
  * **Access Tokens:** Store in short-lived local memory states (never in LocalStorage or SessionStorage).
  * **Refresh Tokens:** Store in cryptographically signed cookies configured with: `HttpOnly: true`, `Secure: true`, `SameSite: Strict`, `Path=/api/v1/auth`.
* **Input Validation:** Validate all request payloads against strict Zod validation schemas.
* **Injection Blockers:** Route query variables through sanitization middleware to strip MongoDB query operators (like `$gt` or `$ne`).

---

## 6. Testing & Quality Control
* **Unit Tests:** Run Jest checks to validate discount calculations, payload formats, and utility helpers.
* **Integration Tests:** Test Express routers and repository layers using a memory-based database instance.
* **Commit Requirements:** Do not push code containing diagnostic logs, console messages, or unfinished TODO notes.
