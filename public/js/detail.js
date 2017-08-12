$(document).ready(function(){
	$('.button_container > button').addClass('w3-button w3-round');
	$('.button_container > button').click(function(){
		if($(this).attr('id')=='updateBtn'){
			$(location).attr('href','/edit/'+$('input:hidden').val());
		}
		if($(this).attr('id')=='deleteBtn'){
			if(confirm('Are you Sure to delete this?')){
				$.post('/delete',{id:$('input:hidden').val()}).done(function(r){
					alert('Successfully Removed');
					location.reload(true);
				}).fail(function(r){
					alert('Error Occured. Try again.');
				});
			}
		}
		if($(this).attr('id')=='takeBtn'){
			window.open('','_exam','toolbar=no,scrollbars=no,resizable=no,height=800,width=1000,left=200,top=50');
			$('form').attr({action:'/exam',method:'post',target:'_exam'}).submit();
		}
	});
});
