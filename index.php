<?php
	ini_set('session.use_strict_mode', 1);
	ini_set('session.cookie_httponly', 0);
	ini_set('session.cookie_secure', 1);
	ini_set('session.cookie_samesite', 'Strict');
echo "<!DOCTYPE html><html class='perfil_html' lang='en'>
<script>
  function addActive(x) {
    /*a function to classify an item as 'active':*/
    if (!x) return false;
    /*start by removing the 'active' class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class 'autocomplete-active':*/
    x[currentFocus].classList.add('autocomplete-active');
  }
  function removeActive(x) {
    /*a function to remove the 'active' class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
	      x[i].parentNode.removeChild(x[i]);
   	}
    }	
  }
	/*execute a function when someone clicks in the document:*/
	document.addEventListener('click', function (e) {
    		closeAllLists(e.target);
	});
</script>
	<style>
html *
{
   font-family: Gotham;
}	
.scroll-left {
 height: 75%;	
 overflow: hidden;
 position: relative;
}

  #progress_bar {
    margin: 10px 0;
    padding: 3px;
    border: 1px solid #000;
    font-size: 14px;
    clear: both;
    opacity: 0;
    -moz-transition: opacity 1s linear;
    -o-transition: opacity 1s linear;
    -webkit-transition: opacity 1s linear;
  }
  #progress_bar.loading {
    opacity: 1.0;
  }
  #progress_bar .percent {
    background-color: #99ccff;
    height: auto;
    width: 0;
  }

.scroll-left .inner {
 position: absolute;
 width: 50%;
 height: 100%;
 margin: 0;
 line-height: 50px;
 text-align: center;
 /* Starting position */
 -moz-transform:translateX(-100%);
 -webkit-transform:translateX(-100%);	
 transform:translateX(-100%);
 /* Apply animation to this element */	
 -moz-animation: scroll-left 15s linear infinite;
 -webkit-animation: scroll-left 15s linear infinite;
 animation: scroll-left 15s linear infinite;
}

 100% { 
 -moz-transform: translateX(100%); /* Browser bug fix */
 -webkit-transform: translateX(100%); /* Browser bug fix */
 transform: translateX(100%); 
 }
	#upload_bar {
  		width: 10%;
  		height: 30px;
  		background-color: #4CAF50;
  		text-align: center; /* To center it horizontally (if you want) */
  		line-height: 30px; /* To center it vertically */
  		color: white;
	}

		#contact{ 
  -webkit-user-select: none; /* Chrome/Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  width: 300px; 
  height: 30px; 
  line-height: 30px;
  color: white;
  font-weight: 200;
  font-size: 75%;
  text-align: center;
  cursor: pointer;
  border: 1px solid white;
}

#uservid{ 
  position: relative;
}

#uservid_overlay{ 
  position: absolute;
  display: block;
  z-index: 2;
}

#contactForm {
  display: none;
  border-radius: 16px;
  background-color: #8A2BE2;
  padding: 0.1em;
  width: 400px;
  overflow-y: hidden;
  max-height: 400px;
  text-align: center;
  position: fixed;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  z-index: 3;
}

input, textarea { 
  margin-bottom: 10px;
  margin-top: 10px;  
  font-family: inherit; 
  text-transform: inherit; 
  font-size: inherit;
  
  display: block; 
  width: 310px; 
  padding: .4em;
}
textarea { height: 80px; resize: none; }

.formBtn { 
  width: 40px;
  display: inline-block;
  background: teal;
  color: #fff;
  font-weight: 10;
  border: none;
  height: 30px;
  border_radius: 9px;
}    

.switch {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  -webkit-overflow-scrolling: touch;
  //overflow-x: auto;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: -1px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  margin-top: 8px;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
  content:''
}

.slider:after {
  content:'';
  left: 4px;
  bottom: 4px;
  margin-left: -65px;
  margin-top: 8px;  
} 

input:checked + .slider:after {
  content:'';
  margin-top: 8px;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
  content: '';
}

div.scrollmenu {
  background-color: #333;
  overflow: auto;
  white-space: nowrap;
}

div.scrollmenu a {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px;
  text-decoration: none;
}

div.scrollmenu a:hover {
  background-color: #777;
}

.noti {
  flex: 1 1 auto;
  margin: 10px;
  padding: 30px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background: linear-gradient(90deg, var(--c1, #f665bd), var(--c2, #a758f7) 51%, var(--c1, #7606a8)) var(--x, 0)/ 400%;
  color: white;
 /* text-shadow: 0px 0px 10px rgba(0,0,0,0.2);*/
  box-shadow: 0px 1px 3px 3px #e752c2;
  border-radius: 10px;
 }

.noti:hover { --x: 100%; }

