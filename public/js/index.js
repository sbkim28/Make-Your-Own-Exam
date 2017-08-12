$(document).ready(function(){
	$('article > section').addClass('w3-white w3-round w3-border w3-margin w3-padding w3-container w3-center');
	$('.button_container > button').addClass('w3-button w3-round');
	$('.tdDate').each(function(){
		const createdDate = new Date($(this).text()),
			nowDate = new Date(),
			_comCrDt = new Date(createdDate.getFullYear(),createdDate.getMonth(),createdDate.getDate()),
			_comNowDt = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate());
		_comCrDt.getTime() == _comNowDt.getTime()
			?	$(this).text(createdDate.getHours()+':'+createdDate.getMinutes())
			:	$(this).text(createdDate.getFullYear()+'/'+(createdDate.getMonth()+1)+'/'+createdDate.getDate());
	});
	$('#newBtn').click(function(){
		$(location).attr('href','/new');
	});
	$('input#query').keyup(function(){
		const field = $('section#radios > :radio:checked').val();
		if(!field){
			alert('Check radio');
			return false;
		}
		$('tr.tList').each(function(){
			const td = $(this).children('td.'+field).text().toUpperCase();
			td.indexOf($('#query').val().toUpperCase()) > -1 ? $(this).removeClass('w3-hide') : $(this).addClass('w3-hide');
		});
	});
	$('tr.tList').click(function(){
		$.post('/get/detail',{id:$(this).attr('id')}).done(function(r){
			$('#detailView').html(r);
		}).fail(function(){
			alert('Error Occured While getting Data');
		});
	});
});