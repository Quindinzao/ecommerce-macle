const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};