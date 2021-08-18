let path = require('path');
const colors = require('colors');
function _getCallerFile() {
  var filename;

  var _pst = Error.prepareStackTrace
  Error.prepareStackTrace = function (err, stack) { return stack; };
  try {
    var err = new Error();
    var callerfile;
    var currentfile;

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if(currentfile !== callerfile) {
        filename = callerfile;
        break;
      }
    }
  } catch (err) {}
  Error.prepareStackTrace = _pst;
  if(filename == "node:events") {
    filename = "EVENT"
  }
  if(filename == "node:internal/modules/cjs/loader") {
    filename = "MAIN"
  }
  return filename == "node:internal/modules/cjs/loader" ? "MAIN" : path.basename(filename).split(".")[0];
}


global.nodelog = {

}

nodelog.getLogger = function(what,...wats) {

  let obj = {}
  obj.filename = _getCallerFile()
  obj.logLevel = 5
  obj.getLogger = function(llog,wat) {
    if (typeof wat == "undefined") {
      wat = llog
    }
    let toret
    if (obj.wa2 != "MAIN") {
      toret = nodelog.getLogger(what,obj.wa2,wat)
    } else {
      toret = nodelog.getLogger(what,wat)
    }


    toret.filename = obj.filename;
    return toret
  }
  let wa2 = ""

  for (let i=0; i<wats.length; i++) {

    let per = i < wats.length - 1 ? "/" : ""
    wa2 = wa2 + wats[i] + per
  }

  if (wa2 == "") {
    wa2 = "MAIN"
  }
  obj.wa2 = wa2
  let wawa
  if (typeof what != "undefined") {
    wawa = (" ["+what+"/"+obj.wa2+"]"+"").green
  } else {
    wawa = ""
  }


  obj.debug = function(data) {
    if (obj.logLevel >= 5) {
      process.stdout.write("[".cyan+obj.filename.cyan+"/DEBUG]".cyan+""+wawa+" > "+String(data)+"\n")
    }

  }
  obj.info = function(data) {
    if (obj.logLevel >= 4) {
      process.stdout.write("[".blue + obj.filename.blue + "/INFO]".blue + "" + wawa + " > " + String(data) + "\n")
    }
  }
  obj.warn = function(data) {
    if (obj.logLevel >= 3) {
      process.stdout.write("[".yellow+obj.filename.yellow+"/WARN]".yellow+""+wawa+" > "+String(data)+"\n")
    }

  }
  obj.error = function(data) {
    if (obj.logLevel >= 2) {
      process.stdout.write("[".red+obj.filename.red+"/ERROR]".red+""+wawa+" > "+String(data)+"\n")
    }

  }
  obj.fatal = function(data) {
    if (obj.logLevel >= 1) {
      process.stdout.write("[".magenta+obj.filename.magenta+"/FATAL]".magenta+""+wawa+" > "+String(data)+"\n")
    }

  }
  obj.log = obj.info
  return obj
}


const { fstat } = require('fs');
const http = require('http');
console.log("Loading libraries...")
var log4js = require("log4js");
var dirDo = require("./libaries/dirList.js")
dirDo.dirRun("./libaries/",function(file) {
  console.log("Loading libary "+file)
  try {
    let path = require("path")
    let fule = path.dirname(file)
    let falat = file.replace(fule+"/","")
    let folot = falat.replace(".js","")

    global[folot] = require(file)
    console.log("Loaded library "+folot+"!")
  } catch {
    console.log("Could not load library "+file+"! This may cause severe errors!")
  }

})

process.on("uncaughtException",function(err) {
  let logger = nodelog.getLogger("ErrorHandler")
  logger.filename = "UncaughtError"
  logger.fatal("uncaughtException: "+err.stack)
})



class webserver {
  constructor(port) {
    this.port = port
    this.stored = {}
    this.server = null
    this.logger = null
  }
  start() {
    try {
      this.server.listen(this.port)
      return true
    } catch(e) {
      return(false,e)
    }

  }
}

class extendedServer extends webserver {
  constructor(port,pluginFolder) {
    super(port)
    this.port = port
    this.stored = {}
    this.server = null
    this.pluginFolder = pluginFolder
    let datetime = new Date();
    let logFileName = ".log"
    let logFileCounter = 0
    let fs = require("fs")
    while(fs.existsSync("./logs/"+datetime.toISOString().slice(0,10)+"_"+logFileCounter+".log")) {
      logFileCounter++
    }
    logFileName = "../logs/"+datetime.toISOString().slice(0,10)+"_"+logFileCounter+".log"

    this.logger = nodelog.getLogger("ServerMains")
    this.logger.info("|-----------------|")
    this.logger.info("|ExtraServer START|")
    this.logger.info("|-----------------|")
    this.logger.debug("SomeDebug")
    this.requestHandler = function(request,response) {
      log4js.getLogger().info("Got request ")
      response.end("No request handler plugins are installed on your server! Please install a reqest handler plugin on your server plugin folder.")
    }
  }



  start() {
    try {
      let logger = this.logger.getLogger("Serverstarter")
      logger.info("starting newrelic...")
      require('newrelic');
      logger.info("creating server...")
      this.server = http.createServer()
      logger.info("Loading plugins...")
      let plugLog = nodelog.getLogger("Plugin")
      let plugs = require("fs").readdirSync(this.pluginFolder)
      for (var i = 0; i < plugs.length; i++) {
        let logger = nodelog.getLogger("PluginLoader")
        try {
          require("./"+this.pluginFolder+plugs[i]).onStart(this,plugLog.getLogger(plugs[i].split(".")[0]))
          logger.info("Loaded plugin "+plugs[i])
        } catch(e) {
          logger.error("Could not load plugin "+plugs[i]+": "+e)
        }
      }


      logger.info("Starting to listen...")
      this.server.listen(this.port)
      logger.info("Listening on port "+this.port)
      let tiserv = this
      this.server.on("request",function(req,res) {
        let logger = nodelog.getLogger("RequestPasser")
        logger.filename = "RequestListener"
        logger.log("Got a request, passing it to RequestHandler!")
        tiserv.requestHandler(req,res)
      })

      this.logger.info("Server started!")
      process.chdir("./public")
      return true
    } catch(e) {
      this.logger.fatal("Server was unable to start: "+e.stack)
      return(false,e)
    }

  }
}



let serv = new extendedServer(1234,"./server_plugins/")
let logger = nodelog.getLogger("Kukucska")
serv.start()

logger.info("tictuc! elindult!")
