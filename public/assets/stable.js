// ==UserScript==
// @name           Auto-send munk
// @description    Sends data instantly to cosbybot and munk
// @include        http://utopia-game.com/*
// @version        1.30
// @grant          GM_xmlhttpRequest
// ==/UserScript==
// @updateURL 	http://snuggles.umunk.net/munk.user.js
// Changelog:
// v1.3: Added live updating and spells.
// v1.1: new bugfix
// v1: new
// v0.31: Bugfix
// v0.3: Send only to munk
// v0.25: Added munk support
// v0.2: Initial release for Age 59
// v0.21: Fixed issue with Ultima users not being able to send self spells.

//console.log('dev version!');

var scripts = document.getElementsByTagName('script');
var myScript = scripts[ scripts.length - 1 ];

var queryString = myScript.src.replace(/^[^\?]+\??/,'');

var ca = document.cookie.split(';');
testtest = Array();
for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    c_name = c.substring(0, c.indexOf("="));
    // console.log(c,c.substring(0, c.indexOf("=")));
    if ($.inArray(c_name, testtest)!=-1) {
        setCookieOld(c_name, '',-1);
    } else {
        testtest.push(c_name);
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + ";domain=."+document.domain+";path=/";
}

function setCookieOld(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value ;
}

function copyToClipboard() {
    clipboardtext = clipboardtemp;
    window.prompt("Copy to clipboard: Ctrl+C, Enter", clipboardtext);
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function getCookie2(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return null;
}

//var params = parseQuery( queryString );

function parseQuery ( query ) {
  var Params = new Object ();
  if ( ! query ) return Params; // return empty object
  var Pairs = query.split(/[;&]/);
  for ( var i = 0; i < Pairs.length; i++ ) {
    var KeyVal = Pairs[i].split('=');
    if ( ! KeyVal || KeyVal.length != 2 ) continue;
    var key = unescape( KeyVal[0] );
    var val = unescape( KeyVal[1] );
    val = val.replace(/\+/g, ' ');
    Params[key] = val;
  }
  return Params;
}

function getBodyhtml(win) {
    var source = document.documentElement.innerHTML;
    return source;
}

function getBodyText_umunk(win) {
    var doc = win.document,
        body = doc.body,
        selection, range, bodyText;
    if (body.createTextRange) {
        return body.createTextRange().text;
    } else if (win.getSelection) {
        selection = win.getSelection();
        // console.log("selection count0:" + selection.rangeCount );
        selection.removeAllRanges();
        // console.log("selection count1:" + selection.rangeCount );
        range = doc.createRange();
        referenceNode = document.getElementsByClassName("game-content")[0];
        range.selectNodeContents(referenceNode); //body
        selection.addRange(range);
        // console.log("selection count2:" + selection.rangeCount );
        bodyText = selection.toString();
        selection.removeAllRanges();
        return bodyText;
    }
}

function YourOnSubmitFn(token) {
 document.getElementById("signInForm").submit();
}

	 var allsuspects=document.getElementsByTagName('script');
	 //console.log(allsuspects.length);
	 //for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
	 for(var index in allsuspects) { 
	 	try {
			src = allsuspects[index].getAttribute('src') ;
		  	if (src) {
		  		if (src.match('stable.js')){ 
		  		//console.log('found js script '+ src.replace(/^[^\?]+\??/,'') );
		  		var params = parseQuery(src.replace(/^[^\?]+\??/,''));
		  		//console.log(params);
		  		break;
		  		}
		  		if (src.match('dev.js')){ console.log('found js script '+ src.replace(/^[^\?]+\??/,'') );
		  		var params = parseQuery(src.replace(/^[^\?]+\??/,''));
		  		//console.log(params);
		  		break;
		  		}
		  		//if (params) break;
		  	}
		} 	catch (err) {
				console.log('error5');
				console.log(index);
				console.log(err);
				
				 }

	 	
	  	//if (src.match('stable.js')) console.log('removed js script '+ src );
	  }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }

kddomain = params['kd'];

