

function detect(data){
	document.write(data);
	var os = platform.os;
	
	if(os.startsWith('iOS')){
		document.write(data.Item.itunes.S)
	}
	else if(os.startsWith('Android')){
		document.write(data.Item.google_play.S)
	}
	else{
		document.write(os)
	}
}