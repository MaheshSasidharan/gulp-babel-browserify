import * as appMethods from "./app";

const arrMap = require("arr-map");

(
    async () => {
        let ans = await appMethods.asyncNameTime("A", 1000);
        console.log(ans);
        ans = appMethods.asyncNameTime("Bb", 1500);
        
        
        arrMap([11,22,33], (item) => {
            console.log(`Array value: ${item}`);
        });
        const foo = () => console.log("from foo");
        appMethods.timeOutFuncTime(foo, 1000);

        console.log(await ans);

        const set = new Set();
        set.add(1);
        set.add(2);
        console.log(set);
    }
)();