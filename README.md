# 🛍️ Nile Brands Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive, scalable e-commerce platform backend built with **Node.js**, **Express**, and **MongoDB**. This robust system supports multi-brand management, real-time features, advanced analytics, and seamless payment processing.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based authentication** with configurable expiration
- **Google OAuth 2.0** integration for seamless login
- **Role-based access control** (Admin, Brand Owner, Customer)
- **Password reset** with email verification
- **Account management** (activation/deactivation)
- **Security middleware** (Helmet, CORS, Rate Limiting, XSS Protection)

### 🛍️ E-commerce Core
- **Multi-brand marketplace** support
- **Product catalog** with categories and subcategories
- **Advanced search** and filtering capabilities
- **Shopping cart** management
- **Order processing** with status tracking
- **Wishlist** functionality
- **Review & rating** system

### 💳 Payment & Orders
- **Stripe integration** for secure payments
- **Coupon system** with validation
- **Order tracking** and status updates
- **Payment history** and receipts
- **Refund processing** support

### 📊 Analytics & Insights
- **Real-time dashboard** for brand owners
- **Sales analytics** and revenue tracking
- **Customer behavior** insights
- **Product performance** metrics
- **Brand comparison** analytics
- **Trend analysis** and reporting

### 💬 Real-time Communication
- **Live chat** between customers and brand owners
- **Image sharing** in conversations
- **Socket.io** powered real-time updates
- **Online status** tracking
- **Cross-platform** support (Web, Mobile)

