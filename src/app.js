const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');

const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cors());

if (process.env.NODE_ENV === 'development') 
app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Seje bem-vindo a aplicação Saturno'
  })
})
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/projects', require('./routes/projectRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/services', require('./routes/serviceRoutes'));

app.use('/api/v1/files/', express.static(path.resolve(__dirname, '..', 'public')))

// App Error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Não exist ${req.originalUrl } neste servidor!`, 404))
});

app.use(require('./controllers/errorController'));

module.exports = app;