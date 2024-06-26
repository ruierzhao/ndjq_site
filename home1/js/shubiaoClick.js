function shubiaoClick(){
	// 定义数组
	var wenzi = ["❤ZHAO❤","❤YUN❤","❤LOVE❤","❤YANG❤","❤WEN❤","❤FOR❤","❤EVER❤","❤Python❤", "❤Css❤", "❤Javascript❤", "❤HTML❤",];
	var wenzi_len = wenzi.length;

	// 产生随机数
	function rand(min , max){
		return Math.floor(Math.random()*(max - min) + min);
	}

	//获取数组内字符串并生成DOM
	function getSpan(x,y) {
		var r1 = rand(0,255);
		var b1 = rand(100,180);
		var g1 = rand(0,200);
		var fz = rand(18,30);
		var oy = rand(150,250);
		var rtime = rand(1000,2500);

		var arrindex = rand(0 , wenzi_len);
		var str = wenzi[arrindex];

		var span = document.createElement("span");
		document.body.append(span);
		span.textContent = str;  // 等价与 span.innerHTML = str;

		//设置插入span动画
		$(span).css({
            "z-index": 99,
            'color':'rgb('+r1+','+g1+','+b1+')',
            "top": y - 30,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "font-size":fz
        });
        $(span).animate({
                "top": y - oy,
                "opacity": 0
            },
            rtime,
            function() {
                $(span).remove();
            });
	}

	//窗口随机显示节点
	function showSpan() {
		setInterval(function(){
			var ranx = rand(0 , window.innerWidth);
			var rany = rand(0 , window.innerHeight);
			getSpan(ranx,rany);
		},400);
	}
	showSpan();
	// 文档点击事件
	window.onclick = function (e){
		var curx = e.clientX;
		var cury = e.clientY;
		getSpan(curx,cury);
	}
}
