# GradGoods

GradGoods is a full-stack MERN application designed for students and graduates to buy, sell, and exchange goods effortlessly. It offers a modern UI, real-time communication, and secure authentication.

the live version: [🔗 View Live Project](https://gradgood.onrender.com)

## 🚀 Features

- **User Authentication**
  - Email/Password and Google OAuth login
  - JWT-based authentication with cookies

- **Marketplace**
  - Post, browse, and filter goods
  - Image support and detailed product pages

- **Real-Time Chat**
  - WebSocket-powered messaging using `socket.io`

- **Responsive Design**
  - Built with TailwindCSS and Radix UI components for a clean, mobile-first experience

- **Form Handling**
  - Validation powered by `react-hook-form` + `zod`

- **Admin & Agent Management**
  - Role-based access (if enabled)

---

## 🛠 Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Zustand (state management)
- Radix UI + TailwindCSS
- React Hook Form + Zod
- React Hot Toast (notifications)
- Embla Carousel (UI sliders)
- Lucide React (icons)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication + bcryptjs
- Socket.io (real-time communication)
- dotenv + cors + cookie-parser

---

## 📦 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/gradgoods.git
cd gradgoods
```

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run the Development Server

```bash
npm run server
```

This runs:
- Backend server with Nodemon  
- Frontend with Vite (on a separate port)

---

## 🏗 Build & Production

Build frontend assets:

```bash
npm run build
```

Start production server:

```bash
npm run dev
```

---


## 🧪 Linting

Run ESLint:

```bash
npm run lint
```

---



## 📜 License

This project is licensed under the MIT License.
