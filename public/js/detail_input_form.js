$(document).ready(function(){
	let optionEvent = '',
		isUpdate = $(':hidden#id').val() ? true : false;
	$('.number_container > input:radio').addClass('w3-radio choiceNum').attr('name','choiceNum');
	$('.answers_container > button').addClass('w3-button w3-round w3-small');
	$('.choices_container > section').addClass('w3-row');
	$('.choices_container > section > p').addClass('w3-col l1 m1 s1');
	$('.choices_container :text').addClass('w3-input w3-round w3-border w3-col l10 m10 s10').attr('name','choices').css('width','70%');
	$('.choices_container :radio').addClass('w3-radio w3-col l1 m1 s1').attr('name','answers').css('width','10%');
	$('.w3-modal').click(function(){
		event.stopPropagation();
	});
	if(isUpdate){
		$('.question').each(function(){
			$(this).val($(this).val().replace(/<br>/g,'\n'));
		});
		$('.data').each(function(){
			const type = $(this).attr('data-type'),
				isMulti = $(this).attr('data-isMulti')=='true',
				caseSensitive = $(this).attr('data-caseSensitive')=='true',
				isKeyWord = $(this).attr('data-isKeyWord')=='true',
				containsAll = $(this).attr('data-containsAll')=='true',
				answer_array = [];
			$(this).children('span').each(function(){
				answer_array.push($(this).attr('data-answer'));
			});
			if(type == 0){
				$(this).siblings(':radio.type[value=0]').prop('checked',true);
				$(this).siblings('.answers_container').show();
				const answers_con = $(this).siblings('.answers_container').children('section.answers');
				for(let i = 1;i<=answer_array.length;i++){
					const input_clone = answers_con.children('input:first-of-type')
					.clone(true).removeClass('w3-pale-red w3-border-red w3-border-green').attr('data-order',i);
					const answer_split = answer_array[i-1].split('-split=');
					if(answer_split.length == 2){
						if(answer_split[0]=='NOT'){
							input_clone.addClass('w3-pale-red').attr('data-NOT','true');
						}
					}
					input_clone.val(answer_split[answer_split.length-1]);
					answers_con.append(input_clone);
					if(i==2){
						$(this).siblings('.removeAnswer').prop('disabled',false);
					}
				}
				answers_con.children('input:first-of-type').remove();
				const advanced_con = answers_con.siblings('.advanced');
				advanced_con.find('.caseSensitive').prop('checked',caseSensitive);
				advanced_con.find('.isKeyWord').prop('checked',isKeyWord);
				advanced_con.find('.containsAll').prop('checked',containsAll);
				if(isKeyWord){
					advanced_con.children('.logical_operation').show();
				}
			}else{
				$(this).siblings(':radio.type[value=multiple-choice]').prop('checked',true);
				$(this).siblings('.number_container').show().children(':radio').each(function(){
					if($(this).val()==type){
						$(this).prop('checked',true);
						return false;
					}
				}).siblings('.isMultiple').prop('checked',isMulti);
				$(this).siblings('.choices_container').find('input[name=answers]')
					.removeClass(isMulti ? 'w3-radio' : 'w3-check')
					.addClass(isMulti ? 'w3-check' : 'w3-radio')
					.removeAttr('type',isMulti ? 'radio' : 'checkbox')
					.attr('type',isMulti ? 'checkbox' : 'radio');
				let array_num = 0;
				$(this).siblings('.choices_container').show().children('section').each(function(){
					let index = $(this).attr('class').substring(0,2)*1;
					if(index<=type){
						$(this).show();
						if(index==answer_array[array_num]){
							$(this).children('input[name=answers]').prop('checked',true);
							array_num++;
						}
					}else{
						$(this).hide();
					}
				});
			}
		});
		$('li.uList').addClass('w3-pale-green');
	}
	$('.type').change(function(){
		if($(this).val()=='multiple-choice'){
			const number_container = $(this).siblings('.number_container');
			number_container.show();
			$(this).siblings('.answers_container').hide();
			if(number_container.children(':radio.choiceNum:checked').val()){
				$(this).siblings('.choices_container').show();
			}
		}else{
			$(this).siblings('.number_container').hide();
			$(this).siblings('.choices_container').hide();
			$(this).siblings('.answers_container').show();
		}
	});
	
	$('.choiceNum').change(function(){
		const choiceNum = $(this).val()*1;
		const choices_container = $(this).parent('.number_container')
			.siblings('.choices_container');
		choices_container.children('section').each(function(){
			if($(this).attr('class').substring(0,2)*1<=choiceNum){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
		choices_container.show();
	});
	$('.isMultiple').change(function(){
		const input_answers = $(this).parents('.number_container')
				.siblings('.choices_container')
				.find('input[name=answers]');
		const isMulti = this.checked;
		input_answers.removeClass(isMulti ? 'w3-radio' : 'w3-check')
		.addClass(isMulti ? 'w3-check' : 'w3-radio')
		.removeAttr('type',isMulti ? 'radio' : 'checkbox')
		.attr('type',isMulti ? 'checkbox' : 'radio');
	});
	$('.addAnswer').click(function(){
		const input_length = $(this).siblings('.answers').children('input:text').length+1;
		$(this).siblings('.answers').append($(this).siblings('.answers').children('input:first-of-type')
			.clone(true).removeClass('w3-pale-red w3-border-red w3-border-green').val(''));
		$(this).siblings('.removeAnswer').prop('disabled',false);
	});
	$('.removeAnswer').click(function(){
		$(this).siblings('.answers')
			.children('input:last-of-type')
			.remove();
		if($(this).siblings('.answers').children('input').length==1){
			$(this).prop('disabled',true);
		}
	});
	$('input[name=answers]').click(function(){
		if(optionEvent=='NOT'){
			$(this).removeClass('w3-hover-pale-red').addClass('w3-pale-red').attr('data-NOT','true');
		}
		if(optionEvent=='REMOVE'){
			$(this).removeClass('w3-pale-red').removeAttr('data-NOT');
		}
		if(optionEvent){
			logicalButtonCancel($(this).parents('.modal_article'));
		}
	});
	$('.contentSaveBtn').click(function(){
		if(validation($(this).parent('.modal_footer').siblings('.modal_article'))==false){
			if(confirm('Error found. Would you keep going?')){
				$(this).parents('.w3-modal').hide().parent('.uList').removeClass('w3-pale-green').addClass('w3-pale-red');
			}
		}else{
			$(this).parents('.w3-modal').hide().parent('.uList').removeClass('w3-pale-red').addClass('w3-pale-green');
		}
	});
	$('.advancedOptions').click(function(){
		$(this).siblings('.advanced').toggle();
	});
	$('.isKeyWord').change(function(){
		if(this.checked){
			$(this).siblings('.logical_operation').show();
		}else{
			$(this).parent('.advanced').siblings('.answers').children('input').removeAttr('data-NOT').removeClass('w3-pale-red');
			$(this).siblings('.logical_operation').hide();
		}
	});
	$('.addNotOption').click(function(){
		logicalButtonOnClick($(this).parents('.modal_article'),'NOT');
	});
	$('.removeLogicalOption').click(function(){
		logicalButtonOnClick($(this).parents('.modal_article'),'REMOVE');
	});
	$('.addOptionCancel').click(function(){
		logicalButtonCancel($(this).parents('.modal_article'));
	});
	$('#saveAllBtn').click(function(){
		const json = {
			strTitle:$('#strTitle').val(),
			strField:$('#strField').val(),
			strDescription:$('#strDescription').val().replace(/\n/g,'<br>'),
			intIndex:$('#intIndex').val(),
			intLimit:$('#intLimit').val(),
			list:[]
		};
		$('.modal_article').each(function(index){
			if(validation($(this))==false){
				alert('Error Found at Question '+(index+1));
				$(location).attr('href','#'+(index+1));
				$(this).parents('.uList').removeClass('w3-pale-green').addClass('w3-pale-red');
				return false;
			}
			$(this).parents('.uList').removeClass('w3-pale-red').addClass('w3-pale-green');
			let type = $(this).children(':radio.type:checked').val()+'',
				isMulti = false,
				choices = [],
				answers = [],
				caseSensitive = false,
				isKeyWord = false,
				containsAll = false;
			if(type!='0'){
				type = $(this).find(':radio.choiceNum:checked').val();
				isMulti = $(this).find('.isMultiple')[0].checked;
				for(let i=1;i<=type*1;i++){
					choices.push($(this).find('.choices_container > section.'+i).children(':text').val());
					if($(this).find('.choices_container > section.'+i).children(isMulti?':checkbox':':radio')[0].checked){
						answers.push(i);
					}
				}
			}else{
				caseSensitive = $(this).find('.caseSensitive')[0].checked;
				isKeyWord = $(this).find('.isKeyWord')[0].checked;
				containsAll = isKeyWord&&$(this).find('.containsAll')[0].checked;
				$(this).find('.answers > input:text').each(function(){
					let value = '';
					if($(this).attr('data-NOT')=='true'){
						value = 'NOT-split=';
					}
					value += $(this).val();
					answers.push(value);
				});
			}
			json.list.push({
				question:$(this).children('.question').val().replace(/\n/g,'<br>'),
				type:type,
				isMulti:isMulti,
				caseSensitive:caseSensitive,
				isKeyWord:isKeyWord,
				choices:choices,
				answers:answers,
				containsAll:containsAll,
				points:$(this).children('input.points').val()
			});
			if($('article.modal_article').length - 1 == index){
				$.post(isUpdate ? '/edit/'+$(':hidden#id').val() :'/new',json).done(function(r){
					alert('Successfully Saved');
					$(location).attr('href','/');
				}).fail(function(){
					alert('Error Occurred while saving data. Try again');
				});
			}
		});
	});
	function logicalButtonCancel(modal_article){
		modal_article.removeClass('w3-gray')
		.find('input').prop({disabled:false,readonly:false});
		modal_article.find('textarea').prop('disabled',false);
		modal_article.find('button').prop('disabled',false);
		if(modal_article.find('section.answers').children('input').length==1){
			$('.removeAnswer').prop('disabled',true);
		}
		modal_article.siblings('.modal_footer').children('.contentSaveBtn').prop('disabled',false);
		modal_article.find('button.addOptionCancel').hide();
		modal_article.find('input[name=answers]').each(function(){
			$(this).removeClass('w3-hover-pale-red w3-hover-white');
		});
		optionEvent = '';
	}
	function logicalButtonOnClick(modal_article,which){
		let color;
		switch(which){
		case 'NOT' : color='w3-hover-pale-red';break;
		case 'REMOVE' : color = 'w3-hover-white';break;
		default : color=null;break;
		}
		if(!color){
			return false;
		}
		modal_article.addClass('w3-gray')
		.find('input').prop('disabled',true);
		modal_article.find('textarea').prop('disabled',true);
		modal_article.find('button').prop('disabled',true);
		modal_article.siblings('.modal_footer').children('button.contentSaveBtn').attr('disabled','disabled');
		modal_article.find('.addOptionCancel').show().prop('disabled',false);
		modal_article.find('input[name=answers]').prop('disabled',false)
		.prop('readonly',true).addClass(color);
		
		optionEvent = which;
	}
});

function validation(modal_article){
	const modal_error = modal_article.find('.modal-error'),
		textarea_question = modal_article.children('.question'),
		radio_type = modal_article.children(':radio:checked');
	//validate textarea_question
	if(!textarea_question.val().trim()){
		modal_error.text('Enter Question');
		setBorderColor(textarea_question,'red');
		return false;
	}
	setBorderColor(textarea_question,'green');
	//validate radio_type and check its value
	if(!radio_type.val()){
		modal_error.text('Select question type');
		return false;
	}
	if(radio_type.val()=='multiple-choice'){
		const number_con = modal_article.children('.number_container'),
			choices_con = modal_article.children('.choices_container'),
			number_answers = number_con.children(':radio:checked').val();
		if(!number_answers){
			modal_error.text('Select the number of choices');
			return false;
		}
		let sectionClass = '.1';
		for(let i=2;i<=number_answers*1;i++){
			sectionClass += ',.'+i;
		}
		const isMultiple = number_con.children('.isMultiple')[0].checked,
			input_text = choices_con.children('section'+sectionClass).children(':text'),
			input_check = choices_con.children('section'+sectionClass).children(isMultiple ? ':checkbox':':radio');
		let isError = false;
		//validate choices
		input_text.each(function(){
			if(!$(this).val().trim()){
				modal_error.text('Enter choices');
				setBorderColor($(this),'red');
				isError = true;
				return false;
			}
			setBorderColor($(this),'green');
		});
		if(isError){
			return false;
		}
		//validate answers
		input_check.each(function(index){
			if(this.checked){
				return false;
			}
			if(index == input_check.length-1){
				modal_error.text('Select answers');
				isError = true;
				return false;
			}
		});
		if(isError){
			return false;
		}
	}
	if(radio_type.val()+''=='0'){
		//validate answers
		const answers = modal_article.find('section.answers');
		let isError=false;
		answers.children(':text[name=answers]').each(function(index){
			if(!$(this).val().trim()){
				modal_error.text('Enter answers');
				setBorderColor($(this),'red');
				isError = true;
				return false;
			}
			if($(this).val().match(/-split=/)){
				modal_error.text('There are unavailable texts in the answers');
				setBorderColor($(this),'red');
				isError=true;
				return false;
			}
			setBorderColor($(this),'green');
		});
		if(isError){
			return false;
		}
	}
	//validate points
	const input_points = modal_article.children('input.points');
	if(!input_points.val().trim()){
		modal_error.text('Enter points');
		setBorderColor(input_points,'red');
		return false;
	}
	if(input_points.val() < 1){
		modal_error.text('Values must be equal to or greater than 1');
		setBorderColor(input_points,'red');
		return false;
	}
	if(!Number.isInteger(input_points.val()*2)){
		modal_error.text('Enter a valid value');
		setBorderColor(input_points,'red');	
		return false;
	}
	setBorderColor(input_points,'green');
	modal_error.text('');
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