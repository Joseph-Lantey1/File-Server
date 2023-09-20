import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define a custom interface to extend the Request object
interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('authorization'); // You can change the header name as needed
  if (!token) return res.status(401).json({ message: 'Authentication failed' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string); 
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
