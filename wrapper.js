var async = require('async');

// Wrap async methods inside a promise
function wrapAsyncMethod(fn, ctx) {
    return function() {
        // Obtain function arguments
        var args = [].slice.call(arguments);

        // Return a thunkified function that receives a done callback
        return new Promise(function(resolve, reject) {
            // Add a custom callback to provided args
            args.push(function(err, result) {
                // Failed?
                if (err) {
                    return reject(err);
                }

                // Success
                resolve(result);
            });

            // Call original function
            fn.apply(ctx, args);
        });
    };
}

// Wraps an async object with co-friendly functions
function wrapAsync() {
    // Traverse async methods
    for (var fn in async) {
        // Thunkify the method
        async[fn] = wrapAsyncMethod(async[fn], async);
    }

    // Return co-friendly async object
    return async;
}

// Expose the wrapped object
module.exports = wrapAsync(async);