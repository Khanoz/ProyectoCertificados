const { getMongoConnection } = require("../mongo");
const { validationResult } = require("express-validator");
const utils = require("./utils");
const { ObjectId } = require("mongodb");

/**
 * @swagger
 *    tags:
 *        name: User
 *        description: Endpoints de administración de usuarios, requieren jwt
 * /user/bind-new-user:
 *    post:
 *        tags: [User]
 *        description: Ingreso de usuario, genera un token si el usuario existe
 *        requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                    lastName:
 *                      type: string
 *                    nickname:
 *                      type: string
 *                    birthday:
 *                      type: string
 *                    rol:
 *                      type: string
 *                    image:
 *                      type: File
 *        responses:
 *          200:
 *            description: Información aceptada
 *          400:
 *            description: Bad request
 */
const bindNewUser = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.send({ errors: errs.array() });
  }
  const mongo = await getMongoConnection();
  const query = { _id: new ObjectId(req._id) };
  const data = { ...req.body }
  data.birthday = new Date(data.birthday);
  const update = {
    $set: { ...data, profileImage: req.file ? req.file.filename : null, subscribedTo: [] },
  };
  const result = await mongo.collection("Users").updateOne(query, update);
  if (result) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }
};

const getUser = async (req, res) => {
  const mongo = await getMongoConnection();
  const options = {
    projection: {
      _id: 0,
      password: 0,
    },
  };
  const user = await mongo
    .collection("Users")
    .findOne({ _id: new ObjectId(req._id) }, options);
  return res.json(user);
};

module.exports = {
  bindNewUser,
  getUser,
};
