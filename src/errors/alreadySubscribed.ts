export class AlreadySubscribedError extends Error {
    constructor() {
        super("streams client is already subscribed to a set of topics");
    }
}
