const jwtMw = require('./jwt');

module.exports = {
    notFound: (_, res) => res.status(404).send(),
    generalFilterException: (error) => {
        process.on('uncaughtException', () => res.sendStatus(500));
        process.on('unhandledRejection', () => res.sendStatus(500));
    },
    ...jwtMw,
}