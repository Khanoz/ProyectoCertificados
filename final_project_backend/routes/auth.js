const jwt = require("jsonwebtoken");
const { getMongoConnection } = require("../mongo");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const utils = require("./utils");

function GenerateToken(id) {
  const expirationSecs = parseInt(process.env.JWT_EXPIRATION_TIME_SECS);
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expirationSecs,
  });
  return token;
}

/**
 * @swagger
 *    tags:
 *        name: Auth
 *        description: Endpoints de autenticación de usuarios
 * /auth/login:
 *    post:
 *        tags: [Auth]
 *        description: Ingreso de usuario, genera un token si el usuario existe
 *        requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    email:
 *                      type: string
 *                    password:
 *                      type: string
 *        responses:
 *          200:
 *            description: Usuario autorizado
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *          401:
 *            description: Not authorized
 */
const login = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.send({ errors: errs.array() });
  }

  const mongo = await getMongoConnection();
  const { email, password } = req.body;
  const users = await mongo.collection("Users").find({ email }).toArray();
  for (const user of users) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = GenerateToken(user._id);
      return res.json({ token });
    }
  }
  return res.sendStatus(401);
};

/**
 * @swagger
 * /auth/register:
 *    post:
 *        tags: [Auth]
 *        description: Registro de usuario, no permite emails repetidos
 *        requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    email:
 *                      type: string
 *                    password:
 *                      type: string
 *        responses:
 *          200:
 *            description: Usuario creado y autorizado
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *          409:
 *            description: Existe un usuario con este correo
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 */
const register = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.send({ errors: errs.array() });
  }
  const { email } = req.body;
  let password = req.body.password;
  password = bcrypt.hashSync(password);

  const mongo = await getMongoConnection();
  if ((await mongo.collection("Users").countDocuments({ email })) !== 0) {
    console.log((await mongo.collection("Users").countDocuments({ email })), email);
    const errRes = utils.errorResponseTemplate;
    errRes.message = "Ya existe un usuario con ese correo electrónico";
    return res.status(409).json(errRes);
  }

  const data = await mongo
    .collection("Users")
    .insertOne({ email, password });
  const token = GenerateToken(data.insertedId);
  return res.json({ token });
};

/**
 * @swagger
 * /auth/recover:
 *    post:
 *        tags: [Auth]
 *        summary: Aún no implementada
 *        description: Recuperación de email
 *        requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    email:
 *                      type: string
 *        responses:
 *          204:
 *            description: Correo de recuperación enviado
 *          400:
 *            description: No existe un usuario con ese correo
 */
const recoverEmail = (req, res) => {
  // TODO: Implementar esta función
  res.sendStatus(204)
};

module.exports = {
  login,
  register,
  recoverEmail,
};
