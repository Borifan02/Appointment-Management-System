import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
