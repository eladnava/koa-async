// Change to 'koa-async' to use this code outside of the package
var async = require('../');

// Create sample app
var app = require('koa')();

// Sample middleware
app.use(function* () {
    // A sample list of items to process
    var items = [1, 2, 3];
    
    // Example 1: Batch-processing items in parallel
    yield async.each(items, function(item, cb) {
        // Call this when done processing the current item
        cb();
    });
    
    // The following will output only after the items are done processing in parallel
    console.log('[Test]', 'async.each:', 'done');
    
    // Example 2: Filtering items in parallel
    var filter = yield async.filter(items, function(item, cb) {
        // Filter out items that are not equal to 2
        cb(null, item === 2);
    });
    
    // The following will output [2]
    console.log('[Test]', 'async.filter:', filter);
    
    try {
        // Example 3: Error handling in an async function
        yield async.each(items, function(item, cb) {
            // Purposely fail on the last item
            if (item == 3) {
                // Invoking the callback with an error will cause
                // the control flow to shift to the catch block
                cb('This is a test error message.');
            }
        });
    }
    catch (err) {
        // One of the items invoked the callback with an error
        console.log('[Test]', 'async.error:', err);
    }
    
    // Use any other async function as documented in the async repo:
    // https://github.com/caolan/async
    // Just make sure to strip out the last callback function in each
    // method -- koa-async adds its own callback function on your behalf
});

// HTTP port
var port = process.env.PORT || 3000;

// Listen for connections
app.listen(port);

// Log port
console.log('Server listening on port ' + port);