import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectDB } from './config/connect.js'

const app = express()
const port = process.env.PORT;
connectDB();

//middlewares
app.use(express.json());

//import routes
import authRoutes from './routes/authRoutes.js'
import roleRoutes from './routes/roleRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import moderationRoutes from './routes/moderationRoutes.js'

//routes
app.use('/v1/auth', authRoutes);
app.use('/v1/role', roleRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/member', moderationRoutes);



app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});