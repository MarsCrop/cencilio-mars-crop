onconnect = function(e) { //promise
  	var port = e.ports[0];
	//e === URL
  	port.onmessage = function(e) {		
   	var xhr = new XMLHttpRequest();
   	xhr.open('GET', 'php/verify_token.php?key='e.data[0], true);
   	xhr.responseType = "json";   	
   	xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
   	xhr.onload = function (data) {
			if((data.currentTarget.response.results[0].answer !== 'OK')) {
				port.postMessage([1]);				
			}			
			else {
				port.postMessage([0]);				
			}	
  	 	};
   	xhr.send();
	};
}
