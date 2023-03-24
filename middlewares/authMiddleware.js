import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const authErrorJson = {
    "status": false,
    "errors": [
      {
        "message": "You need to sign in to proceed.",
        "code": "NOT_SIGNEDIN"
      }
    ]
  }


export default function authMiddleware(req, res, next) {
    const {authorization} = req.headers;
    if(!authorization||!authorization.startsWith('Bearer')){
        return res.status(401).json(authErrorJson);
    } else {
        const token = authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json(authErrorJson);
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