const timeOutFuncTime = require("./helper");

const asyncNameTime = async (name, time) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(`Name is ${name}`);
        }, time);
    });
}

// const MyWait = (func, time) => {
//     setTimeout(func, time);
// }

module.exports = { asyncNameTime, timeOutFuncTime };