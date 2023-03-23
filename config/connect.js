import mongoose from "mongoose";
mongoose.set('strictQuery',false);
//connect to mongodb database locally
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // dbName:process.env.MONGO_DBNAME,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}