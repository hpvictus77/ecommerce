# Amazon Clone - Full-Featured Ecommerce App

A comprehensive ecommerce shopping application built with modern web technologies, featuring a React frontend and Node.js backend.

## 🚀 Features

### Customer Features
- **User Authentication** - Register, login, logout with JWT
- **Product Catalog** - Browse products with categories, search, and filters
- **Product Details** - Detailed product pages with images, reviews, and ratings
- **Shopping Cart** - Add/remove items, quantity management
- **Wishlist** - Save products for later
- **Checkout Process** - Secure payment processing with Stripe
- **Order Management** - View order history and track orders
- **User Profile** - Manage personal information and addresses
- **Product Reviews** - Rate and review products
- **Responsive Design** - Works on all devices

### Admin Features
- **Admin Dashboard** - Sales analytics and statistics
- **Product Management** - Add, edit, delete products
- **Category Management** - Manage product categories
- **Order Management** - View and update order status
- **User Management** - View customer information
- **Inventory Management** - Track product stock

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Hook Form** - Form handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Image hosting
- **Nodemailer** - Email service

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amazon-clone-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create `.env` files in both client and server directories with required variables (see .env.example files)

4. **Start the application**
   ```bash
   npm run dev
   ```

This will start both the React development server (port 3000) and the Express server (port 5000).

## 🔧 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Support
```bash
docker-compose up --build
```

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@example.com or create an issue in the repository.