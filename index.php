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

#uservid{ 
  position: relative;
}

#uservid_overlay{ 
  position: absolute;
  display: block;
  z-index: 2;
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
		<script src='https://oss.sheetjs.com/sheetjs/shim.js'></script>
		<script src='https://oss.sheetjs.com/sheetjs/xlsx.full.min.js'></script>
		<script src='https://raw.githubusercontent.com/nodejs/node/0e03c449e35e4951e9e9c962ff279ec271e62010/lib/fs.js'></script>
		<div id='cencilio-importer'></div>
		<script type='module' src='http://localhost:1989/cencilio.js'>
		</script>
		<script>	
				//* Dev example	
  				//var options = {
    			//	apiKey: '6c6fc060b8be905fbf81537fe19b161c',
    			//	fields:[
            //		{ label: 'Activos', key: 'acciones',
            //  			validators:[
            //    			{
            //      			validate: 'required',
            //      			error: 'Error de valor: el valor de los activos no puede quedar vacío'
            //    			}
            //  			]},
            //		{ label: 'Nombre de accionista', key: 'accionista' ,
            //  			validators:[
            //    			{
            //      			validate: 'unique',
            //      			error: 'Error de tipo: el nombre no puede pertenecer a otro que produce activos'
            //    			}
            //  			]},
            //		{ label: 'Edad', key: 'edad' },
            //		{ label: 'Profesion', key: 'profesion',
            //  			validators:[
            //    			{
            //      			validate: 'regex_match',
            //      			regex: '^\\d{1,10}$',
            //      			error: 'Error de correspondencia: la profesion no se ejerce para producir los activos'
            //    			}
            //  			]},
            //		{ label: 'Carrera universitaria', key: 'carrera' },
          	//	],
    			//	theme: {
        		//		global: {
            //  			backgroundColor: '#B4B2B7',
            //  			textColor: '#6500d3d1',
            //  			primaryTextColor: '#9400d3',
            //  			primaryButtonColor: '#0000ff',
            //  			errorColor: '#ff0000'
            //		}
    			//	},          		
    			//	height: 200,
    			//	width: 300,
  				//};
  				var options = {
  					//apiKey: '0303456',
    				apiKey: '1625962363888x457774068936559500',
    				userId: 'miusuari',
    				fields:[
            		{ label: 'Fecha de orden', key: 'fecha',
            		   validators:[
                			{
                  			validate: 'required',
                  			error: 'Error de valor: la fecha no puede ser desconocida'
                			}
              			]                    		
            		},
            		{ label: 'Region', key: 'region',
              			//validators:[
                		//	{
                  	//		validate: 'unique',
                  	//		error: 'Error de destino unico.'
                		//	}
              			//]               		
            		},
            		{ label: 'Representa', key: 'rep',
              			//validators:[
                		//	{
                  	//		validate: 'unique',
                  	//		error: 'Error de correspondencia: no puede haber igual'
                		//	}
              			//]            		
            		},
            		{ label: 'Item', key: 'item' },
            		{ label: 'Unidades', key: 'unidades'},
            		{ label: 'Costo de unidades', key: 'unit_cost',
              			//validators:[
              			//	{
                  	//		validate: 'required',
                  	//		error: 'Falta informacion: no puede faltar el costo de unidad.'
                		//	}
              			//]
              			validators:[
              				{
                  			validate: 'unique',
                  			error: 'Error de correspondencia: esta columna no guarda precios fijos.'
                			}
              			]
              			//validators:[
              			//	{
                  	//		validate: 'regex_match',
                  	//		regex: '^\d+(\.\d+)?$',
                  	//		error: 'Error de sintaxis: el costo no se expresa en numeros.'
                		//	}
              			//]
              		},
            		{ label: 'Costo', key: 'cost',
              			validators:[
              				{
                  			validate: 'regex_match',
                  			regex: '(.*)USD(.*)',
                  			error: 'Error de sintaxis: el costo no se expresa como precio.'
                			}
              			]
              			//validators:[
                		//	{
                  	//		validate: 'required',
                  	//		error: 'Error de costo total: el valor esta ausente'
                		//	}
              			//]   
              		},
            		//{ label: 'Codigo postal', key: 'postal'},            		
            		//{ label: 'Numero de rastreo', key: 'rastreo'},
            		//{ label: 'Lugar de envio', key: 'lugar'},
            		//{ label: 'Vista de bulto', key: 'bulto_view'},
            		//{ label: 'Edad de emisorx', key: 'edad' },
            		//{ label: 'Altura de bulto (pies)', key: 'pieshpi',
              		//	validators:[
                	//		{
                  //			validate: 'regex_match',
                  //			regex: '^\d+(\.\d+)?$',
                  //			error: 'Error de sintaxis: el valor debe estar en pies.'
                	//		}
              		//	]
              		//},
            		//{ label: 'Altura de bulto (en pulgadas)', key: 'pieshpu'},
            		//{ label: 'BMI', key: 'imc' },
          		],
    				//theme: {
        			//	global: {
              	//		backgroundColor: '#B4B2B7',
              	//		primaryTextColor: '#ffffffff',
              	//		primaryButtonColor: '#d6d6e029',
              	//		errorColor: '#ff0000'
            	//	}
    				//},          		
    				height: 200,
    				width: 300,
    				//timestamps: [0],
    				//timestamps: [1],
  				};
		</script>
	</body>
</html>";
?>
