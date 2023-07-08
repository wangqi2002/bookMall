function createRandomString(len) {
    len = len - 13;
    let id = new Date().getTime() + Math.random().toString(36).substring(2, 2 + len);
    return id;
}

module.exports = { createRandomString }