function initalizeProgressBar() {
    setInterval(function() {
    var term = $('#terminal').terminal();
            var command = term.get_command();
            term.clear().echo(getProgressBar()).set_command(command);       
}, 1) };

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
                        initalizeProgressBar();
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
                        player.seekTo(arg);
                        break;
            }           
        } catch(e) {
            term.error(new String(e));
        }
    } else {
       term.echo('');
    }
}, {
    greetings: 'Javascript Interpreter',
    name: 'js_demo',
    height: 200,
    prompt: 'js> '});

function trimCommand(command, string) {
    return $.trim(string.replace(command, ''))
}

function getPlaybackPercent() 
{
    return Math.floor((player.getCurrentTime() / player.getDuration() * 100))
}

function getProgressBar() {
    var progress = getSaneTime(player.getCurrentTime()) + ' ' + drawVolume() + ' ['
    var currentTime = getPlaybackPercent()/2;
    for (var i=1; i<=50; i++) {
        if (currentTime >= i)
            progress += '#';
        else
            progress += ' ';
    }
    progress += '] ' + getSaneTime(player.getDuration());
    
    return progress;
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

