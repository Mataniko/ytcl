$(document).on("fullscreenchange", handleFullScreenChange);

function initalizeProgressBar() {
    setInterval(function() {  
            $('#progressBar').text(getProgressBar())
    }, 1);
}

function drawVolume() {
    var volume = Math.floor(player.getVolume()/20);
    if (volume==0)
        return "x    ";
    
    var volString = ""
    for (var i=1; i<=5; i++)
    {
        if (volume >= i)
            volString += '>';
        else
            volString += ' ';        
    }
    return volString;
}

$('#terminal').terminal(function(input, term) {    
    if (command !== '') {
        try {
            var splitComm = input.split(' ');
            var command = $.trim(splitComm[0]);
            var arg
            if (splitComm.length > 1)
            {                
                arg = $.trim(splitComm[1]);
            }
                
            switch (command)
            {
                    case "play":
                        player.playVideo();                        
                        break;
                    case "pause":
                        player.pauseVideo();
                        break;
                    case "stop":
                        player.pauseVideo();
                        break;
                    case "mute":
                        player.mute();
                        break;
                    case "unmute":
                        player.unMute();
                        break;
                    case "volume":
                        player.setVolume(arg);
                        break;
                    case "load":
                        player.loadVideoById(arg)
                        break;
                    case "seek":
                        if (arg.indexOf(':') == -1)
                            player.seekTo(arg);
                        else
                            player.seekTo(parseSaneTime(arg));
                        break;
                    case "fullscreen":
                        doFullScreen()
                        break;
            }           
        } catch(e) {
            term.error(new String(e));
        }
    } else {
       term.echo('');
    }
}, {
    greetings: false,
    name: 'js_demo',
    outputLimit: 4,
    height: 200,
    prompt: 'ytcl> '});

function trimCommand(command, string) {
    return $.trim(string.replace(command, ''))
}

function doFullScreen()
{
    var fsElement = $('#fullscreen')
    fsElement.fullScreen(!fsElement.fullScreen())        
}

function handleFullScreenChange()
{
    if ($('#fullscreen').fullScreen()) {
        setTimeout(function() {
            $('#player').attr({height: document.height-75, width: document.width});
        }, 100);
        $('#terminal').terminal().resize([document.width, 200]);
    }
    else
    {
        setTimeout(function() {
            $('#player').css({height: 390, width: 640});
        }, 100);
    }
}
                
function getPlaybackPercent() 
{
    return Math.floor((player.getCurrentTime() / player.getDuration() * 100))
}

function getProgressBar() {    
    var prefix = getSaneTime(player.getCurrentTime()) + ' ' + drawVolume() + ' ['
    var postfix = '] ' + getSaneTime(player.getDuration());
    var progressLength = ($('#player').attr('width')/8) - prefix.length - postfix.length;               
    var progress = ""
    var currentTime = getPlaybackPercent()/(100/progressLength);
    for (var i=1; i<=progressLength; ++i) {
        if (currentTime >= i)
            progress += '#';
        else
            progress += ' ';
    }    
    
    return prefix + progress + postfix;
}

function getSaneTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor(seconds / 60) % 60;
    var seconds = Math.floor(seconds % 60);
    
    if (seconds < 10)
        seconds = "0" + seconds;
    
    if (hours == 0)
        return minutes + ":" + seconds;
    
    if (minutes < 10)
        minutes = "0" + minutes;
    
    return hours + ":" + minutes + ":" + seconds;        
}

function parseSaneTime(time) {
    try {        
        var split = time.replace(":0",":").split(':')
        if (split.length == 2)
            return (split[0]*60)+Number(split[1]);
        
        if (split.length == 3)
            return (split[0]*3600)+(split[1]*60)+Number(split[2]);
        
        return NaN;
    }
    catch (e) {
        return NaN;
    }
    
}
