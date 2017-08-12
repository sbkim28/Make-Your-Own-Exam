$(document).ready(function(){
	const intLimit = $('.data').attr('data-intLimit'),
		intIndex = $('.data').attr('data-intIndex'),
		_id = $('.data').attr('data-_id');
	$('.data').remove();
	let index = 1,
		w;
	let answer_array = [];
	for(let i=0;i<intIndex;i++){
		answer_array.push(null);
	}
	if(typeof Worker === 'undefined'){
		$('body').empty();
		$('body').append('<p>Your browser doesn\'t support W. Please use other browsers.</p>');
	}
	$('#start').click(function(){
		$('.test').empty();
		$('button').prop('disabled',false);
		$('.href_container').show();
		w = new Worker('/js/timeCountBySeconds.js');
		w.onmessage = function(e){
			let timeLeft = intLimit*60 - event.data;
			timeLeft = parseInt(timeLeft/60)+'m '+ (timeLeft%60) + 's';
			$('b.time').text(timeLeft);
			if(intLimit*60 == event.data){
				finishTest(true);
			}
		};
		getQuestion();
	});
	$('#previousBtn').click(function(){
		setAsideColor(index);
		index--;
		getQuestion();
	});
	$('#nextBtn').click(function(){
		setAsideColor(index);
		index++;
		getQuestion();
	});
	$('#submitBtn').click(function(){
		finishTest(false);
	});
	$('.openSidebar').click(function(){
		$('aside').show();
		if(typeof w === 'undefined'){
			$('.href_container').hide();
		}
	});
	$('#closeSidebar').click(function(){
		$('aside').hide();
	});
	$('.questionLocate').click(function(){
		setAsideColor(index);
		index = $(this).index()+1;
		getQuestion();
		$('aside').hide();
	});
	function finishTest(isForced){
		
		if(!isForced){
		let confirmMessage = 'Are you sure to submit your answers?';
			answer_array.forEach(function(item){
				if(!item){
					confirmMessage = 'There are unsolved questions. Are you sure to submit your answers?';
					return false;
				}
			});
			if(!confirm(confirmMessage)){
				return false;
			}
		}
		w.terminate();
		w = undefined;
		$('.test').empty();
		$('button[id!=closeSidebar]').prop('disabled',true);
		$('.href_container').hide();
		$.post('/check/answers',{answers:answer_array,id:_id}).done(function(r){
			alert('The number of right answer : '+r.correct+'\nYour score : '+r.total+'/'+r.all);
		}).fail(function(){
			alert('Unexpected Error while check your answers.');
		}).always(function(){
			close();
			html.empty();
		});
		
	}
	function getQuestion(){
		$('#previousBtn,#nextBtn').prop('disabled',false);
		if(index==1){
			$('#previousBtn').prop('disabled',true);
		}
		if(index==intIndex){
			$('#nextBtn').prop('disabled',true);
		}
		$.post('/get/question',{id:_id,index:index})
			.done(function(r){
				$('.test').html(r);
				setValue();
				$('.test').find('input').change(setAnswer);
			}).fail(function(r){
				alert('Failed to get data');
			});
	}
	
	function setValue(){
		if(answer_array[index-1]!=null){
			const inputs = $('.test').find('input');
			if($('.test').find('input').attr('type')=='radio'){
				inputs.each(function(){
					if($(this).val()==answer_array[index-1]){
						$(this).prop('checked',true);
						return false;
					}
				});
			}
			if(inputs.attr('type')=='checkbox'){
				answer_array[index-1].forEach((answer)=>{
					inputs.each(function(){
						if($(this).val()==answer){
							$(this).prop('checked',true);
							return false;
						}
					});
				});
			}
			if(inputs.attr('type')=='text'){
				inputs.val(answer_array[index-1]);
			}
		}
	}
	function setAnswer(){
		if($(this).attr('type')=='radio'){
			answer_array[index-1] = $(this).val();
		}
		if($(this).attr('type')=='checkbox'){
			if(answer_array[index-1]==null){
				answer_array[index-1] = [];
			}
			if(this.checked){
				answer_array[index-1].push($(this).val());
			}else{
				let arrayIndex = answer_array[index-1].indexOf($(this).val());
				if(arrayIndex > -1){
					answer_array[index-1].splice(arrayIndex,1);
				}
				if(!answer_array[index-1].length){
					answer_array[index-1]==null;
				}
			}
		}
		if($(this).attr('type')=='text'){
			answer_array[index-1] = $(this).val();
		}
	}
});
function setAsideColor(index){
		const inputs = $('.test').find('input');
		if(inputs.length){
			const questionLocate = $('.href_container > .questionLocate:nth-of-type('+index+')');
			if(inputs.attr('type')=='radio'||inputs.attr('type')=='checkbox'){
				let removeSelector = 'w3-pale-green',
					addSelector = 'w3-pale-red';
				inputs.each(function(i){
					if(this.checked){
						removeSelector = 'w3-pale-red';
						addSelector ='w3-pale-green';
						return false;
					}
				});
				questionLocate.removeClass(removeSelector).addClass(addSelector);
			}
			if(inputs.attr('type')=='text'){
				const removeSelector = inputs.val() ? 'w3-pale-red' : 'w3-pale-green',
					addSelector = inputs.val() ? 'w3-pale-green' : 'w3-pale-red';
				questionLocate.removeClass(removeSelector).addClass(addSelector);
				
			}
		}
	}