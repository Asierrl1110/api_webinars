const fs = require("fs").promises;
const path = require("path");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../services/jwt");

async function registerUser(req, res){
    const user = new User(req.body);
    const { email, password } = req.body;

    try {
        if(!email) throw { msg: "El email es obligatorio" };
        if(!password) throw { msg: "La contraseña es obligatoria" };

        // Revisamos si el email esta en uso o no
        const foundEmail = await User.findOne({ email: email });

        if(foundEmail) throw { msg: "El email ya esta en uso" };

        // Encriptación de la contraseña
        const salt = bcryptjs.genSaltSync(10);
        user.password = await bcryptjs.hash(password, salt);

        // Guardamos el usuario en la base de datos
        const userStore = await user.save();

        if(!userStore){
            res.status(400).send({ msg: "No se ha registrado el usuario" });
        }else{
            res.status(200).send({ user: userStore });
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

async function login(req, res) {
    // Obtenemos los datos del email y la contraseña
    const { email, password } = req.body;
    try {
        // Buscamos que existe un usuario con ese email
        const user = await User.findOne({ email });
        if(!user) throw { msg: "Error en el email o contraseña" };

        // Buscamos que la contraseña es correcta con la contraseña desencriptada de la base de datos y la introducida
        const passwordSuccess = await bcryptjs.compare(password, user.password);
        if(!passwordSuccess) throw { msg: "Error en el email o contraseña" };

        // Devolvemos un token de acceso al usuario
        res.status(200).send({ token: jwt.createToken(user, "12h") });

    } catch (error) {
        res.status(500).send(error);
    }
}

function protected(req, res){
    res.status(200).send({ msg: "Contenido del Endpoint protegido" });
}

async function uploadAvatar(req, res) {
    // Obtenemos los parámetros
    const params = req.params;

    try {
        // Obtenemos los datos del usuario a partir del id de los parámetros
        const userData = await User.findById(params.id);

        // Comprobamos si no existe el usuario
        if (!userData) {
            return res.status(404).send({ msg: "No se ha encontrado el usuario" });
        }

        // Almacenamos los datos del usuario en la variable user
        let user = userData;

        // Comprobamos si el usuario envio ficheros o no
        if(req.files){
            // Obtenemos el nombre del fichero
            const filePath = req.files.avatar.path;
            const fileSplit = filePath.split("\\");
            const fileName = fileSplit[1];

            // Obtenemos la extensión del fichero
            const extSplit = fileName.split(".");
            const fileExt = extSplit[1];

            // Validamos que sea una de las extensiones permitidas (png o jpg)
            if (fileExt !== "png" && fileExt !== "jpg") {
                return res.status(400).send({ msg: "La extensión de la imagen no es válida. Extensiones permitidas: jpg y png" });
            }

            // Le asignamos como nuevo avatar el nombre del fichero
            user.avatar = fileName;

            // Actualizamos el usuario
            const updateUser = await User.findByIdAndUpdate(params.id, user);

            // Comprobamos si se actualizo correctamente
            if(!updateUser){
                return res.status(404).send({ msg: "No se ha encontrado el usuario" });
            }else{
                return res.status(200).send({ msg: "Avatar actualizado correctamente" });
            }

        }else{
            return res.status(400).send({ msg: "No se ha enviado ningún archivo" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error del servidor" });
    }
}

async function getAvatar(req, res) {
    // Obtenemos el nombre del avatar de los parámetros
    const avatarName = req.params.avatarName;
    // Le agregamos la ruta de uploads del servidor
    const filePath = `./uploads/${avatarName}`;

    try {
        // Comprobamos si existe el avatar en el servidor o no
        const stat = await fs.stat(filePath);
        // Enviamos el avatar
        res.sendFile(path.resolve(filePath));

    } catch (err) {
        res.status(404).send({ msg: "El avatar no existe" });
    }
}

module.exports = {
    registerUser,
    login,
    protected,
    uploadAvatar,
    getAvatar
}