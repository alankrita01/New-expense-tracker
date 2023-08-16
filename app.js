const path = require('path');
const express = require('express');
const sequelize = require('./util/database');

const userRoute = require('./routes/userRoute');
const expenseRoute = require('./routes/expenseRoute');
const purchaseRoute = require('./routes/purchaseRoute');

const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Order = require('./models/ordersModel');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', async (req,res,next) => {
    res.sendFile(__dirname+'/public/signup.html')
})

app.use(express.static('public'));



app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize.sync({alter : true})
.then(result => {
  app.listen(3000, () => {
    console.log('server started');
  })
})
.catch(err => console.log(err));