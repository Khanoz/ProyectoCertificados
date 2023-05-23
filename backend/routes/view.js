const { getMongoConnection } = require("../mongo");

const getUserRols = async (_, res) => {
  const mongo = await getMongoConnection();
  const {values} = await mongo.collection("FrontConfigs").findOne({ _id: "User Rol" });
  return res.json(values);
};

module.exports = { getUserRols };
