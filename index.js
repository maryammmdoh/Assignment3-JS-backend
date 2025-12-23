// Part2: Simple CRUD Operations Using HTTP: For all the following APIs, you must use the fs module to read and write data from a JSON file (e.g., users.json).
// Do not store or manage data using arrays.
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const http = require("http");
const fs = require("fs");
const path = require("path");
const users = require("./users.json");
const usersFilePath = path.resolve("./users.json")

const server = http.createServer((req, res) => {
    const { url, method } = req;
    // Add New User
    if (url == "/Adduser" && method == "POST") {
        let body = "";
        //Be sure to collect all the data
        req.on("data", (chunk) => (body += chunk));

        // Collect all data from the request and then process it
        req.on("end", () => {
            // Parse the received data
            body = JSON.parse(body);
            const { email } = body;
            // Check if user with the same email already exists
            const user = users.find((data) => {
                return email == data.email;
            });

            // If user exists, return an error response
            if (user) {
                res.writeHead(400,{"Content-Type":"application/json"});
                res.write('{"message": "User Already Exist"}');
                return res.end();
            }

            let newID = 1;
            if(users.length > 0) {
                const lastUser = users.reduce((max, user) => {
                    const userID = parseInt(user.id);
                    return userID > max ? userID : max;
                }, 0);
                newID = lastUser + 1;
            }
            const newUser = { id: newID, ...body };
            // If user does not exist, add the new user to the users array
            users.push(newUser);
            // Write the updated users array back to the JSON file
            // fs.writeFile(usersFilePath, JSON.stringify(users) );
            fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Failed to save user" }));
                    return;
                }
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: "User Added Successfully", user: newUser }));
            return res.end();
        });
    }
    // updates an existing user's name, age, or email by their id
    else if(url.includes("/Updateuser/") && method == "PATCH") {
        let body = "";
        //Be sure to collect all the data
        req.on("data", (chunk) => (body += chunk));
        // Collect all data from the request and then process it
        req.on("end", () => {
            // Parse the received data
            body = JSON.parse(body);
            const { email, password, age } = body;
            // Extract id from URL
            const id = url.split("/")[2];
            // Find the index of the user with the given id
            const user = users.find((value) => value.id == id);
            if(!user) {
                res.writeHead(400,{"content-type" : "application/json"});
                res.write(JSON.stringify({message : "User id Not Found"}));
                return res.end();
            }

            // Check if the new email already exists for another user 
            if(email && users.some((user,index) => user.email === email && index !== id)) {
                res.writeHead(404,{"content-type" : "application/json"});
                res.write(JSON.stringify({message : "Email already exists"}));
                return res.end();
            }

            // Update user details
            if(email) user.email = email;
            if(password) user.password = password;
            if(age) user.age = age;

            // Write the updated users array back to the JSON file
            fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Failed to save user" }));
                    return;
                }
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: "User Updated Successfully", user: user }));
            return res.end();
        })
    } 
    // Delete a user by id
    else if(url.includes("/Deleteuser/") && method == "DELETE") {
        // Extract id from URL
        const id = url.split("/")[2];
        const userIndex = users.findIndex((value) => value.id == id);
        if(userIndex == -1) {
            res.writeHead(400,{"content-type" : "application/json"});
            res.write(JSON.stringify({message : "User id Not Found"}));
            return res.end();
        }
        // Splice user to delete user
        users.splice(userIndex,1);
        fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Failed to save user" }));
                    return;
                }
            });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "User deleted successfully", users: users }));
        return res.end();
    }
    // Get all users
    else if (url == "/Getusers" && method == "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "All users retrieved successfully", users: users }));
        return res.end();
    }
    // Get user by id
    else if (url.includes("/Getuserbyid/") && method == "GET") {
        // Extract id from URL
        const id = url.split("/")[2];
        const user = users.find((value) => value.id == id);
        if(user == -1 || !user) {
            res.writeHead(400,{"content-type" : "application/json"});
            res.write(JSON.stringify({message : "User id Not Found"}));
            return res.end();
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "User retrieved successfully", user: user }));
        return res.end();
    }
    // If no route matches, return 404
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write('{"message": "Page Not Found"}');
        res.end();
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port :: ${PORT}`);
});

server.on("request", (err) => {
    console.log(err.message);

    if (err.code == "EADDRINUSE") {
        ++PORT;
        server.listen(PORT);
    }
});
