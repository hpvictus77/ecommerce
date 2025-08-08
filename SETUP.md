# Amazon Clone Ecommerce - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**
- **Git**

### Option 1: Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amazon-clone-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install && cd ..
   
   # Install client dependencies
   cd client && npm install && cd ..
   ```

3. **Environment Setup**
   
   **Server Environment (.env)**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@ecommerce.com
   
   CLIENT_URL=http://localhost:3000
   ```

   **Client Environment (.env)**
   ```bash
   cp client/.env.example client/.env
   ```
   
   Edit `client/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using MongoDB manually
   mongod --dbpath /path/to/your/db
   ```

5. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually:
   # Backend: npm run server
   # Frontend: npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

### Option 2: Docker Setup

1. **Install Docker and Docker Compose**

2. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd amazon-clone-ecommerce
   ```

3. **Start with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## 🔧 Configuration

### Database Setup

**MongoDB Atlas (Cloud)**
1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in server/.env

**Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `ecommerce`
4. Update `MONGODB_URI` in server/.env

### Payment Setup (Stripe)

1. Create account at https://stripe.com
2. Get API keys from dashboard
3. Update environment variables:
   - `STRIPE_SECRET_KEY` (server)
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` (client)

### File Upload Setup (Cloudinary)

1. Create account at https://cloudinary.com
2. Get credentials from dashboard
3. Update environment variables in server/.env

### Email Setup

1. **Gmail SMTP**
   - Enable 2-factor authentication
   - Generate app password
   - Update email configuration

2. **Other providers**
   - Update SMTP settings accordingly

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### API Testing
Use the provided Postman collection or test with curl:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🔒 Security

### Development
- Use placeholder keys for development
- Never commit real API keys
- Use environment variables

### Production
- Use strong JWT secrets
- Enable HTTPS
- Set proper CORS origins
- Use secure headers
- Regular security updates

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI**

2. **Create Heroku apps**
   ```bash
   # Backend
   heroku create your-app-name-api
   
   # Frontend
   heroku create your-app-name-client
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production --app your-app-name-api
   heroku config:set MONGODB_URI=your_mongodb_connection_string --app your-app-name-api
   # ... set other environment variables
   ```

4. **Deploy**
   ```bash
   # Backend
   git subtree push --prefix server heroku main
   
   # Frontend
   git subtree push --prefix client heroku main
   ```

### Vercel Deployment (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

### DigitalOcean/AWS/GCP

1. Create server instance
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Use PM2 for process management
6. Configure nginx as reverse proxy
7. Set up SSL with Let's Encrypt

## 🛠 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string
- Check firewall settings

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Module Not Found**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors**
- Check `CLIENT_URL` in server/.env
- Verify CORS configuration in server/index.js

### Debug Mode

**Backend Debug**
```bash
cd server
DEBUG=* npm run dev
```

**Frontend Debug**
```bash
cd client
REACT_APP_DEBUG=true npm start
```

## 📞 Support

For support, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with:
   - Environment details
   - Error messages
   - Steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.