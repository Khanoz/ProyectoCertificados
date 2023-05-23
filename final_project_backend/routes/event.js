const { getMongoConnection } = require("../mongo");
const { validationResult } = require("express-validator");
const utils = require("./utils");
const { ObjectId } = require("mongodb");

const upsertEvent = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.send({ errors: errs.array() });
  }
  const mongo = await getMongoConnection();
  const query = {
    _id: req.params.eventId ? new ObjectId(req.params.eventId) : new ObjectId(),
  };
  const options = { upsert: true };
  const content = { ...req.body };
  content.date = new Date(content.date);
  content.capacity = parseInt(content.capacity);
  const update = {
    $set: {
      ...content,
      host: new ObjectId(req._id),
      images: req.files ? req.files.map((v) => v.filename) : null,
      guests: [],
    },
  };
  const result = await mongo
    .collection("Events")
    .updateOne(query, update, options);
  if (result) {
    return res.json({ event_id: req.params.eventId || result.upsertedId });
  } else {
    return res.sendStatus(400);
  }
};

const getEvent = async (req, res) => {
  const mongo = await getMongoConnection();
  const options = {
    projection: {
      _id: 0,
    },
  };
  const event = await mongo
    .collection("Events")
    .findOne({ _id: new ObjectId(req.params.eventId) }, options);
  if (event) {
    return res.json(event);
  } else {
    return res.sendStatus(204);
  }
};

const deleteEvent = async (req, res) => {
  const mongo = await getMongoConnection();
  const deletionResult = await mongo
    .collection("Events")
    .deleteOne({ _id: new ObjectId(req.params.eventId) });

  if (deletionResult.deletedCount) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(204);
  }
};

const subscribeUserToEvent = async (req, res) => {
  const mongo = await getMongoConnection();

  // Comprueba capacidad del evento
  const event = await mongo
    .collection("Events")
    .findOne({ _id: new ObjectId(req.params.eventId) });
  if (!event) {
    return res.sendStatus(400);
  }

  if (event.guests.length >= event.capacity) {
    const err = utils.errorResponseTemplate;
    err.message = "Capacidad máxima alcanzada";
    return res.status(409).json(err);
  }

  // Subscribe al usuario en evento
  const eventQuery = { _id: new ObjectId(req.params.eventId) };
  const updateEvent = {
    $push: {
      guests: new ObjectId(req._id),
    },
  };
  const eventResult = await mongo
    .collection("Events")
    .updateOne(eventQuery, updateEvent);
  if (!eventResult.modifiedCount) {
    return res.sendStatus(400);
  }

  // Subscribe al evento en el usuario
  const userQuery = { _id: new ObjectId(req._id) };
  const updateUser = {
    $push: {
      subscribedTo: new ObjectId(req.params.eventId),
    },
  };
  const userResult = await mongo
    .collection("Users")
    .updateOne(userQuery, updateUser);
  if (!userResult.modifiedCount) {
    return res.sendStatus(400);
  }

  return res.sendStatus(204);
};

const unsubscribeUserToEvent = async (req, res) => {
  // Desubscribe al usuario en evento
  const mongo = await getMongoConnection();
  const eventQuery = {
    _id: new ObjectId(req.params.eventId),
    guests: new ObjectId(req._id),
  };
  const updateEvent = {
    $pull: {
      guests: new ObjectId(req._id),
    },
  };
  const eventResult = await mongo
    .collection("Events")
    .updateOne(eventQuery, updateEvent);
  if (!eventResult.modifiedCount) {
    return res.sendStatus(400);
  }

  // Desubscribe al evento en el usuario
  const userQuery = {
    _id: new ObjectId(req._id),
  };
  const updateUser = {
    $pull: {
      subscribedTo: new ObjectId(req.params.eventId),
    },
  };
  const userResult = await mongo
    .collection("Users")
    .updateOne(userQuery, updateUser);
  if (!userResult.modifiedCount) {
    return res.sendStatus(400);
  }

  return res.sendStatus(204);
};

const getUpcomingEvents = async (req, res) => {
  const mongo = await getMongoConnection();
  const eventQuery = {
    date: {
      $gte: new Date(),
    },
  };
  const pipeline = [
    { $match: eventQuery },
    { $skip: parseInt(req.query.o) || 0 }, // Offset
    { $limit: parseInt(req.query.l) || 9 },
    { $sort: { date: 1 } },
  ];
  const eventResult = await mongo
    .collection("Events")
    .aggregate(pipeline)
    .toArray();
  if (!eventResult) {
    return res.sendStatus(400);
  } else {
    res.json(eventResult);
  }
};

const getHottestEvent = async (req, res) => {
  const mongo = await getMongoConnection();
  const eventQuery = {
    guests: {
      $not: {
        $size: 0,
      },
    },
  };
  const pipeline = [
    { $match: eventQuery },
    { $sort: { guests: -1 } },
    { $limit: 1 },
  ];
  const eventResult = await mongo
    .collection("Events")
    .aggregate(pipeline)
    .toArray();
  if (!eventResult) {
    return res.sendStatus(204);
  } else {
    res.json(eventResult[0]);
  }
};

const getCloseDateEvents = async (req, res) => {
  const mongo = await getMongoConnection();
  const pipeline = [
    { $match: { date: { $gte: new Date() } } },
    {
      $project: {
        dayDiff: {
          $dateDiff: {
            startDate: new Date(),
            endDate: "$date",
            unit: "day",
          },
        },
        name: 1,
        date: 1,
        images: 1,
        host: 1,
        description: 1,
        capacity: 1,
        place: 1,
      },
    },
    { $match: { dayDiff: { $lte: 7 } } },
  ];
  const closeDateEvents = await mongo
    .collection("Events")
    .aggregate(pipeline)
    .toArray();
  if (!closeDateEvents) {
    return req.sendStatus(400);
  } else {
    return res.json(closeDateEvents);
  }
};

const getAdquiredEvents = async (req, res) => {
  const mongo = await getMongoConnection();
  const pipeline = [
    { $match: { _id: new ObjectId(req._id) } },
    { $project: { _id: 0, subscribedTo: 1 } },
  ];
  const subscribedEventsIds = await mongo
  .collection("Users")
  .aggregate(pipeline)
  .toArray();
  if(!subscribedEventsIds){
    return res.sendStatus(400);
  }
  const searchEvents = subscribedEventsIds[0].subscribedTo.map(v => new ObjectId(v));
  const query =  { _id : { $in : searchEvents} }
  const subscribedEvents = await mongo.collection("Events").find(query).toArray();
  return res.json(subscribedEvents);
};

const getEventByName = async (req, res) => {
  const mongo = await getMongoConnection();
  const query =  { name : { $regex : req.query.q || ""} }
  const results = await mongo.collection("Events").find(query).toArray();
  return res.json(results);
};

module.exports = {
  upsertEvent,
  getEvent,
  deleteEvent,
  subscribeUserToEvent,
  unsubscribeUserToEvent,
  getUpcomingEvents,
  getHottestEvent,
  getCloseDateEvents,
  getAdquiredEvents,
  getEventByName
};
