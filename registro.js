const { Pool } = require('pg')//npm install pg paquete para conectarse a postgres
const bcrypt = require('bcrypt');//npm install bcrypt paquete para encriptar contraseñas

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Lar1ss0n',
    database: 'desafio6',
    allowExitOnIdle: true
})

const verificarEmail= async (email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario] } = await pool.query(consulta, values)

    if (usuario === undefined || usuario === '')
        return false
    else
        return true
}

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario
    if (email, password, rol, lenguage) {

        const passwordEncriptada = bcrypt.hashSync(password, 10)
        const values = [email, passwordEncriptada, rol, lenguage]
        const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
        await pool.query(consulta, values)
    }
}

const verificarUsuarios = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (usuario === undefined || usuario === '')
        throw { code: 401, message: "Usuario no Encontrado" }
    const { password: passwordEncriptada } = usuario

    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Contraseña Incorrecta, Intentelo nuevamente" }
}

const leerRegistro = async (email) => {
    const values = [email]
    const consulta = "SELECT email,  rol, lenguage FROM usuarios WHERE email = $1"
    const { rows } = await pool.query(consulta, values)
    return (rows[0])
}

module.exports = {verificarEmail,  registrarUsuario, verificarUsuarios, leerRegistro}