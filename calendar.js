window.onload = function(){
	var d1 = new date('#day');
	d1.init({   //配置参数
		weekType : ["天","一","二","三","四","五","六"],
		//year:2017,
		//month:11,
		tdClick:function(result){
			console.log(result)
		}
	});

	var d2 = new date('#day2');
	d2.init({   //配置参数
		weekType : ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],
		//year:2017,
		//month:11,
		tdClick:function(result){
			console.log(result)
		}
	});
}

function date(parent){

	this.oParent = document.querySelector(parent);

	this.oHead = null;
	
	this.settings = {   //默认参数
		weekType : ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		tdClick:function(){}
	};

	this.days = null;
	this.prevDays = null;
	this.n = null;
	this.rowNum = null;
	this.table = null;
	this.tbody = null;
	this.oYear = null;
	this.oMonth = null;	
}

date.prototype.init = function( opt ){

	extend( this.settings , opt );

	this.create();
	this.prevMonth();
	this.nextMonth();
	this.confirmBtn();
	this.tdClick();
};

date.prototype.create = function(){

	/* 创建头部 */
	this.oHead = document.createElement('div');
	this.oHead.className = 'date_act';
	this.oHead.innerHTML = '<a class="date_act_btn date_prev" href="javascript:;"><</a><div class="date_date"><input id="date_year" type="text" value="'+  this.settings.year +'">年<input id="date_month" type="text" value="'+ this.settings.month+ '">月<button id="dateconfirm">确定</button></div><a class="date_act_btn date_next" href="javascript:;">></a>';
	
	this.oParent.appendChild( this.oHead );
	this.oYear = this.oHead.querySelector('#date_year');
	this.oMonth = this.oHead.querySelector('#date_month');

	this.table = document.createElement('table');
	this.tbody = document.createElement('tbody');
	this.table.className = 'date';
	var html = '<thead><tr>';
	for (var i = 0; i < this.settings.weekType.length; i++) {
		html += "<th>"+this.settings.weekType[i]+"</th>";
	}
	html += "</tr></thead>";
	this.table.innerHTML = html;
	this.oParent.appendChild( this.table );

	this.createTd();	
};
date.prototype.createTd = function(){
	this.tbody.innerHTML = '';

	//当前月份
	this.days = new Date(this.settings.year,this.settings.month,0).getDate();          //获取天数
	this.n = new Date(""+this.settings.year+","+this.settings.month+",1").getDay();    //获取某一天星期几
	this.rowNum = Math.ceil(this.days/7);                                              //设置行数

	//上一月
	var prevYear = this.settings.year;
	var prevMonth = this.settings.month-1;
	this.prevDays = new Date(prevYear,prevMonth,0).getDate(); 
	if ( prevMonth < 1 ) {
		prevMonth = 12;
		prevYear-=1;
	}
	console.log(prevYear,prevMonth)
	
	if ( this.rowNum*7-this.n >= this.days ) {
		this.rowNum = Math.ceil(this.days/7);
	}else{
		this.rowNum = Math.ceil(this.days/7)+1;
	}

	for (var i = 0; i < this.rowNum; i++) {
		var tr = document.createElement("tr");
		for (var j = 0; j < 7; j++) {
			var td = document.createElement("td");
			var num = i*7+j-(this.n-1);
			
			if ( num<1 ) {

				//填充上一月
				td.innerHTML = num+new Date(this.settings.year,this.settings.month-1,0).getDate();
				td.style.color = '#999';
				td.className = 'prev';

			}else if( num>=1 && num<=this.days ){
				td.innerHTML = num;
				td.className = 'cur';

				//当前日期添加样式
				if ( td.innerHTML == new Date().getDate() ) {
					td.className += ' on';
				}
			}else {

				//填充下一月
				td.innerHTML = num-this.days;
				td.style.color = '#999';
				td.className = 'next';

			}
			tr.appendChild(td);
		}
		this.tbody.appendChild(tr);
	}
	this.table.appendChild(this.tbody);
}
date.prototype.prevMonth = function(){
	var datePrev = this.oHead.querySelector('.date_prev');
	var _this = this;

	datePrev.onclick = function(){
		_this.settings.month --;
		if ( _this.settings.month < 1 ) {
			_this.settings.month = 12;
			_this.settings.year --;
		}
		_this.oYear.value = _this.settings.year;
		_this.oMonth.value = _this.settings.month;
		_this.createTd();
	}
}
date.prototype.nextMonth = function(){
	var dateNext = this.oHead.querySelector('.date_next');
	var _this = this;

	dateNext.onclick = function(){
		_this.settings.month ++;
		if ( _this.settings.month > 12 ) {
			_this.settings.month = 1;
			_this.settings.year ++;
		}
		_this.oYear.value = _this.settings.year;
		_this.oMonth.value = _this.settings.month;
		_this.createTd();
	}
}
date.prototype.confirmBtn = function(){
	var dateconfirm = this.oHead.querySelector('#dateconfirm');
	var _this = this;

	dateconfirm.onclick = function(){
		_this.settings.year = _this.oYear.value;
		_this.settings.month = _this.oMonth.value;
		_this.createTd();
	}
}
date.prototype.tdClick = function(){
	var _this = this;
	var td = _this.tbody.getElementsByTagName('td');
	
	this.tbody.onclick = function(e,result){
		e = event || window.event;
		if (e.target.innerHTML!='') {
			for (var i = 0; i < td.length; i++) {
				td[i].className='';
			}
			e.target.className = 'on';
			result = [_this.oYear.value,_this.oMonth.value,e.target.innerHTML];
			_this.settings.tdClick(result);
		}
	}
}

function extend(obj1,obj2){
	for(var attr in obj2){
		obj1[attr] = obj2[attr];
	}
}