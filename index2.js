const http = require("http");
const { parse } = require("querystring");
var multipart = require("parse-multipart");

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    collectRequestData(req, result => {
      console.log(result);
      res.end(`Parsed data belonging to ${result.fname}`);
    });
  } else {
    res.end(`
            <!doctype html>
            <html>
            <body>
                <form action="/" method="post" enctype="multipart/form-data" >
                    <input type="text" name="fname" /><br />
                    <input type="number" name="age" /><br />
                    <input type="file" name="photo" /><br />
                    <button>Save</button>
                </form>
            </body>
            </html>
        `);
  }
});
server.listen(3000);

function collectRequestData(request, callback) {
  //   const FORM_URLENCODED = "application/x-www-form-urlencoded";
  const FORM_URLENCODED = "multipart/form-data";
  if (request.headers["content-type"].split(";")[0] === FORM_URLENCODED) {
    var body;
    request.on("data", chunk => {
      if (body == undefined) {
        body = chunk;
      } else {
        body = Buffer.concat([body, chunk]);
      }
    });
    request.on("end", () => {
      var boundary = request.headers["content-type"]
        .split(";")[1]
        .split("=")[1];

      callback(parse(body));
    });
  } else {
    callback(null);
  }
}
