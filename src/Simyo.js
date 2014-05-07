var util  = require("util"),
	request = require("request"),
	jsdom = require("jsdom"),
	querystring = require("querystring"),
	fs = require('fs');
/********************************************/
/*	This gateway is meant to work with		*/
/*	Simyo The Netherlands. It uses 2 		*/
/*	different API's. To send SMS messages	*/
/*	it uses the normal website. To update	*/
/*	credit info, it uses the API of the		*/
/*	Simyo Android application.				*/
/********************************************/


var Simyo = function(user, password)
{
	this.user = user; this.password = password;
	this.webHost = "https://mijn.simyo.nl/";
	this.jar = request.jar();

	this.SimyoAPIKey  = "e77b7e2f43db41bb95b17a2a11581a38";
	this.SimyoAPIHost = "https://webapi.simyo.nl/v2/";
	this.SimyoAPISessionToken = 'none';


	this.credits = {

		sms: 0,
		internet: 0

	}
}




Simyo.prototype = 
{

	WebLogin: function()
	{
		var _this = this;
		util.log("[SIMYO] INFO - Logging in on the web interface of mijn.simyo.nl")
		request(_this.webHost + "selfcare2/servlet/MijnSimyo", function (error, response, body)
		{
			if (!error) 
			{
				jsdom.env(body, function (errors, window)
				{
					var loggedin = window.document.getElementsByClassName("horizontalMenu")[0].getElementsByClassName("username")[0] === undefined ? false : true;
					util.log(body);
					util.log("Ingelogd?: " + loggedin);
					if(!loggedin)
					{
						var loginSuffix = window.document.getElementById("login_form").getAttribute("action");
						var url = _this.webHost + "selfcare2/servlet/" + loginSuffix;
						
						var data = {
							"goto" : "",
							"username": _this.user,
							"password": _this.password,
							"login":"log in"					
						};

						var data = "goto=&username="+ escape(_this.user) +"&password="+ escape(_this.password) +"&login=log+in";
						
						request(
						{
							url: url,
							method: "POST",
							body: data,
							jar: _this.jar,
							headers: 
							{
								'Content-Type': 'application/x-www-form-urlencoded'
							}

						}, function (error, response, body)
						{
							if(response.statusCode == 302) //Logged in
							{

							}
							else
							{
								util.log("[SIMYO] FATAL - Invalid user credentials for mijn.simyo.nl")
							}
						});
					}
				});
			}
		});
	}/*,
	updateCredits: function(_this)
	{
		if(!_this) var _this = this;

		util.log('[SIMYO] INFO - Updating user credits...');
		request(
		{

			method: 'GET',
			url: _this.SimyoAPIHost + 'overview',
			headers:
			{
				'X-Client-Token': _this.SimyoAPIKey,
				'X-Session-Token': _this.SimyoAPISessionToken
			}

		}, function (error, response, body)
		{

			if (!error)
			{
				if(response.statusCode == 401)
				{
					util.log('[SIMYO] INFO - Not logged in yet on the API. Doing it now.');
					_this.doAPILogin(_this.updateCredits);
				}
				else if(response.statusCode == 200)
				{

					util.log(response.statusCode);
					util.log(body);
				}
			}

		});

	},
	doAPILogin: function(cb)
	{

		var _this = this;
		
		request(
		{

			method: "POST",
			url: _this.SimyoAPIHost + 'sessions',
			headers:
			{
				'X-Client-Token': _this.SimyoAPIKey,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phoneNumber: _this.user, password: _this.password })

		}, function (error, response, body)
		{
			if (!error)
			{
				if(response.statusCode == 401)
				{
					util.log('[SIMYO] FATAL - Invalid authorization credentials');
				}
				else if(response.statusCode == 201)
				{
					var json = JSON.parse(body);
					_this.SimyoAPISessionToken = json.sessionToken;
					util.log('[SIMYO] INFO - Logged in on the mobile API' + _this.SimyoAPISessionToken);
					cb(_this);
				}
			}

		});

	}*/

}


module.exports = Simyo;
