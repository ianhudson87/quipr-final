function returnSocket(){
	var socket_server_ip = ['http://quipr-final.herokuapp.com/', 'https://cb99026a.ngrok.io', 'http://localhost:4000']
	return io.connect(socket_server_ip[2]);
}