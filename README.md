Must have node and npm installed.

Run npm install to get the required dependencies.

Then use nodejs server.js to run the server


If you want to use server specific config to override constants provide a file like that of config/dev.json.

Then run the server in one of the 2 ways (note it does not include the .json extension)
NODE_ENV=dev node server.js
OR
node server.js dev