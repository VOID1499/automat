import { handler } from "./index.js";

import type { Context } from "aws-lambda";

const main = async () => {
    const event = {};

    const result = await handler(
        event,
        {} as Context,
        () => {}
    );

    console.log("Resultado:", result);
};

main().catch(console.error);