page_check = document.URL;
// console.log("PAGECHECK",page_check)
if (page_check.match("game/ranking")) {
    console.log('DO NOT LOAD HERE',page_check);
} else if (!page_check.match("(wol|gen)/(sit/)?game") && !page_check.match(/wol\/(possess\/\d+\/)?(sit\/)?game/g)) {
    console.log('DO NOT LOAD HERE',page_check);
} else {

    // Figure out server
    game_server = page_check.match("(wol|gen)/(sit/)?game")[1];


    if (!params['kd']) {kddomain = queryString;}

    // Note, jQ replaces $ to avoid conflicts.
    //alert("There are " + jQ('a').length + " links on this page.");

    // load jQuery and execute the main function

    //page = document.URL;


    var token = "";
    var page = document.URL;
    var send = false;

    var server_domain = window.location.hostname;

    

    var sendUrlBase = "//intel.utopia-game.com/parse/parse.php";
    var sendUrlBase2 = "//intel.utopia-game.com/parse/parse.php";
    var sendUrl;
    var version = 2.2;
    var extra = '';
    var newmsg = '';
    var page2 = '';
    var attackinfo = '';
    var clipboardtemp = getBodyhtml(window);
    var scrolllevel = 0;
    var topnow = 0;
    var ircnow = '';
    var lastdonate = new Date(2014,11,05,09);
    var lastdonator = 'Ekusas(a bit Sykin)'; 
    var donationping = ''; 
    var lastdonationping = 'hmm'; 
    var lastgoodop = 0;
    var latesthtml = '';
    var secret_api = '';
    var pwd_set = 0;
    var attack_calc_stuff = '';
    // console.log("COOKIE",getCookie("userpwd"));

    pwdcookie = decodeURIComponent(getCookie("userpwd"));

    secret_api = $("#munkbot_secret").attr("api");
    if(typeof secret_api !== "undefined") {
        secret_api = secret_api.replace(/\+/g,"PLUSPLUSPLUS");
        secret_api = secret_api.replace(/\=/g,"EQUALEQUAL");
        secret_api = secret_api.replace(/\%/g,"PERCENTPERCENT");
        setCookie('userpwd', secret_api,14);
        pwdcookie = secret_api;
    } else {
        console.log("no munkbot secret?!",getCookie("userpwd"));
    }
    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

    var time_loaded = new Date().getTime();

    // console.log('isMobile 2: '+isMobile);


  //   try {
		// 	if (getCookie("userpwd")) var pwdcookie = decodeURIComponent(getCookie("userpwd"));
		// } 	catch (err) {
		// 		console.log('Resetting pwd');
		// 		setCookie('userpwd', '',-1);
				
		// 		 }

	
	
	if(!getCookie("layout_throne")) setCookie('layout_throne',1,14);
    if(!getCookie("layout_nav")) setCookie('layout_nav',1,14);
    if(!getCookie("layout_kdpage")) setCookie('layout_kdpage',1,14);
    if(!getCookie("layout_hide_banner")) setCookie('layout_hide_banner',0,14);
    if(!getCookie("layout_confirm_attacks")) setCookie('layout_confirm_attacks',1,14);
    if(!getCookie("layout_bot")) setCookie('layout_bot',1,14);
    if(!getCookie("layout_irc")) setCookie('layout_irc',1,14);
    if(!getCookie("layout_ads")) setCookie('layout_ads',0,14);
    if(!getCookie("layout_range")) setCookie('layout_range',0,14);
    if(!getCookie("layout_smart")) setCookie('layout_smart',1,14);
    if(!getCookie("layout_munktheme")) setCookie('layout_munktheme',0,14);
    if(!getCookie("layout_warkd")) setCookie('layout_warkd',1,14);
    if(!getCookie("layout_kd_land")) setCookie('layout_kd_land',0,14);
    
    

    
    
    
 //    function removejscssfile(filename, filetype){
	//  var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; //determine element type to create nodelist from
	//  var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; //determine corresponding attribute to test for
	//  var allsuspects=document.getElementsByTagName(targetelement);
	//  for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
	//   if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1) {
	//    console.log('removed js script '+filename+' '+ allsuspects[i].getAttribute(targetattr) );
	//    allsuspects[i].parentNode.removeChild(allsuspects[i]); //remove element by calling parentNode.removeChild()
	//   }
	//  }
	// }

	// removejscssfile("/wol/static/common/css/ui-lightness/jquery-ui-1.8.21.custom.css", "css"); //remove all occurences of "somescript.js" on page
	// removejscssfile("/wol/static/external/jquery-wysiwyg/jquery.wysiwyg.css", "css"); //remove all occurences of "somescript.js" on page
	// removejscssfile("/wol/static/external/jquery-jgrowl/jquery.jgrowl.css", "css"); //remove all occurences of "somescript.js" on page
	
	
	// if (getCookie("layout_munktheme")=="1") {
	// 	removejscssfile($('link[rel*=style][href*="theme.css"]').attr('href'), "css"); //remove all occurences of "somescript.js" on page
	// 	$("head").append("<link id='yournewcss' href='//cmunk.github.io//theme.css' type='text/css' rel='stylesheet' />");
	// }



    
    function showbitcoin()  {
					var donatebit =  '<br><br>Please click the button below to donate via Paypal.<br>Donations go into the hosting costs / calling costs / my 100s of hours of time support developing utopiabot - I hope you enjoy it.<br>Donations should be in DKK to minimize my fees to paypal (Though I can deal with USD and EUR).<br> Thank you!<br><br>' +
								 '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">' +
								 '<input type="hidden" name="cmd" value="_s-xclick">' +
								 '<input type="hidden" name="hosted_button_id" value="SKJ8GSAPZS6Q2">' +
								 '<input type="hidden" name="lc" value="US">' +
                                 '<input type="hidden" name="amount" value="50.00">' +
                                 '<input type="hidden" name="item" value="umunk love">' +
								 '<input type="image" src="https://www.paypal.com/en_us/i/btn/x-click-but04.gif" border="0" width="62" name="submit" alt="PayPal - The safer, easier way to pay online!">' +
								 '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">' +
								 '</form>';

                    if (getCookie("userpwd")){
                        pwdcookie = decodeURIComponent(getCookie("userpwd"));
                        donate_user = pwdcookie.split("|")[0];
                       
                    } else {
                        donate_user = "unknown";
                    }

                    var donatebit =  '<br><br>Please click the button below to donate via Paypal.<br>Donations go into the hosting costs / calling costs / my 100s of hours of time support developing utopiabot - I hope you enjoy it.<br>Donations should be in DKK to minimize my fees to paypal (Though I can deal with USD and EUR).<br> Thank you!<br><br>' +
                                '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">' +
                                '<input type="hidden" name="cmd" value="_donations">' +
                                '<input type="hidden" name="business" value="QM9X83NRHY7PQ">' +
                                '<input type="hidden" name="lc" value="US">' +
                                '<input type="hidden" name="item_name" value="utopiabot (plz min. 50 DKK / Equivalent of $6 or 7)">' +
                                '<input type="hidden" name="no_note" value="0">' +
                                '<input type="hidden" name="cn" value="Please add your IRC nick and KD Name">' +
                                '<input type="hidden" name="no_shipping" value="1">' +
                                '<input type="hidden" name="currency_code" value="DKK">' +
                                '<input type="hidden" name="on0" value="kingdom">' +
                                '<input type="hidden" name="on1" value="user">' +
                                '<input type="hidden" name="os0" value="'+kddomain+'">' +
                                '<input type="hidden" name="os1" value="'+donate_user+'">' +
                                '<input type="hidden" name="notify_url" value="https://umunk.net/verify.php">' +
                                '<input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_SM.gif:NonHosted">' +
                                '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">' +
                                '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">' +
                                '</form>';
					$(".game-content").html(donatebit);	
					
					$.ajax({
				            type: "POST",
				            url: "//admin.umunk.net/chart.php",
				            data: "kd=" + kddomain
				        }).done(function (html) {
				        	//$('#botresponse').html($('#botcommand').val());
				        	//console.log(html);
				        	$(".game-content").append(html);
			        	});
							
			     }
    
	 age_start_timestamp = '1404669600';
	 age_start_timestamp = '1413222320';
	 age_start_timestamp = '1422295200';
     age_start_timestamp = '1422295200';
     age_start_timestamp = '1431363600';
	 age_start_timestamp = '1441299600';
     age_start_timestamp = '1452016800';
     age_start_timestamp = '1461085200';
     age_start_timestamp = '1481648400';
     age_start_timestamp = '1495558800';
     age_start_timestamp = '1502730000';
     age_start_timestamp = '1509987600';
     age_start_timestamp = '1517331600';
     age_start_timestamp = '1539018000';
     age_start_timestamp = '1673521500';
     age_start_timestamp = '1673924000';
     age_start_timestamp = '1676122000';
     age_start_timestamp = '1678379100';
     age_start_timestamp = '1679234800';
     age_start_timestamp = '1679927000';
     age_start_timestamp = '1679930800';
     age_start_timestamp = '1681132800';
     age_start_timestamp = '1682232300';
     age_start_timestamp = '1682361400';
     age_start_timestamp = '1683555200';
     age_start_timestamp = '1688745200';
     age_start_timestamp = '1695680300';
     age_start_timestamp = '1701876200';
     $.ajax({
            type: "POST",
            url: sendUrlBase2,
            data: "url=" + escape(document.URL) + "&pwd=" + pwdcookie + "&intelline=1&talk2bot=age_start_timestamp"
        }).done(function (html) {
            console.log("age_start_timestamp "+html);
            age_start_timestamp = html.trim();
        }); 
     
     function getUtopiaDate(uto_epoch) {
    	//var uto_epoch;
        // console.log(age_start_timestamp+" vs "+uto_epoch);
	 	var epoch_hour = 3600;
	 	var epoch_day = 86400;
	 	var epoch_week = 604800;
	 	var months = new Array("January","February","March","April","May","June","July");
	 	var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul");
	 	//var age_start = new Date(age_start_timestamp).getTime();
	 	var age_start = age_start_timestamp;
	 	//alert(age_start);
	 	//var offset = new Date().getTimezoneOffset();
	 	//age_start = age_start + offset*60*1000;
	 	//alert(age_start + " " + offset);
	 	var now = new Date().getTime();
	 	if (uto_epoch) {
	 		var now = uto_epoch/1000;
	 		if (uto_epoch<2000000000) now = now*1000;
	 	}
	 	var difference = now - age_start;
	 	if (difference<1) difference = 0;
	 	var year = Math.floor(difference/epoch_week);
	 	var year_rem = difference - (year*epoch_week);
	 	var day = Math.floor(year_rem/epoch_day);
	 	var day_rem = year_rem - (day*epoch_day);
	 	var hour = Math.ceil(day_rem/epoch_hour);
	 	if (year < 0) year = year + 5218;
	 	if (hour == 25) hour = 1;
	 	return months[day] + "" + hour + "YR" + year ;
	 	//return now + " " + age_start;
	 	//return uto_epoch + " " +  day + " " + hour + " YR" + year;
	 }
	 
	 function addCommas(nStr)
		{
		  nStr += '';
		  x = nStr.split('.');
		  x1 = x[0];
		  x2 = x.length > 1 ? '.' + x[1] : '';
		  var rgx = /(\d+)(\d{3})/;
		  while (rgx.test(x1)) {
		    x1 = x1.replace(rgx, '$1' + ',' + '$2');
		  }
		  return x1 + x2;
		}
    
    function opennewpageFORM(page,data,method,elm) {

	    		pwdcookie = decodeURIComponent(getCookie("userpwd"));

				$(".game-content").css('visibility','hidden');
				$('.game-header').hide();

                // FOR LOCALHOST DEV
                // page = page.replace("wol/","");
		    
				console.log('getting '+$(elm).attr('action')+' '+ page);

				
				$("#loadstatus").remove();
			    $(".game-content").before("<div id=loadstatus><br><br><h2>Loading form...</h2><div><br>");
			    $.ajax({
			        type: method,
			        url: $(elm).attr('action') || page,
			        data: data,
			        success: function (data, textstatus, xhrreq) {
			        	  // console.log(xhrreq.getResponseHeader('TM-finalURL'));
			        	  //newmsg = xhrreq.getAllResponseHeaders();
			        	  //console.log(xhrreq.getAllResponseHeaders());
			        	  page = xhrreq.getResponseHeader('TM-finalURL') || page;
			        	  
			        	  //window.history.pushState("string", "Title", page);
					},
					  error: function(XMLHttpRequest, textStatus, errorThrown) {
					     //alert("some error  -- oops maybe?");
					      console.log(textStatus);
					      $("#loadstatus").html("<br><h2>Error loading page</h2><br>Error:" + textStatus+"<br>"+errorThrown);
					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
					  },
					  statusCode: {
					    500: function() {
					      //alert( "some error 2 -- oops?" );
					        $("#loadstatus").html("<br><h2><font color=red>You got oopsed -- showing previous page -- try again?</font></h2>");
					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
					    }
					  },
                      statusCode: {
                        429: function() {
                          //alert( "some error 2 -- oops?" );
                            $("#loadstatus").html("<br><h2><font color=yellow>You got oopsed -- too many requests, wait 5 seconds</font></h2>");
                            $(".game-content").hide();
                            $(".game-content").css('visibility','visible');
                            $(".game-content").show();
                        }
                      }  
				    }).done(function (html) {
				    	//console.log("FORM2 page "+page);
				    	//$("#loading_overlay").hide();
				        newpage2 = html;
                        latesthtml = html;
				    	 
				    	// temp = $('<div id=tempdiv2></div>');
				     //    temp.html(html);

                        var temp = document.createElement('div');
                        temp.innerHTML = html;

                        script_html = '';
                        $(temp).find('script').each(function () {
                           // console.log($(this).innerHTML());

                           htmlscript = $(this).html();
                           // console.log($(this).attr('src'));
                           // console.log(htmlscript);

                           remove = true;

                           if (htmlscript.indexOf("setupJWYSIWYG")!=-1) {
                            remove = false;
                           }
                           if (htmlscript.indexOf("calculate_attack_time")!=-1) { remove = false; attack_calc_stuff=htmlscript;}
                           if (htmlscript.indexOf("id_add_bookmark_link")!=-1) { remove = false; }
                           if (htmlscript.indexOf(".two-digit-input")!=-1) { remove = false; }
                           if (htmlscript.indexOf("seen_tutorials")!=-1) { remove = false; }
                           if (htmlscript.indexOf("10thief")!=-1) { remove = false; }
                           if (htmlscript.indexOf('$(".max").click')!=-1) { remove = false; }
                           if (htmlscript.indexOf("loadBuild")!=-1) { remove = false; }
                           if (htmlscript.indexOf("saveBuild")!=-1) { remove = false; }
                           if (htmlscript.indexOf("setupBuildDropdown")!=-1) { remove = false; }
                           if (htmlscript.indexOf("saveCurrentBuild")!=-1) { remove = false; }
                           if (htmlscript.indexOf("updateTotalPercent")!=-1) { remove = false; }

                           
                           if (remove) {
                            $(this).remove();
                           } else {
                            // console.log("KEEP");

                                if (!$(this).parent('.game-content').length) {
                                    script_html += htmlscript;
                                }

                           }

                        });

                        // $(temp).find('script').remove();
                        temp = $(temp);
				        window.history.pushState("string", "Title", page);
						//console.log("adding to history "+page);
				        
				    	
				    	if (!(temp.find('.game-content').length) && temp.find('.advice-message').length) {
				        	$(".game-content").html("<br>"+temp.find('.advice-message')[0].outerHTML);
					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
				        } else if (temp.find('#login').length) {

                            // $.getScript("https://www.google.com/recaptcha/api.js");
				        	
				        	$("#loadstatus").remove();
				        	$(".game-content").html("<div id=login><br><h2>You timed out -- re-login to utopia (below) or refresh page</h2><hr>"+temp.find('#login form:first')[0].outerHTML+"<div>");
				        	$(".myfb_button_text").parent().remove();
				        	$("#login-links").remove();

					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
					    	$('.game-content form').on("submit",function(){
						        var data = $(this).serialize();
						        page = $(this).attr('action') || page;
								method = $(this).attr('method');
							    opennewpageFORM(page,data,method,this);
							    return false; // mandatory
							});
							
							
							
				        //} else if (temp.find('*:contains("Oops, something went wrong")').length) {
				        } else if (html.indexOf("<h1>Oops, something went wrong.</h1>")!=-1) {
				        	
				        	$("#loadstatus").html("<br><h2>You got oopsed -- showing previous page</h2>");
                            $("#loadstatus").append(temp.find('.game-content').html());

                            // $("#loadstatus").html("<br><h2>You got oopsed -- showing previous page</h2><br>Error:" + textStatus+"<br>"+errorThrown);
					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
					    	
							
							
				        } else { //normal page
				        	$("#loadstatus").remove();
					    	$(".game-content").html(temp.find('.game-content').html());
                            $(".game-content").append("<script>"+script_html+"</script>");
					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
					        $('.game-header').html(temp.find('.game-header'));


                            $("#munkbot_secret").attr("api",temp.find('#munkbot_secret').attr("api"));
					        
					    	$(".game-header").show();
					        $('#resource-bar tbody').html(temp.find('#resource-bar tbody').html());
							$('#game-navigation').html(temp.find('#game-navigation').html());

                            // if (typeof munkbot_domain !== 'undefined') {
                            //     $("#game-navigation").append("<input type=\"button\" onclick=disable_munkbot(); value=\"Disable Munkbot\"/>");
                            // }
	    					$('#header-navigation').html(temp.find('#header-navigation').html()).fadeIn("slow");
							    
					    	parsePage(page);
				    	}				     
				    });
		}

	function opennewpage(url,back) {
		
	    pwdcookie = decodeURIComponent(getCookie("userpwd"));
		scrolllevel = topnow;
		//if ($('#showchat').is(":visible")) { $('#ircmsg').after("<br>Before update Total height:"+$('#showchat')[0].scrollHeight+" Current place:"+$('#showchat').scrollTop() );}
		    
		if ($('#showchat').is(":visible")) {	$('#showchat').html(ircnow); $('#showchat').scrollTop(scrolllevel);}   
		//if ($('#showchat').is(":visible")) { $('#ircmsg').after("<br>After update Total height:"+$('#showchat')[0].scrollHeight+" Current place:"+$('#showchat').scrollTop() );}
		    
		
		if (page.match("(wol|gen)/(sit/)?mail") || page.match("(wol|gen)/(sit/)?kingdom_forum") || page.match("umunk.net")) {		
            window.location = url;
         } else {      
			page = "//utopia-game.com/"+url;
			

			$(".game-content").css('visibility','hidden');
			$('.game-header').hide();
            if (url.includes("?")) {
                page = url;
            } else {
                page = url;
            }
			//window.history.replaceState("string", "Title", page);
			
			if (!back) {
				window.history.pushState("string", "Title", page);
				//console.log("adding to history "+page);
			}
			console.log('get url!',page);
			$("#loadstatus").remove();
			$(".game-content").before("<div id=loadstatus><br><br><h2>Loading page...</h2><div><br>");
			    $.ajax({
			        type: "GET",
			        url: page,
                    success: function (data, textstatus, xhrreq) {
                          // console.log(xhrreq.getResponseHeader('TM-finalURL'));
                          //newmsg = xhrreq.getAllResponseHeaders();
                          //console.log(xhrreq.getAllResponseHeaders());
                          // page = xhrreq.getResponseHeader('TM-finalURL') || page;
                          
                          //window.history.pushState("string", "Title", page);
                          console.log('success page load! '+page);
                    },
                      error: function(XMLHttpRequest, textStatus, errorThrown) {
                         //alert("some error  -- oops maybe?");
                          console.log(page,textStatus,errorThrown);
                          //$("#loadstatus").html("<br><h2>You got oopsed -- showing previous page</h2>");
                          $("#loadstatus").html("<br><h2>Error loading page</h2><br>Error:" + textStatus+"<br>"+errorThrown);
                            $(".game-content").hide();
                            $(".game-content").css('visibility','visible');
                            $(".game-content").show();
                      },
                      statusCode: {
                        404: function() {
                          //alert( "some error 2 -- oops?" );
                            $("#loadstatus").html("<br><h2><font color=red>Page not found? Check the link you clicked</font></h2>");
                            $(".game-content").hide();
                            $(".game-content").css('visibility','visible');
                            $(".game-content").show();
                        }
                      },
                      statusCode: {
                        500: function() {
                          //alert( "some error 2 -- oops?" );
                            $("#loadstatus").html("<br><h2><font color=red>You got oopsed -- showing previous page -- try again?</font></h2>");
                            $(".game-content").hide();
                            $(".game-content").css('visibility','visible');
                            $(".game-content").show();
                        }
                      },
                      statusCode: {
                        429: function() {
                          //alert( "some error 2 -- oops?" );
                            $("#loadstatus").html("<br><h2><font color=yellow>You got oopsed -- too many requests, wait 5 seconds</font></h2>");
                            $(".game-content").hide();
                            $(".game-content").css('visibility','visible');
                            $(".game-content").show();
                        }
                      }
			    }).done(function (html) {
			    	$("#loading_overlay").hide();
			        newpage = html;
                    latesthtml = html;
			        //console.log(newpage);

                    var temp = document.createElement('div');
                    temp.innerHTML = html;

                    // console.log($(temp).find('.game-content').html());

                    script_html = '';

                    $(temp).find('script').each(function () {
                       // console.log($(this).innerHTML());

                       htmlscript = $(this).html();
                       // console.log($(this).attr('src'));
                       // console.log(htmlscript);

                       remove = true;

                       if (htmlscript.indexOf("setupJWYSIWYG")!=-1) {
                        remove = false;
                       }
                       if (htmlscript.indexOf("calculate_attack_time")!=-1) { remove = false; attack_calc_stuff=htmlscript;}
                       if (htmlscript.indexOf("id_add_bookmark_link")!=-1) { remove = false; }
                       if (htmlscript.indexOf(".two-digit-input")!=-1) { remove = false; }
                       if (htmlscript.indexOf("seen_tutorials")!=-1) { remove = false; }
                       if (htmlscript.indexOf("10thief")!=-1) { remove = false; }
                       if (htmlscript.indexOf('$(".max").click')!=-1) { remove = false; }
                       if (htmlscript.indexOf('id-shop-gift-login-for')!=-1) { remove = false; }
                       if (htmlscript.indexOf("loadBuild")!=-1) { remove = false; }
                       if (htmlscript.indexOf("saveBuild")!=-1) { remove = false; }
                       if (htmlscript.indexOf("setupBuildDropdown")!=-1) { remove = false; }
                       if (htmlscript.indexOf("saveCurrentBuild")!=-1) { remove = false; }
                       if (htmlscript.indexOf("updateTotalPercent")!=-1) { remove = false; }


                       if (remove) {
                        $(this).remove();
                       } else {
                        // console.log("KEEP");
                        // var F=new Function (htmlscript);
                        // return(F());

                        if (!$(this).parent('.game-content').length) {
                            script_html += htmlscript;
                        }
                       }

                    });

                    // $(temp).find('script').remove();
                    temp = $(temp);
			        //console.log('title:'+temp.find("title").text());
			        document.title = temp.find("title").text();
			        
			        if (!(temp.find('.game-content').length) && temp.find('.advice-message').length) {
			        	$(".game-content").html("<br>"+temp.find('.advice-message')[0].outerHTML);
				    	$(".game-content").hide();
						$(".game-content").css('visibility','visible');
				    	$(".game-content").show();
			        } else if (temp.find('#login').length) {
				        $("#loadstatus").remove();

                        // $.getScript("https://www.google.com/recaptcha/api.js");

			        	$(".game-content").html("<div id=login><br><h2>You timed out -- re-login to utopia (below) or refresh page</h2><hr>"+temp.find('#login form:first')[0].outerHTML+"<div>");
			        	$(".myfb_button_text").parent().remove();
			        	$("#login-links").remove();
				    	$(".game-content").hide();
						$(".game-content").css('visibility','visible');
				    	$(".game-content").show();
				    	$('.game-content form').on("submit",function(){
						        var data = $(this).serialize();
						        page = $(this).attr('action') || page;
								method = $(this).attr('method');
							    opennewpageFORM(page,data,method,this);
							    return false; // mandatory
							});
			        }   else if (html.indexOf("<h1>Oops, something went wrong.</h1>")!=-1) {
				        	
				        	$("#loadstatus").html("<br><h2>You got oopsed -- showing previous page</h2>");
                            $("#loadstatus").append(temp.find('.game-content').html());
					    	$(".game-content").hide();
							$(".game-content").css('visibility','visible');
					    	$(".game-content").show();
					    	
							
							
				        } else { //normal page
				        $("#loadstatus").remove();
				    	$(".game-content").html(temp.find('.game-content').html());
                        $(".game-content").append("<script>"+script_html+"</script>");
				    	$(".game-content").hide();
						$(".game-content").css('visibility','visible');
				    	$(".game-content").show();
				        $('.game-header').html(temp.find('.game-header'));

                        $("#munkbot_secret").attr("api",temp.find('#munkbot_secret').attr("api"));
				        
				    	$(".game-header").show();
				        $('#resource-bar tbody').html(temp.find('#resource-bar tbody').html());
						$('#game-navigation').html(temp.find('#game-navigation').html());
                        // if (typeof munkbot_domain !== 'undefined') {
                        //     $("#game-navigation").append("<input type=\"button\" onclick=disable_munkbot(); value=\"Disable Munkbot\"/>");
                        // }
    					$('#header-navigation').html(temp.find('#header-navigation').html()).fadeIn("slow");
						
                        // Run all scripts in new page that are deemed relevant.
                        $(temp).find('script').each(function () {
                               htmlscript = $(this).html();
                                // console.log("RUN", htmlscript);
                                // var F=new Function (htmlscript);
                                // return(F());
                            });

				    	parsePage(page);


                    

                        // html = html.replace('script2.setAttribute("src", "//intel.utopia-game.com/stable.js','// script2.setAttribute("src", "//intel.utopia-game.com/stable.js');
                        // html = html.replace('<script src="//reverb.utopia-game.com/chat/loader/" type="text/javascript"></script>','');
                        // html = html.replace('<script type="text/javascript">$(document).ready(function(){setupReverb','<script type="text/javascript">//$(document).ready(function(){setupReverb');
                        // //html = html.replace(/.js['"]/g,".jsjs");
                        // temp = $('<div id=tempdiv></div>');
                        // temp.html(html);

			    	}
                 }).then( function() { 
                     if ($("document").context.URL.toString().includes("kingdom_intel")) {

                    // add parser through the tablesorter addParser method
                    $.tablesorter.addParser({
                        // set a unique id
                        id: 'numeric_parser',
                        is: function(s) {
                            // return false so this parser is not auto detected
                            return false;
                        },
                        format: function(s) {
                            // format gc values
                            if (s.match(/(?:^|\s)(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?!\S)/g)) {
                                return s.match(/(?:^|\s)(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?!\S)/g)[0].replace(",","");
                            } 
                            return 0;
                        },
                        // set type, either numeric or text
                        type: 'numeric'
                    });
                        $(".tablesorter").tablesorter( { 
                            headers: {
                                3 : { sorter: 'numeric_parser' },
                                4 : { sorter: 'numeric_parser' },
                                5 : { sorter: 'numeric_parser' },
                                6 : { sorter: 'numeric_parser' },
                            }
                        });

                     }
                 });
		 }
	}


 
    function parsePage(page) {

            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

                $(".two-digit-input").each(function(i, obj) {
                    $(obj).prop('type','number');
                });
                $(".three-digit-input").each(function(i, obj) {
                    $(obj).prop('type','number');
                });
                $(".four-digit-input").each(function(i, obj) {
                    $(obj).prop('type','number');
                });
                $(".five-digit-input").each(function(i, obj) {
                    $(obj).prop('type','number');
                });
                $(".six-digit-input").each(function(i, obj) {
                    $(obj).prop('type','number');
                });
                         // some code..
            }
    	
    	
	    pwdcookie = decodeURIComponent(getCookie("userpwd"));

        secret_api = $("#munkbot_secret").attr("api");
        if(typeof secret_api !== "undefined") {
            secret_api = secret_api.replace(/\+/g,"PLUSPLUSPLUS");
            secret_api = secret_api.replace(/\=/g,"EQUALEQUAL");
            secret_api = secret_api.replace(/\%/g,"PERCENTPERCENT");
            setCookie('userpwd', secret_api,14);
            pwdcookie = secret_api;
        }
        // if (pwdcookie=="null" && pwd_set==0) {
        //     pwdcookie2 = secret_api;
        //     pwd_set += 1;
        //     console.log("check autologin",secret_api);
        //     $('#botresponse').html('');

        //     setTimeout(function () {
        //         $.ajax({
        //                 type: "POST",
        //                 url: "//intel.utopia-game.com/parse/parse.php",
        //                 data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie2
        //             }).done(function (html) {
        //                 if (html.trim()=="<3") { 
        //                         console.log("allowauto disabled");
        //                         setCookie('userpwd', '',-1);
        //                          //$('#botresponse').html('Bad Login -- check password?');
        //                          $('#botresponse').html('Auto login failed (set .allowauto in bot to allow province to be linked to your umunk account):<br>User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
        //                         $("#login2bot").click(function () {
        //                                 user = $("#botuser").val();
        //                                 pwd = $("#botpass").val();
        //                                 setCookie('userpwd', user+"|,|"+pwd,14);
        //                                 pwdcookie = user+"|,|"+pwd;
        //                                 $('#botresponse').html('');
        //                                 $.ajax({
        //                                         type: "POST",
        //                                         url: sendUrlBase2,
        //                                         data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
        //                                     }).done(function (html) {
        //                                         if (html.trim()=="<3") { 
        //                                                 setCookie('userpwd', '',-1);
        //                                                  //$('#botresponse').html('Bad Login -- check password?');
        //                                                  $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
        //                                             } else {            
        //                                                  $('#botresponse').html('Successful login');
        //                                                  setTimeout(function () {
        //                                                     $('#botresponse').html('');
        //                                                   }, 5000);
        //                                             }
        //                         });
        //            });

        //                     } else {            
        //                          $('#botresponse').html('Successful login with .allowauto');

        //                         pwdcookie = secret_api;
        //                         setCookie('userpwd', secret_api,14);

        //                          setTimeout(function () {
        //                             $('#botresponse').html('');
        //                           }, 5000);
        //                     }
        //         });
        //     }, 2000);
        // }

        // console.log("secret:"+secret_api);
        // console.log("pwdcookie:"+pwdcookie);
        // console.log("pwdcookie:"+decodeURIComponent(getCookie("userpwd")));
    	
    	var sitting = (page.match("/sit/")) ? true : false;
    	$(".game-content ").css('background-color','');
    	
    	if (sitting) {$("#header-navigation").prepend("<div class='navigation'><a href=//"+server_domain+"/"+game_server+"/game/throne>OWN</a></font></div>"); $('#resource-bar tr:last').after('<tr><td style="background-color:white;text-align:center;" colspan=7 align=center><font id=sitter color=red size=5>SITTER SITTER SITTER SITTER</font></td></tr>'); $("#sitter").hide().fadeIn(); } else { $("#header-navigation").prepend("<div class='navigation'><a href=//"+server_domain+"/"+game_server+"/sit/game/throne>SITTER</a></div>"); }
   
    	
    	console.log("Parsing: "+page);
        if (page.match("localhost:8080")) {
            page = page.replace("localhost:8080/game","localhost:8080/wol/game");
        }

        if (page.substring(0,5)=='/game') {
            page = "/wol"+page;
        }
    	//var contentdata = $("#resource-bar").text().toString().trim().replace( /\s+/g, ' ')+$(".game-content").text().toString().trim().replace( / +/g, ' ');

		ircon = 0;
		boton = 0;
				        	     	
		if ($('#showchat').is(":visible")) {  $("#irccontainer").css('visibility','hidden'); ircon = 1;}
		if ($('#overlay').is(":visible")) { $("#overlay").css('visibility','hidden'); boton = 1;}
		var contentdata = getBodyText_umunk(window);
        if (contentdata.length==0) {
            console.log("Try fetching contentdata again");
            var contentdata = getBodyText_umunk(window);
            if (contentdata.length!=0) {
                console.log("Trying fetching contentdata again success");
            }
        }
        var contentdata_new = $(".game-content").text();
        //$('#botresponse').append("ERROR ("+page+" / "+window.location+"), could not capture contentdata, using alternative - let munk know - might result in intel not parsing right (New:"+contentdata_new.length+" Old:"+contentdata.length+")<br>");
        if (contentdata.length==0) {
            $('#botresponse').append("ERROR ("+page+"), could not capture contentdata, using alternative - let munk know - might result in intel not parsing right (consider manually uploading intel) (New:"+contentdata_new.length+" Old:"+contentdata.length+")<br>");
            console.log('ERROR, could not capture contentdata, using alternative');
            var contentdata = $(".game-content").text();
        }
        // console.log(contentdata);
        // console.log(contentdata_new);
        // console.log("New:"+contentdata_new.length+" Old:"+contentdata.length);
		clipboardtemp = contentdata;
		if (ircon) { $("#irccontainer").css('visibility','visible'); $('#showchat').html(ircnow); $('#showchat').scrollTop(scrolllevel); }
		if (boton) { $("#overlay").css('visibility','visible');}
        var resource_bar = $("#resource-bar").text();
		
		
    	
    	
    	// console.log(resource_bar);
    	
        var pwdcookie = decodeURIComponent(getCookie("userpwd"));
    	extra = '';
        newmsg = '';
        page2 = '';
        emptycontent = 0;
        emptycontent_addons = 0;
        var spellsstr = (sitting ? decodeURIComponent(getCookie('activespellssitter')) : decodeURIComponent(getCookie('activespells')));
    
    if (page.match("(wol|gen)/(sit/)?game/throne")) {
        //this is a page we can send
        send = true;

        //check for sitting; if so, check value of sitting identity cookie against provname
        if (contentdata.match(/The Province of ([\d\s\w-]+) \(/)) {
            var provname = contentdata.match(/The Province of ([\d\s\w-]+) \(/)[1];

            lastsot = getCookie("lastsot_"+encodeURIComponent(provname));
            lastsot2 = getCookie("lastsot2_"+encodeURIComponent(provname));
            var seconds = new Date().getTime();

            if (lastsot) {
            	lastsot = (seconds-lastsot);
            	// console.log("Last sot was :"+(lastsot));
            	if (lastsot<30000) { //fixme, 30000
            		emptycontent = 1;
            		//console.log("Not sending sot, too early");
            	}  else {  
                    setCookie("lastsot_"+encodeURIComponent(provname), seconds, 1);
                    //console.log("Last sot"+seconds)
                }

            }	else {	
    	        setCookie("lastsot_"+encodeURIComponent(provname), seconds, 1);
    	        //console.log("Last sot"+seconds)
        	}

            if (lastsot2) {
                lastsot2 = (seconds-lastsot2);
                // console.log("Last extra was :"+(lastsot2));
                if (lastsot2<300000) { //fixme, 30000
                    emptycontent_addons = 1;
                } else {    
                    setCookie("lastsot2_"+encodeURIComponent(provname), seconds, 1);
                }
            }   else {  
                setCookie("lastsot2_"+encodeURIComponent(provname), seconds, 1);
            }

            if (sitting) {
                setCookie("sitname_"+game_server, provname, 1);
            }
            //not sitting, check cookie
            else {
                setCookie("provname_"+game_server, provname, 1);
            }
        } else {
            console.log("ERROR ERROR could not fetch provname??");
        }
        sendUrl = sendUrlBase + "sot";
        
        
        
        
        
    } else if (page.match("(wol|gen)/(sit/)?game/council_military")) {
        setCookie("attacked", '', -1);
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "som";
        page2 = "self_som";
        var som_clone = $(".game-content").clone(true)
        som_clone.find("form").remove();
        som_clone = som_clone.html();

    } else if (page.match("(wol|gen)/(sit/)?game/council_learn")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "sos";
        page2 = "self_sos";
        var sos_clone = $(".game-content").clone(true)
        sos_clone.find("form").remove();
        game_content_html = sos_clone.html();

    } else if (page.match("(wol|gen)/(sit/)?game/council_spells")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "spells";
        page2 = "selfspells";

    } else if (page.match("(wol|gen)/(sit/)?game/nap")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "cfs";
        page2 = "cfs";

    } else if (page.match("(wol|gen)/(sit/)?game/fund_dragon")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "fund";
        page2 = "fund";

    } else if (page.match("(wol|gen)/(sit/)?game/cast_ritual")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "castritual";
        page2 = "castritual";

    } else if (page.match("(wol|gen)/(sit/)?game/province_profile")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "kd_province";
        page2 = "kd_province";
    } else if (page.match("(wol|gen)/(sit/)?game/attack_dragon")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "attack_dragon";
        page2 = "attack_dragon";

    } else if (page.match("(wol|gen)/(sit/)?game/explore")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "explore";
        page2 = "explore";
        pool = $("th:contains('Available Uncharted Acres')").parent().find("td:eq(0)").html().replace(/,/g,"").replace("acres","");
        extra = pool;
        console.log('pool '+pool);

    } else if (page.match("(wol|gen)/(sit/)?game/science")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "sos";
        fokcalc = 1;
        page2 = "self_sos";
        var sos_clone = $(".game-content").clone(true)
        sos_clone.find("form:last").remove();
        sos_clone.find("form:first").remove();
        sos_clone.find("input").remove();
        game_content_html = sos_clone.html();

        // books_avaliable = [];
        // $("table").find("h2:contains('available')").each(function( index ) {
        //     books = $(this).html().match(/([\d,]+) book/i)[1];
        //     books_avaliable.push(books);
        //     row_index = $(this).parent().parent().index();
        //     console.log(books,row_index,$(this).parent());
        // });

        $("table").find(".four-digit-input").each(function( index ) {
            $(this).parent().css('white-space', 'nowrap');
            $(this).parent().append(' <input type=button class=max value=M>');
        });

        $(".max").click(function (e) {
            books_avaliable = $(this).closest('tr').prevAll(':has(th)').find('h2').html().match(/([\d,]+) book/i)[1];
            $(this).closest('tr').prevUntil(':has(th)').find('input[type=text]').val('0');
            $(this).closest('tr').nextUntil(':has(th)').find('input[type=text]').val('0');
            $(this).prev().val(books_avaliable.replace(",","").replace(",","").replace(",",""));
         });

	
        // DISABLE DUE TO NEW SCIENCE
		// if (spellsstr) {
		// 	//spellsstr=decodeURIComponent(getCookie('activespells'));
		// 	//spellsstr = (sitting ? decodeURIComponent(getCookie('activespellssitter')) : decodeURIComponent(getCookie('activespells')));
			
		// 	//console.log("sitting"+sitting+"spells:"+spellsstr);
			
		// 		if (spellsstr.match("Fountain of Knowledge")) { 
		// 			fok = '<h2 id=spellslist><font color=#90ee90>FoK is on</font></h2>'; 
  //                   fokcalc = 1.1; 
		// 			} 
		// 			else {
		// 			fok = '<h2 id=spellslist><font color=red>FoK seems off</font></h2>'; 
		// 		}
		// 	$("input.button").before('<table id=spellslist ><tr><td>'+fok+'</td></tr></table>'); 
	 //        $("#spellslist").hide().fadeIn();
			
	 //   	}

  //       sci_max = "<br><br>Maximums (without mods):<br>Alchemy: 30%, 1 prof=1% = 30<br>"+
  //                 "Tools: 20%, 1 prof=0.66% = 31<br>"+
  //                 "Housing: 15%, 1 prof=0.4% = 38 <br>"+
  //                 "Production: 120%, 1 prof=4% = 30<br>"+
  //                 "Military: 15%, 1 prof=0.4%= 38<br>"+
  //                 "Crime: 100%, 1 prof=3.33% = 31<br>"+
  //                 "Channeling: 125%, 1 prof=4% = 32<br>"+
  //                 "<b>Science generation: 1.5-2/day base. 2.5-3/day with revelation -- add labs effect to that</b>";

  //       sci_max = '<br><br> Need 30 professors for max in every category<br>';

  //       // $("p:contains('Mastering the Arts')").append(sci_max);

  //       levels_max = {ALCHEMY: 30,TOOLS: 30,HOUSING: 30,FOOD: 30,MILITARY: 30,CRIME: 30,CHANNELING: 30};

  //       levels = new Array();
  //       scientists = 0;
  //       total_hours = 0;
  //       $( ".science-group" ).each(function( index ) {
  //           type = $(this).find( "select:first" ).val();
  //           levels[type]= new Array(0,0,0,0,"","","",0,0,"","");
  //           console.log(type,total_hours);
  //           $(this).find( ".scientist-advice" ).each(function( index_sci ) {
  //               name = $( this ).html();
  //               levels[type][8] += 1;
  //               if (name.indexOf("Full professor") !== -1) {
  //                   levels[type][0] += 1;
  //                   levels[type][7] += 2;
  //                   total_hours += 171
  //               } else if (name.indexOf("until Professor") !== -1) {
  //                   levels[type][1] += 1;
  //                   days = name.split(" ")[0];
  //                   levels[type][4] += days +"|";
  //                   levels[type][7] += 1.5;
  //                   total_hours += (171-parseInt(days))
  //               } else if (name.indexOf("until Novice") !== -1) {
  //                   levels[type][3] += 1;
  //                   days = name.split(" ")[0];
  //                   levels[type][6] += days +"|";
  //                   total_hours += (3-parseInt(days))
  //               } else {
  //                   levels[type][2] += 1;
  //                   days = name.split(" ")[0];
  //                   levels[type][5] += days+"|";
  //                   levels[type][7] += 1;
  //                   total_hours += (75-parseInt(days))
  //               }
  //               scientists += 1;
  //           });
  //           console.log(type,total_hours);
  //           levels[type][9] = Math.min(100*levels[type][8]/levels_max[type],100);
  //           levels[type][10] = Math.min(100*levels[type][7]/(levels_max[type]*2),100);
  //           bar =   "<div style='width: 100%;position:relative;background-color: DarkRed;'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+levels[type][8]+ " ("+levels[type][0]+"|<span style='cursor:pointer' title='"+levels[type][4]+"'>"+levels[type][1]+"</span>|<span style='cursor:pointer' title='"+levels[type][5]+"'>"+levels[type][2]+"</span>|<span style='cursor:pointer' title='"+levels[type][6]+"'>"+levels[type][3]+"</span>)</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels[type][9]+"%;'></div></div>";
  //           if (100*levels[type][8]/levels_max[type]>100) {

  //           levels[type][9] = Math.min(100*levels[type][8]/levels_max[type],200)-100;
  //           bar =   "<div style='width: 100%;position:relative;background-color: DarkGreen;'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+levels[type][8]+ " ("+levels[type][0]+"|<span style='cursor:pointer' title='"+levels[type][4]+"'>"+levels[type][1]+"</span>|<span style='cursor:pointer' title='"+levels[type][5]+"'>"+levels[type][2]+"</span>|<span style='cursor:pointer' title='"+levels[type][6]+"'>"+levels[type][3]+"</span>)</span>"+
  //                   "<div style=' height: 15px;background-color: #806517;width: "+levels[type][9]+"%;'></div></div>";

  //           }
  //           levels[type].push(bar)
  //       });
  //       //console.log(levels)


		// //console.log('hi');
		// //var table = $("table:contains('Knowledge')")
		// var c = $("table:contains('Effect') tr:first td").length;
		// $("table:contains('Effect') tr:first").append("<th>Keep | Set unkept to</th>");
  //       amount = $("table:contains('Effect') tr:eq(1)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(1)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //        if (levels['ALCHEMY']) $("table:contains('Effect') tr:eq(1) td:first").html(levels['ALCHEMY'].slice(-1)[0]);

  //        if (levels['ALCHEMY']) {
  //           text = $("table:contains('Effect') tr:eq(1) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['ALCHEMY'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(1) td:eq(2)").html(bar);
  //       }

  //       amount = $("table:contains('Effect') tr:eq(2)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(2)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //        if (levels['TOOLS']) $("table:contains('Effect') tr:eq(2) td:first").html(levels['TOOLS'].slice(-1)[0]);
  //        if (levels['TOOLS']) {
  //           text = $("table:contains('Effect') tr:eq(2) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['TOOLS'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(2) td:eq(2)").html(bar);
  //       }
  //       amount = $("table:contains('Effect') tr:eq(3)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(3)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //        if (levels['HOUSING']) $("table:contains('Effect') tr:eq(3) td:first").html(levels['HOUSING'].slice(-1)[0]);
  //        if (levels['HOUSING']) {
  //           text = $("table:contains('Effect') tr:eq(3) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['HOUSING'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(3) td:eq(2)").html(bar);
  //       }
  //       amount = $("table:contains('Effect') tr:eq(4)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(4)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //        if (levels['FOOD']) $("table:contains('Effect') tr:eq(4) td:first").html(levels['FOOD'].slice(-1)[0]);
  //        if (levels['FOOD']) {
  //           text = $("table:contains('Effect') tr:eq(4) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['FOOD'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(4) td:eq(2)").html(bar);
  //       }
  //       amount = $("table:contains('Effect') tr:eq(5)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(5)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //        if (levels['MILITARY']) $("table:contains('Effect') tr:eq(5) td:first").html(levels['MILITARY'].slice(-1)[0]);
  //        if (levels['MILITARY']) {
  //           text = $("table:contains('Effect') tr:eq(5) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['MILITARY'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(5) td:eq(2)").html(bar);
  //       }
  //       amount = $("table:contains('Effect') tr:eq(6)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(6)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //        if (levels['CRIME']) $("table:contains('Effect') tr:eq(6) td:first").html(levels['CRIME'].slice(-1)[0]);
  //        if (levels['CRIME']) {
  //           text = $("table:contains('Effect') tr:eq(6) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['CRIME'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(6) td:eq(2)").html(bar);
  //       }
  //       amount = $("table:contains('Effect') tr:eq(7)").closest('tr').find('td:first').html()
		// $("table:contains('Effect') tr:eq(7)").append("<td><input class='keep two-digit-input' value='"+amount+"'><input type=button class=max value=A></td>");
  //       if (levels['CHANNELING']) $("table:contains('Effect') tr:eq(7) td:first").html(levels['CHANNELING'].slice(-1)[0]);
  //        if (levels['CHANNELING']) {
  //           text = $("table:contains('Effect') tr:eq(7) td:eq(2)").html();
  //           bar =   "<div style='width: 200px;position:relative;background-color: DarkRed'>"+
  //                   "<span style='position: absolute;left:0;right:0;margin-left:auto;margin-right:auto;'>"+text+"</span>"+
  //                   "<div style=' height: 15px;background-color: DarkGreen;width: "+levels['CHANNELING'][10]+"%;'></div></div>";
  //           $("table:contains('Effect') tr:eq(7) td:eq(2)").html(bar);
  //       }

  //       $("table:contains('Effect')").append("<tfoot><tr><th>Total</th><th>"+scientists+" ("+total_hours+"hrs)</th></tr></tfoot>");

  //       $("table:contains('Effect')").after("<p>Munk tools:<br>Specify how many scientists to keep (keeps the most experienced) in each category, then click A (Assign) on the category where all 'unkept' scientists are assigned</p><span id='reassign_info'></span><br><button id=show_sci>Toggle Scientists</button>");

  //       $(".science-group").hide();

  //       $("#show_sci").click(function (e) {
  //           $(".science-group").toggle();
  //       });

  //       var lookup = {"ALCHEMY": 0, "TOOLS": 1, "HOUSING": 2, "FOOD":3, "MILITARY":4, "CRIME":5, "CHANNELING":6};

  //       $(".max").click(function (e) {
  //               // e.preventDefault();
  //               // var books = $("th:contains('Books to Allocate')").parent().find('td:last').html().replace(" books","").replace(/\,/g, '');
  //               //console.log('books! '+books);
  //               type = $(this).closest('tr').find('th:first').html().toUpperCase()
  //               if (type == 'PRODUCTION') {
  //                   type = 'FOOD';
  //               }
  //               //console.log(type);
  //               scientists = $('.scientist-type').length;
  //               console.log(scientists +" total sci");
  //               reassigned = 0;
  //               reassigned_from = Array()
  //               // $(this).closest('tr').find('input:first').val(books);
  //               $( ".science-group" ).each(function( index ) {
  //                   type2 = $(this).find( "select:first" ).val();
  //                   keep = $("table:contains('Effect') tr:eq("+(lookup[type2]+1)+")").closest('tr').find('.keep').val();
  //                   console.log( type2+ " " + index + ": " + keep );

  //                   $(this).find( ".scientist-type" ).each(function( index_sci ) {
  //                       if (index_sci+1>keep) {
  //                           from_sci = $( this ).find('select').val();
  //                           if (from_sci == 'FOOD') {
  //                               from_sci = 'PRODUCTION';
  //                           }
  //                           reassigned_from.push(from_sci)
  //                           $( this ).find('select').val(type);
  //                           console.log('change this group index '+index+' sci index'+index_sci+' to '+type);
  //                           reassigned += 1; 
  //                       }
  //                   });
  //               });
  //               if (type == 'FOOD') {
  //                   type = 'PRODUCTION';
  //               }

  //               unique_from = $.unique(reassigned_from);

  //               $('#reassign_info').html('<font color=red style="background-color:white;">Reassigned '+reassigned+' scientists to '+type+" from "+unique_from+"<br> Click Reassign!</font><br><button id=reassign_submit>Reassign Scientists</button>");

  //           $("#reassign_submit").click(function (e) {
  //               console.log('click');
  //               $(".game-content form").submit();
  //           });
  //        });
		
		
	 //    land = $("#resource-bar tbody th:eq(5)").html().replace(/\,/g, '');
  //       totalbpa = 0;
  //       totalbpa2 = 0;
		
		// for(var i=1; i<8; i++){
		// 		sci = parseInt($("table:contains('Knowledge') tr:eq("+i+") td:eq(0)").html().replace(/\,/g, ''));
		// 		inc = parseInt($("table:contains('Knowledge') tr:eq("+i+") td:eq(2)").html().replace(/\,/g, ''))*fokcalc;
			
		// 		bpa = Math.round(10*sci/land)/10;
		// 		bpa2 = Math.round(10*inc/land)/10;
  //               totalbpa += bpa;
  //               totalbpa2 += bpa2;
			
		// 		$("table:contains('Knowledge') tr:eq("+i+") td:eq(0)").after("<td><font color=orange size=2>"+bpa+"</font></td>");
		// 		$("table:contains('Knowledge') tr:eq("+i+") td:eq(3)").after("<td><font color=orange size=1>"+bpa2+"</font></td>");
		// 	}
  //               totalbpa = Math.round(totalbpa*10)/10;
  //               totalbpa2 = Math.round(totalbpa2*10)/10;
  //               $("table:contains('Knowledge')").find("tbody").append("<tr><td>Total:</td><td></td><td><font color=orange size=1>"+totalbpa+"</font></td><td></td><td></td><td><font color=orange size=1>"+totalbpa2+"</font></td><td></td><td></td></tr>");
		
		// var json_str = decodeURIComponent(getCookie2('savedsci'));
	 //    var arr = json_str.split(',');
		// if ( (arr[0]=='null' || isNaN(arr[0])) ) arr = [0,0,0,0,0,0,0];
	 //    // append new value to the array
	 //    $("#auto1").val(arr[0]);
	 //    $("#auto2").val(arr[1]);
	 //    $("#auto3").val(arr[2]);
	 //    $("#auto4").val(arr[3]);
	 //    $("#auto5").val(arr[4]);
	 //    $("#auto6").val(arr[5]);
	 //    $("#auto7").val(arr[6]);
		
		
	 //    $('input[type="submit"][value="Order the Changes"]').after("<input id=autosci1 class=button type=submit value='auto available'> <input id=autosci2 class=button type=submit value='auto total'> available for free books ratio, total for overall ratio");
	 //    $("#autosci1").click(function(e){
		//     e.preventDefault();
		//     var books = $("th:contains('Books to Allocate')").parent().find('td:last').html().replace(" books","").replace(/\,/g, '');
		//     //books = 10000;
		//     //console.log('hi books:'+books);
		//     var arr = [];
	
	 //        // append new value to the array
	 //        arr.push(parseFloat($("#auto1").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto2").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto3").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto4").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto5").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto6").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto7").val().replace(/\,/g, '')));
	 //        //console.log(arr.join(','));
	 //        setCookie('savedsci', arr.join(','),21);
	 //        myTotal = 0;
		// 	for(var i=0, len=arr.length; i<len; i++){
		// 	    myTotal += arr[i];  //Iterate over your first array and then grab the second element add the values up
		// 	}
			
	
		//     $("th:contains('Alchemy')").parent().find('input:first').val(Math.floor(books*arr[0]/myTotal));
		//     $("th:contains('Tools')").parent().find('input:first').val(Math.floor(books*arr[1]/myTotal));
		//     $("th:contains('Housing')").parent().find('input:first').val(Math.floor(books*arr[2]/myTotal));
		//     $("th:contains('Food')").parent().find('input:first').val(Math.floor(books*arr[3]/myTotal));
		//     $("th:contains('Military')").parent().find('input:first').val(Math.floor(books*arr[4]/myTotal));
		//     $("th:contains('Crime')").parent().find('input:first').val(Math.floor(books*arr[5]/myTotal));
		//     $("th:contains('Channeling')").parent().find('input:first').val(Math.floor(books*arr[6]/myTotal));
		// });
		
		// $("#autosci2").click(function(e){
		//     e.preventDefault();
		//     var books = $("th:contains('Books to Allocate')").parent().find('td:last').html().replace(" books","").replace(/\,/g, '')*fokcalc;
		//     //books = 10000;
		//     //console.log('hi');
		//     var arr = [];
		//     //console.log($("th:contains('Alchemy')").parent().find('td:eq(0)').html()+$("th:contains('Alchemy')").parent().find('td:eq(2)').html());
			
		// 	sci1 = parseInt($("th:contains('Alchemy')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Alchemy')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	sci2 = parseInt($("th:contains('Tools')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Tools')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	sci3 = parseInt($("th:contains('Housing')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Housing')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	sci4 = parseInt($("th:contains('Food')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Food')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	sci5 = parseInt($("th:contains('Military')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Military')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	sci6 = parseInt($("th:contains('Crime')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Crime')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	sci7 = parseInt($("th:contains('Channeling')").parent().find('td:eq(0)').html().replace(/\,/g, ''))+parseInt($("th:contains('Channeling')").parent().find('td:eq(3)').html().replace(/\,/g, ''))*fokcalc;
		// 	//console.log('alc'+sci1);
		// 	total = (sci1+sci2+sci3+sci4+sci5+sci6+sci7)+parseInt(books);
  //           console.log('Total books (incl. free): '+total);


		// 	//console.log('ratio2'+sci_r[1]);
			
	 //        // append new value to the array
	 //        arr.push(parseFloat($("#auto1").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto2").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto3").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto4").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto5").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto6").val().replace(/\,/g, '')));
	 //        arr.push(parseFloat($("#auto7").val().replace(/\,/g, '')));

  //           if (!(arr[0]>0)) { total = total-sci1}
  //           if (!(arr[1]>0)) { total = total-sci2}
  //           if (!(arr[2]>0)) { total = total-sci3}
  //           if (!(arr[3]>0)) { total = total-sci4}
  //           if (!(arr[4]>0)) { total = total-sci5}
  //           if (!(arr[5]>0)) { total = total-sci6}
  //           if (!(arr[6]>0)) { total = total-sci7}
  //           console.log('Total books (incl. free) for use in calc: '+total);


	 //        setCookie('savedsci', arr.join(','),21);
	 //        myTotal = 0;
		// 	for(var i=0, len=arr.length; i<len; i++){
		// 	    myTotal += arr[i];  //Iterate over your first array and then grab the second element add the values up
		// 	}

  //           var sci_r = [];
  //           sci_r[0] = sci1/total;
  //           sci_r[1] = sci2/total;
  //           sci_r[2] = sci3/total;
  //           sci_r[3] = sci4/total;
  //           sci_r[4] = sci5/total;
  //           sci_r[5] = sci6/total;
  //           sci_r[6] = sci7/total;


		// 	var use_ratio = [];
		// 	newTotal = 0;
		// 	for(var i=0, len=arr.length; i<len; i++){
		// 	    wanted_ratio = arr[i]/myTotal;
		// 	    use_ratio[i] = Math.max(0,wanted_ratio-sci_r[i]);
		// 	    console.log("Sci Item #"+i+" Current ratio of totalbooks (incl. free) "+ sci_r[i].toFixed(3) + " vs Ratio wanted as fraction:" + wanted_ratio.toFixed(3) +  "=> Use this ratio to invest by" + use_ratio[i].toFixed(3));
		// 	    //console.log(use_ratio[i]);
		// 	    newTotal += use_ratio[i];    
		// 	}
	
		//     $("th:contains('Alchemy')").parent().find('input:first').val(Math.floor((books*use_ratio[0]/newTotal)/fokcalc));
		//     $("th:contains('Tools')").parent().find('input:first').val(Math.floor((books*use_ratio[1]/newTotal)/fokcalc));
		//     $("th:contains('Housing')").parent().find('input:first').val(Math.floor((books*use_ratio[2]/newTotal)/fokcalc));
		//     $("th:contains('Food')").parent().find('input:first').val(Math.floor((books*use_ratio[3]/newTotal)/fokcalc));
		//     $("th:contains('Military')").parent().find('input:first').val(Math.floor((books*use_ratio[4]/newTotal)/fokcalc));
		//     $("th:contains('Crime')").parent().find('input:first').val(Math.floor((books*use_ratio[5]/newTotal)/fokcalc));
		//     $("th:contains('Channeling')").parent().find('input:first').val(Math.floor((books*use_ratio[6]/newTotal)/fokcalc));
		// });
	




    } else if (page.match("(wol|gen)/(sit/)?game/province_operations") || page.match("(wol|gen)/(sit/)?game/thievery") || page.match("(wol|gen)/(sit/)?game/sorcery") || page.match("(wol|gen)/(sit/)?game/charms")) {
        console.log('op stuff! 3');
		if ( page.match("(wol|gen)/(sit/)?game/thievery") ) {
		//spellsstr = (sitting ? decodeURIComponent(getCookie2('activespellssitter')) : decodeURIComponent(getCookie2('activespells')));
		//console.log(spellsstr);
        if (spellsstr) {
    		if (spellsstr.match("Invisibility")) { 
    			invi = '<h2 id=spellslist><font color=#90ee90>Invisibility is on</font></h2>'; 
    			} 
    			else {
    			invi = '<h2 id=spellslist><font color=red>Invisibility seems off</font></h2>'; 
    		}
    		 $('input[type="submit"][value="Run operation"]').after('<table id=spellslist><tr><td>'+invi+'</td></tr></table>'); 
            $("#spellslist").hide().fadeIn();
        }
        thieves = $("th:contains('Number of thieves')").next('td').html().replace(/\,/g, '').replace(/\(.*\)/g, '');

        if (!$('#10thief').length) {
            $("#id_quantity").after('<input id=10thief class=button type=submit value="10 thief"><input id=10proc class=button type=submit value="10%"><input id=100proc class=button type=submit value="100%">');
                    
            $("#10thief").click(function(e){
                e.preventDefault();
                $("#id_quantity").val(10);
            });

            $("#10proc").click(function(e){
                e.preventDefault();
                thieves = $("th:contains('Number of thieves')").next('td').html().replace(/\,/g, '').replace(/\(.*\)/g, '');
                
                $("#id_quantity").val(Math.round(thieves/10)+1);
            });

            $("#100proc").click(function(e){
                e.preventDefault();
                thieves = $("th:contains('Number of thieves')").next('td').html().replace(/\,/g, '').replace(/\(.*\)/g, '');
                
                $("#id_quantity").val(parseInt(thieves));
            });

        }
        $("#100proc").after('<br><input id=calc class=button type=submit value="rob calc"><br><div id=robcalc style="background-color:#fff;color:#000;"></div');
           

		// 	$("#10thief").click(function(e){
		// 	    e.preventDefault();
		// 	    $("#id_quantity").val(10);
		// 	});
			
		// 	$("#10proc").click(function(e){
		// 	    e.preventDefault();
		// 	    thieves = $("th:contains('Number of thieves')").next('td').html().replace(/\,/g, '').replace(/\(.*\)/g, '');
			    
		// 	    $("#id_quantity").val(Math.round(thieves/10)+1);
		// 	});

  //           $("#100proc").click(function(e){
  //               e.preventDefault();
  //               thieves = $("th:contains('Number of thieves')").next('td').html().replace(/\,/g, '').replace(/\(.*\)/g, '');
                
  //               $("#id_quantity").val(thieves);
  //           });

            $("#calc").click(function(e){
                e.preventDefault();
                var target = $('#id_target_province option:selected').text();
                target = target.match(/\d+ (.+) --- \(.*/i);
                target = target[1];
                var spell = $('#id_spell option:selected, #id_operation option:selected').text().toLowerCase().split(" (")[0].replace(/ /g, "_").replace(/'/g, "");
                
                // console.log(target + " " + spell);

                if (spell=='rob_the_vaults') {
                    spell = 'gc';
                } else if (spell=='rob_the_towers') {
                    spell = 'runes';
                } else if (spell=='kidnap') {
                    spell = 'peons';
                } else if (spell=='rob_the_granaries') {
                    spell = 'food';
                }  else if (spell=='incite_riots') {
                    spell = 'riots';
                } else {
                    spell = 'unsupported';
                }

                $.ajax({
                    type: "POST",
                    url: sendUrlBase2,
                    data: "url=" + escape(document.URL) + "&pwd=" + pwdcookie + "&intelline=1&talk2bot=rob " + spell + " " + target
                }).done(function (html) {
                    // console.log(html);
                    $("#robcalc").html(html);
                    }); 


            });
		
   		}

        var form = $("#id_target_province").closest("form");
        opsgrid = '<br>Click abbreviation to select spell / target -- use buttons to select what to see: ';
        if (page.match("(wol|gen)/(sit/)?game/thievery")) operation = 'operation';
        if (page.match("(wol|gen)/(sit/)?game/sorcery")) operation = 'spell';
        if (page.match("(wol|gen)/(sit/)?game/charms")) operation = 'charms';
        
        if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
            form =  $(".game-content").find("form");
            operation = 'province_operations';

            war_room_stuff();
            console.log('hide reflexive!');
            $(".reflexive_magic").hide();
            $(".war_room").hide();
        }
        
        
        $("#id_"+operation+" > optgroup").each(function(i, obj) {
        	opsgrid = opsgrid + "<button onclick='$( \".label\" ).hide(); $( \"."+$(obj).attr('label').replace(/\s+/g, '')+"\" ).toggle()' value='"+$(obj).attr('label') +"'>"+$(obj).attr('label') +"</button>";
        	
        });
        opsgrid = opsgrid + '<table id=opsgrid><tr></tr>\n';
		$("#id_target_province > option").each(function(i, obj) {
		    //console.log(obj.text + ' ' + $(obj).val());
		    if (i > 0) {
			    provname = obj.text;
			    provid = $(obj).val();
			    opsgrid = opsgrid + '<tr><td>' + provname + '</td>';
			    
			    $("#id_"+operation+" > optgroup > option").each(function(i, obj) {
			   	 //console.log(obj.text + ' ' + $(obj).val());
			    	opname = obj.text;
			    	
		    		if (operation=='spell') opname = opname.match(/([\d\s\w-']+) \((.+?)\)/)[1];
		    		
		    		
			    	var matches = opname.match(/\b(\w)/g);              // ['J','S','O','N']
					var acronym = matches.join(''); 
					if (acronym.length == 1) acronym = opname.substring(0, 3);
					var label=$(obj).parent().attr('label');
	    
			    	opsgrid = opsgrid + '<td class="'+label.replace(/\s+/g, '')+' label" style="font-size: 7pt;"><span class=doop provname="'+provname.replace(/ /g, '_')+'" prov="'+provid+'" value="'+$(obj).val()+'" style="cursor: pointer; cursor: hand;">' + acronym + '</span></td>';
				});
			    opsgrid = opsgrid + '</tr>\n';
		    }
		});
		opsgrid =  opsgrid + "\n</table>\n";


        //form.after(opsgrid);
        
        
   
        
        
        $(".label").hide();
        
        if (pwdcookie!='null' && $(".change-kingdom-heading").length) {
						var sendUrlBase3 = "//intel.utopia-game.com/parse/parse.php";
						loc = $(".change-kingdom-heading").find('a').attr('href').match(/kingdom_details\/(\d)+\/(\d)+/g)[0].split('/');
		    			kd = loc[1];
		    			island = loc[2];
						//console.log('getting ops '+kd+':'+island+pwdcookie);
			        //     $.ajax({
					      //       type: "POST",
					      //       url: sendUrlBase3,
				   				// dataType: 'json',
					      //       data: "url=" + escape(document.URL) + "&intelline=1&oplist=1&kd="+kd+"&is="+island+"&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					      //   }).done(function (html) {
					        			
						     //    		 for (var prov in html) {
					    		// 			//console.log(prov);
					    		// 			for (var spell in html[prov]) {
					    		// 				//console.log(spell.toUpperCase());
					    		// 				for (var type in html[prov][spell]) {
						    	// 					//console.log(type+":"+html[prov][spell][type]['attempts']+" "+html[prov][spell][type]['results']+" "+html[prov][spell][type]['duration']['pretty']);
						    						
						    						
						    	// 					if (type=='good') $('span[value=\''+spell.toUpperCase()+'\']span[provname=\''+prov.replace(/ /g, '_')+'\']').before('<font color=green>'+html[prov][spell][type]['attempts']+'</font>');
						    	// 					if (type=='bad') $('span[value=\''+spell.toUpperCase()+'\']span[provname=\''+prov.replace(/ /g, '_')+'\']').before('<font color=red>'+html[prov][spell][type]['attempts']+'</font>');
						    	// 					duration = html[prov][spell][type]['duration']['pretty'];
						    	// 					if (duration>-24 && duration<0) $('span[value=\''+spell.toUpperCase()+'\']span[provname=\''+prov.replace(/ /g, '_')+'\']').after('<font color=red>'+duration+'</font>');
						    	// 					if (duration>-24 && duration>0) $('span[value=\''+spell.toUpperCase()+'\']span[provname=\''+prov.replace(/ /g, '_')+'\']').after('<font color=green>'+duration+'</font>');
						    	// 					if (['BRIBE_GENERALS','BRIBE_THIEVES','INFILTRATE','SPY_ON_SCIENCE','SPY_ON_MILITARY','SPY_ON_THRONE', 'SURVEY'].indexOf(spell.toUpperCase()) > -1 && type=='good') $('span[value=\''+spell.toUpperCase()+'\']span[provname=\''+prov.replace(/ /g, '_')+'\']').after(html[prov][spell][type]['ago']);
						    	// 					if (duration<-24 && type=='good' && html[prov][spell][type]['results']>0) $('span[value=\''+spell.toUpperCase()+'\']span[provname=\''+prov.replace(/ /g, '_')+'\']').after('<font color=green>'+html[prov][spell][type]['results']+'</font>');
						    						
						    	// 					//console.log('span[value=\''+spell.toUpperCase()+'\']span[\'provname='+prov.replace(/ /g, '_')+'\']');
						    	// 					//console.log('span[value=\''+spell.toUpperCase()+'\']span[\'provname='+prov.replace(/ /g, '_')+'\']');
						    	// 				}
					    						
					    		// 			}
					    					
					    		// 		 }
					      //   	});
					        	
				        	$.ajax({
				            type: "POST",
				            url: sendUrlBase3,
				            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=oporders todo&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					        }).done(function (html) {
					        			
						        		 opsplan = html;
						        		 opsplan = opsplan.replace(/span>.?:/g, '</td><td>');
						        		 opsplan = opsplan.replace(/(?:\r\n|\r|\n)/g, '</td></tr><tr style="background-color:#fff"><td>');
						        		 
						        		 
        								form.after('<div id="overlay"><table><tr style="background-color:#fff"><td>'+opsplan+'</table></div>');
					        	});
					        	
		}	
        if (pwdcookie!='null' && page.match("(wol|gen)/(sit/)?game/charms")) {
                        var sendUrlBase3 = "//intel.utopia-game.com/parse/parse.php";
                            $.ajax({
                            type: "POST",
                            url: sendUrlBase3,
                            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=requests&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
                            }).done(function (html) {
                                        
                                         opsplan = html;
                                         opsplan = opsplan.replace(/span>.?:/g, '</td><td>');
                                         opsplan = opsplan.replace(/(?:\r\n|\r|\n)/g, '</td></tr><tr style="background-color2:#ccc"><td>');
                                        form.after('<div id="requests"><table><tr style="background-color2:#fff"><td>'+opsplan+'</table></div>');
                                });                                
        }   
        
        
		$(".doop").click(function () {
			console.log('CLICKED prov:'+$(this).attr('prov')+' op:'+$(this).attr('value') + '"]');
			$('select[name="target_province"] option[value="' + $(this).attr('prov') + '"]').prop('selected', true);
			$('select[name="'+operation+'"] option[value="' + $(this).attr('value') + '"]').prop('selected', true);
			var operationinput = $('#id_'+operation+' option:selected').text();
			var target = $('#id_target_province option:selected').text();
			$("div #uniform-id_"+operation+" span").html(operationinput);
			$("div #uniform-id_target_province span").html(target);
	    });
        
        

        $("form input[type=submit]").click(function() {
            $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
            $(this).attr("clicked", "true");
        });

        submit_val_cookie = getCookie("submit_val");
        submit_val = null;
        if (form != null) {
            //console.log('Found!' + $(form).children(":submit"));

            $(form).submit(function (e) {
                // e.preventDefault();

                console.log('pressed! op',submit_val);
                var kd = $('#id_kingdom').val();
                var is = $('#id_island').val();
                if (page.match("(wol|gen)/(sit/)?game/charms")) {
                    var kd = "ownkd";
                    var is = "ownis";
                }var sent = $('#id_quantity').val();

                if (page.match("(wol|gen)/(sit/)?game/province_operations")) {

                    var submit_val = $("input[type=submit][clicked=true]").attr("name");
                    var test_val = $("input[type=hidden][name=send_army]").attr("value");
                    if (submit_val=='do_thief_operation') {
                        op_id = "#id_operation";
                    } else if (submit_val=='do_combat_magic') {
                        op_id = "#id_spell";
                    } else if (submit_val=='do_reflexive_magic') {
                        op_id = "#id_self_spell";
                    }  else if (test_val=='1') {
                        // skip this on attack
                        return;
                    } 

                    var spell = $(op_id + ' option:selected').text().toLowerCase().split(" (")[0].replace(/ /g, "_").replace(/'/g, "");

                    full_province = $(".game-header").find("h1").text();
                    loc = full_province.match(/(.+?) \((\d+):(\d+)\)/i);
                    target = loc[1];
                    kd = loc[2];
                    is = loc[3];
                } else {
                    if (page.match("(wol|gen)/(sit/)?game/charms")) {
                        var target = $('#id_target_province option:selected').text();
                        target = target.match(/\d+ (.+)/i);
                        target = target[1];
                    } else {
                        var target = $('#id_target_province option:selected').text();
                        target = target.match(/\d+ (.+) --- \(.*/i);
                        target = target[1];
                    }
                    var spell = $('#id_self_spell option:selected, #id_spell option:selected, #id_operation option:selected').text().toLowerCase().split(" (")[0].replace(/ /g, "_").replace(/'/g, "");
                   

                }

                var saveop = kd + "|" + is + "|" + target + "|" + spell + "|" + sent;
                console.log(saveop);
                setCookie("saveop", saveop);
                setCookie("submit_val", submit_val);
            });
        }
        if ($(".game-content div.good.message").length) {
            extra = getCookie("saveop");
            extra = 'good|' + extra + "|" + encodeURIComponent($("div.good.message").text());
            setCookie("saveop", '', -1);

            var game_content_html = $(".game-content").clone(true)
            game_content_html.find("form").remove();
            game_content_html = game_content_html.html();
        } else if ($(".game-content div.bad.message").length) {
            extra = getCookie("saveop");
            extra = 'bad|' + extra + "|" + encodeURIComponent($("div.bad.message").text());
            setCookie("saveop", '', -1);
        }
        if (extra) {
            console.log('Sending OP! ',extra);
            send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
            sendUrl = sendUrlBase + "op";
            page2 = "makeop";
            if (page.match("(wol|gen)/(sit/)?game/province_operations")) page2 = submit_val_cookie;
        }
    } else if (page.match("(wol|gen)/(sit/)?game/enchantment")) {

        var form = $("#id_self_spell").closest("form");
		
		//$('#id_spell option[value=""]').attr('selected', 'selected');
		//$('#id_spell option[value=""]').removeAttr("selected");
		//$('#id_spell').val( '' );
		//$('#id_spell:selected', 'select[name="spell"]').removeAttr('selected');
		//$("option:selected").removeAttr("selected");
		//console.log('option[value="' + getCookie2('lastselfspell') + '"]');
		//console.log($('select[name="spell"] option[value="' + getCookie2('lastselfspell') + '"]').text());
		//$('select[name="spell"] option[value="' + getCookie2('lastselfspell') + '"]').prop('selected', true);
		//test = $('select[name="spell"]').html(); //remove all child nodes
		//$('select[name="spell"]').empty(); //remove all child nodes
		//$('select[name="spell"]').html(test); //remove all child nodes
		$('select[name="self_spell"] option[value="' + getCookie('lastselfspell') + '"]').prop('selected', true);
		
		//var clone = jQuery('#uniform-id_spell').clone(true);
			
			
		//jQuery('#uniform-id_spell').after(clone);
		//jQuery('#uniform-id_spell').remove();
		
		
		//$('select').prop('selectedIndex', 12);
		//$("select").trigger("liszt:updated");
		//$("select").remove();
		//.attr('selected', 'selected');
		var spell = $('#id_self_spell option:selected').text();
		$("div #uniform-id_self_spell span").html(spell);

		//$("select, input:checkbox, input:radio, input:file").uniform();
		
		
		
        if (form != null) {
            //console.log('Found!' + $(form).children(":submit"));

            $(form).submit(function (e) {
                //e.preventDefault();
                var kd = "ownkd";
                var is = "ownis";
                var target = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));;
                var spell = $('#id_self_spell option:selected').text().toLowerCase().split(" (")[0].replace(/ /g, "_").replace(/'/g, "");
                var sent = 0;
                var saveop = kd + "|" + is + "|" + target + "|" + spell + "|" + sent;
                console.log(saveop);
                setCookie("saveop", saveop);
                setCookie("lastselfspell", $('#id_self_spell option:selected').val());
                
                console.log($('#id_self_spell option:selected').val());
            });
        }
        if ($(".game-content div.good.message").length) {
            extra = getCookie("saveop");
            extra = 'good|' + extra + "|" + encodeURIComponent($("div.good.message").text());
            setCookie("saveop", '', -1);
            setCookie("lastgoodop", new Date().getTime(),1);
            lastgoodop = new Date().getTime();

            var game_content_html = $(".game-content").clone(true)
            game_content_html.find("form").remove();
            game_content_html = game_content_html.html();
        } else if ($(".game-content div.bad.message").length) {
            extra = getCookie("saveop");
            extra = 'bad|' + extra + "|" + encodeURIComponent($("div.bad.message").text());
            setCookie("saveop", '', -1);
        }
        console.log('Added extra info!:'+extra)



        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "selfspell";
        page2 = "makespell";
        
    } else if (page.match("(wol|gen)/(sit/)?game/kingdom_details")) {


    	if (pwdcookie) {
			sendUrlBase3 ="//intel.utopia-game.com/parse/parse.php";
			loc = $(".change-kingdom-heading").find('a').attr('href').match(/kingdom_details\/(\d)+\/(\d)+/g)[0].split('/');
			if (loc) {
			//console.log("loc"+loc[1]);
			//console.log("loc"+loc[2]);
    		$.ajax({
		            type: "POST",
		            url: sendUrlBase3,
		            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=cf "+loc[1] + ":"+loc[2]+"&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
		        }).done(function (html) {
		        	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
		        	//$('#botresponse').html($('#botcommand').val());
		        	if (!(html.match("Not found")) && !(html.match("unknown")) && !(html.trim()=="<3")) $(".change-kingdom-heading").append("<hr>"+html+"<hr><br>");
	        	});
        	}

    	}
    	
    	if ($(".advice-message").length && $(".advice-message").text().match("This kingdom is currently at war") && getCookie("layout_warkd")=="1") {
    		//console.log("AT WAR");
    		$(".game-content").css('background-color','rgba(240,50,50,0.2)');
    	} else {
    		$(".game-content ").css('background-color','');
    	}
        if (getCookie('layout_hide_banner')=='1') {
            $(".reportable").hide();
        }
    	
    	var layouts=["Original","General","Armies","War","TM","Calced","Resources","Military","Population","Survey","SoS","SoM"];
		
		var buttons = '';
		for (l in layouts) {
					            buttons += '<input id="b'+layouts[l]+'"  onclick=\"changeview(\''+layouts[l]+'\');\" type="button" value="'+layouts[l]+'"/>';
		}
		
    	$('.tablesorter').before("<div id=layouts><h2>"+buttons+"</h2></div>");
    	
    	
    	if (getCookie('layout_kdpage')=='1' || getCookie('layout_kdpage')=='0') {
    		
    		$.getScript("//code.highcharts.com/highcharts.js", function( data, textStatus, jqxhr ) {
					  //console.log( data ); // Data returned
					  //console.log( textStatus ); // Success
					  //console.log( jqxhr.status ); // 200
					  //console.log( "Load was performed." );
					});	
    		
	    	nw = $("#resource-bar tbody th:eq(4)").html().replace(/\,/g, '');
	    	land = $("#resource-bar tbody th:eq(5)").html().replace(/\,/g, '');
	    	
	    	target_kd_nw = $(".two-column-stats tbody td:eq(2)").html();
	    	target_kd_stance = $(".two-column-stats tbody td:eq(1)").html();
	    	var graphname ='';
	    	
	    	target_kd_nw = target_kd_nw.match(/([\d,]+)gc/)[1].replace(/\,/g, '');
	    	//console.log(target_kd_stance);
	    	if (page.match("(wol|gen)/(sit/)?game/kingdom_details$") || $(".you").length==2) {
	    		setCookie("ownkdnw", target_kd_nw, 2);
	    		setCookie("ownstance", target_kd_stance, 2);
	    		if (getCookie("ownkdnw")) own_kd_nw=getCookie("ownkdnw");
	    		//console.log("1 " +target_kd_nw+" vs "+own_kd_nw);
	    	} else {
	    		//if (getCookie("ownkdnw")) own_kd_nw=getCookie("ownkdnw");
	    		//console.log("2 " +target_kd_nw+" vs "+getCookie("ownkdnw"));
	
	    	}
			if (getCookie('layout_kdpage')=='1') $(".tablesorter tr:first").append("<th>Gains<div class='order-icon'></div></th>");
			$(".tablesorter tr:first th:eq(0)").html("Slot/Online<div class='order-icon'></div>");
			$(".tablesorter tr:first th:eq(5)").html("NWPA<div class='order-icon'></div>");
			
			
        	$(".tablesorter").before("<div id=container style=\"margin: 0 auto\"></div>");
			
			var provacres = new Array();
			var provnw = new Array();
			
			$('.tablesorter > tbody > tr').each(function(i,row) { 
				// $(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append("<span style='display:none;'>-1</span>-");
        			
				if ($(".tablesorter > tbody > tr:eq("+i+") > td:eq(2)").html()!="-") {
					target_land = $(".tablesorter > tbody > tr:eq("+i+") > td:eq(3)").html();
					$(".tablesorter > tbody > tr:eq("+i+") > td:eq(3)").html(target_land.match(/([\d,]+) acres/)[1]+"a");
		    		target_land = target_land.match(/([\d,]+) acres/)[1].replace(/\,/g, '');
		    		provacres.push(target_land);
					land_nw = $(".tablesorter > tbody > tr:eq("+i+") > td:eq(4)").html();
		    		land_nw = land_nw.match(/([\d,]+)gc/)[1].replace(/\,/g, '');
		    		provnw.push(land_nw);
		    				    		
		    		$(".tablesorter > tbody > tr:eq("+i+") > td:eq(1)").css('text-align','center');
		    		// if ($(".tablesorter > tbody > tr:eq("+i+") > td:eq(1)").html().match("\\*")) {
		    		// $(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append(" <span style='display:none;'>2</span><img  id=intelhover"+i+" style='cursor: pointer; cursor: hand;' height=10 src='//intel.utopia-game.com/img/online.png'>");
        // 			$(".tablesorter > tbody > tr:eq("+i+") > td:eq(1)").html($(".tablesorter > tbody > tr:eq("+i+") > td:eq(1)").html().replace('*', ''));
        // 			}	else {
		    		// $(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append(" <span style='display:none;'>1</span><img id=intelhover"+i+" style='cursor: pointer; cursor: hand;' height=10 src='//intel.utopia-game.com/img/offline.png'>");
        // 			}	
        			//$(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append(" <img style='cursor: pointer; cursor: hand;' id=intelhover"+i+" height=13 src='//umunk.net/stable/img/info-icon.png'>");
                    $(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append(" <img style='cursor: pointer; cursor: hand;background-color:#ccc;' id=graph"+i+" height=13 src='//intel.utopia-game.com/tf/img/chart.ico'>");
                    $(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append(" <img style='cursor: pointer; cursor: hand;background-color:#ccc;' id=intelhover"+i+" height=13 src='//intel.utopia-game.com/img/spy4.png'>");
		    		// $(".tablesorter > tbody > tr:eq("+i+") > td:eq(0)").append(" <img style='cursor: pointer; cursor: hand;background-color:#ccc;' id=graphweek"+i+" height=13 src='//tf.umunk.net/img/chart.ico'>");
		    		
        			
        			
        			
        			var chartoptions = {
    
			            chart: {
			                renderTo: 'container',
			                type: 'spline',
			                zoomType: 'x'
			            },
			    
			            title: {
			                text: 'test'
			            },
			    
			            subtitle: {
			                text: ' '
			            },
			    
			            xAxis: {
			                type: 'datetime',
			                tickInterval: 1 * 24 * 3600 * 1000, // one week
			                tickWidth: 1,
			                gridLineWidth: 1,
			                labels: {
			                    align: 'left',
			                    x: 3,
			                    y: -3,
			                    formatter: function() { return getUtopiaDate(this.value);}
			                },
			                
			            },
			    
			            yAxis: [{ // Primary yAxis
			                labels: {
			                    formatter: function() {
			                        return addCommas(this.value) ;
			                    },
			                    style: {
			                        color: '#8D3D39'
			                    }
			                },
			                title: {
			                    text: 'Networth',
			                    style: {
			                        color: '#8D3D39'
			                    }
			                }
			            }, { // Secondary yAxis
			                title: {
			                    text: 'Land',
			                    style: {
			                        color: '#4572A7'
			                    }
			                },
			                labels: {
			                    formatter: function() {
			                        return addCommas(this.value) ;
			                    },
			                    style: {
			                        color: '#4572A7'
			                    }
			                },
			                opposite: true
			            }],
			    
			            legend: {
			                align: 'left',
			                verticalAlign: 'top',
			                y: 20,
			                floating: true,
			                borderWidth: 0
			            },
			    
			            tooltip: {
			                shared: true,
			                crosshairs: true,
			                formatter: function() { 
			                	return getUtopiaDate(this.x)  + '<br>'
			                	 + addCommas(this.points[0].y) + ' acres<br>'
			                	  + addCommas(this.points[1].y) + ' networth<br>'
			                	   + 'Stance: ' + this.points[0].point.info;}
			            },
			    
			           
			    
			            series: [{
			                name: 'Land',
			                lineWidth: 5,
			                yAxis: 1,
			                marker: {
			                    radius: 0
			                }
			            }, {
			                name: 'Networth',
			                lineWidth: 5,
			                marker: {
			                    radius: 0
			                }
			            }
			        ]
			        };
        			
        			$("#graph"+i).click(function( ){
        				
					    if (graphname == $(this).parent().parent().find('a').html())	{
					    	$("#container").fadeOut();
					    	//$("#container").html('');
					    	//$("#container").show();
					    	graphname = '';
					    } else {
					    	if(!$("#container").is(":visible")) {$("#container").html('');$("#container").show();}
					   		if (graphname!='') {
					   			//$("#container").fadeOut();
					   			//$("#container").html('');
					    		//$("#container").show();
					    	}
        				
			    			//console.log(graphname == $(this).parent().parent().find('a').html());
			    			graphname = $(this).parent().parent().find('a').html();
			    			graphid = $(this);
			    			//\/(\d)+\/(\d)+
			    			loc = $(this).parent().parent().find('a').attr('href').match(/province_operations\/(\d)+\/(\d)+/g)[0].split('/');
			    			kd = loc[1];
			    			island = loc[2];
			    			//console.log(loc);
			    			jQuery.get('//intel.utopia-game.com/tf/chartsdata.php?island='+island+'&kingdom='+kd+'&prov='+graphname+'&game_server='+game_server, null, function(tsv, state, xhr) {
	        	
				            var lines = [],
				                listen = false,
				                date,
				    
				                // set up the two data series
				                allVisits = [],
				                newVisitors = [];
				    
				            // inconsistency
				            if (typeof tsv !== 'string') {
				                tsv = xhr.responseText;
				            }
				    
				            // split the data return into lines and parse them
				            tsv = tsv.split(/\n/g);
				            runningtotal = 0;
                            maxdate = 0;
                            mindate = 1000000000000000;
				            jQuery.each(tsv, function(i, line) {
				    
				                // listen for data lines between the Graph and Table headers
				                if (tsv[i - 2] == '# Graph') {
				                    listen = true;
				                } else if (line == '' || line.charAt(0) == '#') {
				                    listen = false;
				                }
				    
				                // all data lines start with a double quote
				                if (listen) {
				                    line = line.split(/\t/);
				                    //date = Date.parse(line[0] +' UTC');
				                    date = parseInt(line[0]);
                                    if (date>maxdate) maxdate = date;
                                    if (date<mindate) mindate = date;
				    				runningtotal += parseInt(line[1].replace(',', ''), 10);
				    				pushvals = {};
				    				pushvals['x'] = date;
				    				pushvals['y'] = parseInt(line[1].replace(',', ''), 10);
				    				pushvals['info'] = line[3] + " <br>Running total:" + runningtotal;
				    				//alert(pushvals['info']);
				                    allVisits.push(pushvals);
				                    newVisitors.push([
				                        date,
				                        parseInt(line[2].replace(',', ''), 10)
				                    ]);
				                }
				            });
				            var options = chartoptions;
				            options.series[0].data = allVisits;
				            options.series[1].data = newVisitors;
				            
				        runningtotal = Math.round(runningtotal/1000)+"k";
			            options.title.text = graphname+ ' (' + kd + ':' + island + ')<br>Running Total: '+runningtotal;
                        interval = Math.ceil((maxdate-mindate)/(24 * 3600 * 1000)/5);
                        console.log('interval '+interval)
                        options.xAxis.tickInterval = interval * 12 * 3600 * 1000;
			            chart1 = new Highcharts.Chart(options);
					    //$("#container").hide();
						//$("#container").slideDown();
				
						});
				 }

					});
					
					$("#graphweek"+i).click(function( ){
        				
					    if (graphname == $(this).parent().parent().find('a').html())	{
					    	$("#container").fadeOut();
					    	//$("#container").html('');
					    	//$("#container").show();
					    	graphname = '';
					    } else {
					    	if(!$("#container").is(":visible")) {$("#container").html('');$("#container").show();}
					   		if (graphname!='') {
					   			//$("#container").fadeOut();
					   			//$("#container").html('');
					    		//$("#container").show();
					    	}
        				
			    			//console.log(graphname == $(this).parent().parent().find('a').html());
			    			graphname = $(this).parent().parent().find('a').html();
			    			graphid = $(this);
			    			//\/(\d)+\/(\d)+
			    			loc = $(this).parent().parent().find('a').attr('href').match(/province_profile\/(\d)+\/(\d)+/g)[0].split('/');
			    			kd = loc[1];
			    			island = loc[2];
			    			//console.log(loc);
			    			jQuery.get('//tf.umunk.net/chartsdata.php?days=14&island='+island+'&kingdom='+kd+'&prov='+graphname, null, function(tsv, state, xhr) {
	        	
				            var lines = [],
				                listen = false,
				                date,
				    
				                // set up the two data series
				                allVisits = [],
				                newVisitors = [];
				    
				            // inconsistency
				            if (typeof tsv !== 'string') {
				                tsv = xhr.responseText;
				            }
				    
				            // split the data return into lines and parse them
				            tsv = tsv.split(/\n/g);
				            runningtotal = 0;
				            jQuery.each(tsv, function(i, line) {
				    
				                // listen for data lines between the Graph and Table headers
				                if (tsv[i - 2] == '# Graph') {
				                    listen = true;
				                } else if (line == '' || line.charAt(0) == '#') {
				                    listen = false;
				                }
				    
				                // all data lines start with a double quote
				                if (listen) {
				                    line = line.split(/\t/);
				                    //date = Date.parse(line[0] +' UTC');
				                    date = parseInt(line[0]);
				    				runningtotal += parseInt(line[1].replace(',', ''), 10);
				    				pushvals = {};
				    				pushvals['x'] = date;
				    				pushvals['y'] = parseInt(line[1].replace(',', ''), 10);
				    				pushvals['info'] = line[3] + " <br>Running total:" + runningtotal;
				    				//alert(pushvals['info']);
				                    allVisits.push(pushvals);
				                    newVisitors.push([
				                        date,
				                        parseInt(line[2].replace(',', ''), 10)
				                    ]);
				                }
				            });
				            var options = chartoptions;
				            options.series[0].data = allVisits;
				            options.series[1].data = newVisitors;
				            
				        runningtotal = Math.round(runningtotal/1000)+"k";
			            options.title.text = graphname+ ' (' + kd + ':' + island + ')<br>Running Total: '+runningtotal;
                        options.xAxis.tickInterval = 2 * 24 * 3600 * 1000;
                        if (typeof _dataChart != "undefined" && typeof _dataChart.destroy == "function") _dataChart.destroy();
			            chart1 = new Highcharts.Chart(options);
					    //$("#container").hide();
						//$("#container").slideDown();
				
						});
				 }

					});


        			
		    		$("#intelhover"+i).click(function( ){
		    			//console.log('get info');
		    			prov_name = $(this).parent().parent().find('a').html();
		    			
		    			if (pwdcookie) {
			    			sendUrlBase3 ="//intel.utopia-game.com/parse/parse.php";
			    			if (!$('#intel'+i).length){ 
			    				$(this).parent().parent().after("<tr><td style='display:none;padding:0px;' colspan=10 id=intel"+i+"><div id=htmlsot"+i+"></div></td></tr>");
                                $.ajax({
                                        type: "POST",
                                        url: sendUrlBase3,
                                        data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=combine_html_intel "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
                                    }).done(function (html) {
                                        $('#htmlsot'+i).html(html+"<hr>");
                                        $('#htmlsot'+i).fadeIn('slow');
                                        
                                    });
                                 
                                $('#intel'+i).fadeIn('slow');

                                // $(this).parent().parent().after("<tr><td style='background-color:#eee;color:black;display:none;' align=left colspan=8 id=intel"+i+"><div id=sot"+i+"></div><div id=som"+i+"></div><div id=survey"+i+"></div><div id=sos"+i+"></div><div id=extra"+i+"></div></td></tr>");
              //                   $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=sot "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") {
							       //  	// 	setCookie('userpwd', '',-1);
							       //  	// }
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#sot'+i).html(html+"<hr>");
						        // 		$('#sot'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=som "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#som'+i).html(html+"<hr>");
						        // 		$('#som'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=survey "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#survey'+i).html(html+"<hr>");
						        // 		$('#survey'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=sos "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#sos'+i).append(html+"<hr>");
						        // 		$('#intel'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=ops24 "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#extra'+i).append(html+"<hr>");
						        // 		$('#intel'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=econ "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#extra'+i).append(html+"<hr>");
						        // 		$('#intel'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=def "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#extra'+i).append(html+"<hr>");
						        // 		$('#intel'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=lasthit "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#extra'+i).append(html+"<hr>");
						        // 		$('#intel'+i).fadeIn('slow');
							        	
						        // 	});
						        // $.ajax({
							       //      type: "POST",
							       //      url: sendUrlBase3,
							       //      data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=growth24 "+prov_name + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
							       //  }).done(function (html) {
							       //  	// if (html.trim()=="<3") setCookie('userpwd', '',-1);
							       //  	//$('#botresponse').html($('#botcommand').val());
							       //  	$('#extra'+i).append(html+"<hr>");
						        // 		$('#intel'+i).fadeIn('slow');
							        	
						        // 	});
					       } else {
						    $('#intel'+i).fadeOut('slow');
					       	$('#intel'+i).parent().remove();
					       }
					    } else {
					    	$('#botresponse').html('MunkLogin: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
		    		$("#login2bot").click(function () {
		                user = $("#botuser").val();
		                pwd = $("#botpass").val();
		                setCookie('userpwd', user+"|,|"+pwd,14);
		                pwdcookie = user+"|,|"+pwd;
		                $('#botresponse').html('');
		                $.ajax({
					            type: "POST",
					            url: sendUrlBase2,
					            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					        }).done(function (html) {
					        	if (html.trim()=="<3") { 
					        			// setCookie('userpwd', '',-1);
					        			 //$('#botresponse').html('Bad Login -- check password?');
					        			 $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
						        	} else {			
						        		 $('#botresponse').html('Successful login');
						        		 setTimeout(function () {
							                $('#botresponse').html('');
							              }, 5000);
						        	}
					        	});
		           });
				           $('#overlay').show();
				           
					    }
					});
					
					
					
					rknw = target_kd_nw/getCookie("ownkdnw");
					rpnw = land_nw/nw;
					
					if (rpnw<0.567) {
						rpnw_m=0;
					} else if (rpnw>0.567 && rpnw<0.9) {
						rpnw_m=3*rpnw-1.7;
					} else if (rpnw>0.9 && rpnw<1.1) {
						rpnw_m=1;
					} else if (rpnw>1.1 && rpnw<1.6) {
						rpnw_m=-2*rpnw+3.2;
					} else {
						rpnw_m=0;
					}
					
					if (rknw<0.4) {rknw_m=0.6666;} else if (rknw>0.4 && rknw<0.9) {rknw_m=2/3*rknw+0.4;} else {rknw_m=1;}
					
					if (target_kd_stance=="Fortified") {tar_stance = 0.5;} else {tar_stance =1;}
					if (getCookie("ownstance")=="Fortified") {own_stance = 0.5;} else if (getCookie("ownstance")=="Aggressive") {own_stance = 1.1;} else {own_stance = 1;}
					
					gbp = 1;
					//if ($tar_mod=='Lit') {$gbp = 0.9;}elseif ($tar_mod=='Mod') {$gbp = 0.7;}elseif ($tar_mod=='Hev') {$gbp = 0.5;}elseif ($tar_mod=='Ext') {$gbp = 0.25;}
					
					//if ($tar_stance2=='WAR') {
						
					//	if ($gbp<0.8) $gbp = 0.8;
					//}
					
					//elseif (mysql_result($rs,$i,"k_stance")=="WAR") {$stance = 0.25;} else {$stance = 1;}
					//echo $_POST['gain_mod'];
					//*$own_sci
					//console.log(rpnw_m+" "+rknw_m);
					gain = Math.round(Math.min(target_land*rpnw_m*rknw_m*0.12*own_stance*tar_stance,target_land*0.2),0);
				
					
					
					if (getCookie('layout_kdpage')=='1') $(".tablesorter > tbody > tr:eq("+i+")").append("<td>"+gain+"</td>");
					if (getCookie('layout_range')=='1') {
						if (rpnw>0.8 && rpnw<1.2) {
							 $(".tablesorter > tbody > tr:eq("+i+")").children('td,th').css("color", "#EB42EB");
						}
					}
				} else {
					if (getCookie('layout_kdpage')=='1') $(".tablesorter > tbody > tr:eq("+i+")").append("<td>-</td>");
				}
				
				
				
				});
					function median(values) {
 
					    values.sort( function(a,b) {return a - b;} );
					 
					    var half = Math.floor(values.length/2);
					 
					    if(values.length % 2)
					        return values[half];
					    else
					        return (parseInt(values[half-1]) + parseInt(values[half])) / 2.0;
					}
					 
					mediana = median(provacres);
					mediannw = median(provnw);
					//median_id = $(".two-column-stats tbody td:eq(0)").html();
					//console.log(median_id);
					//median =  $(".tablesorter > tbody > tr:eq("+(median_id-1)+") > td:eq(3)").html();
					$(".two-column-stats tbody td:eq(4)").append('<br>(med: '+mediana+'a)');
					$(".two-column-stats tbody td:eq(2)").append('<br>(med: '+mediannw+'gc)');
				
				var clone = jQuery(".tablesorter").clone(true);
				clone.attr('id','clone_kingdom');
				
				jQuery(".tablesorter").after(clone);
				jQuery(".tablesorter:first").remove();
				
				function hideBookmarkOptions()
			    {
			        // hide the list.
			        $("#bookmark-details").hide();
			        $("#bookmark-header").removeClass("selected");
			    }
			    function showBookmarkOptions()
			    {
			        $("#bookmark-details").show();
			        $("#bookmark-header").addClass("selected");
			    }
			
			    $("#bookmark-header").click(function(event)
			    {
			        if($('#bookmark-details').is(':visible'))
			        {
			            hideBookmarkOptions();
			        }
			        else
			        {
			            // We're not showing this list. Show it.
			            showBookmarkOptions();
			            // Set up a handler to dismiss if the user clicks outside the list.
			            $('html').click(function(event)
			            {
			                hideBookmarkOptions();
			            });
			            // Catch the user clicking on the list to prevent the previous handler firing.
			            $("#bookmark-details").click(function(event)
			            {
			                event.stopPropagation();
			            });
			        }
			        // Stop the event continuing to fire and interfering with the above handlers.
			        event.stopPropagation();
			    });
			    
			     //Auto submit Change Kingdom form on bookmark selection
		        $(".use-shortcut").click(function () {
		            $("#id_kingdom").val($(this).attr("kingdom_num"));
		            $("#id_island").val($(this).attr("island_num"));
		            $("#change-kingdom-button").click();
		        });
		
		        //Submit add bookmark form on link click
		        $("#id_add_bookmark_link").click(function () {
		            // Copy values from change kingdom form
		            $("#id_add_bookmark_form [name='kingdom_number']").val($("#id_kingdom").val());
		            $("#id_add_bookmark_form [name='island_number']").val($("#id_island").val());
		            $("#id_add_bookmark_form [name='next_url']").val($("#id_next_url").val());
		            $("#id_add_bookmark_form").submit();
		        });
						
				$.getScript( "//"+server_domain+"/"+game_server+"/static/common/js/jquery.tablesorter.min.js", function( data, textStatus, jqxhr ) {
				  //console.log( data ); // Data returned
				  //console.log( textStatus ); // Success
				  //console.log( jqxhr.status ); // 200
				  // console.log( "Load was performed." );
				  
					function get_honor_value(htitle_) {
			            //translate honour to a number
			            htitle = htitle_.toLowerCase();
			            if (htitle == "peasant") return 10;
			            if (htitle == "-") return 10;
			            else if (htitle == 'knight' || htitle == 'lady') return 9;
			            else if (htitle == 'lord' || htitle == 'noble lady') return 8;
			            else if (htitle == 'baron' || htitle == 'baroness') return 7;
			            else if (htitle == 'viscount' || htitle == 'viscountess') return 6;
			            else if (htitle == 'count' || htitle == 'countess') return 5;
			            else if (htitle == 'marquis' || htitle == 'marchioness') return 4;
			            else if (htitle == 'duke' || htitle == 'duchess') return 3;
			            else if (htitle == 'prince' || htitle == 'princess') return 2;
			            else if (htitle == 'king' || htitle == 'queen') return 1;
			            else return false;
			        }
			        // add parser through the tablesorter addParser method
			        $.tablesorter.addParser({
			            // set a unique id
			            id: 'gold_coin_parser',
			            is: function(s) {
			                // return false so this parser is not auto detected
			                return false;
			            },
			            format: function(s) {
			                // format gc values
			                return s.replace("gc","").replace(/,/g,"");
			            },
			            // set type, either numeric or text
			            type: 'numeric'
			        });
			        $.tablesorter.addParser({
			            // set a unique id
			            id: 'land_parser',
			            is: function(s) {
			                // return false so this parser is not auto detected
			                return false;
			            },
			            format: function(s) {
			                // format gc values
			                return s.replace("a","").replace(/,/g,"");
			            },
			            // set type, either numeric or text
			            type: 'numeric'
			        });
			        $.tablesorter.addParser({
			            // set a unique id
			            id: 'honor_parser',
			            is: function(s) {
			                // return false so this parser is not auto detected
			                return false;
			            },
			            format: function(s) {
			                // format gc values
			                return get_honor_value(s);
			            },
			            // set type, either numeric or text
			            type: 'numeric'
			        });
			        $.tablesorter.addParser({
			            // set a unique id
			            id: 'online',
			            is: function(s) {
			                // return false so this parser is not auto detected
			                return false;
			            },
			            format: function(s) {
			                // format gc values
			                return s.childNodes[0].innerHTML;
			            },
			            // set type, either numeric or text
			            type: 'numeric'
			        });

                    $.tablesorter.addParser({
                        // set a unique id
                        id: 'slot',
                        is: function(s) {
                            // return false so this parser is not auto detected
                            return false;
                        },
                        format: function(s) {
                            // format gc values
                            return s.split(" ")[0];
                        },
                        // set type, either numeric or text
                        type: 'numeric'
                    });
			        
			        var kingom_data_extraction = function(node) {
			            text = $(node).text();
			            if (text == "-") {
			                // Unused kingdom slots
			                return "";
			            } else {
			                return text;
			            }
			        };
			        	
						 $('.tablesorter')
						 .unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
						 ;
						        	
						if (getCookie("layout_kd_land")=="1") {
							
							$("#clone_kingdom").tablesorter({
				                 textExtraction: kingom_data_extraction,
				                headers: {
				                    // Sorter for province name must be specified (is not auto detected)
				                    0: {sorter:'slot', sortInitialOrder: 'asc'},
                                    1: {sorter:'text'},
				                    // Custom sorter for Land
				                    3: {sorter:'land_parser', sortInitialOrder: 'desc' },
				                    // Custom sorter for net worth, net worth / acre
				                    4: {sorter:'gold_coin_parser'},
				                    5: {sorter:'gold_coin_parser'},
				                    6: {sorter:'honor_parser'},
				                    7: {sorter:'numeric'}
				                },
				                sortList  : [[ 3,1 ]]
			           	 	});
							
						} else {
							
							$("#clone_kingdom").tablesorter({
				                 textExtraction: kingom_data_extraction,
				                headers: {
				                    // Sorter for province name must be specified (is not auto detected)
				                    0: {sorter:'slot', sortInitialOrder: 'asc'},
                                    1: {sorter:'text'},
				                    // Custom sorter for Land
				                    3: {sorter:'land_parser', sortInitialOrder: 'desc' },
				                    // Custom sorter for net worth, net worth / acre
				                    4: {sorter:'gold_coin_parser'},
				                    5: {sorter:'gold_coin_parser'},
				                    6: {sorter:'honor_parser'},
				                    7: {sorter:'numeric'}
				                },
			           	 	});
						}
						        	

					  
		              //$(".tablesorter").tablesorter();
        
			});
			}
    	
    	
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "kingdom";
    } else if (page.match("(wol|gen)/(sit/)?game/council_internal")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "survey";
        page2 = "self_survey";
        var game_content_html = $(".game-content").clone(true)
        game_content_html.find("form").remove();
        game_content_html = game_content_html.html();
    }
    // } else if (page.match("(wol|gen)/(sit/)?game/build")) {
    //     send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
    //     sendUrl = sendUrlBase + "survey";
    //     page2 = "build";

    //     url_link = "//"+server_domain+"/"+game_server+"/game/council_internal";
    //     if (sitting) url_link = "//"+server_domain+"/"+game_server+"/sit/game/council_internal";
    //     console.log('getting raw survey for intel');
    //     // console.log("AJAX "+url_link);
    //     $.ajax({
    //         type: "GET",
    //         url: url_link,
    //     }).done(function (html) {
    //         pagehtml = html;
    //         var n = pagehtml.indexOf('<div class="game-content">');
    //         pagehtml = pagehtml.substring(n);
    //         pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
    
    //         var el = $('<div id=council></div>');
    //         el.html(pagehtml);
    //         el.find("form").remove();
    //         text_survey = el.find(".game-content").text();
    //         raw_survey = el.find(".game-content").html();
    //         $.ajax({
    //             type: "POST",
    //             url: sendUrlBase2,
    //             data: "url=" + escape(url_link) + "&version=" + version + "&data=" + escape(text_survey) + "&raw_html=" + escape(raw_survey) + "&token=" + token + "&prov=" + (sitting ? escape(getCookie("sitname_"+game_server)) : escape(getCookie("provname_"+game_server))) + "&page=rawsurvey&sitter=" + sitting + "&realprov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
    //             }).done(function (html2) {
    //             // console.log("raw_survey_result :"+html2);
    //         });
    //     });

    //     //console.log($("th:contains('Total Land')").next().text());

    //     //console.log($("th:contains('Homes')").next().text());
    //    // console.log("hospital check! "+$("th:contains('Hospitals')" ).next().text());
    //     buildcost = $("th:contains('Construction Cost')" ).next().text().replace("gc per acre","").replace(/\,/g, '');
    //     razecost = $("th:contains('Raze Cost')" ).next().text().replace("gc per acre","").replace(/\,/g, '');
    //     freebuild = $("th:contains('Free Building Credits')" ).next().text().replace(/\,/g, '');
    //     //console.log("Build cost:"+buildcost+" Raze:"+razecost+" creds "+freebuild);



    //     function getbuilding(type, name2) {
    //         totalacres = parseInt($("th:contains('Total Land')").next().text().replace(/\,/g, ''));

    //         buildingacres = parseInt($("th").filter(function () {
    //             return $(this).text() === type;
    //         }).next().text().replace(/\,/g, ''));
    //         incacres = parseInt($("th").filter(function () {
    //             return $(this).text() === type;
    //         }).next().next().text().replace(/\,/g, ''));
    //         percentage = Math.round(buildingacres * 1000 / totalacres) / 10;
    //         //$("th").filter(function() { return $(this).text() === type;}).next().append('<br>('+percentage+'%)');
    //         percentage2 = Math.round(incacres * 1000 / totalacres) / 10;
    //         //$("th").filter(function() { return $(this).text() === type;}).next().next().append('<br>('+percentage2+'%)');
    //         //console.log(type + ' per ' + percentage);
    //         //console.log(percentage);
    //         //$(".game-content").append('<td>'+name2+'<br><input type=text size=2></td>');
    //         buildtable += '<td align=center>' + name2 + '<br><input type=text size=2 id=\'' + name2 + '\' style=\'text-align: right\' value=' + (Math.round((percentage2 + percentage) * 10) / 10) + '><div style=\'text-align: center;background-color:#BBBBBB;width:40px\' id=\'build_' + name2 + '\' value=0></span></td>';
    //     }

    //     function keyupthing(type, name) {

    //         $("#" + name).keyup(function () {
    //             var newVideoName = $("#" + name).val();
    //             //console.log('key up!');
    //             totalacres = parseInt($("th:contains('Total Land')").next().text().replace(/\,/g, ''));

    //             futureland = parseInt($("#futureland").val());

    //             if (!(futureland)) futureland = 0;

    //             totalacres = totalacres + futureland;

    //             buildingacres = parseInt($("th").filter(function () {
    //                 return $(this).text() === type;
    //             }).next().text().replace(/\,/g, ''));
    //             incacres = parseInt($("th").filter(function () {
    //                 return $(this).text() === type;
    //             }).next().next().text().replace(/\,/g, ''));
    //             suggestion = Math.round(newVideoName * totalacres * 0.01 - buildingacres - incacres);
    //             $("#build_" + name).val(suggestion);
    //             $("#build_" + name).text(suggestion);
    //             if (suggestion > 0) {
    //                 $("#build_" + name).css("background-color", "green");
    //             } else if (suggestion < 0) {
    //                 $("#build_" + name).css("background-color", "red");
    //             } else {
    //                 $("#build_" + name).css("background-color", "grey");
    //             }
    //             gettotal();

    //         });
    //     }

    //     function refresh(type, name) {


    //         var newVideoName = $("#" + name).val();
    //         if (!(newVideoName)) {
    //             $("#" + name).val(0);
    //             newVideoName = 0;
    //         }
    //         //console.log('key up!');
    //         totalacres = parseInt($("th:contains('Total Land')").next().text().replace(/\,/g, ''));
    //         futureland = parseInt($("#futureland").val());

    //         if (!(futureland)) futureland = 0;

    //         totalacres = totalacres + futureland;
    //         buildingacres = parseInt($("th").filter(function () {
    //             return $(this).text() === type;
    //         }).next().text().replace(/\,/g, ''));
    //         incacres = parseInt($("th").filter(function () {
    //             return $(this).text() === type;
    //         }).next().next().text().replace(/\,/g, ''));
    //         suggestion = Math.round(newVideoName * totalacres * 0.01 - buildingacres - incacres);
    //         $("#build_" + name).val(suggestion);
    //         $("#build_" + name).text(suggestion);
    //         if (suggestion > 0) {
    //             $("#build_" + name).css("background-color", "green");
    //         } else if (suggestion < 0) {
    //             $("#build_" + name).css("background-color", "red");
    //         } else {
    //             $("#build_" + name).css("background-color", "grey");
    //         }



    //     }

    //     function refreshall() {


    //         if ($("th:contains('Homes')" ).next().text()) refresh('Homes', 'Homes');
    //         if ($("th:contains('Mills')" ).next().text()) refresh('Mills', 'Mills');
    //         if ($("th:contains('Training Grounds')" ).next().text()) refresh('Training Grounds', 'TGs');
    //         if ($("th:contains('Military Barracks')" ).next().text()) refresh('Military Barracks', 'Rax');
    //         if ($("th:contains('Castles')" ).next().text()) refresh('Castles', 'Cas');
    //         if ($("th:contains('Guilds')" ).next().text()) refresh('Guilds', 'Guilds');
    //         if ($("th:contains('Thieves\' Dens')" ).next().text()) refresh('Thieves\' Dens', 'TDs');
    //         if ($("th:contains('Laboratories')" ).next().text()) refresh('Laboratories', 'Labs');
    //         if ($("th:contains('Stables')" ).next().text()) refresh('Stables', 'Stables');
    //         refresh('Farms', 'Farms');
    //         refresh('Banks', 'Banks');
    //         if ($("th:contains('Armouries')" ).next().text()) refresh('Armouries', 'Arms');
    //         if ($("th:contains('Forts')" ).next().text()) refresh('Forts', 'Forts');
    //         if ($("th:contains('Hospitals')" ).next().text()) refresh('Hospitals', 'Hosps');
    //         refresh('Towers', 'Towers');
    //         refresh('Watch Towers', 'WTs');
    //         if ($("th:contains('Universities')" ).next().text()) refresh('Universities', 'Unis');
    //         if ($("th:contains('Dungeons')" ).next().text()) refresh('Dungeons', 'Dungs');
    //         refresh('Libraries', 'Libs');
    //         gettotal();



    //     }

    //     function gettotal() {

    //         total = 0;
    //         if ($("th:contains('Homes')" ).next().text()) total += parseFloat($("#Homes").val());
    //         if ($("th:contains('Mills')" ).next().text()) total += parseFloat($("#Mills").val());
    //         if ($("th:contains('Training Grounds')" ).next().text()) total += parseFloat($("#TGs").val());
    //         if ($("th:contains('Military Barracks')" ).next().text()) total += parseFloat($("#Rax").val());
    //         if ($("th:contains('Castles')" ).next().text()) total += parseFloat($("#Cas").val());
    //         if ($("th:contains('Guilds')" ).next().text()) total += parseFloat($("#Guilds").val());
    //         if ($("th:contains('Thieves\' Dens')" ).next().text()) total += parseFloat($("#TDs").val());
    //         if ($("th:contains('Laboratories')" ).next().text()) total += parseFloat($("#Labs").val());
    //         if ($("th:contains('Stables')" ).next().text()) total += parseFloat($("#Stables").val());
    //         total += parseFloat($("#Farms").val());
    //         total += parseFloat($("#Banks").val());
    //         if ($("th:contains('Armouries')" ).next().text()) total += parseFloat($("#Arms").val());
    //         if ($("th:contains('Forts')" ).next().text()) total += parseFloat($("#Forts").val());
    //         if ($("th:contains('Hospitals')" ).next().text()) total += parseFloat($("#Hosps").val());
    //         total += parseFloat($("#Towers").val());
    //         total += parseFloat($("#WTs").val());
    //         if ($("th:contains('Universities')" ).next().text()) total += parseFloat($("#Unis").val());
    //         total += parseFloat($("#Libs").val());
    //         if ($("th:contains('Dungeons')" ).next().text()) total += parseFloat($("#Dungs").val());

    //         total = Math.round(total * 10) / 10;

    //         totalbuild = 0;
    //         totalraze = 0;
    //         if ($("#build_Homes").val() > 0) totalbuild += parseFloat($("#build_Homes").val());
    //         if ($("#build_Homes").val() < 0) totalraze -= parseFloat($("#build_Homes").val());
    //         if ($("#build_Farms").val() > 0) totalbuild += parseFloat($("#build_Farms").val());
    //         if ($("#build_Farms").val() < 0) totalraze -= parseFloat($("#build_Farms").val());
    //         if ($("#build_Mills").val() > 0) totalbuild += parseFloat($("#build_Mills").val());
    //         if ($("#build_Mills").val() < 0) totalraze -= parseFloat($("#build_Mills").val());
    //         if ($("#build_Banks").val() > 0) totalbuild += parseFloat($("#build_Banks").val());
    //         if ($("#build_Banks").val() < 0) totalraze -= parseFloat($("#build_Banks").val());
    //         if ($("#build_TGs").val() > 0) totalbuild += parseFloat($("#build_TGs").val());
    //         if ($("#build_TGs").val() < 0) totalraze -= parseFloat($("#build_TGs").val());
    //         if ($("#build_Arms").val() > 0) totalbuild += parseFloat($("#build_Arms").val());
    //         if ($("#build_Arms").val() < 0) totalraze -= parseFloat($("#build_Arms").val());
    //         if ($("#build_Rax").val() > 0) totalbuild += parseFloat($("#build_Rax").val());
    //         if ($("#build_Rax").val() < 0) totalraze -= parseFloat($("#build_Rax").val());
    //         if ($("#build_Forts").val() > 0) totalbuild += parseFloat($("#build_Forts").val());
    //         if ($("#build_Forts").val() < 0) totalraze -= parseFloat($("#build_Forts").val());
    //         if ($("#build_GS").val() > 0) totalbuild += parseFloat($("#build_GS").val());
    //         if ($("#build_GS").val() < 0) totalraze -= parseFloat($("#build_GS").val());
    //         if ($("#build_Hosps").val() > 0) totalbuild += parseFloat($("#build_Hosps").val());
    //         if ($("#build_Hosps").val() < 0) totalraze -= parseFloat($("#build_Hosps").val());
    //         if ($("#build_Guilds").val() > 0) totalbuild += parseFloat($("#build_Guilds").val());
    //         if ($("#build_Guilds").val() < 0) totalraze -= parseFloat($("#build_Guilds").val());
    //         if ($("#build_Towers").val() > 0) totalbuild += parseFloat($("#build_Towers").val());
    //         if ($("#build_Towers").val() < 0) totalraze -= parseFloat($("#build_Towers").val());
    //         if ($("#build_TDs").val() > 0) totalbuild += parseFloat($("#build_TDs").val());
    //         if ($("#build_TDs").val() < 0) totalraze -= parseFloat($("#build_TDs").val());
    //         if ($("#build_WTs").val() > 0) totalbuild += parseFloat($("#build_WTs").val());
    //         if ($("#build_WTs").val() < 0) totalraze -= parseFloat($("#build_WTs").val());
    //         if ($("#build_Labs").val() > 0) totalbuild += parseFloat($("#build_Labs").val());
    //         if ($("#build_Labs").val() < 0) totalraze -= parseFloat($("#build_Labs").val());
    //         if ($("#build_Unis").val() > 0) totalbuild += parseFloat($("#build_Unis").val());
    //         if ($("#build_Unis").val() < 0) totalraze -= parseFloat($("#build_Unis").val());
    //         if ($("#build_Stables").val() > 0) totalbuild += parseFloat($("#build_Stables").val());
    //         if ($("#build_Stables").val() < 0) totalraze -= parseFloat($("#build_Stables").val());
    //         if ($("#build_Dungs").val() > 0) totalbuild += parseFloat($("#build_Dungs").val());
    //         if ($("#build_Dungs").val() < 0) totalraze -= parseFloat($("#build_Dungs").val());
    //         if ($("#build_Libs").val() > 0) totalbuild += parseFloat($("#build_Libs").val());
    //         if ($("#build_Libs").val() < 0) totalraze -= parseFloat($("#build_Libs").val());

    //         //console.log('Total build '+totalbuild+' raze '+totalraze);

    //         rebuildcost = Math.max(totalbuild-freebuild,0)*buildcost+totalraze*razecost;

    //         if (buildcost==0) {
    //             //console.log('dwarf');
    //             rebuildcost = Math.max(totalraze-freebuild,0)*razecost;
    //         }

    //         $("#rebuildcosts").html('Build: '+totalbuild+' Raze: '+totalraze+' Cost:'+rebuildcost);

    //         $("#totals").val(total);
    //         if (total < 100) {
    //             $("#totals").css("background-color", "green");
    //         } else if (total > 100) {
    //             $("#totals").css("background-color", "red");
    //         } else {
    //             $("#totals").css("background-color", "grey");
    //         }
    //     }

    //     function fillin() {


    //         start_quantity = -1; 
    //         if ($("th:contains('Homes')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Homes").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Homes").val());
    //         }
    //         if ($("th:contains('Farms')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Farms").val() > 0) $("#id_quantity_"+(start_quantity)).val($("#build_Farms").val());
    //         }
    //         if ($("th:contains('Mills')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Mills").val() > 0) $("#id_quantity_"+(start_quantity)).val($("#build_Mills").val());
    //         }
    //         if ($("th:contains('Banks')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Banks").val() > 0) $("#id_quantity_"+(start_quantity)).val($("#build_Banks").val());
    //         }
    //         if ($("th:contains('Training Grounds')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_TGs").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_TGs").val());
    //         }
    //         if ($("th:contains('Armouries')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Arms").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Arms").val());
    //         }
    //         if ($("th:contains('Military Barracks')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Rax").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Rax").val());
    //         }
    //         if ($("th:contains('Forts')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Forts").val() > 0) $("#id_quantity_"+(start_quantity)).val($("#build_Forts").val());
    //         }
    //         if ($("th:contains('Castles')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Cas").val() > 0) $("#id_quantity_"+(start_quantity)).val($("#build_Cas").val());
    //         }
    //         if ($("th:contains('Hospitals')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Hosps").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Hosps").val());
    //         }
    //         if ($("th:contains('Guilds')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_Guilds").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Guilds").val());
    //         }
    //         start_quantity++;
    //         if ($("#build_Towers").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Towers").val());
    //         if ($("th:contains('Thieves\' Dens')").next().text()) {
    //             start_quantity++;
    //             if ($("#build_TDs").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_TDs").val());
    //         }
    //         start_quantity++;
    //         if ($("#build_WTs").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_WTs").val());
    //         if ($("th:contains('Laboratories')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Labs").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Labs").val());
    //         }
    //         if ($("th:contains('Universities')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Unis").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Unis").val());
    //         }
    //         start_quantity++;
    //         if ($("#build_Libs").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Libs").val());
    //         if ($("th:contains('Stables')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Stables").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Stables").val());
    //         }
    //         if ($("th:contains('Dungeons')" ).next().text()) { 
    //             start_quantity++;
    //             if ($("#build_Dungs").val() > 0) $("#id_quantity_" + (start_quantity)).val($("#build_Dungs").val());
    //         }
    //     }


    //     function savebuild() {
    //         var arr = [];

    //         // append new value to the array
    //         if ($("th:contains('Homes')" ).next().text()) { arr.push(parseFloat($("#Homes").val()));} else {arr.push(0) }
    //         if ($("th:contains('Mills')" ).next().text()) { arr.push(parseFloat($("#Mills").val()));} else {arr.push(0) }
    //         if ($("th:contains('Training Grounds')" ).next().text()) { arr.push(parseFloat($("#TGs").val()));} else {arr.push(0) }
    //         if ($("th:contains('Military Barracks')" ).next().text()) {arr.push(parseFloat($("#Rax").val()));} else {arr.push(0) }
    //         if ($("th:contains('Castles')" ).next().text()) { arr.push(parseFloat($("#Cas").val()));} else {arr.push(0) }
    //         if ($("th:contains('Guilds')" ).next().text()) { arr.push(parseFloat($("#Guilds").val()));} else {arr.push(0) }
    //         if ($("th:contains('Thieves\' Dens')" ).next().text()) { arr.push(parseFloat($("#TDs").val()));} else {arr.push(0) }
    //         if ($("th:contains('Stables')" ).next().text()) {arr.push(parseFloat($("#Stables").val()));} else {arr.push(0) }
    //         if ($("th:contains('Farms')" ).next().text()) { arr.push(parseFloat($("#Farms").val()));} else {arr.push(0) }
    //         if ($("th:contains('Banks')" ).next().text()) { arr.push(parseFloat($("#Banks").val()));} else {arr.push(0) }
    //         if ($("th:contains('Armouries')" ).next().text()) {arr.push(parseFloat($("#Arms").val()));} else {arr.push(0) }
    //         if ($("th:contains('Forts')" ).next().text()) {arr.push(parseFloat($("#Forts").val()));} else {arr.push(0) }
    //         if ($("th:contains('Hospitals')" ).next().text()) {arr.push(parseFloat($("#Hosps").val()));} else {arr.push(0) }
    //         arr.push(parseFloat($("#Towers").val()));
    //         arr.push(parseFloat($("#WTs").val()));
    //         if ($("th:contains('Universities')" ).next().text()) {arr.push(parseFloat($("#Unis").val()));} else {arr.push(0) }
    //         if ($("th:contains('Dungeons')" ).next().text()) {arr.push(parseFloat($("#Dungs").val()));} else {arr.push(0) }
    //         if ($("th:contains('Laboratories')" ).next().text()) {arr.push(parseFloat($("#Labs").val()));} else {arr.push(0) }
    //         arr.push(parseFloat($("#Libs").val()));

    //         //var json_str = JSON.stringify(arr);
    //         //setCookie('savedbuild', json_str);
    //         setCookie('savedbuild', arr.join(','),21);

    //         //alert('build saved');
    //     }

    //     function loadbuild() {
    //         var json_str = decodeURIComponent(getCookie2('savedbuild'));
    //         //alert(json_str);
    //         //var arr = JSON.parse(json_str);
    //         var arr = json_str.split(',');

    //         // append new value to the array
    //         if ($("th:contains('Homes')" ).next().text()) $("#Homes").val(arr[0]);
    //         if ($("th:contains('Mills')" ).next().text()) $("#Mills").val(arr[1]);
    //         if ($("th:contains('Training Grounds')" ).next().text()) $("#TGs").val(arr[2]);
    //         if ($("th:contains('Military Barracks')" ).next().text()) $("#Rax").val(arr[3]);
    //         if ($("th:contains('Castles')" ).next().text()) $("#Cas").val(arr[4]);
    //         if ($("th:contains('Guilds')" ).next().text()) $("#Guilds").val(arr[5]);
    //         if ($("th:contains('Thieves\' Dens')" ).next().text()) $("#TDs").val(arr[6]);
    //         if ($("th:contains('Stables')" ).next().text()) $("#Stables").val(arr[7]);
    //         if ($("th:contains('Farms')" ).next().text()) $("#Farms").val(arr[8]);
    //         if ($("th:contains('Banks')" ).next().text()) $("#Banks").val(arr[9]);
    //         if ($("th:contains('Armouries')" ).next().text()) $("#Arms").val(arr[10]);
    //         if ($("th:contains('Forts')" ).next().text()) $("#Forts").val(arr[11]);
    //         if ($("th:contains('Hospitals')" ).next().text()) $("#Hosps").val(arr[12]);
    //         $("#Towers").val(arr[13]);
    //         $("#WTs").val(arr[14]);
    //         if ($("th:contains('Universities')" ).next().text()) $("#Unis").val(arr[15]);
    //         if ($("th:contains('Dungeons')" ).next().text()) $("#Dungs").val(arr[16]);
    //         if ($("th:contains('Laboratories')" ).next().text()) $("#Labs").val(arr[17]);
    //         $("#Libs").val(arr[18]);

    //         //alert('build loaded');
    //         refreshall();
    //     }

    //     //$(".game-content").append('<table border=1><tr>');
    //     var buildtable;
    //     if (page.match("(wol)/(sit/)?game/build")) {
    //         buildtable = '<input type=button  id=hideshow value="Toggle build tool"><table border=1 id=buildtool><tr><th style=\'background-color: #000040;\' colspan=9>Build calc - put desired % in white box (starts at current+incoming), it\'ll tell you what to build/raze in grey box</th></tr><tr>';
    //         buildtable += '<td colspan=9>Incoming acres: <input type=text size=4 id=futureland value=0> (In case you want to build based on future land size)</td></tr><tr>';
    //         buildtable += '<td colspan=9><input type=button  id=savebuild value="Save build"><input type=button  id=loadbuild value="Load build"><input type=button  id=fillin value="Fill-in"></td></tr><tr>';
    //         buildtable += '<td colspan=9>#<input  style=\'text-align: right\' type=text size=1 id=buildid value=0> <input type=button  id=buildidfetch value="Fetch id build"></td></tr><tr>';

    //     if ($("th:contains('Homes')" ).next().text()) getbuilding('Homes', 'Homes');
    //     if ($("th:contains('Farms')" ).next().text()) getbuilding('Farms', 'Farms');
    //     if ($("th:contains('Mills')" ).next().text()) getbuilding('Mills', 'Mills');
    //     if ($("th:contains('Banks')" ).next().text()) getbuilding('Banks', 'Banks');
    //     if ($("th:contains('Training Grounds')" ).next().text()) getbuilding('Training Grounds', 'TGs');
    //     if ($("th:contains('Armouries')" ).next().text()) getbuilding('Armouries', 'Arms');
    //     if ($("th:contains('Military Barracks')" ).next().text()) getbuilding('Military Barracks', 'Rax');
    //     if ($("th:contains('Forts')" ).next().text()) getbuilding('Forts', 'Forts');
    //     if ($("th:contains('Castles')" ).next().text()) getbuilding('Castles', 'Cas');
    //     buildtable += '</tr><tr>';
    //     if ($("th:contains('Hospitals')" ).next().text()) getbuilding('Hospitals', 'Hosps');

    //     if ($("th:contains('Guilds')" ).next().text()) getbuilding('Guilds', 'Guilds');
    //     getbuilding('Towers', 'Towers');
    //     if ($("th:contains('Thieves\' Dens')" ).next().text()) getbuilding('Thieves\' Dens', 'TDs');
    //     getbuilding('Watch Towers', 'WTs');
    //     if ($("th:contains('Laboratories')" ).next().text()) getbuilding('Laboratories', 'Labs');
    //     getbuilding('Libraries', 'Libs');
    //     if ($("th:contains('Universities')" ).next().text()) getbuilding('Universities', 'Unis');
    //     if ($("th:contains('Stables')" ).next().text()) getbuilding('Stables', 'Stables');
    //     if ($("th:contains('Dungeons')" ).next().text()) getbuilding('Dungeons', 'Dungs');


    //     buildtable += '</tr><tr><td colspan=9>Total: <input type=text id=totals style=\'text-align: right;background-color:#BBBBBB\'  value=100 size=3 readonly=readonly>% <span id=rebuildcosts></span></td></tr></table>';

    //     $(".game-content:first").append(buildtable);


    //     gettotal();

    //     $("#savebuild").click(function () {
    //         savebuild();
    //     });
    //     $("#loadbuild").click(function () {
    //         loadbuild();
    //     });


    //     $("#buildidfetch").click(function () {
    //         //alert('fetch id'+$("#buildid").val()+'from '+sendUrlBase2+'?getbuild='+$("#buildid").val());
    //         $.getJSON(sendUrlBase2 + '?getbuild=' + $("#buildid").val() + "&pwd=" + pwdcookie, function (result) {
    //             $.each(result, function (i, field) {
    //                 //alert(i+':'+field);
    //             });

    //             $("#Homes").val(result.homes);
    //             $("#Mills").val(result.mills);
    //             $("#TGs").val(result.tg);
    //             $("#Rax").val(result.rax);
    //             $("#GS").val(result.gs);
    //             $("#Guilds").val(result.guilds);
    //             $("#TDs").val(result.tds);
    //             $("#Stables").val(result.stables);
    //             $("#Farms").val(result.farms);
    //             $("#Arms").val(result.arms);
    //             $("#Banks").val(result.banks);
    //             $("#Forts").val(result.fort);
    //             $("#Hosps").val(result.hosps);
    //             $("#Towers").val(result.towers);
    //             $("#WTs").val(result.wt);
    //             $("#Unis").val(result.unis);
    //             $("#Dungs").val(result.dungs);
    //             $("#Labs").val(result.labs);
    //             $("#Libs").val(result.libs);

    //             refreshall();
    //             if (result.description) {
    //                 alert(result.description + ' loaded -- consider saving this build for faster access');
    //             } else {
    //                 alert('Build not found -- check irc with !builds');
    //             }
    //         }).error(function () {
    //             alert("Not found / check IRC with !builds");
    //         });
    //     });

    //     $("#fillin").click(function () {
    //         fillin();
    //     });


    //     $("#hideshow").click(function () {
    //         $("#buildtool").toggle();
    //     });

    //     refreshall();

    //     $("#buildtool").toggle();

    //     }

    //     keyupthing('Homes', 'Homes');
    //     keyupthing('Mills', 'Mills');
    //     keyupthing('Training Grounds', 'TGs');
    //     keyupthing('Military Barracks', 'Rax');
    //     keyupthing('Castles', 'Cas');
    //     keyupthing('Guilds', 'Guilds');
    //     keyupthing('Thieves\' Dens', 'TDs');
    //     keyupthing('Laboratories', 'Labs');
    //     keyupthing('Stables', 'Stables');
    //     keyupthing('Farms', 'Farms');
    //     keyupthing('Banks', 'Banks');
    //     keyupthing('Armouries', 'Arms');
    //     keyupthing('Forts', 'Forts');
    //     keyupthing('Hospitals', 'Hosps');
    //     keyupthing('Towers', 'Towers');
    //     keyupthing('Watch Towers', 'WTs');
    //     keyupthing('Universities', 'Unis');
    //     keyupthing('Libraries', 'Libs');
    //     keyupthing('Dungeons', 'Dungs');

    // } 
    else if (page.match("(wol|gen)/(sit/)?game/province_news")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "news";
        page2 = "news";
    } else if (page.match("(wol|gen)/(sit/)?game/kingdom_intel")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "kdintel";
        page2 = "kdintel";
    } else if (page.match("(wol|gen)/(sit/)?game/kingdom_news")) {
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "kdintel";
        page2 = "kdnews";
    } else if (page.match("(wol|gen)/(sit/)?game/aid")) {

        if ($(".game-content div.good.message").length) {
            msg = $("div.good.message").text();
            console.log(msg);
            console.log(msg.match(/([\d,]+) (bushel|soldier|gold coin|rune|explore pool).*?to (.*?) \(/));
            lastaid = msg.match(/([\d,]+) (bushel|soldier|gold coin|rune|explore pool).*?to (.*?) \(/);
            console.log(lastaid[1]);
            aidrow = 0;
            if(lastaid[2]=='bushel') aidrow=0;
            if(lastaid[2]=='gold coin') aidrow=1;
            if(lastaid[2]=='rune') aidrow=2;
            if(lastaid[2]=='soldier') aidrow=3;
            $(".game-content div.good.message").after("<input type=button class=repeat value=Repeat>");
            
            $(".repeat").click(function (e) {
                e.preventDefault();
                $(".data > tbody > tr:eq("+aidrow+")").find('input:first').val(lastaid[1].replace(/\,/g, ''));
                $('#id_target_province option:contains("'+lastaid[3]+'")').prop('selected', true);
                var prov = $('#id_target_province option:selected').text();
                $("div #uniform-id_target_province span").html(prov);
                $( "#aid-form" ).submit();
            })
        }

        url_link = "//"+server_domain+"/"+game_server+"/game/kingdom_details";
        console.log("AJAX "+url_link);
        $.ajax({
            type: "GET",
            url: url_link,
        }).done(function (html) {
            pagehtml = html;
            var n = pagehtml.indexOf('<div class="game-content">');
            pagehtml = pagehtml.substring(n);
            pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
            var el = $('<div id=spellpage></div>');
            el.html(pagehtml);

            var provacres = new Array();
            var provnw = new Array();
            var count = 0;
            var totalnw = 0;
            
            el.find('.tablesorter > tbody > tr').each(function(i,row) { 
                    
                if (el.find(".tablesorter > tbody > tr:eq("+i+") > td:eq(2)").html()!="-") {
                    
                    target_name = el.find(".tablesorter > tbody > tr:eq("+i+") > td:eq(1) > a").html();
                    target_land = el.find(".tablesorter > tbody > tr:eq("+i+") > td:eq(3)").html();
                    el.find(".tablesorter > tbody > tr:eq("+i+") > td:eq(3)").html(target_land.match(/([\d,]+) acres/)[1]+"a");
                    target_land = target_land.match(/([\d,]+) acres/)[1].replace(/\,/g, '');
                    provacres.push(target_land);
                    land_nw = el.find(".tablesorter > tbody > tr:eq("+i+") > td:eq(4)").html();
                    land_nw = land_nw.match(/([\d,]+)gc/)[1].replace(/\,/g, '');
                    //provnw.push({key: target_name, value:land_nw});  
                    provnw[target_name] = parseInt(land_nw);      
                    count = count + 1;
                    totalnw = totalnw + parseInt(land_nw);       
                }
            })


            // console.log(provnw);
            // console.log("average "+ Math.round(totalnw / count));

            $(".maxprov").click(function (e) {
                e.preventDefault();

                var prov = $('#id_target_province option:selected').text();

                type = $(this).closest('tr').find('th:eq(0)').text();

                console.log('selected prov '+ prov+ ' nw '+provnw[prov] + ' type: '+type);

                provmax = provnw[prov]*3.95;

                aidmax = parseInt($(this).closest('tr').find('td:eq(0)').text().replace(/\,/g, ''));

                modifier = 1;

                if(type=='Food') modifier = 0.05;
                if(type=='Runes') modifier = 3;
                if(type=='Soldiers') modifier = 100;

                if (aidmax*modifier>provmax) aidmax = Math.floor(provmax/modifier);


                $(this).closest('td').find('input:first').val(aidmax);
             });


                    
                    
        });
    	

    	$("#id_food").after('<input type=button class=maxprov value=Max>'); 
		$("#id_money").after('<input type=button class=maxprov value=Max>'); 
		$("#id_runes").after('<input type=button class=maxprov value=Max>'); 
		$("#id_infantry_count").after('<input type=button class=maxprov value=Max>'); 
		
		$(".max").click(function (e) {
                e.preventDefault();
                aidmax = parseInt($(this).closest('tr').find('td:eq(0)').text().replace(/\,/g, ''));
				$(this).closest('td').find('input:first').val(aidmax);
             });
    	
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "aid";
        page2 = "aid";
    } else if (page.match("(wol|gen)/(sit/)?game/council_state")) {

        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "council";
        page2 = "council";

        maxpop = parseInt($("th:contains('Max Population')").next().text());
        totalpop = parseInt($("th:contains('Total')").next().text());
        peons = parseInt($("th:contains('Peasants'):eq(1)").next().text());




        release = Math.max(Math.round((totalpop - peons * 0.07) - maxpop * 1.15), 0);
        release3 = Math.max(Math.round((totalpop) - maxpop * 1.15), 0);
        release2 = Math.max(Math.round(totalpop - maxpop * 1.20), 0);
        desert = 0;

        
        //console.log('peons:'+peons);
        //console.log(getCookie2("solds2"));

        if (getCookie2("armyhome") != null) {
            var military = JSON.parse(unescape(getCookie2("armyhome")));
            //console.log(unescape(getCookie2("armyhome")));

            desert = 0;

            if (release) desert = 0.20 * ((totalpop - peons * 0.07) / maxpop - 1);
            var solds_d = 0;

            //military['solds'] -= Math.min(Math.round(military['solds']* desert),0);
            var leet_d = Math.round(military['elites'] * desert);
            if (military['solds'] > 0) {
                var calc = leet_d;
                solds_d += Math.min(military['solds'], calc);
                leet_d -= Math.min(military['solds'], calc);
                military['solds'] -= Math.min(military['solds'], calc);
            }
            var ds_d = Math.round(military['dspec'] * desert);
            if (military['solds'] > 0) {
                var calc = ds_d;
                solds_d += Math.min(military['solds'], calc);
                ds_d -= Math.min(military['solds'], calc);
                military['solds'] -= Math.min(military['solds'], calc);
            }
            var thief_d = Math.round(military['thieves'] * desert);
            if (military['solds'] > 0) {
                var calc = thief_d;
                solds_d += Math.min(military['solds'], calc);
                thief_d -= Math.min(military['solds'], calc);
                military['solds'] -= Math.min(military['solds'], calc);
            }
            var os_d = Math.round(military['ospec'] * desert);
            if (military['solds'] > 0) {
                var calc = os_d;
                solds_d += Math.min(military['solds'], calc);
                os_d -= Math.min(military['solds'], calc);
                military['solds'] -= Math.min(military['solds'], calc);
            }
            //solds_d += Math.min(Math.round(military['solds']* desert),0);
            //var solds_d = Math.max(Math.round((military['solds']-(leet_d + thief_d + ds_d + os_d)) * desert),0);
            var more_solds_need = leet_d + thief_d + ds_d + os_d;
            more_solds_need = more_solds_need + Math.round(more_solds_need * desert) - military['solds'];
            var total_d = solds_d + leet_d + thief_d + ds_d + os_d;
        }


        console.log("Desert:" + Math.round(desert, 3) + "\nMaxpop:" + maxpop + "\ntotalpop:" + totalpop + "\npeons:" + peons);
        //0.20* [(Current population-Peasants*0.07)/Max population - 1]
        //

        // DISABLED FOR NOW SINCE I DO NOT KNOW NEW CALC
     //    if (totalpop > maxpop) newmsg += "Army home: " + unescape(getCookie2("armyhome"));
     //    if (totalpop > maxpop) newmsg += "<br>LL'ed? Land in? <br>(update units on trainpage)<br>Overpoped: " + Math.round(100 * totalpop / maxpop, 1) + "% |  Maxpop:" + maxpop + " | totalpop:" + totalpop + "\n<br>To attack release: " + release3 + " | To thief release: " + release2;
     //    if (totalpop > maxpop) newmsg += "<br> Total Desert: " + total_d + " Desertions: " + leet_d + "elites | " + ds_d + "DS | " + thief_d + "thieves | " + os_d + "OS | " + solds_d + "Solds <br>Get " + more_solds_need + " solds to prevent unit desertions";
   		// if (totalpop > maxpop) newmsg += "<br> Or get rid of "+release+" population";
   		
   		//console.log(newmsg);
   
    } else if (page.match("(wol|gen)/(sit/)?game/train_army")) {

        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "train_army";
        page2 = "train_army";
    	extra = $("#id_draft_rate").val();
        
    	if (spellsstr) {
		//spellsstr = (sitting ? decodeURIComponent(getCookie('activespellssitter')) : decodeURIComponent(getCookie('activespells')));
		
		//console.log(spellsstr);
		
			if (spellsstr.match("Heros Inspiration")) { 
				hi = '<h2 id=spellslist><font color=#90ee90>HI is on</font></h2>';
                ia = '<h2 id=spellslist><font color=#90ee90>IA is N/A</font></h2>'; 
				} 
				else if (spellsstr.match("Inspire Army")) {
				ia = '<h2 id=spellslist><font color=#90ee90>IA is on</font></h2>';
                hi = '<h2 id=spellslist><font color=red>HI seems off</font></h2>'; 
			}
                else {
                ia = '<h2 id=spellslist><font color=red>IA seems off</font></h2>';
                hi = '<h2 id=spellslist><font color=red>HI seems off</font></h2>'; 
            }
			if (spellsstr.match("Patriotism")) { 
				pat = '<h2 id=spellslist><font color=#90ee90>PAT is on</font></h2>'; 
				} 
				else {
				pat = '<h2 id=spellslist><font color=red>PAT seems off</font></h2>'; 
			}
		$("#btnTrain").after('<table id=spellslist ><tr><td>'+hi+'</td><td>'+ia+'</td><td>'+pat+'</td></tr></table>'); 
        $("#spellslist").hide().fadeIn();
		
   		}
   		
   		
		// $("#id_unit-quantity_0").after('<input type=button class=max value=Max>'); 
		// $("#id_unit-quantity_1").after('<input type=button class=max value=Max>'); 
		// $("#id_unit-quantity_2").after('<input type=button class=max value=Max>'); 
		// $("#id_unit-quantity_3").after('<input type=button class=max value=Max>'); 
		
		// $(".max").click(function (e) {
  //               e.preventDefault();
  //               trainmax = parseInt($(this).closest('tr').find('td:eq(3)').text().replace(",", ""));
		// 		$(this).closest('td').find('input:first').val(trainmax);
  //            });
   		
    	
        var $this = $("th:contains('You Own')");
        var cellIndex = $this.index();

        // next, get the cell in the next row that has
        // the same index.
        var military = {};
        military['solds'] = parseInt($("th:contains('Number of soldiers'):eq(0)").next().text().replace(",", ""));
        military['ospec'] = parseInt($this.closest('table').find('tr:eq(1)').find('td:eq(0)').text().replace(",", ""));
        military['dspec'] = parseInt($this.closest('table').find('tr:eq(2)').find('td:eq(0)').text().replace(",", ""));
        military['elites'] = parseInt($this.closest('table').find('tr:eq(3)').find('td:eq(0)').text().replace(",", ""));
        military['thieves'] = parseInt($this.closest('table').find('tr:eq(4)').find('td:eq(0)').text().replace(",", ""));

        //console.log(military);

        if (military['solds'] !== null && military['solds'] !== '') {

            //From page:' + JSON.stringify(military);
            if (military['thieves'] != null && military['dspec'] != null && military['elites'] != null && military['ospec'] != null) {
                setCookie("armyhome", JSON.stringify(military), 1);
                //newmsg += 'Saved army home # for desert calc<br>';
            }


            //newmsg += "<br>Now in cookie:"+unescape(getCookie("armyhome"));
        } else {

            newmsg += "<br>Couldn't parse :/ " + JSON.stringify(military);
        }
    } else if (page.match("(wol|gen)/(sit/)?game/send_armies")) {
        war_room_stuff();
        send = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
        sendUrl = sendUrlBase + "hit";
    }

    function get_return_time() {
          var myDate = new Date();
          minutes = parseInt($("#calculated-attack-time").html()*60);
          if (minutes) {
              myDate.setMinutes(myDate.getMinutes() + minutes);
              console.log(myDate.toLocaleString());
              $("#return_time").remove();
              return_string = "<span id='return_time'><br>Return by "+myDate.toLocaleString()+" (Local time)</span>";
              $("#calculated-attack-time").parent("td").append(return_string);
          }

    }

    function war_room_stuff() {  
        console.log('attack stuff!');

        // Be sure to be doing war room calcs.
        $(".war_room select").change(calculate_attack_time);
        // call the function in case fields are populated on page load
        calculate_attack_time();
        $(".offensive-points-field input").change(mark_field_changed);
        $(".offensive-points-field select").change(mark_field_changed);
        $(".target-points-field input").change(calculate_offensive_ratio);

        // Call the function in case there are fields populated on page load
        calculate_offensive_points();
        get_return_time();

        //periodically check if recalculation is needed
        setInterval(function(){
            if (field_changed){
                calculate_offensive_points();
                field_changed = false;
            }
        }, 1000);

        $("#calculated-attack-time").on('DOMSubtreeModified', function () {
            get_return_time();
        });

        if ($("#send-armies-form").length || $("#id_send_armies").length) {
            console.log('attack stuff!2');


            if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
                var form =  $(".game-content").find("form");
            } else {
                var form = $("#send-armies-form");
            }

            if (!attack_calc_stuff) { 
                console.log("NO ATTACK STUFF");
                $('script').each(function () {
                   htmlscript = $(this).html(); 
                   if (htmlscript.indexOf("calculate_attack_time")!=-1) { attack_calc_stuff=htmlscript; console.log("FOUND IT");}
                });
            }
            
            if (spellsstr) {
            //spellsstr=decodeURIComponent(getCookie2('activespells'));
            //spellsstr = (sitting ? decodeURIComponent(getCookie('activespellssitter')) : decodeURIComponent(getCookie('activespells')));
            
            //console.log(spellsstr);
            if (spellsstr.match("Quick Feet")) { 
                qf = '<h2 id=spellslist><font color=#90ee90>QF is on</font></h2>'; 
                } 
                else {
                qf = '<h2 id=spellslist><font color=red>QF seems off</font></h2>'; 
            }
            if (spellsstr.match("War Spoils")) { 
                ws = '<h2 id=spellslist><font color=#90ee90>WS is on</font></h2>'; 
                } 
                else {
                ws = '<h2 id=spellslist><font color=red>WS seems off</font></h2>'; 
            }
            if (spellsstr.match("Anonymity")) { 
                anon = '<h2 id=spellslist><font color=#90ee90>Anon is on</font></h2>'; 
                } 
                else {
                anon = '<h2 id=spellslist><font color=red>Anon seems off</font></h2>'; 
            }        
            if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
                $("#id_send_armies").parent().parent().after().after('<tr class="war_room"><td colspan=4><table id=spellslist><tr><td>'+qf+'</td><td>'+ws+'</td><td>'+anon+'</td></tr></table></td></tr>'); 
            } else {
                $("#id_send_armies").after('<table id=spellslist><tr><td>'+qf+'</td><td>'+ws+'</td><td>'+anon+'</td></tr></table>'); 
            }
            $("#spellslist").hide().fadeIn();
            
            }
            
            url_link = "//"+server_domain+"/"+game_server+"/game/council_military";
            if (sitting) url_link = "//"+server_domain+"/"+game_server+"/sit/game/council_military";
            console.log("AJAX "+url_link);
            $.ajax({
                type: "GET",
                url: url_link,
            }).done(function (html) {
                pagehtml = html;
                var n = pagehtml.indexOf('<div class="game-content">');
                pagehtml = pagehtml.substring(n);
                pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
                var el = $('<div id=spellpage></div>');
                el.html(pagehtml);
                //el.find('thead:first').find('th')
                //#getdef
                //:contains('Defensive Military Effectiveness')
                // if (el.find("th:contains('Defensive Military Effectiveness')").length) {
                //     defmod = parseFloat(el.find("th:contains('Defensive Military Effectiveness')").parent().find("td:eq(0)").html().replace("%","")/100);
                //     defhome= parseInt(el.find("th:contains('Defensive Military Effectiveness')").parent().find("td:eq(1)").html().replace(/\,/g, ''));
                //     //console.log('moddef'+defmod+' home:'+defhome);
                //     if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
                //         $("#id_total_offense_points").parent().parent().after('<tr class="war_room"><th colspan=3>Total Defence Points left home (% of current)</th><td id=defhome  style="text-align: center" >'+defhome+'</td></tr>');
                    
                //         $(".war_room").hide();
                //     } else {
                //         $("#id_total_offense_points").parent().parent().after('<tr><th>Total Defence Points left home (% of current)</th><td></td><td id=defhome>'+defhome+'</td></tr>');
                //     }
                // }
            });

            try {
                var source = document.documentElement.innerHTML;
                race = source.match(/race: '([\w]+)'/)[1];
                personality = source.match(/personality: '([\w]+)'/)[1];
                extra_off = source.match(/has_offensive_specialist_plus_1:  '([\w]+)'/)[1];
            }
            catch(err) {
                try {
                    // var source = document.documentElement.innerHTML;
                    race = attack_calc_stuff.match(/race: '([\w]+)'/)[1];
                    personality = attack_calc_stuff.match(/personality: '([\w]+)'/)[1];
                    extra_off = attack_calc_stuff.match(/has_offensive_specialist_plus_1:  '([\w]+)'/)[1];
                }
                catch(err) {
                    race = latesthtml.match(/race: '([\w]+)'/)[1];
                    personality = latesthtml.match(/personality: '([\w]+)'/)[1];
                    extra_off = latesthtml.match(/has_offensive_specialist_plus_1:  '([\w]+)'/)[1];
                
                }
            }
            try {
                var source = document.documentElement.innerHTML;
                race = source.match(/race: '([\w]+)'/)[1];
                personality = source.match(/personality: '([\w]+)'/)[1];
                extra_off_2 = source.match(/has_offensive_specialist_plus_2:  '([\w]+)'/)[1];
            }
            catch(err) {
                try {
                    // var source = document.documentElement.innerHTML;
                    race = attack_calc_stuff.match(/race: '([\w]+)'/)[1];
                    personality = attack_calc_stuff.match(/personality: '([\w]+)'/)[1];
                    extra_off_2 = attack_calc_stuff.match(/has_offensive_specialist_plus_2:  '([\w]+)'/)[1];
                }
                catch(err) {
                    race = latesthtml.match(/race: '([\w]+)'/)[1];
                    personality = latesthtml.match(/personality: '([\w]+)'/)[1];
                    extra_off_2 = latesthtml.match(/has_offensive_specialist_plus_2:  '([\w]+)'/)[1];
                
                }
            }
            try {
                var source = document.documentElement.innerHTML;
                has_prisoner_strength_double = source.match(/has_prisoner_strength_double:  '([\w]+)'/)[1];
            }
            catch(err) {
                try {
                    // var source = document.documentElement.innerHTML;
                    has_prisoner_strength_double = attack_calc_stuff.match(/has_prisoner_strength_double:  '([\w]+)'/)[1];
                }
                catch(err) {
                    has_prisoner_strength_double = 'False';
                    
                }
            }
            try {
                var source = document.documentElement.innerHTML;
                has_increase_prisoner_strength = source.match(/has_increase_prisoner_strength:  '([\w]+)'/)[1];
            }
            catch(err) {
                try {
                    // var source = document.documentElement.innerHTML;
                    has_increase_prisoner_strength = attack_calc_stuff.match(/has_increase_prisoner_strength:  '([\w]+)'/)[1];
                }
                catch(err) {
                    has_increase_prisoner_strength = 'False';
                    
                }
            }
            try {
                var source = document.documentElement.innerHTML;
                race = source.match(/race: '([\w]+)'/)[1];
                personality = source.match(/personality: '([\w]+)'/)[1];
                horse_extra_off = source.match(/has_war_horse_offense_plus_1:  '([\w]+)'/)[1];
            }
            catch(err) {
                try {
                    // var source = document.documentElement.innerHTML;
                    race = attack_calc_stuff.match(/race: '([\w]+)'/)[1];
                    personality = attack_calc_stuff.match(/personality: '([\w]+)'/)[1];
                    horse_extra_off = attack_calc_stuff.match(/has_war_horse_offense_plus_1:  '([\w]+)'/)[1];
                }
                catch(err) {
                    race = latesthtml.match(/race: '([\w]+)'/)[1];
                    personality = latesthtml.match(/personality: '([\w]+)'/)[1];
                    horse_extra_off = latesthtml.match(/has_war_horse_offense_plus_1:  '([\w]+)'/)[1];
                
                }
            }
            if (game_server=='wol') {
                os = 10;
                warhorse_value = 2;
                prisoners_value = 8;
                if (race=="AVIAN") {eo = 17; ed = 8; os = 11;} 
                else if (race=="BOCAN") {eo = 7; ed = 13;}
                else if (race=="DARKELF") {eo = 5; ed = 11;}
                else if (race=="DRYAD") {eo = 6; ed = 5; os = 6;}
                else if (race=="DWARF") {eo = 13; ed = 6;} 
                else if (race=="ELF") {eo = 12; ed = 5;} 
                else if (race=="FAERY") {eo = 4; ed = 12;} 
                else if (race=="GNOME") {eo = 13; ed = 5;}
                else if (race=="HALFLING") {eo = 11; ed = 5;} 
                else if (race=="HUMAN") {eo = 8; ed = 12; os = 12; warhorse_value = 3;} 
                else if (race=="ORC") {eo = 15; ed = 4;} 
                else if (race=="UNDEAD") {eo = 13; ed = 5;}

                // if (personality == "SABOTEUR")            {eo -= 2; ed += 4;}
                // else if (personality == "WARLORD")        {eo += 3; ed -= 0;}
                // else if (personality == "GENERAL")        {eo += 2; ed += 1;}
                // else if (personality == "PROTECTOR")      {eo += 1; ed += 2;}
                // else if (personality == "FREAK")          {eo += 2; ed += 2;}
                // else if (personality == "SPELLSWORD")     {eo += 2; ed += 1;}
                // else if (personality == "ENCHANTER")      {eo += 0; ed += 4;}
                // else if (personality == "ZULU")           {eo += 1; ed += 3;}

                // else if (personality == "CLERIC")         {eo += 1; ed += 1;}
                // else if (personality == "HERETIC")        {eo += 0; ed += 0;}
                // else if (personality == "MYSTIC")         {eo -= 0; ed += 5;}
                // else if (personality == "RAIDER")         {eo += 2; ed += 0;}
                // else if (personality == "ROGUE")          {eo += 1; ed += 4;}
                // else if (personality == "TACTICIAN")      {eo += 0; ed += 0;}
                // else if (personality == "WAR_HERO")       {eo += 1; ed += 0;}
                // else if (personality == "WARRIOR")        {eo += 0; ed += 0;}
                // else if (personality == "NECROMANCER")    {eo -= 1; ed += 3;}
                // else if (personality == "ARTISAN")        {eo += 1; ed += 1;}
                // else if (personality == "PALADIN")        {eo += 2; ed += 2;}
                // else if (personality == "UNDEAD_TRAIT")   {eo += 4; ed -= 1;}
                // else if (personality == "SAGE")           {eo += 0; ed += 0;}
                // else if (personality == "MERCHANT")       {eo += 0; ed += 0;}

                // else if (personality == "HALF_AVIAN")       {eo += 4; ed -= 0;}
                // else if (personality == "HALF_DWARF")       {eo += 2; ed += 2;}
                // else if (personality == "HALF_DRYAD")       {eo += 3; ed += 2;}
                // else if (personality == "HALF_ORC")         {eo += 5; ed -= 1;}
                // else if (personality == "HALF_UNDEAD")      {eo += 4; ed -= 0;}
                // else if (personality == "HALF_HUMAN")       {eo += 3; ed += 2;}
                // else if (personality == "HALF_DARKELF")     {eo += 2; ed += 3;}
                // else if (personality == "HALF_ELF")         {eo += 1; ed += 3;}
                // else if (personality == "HALF_FAERY")       {eo += 0; ed += 4;}
                // else if (personality == "HALF_HALFLING")    {eo += 1; ed += 3;}
                // else if (personality == "HALF_GNOME")       {eo += 3; ed += 2;}

                // else if (personality == "FULL_AVIAN")       {eo += 4; ed -= 0;}
                // else if (personality == "FULL_DWARF")       {eo += 2; ed += 2;}
                // else if (personality == "FULL_DRYAD")       {eo += 3; ed += 2;}
                // else if (personality == "FULL_ORC")         {eo += 5; ed -= 1;}
                // else if (personality == "FULL_UNDEAD")      {eo += 4; ed -= 0;}
                // else if (personality == "FULL_HUMAN")       {eo += 3; ed += 2;}
                // else if (personality == "FULL_DARKELF")     {eo += 2; ed += 3;}
                // else if (personality == "FULL_ELF")         {eo += 1; ed += 3;}
                // else if (personality == "FULL_FAERY")       {eo += 0; ed += 4;}
                // else if (personality == "FULL_HALFLING")    {eo += 1; ed += 3;}
                // else if (personality == "FULL_GNOME")       {eo += 3; ed += 2;}

                if (extra_off!='False') {
                    os += 1;
                }
                if (extra_off_2!='False') {
                    os += 2;
                }
                if (has_increase_prisoner_strength!='False') {
                    prisoners_value += 2;
                }
                if (horse_extra_off!='False') {
                    warhorse_value += 1;
                }

                prisoners_value_per_unit = prisoners_value / 5;
            } 

            else if (game_server=='gen') {

                console.log('GEN SERVER');
                os = 5;
                warhorse_value = 1;
                prisoners_value = 1;
                if (race=="AVIAN") {eo = 6; ed = 3;} 
                else if (race=="BOCAN") {eo = 6; ed = 2;}
                else if (race=="DARKELF") {eo = 6; ed = 3; prisoners_value = 4;}
                else if (race=="DRYAD") {eo = 5; ed = 5;}
                else if (race=="DWARF") {eo = 13; ed = 6;} 
                else if (race=="ELF") {eo = 5; ed = 3; os = 4;} 
                else if (race=="FAERY") {eo = 4; ed = 12;} 
                else if (race=="GNOME") {eo = 5; ed = 4;}
                else if (race=="HALFLING") {eo = 10; ed = 4;} 
                else if (race=="HUMAN") {eo = 4; ed = 4; warhorse_value = 2;} 
                else if (race=="ORC") {eo = 7; ed = 1;} 
                else if (race=="UNDEAD") {eo = 4; ed = 5; os = 7;}

                if (personality == "SABOTEUR")            {eo -= 0; ed += 0;}
                else if (personality == "WARLORD")        {eo += 3; ed -= 0;}
                else if (personality == "GENERAL")        {eo += 3; ed += 0;}
                // else if (personality == "PROTECTOR")      {eo += 1; ed += 2;}
                // else if (personality == "FREAK")          {eo += 2; ed += 2;}
                else if (personality == "SPELLSWORD")     {eo += 2; ed += 1;}
                // else if (personality == "ENCHANTER")      {eo += 0; ed += 4;}
                else if (personality == "ZULU")           {eo += 1; ed += 3;}
                else if (personality == "ASSASSIN")           {eo += 0; ed += 3;}

                else if (personality == "CLERIC")         {eo += 1; ed += 2;}
                // else if (personality == "HERETIC")        {eo += 0; ed += 0;}
                else if (personality == "MYSTIC")         {eo -= 0; ed += 3;}
                else if (personality == "RAIDER")         {eo += 2; ed += 1; warhorse_value += 1;}
                // else if (personality == "ROGUE")          {eo += 1; ed += 4;}
                else if (personality == "TACTICIAN")      {eo += 0; ed += 0;}
                else if (personality == "WAR_HERO")       {eo += 1; ed += 0;}
                // else if (personality == "WARRIOR")        {eo += 0; ed += 0;}
                else if (personality == "NECROMANCER")    {eo += 2; ed += 1;}
                // else if (personality == "ARTISAN")        {eo += 1; ed += 1;}
                else if (personality == "PALADIN")        {eo += 2; ed += 2;}
                // else if (personality == "UNDEAD_TRAIT")   {eo += 4; ed -= 1;}
                // else if (personality == "SAGE")           {eo += 0; ed += 0;}
                else if (personality == "MERCHANT")       {eo += 1; ed += 2;}

                // else if (personality == "HALF_AVIAN")       {eo += 4; ed -= 0;}
                // else if (personality == "HALF_DWARF")       {eo += 2; ed += 2;}
                // else if (personality == "HALF_DRYAD")       {eo += 3; ed += 2;}
                // else if (personality == "HALF_ORC")         {eo += 5; ed -= 1;}
                // else if (personality == "HALF_UNDEAD")      {eo += 4; ed -= 0;}
                // else if (personality == "HALF_HUMAN")       {eo += 3; ed += 2;}
                // else if (personality == "HALF_DARKELF")     {eo += 2; ed += 3;}
                // else if (personality == "HALF_ELF")         {eo += 1; ed += 3;}
                // else if (personality == "HALF_FAERY")       {eo += 0; ed += 4;}
                // else if (personality == "HALF_HALFLING")    {eo += 1; ed += 3;}
                // else if (personality == "HALF_GNOME")       {eo += 3; ed += 2;}

                // else if (personality == "FULL_AVIAN")       {eo += 4; ed -= 0;}
                // else if (personality == "FULL_DWARF")       {eo += 2; ed += 2;}
                // else if (personality == "FULL_DRYAD")       {eo += 3; ed += 2;}
                // else if (personality == "FULL_ORC")         {eo += 5; ed -= 1;}
                // else if (personality == "FULL_UNDEAD")      {eo += 4; ed -= 0;}
                // else if (personality == "FULL_HUMAN")       {eo += 3; ed += 2;}
                // else if (personality == "FULL_DARKELF")     {eo += 2; ed += 3;}
                // else if (personality == "FULL_ELF")         {eo += 1; ed += 3;}
                // else if (personality == "FULL_FAERY")       {eo += 0; ed += 4;}
                // else if (personality == "FULL_HALFLING")    {eo += 1; ed += 3;}
                // else if (personality == "FULL_GNOME")       {eo += 3; ed += 2;}

                if (extra_off!='False') {
                    os += 1;
                }
                if (extra_off_2!='False') {
                    os += 2;
                }
                if (has_increase_prisoner_strength!='False') {
                    prisoners_value += 2;
                }

                if (has_prisoner_strength_double!='False') {
                    prisoners_value *= 2;
                }
                if (horse_extra_off!='False') {
                    warhorse_value += 1;
                }

               prisoners_value_per_unit = prisoners_value / 5;

            }
            
            /////////////////////////////////////////////////////////////               REMOVED WAR ROOM FUNCTIONS WITH NEW IS AND NATIVE AUTO-FILL TO TAKE OVER
            // // console.log('Found!' + $(form).children(":submit"));
            // // $('#uniform-id_target_province').parent().append("<br><input id=autodef class=button type=button value='Get def from bot'>");
            // // $('#id_infantry').before("<input id=autocalc class=button type=button value='Auto-fill'><br>");
            // if (page.match("(wol)/(sit/)?game/province_operations")) {
            //     $("h2:contains('War Room')").append("<input id=autodef class=button type=button value='Get def from bot'> <input class='button autocalc' mod='split' type=button value='Split army'> <input id=autocalc class='button autocalc' mod='1.03' type=button value='Auto-fill 3%'> <input id=autocalc mod='1.0404' class='button autocalc' type=button value='Auto 4%'> <input id=autobushcalc mod='1' class='button autobushcalc' style='margin-left:50px' type=button value='Ambush'>");
            //     $('#id_send_armies').parent().prev("td").append("<h2 id=definfo align=center></h2>");
            // } else if (page.match("(gen)/(sit/)?game/send_armies")) {
            //     pass;
            // } else if (page.match("(gen)/(sit/)?game/province_operations")) {
            //     pass;
            // }
            // else {
            //     $('#id_infantry').closest('tbody').prepend("<tr><td colspan=4><input id=autodef class=button type=button value='Get def from bot'> <input class='button autocalc' mod='split' type=button value='Split army'> <input id=autocalc class='button autocalc' mod='1.03' type=button value='Auto-fill 3%'> <input id=autocalc mod='1.0404' class='button autocalc' type=button value='Auto 4%'> <input id=autobushcalc mod='1' class='button autobushcalc' style='margin-left:50px' type=button value='Ambush'> </td></tr>");      
            //     $('#id_send_armies').before("<h2 id=definfo align=center></h2>");
            // }
            // $('#definfo').hide();
            
            // function calculate_defensive_points(){
            //         soldiers = parseInt($('#id_infantry').val()) || 0;
            //         elites = parseInt($('#id_elite').val()) || 0;
            //         defhome2 = Math.ceil(defhome-(elites*ed+soldiers)*defmod);
            //         //console.log("elites out:"+elites*ed*defmod+" "+soldiers);
            //         $("#defhome").hide();
            //         $("#defhome").html(defhome2+" ("+Math.round(defhome2*100/defhome)+"%)");
            //         $("#defhome").fadeIn();
                    
            //     }
    
            // $("#autodef").click(function (e) {
            //     e.preventDefault();
            //     if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
            //         full_province = $(".game-header").find("h1").text();
            //         loc = full_province.match(/(.+?) \((\d+):(\d+)\)/i);
            //         target = loc[1];
            //     } else {
            //         var prov = document.getElementById("id_target_province");
            //         target = prov.options[prov.selectedIndex].text.split(" --- ")[0]; 
            //         target = target.match(/\d+ (.+)/i);
            //         target = target[1];
            //     }

                
            //     $.ajax({
            //         type: "POST",
            //         url: sendUrlBase2,
            //         data: "url=" + escape(document.URL) + "&pwd=" + pwdcookie + "&getdef=" + target
            //     }).done(function (html) {
            //         numbers = html.split(',');
            //         //alert(); 
            //         $('#id_target_defense').val(numbers[2]);
            //         $('#definfo').html("Is intel new enough? SoT:"+numbers[0]+" | SoM:"+numbers[1]);
            //         $('#definfo').slideDown();
                    
            //         }); 
                 
            // });
            
            // $(".autocalc").click(function (e) {
            //         e.preventDefault();
            //         target = $('#id_target_defense').val();
            //         // console.log($(this).attr("mod"));
            //         prisoners = 0;
            //         horses = 0;
            //         prisoners_per_unit = 5;

            //         if ($(this).attr("mod")=='split') {
            //             gens  = $("th:contains('Deployable Generals')").next().text().replace(",","");  
            //             soldiers = parseInt($('#id_infantry').closest('td').prev().html().replace(",",""));
            //             specs = parseInt($('#id_offensive_specialist').closest('td').prev().html().replace(",",""));
            //             elites = parseInt($('#id_elite').closest('td').prev().html().replace(",",""));
            //             if ($('#id_horse').length) horses = parseInt($('#id_horse').closest('td').prev().html().replace(",",""));
            //             if ($('#id_prisoner').length) prisoners  = parseInt($('#id_prisoner').closest('td').prev().html().replace(",",""));


            //             $('#id_infantry').val(parseInt(soldiers/gens));
            //             $('#id_offensive_specialist').val(parseInt(specs/gens));
            //             $('#id_elite').val(parseInt(elites/gens));
            //             $('#id_horse').val(parseInt(horses/gens));
            //             $('#id_prisoner').val(parseInt(prisoners/gens));


            //             calculate_offensive_points();
            //             calculate_defensive_points();

            //             return
            //         }

            //         mod = parseFloat($(this).attr("mod"));
            //         target = target*mod;
            //         mod = parseFloat(attack_calc_stuff.match(/precalculated\_modifier: ([\d.]+)/)[1]);
            //         console.log('mod'+mod);
            //         gens = parseInt($('#id_general').val());
            //         mod = mod+0.05*(gens-1);
            //         //console.log('mod'+mod);
            //         soldiers = parseInt($('#id_infantry').closest('td').prev().html().replace(",",""));
            //         specs = parseInt($('#id_offensive_specialist').closest('td').prev().html().replace(",",""));
            //         elites = parseInt($('#id_elite').closest('td').prev().html().replace(",",""));
            //         if ($('#id_horse').length) horses = parseInt($('#id_horse').closest('td').prev().html().replace(",",""));
            //         if ($('#id_prisoner').length) prisoners  = parseInt($('#id_prisoner').closest('td').prev().html().replace(",",""));
            //         console.log("Units: "+soldiers+" "+specs+" "+elites+" "+horses);

            //         spec_used = 0;
            //         elites_used = 0;

            //         if (prisoners) {
            //             //target = Math.max(target-prisoners*3*mod,0);
            //             //$('#id_prisoner').val(prisoners);
            //         }
                    
            //         spec_with_horses = Math.min(specs,horses);
            //         spec_with_horses_prisoners = Math.min(Math.min(prisoners*prisoners_per_unit,specs),horses);

            //         console.log('target '+target);

            //         console.log('os' + os);
            //         console.log('warhorse_value' + warhorse_value);
            //         console.log('elite offense value ' + eo);
            //         console.log('elite offense value ' + ed);
            //         console.log('prisoners_value_per_unit' + prisoners_value_per_unit);
            //         console.log('mod' + mod);
            //         console.log('spec_with_horses_prisoners' + spec_with_horses_prisoners);
            //         spec_used = Math.min(Math.ceil(target/((os+warhorse_value+prisoners_value_per_unit)*mod)),spec_with_horses_prisoners); //with prisoners + horses
            //         prisoners_used = spec_used*0.2
            //         horses_used = spec_used

            //         console.log('prisoners' + prisoners);
            //         console.log('prisoners_used' + prisoners_used);
                    
            //         target = target -spec_used*(os+warhorse_value+prisoners_value_per_unit)*mod;

            //         console.log('target after spec+horse+prisoners'+target);
            //         console.log('horses used'+horses_used);

            //         if (specs>spec_used && target>0 && horses>horses_used) {
            //             // if more specs with prisoners left
            //             spec_with_horses_left = Math.min((horses-horses_used),specs-spec_used);
            //             amount = Math.min(Math.ceil(target/((os+warhorse_value)*mod)),spec_with_horses_left);
            //             horses_used += amount;
            //             spec_used += amount;
            //             target = target -amount*(os+warhorse_value)*mod;
            //         }
            //         target = Math.max(target, 0);

            //         console.log('target after more spec+horses'+target);
            //         console.log('horses used'+horses_used);
            //         if (specs>spec_used && target>0 && prisoners>prisoners_used) {
            //             // if more specs with prisoners left
            //             spec_with_prisoners_left = Math.min((prisoners-prisoners_used)*5,specs-spec_used);
            //             amount = Math.min(Math.ceil(target/((os+prisoners_value_per_unit)*mod)),spec_with_prisoners_left);
            //             prisoners_used += amount * 0.2;
            //             spec_used += amount;
            //             target = target -amount*(os+prisoners_value_per_unit)*mod;
            //         }
            //         target = Math.max(target, 0);


            //         if (specs>spec_used && target>0) {
            //             // if more specs left
            //             spec_left = specs-spec_used;
            //             amount = Math.min(Math.ceil(target/((os)*mod)),spec_left);
            //             spec_used += amount;
            //             target = target -amount*(os)*mod;
            //         }
            //         target = Math.max(target, 0);


            //         console.log('target after more spec+prisoners'+target);
            //         console.log('horses used'+horses_used);

            //         console.log('prisoners' + prisoners);
            //         console.log('prisoners_used' + prisoners_used);
            //         console.log('horses' + horses);
            //         console.log('horses_used' + horses_used);
            //         console.log('elites' + elites);
            //         elites_with_horses_prisoners = Math.min(Math.min((prisoners-prisoners_used)*prisoners_per_unit,elites),horses-horses_used);
            //         console.log('elites with prisoners+horses left ' + elites_with_horses_prisoners);
            //         elites_used = Math.min(Math.ceil(target/((eo+warhorse_value+prisoners_value_per_unit)*mod)),elites_with_horses_prisoners); //with prisoners + horses
            //         prisoners_used += elites_used*0.2;
            //         horses_used += elites_used;
            //         target -= elites_used*(eo+warhorse_value+prisoners_value_per_unit)*mod;
            //         console.log('Elites used'+elites_used);
            //         target = Math.max(target, 0);

            //         console.log('target after elite+horse+prisoners'+target);
            //         console.log('horses used'+horses_used);
            //         if (elites>elites_used && target>0 && horses>horses_used) {
            //             // if more specs with prisoners left
            //             elites_with_prisoners_left = Math.min((horses-horses_used),elites-elites_used);
            //             amount = Math.min(Math.ceil(target/((eo+warhorse_value)*mod)),elites_with_prisoners_left);
            //             horses_used += amount;
            //             elites_used += amount;
            //             target = target -amount*(eo+warhorse_value)*mod;
            //         }
            //         target = Math.max(target, 0);

            //         console.log('target after more elite+horses'+target);
            //         console.log('Elites used'+elites_used);

            //         console.log('horses used'+horses_used);
            //         if (elites>elites_used && target>0 && prisoners>prisoners_used) {
            //             // if more specs with prisoners left
            //             elites_with_prisoners_left = Math.min((prisoners-prisoners_used)*prisoners_per_unit,elites-elites_used);
            //             amount = Math.min(Math.ceil(target/((eo+prisoners_value_per_unit)*mod)),elites_with_prisoners_left);
            //             prisoners_used += amount * 0.2;
            //             elites_used += amount;
            //             target = target -amount*(eo+prisoners_value_per_unit)*mod;
            //         }
            //         target = Math.max(target, 0);
            //         console.log('target after more elite+prisoners'+target);
            //         console.log('Elites used'+elites_used);

            //         if (elites>elites_used && target>0) {
            //             // if more specs left
            //             elites_left = elites-elites_used;
            //             amount = Math.min(Math.ceil(target/((eo)*mod)),elites_left);
            //             elites_used += amount;
            //             target = target -amount*(eo)*mod;
            //         }
            //         target = Math.max(target, 0);
            //         console.log('target after more elite'+target);
            //         console.log('Elites used'+elites_used);



            //         $('#id_offensive_specialist').val(Math.round(spec_used));
            //         $('#id_elite').val(Math.round(elites_used));
            //         $('#id_horse').val(Math.round(horses_used));
            //         $('#id_prisoner').val(Math.round(Math.floor(prisoners_used)));
            //         console.log('target '+target);
            //         if (target>0) alert("Not enough offence!");



            //         // if (spec_with_horses_prisoners*(os+0.6+1)*mod>=target) { 
            //      //        //if mounted specs is nuff
            //      //        amount = Math.ceil(target/((os+1+0.6)*mod));
            //      //        specsused = amount;
            //      //        $('#id_offensive_specialist').val(amount);
            //      //        $('#id_horse').val(amount);
            //      //        $('#id_prisoner').val(Math.floor(amount/5));
            //      //        //console.log('if mounted specs is nuff');
            //      //    } else if (spec_with_horses*(os+1)*mod>=target) { 
            //         //  //if mounted specs is nuff
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //      //        specsused = amount;
            //         //  $('#id_offensive_specialist').val(amount);
            //         //  $('#id_horse').val(amount);
            //         //  //console.log('if mounted specs is nuff');
            //         // } else if (spec_with_horses*(os+1)*mod<target && spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod>=target && specs>=horses) { 
            //         //  //if nuff with mounted specs + extra specs
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //         //  new_target = target - spec_with_horses*(os+1)*mod;
            //         //  //console.log('new '+new_target);
            //         //  specsused = spec_with_horses+Math.ceil(new_target/((os)*mod));
            //         //  $('#id_offensive_specialist').val(specsused);
            //         //  $('#id_horse').val(spec_with_horses);
            //         //  //console.log('if nuff with mounted specs + extra specs');

            //         // } else if (spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod<target && spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod+elites*eo*mod>=target && specs>=horses) { 
            //         //  //if nuff with mounted specs, extra specs, extra elites
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //         //  new_target = target - (specs*os+horses)*mod;
            //         //  //console.log('new '+new_target);
            //         //  elitesused = Math.ceil(new_target/((eo)*mod));
            //      //        specsused = specs;
            //         //  $('#id_offensive_specialist').val(specs);
            //         //  $('#id_elite').val(elitesused);
            //         //  $('#id_horse').val(spec_with_horses);
            //         //  //console.log('if nuff with mounted specs, extra specs, extra elites');

            //         // } else if (spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod<target && spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod+elites*eo*mod>=target && specs<horses) { //if nuff with specs + horses
            //         //  //if nuff with mounted specs, extra elites with some horses
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //         //  new_target = target - (specs*os+specs)*mod;
            //         //  horseswithelites = Math.min(elites,horses-specs);
            //      //        specsused = specs;
                        
            //         //  if (horseswithelites*(eo+1)*mod>=new_target) {
            //         //      //nuff horses for all elites
            //         //      elitesused = Math.ceil(new_target/((eo+1)*mod));
            //         //      horsesused = specs + elitesused;
            //         //      //console.log('nuff horses for all elites');
            //         //  } else if ((elites*eo+horseswithelites)*mod>=new_target) {
            //         //      //only nuff horses for some elites
            //         //      new_target = target - (specs*os+horses)*mod;
            //         //      elitesused = Math.ceil(new_target/((eo)*mod));
            //         //      horsesused = horses;
            //         //      //console.log('only nuff horses for some elites');
            //         //  }

                        
            //         //  $('#id_offensive_specialist').val(specs);
            //         //  $('#id_elite').val(elitesused);
            //         //  $('#id_horse').val(horsesused);

            //         // } else {
            //         //  $('#definfo').html("Not enough offence!");
                    
            //         // }


            //         if (prisoners*prisoners_per_unit>elites_used+spec_used) {
            //             //console.log('too many prisoners!');
            //             $('#id_prisoner').val(Math.floor((elites_used+spec_used)/5));

            //         }
            //         //console.log("horses+spec:"+spec_with_horses); 
            //         calculate_offensive_points();
            //         calculate_defensive_points();
            // });
            

            // $(".autobushcalc").click(function (e) {
            //         e.preventDefault();
            //         target = $('#id_target_defense').val();
            //         // console.log($(this).attr("mod"));
            //         prisoners = 0;
            //         horses = 0;
            //         prisoners_per_unit = 5;

            //         if ($(this).attr("mod")=='split') {
            //             gens  = $("th:contains('Deployable Generals')").next().text().replace(",","");  
            //             soldiers = parseInt($('#id_infantry').closest('td').prev().html().replace(",",""));
            //             specs = parseInt($('#id_offensive_specialist').closest('td').prev().html().replace(",",""));
            //             elites = parseInt($('#id_elite').closest('td').prev().html().replace(",",""));
            //             if ($('#id_horse').length) horses = parseInt($('#id_horse').closest('td').prev().html().replace(",",""));
            //             if ($('#id_prisoner').length) prisoners  = parseInt($('#id_prisoner').closest('td').prev().html().replace(",",""));


            //             $('#id_infantry').val(parseInt(soldiers/gens));
            //             $('#id_offensive_specialist').val(parseInt(specs/gens));
            //             $('#id_elite').val(parseInt(elites/gens));
            //             $('#id_horse').val(parseInt(horses/gens));
            //             $('#id_prisoner').val(parseInt(prisoners/gens));


            //             calculate_offensive_points();
            //             calculate_defensive_points();

            //             return
            //         }

            //         // mod = parseFloat($(this).attr("mod"));
            //         mod = 1;
            //         target = target*mod;
            //         // mod = parseFloat(attack_calc_stuff.match(/precalculated\_modifier: ([\d.]+)/)[1]);
            //         console.log('mod'+mod);
            //         gens = parseInt($('#id_general').val());
            //         // mod = mod+0.05*(gens-1);
            //         //console.log('mod'+mod);
            //         soldiers = parseInt($('#id_infantry').closest('td').prev().html().replace(",",""));
            //         specs = parseInt($('#id_offensive_specialist').closest('td').prev().html().replace(",",""));
            //         elites = parseInt($('#id_elite').closest('td').prev().html().replace(",",""));
            //         if ($('#id_horse').length) horses = parseInt($('#id_horse').closest('td').prev().html().replace(",",""));
            //         if ($('#id_prisoner').length) prisoners  = parseInt($('#id_prisoner').closest('td').prev().html().replace(",",""));
            //         console.log("Units: "+soldiers+" "+specs+" "+elites+" "+horses);

            //         spec_used = 0;
            //         elites_used = 0;

            //         if (prisoners) {
            //             //target = Math.max(target-prisoners*3*mod,0);
            //             //$('#id_prisoner').val(prisoners);
            //         }
                    
            //         spec_with_horses = Math.min(specs,horses);
            //         spec_with_horses_prisoners = Math.min(Math.min(prisoners*prisoners_per_unit,specs),horses);

            //         console.log('target '+target);

            //         console.log('os' + os);
            //         console.log('warhorse_value' + warhorse_value);
            //         console.log('elite offense value ' + eo);
            //         console.log('elite offense value ' + ed);
            //         console.log('prisoners_value_per_unit' + prisoners_value_per_unit);
            //         console.log('mod' + mod);
            //         console.log('spec_with_horses_prisoners' + spec_with_horses_prisoners);
            //         spec_used = Math.min(Math.ceil(target/((os+warhorse_value+prisoners_value_per_unit)*mod)),spec_with_horses_prisoners); //with prisoners + horses
            //         prisoners_used = spec_used*0.2
            //         horses_used = spec_used

            //         console.log('prisoners' + prisoners);
            //         console.log('prisoners_used' + prisoners_used);
                    
            //         target = target -spec_used*(os+warhorse_value+prisoners_value_per_unit)*mod;

            //         console.log('target after spec+horse+prisoners'+target);
            //         console.log('horses used'+horses_used);

            //         if (specs>spec_used && target>0 && horses>horses_used) {
            //             // if more specs with prisoners left
            //             spec_with_horses_left = Math.min((horses-horses_used),specs-spec_used);
            //             amount = Math.min(Math.ceil(target/((os+warhorse_value)*mod)),spec_with_horses_left);
            //             horses_used += amount;
            //             spec_used += amount;
            //             target = target -amount*(os+warhorse_value)*mod;
            //         }
            //         target = Math.max(target, 0);

            //         console.log('target after more spec+horses'+target);
            //         console.log('horses used'+horses_used);
            //         if (specs>spec_used && target>0 && prisoners>prisoners_used) {
            //             // if more specs with prisoners left
            //             spec_with_prisoners_left = Math.min((prisoners-prisoners_used)*5,specs-spec_used);
            //             amount = Math.min(Math.ceil(target/((os+prisoners_value_per_unit)*mod)),spec_with_prisoners_left);
            //             prisoners_used += amount * 0.2;
            //             spec_used += amount;
            //             target = target -amount*(os+prisoners_value_per_unit)*mod;
            //         }
            //         target = Math.max(target, 0);


            //         if (specs>spec_used && target>0) {
            //             // if more specs left
            //             spec_left = specs-spec_used;
            //             amount = Math.min(Math.ceil(target/((os)*mod)),spec_left);
            //             spec_used += amount;
            //             target = target -amount*(os)*mod;
            //         }
            //         target = Math.max(target, 0);


            //         console.log('target after more spec+prisoners'+target);
            //         console.log('horses used'+horses_used);

            //         console.log('prisoners' + prisoners);
            //         console.log('prisoners_used' + prisoners_used);
            //         console.log('horses' + horses);
            //         console.log('horses_used' + horses_used);
            //         console.log('elites' + elites);
            //         elites_with_horses_prisoners = Math.min(Math.min((prisoners-prisoners_used)*prisoners_per_unit,elites),horses-horses_used);
            //         console.log('elites with prisoners+horses left ' + elites_with_horses_prisoners);
            //         elites_used = Math.min(Math.ceil(target/((eo+warhorse_value+prisoners_value_per_unit)*mod)),elites_with_horses_prisoners); //with prisoners + horses
            //         prisoners_used += elites_used*0.2;
            //         horses_used += elites_used;
            //         target -= elites_used*(eo+warhorse_value+prisoners_value_per_unit)*mod;
            //         console.log('Elites used'+elites_used);
            //         target = Math.max(target, 0);

            //         console.log('target after elite+horse+prisoners'+target);
            //         console.log('horses used'+horses_used);
            //         if (elites>elites_used && target>0 && horses>horses_used) {
            //             // if more specs with prisoners left
            //             elites_with_prisoners_left = Math.min((horses-horses_used),elites-elites_used);
            //             amount = Math.min(Math.ceil(target/((eo+warhorse_value)*mod)),elites_with_prisoners_left);
            //             horses_used += amount;
            //             elites_used += amount;
            //             target = target -amount*(eo+warhorse_value)*mod;
            //         }
            //         target = Math.max(target, 0);

            //         console.log('target after more elite+horses'+target);
            //         console.log('Elites used'+elites_used);

            //         console.log('horses used'+horses_used);
            //         if (elites>elites_used && target>0 && prisoners>prisoners_used) {
            //             // if more specs with prisoners left
            //             elites_with_prisoners_left = Math.min((prisoners-prisoners_used)*prisoners_per_unit,elites-elites_used);
            //             amount = Math.min(Math.ceil(target/((eo+prisoners_value_per_unit)*mod)),elites_with_prisoners_left);
            //             prisoners_used += amount * 0.2;
            //             elites_used += amount;
            //             target = target -amount*(eo+prisoners_value_per_unit)*mod;
            //         }
            //         target = Math.max(target, 0);
            //         console.log('target after more elite+prisoners'+target);
            //         console.log('Elites used'+elites_used);

            //         if (elites>elites_used && target>0) {
            //             // if more specs left
            //             elites_left = elites-elites_used;
            //             amount = Math.min(Math.ceil(target/((eo)*mod)),elites_left);
            //             elites_used += amount;
            //             target = target -amount*(eo)*mod;
            //         }
            //         target = Math.max(target, 0);
            //         console.log('target after more elite'+target);
            //         console.log('Elites used'+elites_used);



            //         $('#id_offensive_specialist').val(Math.round(spec_used));
            //         $('#id_elite').val(Math.round(elites_used));
            //         $('#id_horse').val(Math.round(horses_used));
            //         $('#id_prisoner').val(Math.round(Math.floor(prisoners_used)));
            //         console.log('target '+target);
            //         if (target>0) alert("Not enough offence!");



            //         // if (spec_with_horses_prisoners*(os+0.6+1)*mod>=target) { 
            //      //        //if mounted specs is nuff
            //      //        amount = Math.ceil(target/((os+1+0.6)*mod));
            //      //        specsused = amount;
            //      //        $('#id_offensive_specialist').val(amount);
            //      //        $('#id_horse').val(amount);
            //      //        $('#id_prisoner').val(Math.floor(amount/5));
            //      //        //console.log('if mounted specs is nuff');
            //      //    } else if (spec_with_horses*(os+1)*mod>=target) { 
            //         //  //if mounted specs is nuff
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //      //        specsused = amount;
            //         //  $('#id_offensive_specialist').val(amount);
            //         //  $('#id_horse').val(amount);
            //         //  //console.log('if mounted specs is nuff');
            //         // } else if (spec_with_horses*(os+1)*mod<target && spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod>=target && specs>=horses) { 
            //         //  //if nuff with mounted specs + extra specs
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //         //  new_target = target - spec_with_horses*(os+1)*mod;
            //         //  //console.log('new '+new_target);
            //         //  specsused = spec_with_horses+Math.ceil(new_target/((os)*mod));
            //         //  $('#id_offensive_specialist').val(specsused);
            //         //  $('#id_horse').val(spec_with_horses);
            //         //  //console.log('if nuff with mounted specs + extra specs');

            //         // } else if (spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod<target && spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod+elites*eo*mod>=target && specs>=horses) { 
            //         //  //if nuff with mounted specs, extra specs, extra elites
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //         //  new_target = target - (specs*os+horses)*mod;
            //         //  //console.log('new '+new_target);
            //         //  elitesused = Math.ceil(new_target/((eo)*mod));
            //      //        specsused = specs;
            //         //  $('#id_offensive_specialist').val(specs);
            //         //  $('#id_elite').val(elitesused);
            //         //  $('#id_horse').val(spec_with_horses);
            //         //  //console.log('if nuff with mounted specs, extra specs, extra elites');

            //         // } else if (spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod<target && spec_with_horses*(os+1)*mod+(specs-spec_with_horses)*os*mod+elites*eo*mod>=target && specs<horses) { //if nuff with specs + horses
            //         //  //if nuff with mounted specs, extra elites with some horses
            //         //  amount = Math.ceil(target/((os+1)*mod));
            //         //  new_target = target - (specs*os+specs)*mod;
            //         //  horseswithelites = Math.min(elites,horses-specs);
            //      //        specsused = specs;
                        
            //         //  if (horseswithelites*(eo+1)*mod>=new_target) {
            //         //      //nuff horses for all elites
            //         //      elitesused = Math.ceil(new_target/((eo+1)*mod));
            //         //      horsesused = specs + elitesused;
            //         //      //console.log('nuff horses for all elites');
            //         //  } else if ((elites*eo+horseswithelites)*mod>=new_target) {
            //         //      //only nuff horses for some elites
            //         //      new_target = target - (specs*os+horses)*mod;
            //         //      elitesused = Math.ceil(new_target/((eo)*mod));
            //         //      horsesused = horses;
            //         //      //console.log('only nuff horses for some elites');
            //         //  }

                        
            //         //  $('#id_offensive_specialist').val(specs);
            //         //  $('#id_elite').val(elitesused);
            //         //  $('#id_horse').val(horsesused);

            //         // } else {
            //         //  $('#definfo').html("Not enough offence!");
                    
            //         // }


            //         if (prisoners*prisoners_per_unit>elites_used+spec_used) {
            //             //console.log('too many prisoners!');
            //             $('#id_prisoner').val(Math.floor((elites_used+spec_used)/5));

            //         }
            //         //console.log("horses+spec:"+spec_with_horses); 
            //         calculate_offensive_points();
            //         calculate_defensive_points();
            // });



            // $(".offensive-points-field input").change(calculate_defensive_points);
            
           
            $("#id_send_armies").click(function (e) {
                //console.log("sending army!");
                e.preventDefault();
                var kd = "ownkd";
                var is = "ownis";
                var data = {};
                data.attackby = ((sitting && getCookie("sitname_"+game_server)) || getCookie("provname_"+game_server));
                data.mod_off = document.getElementById("id_total_offense_points").textContent;
                var prov = document.getElementById("id_target_province");

                if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
                    full_province = $(".game-header").find("h1").text();
                    loc = full_province.match(/(.+?) \((\d+):(\d+)\)/i);
                    target = loc[1];
                    data.target = target;
                    data.target2 = target;
                } else {
                    data.target = prov.options[prov.selectedIndex].text.split(" --- ")[0];
                    data.target2 = prov.options[prov.selectedIndex].text;

                    data.target2 = data.target2.match(/\d+ (.+)/i)[1];
                    data.target = data.target.match(/\d+ (.+)/i)[1];

                }
                var type = document.getElementById("id_attack_type");
                data.attack_type = type.options[type.selectedIndex].text.split(" (")[0].replace(" ", "_").toUpperCase();
                data.generals = document.getElementById("id_general").value;
                data.soldiers = document.getElementById("id_infantry").value;
                data.ospecs = document.getElementById("id_offensive_specialist").value;
                data.elites = document.getElementById("id_elite").value;
                // if ($("#id_horse")) {
                //     data.horses = document.getElementById("id_horse").value;
                // } else {
                //     data.horses = 0;
                //  }
                //data.mercs = document.getElementById("id_mercenary").value;
                //console.log(getCookie("layout_confirm_attacks"));
                  if (getCookie("layout_confirm_attacks")=='1') {
                      if (confirm("Sure you want to send "+data.mod_off+" @ "+data.target2 +"? Click OK to continue.")){
                         $(form).append('<input type="hidden" name="send_army" value="1" />').submit();
                      }
                  } else {
                        $(form).append('<input type="hidden" name="send_army" value="1" />').submit();
                  }
                  attackinfo = "|"+data.mod_off+"off ("+data.generals+" gens)";
                setCookie("attackinfo",attackinfo, 1);
                setCookie("attacked", 'I think you attacked -- Please go to SoM page.', 1);
            });
        }
        if (getCookie("attackinfo")) attackinfo = getCookie("attackinfo");
        }
    

    var sendUrlBase2 = "//intel.utopia-game.com/parse/parse.php";
    var newHTML = document.createElement('div');
    newHTML.setAttribute('id', 'botupdate');


    if (send) {
        //Add to munk!
        frompage = page;
        raw_html = '';
        if (page2) frompage = page2;
        if (page2=='self_som') raw_html = som_clone;
        if (game_content_html) raw_html = game_content_html;
        game_content_html = '';
        if (emptycontent) contentdata = 'skip';
        console.log("Sending to intel: "+frompage);
        // console.log("Length of data/html file:"+contentdata.length);
        $.ajax({
            type: "POST",
            url: sendUrlBase2,
            data: "url=" + escape(document.URL) + "&version=" + version + "&data=" + escape(contentdata) + "&raw_html=" + escape(raw_html) +"&resources=" + escape(resource_bar) + "&token=" + token + "&prov=" + (sitting ? escape(getCookie("sitname_"+game_server)) : escape(getCookie("provname_"+game_server))) + "&extra=" + extra + "&page=" + frompage + "&sitter=" + sitting + "&realprov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie +"&attackinfo=" + attackinfo
        }).done(function (html) {
            console.log("Successfully sent page to intel ("+sendUrlBase2+"): "+frompage);
        	html = html.trim();

        	if (page.match("(wol|gen)/(sit/)?game/throne")) {
	    		//console.log("pwdcookie:"+pwdcookie);
	    		
    			if (pwdcookie=='null') {
	    			
	    			// $('#botresponse').html('MunkLogin: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
		    		// $("#login2bot").click(function () {
		      //           user = $("#botuser").val();
		      //           pwd = $("#botpass").val();
		      //           setCookie('userpwd', user+"|,|"+pwd,14);
		      //           pwdcookie = user+"|,|"+pwd;
		      //           $('#botresponse').html('');
		      //           $.ajax({
					   //          type: "POST",
					   //          url: sendUrlBase2,
					   //          data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					   //      }).done(function (html) {
					   //      	if (html.trim()=="<3") { 
					   //      			setCookie('userpwd', '',-1);
					   //      			 //$('#botresponse').html('Bad Login -- check password?');
					   //      			 $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
						  //       	} else {			
						  //       		 $('#botresponse').html('Successful login');
						  //       		 setTimeout(function () {
							 //                $('#botresponse').html('');
							 //              }, 5000);
						  //       	}
					   //      	});
		      //      });


		        } else {
        		
				var ordersamount = html.substring(0,html.indexOf("#n#"));
				var orders = html.substring(html.indexOf("#n#")+3,html.indexOf("#ENDORDERS#"));
				html = html.substring(html.indexOf("#ENDORDERS#")+11);
				//console.log(html);
				var eventsamount = html.substring(0,html.indexOf("#n#"));
				var eventsline = html.substring(html.indexOf("#n#")+3,html.indexOf("#ENDEVENTS#"));
				html = html.substring(html.indexOf("#ENDEVENTS#")+11);	

				var aidsamount = html.substring(0,html.indexOf("#n#"));
				setCookie('aidsamount', "("+aidsamount+")");
				var aidsline = html.substring(html.indexOf("#n#")+3,html.indexOf("#ENDAIDS#"));
				html = html.substring(html.indexOf("#ENDAIDS#")+9);


                var requestsamount = html.substring(0,html.indexOf("#n#"));
                setCookie('requestamount', "("+requestsamount+")");
                var requestline = html.substring(html.indexOf("#n#")+3,html.indexOf("#ENDREQUESTS#"));
                html = html.substring(html.indexOf("#ENDREQUESTS#")+13);

				var provorder = html.substring(html.indexOf("#n#")+3,html.indexOf("#ENDPROVORDER#"));
				var provorderread = provorder.substring(0,1);
				var provorder = provorder.substring(1);
				html = html.substring(html.indexOf("#ENDPROVORDER#")+14);

				//console.log(html.indexOf("#ENDEVENTS#"));
				 $(".game-content").prepend('<span id=orders><a href=# id=orderslink>(Orders #'+ordersamount+')</a> <a href=# id=eventslink>(Events #'+eventsamount+')</a> <a href=# id=aidslink>(AID #'+aidsamount+')</a>   <a href=# id=requestlink>(Spells #'+requestsamount+')</a>  <a href=# id=provorder>(ProvOrder)</a></span><span id=showorders>'+orders+'</span><br><span id=showevents>'+eventsline+'</span><div id=showaids>'+aidsline+'</div><div id=showrequests>'+requestline+'</div>');
				 $('#aidnum').html("("+aidsamount+")");
				 $("#orders").hide().fadeIn("slow");
				 $( "#showorders" ).hide();
				 $( "#showevents" ).hide();
				 $( "#showaids" ).hide();
                 $( "#showrequests" ).hide();
				 $( "#orderslink" ).click(function() {
					  $( "#showorders" ).slideToggle();
				   });
				 $( "#eventslink" ).click(function() {
					  $( "#showevents" ).slideToggle();
				   });
				 $( "#aidslink" ).click(function() {
					  $( "#showaids" ).slideToggle();
				   });
				 $( "#provorder" ).click(function() {
					  $( "#showprovorder" ).slideToggle();
				   });
                 $( "#requestlink" ).click(function() {
                      $( "#showrequests" ).slideToggle();
                   });
				 if (provorder) $("#showaids").after('<span id=showprovorder class=bad>'+provorder+' <button id=markred>Mark as read</button></span>');
				 if (provorderread == '1') $( "#showprovorder" ).hide();
				 	$("#markred").click(function () {      
	    				provnewsasread();
	    			});

				}
			} else if (page.match("(wol|gen)/(sit/)?game/aid")) {
	    		//console.log("pwdcookie:"+pwdcookie);
	    		
    			if (pwdcookie=='null') {
	    			
	    			$('#botresponse').html('MunkLogin: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
		    		$("#login2bot").click(function () {
		                user = $("#botuser").val();
		                pwd = $("#botpass").val();
		                setCookie('userpwd', user+"|,|"+pwd,14);
		                pwdcookie = user+"|,|"+pwd;
		                $('#botresponse').html('');
		                $.ajax({
					            type: "POST",
					            url: sendUrlBase2,
					            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					        }).done(function (html) {
					        	if (html.trim()=="<3") { 
					        			// setCookie('userpwd', '',-1);
					        			 //$('#botresponse').html('Bad Login -- check password?');
					        			 $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
						        	} else {			
						        		 $('#botresponse').html('Successful login');
						        		 setTimeout(function () {
							                $('#botresponse').html('');
							              }, 5000);
						        	}
					        	});
		           });
		        } else {
        		
							
				var aidsamount = html.substring(1,html.indexOf("#n#"));
				var aidsline = html.substring(html.indexOf("#n#")+3,html.indexOf("#ENDAIDS#"));
				
				setCookie('aidsamount', "("+aidsamount+")");
				$('#aidnum').html("("+aidsamount+")");
				//console.log(html.indexOf("#ENDEVENTS#"));
				 $("h2:contains('Send Aid')").append('</a> | <a href=# id=aidslink>AIDLIST: #'+aidsamount+'</a></span><div id=showaids>'+aidsline+'</div>');
				 
				 //$( "#showaids" ).hide();
				 $( ".provselect" ).click(function(e) {
                      province_target = $(this).attr('prov').trim();
                      e.preventDefault();
					  // $('#id_target_province option:contains("'+$(this).attr('prov')+'")').prop('selected', true);
                      var optionsThatContainValue = $('#id_target_province').find('option').filter(function() {
                          return $(this).text().trim() === province_target;
                        });
                      optionsThatContainValue.prop('selected', true);
					  var prov = $('#id_target_province option:selected').text();
					  $("div #uniform-id_target_province span").html(prov);
				   });


                function handleSetAid(aidHtmlId, provinceTarget, amount) {
                    $("#id_money").val('');
                    $("#id_runes").val('');
                    $("#id_infantry_count").val('');
                    $("#id_food").val('');

                    var optionProvince = $('#id_target_province').find('option').filter(function() {
                        return $(this).text().trim() === provinceTarget;
                    });
                    optionProvince.prop('selected', true);

                    $("div #uniform-id_target_province span").html(provinceTarget);

                    aidmax = Math.min(parseInt($(aidHtmlId).closest('tr').find('td:eq(0)').text().replace(/\,/g, '')), amount);
                    $(aidHtmlId).closest('td').find('input:first').val(aidmax);
                }

                $(".setsolds").click(function(e) {
                    e.preventDefault();
                    provinceTarget = $(this).attr('prov').trim();
                    amount = parseInt($(this).attr('amount'));
                    handleSetAid('#id_infantry_count', provinceTarget, amount)
                });

                $(".setrunes").click(function(e) {
                    e.preventDefault();
                    provinceTarget = $(this).attr('prov').trim();
                    amount = parseInt($(this).attr('amount'));
                    handleSetAid('#id_runes', provinceTarget, amount)
                });

                $(".setmoney").click(function(e) {
                    e.preventDefault();
                    provinceTarget = $(this).attr('prov').trim();
                    amount = parseInt($(this).attr('amount'));
                    handleSetAid('#id_money', provinceTarget, amount)
                });

                $(".setfood").click(function(e) {
                    e.preventDefault();
                    provinceTarget = $(this).attr('prov').trim();
                    amount = parseInt($(this).attr('amount'));
                    handleSetAid('#id_food', provinceTarget, amount)
                });

                $(".setacres").click(function(e) {
                    e.preventDefault();
                    provinceTarget = $(this).attr('prov').trim();
                    amount = parseInt($(this).attr('amount'));
                    handleSetAid('#id_land', provinceTarget, amount)
                });
                 
				 
				 
				 $( "#aidslink" ).click(function() {
					  $( "#showaids" ).slideToggle();
				   });
				html = html.substring(html.indexOf("#ENDAIDS#")+9);
				}
			}
            
            $("#botupdate").html(html).hide();
            
            
            if (getCookie("attacked")=='I think you attacked -- Please go to SoM page.') {
                $('#botupdate').append(decodeURIComponent(getCookie("attacked")));
                if ((page.match("(wol|gen)/(sit/)?game/throne"))) {
                    if (sitting) {
                        //alert('Getting SoM for you!');
                        setCookie("attacked", '', -1);
                        //window.location = '//utopia-game.com/wol/sit/game/council_military';
                    } else {
                        //alert('Getting SoM for you!');
                        setCookie("attacked", '', -1);
                        //window.location = '//utopia-game.com/wol/game/council_military';
                    }
                }
            }
            
            $("#botupdate").css("margin-left", -($("#botupdate").width() / 2) - 7);
            //console.log(($("#botupdate").width() / 2));
            $('#botupdate').hide();
            if (html!='' || getCookie("attacked")) {
            	//console.log(html);
        		var seconds = new Date().getTime();
            	$('#botupdate').removeClass();
            	$('#botupdate').addClass(seconds + ' good message');
            	$('#botupdate').hide().fadeIn();
            }

           //var seconds = new Date().getTime() / 1000;
            setTimeout(function () {
                $('#botupdate.'+seconds).fadeOut("slow");
            }, 5000);
        });


        //alert("sent data!");
    }

    // Theme stuff
    //var page = document.URL;
    // <div><a href="/wol/game/province_news">News</a></div>
    //$('p').fadeOut();
     
   if ($("h2:contains('The Kingdom Reporter')").length) {
	
	
	 $("h2:contains('The Kingdom Reporter')").append("<br>Hide aid: <input type='checkbox' id='hide_aid'> Only my prov: <input type='checkbox' id='my_prov'>");
	 
	 
	 $('#hide_aid').click(function(){
	 			aidstuff = $(".news-aid").closest('tr');
	            if (this.checked) { aidstuff.hide(); } else { aidstuff.fadeIn('slow');}
	        });
	 
	 if ($("h2:contains('The Kingdom Reporter')").length) {
        $('#hide_aid').click();
        aidstuff = $(".news-aid").closest('tr');
        aidstuff.hide();
     } 
	        
     $('#my_prov').click(function(){
     			
	            news_prov = (page.match("/sit/")) ? decodeURIComponent(getCookie("sitname_"+game_server)) : decodeURIComponent(getCookie("provname_"+game_server));
	            
     			if (this.checked) {
     				$(".news-incident-report:not(:contains('"+news_prov+"'))").closest('tr').fadeOut('slow');
     			} else {
     				$(".news-incident-report:not(:contains('"+news_prov+"'))").closest('tr').fadeIn('slow');
     			}
     });
	 
	
	}	         




if (page.match("(wol|gen)/(sit/)?game/throne") || page.match("(wol|gen)/(sit/)?game/enchantment")) {
	
	
	if (page.match("(wol|gen)/(sit/)?game/throne") && getCookie('layout_throne')=='1') {
	land = $("th:contains('Land'):eq(1)").next().text().replace(",","");
	peasants = $("th:contains('Peasants'):eq(1)").next().text().replace(/\,/g, '');
    Solds = $("th:contains('Soldiers'):eq(0)").next().text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
	Thieves = $("th:contains('Thieves'):eq(0)").next().text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
	Wizards = $("th:contains('Wizards'):eq(0)").next().text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
	OS = $("th:contains('Ruler'):eq(0)").nextAll().eq(2).text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
	DS = $("th:contains('Land'):eq(1)").nextAll().eq(2).text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
	ELITE = $("th:contains('Peasants'):eq(1)").nextAll().eq(2).text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
    money = $("th:contains('Money'):eq(1)").next().text().replace(/\,/g, '').replace(/ \(\d+%\)/g,"");
    //console.log('money '+money);
    if (money>5000000) {
        $("th:contains('Money'):eq(1)").next().text(Math.round(money/100000)/10+"M");
    }
    $("th:contains('Money'):eq(1)").next().append(" <font color=orange size=1>"+Math.round(money/land/100)/10+"k gcpa</font>");
	$("th:contains('Peasants'):eq(1)").next().append(" <font color=orange size=1>"+Math.round(peasants*10/land)/10+"ppa</font>");
    $("th:contains('Soldiers'):eq(0)").next().append(" <font color=orange size=1>"+Math.round(Solds*10/land)/10+"spa</font>");
	$("th:contains('Thieves'):eq(0)").next().append(" <font color=orange size=1>"+Math.round(Thieves*10/land)/10+"tpa</font>");
	$("th:contains('Wizards'):eq(0)").next().append(" <font color=orange size=1>"+Math.round(Wizards*10/land)/10+"wpa</font>");
	$("th:contains('Ruler'):eq(0)").nextAll().eq(2).append(" <font color=orange size=1>"+Math.round(OS*10/land)/10+"ospa</font>");
	$("th:contains('Land'):eq(1)").nextAll().eq(2).append(" <font color=orange size=1>"+Math.round(DS*10/land)/10+"dspa</font>");
	$("th:contains('Peasants'):eq(1)").nextAll().eq(2).append(" <font color=orange size=1>"+Math.round(ELITE*10/land)/10+"epa</font>");
	}
	// GET SPELLS
	//spellsstr = '';
        // $("h2:contains('Recent News')").before('<h2 id=spellslist>'+spellsstr+'</h2>');
        //$('input[type="submit"][value="Cast Spell"]').after("<h2 id=spellslist>" + spellsstr + "</h2>");

        if (getCookie('layout_throne')=='1') {
            $("th:contains('Networth'):eq(0)").nextAll().eq(2).append(" <font color=orange size=1 id=defhomestr>("+getCookie('defhomestr')+")</font>");
            $("th:contains('Trade Balance'):eq(0)").nextAll().eq(2).append(" <font color=orange size=1 id=offhomestr>("+getCookie('offhomestr')+")</font>");
        }
        
        
        spellgrid = '<table id=spellslist><tr>\n';
		a = 1;
		$("#id_self_spell > optgroup > option").each(function(i, obj) {
		    // console.log(obj.text + ' ' + $(obj).val());
		    spellname = obj.text;
		    spellrunes = spellname.match(/([\d\s\w-']+) \((.+?)\)/)[2];
		    spellname = spellname.match(/([\d\s\w-']+) \((.+?)\)/)[1];
		    spellmatch =  spellname + '\(.*\)';
		    spellmatch =  spellname + ' \\((\[\\d\\s\\w\]+)\\)';
		    
		    spellmatch =  spellname + ' \\(\(.*\)\\)';
		    spellmatch =  '(<font color=[^>]+>'+spellname + '</font> \\(.+?\\))';
		    spellmatch = spellsstr.match(spellmatch);
		    
		    if (spellmatch) { spellmatch = spellmatch[1]; } else { spellmatch = spellname ; }
		    spellgrid = spellgrid + '<td>' + spellmatch  + '<br><span class=castspell value="'+$(obj).val()+'" style="cursor: pointer; cursor: hand;"> Cast:' + spellrunes + '</span></td>\n';
			if ( ( (a) % 3 ) === 0) spellgrid =  spellgrid + "\n</tr><tr>\n";
			a = a+1;
		});
		spellgrid =  spellgrid + "\n</tr></table>\n";
        $('input[type="submit"][value="Cast Spell"]').after(spellgrid);
		$(".castspell").click(function () {
			$('select[name="self_spell"] option[value="' + $(this).attr('value') + '"]').prop('selected', true);
			var spell = $('#id_self_spell option:selected').text();
			$("div #uniform-id_self_spell span").html(spell);
	    	$("#id_self_spell").closest("form").submit();
	    });
        
    if (page.match("(wol|gen)/(sit/)?game/enchantment")) {

        var spells = new Array();
        $("table:contains('Effects') th").each(function (i, obj) {
            if (i > 2) {
                color = "";
                if ($(obj).html().indexOf("good")>0) color="#90ee90";
                if ($(obj).html().indexOf("bad")>0) color="red";
                var spell = $(obj).html().replace(/(<([^>]+)>)/ig, "").trim();
                spell = "<font color='"+color+"'>" + spell+"</font>";
                if ( ( (i-3) % 3 ) === 0 && (i-3)!=0) spell = "<br>" + spell;
                spells[i - 3] = spell;
            }
        });
        $("table:contains('Effects') td").each(function (i, obj) {
            var days = $(obj).html().trim();
            if ((days.match("day") && days.length < 8) || days.match("-")) {
                color = '';
                if ((days.match("1 day$") || days.match("-"))) color = "orange";
                spells[(i) / 2] += " (<font color="+color+">" + days + "</font>)";
            }
        });
        spellsstr = spells.toString();
        var seconds = new Date().getTime();
        if (sitting) {
            setCookie('activespellssitter', spellsstr,1);
            setCookie('spellsstrsitter', seconds,1);
        } else {
            setCookie('activespells', spellsstr,1);
            setCookie('spellsstr', seconds,1);
        }

         $("#spellslist").remove();
        
        spellgrid = '<table id=spellslist><tr>\n';
        a = 1;
        $("#id_self_spell > optgroup > option").each(function(i, obj) {
            //console.log(obj.text + ' ' + $(obj).val());
            spellname = obj.text;
            spellrunes = spellname.match(/([\d\s\w-']+) \((.+?)\)/)[2];
            spellname = spellname.match(/([\d\s\w-']+) \((.+?)\)/)[1];
            spellmatch =  spellname + '\(.*\)';
            spellmatch =  spellname + ' \\((\[\\d\\s\\w\]+)\\)';
            
            spellmatch =  spellname + ' \\(\(.*\)\\)';
            spellmatch =  '(<font color=[^>]+>'+spellname + '</font> \\(.+?\\))';
            spellmatch = spellsstr.match(spellmatch);
            
            if (spellmatch) { spellmatch = spellmatch[1]; } else { spellmatch = spellname ; }
            spellgrid = spellgrid + '<td>' + spellmatch  + '<br><span class=castspell value="'+$(obj).val()+'" style="cursor: pointer; cursor: hand;"> Cast:' + spellrunes + '</span></td>\n';
            if ( ( (a) % 3 ) === 0) spellgrid =  spellgrid + "\n</tr><tr>\n";
            a = a+1;
        });
        spellgrid =  spellgrid + "\n</tr></table>\n";
        $('input[type="submit"][value="Cast Spell"]').after(spellgrid);
        $(".castspell").click(function () {
            $('select[name="self_spell"] option[value="' + $(this).attr('value') + '"]').prop('selected', true);
            var spell = $('#id_self_spell option:selected').text();
            $("div #uniform-id_self_spell span").html(spell);
            $("#id_self_spell").closest("form").submit();
        });
    }
        
	// $("#spellslist").hide().fadeIn();
 //    var seconds = new Date().getTime();
 //    spellsstrseconds = getCookie('spellsstr');
 //    if (sitting) spellsstrseconds = getCookie('spellsstrsitter');
 //    //console.log('Plore check '+(seconds-ploreseconds)/1000);
 //    if (seconds-spellsstrseconds>(2*60*1000) || getCookie("lastgoodop")>spellsstrseconds || getCookie("lastgoodop")>spellsstrseconds || lastgoodop>spellsstrseconds) { //2min
 //        url_link = "//"+server_domain+"/wol/game/council_spells?mb_bg";
 //        if (sitting) url_link = "//"+server_domain+"/wol/sit/game/council_spells?mb_bg";
 //        //console.log('getting current spells');
 //        console.log("AJAX "+url_link);
 //        $.ajax({
 //            type: "GET",
 //            url: url_link,
 //        }).done(function (html) {
 //            pagehtml = html;
 //            var n = pagehtml.indexOf('<div class="game-content">');
 //            pagehtml = pagehtml.substring(n);
 //            pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
 //            var el = $('<div id=spellpage></div>');
 //            el.html(pagehtml);
 //            var spells = new Array();
 //            el.find('th').each(function (i, obj) {
 //                if (i > 2) {
 //                    color = "";
 //                	if ($(obj).html().indexOf("good")>0) color="#90ee90";
 //                	if ($(obj).html().indexOf("bad")>0) color="red";
 //                    var spell = $(obj).html().replace(/(<([^>]+)>)/ig, "").trim();
 //                	spell = "<font color='"+color+"'>" + spell+"</font>";
 //                    if ( ( (i-3) % 3 ) === 0 && (i-3)!=0) spell = "<br>" + spell;
 //                    spells[i - 3] = spell;
 //                }
 //            });
 //            el.find('td').each(function (i, obj) {
 //                var days = $(obj).html().trim();
 //                if ((days.match("day") && days.length < 8) || days.match("-")) {
 //                	color = '';
 //                	if ((days.match("1 day$") || days.match("-"))) color = "orange";
 //                    spells[(i) / 2] += " (<font color="+color+">" + days + "</font>)";
 //                }
 //            });
 //            spellsstr = spells.toString();

 //            var seconds = new Date().getTime();
 //            if (sitting) {
 //            		setCookie('activespellssitter', spellsstr,1);
 //                    setCookie('spellsstrsitter', seconds,1);
 //            	} else {
 //            		setCookie('activespells', spellsstr,1);
 //                    setCookie('spellsstr', seconds,1);
 //            	}
            
 //            $("#spellslist").remove();
 //            //$("h2:contains('Recent News')").before('<h2 id=spellslist>'+spellsstr+'</h2>');
            
 //            spellgrid = '<table id=spellslist><tr>\n';
 //    		a = 1;
 //    		$("#id_spell > optgroup > option").each(function(i, obj) {
 //    		    //console.log(obj.text + ' ' + $(obj).val());
 //    		    spellname = obj.text;
 //    		    spellrunes = spellname.match(/([\d\s\w-']+) \((.+?)\)/)[2];
 //    		    spellname = spellname.match(/([\d\s\w-']+) \((.+?)\)/)[1];
 //    		    spellmatch =  spellname + '\(.*\)';
 //    		    spellmatch =  spellname + ' \\((\[\\d\\s\\w\]+)\\)';
    		    
 //    		    spellmatch =  spellname + ' \\(\(.*\)\\)';
 //    		    spellmatch =  '(<font color=[^>]+>'+spellname + '</font> \\(.+?\\))';
 //    		    spellmatch = spellsstr.match(spellmatch);
    		    
 //    		    if (spellmatch) { spellmatch = spellmatch[1]; } else { spellmatch = spellname ; }
 //    		    spellgrid = spellgrid + '<td>' + spellmatch  + '<br><span class=castspell value="'+$(obj).val()+'" style="cursor: pointer; cursor: hand;"> Cast:' + spellrunes + '</span></td>\n';
 //    			if ( ( (a) % 3 ) === 0) spellgrid =  spellgrid + "\n</tr><tr>\n";
 //    			a = a+1;
 //    		});
 //    		spellgrid =  spellgrid + "\n</tr></table>\n";
 //            $('input[type="submit"][value="Cast Spell"]').after(spellgrid);
 //    		$(".castspell").click(function () {
 //    			$('select[name="spell"] option[value="' + $(this).attr('value') + '"]').prop('selected', true);
 //    			var spell = $('#id_spell option:selected').text();
 //    			$("div #uniform-id_spell span").html(spell);
 //    	    	$("#id_spell").closest("form").submit();
 //    	    });
            
 //        });

 //    }
    
    if (page.match("(wol|gen)/(sit/)?game/throne") && emptycontent_addons!=1) {
	    attacksstr = '';
	    console.log("Getting extra stuff "+emptycontent_addons);
	    if (getCookie('attacksstr')) {
			attacksstr= (sitting ? decodeURIComponent(getCookie2('attacksstrsitter')) : decodeURIComponent(getCookie2('attacksstr')));
			//console.log(attacksstr);
			
	   }    
	    	// $("h2:contains('Recent News')").before("<br> <p  id=attacksstr>" + attacksstr+ "</p>");


        var seconds = new Date().getTime();
        ploreseconds = getCookie('lastplore');
        if (sitting) ploreseconds = getCookie('lastploresitter');
        //console.log('Plore check '+(seconds-ploreseconds)/1000);
        // if (seconds-ploreseconds>(4*60*60*1000)) 
        // { //once every 4 hours
        //     sotland = parseInt($("th:contains('Land')").parent().find("td:eq(0)").html().replace(/,/g,""));
        //     console.log('Getting plore data '+sotland);
        //     url_link = "//"+server_domain+"/wol/game/explore?mb_bg";
        //     if (sitting) url_link = "//"+server_domain+"/wol/sit/game/explore?mb_bg";
        //         //console.log('getting army status');
        //         console.log("AJAX "+url_link);
        //         $.ajax({
        //             type: "GET",
        //             url: url_link,
        //         }).done(function (html) {
        //             pagehtml = html;
        //             var n = pagehtml.indexOf('<div class="game-content">');
        //             pagehtml = pagehtml.substring(n);
        //             pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
            
        //             var el = $('<div id=milpage></div>');
        //             el.html(pagehtml);
                    
        //             sold = parseInt(el.find("th:contains('Exploration Costs (Soldiers)')").parent().find("td:eq(0)").html().replace(/,/g,""));
        //             gc= parseInt(el.find("th:contains('Exploration Costs (Gold)')").parent().find("td:eq(0)").html().replace(/,/g,""));
        //             currently= el.find("th:contains('Currently Exploring')").parent().find("td:eq(1)").html().replace(/,/g,"");
                    
                            
        //             url_link = "//"+server_domain+"/wol/game/council_history?mb_bg";
        //             if (sitting) url_link = "//"+server_domain+"/wol/sit/game/council_history?mb_bg";
        //             console.log("AJAX "+url_link);
        //                 //console.log('getting army status');
        //                 $.ajax({
        //                     type: "GET",
        //                     url: url_link,
        //                 }).done(function (html) {
        //                     pagehtml = html;
        //                     var n = pagehtml.indexOf('<div class="game-content">');
        //                     pagehtml = pagehtml.substring(n);
        //                     pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
                    
        //                     var el = $('<div id=milpage></div>');
                            
        //                     el.html(pagehtml);
                            
        //                     explored = parseInt(el.find("th:contains('Total Land Explored')").parent().find("td:eq(0)").html().replace(/,/g,""));
        //                     lost= parseInt(el.find("th:contains('Total Land Lost in Combat')").parent().find("td:eq(1)").html().replace(/,/g,""));

        //                     url_link = "//"+server_domain+"/wol/game/council_internal?mb_bg";
        //                     if (sitting) url_link = "//"+server_domain+"/wol/sit/game/council_internal?mb_bg";
        //                     console.log("AJAX "+url_link);
        //                     $.ajax({
        //                                 type: "GET",
        //                                 url: url_link,
        //                             }).done(function (html) {
        //                                 pagehtml = html;
        //                                 var n = pagehtml.indexOf('<div class="game-content">');
        //                                 pagehtml = pagehtml.substring(n);
        //                                 pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
                                
        //                                 var el = $('<div id=milpage></div>');
                                        
        //                                 el.html(pagehtml);
                                        
        //                                 mills = el.find("td:contains('Lower building costs by')").html();
        //                                 // console.log('sold:'+sold+' gc:'+gc);
        //                                 // console.log('explored:'+explored+' lost:'+lost);
        //                                 // console.log('mills:'+mills);

        //                                 $.ajax({
        //                                                 type: "POST",
        //                                                 url: sendUrlBase2,
        //                                                 data: "url=" + escape("//"+server_domain+"/wol/game/explore") + "&version=" + version + "&data=lala&sotland="+sotland+"&currently="+currently+"&mills="+escape(mills)+"&sold=" + sold+ "&gc=" + gc+ "&explored=" + explored+ "&lost=" + lost + "&token=" + token + "&prov=" + (sitting ? escape(getCookie("sitname_"+game_server)) : escape(getCookie("provname_"+game_server))) + "&page=explore&sitter=" + sitting + "&realprov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
        //                                             }).done(function (html2) {
        //                                                         console.log(html2);
        //                                                         console.log('Sent plore data ');
        //                                                          if (!sitting) setCookie('lastplore', seconds,1);
        //                                                          if (sitting) setCookie('lastploresitter', seconds,1);
        //                                                 });
        //                             });
        //                 });

        //         });
        // }
	    
	    url_link = "//"+server_domain+"/"+game_server+"/game/province_news";
	    if (sitting) url_link = "//"+server_domain+"/"+game_server+"/sit/game/province_news";
        console.log("AJAX "+url_link);

		    //console.log('getting news, last yday was'+getCookie('lastydaynews'));
		    //if (sitting) console.log('getting news, last yday sitter was'+getCookie('lastydaynewssitter'));
		    $.ajax({
		        type: "GET",
		        url: url_link,
		    }).done(function (html) {
		        pagehtml = html;
		        var n = pagehtml.indexOf('<div class="game-content">');
		        pagehtml = pagehtml.substring(n);
		        pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");

                 lastydaynews = pagehtml.match(/province_news\/(\d+\/\d)+/g);
                 lastydaynewscheck = (sitting ? getCookie('lastydaynewssitter') : getCookie('lastydaynews'));

                 if (lastydaynews!=lastydaynewscheck) {

	                 //console.log("Last yday3:"+lastydaynews);
	                 if (!sitting) setCookie('lastydaynews', lastydaynews,1);
	                 if (sitting) setCookie('lastydaynewssitter', lastydaynews,1);
	                 url_link = "//"+server_domain+"/"+game_server+"/game/"+lastydaynews;
	    			if (sitting) url_link = "//"+server_domain+"/"+game_server+"/sit/game/"+lastydaynews;
                    console.log("AJAX "+url_link);
	    			 $.ajax({
					        type: "GET",
					        url: url_link,
					    }).done(function (html) {
					        pagehtml = html;
					        var n = pagehtml.indexOf('<div class="game-content">');
					        pagehtml = pagehtml.substring(n);
					        pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
					        $.ajax({
							            type: "POST",
							            url: sendUrlBase2,
							            data: "url=" + escape(url_link) + "&version=" + version + "&data=" + escape(pagehtml) + "&token=" + token + "&prov=" + (sitting ? escape(getCookie("sitname_"+game_server)) : escape(getCookie("provname_"+game_server))) + "&page=newsraw&sitter=" + sitting + "&realprov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie +"&attackinfo=" + attackinfo
							        }).done(function (html2) {
							                    //console.log(html2);
							            });
					        });
		             }
		                
		        $.ajax({
		            type: "POST",
		            url: sendUrlBase2,
		            data: "url=" + escape(url_link) + "&version=" + version + "&data=" + escape(pagehtml) + "&token=" + token + "&prov=" + (sitting ? escape(getCookie("sitname_"+game_server)) : escape(getCookie("provname_"+game_server))) + "&page=newsraw&sitter=" + sitting + "&realprov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie +"&attackinfo=" + attackinfo
		        }).done(function (html2) {
		                    //console.log(html2);
		            });
		    });

	    
	    url_link = "//"+server_domain+"/"+game_server+"/game/council_military";
	    
	    if (sitting) url_link = "//"+server_domain+"/"+game_server+"/sit/game/council_military";
		    console.log('getting army status');
            console.log("AJAX "+url_link);
		    $.ajax({
		        type: "GET",
		        url: url_link,
		    }).done(function (html) {
		        pagehtml = html;
		        var n = pagehtml.indexOf('<div class="game-content">');
		        pagehtml = pagehtml.substring(n);
		        pagehtml = pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
		
		        var el = $('<div id=milpage></div>');
				el.html(pagehtml);
                el.find("form").remove();
                raw_som = el.find(".game-content").html();
		        $.ajax({
		            type: "POST",
		            url: sendUrlBase2,
		            data: "url=" + escape(url_link) + "&version=" + version + "&data=" + escape(raw_som) + "&token=" + token + "&prov=" + (sitting ? escape(getCookie("sitname_"+game_server)) : escape(getCookie("provname_"+game_server))) + "&page=rawsom&sitter=" + sitting + "&realprov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie +"&attackinfo=" + attackinfo
		        }).done(function (html2) {
		                    //console.log(html2);
		                });
				
		        
		        
		        defmod = parseFloat(el.find("th:contains('Defensive Military Effectiveness')").parent().find("td:eq(0)").html().replace("%","")/100);
				defhome= parseInt(el.find("th:contains('Defensive Military Effectiveness')").parent().find("td:eq(1)").html().replace(/,/g,""));
				offhome= parseInt(el.find("th:contains('Offensive Military Effectiveness')").parent().find("td:eq(1)").html().replace(/,/g,""));
                setCookie('defhomestr', defhome,1);
                setCookie('offhomestr', offhome,1);
				//console.log('offhome'+offhome+' defhome:'+defhome);
				if (getCookie('layout_throne')=='1') {
                    $("#defhomestr").remove();
                    $("#offhomestr").remove();
			        $("th:contains('Networth'):eq(0)").nextAll().eq(2).append(" <font color=orange size=1>("+defhome+")</font>");
					$("th:contains('Trade Balance'):eq(0)").nextAll().eq(2).append(" <font color=orange size=1>("+offhome+")</font>");
				}
		        var attacks = new Array();
		        el.find('thead:first').find('th').each(function (i, obj) {
		            if (i > 0) {
		                var attack = $(obj).html().replace(/(<([^>]+)>)/ig, "").trim();
		                if (attack.match("day")) attacks[i - 1] = attack.replace(/\s+/g, ' ').replace(" days left", "hrs");
		            }
		        });
		        attacksstr = attacks.toString();
		        if (sitting) {
		        		setCookie('attacksstrsitter', attacksstr,1);
		        	} else {
		        		setCookie('attacksstr', attacksstr,1);
		        	}
		        $("#attacksstr").html(attacksstr);
		    });
		   }
    }
    

    if (page.match("(wol|gen)/(sit/)?game/world_ranking")) {
        // $.ajax({
        //     type: "POST",
        //     url: "//stable.umunk.net/tf/parse_raw.php",
        //     data: "data=" + escape(getBodyText(window))
        // }).done(function (html) {
        //     //alert(html);
        //     //var newupdate = "<div id=botupdate style='position:absolute;left:50%;margin-left:-60px;margin-top:0px;top:16px; z-index:1;-moz-border-radius: 5px;border-radius: 5px;' class='good message'> " + html + "</div>";
        //     //$("body").append(newupdate);
        //     //$("#botupdate").css("margin-left", -($("#botupdate").width() / 2) - 7);
        //     //console.log(($("#botupdate").width() / 2));
            
        //     $('#botupdate').html(html).hide().fadeIn();

        //     setTimeout(function () {
        //         $('#botupdate').fadeOut();
        //     }, 5000);
        // });

    }

    if (page.match("(wol|gen)/(sit/)?game/kingdom_details")) {
        loc = $(".change-kingdom-heading").find('a').attr('href').match(/kingdom_details\/(\d)+\/(\d)+/g)[0].split('/');
        kd = loc[1];
        island = loc[2];
        //console.log('get'+loc);
        url_link = "//"+server_domain+"/"+game_server+"/game/kingdom_details/"+kd+"/"+island;
        if (latesthtml) {
            console.log("Sending kdpage by saved html");
            pagehtml = latesthtml;
            if (!(pagehtml.match("We have not yet discovered kingdoms on Island #")) && !(pagehtml.match("The kingdom [\d]+:[\d]+ could not be found\!"))) {
                var n = pagehtml.indexOf('<div class="game-content">');
                pagehtml = pagehtml.substring(n);
                pagehtml = escape(pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " "));
                //document.write(pagehtml);
                $.ajax({
                    type: "POST",
                    url: "//intel.utopia-game.com/tf/parse_raw.php",
                    data: "game_server="+game_server+"&data=" + pagehtml
                }).done(function (html) {
                    console.log(html);
                });
            }
        } else {
            // console.log("Getting kd page for TF "+url_link);
            $.ajax({
                type: "GET",
                url: url_link,
            }).done(function (html) {
                pagehtml = html;
                if (!(pagehtml.match("We have not yet discovered kingdoms on Island #")) && !(pagehtml.match("The kingdom [\d]+:[\d]+ could not be found\!"))) {
                    var n = pagehtml.indexOf('<div class="game-content">');
                    pagehtml = pagehtml.substring(n);
                    pagehtml = escape(pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " "));
                    //document.write(pagehtml);
                    $.ajax({
                        type: "POST",
                        url: "//intel.utopia-game.com/tf/parse_raw.php",
                        game_server: game_server,
                        data: "game_server="+game_server+"&data=" + pagehtml
                    }).done(function (html) {
                        console.log(html);
                    });
                }

            });
        }
    }

    // console.log(window.location.hostname);
    if (window.location.hostname=='utopia-game.com' && Math.random()>0.75) {
        console.log("Get TF page?");
        $.ajax({
            type: "GET",
            url: "//intel.utopia-game.com/tf/request.php",
        }).done(function (html) {
            //alert(html);
            if (html) {
                console.log("AJAX tf "+html);
    	        $.ajax({
    	            type: "GET",
    	            url: html+"?mb_tf",
    	        }).done(function (html) {
    	            pagehtml = html;
    	            if (!(pagehtml.match("is abandoned and doomed to lie empty until the end of the age")) && !(pagehtml.match("We have not yet discovered kingdoms on Island #")) && !(pagehtml.match("The kingdom [\d]+:[\d]+ could not be found\!"))) {
    	                var n = pagehtml.indexOf('<div class="game-content">');
    	                pagehtml = pagehtml.substring(n);
    	                pagehtml = escape(pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " "));
    	                //document.write(pagehtml);
    	                $.ajax({
    	                    type: "POST",
    	                    url: "//intel.utopia-game.com/tf/parse_raw.php",
                            game_server: game_server,
    	                    data: "game_server="+game_server+"&data=" + pagehtml
    	                }).done(function (html) {
    	                });
    	            }
    	        });
            }
        });
    }
    
    time_now = new Date().getTime();
    allow_layout_smart = 1;
    // if ( (time_now-time_loaded)<60000*2 ) {
    //     allow_layout_smart = 1;
    // } else if ( (time_now-time_loaded)<60000*7 && isMobile) {
    //     allow_layout_smart = 1;
    // }

    // if ($("#skyscraper-ad").length==0) {
    //     console.log('no ads found, assume paid ad block, allow ajax');
    //     allow_layout_smart = 1;
    // } else {
    //     // console.log('ads found, initate cooldown');
    // }

    // console.log('allow smart? '+allow_layout_smart + ' ' +(time_now-time_loaded));
    if (getCookie("layout_smart")=="1" && allow_layout_smart) {

        if ( (time_now-time_loaded)>10000 && $("#skyscraper-ad").length) { //if not first load
                  
                  try {
                        googletag.pubads().refresh();
                        time_loaded = new Date().getTime();
                        console.log('reloaded ads');
                    }
                    catch(err) {
                        if ($("#skyscraper-ad").length) {
                            console.log('error updating ads'+ err);
                        }
                    }
        } 
        var d = document.location.pathname + document.location.search + document.location.hash;
        ga('send', 'pageview', d);
        ga('send', 'event', 'munkbot', document.location.pathname);

    	
	    $(".game-content a:not(.notlink),.game-header a").click(function(e) {
            if (!$(this).attr('href')) return;
            if ($(this).attr('href').charAt(0)=='#') return;
	    	if (!$(this).attr('href')) return;
	    	if (!e) e = window.event;
	    	if (!e.ctrlKey && !e.metaKey) {
			    	page = "//"+server_domain+"/"+$(this).attr('href');
			    	page = $(this).attr('href');
			    	opennewpage(page);
			    	 return false;
			}
		});
		
		$('.game-content form').not("#id-shop-gift-login-form").not("#monarchy-form").on("submit",function(){
	        var data = $(this).serializeArray();

            if (page.match("(wol|gen)/(sit/)?game/province_operations")) {
                var submit_val = $("input[type=submit][clicked=true]");
                data.push({ name: submit_val.attr("name"), value: submit_val.attr("value") });
            }
            // console.log(data);
	        if (!$(this).attr('action').match("change_kingdom")) page = $(this).attr('action') || page;
	        //page = $(this).attr('action') || page;
			method = $(this).attr('method');
			console.log("FORM page "+page+" from "+$(this).attr('action'));
		    opennewpageFORM(page,data,method,this);
		    return false; // mandatory
		});
		
		
	}
	
    
    if (newmsg) {
                $("#botlinks").append("<br>" + newmsg);
                $("#botlinks").css("margin-left", -($("#botlinks").width() / 2) - 7);
                $('#botlinks').show();
           } else {
           		$('#botlinks').html(ahrefs);
                $("#botlinks").css("margin-left", -($("#botlinks").width() / 2) - 7);
           }
    
    
	
	
	
	
    
    /// END parsePage
    
    
				
				if (sitting) {
					if (getCookie('layout_nav')=='1') {
					//console.log('getting enemy '+pwdcookie);
				    $('a[href$="/'+game_server+'/sit/game/kingdom_details"]:first').parent().after("<div><a id=enemylink href=\"/"+game_server+"/sit/game/kingdom_details\">Enemy</a></div>");	
					if (pwdcookie!='null') {
						//console.log('getting enemy2 '+pwdcookie);

						var seconds = new Date().getTime();
						if (seconds-getCookie('gottenenemy')<(15*60*1000) && getCookie('enemy')) {
							enemy = getCookie('enemy').trim().replace(/%20/g,'');
							//console.log("I have enemy it is " + enemy + " s" + (seconds-getCookie('gottenenemy')))
							$('#enemylink').attr('href',"/"+game_server+"/sit/game/kingdom_details/"+enemy);
						} else {
							console.log('Asking intel for enemy');
				            $.ajax({
						            type: "POST",
						            url: sendUrlBase2,
						            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=.enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
						        }).done(function (html) {
						        	if (html.trim()=="<3") { 
						        		// setCookie('userpwd', '',-1);
							        	} else {			
						    				$('#enemylink').attr('href',"/"+game_server+"/sit/game/kingdom_details/"+html.trim().replace(/%20/g,''));
						    				setCookie('gottenenemy', seconds,1);
                                            enemy = html.trim();
                                            if (!enemy) enemy = '/';
                                            setCookie('enemy', enemy,1);
							        	}
						        	});
					        }
						}				
					    //$('a[href$="/'+game_server+'/sit/game/province_news"]:first').parent().after("<div><a href=\"/"+game_server+"/sit/game/kingdom_news\">KD-News</a></div>");
					    //$('a[href$="/'+game_server+'/game/throne"]:first').parent().after("<div><a href=\"/"+game_server+"/game/council_state\">State</a></div>");
					    $('a[href$="/'+game_server+'/sit/game/throne"]:first').after("<a href=\"/"+game_server+"/sit/game/council_state\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
					    $('a[href$="/'+game_server+'/sit/game/build"]:first').after("<a href=\"/"+game_server+"/sit/game/council_internal\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
					    // $('a[href$="/'+game_server+'/sit/game/science"]:first').after("<a href=\"/"+game_server+"/sit/game/council_learn\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
					    $('a[href$="/'+game_server+'/sit/game/train_army"]:first').after("<a href=\"/"+game_server+"/sit/game/council_military\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
					    $('a[href$="/'+game_server+'/sit/game/enchantment"]:first').after("<a href=\"/"+game_server+"/sit/game/council_spells\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
					    $('a[href$="/'+game_server+'/sit/game/enchantment"]:first').parent().after("<div><a href=\"/"+game_server+"/sit/game/sorcery\">Sorcery</a></div>");
					    $('a[href$="/'+game_server+'/sit/game/monarchy"]:first').parent().after("<div><a href=\"/"+game_server+"/sit/game/nap\">CFs</a></div>");
					    $('a[href$="/'+game_server+'/sit/kingdom_forum/topics/"]:first').parent().after("<div><a id='kdsite' onclick='openkdsite();' target='_blank'>Intel-Site</a></div>");
				    }
			    	
				  	
				} else {
					if (getCookie('layout_nav')=='1') {
					//console.log('getting enemy '+pwdcookie);		
					$('a[href$="/'+game_server+'/game/kingdom_details"]:first').parent().after("<div><a id=enemylink href=\"/"+game_server+"/game/kingdom_details\">Enemy</a></div>");		
					if (pwdcookie!='null') {
						//console.log('getting enemy2 '+pwdcookie);

						var seconds = new Date().getTime();
						if (seconds-getCookie('gottenenemy')<(15*60*1000) && getCookie('enemy')) {
							enemy = getCookie('enemy').trim().replace(/%20/g,'');
							//console.log("I have enemy it is " + enemy + " s" + (seconds-getCookie('gottenenemy')))
							$('#enemylink').attr('href',"/"+game_server+"/game/kingdom_details/"+enemy);
						} else {
							console.log('Asking intel for enemy');
				            $.ajax({
						            type: "POST",
						            url: sendUrlBase2,
						            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=.enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
						        }).done(function (html) {
						        	if (html.trim()=="<3") { 
						        		// setCookie('userpwd', '',-1);
							        	} else {			
						    				$('#enemylink').attr('href',"/"+game_server+"/game/kingdom_details/"+html.trim().replace(/%20/g,''));
						    				setCookie('gottenenemy', seconds,1);
                                            enemy = html.trim();
                                            if (!enemy) enemy = '/';
						    				setCookie('enemy', enemy,1);
							        	}
						        	});
					        }
						}					
				    //$('a[href$="/'+game_server+'/sit/province_news"]:first').parent().after("<div><a href=\"/"+game_server+"/game/kingdom_news\">KD-News</a></div>");
				    //$('a[href$="/'+game_server+'/sit/throne"]:first').parent().after("<div><a href=\"/"+game_server+"/game/council_state\">State</a></div>");
				    $('a[href$="/'+game_server+'/game/throne"]:first').after("<a href=\"/"+game_server+"/game/council_state\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
				    $('a[href$="/'+game_server+'/game/build"]:first').after("<a href=\"/"+game_server+"/game/council_internal\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
				    // $('a[href$="/'+game_server+'/game/science"]:first').after("<a href=\"/"+game_server+"/game/council_learn\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
				    $('a[href$="/'+game_server+'/game/train_army"]:first').after("<a href=\"/"+game_server+"/game/council_military\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
				    $('a[href$="/'+game_server+'/game/enchantment"]:first').after("<a href=\"/"+game_server+"/game/council_spells\"><img style='vertical-align:middle' height=20 src=//intel.utopia-game.com/img/advisor.png></a>");
				    $('a[href$="/'+game_server+'/game/enchantment"]:first').parent().after("<div><a href=\"/"+game_server+"/game/sorcery\">Sorcery</a></div>");
				    $('a[href$="/'+game_server+'/game/monarchy"]:first').parent().after("<div><a href=\"/"+game_server+"/game/nap\">CFs</a></div>");
                    $('a[href$="/'+game_server+'/kingdom_forum/topics/"]:first').parent().after("<div><a id='kdsite' onclick='openkdsite();' href='#' target='_blank'>Intel-Site</a></div>");
			    }
		    	
			   } 
			   
			   if (decodeURIComponent(getCookie("aidsamount"))!='(0)') {
				   $('a[href$="/'+game_server+'/game/aid"]:first').parent().append(" <font color=red id=aidnum>"+decodeURIComponent(getCookie("aidsamount"))+"</font>");
				   $('a[href$="/'+game_server+'/sit/game/aid"]:first').parent().append(" <font color=red id=aidnum>"+decodeURIComponent(getCookie("aidsamount"))+"</font>");
			   } 
			   var donate = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">' +
								 '<input type="hidden" name="cmd" value="_s-xclick">' +
								 '<input type="hidden" name="hosted_button_id" value="SKJ8GSAPZS6Q2">' +
                                 '<input type="hidden" name="lc" value="US">' +
                                 '<input type="hidden" name="amount" value="50">' +
								 '<input type="image" src="https://www.paypal.com/en_us/i/btn/x-click-but04.gif" border="0" width="62" name="submit" alt="PayPal - The safer, easier way to pay online!">' +
								 '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">' +
								 '</form>' +
								 '<input type="image" width="62" src="https://www.paypal.com/en_us/i/btn/x-click-but04.gif" onclick="showbitcoin();" border="0"><br>'+
								 ''; 
								 
			  var donate = '<input type="image" width="68" src="//umunk.net/img/donate2.png" onclick="showbitcoin();" border="0"><br>';
				
			
			    var now = new Date();
				var lastdonate2 = Math.floor(Math.abs((now.getTime() - lastdonate.getTime())/(24*60*60*1000)));
				var donatecolor = 'blue';
				if (lastdonate2<10) donatecolor = 'green';	
				if (lastdonate2>19) donatecolor = 'red';
                donate = '';
				$('a[href$="/'+game_server+'/game/preferences/"]:first').parent().parent().append("<div><input class=munkbutton type=button id=toggler2 value='Bot prefs'><br><input class=munkbutton type=button id=getbot value='bot'>|<input class=munkbutton type=button id=openirc value='IRC'></div><div id=prefs></div>"+donate+"<p id=donatebox style='background:white;color:green'></p>");
	        	$('a[href$="/'+game_server+'/sit/game/preferences/"]:first').parent().parent().append("<div><input class=munkbutton type=button id=toggler2 value='Bot prefs'><br><input class=munkbutton type=button id=getbot value='bot'>|<input type=button class=munkbutton id=openirc value='IRC'></div><div id=prefs></div>"+donate+"<p id=donatebox  style='background:white;color:green'></p>");
	            //var donationping = ''; 
                //var lastdonationping = ''; 

                var now = new Date();
                temp = now.getTime()-lastdonationping;

                //console.log('temp is '+temp);
    //             if (temp>60000 || isNaN(temp)) {
				// $.ajax({
				//             type: "POST",
				//             url: "//admin.umunk.net/ping.php",
				//             data: "kd=" + kddomain
				//         }).done(function (html) {
				//         	//$('#botresponse').html($('#botcommand').val());
				//         	//console.log(html);
    //                         donationping = html;
    //                         var now = new Date();
    //                         lastdonationping = now.getTime();
				//         	// $('#donatebox').html(html);
			 //        	});
    //                 } else {
    //                     //console.log('skipped donation update');
    //                         // $('#donatebox').html(donationping);
    //                 }
					    
			   
    
     $("#getbot").click(function () {
	                $('#overlay').fadeToggle();	                
	     });
	     
	     $("#openirc").click(function () {
	                $('#ircchat').fadeIn();
	                updateirc('');
	                if (typeof irctimer == "number") clearTimeout(irctimer);
					if (typeof irc_idle_timer == "number") clearTimeout(irc_idle_timer);
	                irctimer=setInterval(function() { updateirc(''); }, 15000);   
	        		irc_idle_timer = setTimeout(function() {irctimeout();}, 1000*60*10);         
	       });
	       
			if (typeof irc_idle_timer == "number") clearTimeout(irc_idle_timer);
	        if ($('#ircchat').is(':visible')) irc_idle_timer = setTimeout(function() {irctimeout();}, 1000*60*10); 
    
    $("#toggler2").click(function () {
			    	var prefs = "<hr>Add metrics to throne:<input type='checkbox' class=saveprefs id='layout_throne'><br>Add ospa,dspa,epa etc on throne"+
						"<hr>Navigation links:<input type='checkbox'  class=saveprefs  id='layout_nav'><br>Add State and KD-news to navigation"+
						"<hr>Confirm attacks:<input type='checkbox'  class=saveprefs  id='layout_confirm_attacks'><br>Ask to confirm attacks"+
						"<hr>Show bot:<input type='checkbox'  class=saveprefs  id='layout_bot'><br>Show the bot box in the top"+
						"<hr>Show IRC:<input type='checkbox'  class=saveprefs  id='layout_irc'><br>Show the irc box in the top"+
						// "<hr>Hide utopia ads:<input type='checkbox'  class=saveprefs  id='layout_ads'><br>Consider paying utopia to block ads - <a href='//shop.utopia-game.com/shop/item/AD_BLOCKING_1_WEEK'>click here</a><br>"+
						"<hr>Gains on KDpage:<input type='checkbox'  class=saveprefs  id='layout_kdpage'><br>Show gains on kdpages"+
                        "<hr>Hide KD banner:<input type='checkbox'  class=saveprefs  id='layout_hide_banner'><br>Hide KD banners"+
						"<hr>Auto-sort by land:<input type='checkbox'  class=saveprefs  id='layout_kd_land'><br>Sort the KD by land per default"+
						"<hr>KD@war Red:<input type='checkbox'  class=saveprefs  id='layout_warkd'><br>Give KDs at war red background"+
						"<hr>Color nw-range:<input type='checkbox'  class=saveprefs  id='layout_range'><br>Color provinces in 80-120% nw range on kdpage"+
						"<hr>Ajax navigation:<input type='checkbox'  class=saveprefs  id='layout_smart'><br>Faster and very nice for phone."+
						"<hr>Munk theme:<input type='checkbox'  class=saveprefs  id='layout_munktheme'><br>Munks pretty theme!."+
						"<hr><div id=refreshpage>"+donate+"</div>";
	                $(".game-header").html("<h1>Bot prefs</h1>");
	                $(".game-content").html(prefs);
	                
	                $( ".saveprefs" ).each(function( index ) {
	                	id = $(this).attr('id');
	                	$(this).prop('checked', parseInt(getCookie(id)));
	                	
	                	$(this).click(function(){
	                		id = $(this).attr('id');
			            	setCookie(id, parseInt(getCookie(id))==1 ? 0 : 1,14);
			            	console.log(getCookie(id),id,parseInt(getCookie(id))==1 ? 0 : 1);			            
				            $('#refreshpage').html("Refresh to see");
				        });	                	
					});	                
	           });	
	           
	           $("#game-navigation .navigation a").click(function(e) {
	        	if (getCookie("layout_smart")=="1" && allow_layout_smart) {
	        		
					if (!e) e = window.event;
			    	if (!e.ctrlKey && !e.metaKey) {
					    	page = "//"+server_domain+"/"+$(this).attr('href');
					    	page = $(this).attr('href');
                            if (page!='#') {opennewpage(page);}
					    	 return false;
					}
				}
			});    


		// $(".game-content").append("<button onclick='copyToClipboard()''>Clipboard</button>");

        
        // Catch clicks on shop login links
        $(".shop-login-link").click(function() {
            console.log('SHOP!');
            $("#id-shop-login-form").submit();
        });
        $(".shop-gift-login-link").click(function() {
            console.log('GIFT!');
            $("#id-shop-gift-login-form").submit();
        });
}


    //$(window).load(function () {
        var isInIframe = (window.location != window.parent.location) ? true : false;

        var isEmbed = window != window.parent;
        var className = $('body').attr('class');
        var seconds = new Date().getTime();

        if (isEmbed == false) {
            var update = "<div style='position:absolute;left:50%;margin-left:-100px;margin-top:0px;top:0px;width:200px; z-index:1;height:20;background-color:grey;font-size:10px;text-align: center;cursor:pointer;-moz-border-radius: 5px;border-radius: 5px;' id=toggler >Intel-site <3</div>";
            $("body").append(update);
                        
            
            var ahrefs = "<span onclick='openkdsite();'>KD-site</span>"; //<br><a href=# onclick='updateTF();'>Update TF</a>"; //isMobile 2: "+isMobile
            // var ahrefs = ""; //<br><a href=# onclick='updateTF();'>Update TF</a>"; //isMobile 2: "+isMobile
            var links = "<div id=botlinks style='position:absolute;left:50%;margin-top:0px;top:16px; z-index:1;-moz-border-radius: 5px;border-radius: 5px;' class='good message'> " + ahrefs + "</div>";
            $("body").append(links);
            $("#botlinks").css("margin-left", -($("#botlinks").width() / 2) - 7);
            $('#botlinks').hide();
            $("#toggler").click(function () {
                $("#botlinks").slideToggle();
            });
            var newupdate = "<div id=botupdate style='position:absolute;left:50%;margin-left:-10px;margin-top:0px;top:16px; z-index:1;-moz-border-radius: 5px;border-radius: 5px;' class='"+seconds+" good message'></div>";
            $("body").append(newupdate);
             $('#botupdate').hide();
            
   //          var temp = $('<div id=tempdiv></div>');
			// temp.html(getBodyhtml(window));
            getBodyhtml(window);
            parsePage(page);
   	            
        }
        
	    $(window).on("popstate", function(e) {
	    	if (e.originalEvent.state !== null) {
				//console.log('changed back, loading:'+window.location);
			    opennewpage(location.href,1);
			   }
		});    
	    
	    // irc + command boxes
	    
		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = "#overlay { float:left; margin-top:-10px; margin-left: 2px; margin-right: auto;width:696px; color:#000; background-color: #fff; filter:alpha(opacity=90); -moz-opacity:0.9; -khtml-opacity: 0.9; opacity: 0.9; z-index: 10000;text-align:left }";
		document.body.appendChild(css);
		var css = document.createElement("style");
		css.type = "text/css";	
		css.innerHTML = "#ircchat { width: 100%;padding: 5px;margin-left: 10px;color:#000; background-color: #fff; z-index2: 10000;text-align:left }";
		document.body.appendChild(css);		

 
		$('#middle').before('<div id="ircchat">'+
		    					 '<div id="irccontainer" style="display: table;border:1px solid black;position:relative; width:100%;height:85px;">'+ 
		    					 '<div id="showchat" style="width: 80%;height:85px;overflow:auto;-webkit-overflow-scrolling: touch;resize: vertical;"></div>'+
		    					 '<div id=irconline style="position:absolute;top:0px;left:80%;width:20%;overflow-y:auto;height:100%;"></div></div>'+
		    					 '<br><center>Room: <span class="chat_toogle selected">Chat</span> / <span class="chat_toogle">Events</span> | Text: <input type=text id=ircmsg size=50> <button id=refreshchat>Send</button><button id=resizeirc>Size</button><button id=closeirc>Close</button>'+
		    					 '</div>'); 
		 /*  					 
		$('#header').after('<div id="ircchat">'+
		    					 '<div id="irccontainer" style="display: table;border:1px solid black; width:100%;height:85px;">'+ 
		    					 '<div id="showchat" style="height:85px;overflow:auto;-webkit-overflow-scrolling: touch;"></div>'+
		    					 '</div>'+
		    					 '<br><center>Text: <input type=text id=ircmsg size=50> <button id=refreshchat>Send</button><button id=resizeirc>Size</button><button id=closeirc>Close</button>'+
		    					 '</div>');     					 
		  */   					 
		//$('#ircchat').hide();
		
		$('.chat_toogle').css("cursor","pointer");
        $('.selected').css("font-weight","bold");
        $('.selected').css("text-decoration","underline");
        var chat_room = 'Chat';
        $('.chat_toogle').click(function(){
            $('.selected').css("font-weight","");
            $('.selected').css("text-decoration","");
            $('.chat_toogle').removeClass('selected');
            $(this).addClass('selected');
            $('.selected').css("font-weight","bold");
            $('.selected').css("text-decoration","underline");
            chat_room = $(this).html();
            $('#showchat').scrollTop(0);    
            updateirc('');
        });

		$('.game-header').before('<div id="overlay"> BOT:<input size=30 type=text id=botcommand><button id=getresponse>Send</button><button onclick=\"$(\'#botresponse\').html(\'\');\">Clear</button><button onclick=\"$(\'#overlay\').fadeOut();\">Close</button>Eg. def/sot/som/list<div id=botresponse></div><div id=botload></div></div>');
		
		
	            
	    $("#logout").click(function () {
	    	// setCookie('userpwd', '',-1);
	    	alert('logged out');
	    	pwdcookie = decodeURIComponent(getCookie("userpwd"));
	            });
	    
	    $("#closeirc").click(function () {
	                $('#ircchat').fadeOut();
	                
					//console.log(irctimer);
	                clearInterval(irctimer);	
					//console.log(irctimer);  
	                if (typeof irctimer == "number") { clearTimeout(irctimer); irctimer = null;}
	                if (typeof irc_idle_timer == "number") { clearTimeout(irc_idle_timer); irc_idle_timer = null;}    
					//console.log(irctimer);             
	            });
	            
	     $("#resizeirc").click(function () { 
	     		if ($('#showchat').height()<100) {
	                $('#showchat').css("height", 450);	               
				    $('#showchat').scrollTop($('#showchat')[0].scrollHeight);
	           } else {
	                //$('#ircchat').css("height", 120);
	                $('#showchat').css("height", 85);
				    $('#showchat').scrollTop($('#showchat')[0].scrollHeight);    	
	           }	                
         });
	            	            
	    $('#botcommand').keypress(function(event) {
	        if (event.keyCode == 13) { $("#getresponse").click();  }
    	});
	            
	    $("#getresponse").click(function () {      
	    		//console.log("pwdcookie:"+pwdcookie);
	    		
	    		
    		if (pwdcookie=='null') {	
	    			// $('#botresponse').html('MunkLogin: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');	
		    		// $("#login2bot").click(function () {
		      //           user = $("#botuser").val();
		      //           pwd = $("#botpass").val();
		      //           setCookie('userpwd', user+"|,|"+pwd,14);
		      //           pwdcookie = user+"|,|"+pwd;
		      //           $('#botresponse').html('');
		      //           $.ajax({
					   //          type: "POST",
					   //          url: sendUrlBase2,
					   //          data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					   //      }).done(function (html) {
					   //      	if (html.trim()=="<3") { 
					   //      			setCookie('userpwd', '',-1);
					   //      			 //$('#botresponse').html('Bad Login -- check password?');
					   //      			 $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
						  //       	} else {			
						  //       		 $('#botresponse').html('Successful login');
						  //       		 setTimeout(function () {
							 //                $('#botresponse').html('');
							 //              }, 5000);
						  //       	}
					   //      	});
		      //      });
	    			
            } else {
	    		
				    $('#botload').html('<img src="//intel.utopia-game.com/css/images/load.gif">');
		            $.ajax({
				            type: "POST",
				            url: sendUrlBase2,
				            data: "url=" + escape(document.URL) + "&talk2bot="+encodeURIComponent($('#botcommand').val()) + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
				        }).done(function (html) {
				        	if (html.trim()=="<3") {
							        		// setCookie('userpwd', '',-1);
							        	}
				        	//$('#botresponse').html($('#botcommand').val());
				   	 		$('#botload').html('');
				        	$('#botresponse').append('<hr>'+html);
				        	$('#botresponse').slideDown();
				        	
			        	});
		    		$('#botcommand').val('');
				
				}
			});

		function provnewsasread() {      
	    		//console.log("pwdcookie:"+pwdcookie);
	    		
	    		
    		if (pwdcookie=='null') {	
	    			$('#botresponse').html('MunkLogin: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');	
		    		$("#login2bot").click(function () {
		                user = $("#botuser").val();
		                pwd = $("#botpass").val();
		                setCookie('userpwd', user+"|,|"+pwd,14);
		                pwdcookie = user+"|,|"+pwd;
		                $('#botresponse').html('');
		                $.ajax({
					            type: "POST",
					            url: sendUrlBase2,
					            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					        }).done(function (html) {
					        	if (html.trim()=="<3") { 
					        			// setCookie('userpwd', '',-1);
					        			 //$('#botresponse').html('Bad Login -- check password?');
					        			 $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
						        	} else {			
						        		 $('#botresponse').html('Successful login');
						        		 setTimeout(function () {
							                $('#botresponse').html('');
							              }, 5000);
						        	}
					        	});
		           });
	    			
            } else {
		            $.ajax({
				            type: "POST",
				            url: sendUrlBase2,
				            data: "url=" + escape(document.URL) + "&markred=1&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
				        }).done(function (html) {
				        	if (html.trim()=="<3") {
							        		// setCookie('userpwd', '',-1);
							        	}
				        	$('#showprovorder').append('<hr>MARKED AS READ');
				        	$( "#showprovorder" ).slideToggle();
			        	});
				}
			};
			
			$('#ircmsg').keypress(function(event) {
		        if (event.keyCode == 13) { $("#refreshchat").click();  }
	    	});
			
			$("#refreshchat").click(function () {  
				updateirc($('#ircmsg').val());
				$('#ircmsg').val('');
				//console.log(typeof irctimer);
				if (typeof irctimer != "number") irctimer=setInterval(function() { updateirc(''); }, 15000); 
	    		if (typeof irc_idle_timer != "number") irc_idle_timer = setTimeout(function() {irctimeout();}, 1000*60*10);  
			});
			
			function irctimeout() { 
	    		
	    		
	                if (typeof irctimer == "number") { clearTimeout(irctimer); irctimer = null;}
	                if (typeof irc_idle_timer == "number") { clearTimeout(irc_idle_timer); irc_idle_timer = null;}    
	    		
	    		$('#showchat').html('Due to inactivity, you were logged out of chat. Press buttons below to start again');
	    		
	    		
	    		
			}
				    
	    	function updateirc(msg) { 
	    		
	    		
	    		if (msg.charAt(0)=='.' || msg.charAt(0)=='!') {
	    			$('#overlay').fadeIn();
	    			$('#botcommand').val(msg);
	    			$("#getresponse").click();
	    			return null;
	    		}
	    		
	    		//if (typeof irctimer != "undefined") irctimer=setInterval(function() { updateirc(''); }, 4000);   
	        	//if (typeof irc_idle_timer != "undefined") irc_idle_timer = setTimeout(function() {irctimeout();}, 1000*60*10);  
				
	    		
	    		if (pwdcookie=='null') {
		    			
		    			$('#overlay').show();
		    			$('#botresponse').html('MunkLogin: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
		    			
		                $('#ircchat').fadeOut();
		                if (typeof irctimer != "undefined") clearInterval(irctimer);
		    			
		    		$("#login2bot").click(function () {
		                user = $("#botuser").val();
		                pwd = $("#botpass").val();
		                setCookie('userpwd', user+"|,|"+pwd,14);
		                pwdcookie = user+"|,|"+pwd;
		                $('#botresponse').html('');
		                $.ajax({
					            type: "POST",
					            url: sendUrlBase2,
					            data: "url=" + escape(document.URL) + "&intelline=1&talk2bot=enemy&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie
					        }).done(function (html) {
					        	if (html.trim()=="<3") { 
					        			// setCookie('userpwd', '',-1);
					        			 //$('#botresponse').html('Bad Login -- check password?');
					        			 $('#botresponse').html('ERROR: User: <input name="myPass" id="botuser" type="input" /> Pwd:<input name="myPass" id="botpass" type="password" /><button id=login2bot>login to bot</button>');
						        	} else {			
						        		 $('#botresponse').html('Successful login');
						        		 setTimeout(function () {
							                $('#botresponse').html('');
							              }, 5000);
						        	}
					        	});
		           });
		    			
	            } else {
	            	
	            	if (msg.length>0	) {
	            		if (typeof irc_idle_timer == "number") { clearTimeout(irc_idle_timer); irc_idle_timer = null;}  
	        			if ($('#ircchat').is(':visible')) irc_idle_timer = setTimeout(function() {irctimeout();}, 1000*60*10); 
	            	}
	            	
	    			var d = new Date();
    				var n = d.getTimezoneOffset();
				    //$('#showchat').html('<img src="//stable.umunk.net/css/images/load.gif">');
		            $.ajax({
				            type: "POST",
				            url: sendUrlBase2,
				            data: "url=" + escape(document.URL) + "&chat_room=" + escape(chat_room) + "&ircchat="+encodeURIComponent(msg) + "&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie + "&offset="+n
				        }).done(function (html) {
				        	// if (html.trim()=="<3") {setCookie('userpwd', '',-1); $('#overlay').show();}
				        	//$('#botresponse').html($('#botcommand').val());
				   	 		//$('#showchat').html('');
				   	 		
				   	 		topnow = $('#showchat').scrollTop();
				        	$('#showchat').html(html);
				   	 		$('#showchat').scrollTop(topnow);
				   	 		
				        	//$('#showchat').slideDown();
							//console.log($('#showchat').scrollTop() + $('#showchat').height() + '<-- top height-->' + $('#showchat')[0].scrollHeight);
				        	if($('#showchat').scrollTop() + $('#showchat').height() + 70 > $('#showchat')[0].scrollHeight || $('#showchat').scrollTop()  ==0) {
				        			//console.log('at bottom');
				        		   $('#showchat').scrollTop($('#showchat')[0].scrollHeight);
							   } 
							topnow = $('#showchat').scrollTop();
				   	 		ircnow = html;				        	
			        	});	
			        	
		        	$.ajax({
			            type: "POST",
			            url: sendUrlBase2,
			            data: "url=" + escape(document.URL) + "&talk2bot=.online&prov=" + escape(getCookie("provname_"+game_server)) + "&pwd=" + pwdcookie + "&intelline=1&offset="+n
			        }).done(function (html) {
			        	// if (html.trim()=="<3") {setCookie('userpwd', '',-1); $('#overlay').show();}
			        	html2 = html.replace(/,/g,'<br>');
			        	$('#irconline').html(html2);
			        	//console.log(html2);
			        				        	
		        	});	
		        				
				}
			}
			
			    
	   		if (parseInt(getCookie("layout_bot"))==0) $('#overlay').hide();
			if (parseInt(getCookie("layout_irc"))==0) { $("#ircchat").hide(); } else { $("#openirc").click(); }
		    //$('.game-content').width('100%');
		    //$('#left-column').css( {"margin-left": "auto", "margin-right": "auto", "float": "right", "width": "100%",} );
		    //$('.game-content').width('100%');
		    //console.log($('#middle > div:last-child').html());
	   		//$('#middle').remove();
	   		
	   		// REMOVE LAST AD

	    	if (getCookie('layout_ads')=='1') {
	    		//console.log('ad hi');
	    		$('#left-column div:first').hide();
	    		//<div id="content-area">
	    		$('#content-area').show();
		    	//$('#right-column').remove();
				$('#leaderboard-ad,#skyscraper-ad,#ad-words').remove();
	   			$('#middle > div:last-child').remove();
	   		}


function changeview(layout) {
	
	loc = $('.tablesorter').find('a').attr('href').match(/province_operations\/(\d)+\/(\d)+/g)[0].split('/');
	kd = loc[1];
	island = loc[2];
	
	if (layout=='Original') {
		if ($(".tablesorter2").length) {
			$(".tablesorter2").remove();
			$(".tablesorter").show();
		}
			
	} else {
	sendUrlBase3 ="//intel.utopia-game.com/parse/parse.php";
	//$('.tablesorter').replaceWith(layout);
	//console.log('pwd is:'+pwdcookie);
		$.ajax({
	            type: "POST",
	            url: sendUrlBase3,
	            data: "url=2&type="+layout+"&kd=Search:"+kd+":"+island+"&intelline=1&json=intelline&pwd=" + pwdcookie,
			    dataType: 'json',
			    error: function(jqXHR, textStatus, errorThrown,data) { 
					//$('.tablesorter').html('Failed - empty result?');
			    },
	        }).done(function (data) {
	        	//$('#intel'+i).html(html);
	        	headers = data[0];
	          	col = '';
	          	var row = '<div id=newintel  style="overflow-y:scroll;-webkit-overflow-scrolling: touch;"><table class=tablesorter2 width=100%><thead><tr class="header">';
		        for (var i in data[0]) {
		            row += '<th  id="c'+data[0][i]+'" id2="'+data[0][i]+'" id3="'+i+'"></div>' + data[0][i] + '<div class="order-icon"></div></th>';
		        }
		        row += '</tr></thead><tbody>' ;
				//$(".tablesorter > thead > tr").append(row);
		        for (var i in data[1]) {
					row += '<tr  id="' + data[1][i]['name'].raw + '">';
	          		
		            for (var td in data[1][i]) {
		            	//console.log(data[1][i]);
		            	if (data[1][i][td]!=null) {
			            	if (data[1][i][td].pretty!=null) { a = data[1][i][td].pretty; } else { a = '';}
			            	if (data[1][i][td].align!=null) { align = data[1][i][td].align; } else { align = 'center';}
			            	row += '<td align="'+align+'"><span style="display:none;">' + data[1][i][td].raw + '</span>' + a + '</td>';
			            } else {
			            	row += '<td></td>';
			            }
		            }	
			        row += '</tr>';
		        }
		            row += '</thead></table></div>' ;	
					$(".tablesorter").hide();	
					if ($(".tablesorter2").length) $(".tablesorter2").remove();
					$(".tablesorter").after(row);
					
					$(".tablesorter2").tablesorter({ textExtraction: function(node) {return node.childNodes[0].innerHTML; }}); 
					
					$(".tablesorter2 tbody tr:odd").css( "background-color", "#CDCDCD" );
					$(".tablesorter2 tbody tr:even").css( "background-color", "#dddddd" );
					$(".tablesorter2 tbody tr").css( "color", "#000" );
					$(".tablesorter2 tbody tr").css( "font-size", "8pt" );
					$(".tablesorter2 th .order-icon").css( "background-image", "url(./images/order_none.png)" );
					$(".tablesorter2 tr td").css( "white-space", "nowrap" );	//: ;
		        
        	}); 
        	
		
	}
	
	
}

function openkdsite(e) {
    // e.stopPropagation();
    // e.preventDefault();
    var url = "https://intel.utopia-game.com";
    inputs = '<input type="hidden" name="pwd" value="' + pwdcookie + '" />';
    $("body").append('<form  target="_blank" action="'+url+'" method="post" id="kdsitelogin">'+inputs+'</form>');
    $("#kdsitelogin").submit();
};

function showintel(elem,type) {
    console.log('showintel');
    $(".intel").hide();
    $(elem).parent().parent().find("."+type).show();
}

function updateTF() {
    var islands = 20;
    var kingdom_is = 10;
    var islands = 20;
    var kingdom_is = 10;
    var startisland = 1;

    var startisland = prompt("Start Island", startisland);
    var islands = prompt("Last Island", islands);

    $("#botlinks").append("<table width=200 id=tf><tr><th align=center colspan=8>TF Update</th></tr><tr><th>Island | KD:</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>&nbsp;10&nbsp;</th></tr>");
    $("#botlinks").css("margin-left", -($("#botlinks").width() / 2) - 7);
    for (var is = startisland; is <= islands; is++) {
        //document.write("<br>Island:" + is + "<br>");
        $("#tf").append("<tr id=is" + is + "><td align=center>" + is + "</td>");
        for (var kd = 1; kd <= kingdom_is; kd++) {
            $("#is" + is).append("<td id=kd" + kd + is + "></td>");


            url_link = "//"+server_domain+"/"+game_server+"/game/kingdom_details/" + kd + "/" + is;
            console.log("AJAX "+url_link);
            $.ajax({
                type: "GET",
                url: url_link,
            }).done(function (html) {
                pagehtml = html;
                if (!(pagehtml.match("We have not yet discovered kingdoms on Island #")) && !(pagehtml.match("The kingdom [\d]+:[\d]+ could not be found\!"))) {
                    var n = pagehtml.indexOf('<div class="game-content">');
                    pagehtml = pagehtml.substring(n);
                    pagehtml = escape(pagehtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " "));
                    //document.write(pagehtml);
                    $.ajax({
                        type: "POST",
                        url: "//intel.utopia-game.com/tf/parse_raw.php",
                        game_server: game_server,
                        data: "game_server="+game_server+"&data=" + pagehtml
                    }).done(function (html) {
                        //alert(html);
                        resultkd = html.match(/([\d]+):([\d]+)/)[1];
                        resultis = html.match(/([\d]+):([\d]+)/)[2];
                        provs = html.match(/Added ([\d]+) provinces/)[1];
                        $("#kd" + resultkd + resultis).append(provs);

                    });
                }
                //document.write("Success " + kd + is); });
            });
            //document.write(kd + " " + url_link + "<br>");       
        }
        $("#botlinks").append("</tr>");
    }
    $("#botlinks").append("</table>");
    $('#botlinks').show();
}
}