### 🖼️ Media Management
- **Cloudinary integration** for image storage
- **Sharp** for image processing and optimization
- **Multiple image upload** support
- **Image validation** and sanitization
- **Automatic thumbnail** generation

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Runtime** | Node.js | 18.x+ |
| **Framework** | Express.js | 4.x |
| **Database** | MongoDB | 6.x |
| **ODM** | Mongoose | 7.x |
| **Authentication** | JWT, Google OAuth | - |
| **Real-time** | Socket.io | 4.x |
| **Payment** | Stripe | Latest |
| **File Upload** | Multer | 1.x |
| **Image Processing** | Sharp | 0.32.x |
| **Cloud Storage** | Cloudinary | Latest |
| **Validation** | Express Validator | 7.x |
| **Email** | Nodemailer | 6.x |

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control
- **Cloudinary** account - [Sign up here](https://cloudinary.com/)
- **Stripe** account - [Sign up here](https://stripe.com/)
- **Google OAuth** credentials - [Get here](https://console.developers.google.com/)
- **Gmail** account (for email notifications)

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: At least 1GB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/melbarber10/nile-brands-backend.git
cd nile-brands-backend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB=mongodb://localhost:27017/nile-brands

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_EXPIRE=90d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: Redis for caching (if implemented)
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Run database seeders (optional)
npm run seed
```

### 5. Start the Application
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# With PM2 (recommended for production)
npm run start:prod
```

The server will start on `http://localhost:3000`

### 6. Verify Installation
```bash
# Test the API
curl http://localhost:3000/api/v1/health

# Expected response: {"status": "OK", "message": "Server is running"}
```

## 📚 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | User login | ❌ |
| `POST` | `/api/v1/auth/google` | Google OAuth login | ❌ |
| `POST` | `/api/v1/auth/forgetPassword` | Request password reset | ❌ |
| `POST` | `/api/v1/auth/verifyCode` | Verify reset code | ❌ |
| `POST` | `/api/v1/auth/resetPassword` | Reset password | ❌ |
| `GET` | `/api/v1/auth/me` | Get current user | ✅ |
| `PUT` | `/api/v1/auth/updatePassword` | Update password | ✅ |

### 🛍️ Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/products` | List all products | ❌ |
| `GET` | `/api/v1/products/:id` | Get product details | ❌ |
| `POST` | `/api/v1/products` | Create new product | ✅ (Owner) |
| `PUT` | `/api/v1/products/:id` | Update product | ✅ (Owner) |
| `DELETE` | `/api/v1/products/:id` | Delete product | ✅ (Owner) |
| `GET` | `/api/v1/products/:id/reviews` | Get product reviews | ❌ |
| `POST` | `/api/v1/products/:id/reviews` | Add product review | ✅ |

### 🛒 Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/orders` | List user orders | ✅ |
| `POST` | `/api/v1/orders` | Create new order | ✅ |
| `GET` | `/api/v1/orders/:id` | Get order details | ✅ |
| `PUT` | `/api/v1/orders/:id` | Update order status | ✅ (Owner) |
| `GET` | `/api/v1/orders/track/:id` | Track order status | ❌ |

### 💬 Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/messages/users` | Get chat users list | ✅ |
| `GET` | `/api/v1/messages/:id` | Get chat history | ✅ |
| `POST` | `/api/v1/messages/send/:id` | Send message | ✅ |

### 📊 Analytics Endpoints (Owner Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/analytics/dashboard` | Get dashboard statistics | ✅ (Owner) |
| `GET` | `/api/v1/analytics/trends` | Get sales trends | ✅ (Owner) |
| `GET` | `/api/v1/analytics/products` | Get product performance | ✅ (Owner) |
| `GET` | `/api/v1/analytics/customers` | Get customer analytics | ✅ (Owner) |

## 🏗️ Project Structure

```
nile-brands-backend/
├── 📁 config/                 # Configuration files
│   ├── cloudinary.js         # Cloudinary setup
│   ├── database.js           # MongoDB connection
│   ├── googleClient.js       # Google OAuth config
│   ├── socket.js             # Socket.io configuration
│   └── stripe.js             # Stripe configuration
├── 📁 controllers/           # Request handlers
│   ├── analytics.js          # Analytics logic
│   ├── auth.js              # Authentication
│   ├── brand.js             # Brand management
│   ├── carts.js             # Shopping cart
│   ├── categories.js        # Category management
│   ├── coupon.js            # Coupon system
│   ├── feedback.js          # Feedback handling
│   ├── message.js           # Chat functionality
│   ├── orders.js            # Order processing
│   ├── payment.js           # Payment handling
│   ├── products.js          # Product management
│   ├── reviews.js           # Review system
│   ├── subcategories.js     # Subcategory management
│   └── user.js              # User management
├── 📁 middlewares/          # Custom middleware
│   ├── errorHandler.js      # Error handling
│   ├── filterData.js        # Data filtering
│   ├── notFound.js          # 404 handler
│   ├── setID.js             # ID middleware
│   ├── uploadImage.js       # Image upload
│   └── validatorMiddleware.js # Validation
├── 📁 models/               # Database models
│   ├── analyticsModel.js    # Analytics schema
│   ├── brandModel.js        # Brand schema
│   ├── cartsModel.js        # Cart schema
│   ├── categoriesModel.js   # Category schema
│   ├── couponModel.js       # Coupon schema
│   ├── feedbackModel.js     # Feedback schema
│   ├── messageModel.js      # Message schema
│   ├── ordersModel.js       # Order schema
│   ├── productsModel.js     # Product schema
│   ├── reviewsModel.js      # Review schema
│   ├── subcategoriesModel.js # Subcategory schema
│   └── usersModel.js        # User schema
├── 📁 routes/               # API routes
│   ├── analyticsRoute.js    # Analytics endpoints
│   ├── authRoute.js         # Auth endpoints
│   ├── brandsRoute.js       # Brand endpoints
│   ├── cartsRoute.js        # Cart endpoints
│   ├── categoriesRoute.js   # Category endpoints
│   ├── couponsRoute.js      # Coupon endpoints
│   ├── feedbackRoute.js     # Feedback endpoints
│   ├── index.js             # Route index
│   ├── messageRoute.js      # Message endpoints
│   ├── ordersRoute.js       # Order endpoints
│   ├── paymentRoute.js      # Payment endpoints
│   ├── productsRoute.js     # Product endpoints
│   ├── reviewsRoute.js      # Review endpoints
│   ├── subcategoriesRoute.js # Subcategory endpoints
│   ├── usersRoute.js        # User endpoints
│   └── wishlistRoute.js     # Wishlist endpoints
├── 📁 seeders/              # Database seeders
│   ├── seedBrandProducts.js # Product seeding
│   ├── seedBrands.js        # Brand seeding
│   ├── seedCategoryAndSubcategory.js # Category seeding
│   ├── seedOrders.js        # Order seeding
│   └── seedUsers.js         # User seeding
├── 📁 test/                 # Test files
│   ├── brand-comparison.js  # Brand tests
│   ├── customer-analysis.js # Customer tests
│   ├── daily-stats-transform.js # Stats tests
│   ├── date-format.js       # Date tests
│   ├── performance-sort.js  # Performance tests
│   ├── popular-products.js  # Product tests
│   ├── product-stats.js     # Stats tests
│   ├── top-products.js      # Top products tests
│   └── trends.js            # Trend tests
├── 📁 utils/                # Utility functions
│   ├── apiErrors.js         # Error utilities
│   ├── createToken.js       # Token generation
│   ├── features.js          # Query features
│   ├── sendMail.js          # Email utilities
│   ├── startServer.js       # Server startup
│   └── 📁 validation/       # Validation schemas
│       ├── authValidation.js # Auth validation
│       ├── brandValidation.js # Brand validation
│       ├── cartsValidation.js # Cart validation
│       ├── categoriesValidation.js # Category validation
│       ├── couponValidation.js # Coupon validation
│       ├── feedbackValidation.js # Feedback validation
│       ├── messageValidation.js # Message validation
│       ├── ordersValidation.js # Order validation
│       ├── paymentValidation.js # Payment validation
│       ├── productsValidation.js # Product validation
│       ├── reviewsValidation.js # Review validation
│       ├── subcategoriesValidation.js # Subcategory validation
│       └── usersValidation.js # User validation
├── 📄 app.js                # Application entry point
├── 📄 package.json          # Dependencies and scripts
└── 📄 README.md             # This file
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run start:prod` | Start production server with PM2 |
| `npm run seed` | Run database seeders |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **File Upload Security** with validation and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **XSS Protection** and data sanitization
- **HTTP Parameter Pollution** protection
- **Error Handling** without exposing sensitive information

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- test/auth.test.js

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

### Test Coverage
The test suite covers:
- ✅ Authentication flows
- ✅ Product CRUD operations
- ✅ Order processing
- ✅ Payment integration
- ✅ Chat functionality
- ✅ Analytics calculations
- ✅ File upload handling

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Error: MongoDB connection failed
# Solution: Ensure MongoDB is running
mongod --dbpath /path/to/your/data/directory
```

#### 2. Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::3000
# Solution: Change port in .env file or kill existing process
lsof -ti:3000 | xargs kill -9
```

#### 3. Cloudinary Upload Fails
```bash
# Error: Invalid cloud_name
# Solution: Verify Cloudinary credentials in .env file
# Ensure CLOUDINARY_CLOUD_NAME is correct
```

#### 4. JWT Token Issues
```bash
# Error: jwt malformed
# Solution: Check JWT_SECRET_KEY in .env file
# Ensure it's a strong, unique secret
```

#### 5. Email Not Sending
```bash
# Error: Invalid login
# Solution: Use Gmail App Password instead of regular password
# Enable 2FA and generate app password
```

### Performance Optimization
- Use Redis for caching (optional)
- Enable MongoDB indexing
- Optimize image uploads with Sharp
- Implement rate limiting for production

## 📦 Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

### Using Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```
## 📊 API Rate Limits

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| Authentication | 5 requests | 15 minutes |
| Product Search | 100 requests | 1 hour |
| File Upload | 10 requests | 1 hour |
| Chat Messages | 50 requests | 1 minute |
| Payment Processing | 20 requests | 1 hour |

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- **Express.js** team for the amazing framework
- **MongoDB** for the flexible database
- **Socket.io** for real-time capabilities
- **Stripe** for payment processing
- **Cloudinary** for image management
- **Sharp** for image optimization
- **JWT** for secure authentication


