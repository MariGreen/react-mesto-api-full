const express = require('express');

const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
require('dotenv').config();

app.use(helmet());

const cardRouter = require('./routes/cards').router;
const userRouter = require('./routes/users').router;

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Ваши запросы очень похожи на автоматические (←_←)',
});

app.use(limiter);
// app.use('/api', require('./routes/apiRouter'));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
// app.get('/users', getAllUsers);
// app.patch('/users/me', updateUser);
// app.patch('/users/me/avatar', updateUserAvatar);
app.use(userRouter);
// app.use('/', auth, cardRouter);
app.use(cardRouter);

app.get('*', (req, res) => {
  res
    .status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'localhost:3000');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

//   next();
// });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
