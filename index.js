const http = require('http');
const fs = require('fs');
const path = require('path'); // Add the path module

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Serve the HTML file
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(`Error loading HTML file: ${err}`);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/createFolder') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            try {
                const { folderName } = JSON.parse(body);
                if (!folderName) {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Folder name cannot be empty');
                } else {
                    const folderPath = path.join(__dirname, folderName);
                    fs.mkdir(folderPath, (err) => {
                        if (err) {
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.end(`Error creating folder: ${err}`);
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(`Folder "${folderName}" created successfully`);
                        }
                    });
                }
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Invalid JSON data');
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
