$(document).ready(function(){
	/**
	*	天气api
	*/
	$('#shuaxin').click(function() {
		var cityId = parseInt($('.info select option:selected').val());

		var url1 = 'https://api.help.bj.cn/apis/weather/?id=' + cityId,
		    url2 = 'https://api.help.bj.cn/apis/weather6d/?id=' + cityId;

		$.get(url2,function (rst) {
			var lowtemp = [],
				xDate = [],
				hightemp =[];

			if (parseInt(rst.status)===0) {
				rst.data.forecast.forEach(function(item, index){
					var iop = item.date.split(' ')
					xDate.push(iop[0]);
					hightemp.push(item.temphigh);
					lowtemp.push(item.templow);
				})
				xDate.unshift(rst.data.yesterday.date.split(' ')[0])
				hightemp.unshift(rst.data.yesterday.temphigh)
				lowtemp.unshift(rst.data.yesterday.templow)
				life = rst.data.life

				var mycharts = echarts.init(document.getElementById('weather_line'))
				var option = {
				    tooltip: {
				        trigger: 'axis'
				    },
				    grid: {
				        left: '6%',
				        right: '6%',
				        bottom: '10%',
				        containLabel: true
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: xDate
				    },
				    yAxis: {
				        type: 'value',
				    },
				    series: [
				        {
				            name: '最高温度',
				            type: 'line',
				            data: hightemp
				        },
				        {
				            name: '最低温度',
				            type: 'line',
				            data: lowtemp
				        }
				    ]
				};

				mycharts.setOption(option);
				window.addEventListener("resize", function () {
			        mycharts.resize();
			    });
			}else{
				window.alert("请求错误！")
			}
		})

		$.get(url1,function (rst) {
			if (parseInt(rst.status)===0) {
				switch (rst.weather) {
					case '晴':
						 $('.weather').css({'background-image':'url(../img/t_bg3.png)'});
						break;
					case '阴':
						$('.weather').css({'background-image':'url(../img/t_bg4.jpg)'});
						break;
					case '雨':
						$('.weather').css({'background-image':'url(../img/t_bg5.jpg)'});
						break;
				}
				var temp = rst.temp + "℃";
				var weather_wind_humi =rst.weather+ "/" + rst.wd + "/湿度" +rst.humidity;
				var pm25 = "PM2.5：" + rst.pm25;
				var wdforce = "风力：" + rst.wdforce;
				var update = rst.today + rst.uptime;
				$('.update').html(update);
				$('.wdforce').html(wdforce);
				$('.pm25').html(pm25);
				$('.temp').html(temp);
				$('.humidity').html(weather_wind_humi);
			}else{
				window.alert("请求错误！")
			}

		})
	})
	shuaxin.click();
	/**
	*	天气api
	*/

	setInterval(function() {
		//设置开始时间
		var startTime = new Date(2020,3,23,0,0,0)
		//获取现在时间
		var dt = new Date();
		var y = dt.getFullYear(),
			m = dt.getMonth() + 1,
			d = dt.getDate(),
			h = dt.getHours()<10 ? "0" + dt.getHours() : dt.getHours(),
			i = dt.getMinutes()<10 ? "0" + dt.getMinutes() : dt.getMinutes(),
			s = dt.getSeconds()<10 ? "0" + dt.getSeconds() : dt.getSeconds();
		//计算时间差
		var diff = (dt-startTime)/1000,
			day = Math.floor(diff/(24*3600)),
			dayRestDiff = diff%(24*3600),
			hours = Math.floor(dayRestDiff/3600),
			hoursRestDiff = dayRestDiff%3600,
			minutes = Math.floor(hoursRestDiff/60),
			mintesRestDiff = hoursRestDiff%60,
			seconds = Math.round(mintesRestDiff);
		//渲染
		// $('#sustain').html(day + '&nbsp;天&nbsp;' + hours + '&nbsp;小时&nbsp;' + minutes + '&nbsp;分钟&nbsp;' + seconds +'&nbsp;秒&nbsp;')
		// $('.year').html(y);
		// $('.mon').html(m);
		// $('.day').html(d);
		// $('.hours').html(h);
		// $('.minutes').html(i);
		// $('.seconds').html(s);
	},1000);
	// 把时间戳转换成日期格式
	function tran_time(dt){
		var y = dt.getFullYear(),
	    	m = dt.getMonth() + 1,
			d = dt.getDate(),
			h = dt.getHours()<10 ? "0" + dt.getHours() : dt.getHours(),
			i = dt.getMinutes()<10 ? "0" + dt.getMinutes() : dt.getMinutes(),
			s = dt.getSeconds()<10 ? "0" + dt.getSeconds() : dt.getSeconds();
			return y +'-'+ m + '-'+ d +' '+h+':'+i+':'+s;
	}
	// 产生随机数
	function rand(min , max){
		return Math.floor(Math.random()*(max - min) + min);
	}
	// 鼠标点击
	!(function(){
		// 定义数组
		var wenzi = ["❤ZHAO❤","❤YUN❤","❤LOVE❤","❤YANG❤","❤WEN❤","❤FOR❤","❤EVER❤","❤Python❤", "❤Css❤", "❤Javascript❤", "❤HTML❤",];
		var wenzi_len = wenzi.length;


		//获取数组内字符串并生成DOM
		function getSpan(x,y) {
			var r1 = rand(0,255);
			var b1 = rand(100,180);
			var g1 = rand(0,200);
			var fz = rand(18,30);
			var oy = rand(150,250);
			var rtime = rand(1500,3000);

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
	            "font-size":fz,
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
		// 文档点击事件
		window.onclick = function (e){
			var curx = e.pageX || e.clientX + scrollX;
			var cury = e.pageY || e.clientY + scrollY;
			getSpan(curx,cury);
		};
	})()

	//留言 滚动监听
	$('body').scrollspy({ target:'#conments' });


})
