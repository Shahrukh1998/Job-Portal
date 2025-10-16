import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import mongoose from 'mongoose';
import expressEjsLayouts from 'express-ejs-layouts';
import {protect} from './middleware/middlewareAuth.js';


import authRoute from './routes/authRoute.js';
import jobRoute from './routes/jobRoute.js';
import pageRoute from './routes/pageRoute.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressEjsLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, 'views')));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(protect);

// app.use('*', (req,res)=>{
//     res.status(404).render('404');
// });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes
app.use('/', authRoute);
app.use('/job', jobRoute);
app.use('/', pageRoute);

app.use((req, res)=>{
    res.status(404).send('Page Not Found');
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
})