const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./src/utils/AppError');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

// Routes
const authRouter = require('./src/routes/authRoutes');
const questionRouter = require('./src/routes/questionRoutes');
const subjectRouter = require('./src/routes/subjectRoutes');
const generatorRouter = require('./src/routes/generatorRoutes');
const dashboardRouter = require('./src/routes/dashboardRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Implement CORS - MUST be at the top
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// CORS moved to top

// STATIC FILES
// app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/generator', generatorRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Undefined routes
app.all(/(\.*)/, notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
