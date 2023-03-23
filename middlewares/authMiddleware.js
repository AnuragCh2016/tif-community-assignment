import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export default function authMiddleware(req, res, next) {
    const {authorization} = req.headers;
    if(!authorization||!authorization.startsWith('Bearer')){
        return res.status(401).json({msg: 'No token, authorization denied'});
    } else {
        const token = authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({msg: 'No token, authorization denied'});
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.data = decoded.id;
            next();
        } catch (e) {
            res.status(401).json({msg: 'Token is not valid'});
        }
    }
}