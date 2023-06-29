const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')//npm install jsonwebtoken paquete para crear tokens
const { verificarCredenciales, verificarToken, logEnElTerminal } = require('./middleware')
const { verificarEmail, registrarUsuario, verificarUsuarios, leerRegistro } = require('./registro')

const cors = require('cors')

const now = new Date();
const time = now.toLocaleTimeString();
app.listen(3000, console.log(`${time} Servidor Funcionando`))
app.use(cors())
app.use(express.json())

const requiredFields = ['email', 'password', 'rol', 'lenguage'];

app.post('/usuarios', logEnElTerminal, verificarCredenciales(requiredFields), async (req, res) => {
    try {
        const usuario = req.body  
        const status = await verificarEmail(usuario.email)    
        if (status === true){
            throw { code: 401, message: "Usuario Existente" }
        }
        await registrarUsuario(usuario) 
        res.send("Usuario creado con éxito")
    }
    catch(error) {res.status(error.code || 500).send(error.message)}
})

app.post('/login', logEnElTerminal, async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarUsuarios(email, password)
        const token = jwt.sign({ email }, 'clavesecreta', { expiresIn: " " })//Tenemos la opcion de colocar un tiempo de expiracion
        res.send(token)
    }
    catch (error) {res.status(error.code || 500).send(error.message)}
})

app.get('/usuarios', logEnElTerminal, verificarToken, async (req, res) => {
    // Try-Catch para manejar errores
    try {
        const result = await leerRegistro(req.email)
        res.json({ 'email': req.email, 'rol': result.rol, 'lenguage': result.lenguage })
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('Tokens do not match');
        } else if (error.name === 'TokenExpiredError') {
            console.error('Token expired');
        } else {
            console.error('Error', error);
        }
        res.status(error.code || 500).send(error.message)
    }
})