.noti-1 {
  --c1: #f6d365;
  --c2: #fda085;
}

.noti-2 {
  --c1: #fbc2eb;
  --c2: #a6c1ee;
}

.noti-3 {
  --c1: #84fab0;
  --c2: #8fd3f4;
}

.noti-4 {
  --c1: #a1c4fd;
  --c2: #c2e9fb;
}

.noti-5 {
  --c1: #ffecd2;
  --c2: #fcb69f;
}
</style>
<head style='background: #8A2BE2'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.3.4/wavesurfer.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.3.4/wavesurfer.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.3.4/plugin/wavesurfer.regions.min.js'></script>
    <link rel='stylesheet' type='text/css' href='vendors/css/normalize.css'>
    <link rel='stylesheet' type='text/css' href='vendors/css/ionicons.min.css'>
    <link rel='stylesheet' type='text/css' href='resources/css/layout.css'>
    <link rel='stylesheet' type='text/css' href='resources/css/style.css'>
    <link rel='stylesheet' href='resources/css/queries.css'>
    <link href='https://fonts.googleapis.com/css?family=Lato:100,300,400,300italic' rel='stylesheet' type='text/css'>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.5.0/nouislider.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.5.0/nouislider.min.css'>
<link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.8.1/css/all.css' integrity='sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf' crossorigin='anonymous'>
 	 <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js'></script>
 	 <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
	 <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.2/umd/popper.min.js'></script>
	 <style type='text/css' media='screen, print'>
		@font-face {font-family: 'Gotham';
    		src: url('https://db.onlinewebfonts.com/t/3a47f5f06b5484abfeee9eac90348a9c.eot'); /* IE9*/
    		src: url('https://db.onlinewebfonts.com/t/3a47f5f06b5484abfeee9eac90348a9c.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    		url('https://db.onlinewebfonts.com/t/3a47f5f06b5484abfeee9eac90348a9c.woff2') format('woff2'), /* chrome firefox */
    		url('https://db.onlinewebfonts.com/t/3a47f5f06b5484abfeee9eac90348a9c.woff') format('woff'), /* chrome firefox */
    		url('https://db.onlinewebfonts.com/t/3a47f5f06b5484abfeee9eac90348a9c.ttf') format('truetype'), /* chrome firefox opera Safari, Android, iOS 4.2+*/
    		url('https://db.onlinewebfonts.com/t/3a47f5f06b5484abfeee9eac90348a9c.svg#Gotham') format('svg'); /* iOS 4.1- */
		}
		@font-face {font-family: 'IXOXQV Gotham-Bold';
    		src: url('https://db.onlinewebfonts.com/t/bccb40f0cd0dc224c4f507aec17396b0.eot'); /* IE9*/
    		src: url('https://db.onlinewebfonts.com/t/bccb40f0cd0dc224c4f507aec17396b0.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    		url('https://db.onlinewebfonts.com/t/bccb40f0cd0dc224c4f507aec17396b0.woff2') format('woff2'), /* chrome firefox */
    		url('https://db.onlinewebfonts.com/t/bccb40f0cd0dc224c4f507aec17396b0.woff') format('woff'), /* chrome firefox */
    		url('https://db.onlinewebfonts.com/t/bccb40f0cd0dc224c4f507aec17396b0.ttf') format('truetype'), /* chrome firefox opera Safari, Android, iOS 4.2+*/
    		url('https://db.onlinewebfonts.com/t/bccb40f0cd0dc224c4f507aec17396b0.svg#IXOXQV Gotham-Bold') format('svg'); /* iOS 4.1- */
		}		
    </style>
	 <link href='https://fonts.cdnfonts.com/css/gotham-black' rel='stylesheet'>	 <link href='https://fonts.cdnfonts.com/css/gotham-black' rel='stylesheet'>
    <title>Cencilio</title>
</head>
	<body class='profile_body' style=background-repeat: no-repeat; background-attachment: fixed; background-size: 100% 100%;'>
		<font color = 'white'>			
		<div class='umenu' style='display:none; justify-content:center;margin-left: -870px;max-width: 500px;margin-top: 16px;'>
			<div id='player'>
				<script>  
					$(function() {
						$('#contact').click(function() {
    						$('#contactForm').fadeToggle();
  	    				});
  					});
  					$(document).mouseup(function (e) {
    					var container = $('#contactForm');
    					if (!container.is(e.target) && container.has(e.target).length === 0) {
        					container.fadeOut();
    					}
  					});	
				</script>  
				<div class= 'vtitle' style='background-color: rgb(138, 82, 231);box-shadow: rgb(138, 82, 231) 0px 2px 8px 5px;position: absolute;z-index: 4;display: block;width: 20%;margin-top: -20px;margin-left: 620px;height: 80px;'>
					<img src='lista.png' style='height: 36px;width: 36px;margin-top: 16px;margin-left: 40px;'>
					<button type='button' id='contact' name='contact' class='contact' style='background: transparent;height: 52px;width: 52px;border-width: 0px;margin-top: 12px;margin-left: 816px;'></button>				
   				<hr style='margin-top: -64px;/* background-color: #ebe6f3; */background-color: #737275f5;border-width: 0px;height: 8px;/* margin-bottom: 3%; */width: 16%;margin-left: 19px;position: absolute;' class='perfil_hr'></hr>
				</div>		
			<div id='contactForm2' name='contactForm2' class='contactForm' style='background-color: #8a52e7; box-shadow: 0px 2px 8px 5px #8a52e7; position: absolute; display: none; z-index: 4;'>
					<span style='max-height: 144px;'>
						Datos cargados exitosamente
					</span>
					<button type='button' id='contact' name='id' class='notifications' style='background: blue;height: 52px;width: 52px;border-width: 0px;margin-top: 11px;margin-left: 16px;'>
						<img src='close.png'>
						</img>
					</button>
					<hr style='max-height: 144px;'></hr>
					<div id='sheets_span' style='max-height: 144px;'>
						<span style='max-height: 144px;'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</span>
						<button type='button' id='contact' name='id' class='notifications' style='background: blue;height: 52px;width: 52px;border-width: 0px;margin-top: 11px;margin-left: 16px;'>
							ACEPTAR
						</button>
					</div>
				</div>
			</div>
		</div>	
		<div class='umenu_videos' style='/* display:flex; */justify-content:center;margin-left: 0px;width: 273px;margin-top: 8px;height: 42px;background-color: #b05cc5b8;border-radius: 4px;margin-left: 8px;box-shadow: rgb(231 82 220 / 44%) 0px 2px 8px 5px;'>
			<label style='background: transparent;height: 240px;width: 208px;border-width: 0px;margin-top: 10px;margin-left: 56px;'>
				Raw response header
			</label>
			<hr></hr>
			<label id='js_data' style='background: #00000070;height: 226px;width: 270px;border-width: 0px;margin-top: -247px;position: absolute;border-radius: 8px;margin-left: 2px;font-size: 12px;padding: 38px;'>
			</label>
		</div> 			
		<div class='progress_bar' id='progress_bar' name='progress_bar' style='display: block;margin-top: 60px;background-color: rgb(142, 53, 53);height: 40px;width: 400px;margin-left: 483px;border-radius: 12px;position: absolute;'>
			<label class='pmsg' id='pmsg' name='pmsg' style='font-size: 18px;margin-left: 24px;margin-top: 4px;'>
				Uploading
			</label>
			<div class='percent' id='percent' name='percent' style='font-size: 20px;margin-left: 160px;margin-top: -32px;width: 55%;border-radius: 4px;height: 80%;'>
				<label id='p%' name='p%' class='p%' style='width: 100%;margin-left: 16px;'>
					0%
				</label>	
			</div>
		</div> 
		<script src='https://oss.sheetjs.com/sheetjs/shim.js'></script>
		<script src='https://oss.sheetjs.com/sheetjs/xlsx.full.min.js'></script>
		<div id='cencilio-importer'></div>
		<script type='module' src='http://localhost:1989/cencilio.js'>
		</script>
		<script>		
  				//import { renderWidget } from 'http://localhost:1989/cencilio.js';
  				var options = {
    				apiKey: '6c6fc060b8be905fbf81537fe19b161c',
    				fields:[
            		{ label: 'Activos', key: 'acciones',
              			validators:[
                			{
                  			validate: 'required',
                  			error: 'El valor de los activos no puede quedar vacío'
                			}
              			]},
            		{ label: 'Nombre de accionista', key: 'accionista' ,
              			validators:[
                			{
                  			validate: 'unique',
                  			error: 'El nombre no puede pertenecer a otro que produce activos'
                			}
              			]},
            		{ label: 'Edad', key: 'edad' },
            		{ label: 'Profesion', key: 'profesion',
              			validators:[
                			{
                  			validate: 'regex_match',
                  			regex: '^\\d{1,10}$',
                  			error: 'La profesion no se ejerce para producir los activos'
                			}
              			]},
            		{ label: 'Carrera universitaria', key: 'carrera' },
          		],
    				theme: {
        				global: {
              			backgroundColor: '#212327',
              			textColor: '#c2c3c3',
              			primaryTextColor: '#c2c3c3',
              			primaryButtonColor: '#c2c3c3',
              			errorColor: '#c2c3c3'
            		}
    				},          		
    				height: 200,
    				width: 300,
  				};
		</script>
	</body>
</html>";
?>
