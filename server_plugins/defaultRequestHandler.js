


exports.onStart = function(server,logger) {



    let maintance = false
    let fs = require("fs")
    let acceptedIndexTypes = [".html",
        ".jsx",
        ".mp4",
        ".mp3",
        ".txt",
        ".fhtc"
    ]

    server.rateLimit = 5
    server.rateLimited = {
        "46.107.31.191": 87263628743687432343,
    }
    global.server = server

    setInterval(function() {
        for (let lit in server.rateLimited) {

            if (server.rateLimited[lit] >= 0.1) {
                server.rateLimited[lit] =server.rateLimited[lit]-0.1
            } else {
                server.rateLimited[lit] = 0
            }
        }
    },100)


    let ipban = ["::ffff:69.4.89.106","::ffff:37.252.5.88","::ffff:93.119.227.19"]

    var errors = {404: "The requested resource cannot be found on this server.",403: "Access has been denied for the requested resource.",502: "Gateway error occured!","default": "An error has occured.",429: "You have been rateLimited.",500: "Internal server error"}

    server.displayError = function(errorCode, request, response, addInfo) {
        response.write("<h1>ExtraServer</h1 style='margin: 5px'><hr><h2 style='margin: 0px'>Error code: "+errorCode+"</h2>")

        if (!(errorCode in errors)) {
            response.write("<h1 style='margin: 0px'>"+errors.default+"</h1>")
        } else {
            response.write("<h1 style='margin: 0px'>"+errors[errorCode]+"</h1>")
        }
        if (typeof addInfo != "undefined") {
            response.write("<h3 style='margin: 0px'>Additional info: "+addInfo+"</h3>")
        }
        response.end(`
        
        <hr>
        <h5>ExtraServer systems -- error page!</h5>
        
        `)
    }

    logger.info("DefaultRequestHandler was made by BomberPlayz.")
    server.requestHandler = function(request, response) {
      try {
        logger.info(request.connection.remoteAddress+" requested to "+request.url)
          if (ipban.includes(request.connection.remoteAddress)) {
              logger.warn("That IP is IPBANNED!!!")
              server.displayError(403, request, response)
              return

          }

          if (typeof server.rateLimited[request.connection.remoteAddress] == "undefined") {

              server.rateLimited[request.connection.remoteAddress] = 0
          } else {

              server.rateLimited[request.connection.remoteAddress] = server.rateLimited[request.connection.remoteAddress] + 0.1

          }

          if (server.rateLimited[request.connection.remoteAddress] > server.rateLimit && request.connection.remoteAddress != "::ffff:127.0.0.1") {
              logger.warn(request.connection.remoteAddress+" has been rateLimited!")
              server.displayError(429, request, response, "RateLimit count - "+server.rateLimited[request.connection.remoteAddress])
              return
          }
        let url = require("url")
        let process = require("process")
        let defdir = __dirname


    
        let getType = function(fext) {
            let types = {
                ".html": "text/html",
                ".js": "application/javascript",
                ".mp4": "video/mp4",
                ".css": "text/css",
                ".png": "media/png",
                ".svg": "media/svg"
            }
            let typer = "text/plain"
            for (let type in types) {
               // logger.info("check: " + type)
                if (type == fext) {
                    //logger.info("yes: " + type)
                    return types[type]
                }
            }
            return typer
        }

        let asd = request.url.split("?")



        let run = "???"
        request.urla = asd[0]
        let pathar = require("path")
        if (fs.existsSync("." + request.urla)) {} else {
            response.writeHeader(404, {
                'Content-Type': 'text/html'
            })
            server.displayError(404,request,response)
            logger.warn("Requested file not found: "+request.urla)
            return
        }
        if (fs.lstatSync("." + request.urla).isDirectory()) {
            //logger.info("check : dir : true")
            if (request.urla.substr(request.urla.length - 1) != "/") {
                request.urla = request.urla + "/"
            }
            for (let i = 0; i < acceptedIndexTypes.length; i++) {
              //  logger.debug("check : " + acceptedIndexTypes[i] + " : path : ./public" + request.urla + "index" + acceptedIndexTypes[i]);
                if (fs.existsSync("." + request.urla + "index" + acceptedIndexTypes[i])) {
                   // logger.info("redir : true")
                    response.writeHeader(302, {
                        'Location': "" + request.urla + "index" + acceptedIndexTypes[i]
                    })
                    response.end()

                    return;
                }
            }
            response.writeHeader(200, {
                'Content-Type': 'text/html'
            })


            response.write('<meta charset="utf-8"><h1>Directory items</h1><hr>')
            let file = "." + request.url
            fs.readdir("." + request.url, function(err, files) {
                if (err) {
                    throw err;
                }

                // files object contains all files names
                // log them on console
                files.forEach(filet => {
                    if (fs.statSync(file + "/" + filet).isDirectory()) {
                        response.write(`<a href="${"/"+file+"/"+filet}">📁 ${filet}</a><br>`)
                    } else {
                        response.write(`<a href="${"/"+file+"/"+filet}">📰 ${filet}</a><br>`)
                    }

                });
                response.end()

            });


        } else {
            if (fs.lstatSync("." + request.urla).isFile()) {
                var path = "." + request.urla
                var patha = require('path')
                var stat = fs.statSync(path);
                var total = stat.size;

                if (request.headers['range']) {
                    var range = request.headers.range;
                    logger.info("range>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + range);
                    var total = fs.statSync(path).size;
                    splitq = range.split(/[-=]/),
                        start = +splitq[1],
                        end = splitq[2] ? +splitq[2] : total - 1,
                        chunkSize = end - start + 1;

                    var start = parseInt(start, 10);
                    var end = end ? parseInt(end, 10) : total - 1;
                    var chunksize = (end - start) + 1;
                    logger.info('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);


                    if (maintance) {
                        path = "./gandalf.mp4"
                    }
                    var file = fs.createReadStream(path, {
                        start: start,
                        end: end
                    });

                    response.writeHead(206, {
                        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': getType(patha.extname("." + request.urla))
                    });
                    server.rateLimited[request.connection.remoteAddress] = server.rateLimited[request.connection.remoteAddress] + 2
                    file.pipe(response);

                } else {
                    if (patha.extname("./public/" + request.urla) == ".jsx" || request.urla.includes("dekstop") && patha.extname("./public/" + request.urla) == ".js" || request.urla.includes("windowloader")) {
                        let fi = require("../public" + request.urla)
                        delete require.cache[require.resolve("../public" + request.urla)]
                        //logger.info(fi);
                        var quka = url.parse(request.url, true).query;
                        //response.writeHeader(202, {"Content-Type": "text/html"});
                        try {
                            fi.run(request, response, quka, fs)
                        } catch (e) {
                            logger.info(e);
                            response.end(e)
                        }
                    } else {
                        response.writeHead(200, {
                            'Content-Type': getType(patha.extname("." + request.urla))
                        });
                        if (getType(patha.extname("." + request.urla)) == "text/html") {
                            /*response.write(`<script>function onReady(callback) {
  var intervalId = window.setInterval(function() {
    if (document.getElementsByTagName('body')[0] !== undefined) {
      window.clearInterval(intervalId);
      callback.call(this);
    }
  }, 1000);
}

function setVisible(selector, visible) {
  document.querySelector(selector).style.display = visible ? 'block' : 'none';
}

onReady(function() {
  setVisible('.page', true);
  setVisible('#loading', false);
});</script><div id="loading">

<div id="loading" class="lds-ring">

<style>.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

</div>`)*/
                        }
                        var file = fs.createReadStream(path, {});
                        file.pipe(response);


                    }
                }

                //response.end(fs.readFileSync("."+request.url))
            } else {
                response.writeHeader(404, "File not found")
                response.end("nene")

            }
        }
      } catch(e) {
        logger.error("An error occured while loading a file: "+e)
          server.displayError(500, request, response, e.toString())

      }
    }
}
