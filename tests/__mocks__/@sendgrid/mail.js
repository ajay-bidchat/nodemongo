module.exports = {
    setApiKey(apikey) {
        console.log(apikey);
    },

    send(msg) {
        return Promise.resolve(msg);
    }
}