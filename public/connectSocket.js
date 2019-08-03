/*let port = process.env.PORT;
if (port == null || port == "") {
  port = '4000';
}*/

var port = '5000'

function returnSocket(connectionType){
	// connectionType: 0=localhost 1=ngrok
	
	var socket_server_ip = ['https://stark-scrubland-68406.herokuapp.com/', 'https://cb99026a.ngrok.io']
	return io.connect(socket_server_ip[connectionType]);
}