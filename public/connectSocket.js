function returnSocket(connectionType){
	// connectionType: 0=localhost 1=ngrok, 2=heroku
	
	var socket_server_ip = ['http://localhost:4000', 'https://cb99026a.ngrok.io', 'https://stark-scrubland-68406.herokuapp.com/']
	return io.connect(socket_server_ip[connectionType]);
}