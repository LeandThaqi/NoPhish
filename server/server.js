const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const spawn = require("child_process").spawn;
const { linkType, get } = require("get-content");
const { json } = require('body-parser');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "1800");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods","POST");
  next();
});
app.use(bodyParser.json());

app.post('/detectphishing', function(request, response) {
  console.log('POST /');
  console.dir(request.body);
      const url = request.body.url;
      console.log('==================')
      if(url.includes('chrome://')){
        dataResponse = {error:'ERROR_NEWTAB'}
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(dataResponse));
      }
      else{

        get(url).then((pageContent) => {
          fs.writeFileSync('../innerHTML.txt',pageContent)
          const pythonProcess = spawn('python',["../main.py",url]);
          pythonProcess.stdout.on('data', (data) => {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(data.toString('utf8'));
          });
       
        }).catch((err) => {
          console.warn(err); 
          response.writeHead(200, {'Content-Type': 'application/json'});
          dataResponse={error:'SOMETHING_WENT_WRONG'}
          response.end(JSON.stringify(dataResponse));
        });
      }
});

port = 3000;
app.listen(port);
console.log(`Listening at http://localhost:${port}`);