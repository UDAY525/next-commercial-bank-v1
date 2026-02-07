# Blood Connect 🩸

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A high-performance, full-stack financial dashboard engineered to demonstrate **production-grade web architecture**. This platform focuses on complex data workflows, optimized database performance, and a seamless user experience using the latest Next.js features.

---

## 🧠 Project Philosophy

Unlike standard CRUD "to-do" apps, this platform is built to reflect **real-world engineering challenges**:
* **Database over Documentation:** Using MongoDB Aggregation Pipelines for heavy lifting.
* **Security First:** Middleware-protected routes and secure OAuth flows.
* **UX Fidelity:** Polished micro-interactions that provide immediate feedback.

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router), React 18/19 |
| **Language** | TypeScript (Strict Mode) |
| **Database** | MongoDB + Mongoose (Schema Optimization) |
| **Auth** | NextAuth.js / Google OAuth / Credentials |
| **Styling** | Tailwind CSS + Shadcn/UI |
| **Animations** | Framer Motion |
| **Analytics** | Recharts (Data Visualization) |

---

## 🚀 Key Engineering Features

### 1. Advanced MongoDB Integration
* **Aggregation Pipelines:** Complex data summaries (monthly trends, category distributions) are computed on the database level, not the client.
* **Optimized Indexing:** Collections are indexed for high-speed retrieval of user-specific transactional data.
* **Schema Design:** A clean separation between Authentication and Application-domain data.

### 2. Robust Authentication & Security
* **Multi-Strategy Auth:** Support for both Google OAuth and traditional Email/Password.
* **Middleware Guards:** Centralized route protection to prevent unauthorized access to sensitive dashboards.
* **Server Actions:** Securely handled data mutations with built-in validation.

### 3. Analytics & Real-Time Dashboards
* **Interactive Data Viz:** Dynamic charts built with Recharts that respond to user filters.
* **Metric Computation:** Real-time calculation of total balances, expense ratios, and transaction counts.

### 4. Professional UI/UX
* **Framer Motion:** Smooth page transitions and component-level animations (staggered lists, fading loaders).
* **Responsive Design:** A "Mobile-First" approach ensuring the dashboard is fully functional on any device.
* **Loading States:** Integrated skeleton screens to improve perceived performance.

---

## 🏗 Architecture Overview

```text
├── app/              # Next.js App Router (Pages, Layouts, API)
├── components/       # Atomic UI Components & Feature-specific modules
├── lib/              # Database configs, Mongoose models, & Server Actions
├── public/           # Static assets & icons
├── types/            # Centralized TypeScript interfaces
└── middleware.ts     # Edge-level route protection

```

## 👨‍💻 Author

**Uday Satyanarayan**  
Full-Stack Developer  
Focused on performance, architecture, and real-world problem solving.

