$(document).ready(function(){
	let isBlock = true;
	setIsBlock();
	$(document).keydown(function(e){
		const key = e.keyCode;
		if(key == 116){
			if(confirmPageOut()==false){
				e.keyCode = 0;
				return false;
			}
		}
		if(event.ctrlKey&&(key==78||key==82)){
			if(confirmPageOut()==false){
				e.keyCode = 0;
				return false;
			}
		}
		if((e.target.nodeName != 'INPUT' && e.target.nodeName != 'TEXTAREA') &&key == 8){
			e.keyCode=0;
			return false;
		}
		if(event.altKey&&(key==37||key==38)){
			if(confirmPageOut()==false){
				e.keyCode = 0;
				return false;
			}
		}
		if(event.altKey&&key==36){
			if(confirmPageOut()==false){
				e.keyCode = 0;
				return false;
			}
		}
	});
	$('html').on('contextmenu',function(){
		return false;
	});
	function confirmPageOut(){
		if(!isBlock){
			if(confirm('Do you want to go out of this page?')){
				return true;
			}
		}
		return false;
	}
	function setIsBlock(){
		let path = $(location).attr('pathname');
		if(path.lastIndexOf('/')==path.length-1){
			path = path.substring(0,path.lastIndexOf('/'));
		}
		switch(path){
		case '/new':isBlock=false;break;
		default : isBlock=true;break;
		}
	}
});