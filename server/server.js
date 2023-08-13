import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'

//configure env
dotenv.config()

//database configuration
connectDB();

//rest object 
const app = express();

//middleware
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes);

app.disable('etag');
//rest api
app.get("/", (req, res) => {
    res.send(
        `<h1>Welcome to Ecommerce App</h1>
        <h2> ${JSON.stringify(res.status)} </h2>
        `
    )
})

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} on port ${PORT}`);
});