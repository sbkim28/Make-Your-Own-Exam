module.exports = (app,examDTO)=>{
	app.get('/',(req,res,next)=>{
		examDTO.find().sort({dateCreated:-1}).exec((err,data)=>{
			if(err) return next(err);
			res.render('index',{list:data});
		});
	});
	app.get('/new',(req,res)=>{
		const _dto = new examDTO();
		_dto._id = null;
		res.render('new',{item:_dto});
	});
	app.post('/new',(req,res,next)=>{
		if(req.body.intIndex != req.body.list.length) return next(new Error('invalid Index'));
		const _dto = new examDTO(req.body);
		_dto.save((err)=>{
			if(err) return next(err);
			res.json({success:true});
		});
	});
	app.get('/edit/:id',(req,res,next)=>{
		examDTO.findById(req.params.id,(err,data)=>{
			if(err) return next(err);
			if(!data) return next(new Error('Cannot Find Data'));
			res.render('new',{item:data});
		});
	});
	app.post('/edit/:id',(req,res,next)=>{
		if(req.body.intIndex != req.body.list.length) return next(new Error('invalid Index'));
		examDTO.update({_id:req.params.id},{$set:req.body},(err)=>{
			if(err) return next(err);
			res.json({success:true});
		});
	});
	app.post('/exam',(req,res,next)=>{
		examDTO.findById(req.body.id,(err,data)=>{
			if(err) return next(err);
			if(!data) return next(new Error('Cannot find Data'));
			res.render('exam',{item:data});
		});
	});
	app.post('/questions',(req,res,next)=>{
		if(!Number.isInteger(req.body.index*1)) return next(new Error('index should be integer'));
		const _dto = new examDTO();
		_dto._id = null;
		for(let i=0;i<req.body.index*1;i++){
			_dto.list.push({question:null,type:null,isMulti:null,answers:[],points:null,casSensitive:null,isKeyWord:null,choices:[]});
		}
		if(req.body.id){
			examDTO.findById(req.body.id,(err,data)=>{
				if(err) return next(err);
				if(!data) return next(new Error('Cannot Find Data'));
				if(req.body.index != data.intIndex){
					return res.render('question_list',{index:req.body.index*1,item:_dto});
				}
				return res.render('question_list',{index:req.body.index*1,item:data});
			});
		}else{
			return res.render('question_list',{index:req.body.index*1,item:_dto});
		}
	});
	app.post('/get/detail',(req,res,next)=>{
		examDTO.findById(req.body.id,(err,data)=>{
			if(err) return next(err);
			if(!data) return next(new Error('Cannot Find Data'));
			res.render('detail',{item:data});
		});
	});
	app.post('/get/question',(req,res,next)=>{
		examDTO.findById(req.body.id,(err,data)=>{
			if(err) return next(err);
			if(!data) return next(new Error('Cannot Find Data'));
			res.render('question',{item:data.list[req.body.index-1],index:req.body.index});
		});
	});
	app.post('/delete',(req,res,next)=>{
		examDTO.remove({_id:req.body.id},(err)=>{
			if(err) return next(err);
			res.json({success:true});
		});
	});
	app.post('/check/answers',(req,res,next)=>{
		const answers = req.body.answers;
		if(!Array.isArray(answers)) return next(new Error('Answers should be an array'));
		examDTO.findById(req.body.id,(err,data)=>{
			if(err) return next(err);
			if(!data) return next(new Error('Cannot Find Data'));
			if(answers.length != data.intIndex) return next(new Error('Invalid length size'));
			let total = 0,
				correct = 0,
				all = 0;
			data.list.forEach(function(item,index){
				if(item.type == 0){
					let answer = answers[index],
						corAnswer = item.answers;
					if(!item.caseSensitive){
						answer = answer.toUpperCase();
						corAnswer.forEach(function(item,index){
							corAnswer[index] = item.toUpperCase();
						});
					}
					if(item.isKeyWord){
						let isNot = false;
						console.log(corAnswer);
						let spliceIndex =[]
						corAnswer.forEach(function(a,i){
							const splitA = a.split('-split=');
							if(splitA.length!=1||splitA[0]=='NOT'){
								if(answer.indexOf(splitA[1])!=-1){
									isNot = true;
									return false;
								}
								spliceIndex.push(i);
							}
						});
						spliceIndex.forEach(function(i){
							corAnswer.splice(i,1);
						});
						console.log(corAnswer); // debug
						if(!isNot){
							if(item.containsAll){
								if(corAnswer.every(function(a){
									return answer.indexOf(a) != -1;
								})){
									correct++;
									total += item.points;
								}
							}else{
								if(corAnswer.find(function(a){
									return answer.indexOf(a) != -1;
								})){
									correct++;
									total+=item.points;
								}
							}
						}
					}else{
						if(corAnswer.indexOf(answer)!=-1){
							correct++;
							total += item.points;
						}
					}
				}else{
					if(item.isMulti){
						if(item.answers.sort().toString() == answers[index].sort().toString()){
							correct++;
							total += item.points;
						}
					}else{
						if(item.answers[0]==answers[index]){
							correct++;
							total += item.points;
						}
					}
				}
				all += item.points
			});
			res.json({correct:correct,total:total,all:all});
		});
	});
};