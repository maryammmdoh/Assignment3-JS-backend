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
            const { Email } = body;
            // Check if user with the same email already exists
            const user = users.find((data) => {
                return Email == data.Email;
            });

            // If user exists, return an error response
            if (user) {
                res.writeHead(400,{"Content-Type":"application/json"});
                res.write('{"message": "User Already Exist"}');
                return res.end();
            }
            // If user does not exist, add the new user to the users array
            users.push(body);
            // Write the updated users array back to the JSON file
            fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(users) , "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write('{"message": "User Added Successfully"}');
            return res.end();
        });
    }
    // updates an existing user's name, age, or email by their ID
    else if(url.includes("/Updateuser") && method == "PATCH") {
        let body = "";
        //Be sure to collect all the data
        req.on("data", (chunk) => (body += chunk));
        // Collect all data from the request and then process it
        req.on("end", () => {
            // Parse the received data
            body = JSON.parse(body);
            const { Email, Password, Age } = body;
            // Extract ID from URL
            const id = url.split("/")[2];
            // Find the index of the user with the given ID
            const user = users.find((value) => value.ID == id);
            if(!user) {
                res.writeHead(400,{"content-type" : "application/json"});
                res.write(JSON.stringify({message : "User ID Not Found"}));
                return res.end();
            }
            // Update user details
            if(Email) user.Email = Email;
            if(Password) user.Password = Password;
            if(Age) user.Age = Age;

            // Write the updated users array back to the JSON file
            fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(users) , "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write('{"message": "User Updated Successfully"}');
            return res.end();
        })
    } 
    // Delete a user by ID
    else if(url.includes("/Deleteuser") && method == "DELETE") {
        // Extract ID from URL
        const id = url.split("/")[2];
        const userIndex = users.findIndex((value) => value.ID == id);
        if(userIndex == -1) {
            res.writeHead(400,{"content-type" : "application/json"});
            res.write(JSON.stringify({message : "User ID Not Found"}));
            return res.end();
        }
        // Splice user to delete user
        users.splice(userIndex,1);
        fs.writeFileSync(path.resolve(usersFilePath), JSON.stringify(users) , "utf-8");
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
    // Get user by ID
    else if (url.includes("/Getuserbyid") && method == "GET") {
        // Extract ID from URL
        const id = url.split("/")[2];
        const user = users.find((value) => value.ID == id);
        if(!user) {
            res.writeHead(400,{"content-type" : "application/json"});
            res.write(JSON.stringify({message : "User ID Not Found"}));
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
