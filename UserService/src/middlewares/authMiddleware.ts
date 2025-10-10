import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../lib/jwt';

export interface AuthRequest extends Request {
  user?: { id: string; role: string, email: string, password: string }; // Adjust based on your user payload structure
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = auth.split(' ')[1];
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Assuming you've attached the decoded user object to req.user (e.g., from JWT)
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admins only." });
    }

    // User is admin, allow access
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}