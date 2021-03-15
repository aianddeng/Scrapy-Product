const timeLogger = () => {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`Process ${ctx.method} ${ctx.url} ${ms}ms`);
    }
}

module.exports = timeLogger;