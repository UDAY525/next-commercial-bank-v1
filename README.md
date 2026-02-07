# 🏦 Next Commercial Bank - Feature Documentation

A modern financial management platform built with Next.js, offering users a centralized way to manage multiple bank accounts, track transactions, and transfer funds in real-time.

---

## 🛠 Tech Stack

The application leverages a cutting-edge stack to ensure security, speed, and a premium user experience.

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | [Shadcn/UI](https://ui.shadcn.com/) |
| **Backend/Auth** | [Appwrite](https://appwrite.io/) |
| **Banking API** | [Plaid](https://plaid.com/) |
| **Payments** | [Dwolla](https://www.dwolla.com/) |
| **Forms/Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## 🚀 Key Features

### 1. Unified Dashboard
* **Total Balance Summary:** Aggregates balances from all connected bank accounts into one view.
* **Dynamic Visualizations:** Circular charts to represent spending vs. savings.
* **Real-time Updates:** Instant UI updates when accounts are linked or transactions occur.

### 2. Banking & Integration
* **Connect Multiple Banks:** Securely link various financial institutions via Plaid.
* **Account Selection:** Seamlessly switch between different accounts to view specific transaction histories.
* **Verified Accounts:** Uses Dwolla for secure identity verification (KYC).

### 3. Transaction Management
* **Detailed History:** A searchable and filterable list of all bank transactions.
* **Categorization:** Transactions are automatically categorized (e.g., Food, Transfer, Travel) for better budgeting.
* **Pagination:** Smooth navigation through large volumes of financial data.

### 4. Fund Transfers
* **Payment Processing:** Send money to other users via ACH transfers (powered by Dwolla).
* **Secure Validation:** Multi-step form validation to ensure account details are correct before processing.

### 5. Security & Performance
* **Server Actions:** Utilizes Next.js server-side logic for sensitive operations to keep API keys hidden.
* **Session Management:** Persistent and secure user sessions via Appwrite.
* **Fully Responsive:** Optimized for desktop, tablet, and mobile screens.

---

## 📁 Project Architecture

> **Note:** The project follows a modular "feature-first" folder structure within the `/app` and `/components` directories to ensure scalability.

* `app/`: Contains the main routing logic and layout definitions.
* `components/`: Houses reusable UI components (BankCards, Sidebar, TransactionTable).
* `lib/`: Contains server actions, utility functions, and API configurations.
