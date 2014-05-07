var Tools = require("./src/Tools"),
    Simyo = require("./src/Simyo");


var provider = new Simyo('0626870414', 'Mamoet1!');


var quitServer = function()
{
    process.exit(0);
}
process.stdin.on('data', function (text)
{
    var text = "" + text;
    text = text.replace(/(\r\n|\n|\r)/gm,"");
   
    switch(text)
    {
        case 'quit':
            quitServer();
            break;
        case 'send':
        	
        	break;        
        case 'login':
        	provider.WebLogin();
        	break;        
        case 'check':
        	provider.checkAPI();
        	break;
    }
});
process.on('SIGINT', quitServer);

