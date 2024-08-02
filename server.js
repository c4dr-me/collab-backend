const express = require('express');
const bodyParser = require('body-parser');
const ConnectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/User');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
const corsOptions = {
    origin: 'http://localhost:5173', 
    optionsSuccessStatus: 200
  };
app.use(express.json());
app.use(cors(corsOptions));

// app.use('/uploads', express.static(path.join(__dirname, 'backend', 'uploads')));
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 5000 || process.env.PORT;

ConnectDB();
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
    
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
