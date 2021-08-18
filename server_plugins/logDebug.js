exports.onStart = function(server,logger) {
    logger.info("logDebug plugin by BomberPlayz!")

    global.console.log = function(tuc) {
        
        logger.debug(String(tuc))
    }
}