
function detect(data){
	var undef = "undefined";
	var os = platform.os.family;
    /* Common values include:
    * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
    * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
    * "Android", "iOS" and "Windows Phone"
	*/
	if((os.lastIndexOf('iOS', 0) === 0) && (typeof(data.Item.itunes) != undef)){
		window.location.replace('https://itunes.apple.com/app/' + data.Item.itunes.S);
	}
	else if((os.lastIndexOf('Android', 0) === 0) && (typeof(data.Item.google_play) != undef)){
		var uri = 'https://play.google.com/store/apps/details?id=' + data.Item.google_play.S
		console.write(uri);
		//window.location.replace(uri);
	}
	else{
		window.location.replace('/');
	}
}
