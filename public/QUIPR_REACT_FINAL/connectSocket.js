function returnSocket(connectionType){
	// connectionType: 0=localhost 1=ngrok, 2=heroku
	
	var socket_server_ip = ['http://quipr-html.herokuapp.com/', 'https://cb99026a.ngrok.io', 'http://localhost:4000']
	return io.connect(socket_server_ip[connectionType]);
}