exports.onStart = function(server,logger) {


  logger.info("CopatibleMode plugin was made by BomberPLayz")

  global.teherauto = 0

  global.maintance = false

  global.szarnet = true
  global.loader = function(response) {
    response.write(`

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js"></script>



  <script>

  function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
      if (document.querySelector(selector) != null) {
        callback();
        return;
      }
      else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
            return;
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
  }

  waitForElementToDisplay("#page",function(){
  },10,9000)
  $(window).load(function() {
    // Animate loader off screen
    $(".container").remove();
  });
  </script>


  <div class="container">
  	<div class="📦"></div>
  	<div class="📦"></div>
  	<div class="📦"></div>
  	<div class="📦"></div>
  	<div class="📦"></div>

    <style>

    .container
    {
    	width: var(--container-size);
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    	position: relative;
    }

    .📦
    {
    	width: var(--box-size);
    	height: var(--box-size);
    	position: relative;
    	display: block;
    	transform-origin: -50% center;
    	border-radius: var(--box-border-radius);

    	&:after
    	{
    		content: '';
    		width: 100%;
    		height: 100%;
    		position: absolute;
    		top: 0;
    		right: 0;
    		background-color: lightblue;
    		border-radius: var(--box-border-radius);
    		box-shadow: 0px 0px 10px 0px rgba(#1C9FFF, 0.4);
    	}

    	&:nth-child(1)
    	{
    		animation: slide var(--duration) ease-in-out infinite alternate;
    		&:after{ animation: color-change var(--duration) ease-in-out infinite alternate; }
    	}

    	@for $i from 1 to 5
    	{
    		&:nth-child(#{$i + 1})
    		{
    			animation: flip-#{$i} var(--duration) ease-in-out infinite alternate;
    			&:after{ animation: squidge-#{$i} var(--duration) ease-in-out infinite alternate; }
    		}
    	}

    	&:nth-child(2):after{ background-color: #1C9FFF; }
    	&:nth-child(3):after{ background-color: #1FB1FD; }
    	&:nth-child(4):after{ background-color: #22C7FB; }
    	&:nth-child(5):after{ background-color: #23D3FB; }
    }

    @keyframes slide
    {
    	0% { background-color: #1795FF; transform: translatex(0vw); }
    	100% { background-color: #23D3FB; transform: translatex(calc(var(--container-size) - (var(--box-size) * 1.25))); }
    }

    @keyframes color-change
    {
    	0% { background-color: #1795FF; }
    	100% { background-color: #23D3FB; }
    }

    @for $i from 1 to 5
    {
        @keyframes flip-#{$i} {
          0%, #{$i * 15}% { transform: rotate(0); }
          #{$i * 15 + 20}%, 100% { transform: rotate(-180deg); }
        }

    	@keyframes squidge-#{$i}
    	{
    		#{$i * 15 - 10}% { transform-origin: center bottom; transform: scalex(1) scaley(1);}
    		#{$i * 15}% { transform-origin: center bottom; transform: scalex(1.3) scaley(0.7);}
    		#{$i * 15 + 10}%, #{$i * 15 + 5}% { transform-origin: center bottom; transform: scalex(0.8) scaley(1.4);}
    		#{$i * 15 + 40}%, 100% { transform-origin: center top; transform: scalex(1) scaley(1);}
    		#{$i * 15 + 25}% { transform-origin: center top; transform: scalex(1.3) scaley(0.7);}
    	}
    }
    </style>
  </div>
  `)}

  global.getType = function(fext) {
    let types = {".html": "text/html", ".js": "application/javascript", ".mp4": "video/mp4", ".css": "text/css", ".png": "media/png"}
    let typer = "text/plain"
    for(let type in types) {
      logger.debug("check: "+type)
      if (type == fext) {
        logger.debug("yes: "+type)
        return types[type]
      }
    }
    return typer
  }

  let caddr = function (req) {
    let data = (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress;
          return data.split(":").pop()
  };

  server.server.on("request",function(request,response) {
    request.post = null;
    request.ip = caddr(request);

  })
}
