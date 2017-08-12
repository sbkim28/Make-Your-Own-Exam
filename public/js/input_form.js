$(document).ready(function(){
	let isUpdate = $(':hidden#id').val() ? true : false;
	let pageAlreadyLoaded = false;
	$('article > section').addClass('w3-white w3-round w3-border w3-margin w3-padding w3-container');
	$('input').addClass('w3-input w3-border w3-round');
	$('.button_container > button').addClass('w3-button w3-round');
	if(isUpdate){
		$('#strDescription').val($('#strDescription').val().replace(/<br>/g,'\n'));
		$('input:visible,textarea:visible').attr('readonly','readonly');
		$('#continueBtn').attr('disabled','disabled');
		$('#settingBtn').removeClass('w3-hide');
		$.post('/questions',{index:$('#intIndex').val(),id:$('input#id:hidden').val()}).done(function(r){
			$('#questions').show().html(r);
		})
		.fail(function(r){
			alert('Fail to get Data.');
		});
	}
	$('button').click(function(){
		if($(this).attr('id')=='cancelBtn'){
			if(confirm(isUpdate ? 'Are you sure to change your exam?' :'Are you sure to cancel making your own exam?')){
				$(location).attr('href','/');
			}
		}
		if($(this).attr('id')=='continueBtn'){
			$('input:visible,textarea:visible').each(function(index){
				if(confirmValue($(this))==false){
					alert($('.'+$(this).attr('id')+'-error').text());
					return false;
				}
				if(index == $('input:visible,textarea:visible').length -1){
					if(confirm('Do you want to continue?')){
						$('input:visible,textarea:visible').attr('readonly','readonly');
						$('#continueBtn').attr('disabled','disabled');
						$('#settingBtn').removeClass('w3-hide');
						if(pageAlreadyLoaded){
							$('#questions').show();
						}else{
							$.post('/questions',{index:$('#intIndex').val(),id:null}).done(function(r){
								$('#questions').show().html(r);
							})
							.fail(function(r){
								alert('Fail to get Data.');
							});
						}
					}
				}
			});
		}
		if($(this).attr('id')=='settingBtn'){
			if(confirm('If you edit settings, your questions may be removed. Are you sure to change settings?')){
				$(this).addClass('w3-hide');
				$('#questions').hide();
				pageAlreadyLoaded = true;
				$('#continueBtn').removeAttr('disabled','disabled');
				$('input,textarea').removeAttr('readonly','readonly');
			}
		}
	});
	$('input').blur(function(){
		confirmValue($(this));
	});
	$('input#intIndex').change(function(){
		pageAlreadyLoaded = false;
	});
	$('textarea').blur(function(){
		confirmValue($(this));
	});
	
});
function confirmValue(element){
	
	const error = $('.'+element.attr('id')+'-error');
	const warning = $('.'+element.attr('id')+'-warning');
	setBorderColor(element,'green');
	error.text('');
	if(!element.val().trim()){
		error.text('Enter Value');
		warning.text('');
		setBorderColor(element,'red');
		return false;
	}
	if(element.attr('id')=='strField'){
		setBorderColor(element,'yellow');
		warning.text('Field is suggested to be one of the options');
		$('datalist#strFieldList option').each(function(index){
			if(element.val()==$(this).val()){
				setBorderColor(element,'green');
				warning.text('');
			}
		});
	}
	if(element.attr('type')=='number'){
		if(element.val() < element.attr('min')){
			error.text('Value must be equal to or greater than '+element.attr('min'));
			setBorderColor(element,'red');
			return false;
		}
		if(!Number.isInteger(element.val()*1)){
			error.text('Enter a valid value');
			setBorderColor(element,'red');
			return false;
		}
	}
	return true;
}
function setBorderColor(element,color){
	const elementClass = element.attr('class').split(' ');
	const searchBorderColor = /w3-border-/;
	let removeString = '';
	elementClass.forEach(function(item){
		if(item.match(searchBorderColor)){
			removeString += item +' ';
		}
	});
	element.removeClass(removeString);
	element.addClass('w3-border-'+color);
}