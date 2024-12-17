### LectureFlix Prototype

---

#### Overview

LectureFlix is a prototype for an academic content platform designed to combine the functionalities of Netflix and YouTube. The platform restricts content uploads to lecturers, allowing them to manage public and restricted access to videos. Schools can license content for students, while general users can subscribe for public content access.

---

#### Features

- **MERN Stack Architecture:**
  - **MongoDB** for storing all collections in a single database, including users, courses, videos, and analytics.

- **Proxy Configuration:**
  - A single server port (80) is used for handling multiple backend services using an `.htaccess` rewrite rule for path-based proxying.

- **Directory Organization:**
  - Backend for server-side code, frontend for user interaction, and admin frontend for internal interfaces.

- **Pre-Built Builds:**
  - Builds for both `frontend` and `admin_frontend` are **included in version control**.
  - Build scripts automatically copy builds into the `backend/cdn` directory.

---

#### Prototype Components

1. **Database:**
   - A single MongoDB instance containing collections for courses, videos, users, and analytics.

2. **Backend:**
   - Built with Node.js and Express.
   - Includes deployment scripts, SSL setup, file storage, and optimized CDN for public assets.
   - Serves pre-built **frontend** and **admin frontend** builds directly from the `cdn` directory.

3. **Frontend:**
   - React-based UI for students and general users.
   - Pre-built production build is stored in `backend/cdn/frontend`.

4. **Admin Frontend:**
   - React-based interface for lecturers and administrators to manage content and view analytics.
   - Pre-built production build is stored in `backend/cdn/admin`.

---

#### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd LectureFlix
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Initialize deployment scripts with correct paths and permissions:
     ```bash
     npm run init
     ```
   - Start the servers:
     ```bash
     npm start
     ```

3. **Access the Application:**
   - API: `http://localhost:3003/main/v1/`
   - Admin UI: `http://localhost:2024/cdn/admin`
   - Frontend UI: `http://localhost:2024/cdn/frontend`

---

#### Development and Contribution

If you wish to modify the **frontend** or **admin frontend**, you can follow these steps:

1. **Frontend Development:**
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```
   - Build the updated code:
     ```bash
     npm run build
     ```

2. **Admin Frontend Development:**
   - Navigate to the `admin_frontend` directory:
     ```bash
     cd admin_frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```
   - Build the updated code:
     ```bash
     npm run build
     ```

---

#### Directory Structure

```
LectureFlix/
├── backend/
│   ├── dist/                 # Compiled backend code
│   ├── src/                  # Source code for backend
│   ├── cdn/                  # Static files for optimized public file serving
│   │   ├── frontend/         # Pre-built frontend UI
│   │   └── admin/            # Pre-built admin UI
│   ├── ca/                   # SSL certificates for secure connections
│   ├── deployment/           # Deployment helper scripts
│   ├── filestore/            # Private uploaded files
│   ├── .htaccess             # Proxying rules for native servers
│   ├── .htaccess-rewrite-rule# Template for alternate server rewrites
│   └── package.json          # Node.js package file for backend
│
├── frontend/                 # React-based user interface (source code)
│   └── package.json          # Node.js package file for frontend
│
├── admin_frontend/           # React-based admin interface (source code)
│   └── package.json          # Node.js package file for admin frontend
```

---

#### Proxying with `.htaccess`

The `.htaccess` file enables path-based proxying to various backend servers, allowing the entire application to run through a single port (e.g., port 80).

**Example Rules:**
```apache
RewriteRule ^scheduling(.*)$ http://127.0.0.1:6098/scheduling/$1 [P]
RewriteRule ^main(.*)$ http://127.0.0.1:3003/main/$1 [P]
RewriteRule ^hook(.*)$ http://127.0.0.1:3002/hook/$1 [P]
RewriteRule ^cdn(.*)$ http://127.0.0.1:2024/cdn/$1 [P]
```

**Template File (`.htaccess-rewrite-rule`):**
```apache
RewriteRule ^[SCHEME](.*)$ [PROTOCOL]://[IP]:[PORT]/[SCHEME]/$1 [P]
```

---

#### Usage

1. Start the backend server.
2. Access the application through the provided URLs:
   - `localhost:3003/main/v1/` for APIs.
   - `localhost:2024/cdn/frontend` for the main frontend UI.
   - `localhost:2024/cdn/admin` for the admin interface.

3. Use the `.htaccess` file for path-based proxying when hosting with Apache, Nginx, or similar servers.

---

#### Contribution

Feel free to fork this repository and contribute by submitting pull requests for new features, optimizations, or bug fixes.

---

#### License

This project is for academic purposes only and is not intended for commercial use.
