// Part1: Core Modules
//---------------------
/*
    1. Use a readable stream to read a file in chunks and log each chunk. 
        • Input Example: "./big.txt"
        • Output Example: log each chunk
*/

// const fs = require('fs');
// const path = require('path');
// const filepath = path.resolve("./data.txt");
// const readableStream = fs.createReadStream(filepath, { encoding: 'utf-8', highWaterMark: 16 });
// readableStream.on('data', (chunk) => {
//     console.log('---- New Chunk ----');
//     console.log(chunk);
// });

//------------------------------------------------------------------------------------------------------------------------

/*
    2. Use readable and writable streams to copy content from one file to another.
        • Input Example: "./source.txt", "./dest.txt"
        • Output Example: File copied using streams
*/

// const fs = require('fs');
// const path = require('path');
// const sourcePath = path.resolve("./source.txt");
// const destPath = path.resolve("./dest.txt");
// const readableStream = fs.createReadStream(sourcePath , { encoding: 'utf-8'});
// const writableStream = fs.createWriteStream(destPath , { encoding: 'utf-8'});
// readableStream.pipe(writableStream);
// writableStream.on('finish', () => {
//     console.log('File copied using streams');
// });

//------------------------------------------------------------------------------------------------------------------------

/*
    3. Create a pipeline that reads a file, compresses it, and writes it to another file.
        • Input Example: "./data.txt", "./data.txt.gz"
*/

// const fs = require('fs');
// const path = require('path');
// const zlib = require('zlib');
// const sourcePath = path.resolve("./data.txt");
// const destPath = path.resolve("./data.txt.zip");
// const readableStream = fs.createReadStream(sourcePath);
// const writableStream = fs.createWriteStream(destPath);
// const gzip = zlib.createGzip();
// readableStream.pipe(gzip).pipe(writableStream);
// writableStream.on('finish', () => {
//     console.log('File compressed and written to data.txt.zip');

//     //decompression the destpath file deta.txt.zip to data_unzipped.txt for verification only
//     // const unzipDestPath = path.resolve("./data_unzipped.txt");
//     // const unzipReadableStream = fs.createReadStream(destPath);
//     // const unzipWritableStream = fs.createWriteStream(unzipDestPath);
//     // const gunzip = zlib.createGunzip();
//     // unzipReadableStream.pipe(gunzip).pipe(unzipWritableStream);
//     // unzipWritableStream.on('finish', () => {
//     //     console.log('File decompressed and written to data_unzipped.txt');
//     // });
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    Part3: Node Internals (3 Grades):
        1. What is the Node.js Event Loop?
            Answer:
                The event loop is a fundamental part of Node.js architecture that enables non-blocking I/O operations and allows Node.js to handle multiple requests concurrently. 
                It is responsible for managing the execution of asynchronous operations and ensuring that the main thread remains responsive.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        2. What is Libuv and What Role Does It Play in Node.js?
            Answer:
                Libuv is a C library that provides the underlying event-driven architecture for Node.js. 
                It is responsible for handling asynchronous I/O operations, including file system operations, networking, and timers. 
                It's role is to provide a consistent and efficient way to handle these operations across different operating systems.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        3. How Does Node.js Handle Asynchronous Operations Under the Hood?
            Answer:
                - When the application starts, the event loop is initialized.
                - The setTimeout function schedules a callback to be executed after 3 seconds.
                - The fs.readFile function initiates an asynchronous file read operation. When the file is read, its callback is placed in the callback queue.
                - Inside the file read callback, another setTimeout is scheduled to log the file content after 2 seconds, and a setInterval is set up to log a message every 2 seconds.
                - The HTTP server is created and starts listening for incoming requests.
                - The event loop continuously checks for completed operations and executes their callbacks, allowing all these operations to run concurrently without blocking the main thread.
                    Code is runing in while loop with condation to check the event loop phases. which is timersOperations.length != 0 , longRunningOperations.length != 0 , OS Operations.length != 0
                    while ( timersOperations.length != 0 || longRunningOperations.length != 0 || OS Operations.length != 0 ) // the While loop will run until there is no operation left to process when all are false
                    {
                        Insilde the while loop there are multiple phases of event loop which will check each operation one by one in a cyclic manner.
                        1 - chech any timer ready to execute or finished (setTimeout , setInterval)
                        2 - check any timer long running operation finished and OS operations (fs, network , crypto etc)
                        3 - await
                        4 - check Immediate operations
                        5 - Check Close events
                        6 - Repeat the loop (next tick (next iteration of while loop) )
                    }
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
            Answer:
                - Call Stack: The call stack is a data structure that keeps track of the function calls in a program. 
                            It operates on a Last In First Out (LIFO) basis, meaning the last function added to the stack is the first one to be executed. 
                            When a function is called, it is pushed onto the stack, and when it returns, it is popped off the stack.
                
                - Event Queue: The event queue, also known as the callback queue, is a data structure that holds the callbacks of asynchronous operations that are ready to be executed. 
                            When an asynchronous operation completes, its callback is added to the event queue. The event loop continuously checks the event queue and moves callbacks to the call stack when it is empty.
                
                - Event Loop: The event loop is a mechanism that continuously monitors the call stack and the event queue. 
                            Its primary role is to ensure that the call stack is empty before moving callbacks from the event queue to the call stack for execution. 
                            This allows Node.js to handle asynchronous operations efficiently without blocking the main thread.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?
            Answer:
                The Node.js thread pool is a collection of threads that are used to handle asynchronous operations that cannot be performed in a non-blocking manner, such as file system operations, DNS lookups, and cryptographic functions. 
                By default, the thread pool size is set to 4, but it can be adjusted by setting the UV_THREADPOOL_SIZE environment variable before starting the Node.js application. 
                To set the thread pool size to 8, you can use the following command in the terminal:
                UV_THREADPOOL_SIZE=8 node app.js
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?
            Answer:
                Node.js runs JavaScript on a single thread. However, some tasks (like file I/O or cryptography) are too "heavy" or synchronous for the operating system to handle in a truly non-blocking way.
                When Node.js encounters these specific tasks, it hands them off to the libuv thread pool a set of background threads (usually 4 by default) that operate outside the main loop.
                While a worker thread in the pool is busy the main Event Loop remains free to handle new user requests and execute other JavaScript code.
                Once the worker thread finishes its job, it signals the Event Loop and places the result into the Task Queue.
                When the main thread's call stack is empty, the Event Loop picks up that completed task and executes the associated callback, returning the result to your application
*/