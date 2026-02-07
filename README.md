# Firebase Content Management System (CMS)

A modern, production-ready Admin Dashboard for managing Firebase Firestore data. Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/UI.

## 🚀 Features

- **Authentication System:** Secure login/logout using Firebase Users collection.
- **Dynamic Collections:** Create and manage new Firestore collections directly from the UI without code changes.
- **Role-Based Access Control (RBAC):** Define roles and granular permissions for each collection.
- **Schema Validation:** Robust data validation using Zod schemas for all forms.
- **Modern UI:** Responsive design with Dark Mode support via Shadcn/UI.
- **System Collections:** Dedicated management interfaces for:
    - `Channels` (TV Channels with streams)
    - `Dracin` (Asian Drama content)
    - `Users` (User management)
- **Settings Panel:** Configure sidebar menus, icons, and roles.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Icons:** Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project created in [Firebase Console](https://console.firebase.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rainerhosch/firebase-content-management.git
    cd firebase-content-management
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in your Firebase configuration keys.
    ```bash
    cp .env.example .env.local
    ```

    You can find these keys in **Project Settings > General** in the Firebase Console.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Initial Setup & Authentication

Since the dashboard requires login, you need to create your first admin user manually in Firestore.

1.  Go to **Firebase Console > Firestore Database**.
2.  Create a collection named `users`.
3.  Add a document with a custom ID (e.g., `admin`).
4.  Add the following fields:
    - **email** (string): `admin@example.com` (or your email)
    - **displayName** (string): `Admin`
    - **role** (string): `admin`
    - **password** (string): SHA-256 hash of your password.

    > **Tip:** To generate a SHA-256 hash for "password123", run this in your browser console:
    ```javascript
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode('password123'))
      .then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join(''))
    // Output: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
    ```

5.  Refresh the app and login with your credentials.

## 📂 Project Structure

```
src/
├── app/
│   ├── (dashboard)/       # Protected dashboard routes (layout wrapped)
│   │   ├── [collection]/  # Dynamic route for custom collections
│   │   ├── channels/      # Channels management page
│   │   ├── dracin/        # Dracin management page
│   │   ├── settings/      # Settings page
│   │   └── users/         # User management page
│   ├── api/               # API routes
│   └── login/             # Login page
├── components/
│   ├── auth/              # Auth components (ProtectedRoute)
│   ├── forms/             # Reusable forms (UserForm, DynamicForm, etc.)
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── tables/            # Data tables (DataTable, Columns)
│   └── ui/                # Shadcn UI primitives
├── contexts/              # React Contexts (AuthContext)
├── lib/
│   ├── firebase.ts        # Firebase initialization
│   ├── firestore-actions.ts # CRUD operations
│   ├── icons.ts           # Icon mapping utility
│   └── validations.ts     # Zod schemas
└── types/
    └── firestore-schema.ts # TypeScript interfaces
```

## 📖 Usage Guide

### Creating Custom Collections
1.  Navigate to **Settings > Collections**.
2.  Click **Add Collection**.
3.  Fill in details:
    - **ID:** Collection ID in Firestore (e.g., `products`).
    - **Name:** Display name in sidebar (e.g., `Products`).
    - **Route:** URL path (e.g., `/products`).
    - **Icon:** Choose an icon.
4.  **Add Fields:** Define the schema for your collection (Text, Number, URL, Boolean, Select, etc.).
5.  Save. The new menu item will appear in the sidebar.

### Managing Roles
1.  Navigate to **Settings > Role Permissions**.
2.  Click **Add Role**.
3.  Define role name and select allowed collections.
4.  Assign roles to users in the **Users** page.

## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/):

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add your Environment Variables in Vercel Project Settings.
4.  Deploy.

## 📄 License

This project is open-source and available under the MIT License.
