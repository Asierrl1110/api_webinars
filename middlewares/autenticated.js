const moment = require("moment");
const jwt = require("../services/jwt");

const SECRET_KEY = process.env.SECRET_KEY;

function ensureAuth(req, res, next){
    // Comprobamos si el usuaro mando la cabecera de autenticación
    if(!req.headers.authorization){
        return res.status(403).send({ msg: "La petición no tiene la cabecera de Autenticación" });
    }

    // Reemplazamos las comillas simples por nada
    const token = req.headers.authorization.replace(/['"]+/g, "");

    // Decodeamos el token con la clave secreta
    const payload = jwt.decodeToken(token, SECRET_KEY);
    try {
        // Comprobamos si la fecha de expiración ha expirado o no
        if(payload.exp <= moment().unix()){
            return res.status(400).send({ msg: "El token ha expirado" });
        }

    } catch (error) {
        res.status(400).send({ msg: "Token invalido" });
    }

    req.user = payload;
    next();
}

module.exports = {
    ensureAuth
};