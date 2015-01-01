
function detect(data){
	var os = platform.os.family;
	if(os.lastIndexOf('iOS', 0) === 0){
		window.location.replace('https://itunes.apple.com/app/' + data.Item.itunes.S)
	}
	else if(os.lastIndexOf('Android', 0) === 0){
		window.location.replace('https://play.google.com/store/apps/details?id=' + data.Item.google_play.S)
	}
	else{
		document.write(os)
	}
}
