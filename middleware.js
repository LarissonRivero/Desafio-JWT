const jwt = require('jsonwebtoken')//npm install jsonwebtoken

function verificarCredenciales(fields) {
  return function (req, res, next) {
    const missingFields = fields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Faltan campos: ${missingFields.join(', ')}` });
    }
    next();
  };
}

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization").split("Bearer ")[1]

  if (!token) throw {
    code: 401,
    message: "Debes incluir token en el header"
  }
  const tokenValido = jwt.verify(token, 'clavesecreta')
  req.email = tokenValido.email
  next()
}

const logEnElTerminal = (req, res, next) => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`${time} Recibe el Metodo ${req.method}, en la ruta ${req.path}`)
  next()
}

module.exports = { verificarCredenciales, verificarToken, logEnElTerminal } 