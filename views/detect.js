

function detect(data){
	document.write(JSON.stringify(data));
	var os = platform.os.family;
	document.write(os)
	if(os.lastIndexOf('iOS', 0) === 0){
		document.write(data.Item.itunes.S)
	}
	else if(os.lastIndexOf('Android', 0) === 0){
		document.write(data.Item.google_play.S)
	}
	else{
		document.write(os)
	}
}


