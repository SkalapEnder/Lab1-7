const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRouter = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://skalap2endra:kGOM7z5V54vBFdp1@cluster0.vannl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("MongoDB Connected!"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => res.render('index'))

// Routes
app.use('/', authRouter);
app.use('/', taskRouter);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
