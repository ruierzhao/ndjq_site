$(document).ready(function () {
	/**
 * 登录注册
 */
	function num($el) {
		return parseInt($el.attr("data"));
	}

	$('#login').click(function () {
		$('#dlu').modal('show')
		$('.log-right').hide()
		$('.log-left').show(500)
		$('#dlu .err').hide()
		return false;
	});
	$('#register').click(function () {
		$('#dlu').modal('show');
		$('.log-left').hide();
		$('.log-right').show(500)
		return false;
	});

	$('#nodenglu').on({
		mouseenter: function () {
			$(this).children().html("去登陆")
		},
		mouseleave: function () {
			$(this).children().html("还未登陆")
		},
		click: function () {
			$('#login').click()
		}
	})

	var emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
	var nickNameReg = /^[\da-zA-Z_\u4e00-\u9f5a]{3,12}$/;
	var valid_count = 0

	function isValid($elBlur, $eltoggle, reg, callback) {
		$elBlur.blur(function () {
			$eltoggle.hide()
			$elBlur.removeClass('erroutline')

			var val = $elBlur.val().trim()
			var Bool = reg.test(val)
			if (!Bool) {
				$elBlur.attr("data", "0")
				$eltoggle.show()
				$elBlur.addClass('erroutline')
			} else {
				callback(val)
			}
		})
	}

	isValid($('#renknm'), $('#nknmerr'), nickNameReg, function (val) {
		$('#empty').hide()
		$.get("/queryNkname", { nickname: val }, function (rst) {
			//验证nickname是否存在

			if (rst.status_code === 0) {
				$('#reptnickname').show()
				$('#renknm').addClass('erroutline')
			} else if (rst.status_code === 1) {
				$('#dberr').show()
			} else {
				$('#renknm').removeClass('erroutline')
				$('#reptnickname').hide()
				$('#renknm').attr("data", "1")
			}
		})
	})

	isValid($('#emailreg'), $('#reptregemail'), emailReg, function (val) {
		$('#empty').hide()
		$.get("/queryEmail", { email: val }, function (rst) {
			//验证邮箱是否存在
			if (rst.status_code === 0) {
				$('#reptemail').show()
				$('#emailreg').addClass('erroutline')
				$('#emailreg').attr("data", "0")
			} else if (rst.status_code === 1) {
				$('#dberr').show()
				$('#emailreg').attr("data", "0")
			} else {
				$('#emailreg').removeClass('erroutline')
				$('#reptemail').hide()
				$('#emailreg').attr("data", "1")
			}
		})
	})

	$('#rgpswd').blur(function () {
		$('#rgpswd').removeClass('erroutline')
		$('#empty').hide()
		$('#pswderr').hide()

		var rgpswdVal = $('#rgpswd').val().trim()

		if (rgpswdVal) {

			if (rgpswdVal.length < 8) {
				$('#rgpswd').attr("data", "0")
				$('#pswderr').show()
				$('#rgpswd').addClass('erroutline')
			} else {
				$('#rgpswd').attr("data", "1")
				$('#rergpswd').blur()
			}
		}
	})

	$('#rergpswd').blur(function () {
		$('#rergpswd').removeClass('erroutline')
		$('#reptpswd').hide()
		$('#empty').hide()

		var rgpswdVal = $('#rgpswd').val()
		rgpswdVal = rgpswdVal.trim()

		if (rgpswdVal) {

			var rergpswdVal = $('#rergpswd').val().trim();

			if (rergpswdVal !== rgpswdVal) {
				$('#rergpswd').attr("data", "0")
				$('#reptpswd').show()
				$('#rergpswd').addClass('erroutline')
			} else {
				$('#rergpswd').attr("data", "1")
				$('#rergpswd').removeClass('erroutline')
				$('#reptpswd').hide()
			}
		}
	})
	function addon2Click() {
		var data = num($('#emailreg'))
		var i = 90
		if (data === 0) {
			$('#reptemail').show()
			$('#emailreg').addClass('erroutline')
		} else {
			var email = $('#emailreg').val().trim()
			$.post("/authcode", { email: email }, function (rst) {
				if (rst.status_code === 0) {
					//发送成功
					$('#addon2').addClass("disabled")
					$('#addon2').off("click")
					$('#rgauthcode').show()
				}
			})
			var timer = setInterval(() => {
				i--;
				$('#addon2').text(i + "秒后重发")

				if (i <= 0) {
					clearInterval(timer)
					$('#addon2').text("重发")
					$('#addon2').removeClass("disabled")
					$('#addon2').on("click", addon2Click)
				}
			}, 1000);
			setTimeout(() => {
				$('#rgauthcode').hide(1000)
			}, 8000);
		}
	}
	$('#addon2').on("click", addon2Click)

	//注册
	$('#registerlogin').click(function (e) {
		e.preventDefault()
		valid_count = num($('#rergpswd')) + num($('#rgpswd')) + num($('#renknm')) + num($('#emailreg'))

		if (valid_count !== 4) {
			$('#empty').show()
		} else {
			var nickname = $('#renknm').val().trim()
			var email = $('#emailreg').val().trim()
			var pswd = $('#rgpswd').val().trim()
			var authcode = $('#addon1').val().trim()
			var formBody = { nickname: nickname, email: email, pswd: pswd, authcode: authcode }
			$.ajax({
				type: "post",
				url: '/register',
				data: formBody,
				dataType: 'json',
				success: function (rst) {
					if (rst.status_code === 0) {
						$('#sucsregister').show()
					} else if (rst.status_code === 1) {
						$('#dberr').show()
					} else {
						$('#countlimit').show()
					}
				}
			})
		}
	})
	//登录
	$('#dengluLogin').on("submit", function (e) {
		e.preventDefault()
		var formBody = $(this).serialize()
		$.post("/login", formBody, function (rst) {
			//登录验证	
			if (rst.status_code === 0) {
				window.location.href = "/"
			} else if (rst.status_code === 1) {
				$('#dberr').show()
			} else {
				$('#nkname_email_err').show()
			}

		})
	})
	$('#goregister').click(function (e) {
		e.preventDefault()
		$('.log-left').hide();
		$('#dlu .err').hide()
		$('#dlu .sucs').hide()
		$('.log-right').show(500);
	});
	$('#gologin').click(function (e) {
		e.preventDefault()
		$('.log-right').hide();
		$('#dlu .err').hide()
		$('#dlu .sucs').hide()
		$('.log-left').show(500);
	});
/**
 * 登录注册
 */
	setInterval(function () {
		//设置开始时间
		var startTime = new Date(2020, 4, 20, 0, 0, 0)
		//获取现在时间
		var dt = new Date();
		var y = dt.getFullYear(),
			m = dt.getMonth() + 1,
			d = dt.getDate(),
			h = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours(),
			i = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes(),
			s = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
		//计算时间差
		var diff = (dt - startTime) / 1000,
			day = Math.floor(diff / (24 * 3600)),
			dayRestDiff = diff % (24 * 3600),
			hours = Math.floor(dayRestDiff / 3600),
			hoursRestDiff = dayRestDiff % 3600,
			minutes = Math.floor(hoursRestDiff / 60),
			mintesRestDiff = hoursRestDiff % 60,
			seconds = Math.round(mintesRestDiff);
		//渲染
		$('#sustain').html(day + '&nbsp;天&nbsp;' + hours + '&nbsp;小时&nbsp;' + minutes + '&nbsp;分钟&nbsp;' + seconds +'&nbsp;秒&nbsp;')
		$('.year').html(y);
		$('.mon').html(m);
		$('.day').html(d);
		$('.hours').html(h);
		$('.minutes').html(i);
		$('.seconds').html(s);
	}, 1000);


	// 鼠标点击
	// !(function () {
	// 	// 定义数组
	// 	var wenzi = ["❤ZHAO❤", "❤YUN❤", "❤LOVE❤", "❤YANG❤", "❤WEN❤", "❤FOR❤", "❤EVER❤", "❤Python❤", "❤Css❤", "❤Javascript❤", "❤HTML❤",];
	// 	var wenzi_len = wenzi.length;

	// 	//获取数组内字符串并生成DOM
	// 	function getSpan(x, y) {
	// 		var r1 = rand(0, 255);
	// 		var b1 = rand(100, 180);
	// 		var g1 = rand(0, 200);
	// 		var fz = rand(18, 30);
	// 		var oy = rand(150, 250);
	// 		var rtime = rand(1500, 3000);

	// 		var arrindex = rand(0, wenzi_len);
	// 		var str = wenzi[arrindex];

	// 		var span = document.createElement("span");
	// 		document.body.append(span);
	// 		span.textContent = str;  // 等价与 span.innerHTML = str;

	// 		//设置插入span动画
	// 		$(span).css({
	// 			"z-index": 99,
	// 			'color': 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')',
	// 			"top": y - 30,
	// 			"left": x,
	// 			"position": "absolute",
	// 			"font-weight": "bold",
	// 			"font-size": fz,
	// 		});
	// 		$(span).animate({
	// 			"top": y - oy,
	// 			"opacity": 0
	// 		},
	// 			rtime,
	// 			function () {
	// 				$(span).remove();
	// 			});
	// 	}
	// 	// 文档点击事件
	// 	window.onclick = function (e) {
	// 		var curx = e.pageX || e.clientX + scrollX;
	// 		var cury = e.pageY || e.clientY + scrollY;
	// 		getSpan(curx, cury);
	// 	};
	// })()
	//鼠标点击


	//modalSearch搜索功能
	$("#modalSearch").click(function () {
		$('#insertmodal h3').remove();

		let searchtext = $('#nav_search').val();
		//去除字符串空格
		let strstrim = searchtext.replace(/^\s+|\s+$/g, "");
		//判断字符串是否为空
		if (strstrim) {
			if (strstrim == "荔枝") {
				$('#publicModal1').modal('show');
				publicModalRandShow()
			} else {
				$('#navsearchModal1').modal('show');
				let str = "你搜索的关键词是:" + strstrim;
				//插入modal中
				let modal_h3 = $('<h3></h3>').text(str);
				$('#insertmodal').prepend(modal_h3);
				return false;
			}
		} else {
			$('#navsearchModal2').modal('show');
		}
	})
	//input获得焦点时选中文本
	$("#nav_search").focus(function () {
		this.select();
	})

	$("#lizhi").click(function () {
		$('#publicModal1').modal('show')
		publicModalRandShow()
	})

	// 产生随机数
	function rand(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
	//小彩蛋
	function publicModalRandShow() {
		var arrText = [
			"一骑红尘妃子笑，无人知是荔枝来。",
			"锦江近西烟水绿，新雨山头荔枝熟。",
			"子规啼破城楼月。画船晓载笙歌发。",
			"玉雪肌肤罩绛纱。可怜生处是天涯。",
			"赌上我的生命为你所拥有",
			"呐，你吃荔枝皮吧"]
		var arrImg = [
			"/public/img/lizhi1.jpg",
			"/public/img/lizhi2.jpg",
			"/public/img/lizhi3.jpg",
			"/public/img/lizhi4.jpg"
		]
		var indexT = rand(0, arrText.length)
		var indexI = rand(0, arrImg.length)
		$('#publicModal1 h3').html(arrText[indexT])
		$('#publicModal1 img')[0].src = arrImg[indexI]
	}

	/**
	 * 坐标转换
	 */
	//获取DOM元素
	var prest_coor = document.getElementById('prest_coor'),
		prest_opt = document.getElementById('prest_opt'),
		trans = document.getElementById('trans'),
		dest_coor = document.getElementById('dest_coor'),
		dest_opt = document.getElementById('dest_opt');
	var prest_arr = [];
	transW = {
		g_w: (inputarr) => {
			return gcoord.transform(inputarr, gcoord.GCJ02, gcoord.WGS84)
		},
	}
	//转换WGS84
	prest_coor.onblur = function () {
		coor = this.value;
		coor = coor.trim();
		if (!coor.match(/\d{1,},\d{1,}/) && coor !== "") {
			alert('坐标格式错误！请检查。')
			this.select();
		} else {
			prest_arr = coor.split(',');
		}
	}

	trans.onclick = function () {
		var pc_s = prest_opt.value,
			dc_s = dest_opt.value;
		prest_coor.onblur();
		var result = transW.g_w(prest_arr);
		var result_dcoor = result.join(',');
		dest_coor.value = result_dcoor;
	}
	/**
	 * 坐标转换
	 */
	
	//内容区切换
	//群照片切换
	$('#qun').on({
		mouseenter:function () {
			$('.qunimg').stop().show(400)
		},
		mouseleave:function () {
			$('.qunimg').stop().hide(400)

		},
	})
	let qunimgi = 1
	$('#qun').click(function () {
		if (qunimgi%2 == 0) {
			$('#qun').on("mouseleave", function(){
				$('.qunimg').stop().hide(400)
			})
		}else{
			$('#qun').off("mouseleave")
		}
		qunimgi++
	})
	
	$('.content-panel').eq(0).show();
	$($(".top-navbar")[0]).addClass('active')
	function cee($dji, $tgt) {
		$dji.each(function (i, item) {
			$(item).click(function () {
				$tgt.hide();
				$tgt.eq(i).show(500);

				$(this).siblings('li').removeClass('active');
				$(this).addClass('active');
				return false;
			})
		})
	}
	cee($(".top-navbar"), $('.content-panel'))
	//内容区切换

	// 把时间戳转换成日期格式
	function tran_time(dt) {
		// dt = dt || (new Date(dt))
		var y = dt.getFullYear() || dt.getYear(),
			m = dt.getMonth() + 1,
			d = dt.getDate(),
			h = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours(),
			i = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes(),
			s = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
		return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
	}

	/**
	 * 留言
	 */
	$("#liuyan1").focus(function () {
		this.select();
	});
	//留言 滚动监听
	$('body').scrollspy({ target: '#conments' });
	var show_counts;
	//提交留言并重新渲染页面
	$('#fabiao1').click(function () {
		var xtime = (new Date()).getTime()
		var liuyan1 = $('#liuyan1').val()
		liuyan1 = liuyan1.trim()

		if (liuyan1) {
			$.post('/publish',
				{ "time": xtime, "content": liuyan1 },
				function (rst) {
					if (rst.status_code === 0) {
						show_counts = rst.show_counts
						var xinyuDOM = '<div class="panel panel-default removeComments">' +
							'<div class="panel-heading">' +
							'<p class="panel-title">心语时间:<span class="xtime">' + xtime +
							'</span></p></div><div class="panel-body xcontent">' + liuyan1 + '</div></div>'
						$('#comments').prepend(xinyuDOM)
						$('.removeComments:last-child').remove()
						$(".page ul li:first").remove()
						$(".page ul li:last").remove()
						window.alert("保存成功！")
					} else if (rst.status_code === 1) {
						window.alert("保存失败！数据库错误。刷新试试。")
					} else {
						$('#fabiao1').addClass("disabled");
						window.alert("保存失败！不想存，别试了")
					}
				})
		}else{
			window.alert("未输入内容！")
		}
	});

	//点击切换留言页
	$('.cur-page').each(function (i, item) {
		$(item).click(function (e) {
			e.preventDefault()
			var cur_page = parseInt(this.text)
			$.get("/page", { page: cur_page }, function (rst) {

				if (rst.row.length !== 0) {
					$('.removeComments').remove()
					
					rst.row.forEach(function (item, i) {
						$('.xcontent').html()
						var xinyuDOM = '<div class="panel panel-default removeComments">' +
							'<div class="panel-heading">' +
							'<p class="panel-title">心语时间:<span class="xtime">' + tran_time(new Date(item.time)) +
							'</span></p></div><div class="panel-body xcontent">' + item.content + `</div></div>`
						$('#comments').append(xinyuDOM)
					})
				}
			})
		})
	})
	$('.cur-page').eq(0).click()
	show_counts = show_counts ? show_counts : parseInt($(".cur-page:last").html())
	$(".pageNext").click(function () {
		$(".cur-page").each(function(i, item) {
			var next = parseInt($(item).html()) + show_counts
			$(item).html(next)
		})
		if (parseInt($(".cur-page:first").html()) === 1) {
			$("#qian").hide()
		} else {
			$("#qian").show()
		}
		$(".pagePrev").removeClass('disabled')

	})
	$(".pagePrev").click(function () {
		$(".cur-page").each(function (i, item) {
			var prev = parseInt($(item).html()) - show_counts
			$(item).html(prev)
		})
		if (parseInt($(".cur-page:first").html())<1) {
			$(".pagePrev").addClass('disabled')
			$(".cur-page").each(function (i, item) {
				$(item).html(i+1)
			})
		}
		if (parseInt($(".cur-page:first").html()) === 1) {
			$("#qian").hide()
		} else {
			$("#qian").show()
		}
	})
	if (parseInt($(".cur-page:first").html()) === 1) {
		$("#qian").hide()
	}else{
		$("#qian").show()
	}
	/**
	 * 留言
	 */
/**
 * 切换文章
 */
	//加载中
	$("#articalShift").click(function () {
		$('#lodaing1').modal("show")
		$.get("https://v1.alapi.cn/api/mryw/random", function (rst) {
			if (rst.code === 200) {
				$('.luonjpg h1').html(rst.data.title)
				$('.arti').html(rst.data.content)
				$('#lodaing1').modal("hide")
			} else {
				$('#lodaing1').modal("hide")
				$('#popWindow').html("加载失败，请检查网络或稍后重试。")
				$('#lodaing2').modal("show")
			}
		})
	})
	//加载中
/**
 * 切换文章
 */


/**
 *	天气api
*/
$('#shuaxin').click(function () {
	// $('#weather_line').css({ "height": 350 + 'px' })

	var life;
	var cityId, ruie;
	var i = 0;
	$('#lodaing1').modal("show")
	var inputadd = $('#weatherAddress').val()
	var selectadd = $('.info select option:selected').val()
	var selectopt = $('.info select option:selected').text()
	var title = selectopt

	if (inputadd.length < 2 || inputadd.length >= 5) {
		cityId = selectadd
		i = 0
	} else {
		$.ajax({
			url: "/public/js/address.json",
			type: "get",
			async: false,
			success: function (rst) {
				
				ruie = rst.filter(function (item, i) {
					return (item[1] == inputadd)
				})
				if (ruie[0] && ruie[0].length !== 0) {
					cityId = ruie[0][0]
					title = inputadd
					i = 1
				} else {
					cityId = selectadd
					i = 2
				}
			}
		})
	}

	var url1 = 'https://api.help.bj.cn/apis/weather/?id=' + cityId,
		url2 = 'https://api.help.bj.cn/apis/weather6d/?id=' + cityId;

	$.get(url1, function (rst) {
		if (parseInt(rst.status) === 0) {
			switch (rst.weather) {
				case '晴':
					$('.weather').css({ 'background-image': 'url(/public/img/t_bg3.jpg)' });
					break;
				case '阴':
					$('.weather').css({ 'background-image': 'url(/public/img/t_bg1.jpg)' });
					break;
				case '雨':
					$('.weather').css({ 'background-image': 'url(/public/img/t_bg5.jpg)' });
					break;
				case '多云':
					$('.weather').css({ 'background-image': 'url(/public/img/t_bg4.jpg)' });
					break;
				default:
					$('.weather').css({ 'background-image': 'url(/public/img/t_bg3.jpg)' });
					break;
			}
			var temp = rst.temp + "℃";
			var weather_wind_humi = rst.weather + "/" + rst.wd + "/湿度" + rst.humidity;
			var pm25 = "PM2.5：" + rst.pm25;
			var wdforce = "风力：" + rst.wdforce;
			var updateWeather = rst.today + rst.uptime;
			$('.updateWeather').html(updateWeather);
			$('.wdforce').html(wdforce);
			$('.pm25').html(pm25);
			$('.temp').html(temp);
			$('.humidity').html(weather_wind_humi);
		}
	})

	$.get(url2, function (rst) {
		var lowtemp = [],
			xDate = [],
			hightemp = [];

		if (parseInt(rst.status) === 0) {
			rst.data.forecast.forEach(function (item, index) {
				var iop = item.date.split(' ')
				xDate.push(iop[0]);
				hightemp.push(item.temphigh);
				lowtemp.push(item.templow);
			})
			xDate.unshift(rst.data.yesterday.date.split(' ')[0])
			hightemp.unshift(rst.data.yesterday.temphigh)
			lowtemp.unshift(rst.data.yesterday.templow)
			life = rst.data.life

			$("#life").html("每日tip：" + life)


			var mycharts = echarts.init(document.getElementById('weather_line'))
			var option = {
				title: {
					text: title,
					left: "center",
					textStyle:{
						color: "#fff"
					}
				},
				tooltip: {
					trigger: 'axis'
				},
				grid: {
					left: '6%',
					right: '6%',
					bottom: '15%',
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
					axisLabel: {
						show: true,
						textStyle:{
							color: "#fff"
						}
					},
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
		}
		if (i == 0) {
			$('#lodaing1').modal("hide")
		} else if (i == 1) {
			$('#lodaing1').modal("hide")
			$('#lodaing2').modal("show")
			$('#popWindow').html("查询成功！")
		} else if (i == 2) {
			$('#lodaing1').modal("hide")
			$('#lodaing2').modal("show")
			$('#popWindow').html("抱歉，没有您输入的城市的数据。")
		}
	})
})
// shuaxin.click();
/**
*	天气api
*/

//文件上传下载
	fileInput.onchange = function () {
		$(".filename").text($("#fileInput").val().trim())
	}

	$("#up_load").click(()=>{
		$("#fileInput").click()
	})
	$("#shchuan").click(function () {
		var form = new FormData(document.getElementById("fileInput12345"));
		var tiqucode = $("#tiqucode").val().trim()
		
		if (tiqucode!= "ruier") {
			$("#shcode").text("管理员上传码错误！")
			$("#shcode").show()
		}else{
			$.ajax({
				type: "post",
				url: "/upload",
				data: form,
				processData: false,   // jQuery不要去处理发送的数据
				contentType: false,   // jQuery不要去设置Content-Type请求头
				success: (rst) => {
					if (rst.status_code===0) {
						$("#baocunsucs").show()
						$("#baocunsucs").text("保存成功，请务必记住提取码：" + rst.tiqcode)
						$("#shcode").hide()
					} else if(rst.status_code === 0){
						window.alert("保存失败!稍后再试。")
					}
				}
			})
		}
		
	})
	$("#tiquFile").click(()=>{
		var tiqucode = $("#tiqucode").val().trim()
		window.open('/download?tiqucode='+ tiqucode)
	})


})
