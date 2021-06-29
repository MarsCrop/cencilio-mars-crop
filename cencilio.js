document.body.innerHTML+='<script type="text/javascript" src="https://unpkg.com/xlsx@0.17.0/dist/xlsx.full.min.js"></script><script lang="javascript" src="https://unpkg.com/xlsx@0.17.0/dist/xlsx.js"></script><script lang="javascript" src="https://unpkg.com/xlsx@0.17.0/dist/xlsx.min.js"></script>';

class DOMNodeFactors {
  constructor(critical, label, key) {
    this.childs = [];
    this.critical = critical; //true, false
    this.error = '';
    this.re = false;
    this.label = label;
    this.key = key;
  }
}

class ElReqs {
  constructor() {
    this.required = false;
    this.unique = false;
    this.error = false;
    this.regex = false;
  }
}

function invalidUnknown() {
  	//Message to show if value is not in database
  	return 1;
}

function validate_api(api_key, user_id){
	if (typeof api_key === 'undefined'){
		return 'validationError';
	}
	else if (api_key === ''){
		return 'validationError';	
	}
	else if (typeof user_id === 'undefined'){
		user_id = '';	
	}
	else if (user_id === ''){
		user_id = '';	
	}
   var xhr = new XMLHttpRequest();
   xhr.open('GET', 'workers/api/php/verify_token.php?key='+api_key+'&user_id='+user_id, true);
   xhr.responseType = "json";   	
   xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
   xhr.onload = function (data) {
		if (data.currentTarget.response !== null) {
			if (data.currentTarget.response.results[0].answer !== 'OK') {
				return 1;				
			}			
			else {
				return 'validationError';				
			}
		}		
  	};
   xhr.send();
}

function errorCell(idx) {
	/*Función que coloriza en rojo una celda
	con placeholder de required inválido*/
  	idx.style.backgroundColor = 'red';
  	idx.parent.name = 'errorRow';
}

function renderDOM(instance,theme,h,w){
	//Función que renderiza el tema personalizado
	try{
 		document.body.style.background = theme['backgroundColor'];
 		document.body.style.color = theme['textColor'];
 	}
 	catch (error){
 	}
 	let children = document.getElementsByTagName('button');
 	document.getElementById('cencilio-importer').style.height = String(h)+'px';
 	document.getElementById('cencilio-importer').style.width = String(w)+'px';
 	try{
 	}
 	catch (error){
 		document.body.style.fontFamily = theme['fontFamily'];
 	}
 	try{
 		for (var j = 0; j < children.length; j++) {
 			let isPrimary = instance.body !== children[j] && document.body.contains(children[j]);
 			if (isPrimary === true){
				children[j].style.color = theme['primaryTextColor'];	 	
 			}
 			let grandChildren = children.childNodes();
 			for (var n = 0; n < grandChildren.length; n++) {
	 			grandChildren[n].style.color = theme['secondaryTextColor'];
 			}
 		}
	}
	catch (error){
	} 	
}

function readFields(fields){
	//Usando los campos del objeto en JSON
	//devuelve un objeto que contiene la
	//representación de esos datos en el DOM
	if (typeof fields !== 'object'){
		return 'validationError';
	}
	if (fields['userId'] !== ''){
		verify_user = validate_api(fields['apiKey'], fields['userId']);
	}
	else{
		verify_user = validate_api(fields['apiKey'], '');	
	}
	if (this.verify_user !== 1){
		invalidUnknown(); //validationError
		return 1;
	}
	dom_factor = [];
	for (var j = 0; j < fields.length; j++) {
		if (typeof fields[j]['validators'] !== 'undefined'){
			validators = new ElReqs();
			fields[j]['validators'].forEach((key, index) => {
				if (fields[j]['validators'][key] === 'required'){
					validators.required = true;				
				}
				else if (fields[j]['validators'][key] === 'unique'){
					validators.unique = true;				
				}
				else if (fields[j]['validators'][key] === 'error'){
					validators.error = true;				
				}
				else if (key === 'regex'){
					validators.regex = true;				
				}
			});
		}
		if (validators.required === true){
			dom_node_data = new DOMNodeFactors(true, fields[j]['label'], fields[j]['key']);
		}
		else{
			dom_node_data = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);		
		}
		if (fields[j]['validators'].keys().includes('error')){
	   	dom_node_data.error = fields[j]['validators']['error'];
   	}
		else if (validators.regex === true){
		   dom_node_data.re = fields[j]['validators']['regex'];
   	}
		else if (dom_node_data){
		   dom_node_data.label = fields[j]['label'];
   	}
		else if (dom_node_data){
		   dom_node_data.key = fields[j]['key'];
   	}
		dom_factor.push([]);
		dom_factor[j].push(dom_node_data);
	}
   return dom_factor; //object to render
}

function renderFun(file, config){
	/*Función que toma la configuración del módulo como argumento
	y el nombre de archivo cargado mediante drag and drop para renderizar el documento.
	*/
	let dom_factor = readFields(config); //LEE options
	//console.info(document.getElementById('profpic'));
	try{
		//console.info(document.getElementById('pIn'));
	  	var reader = new FileReader();
	  	let next_col = false;
	  	let labeled_data = [];
	  	reader.onloadend = function(e) {
     		// Ensure that the progress bar displays 100% at the end.
     		document.getElementById('percent').style.width = '100%';
     		document.getElementById('percent').textContent = '100%';
     		setTimeout("document.getElementById('progress_bar').className='';", 300);
	  		var data = e.target.result;
	  		data = new Uint8Array(data);
	  		//process_wb(XLSX.read(data, {type: 'array'}));
	  		/* read the file */
	  		var workbook = XLSX.read(data, {type: 'array'}); // parse the file
	  		var sheet = workbook.Sheets[workbook.SheetNames[0]]; // get the first worksheet
	  		/* loop through every cell manually */
	  		var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
	  		sheetRows = document.getElementById('sheet_rows');
	  		for(var R = range.s.r; R <= range.e.r; ++R) { //R = row
	      	trDiv = document.createElement('tr');
	      	tdDiv = document.createElement('td');
	      	checkbox = document.createElement('input');
	      	checkbox.type = 'checkbox';
	      	tdDiv.appendChild(checkbox);
	      	trDiv.appendChild(tdDiv);
	      	//valIn = true;
	      	for(var C = range.s.c; C <= range.e.c; ++C) { //C = col
	         	 /* find the cell object */
	          	for (var j = 0; j < dom_factor.length; j++) {
	               var cellref = XLSX.utils.encode_cell({c:C, r:R}); // construct A1 reference for cell
		            if(!sheet[cellref]) continue; // if cell doesn't exist, move on
	   	         var cell = sheet[cellref];
	      	      console.log(cell.v);
	         	   if (dom_factor[C].critical === true){            	
							if (cell.v === ''){
								labeled_data.push([dom_factor[C].key,cell.v]);                  	
      	 	  				textbox = document.createElement('input');
       		  				textbox.type = 'text';
       	  					textbox.placeholder = 'Campo sin completar';
	       	  				errorCell(textbox); //coloriza campo crítico vacío
   	    	  				tdDiv = document.createElement('td');
      	 	  				tdDiv.appendChild(textbox);
       		  				trDiv.appendChild(tdDiv);	
       	  					continue;						
							}
	               }
		            if (dom_factor[C].unique === true){            	
							if (dom_factor[C].childs.includes(cell.v)){
								labeled_data.push([dom_factor[C].key,cell.v]);                  	
       			  			textbox = document.createElement('input');
       	  					textbox.type = 'text';
       	  					textbox.value = 'Error de tipo: el campo es un conjunto único.';
       	  					errorCell(textbox); //coloriza campo contenido duplicado
       	  					tdDiv = document.createElement('td');
       	  					tdDiv.appendChild(textbox);
	       	  				trDiv.appendChild(tdDiv);	
	   	    	  			continue;									
							}
							else{
								dom_factor[C].childs.push(cell.v); //add name to find unique values
							}
         	      }
               	if (dom_factor[C].re !== false){  
               		matching = cell.v.match(dom_factor[C].re);          	
							if (typeof matching !== 'object'){
								labeled_data.push([dom_factor[C].key,cell.v]);                  	
	       	  				textbox = document.createElement('input');
   	    	  				textbox.type = 'text';
      	 	  				textbox.value = 'Error de sintaxis: el valor no cuenta con las marcas de expresión buscadas.';
       		  				errorCell(textbox); //coloriza campo contenido duplicado
       	  					tdDiv = document.createElement('td');
       	  					tdDiv.appendChild(textbox);
       	  					trDiv.appendChild(tdDiv);	
       	  					continue;									
							}
   	            }
						labeled_data.push([dom_factor[C].key,cell.v]);                  	
       		  		textbox = document.createElement('input');
       	  			textbox.type = 'text';
       	  			textbox.value = cell.v;
       	  			tdDiv = document.createElement('td');
	       	  		tdDiv.appendChild(textbox);
	       	  		trDiv.appendChild(tdDiv);
	       		}
         	}	       				
	   	}	
		};		
    	reader.onerror = function (e) {
    		switch(e.target.error.code) {
      		case e.target.error.NOT_FOUND_ERR:
        		console.info('File Not Found!');
        		break;
      		case e.target.error.NOT_READABLE_ERR:
        		console.info('File is not readable');
        		break;
      		case e.target.error.ABORT_ERR:
        		break; // noop
      		default:
        		console.info('An error occurred reading this file.');
    		};    			
    	};
    	reader.onprogress = function (e) {
			if (e.lengthComputable) {
			   var percentLoaded = Math.round((e.loaded / e.total) * 100);
			   // Increase the progress bar length.
			   if (percentLoaded < 100) {
			      document.getElementById('percent').style.width = percentLoaded + '%';
			   	document.getElementById('percent').textContent = percentLoaded + '%';
				}
			}
    	};
    	reader.onabort = function (e) {
      	e.abort();
    	};    		
    	reader.onloadstart = function (e) {
      	document.getElementById('progress_bar').className = 'loading';
    	};    	
	  	reader.readAsDataURL(file);
		return labeled_data;
	}
	catch (error){
		console.info(error);
	}
}

export default class renderWidget {
  constructor(file,config) {
		document.write('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/​libs/xlsx/0.15.6/xlsx.full.min.js"></script>');
		//this.file = document.getElementById('profpic').files[0];
		this.config = config;	
		let profilePic = document.createElement('div');	
		profilePic.className = 'profpic';
		profilePic.id = 'profpic';
		profilePic.style = 'position: relative;margin-left: -1260px;margin-top: -90px;z-index: -1;';
		let profilePicForm = document.createElement('form');	
		profilePicForm.className = 'pimg';
		profilePicForm.id = 'pimg';
		profilePicForm.style = 'visibility: hidden; margin-top: 96px;position: absolute;margin-left: 1714px;background-color: #0000ff08;width: 464px;height: 280px;';
		profilePicForm.enctype = 'multipart/form-data';
		let profilePicInput = document.createElement('input');	
		profilePicInput.type = 'file';
		profilePicInput.id = 'pIn';
		profilePicInput.accept = '.xlsx, .xls, .csv';
		profilePicInput.style='display: none; visibility: hidden; height: 282px;width: 464px;';
		profilePicForm.appendChild(profilePicInput);
		let profilePicInput2 = document.createElement('input');	
		profilePicInput2.type='submit';
		profilePicInput2.name='btnSubmit';
		profilePicInput2.style='visibility: hidden;';
		profilePicInput2.value='Submit';
		profilePicForm.appendChild(profilePicInput2);
		profilePic.appendChild(profilePicForm);
		let profilePicLabel = document.createElement('label');	
		profilePicLabel.innerHTML = 'Arrastra archivos aquí o haz click para cargar';   
		profilePicLabel.class='perfil_label';
		profilePicLabel.style='position: absolute; margin-left: 1760px; margin-top: 160px; width: 342px;';
		let profilePicImg2 = document.createElement('img');	
		profilePicImg2.src = 'icons.png';
		profilePicImg2.style='height: 78px;width: 65px;margin-left: 1891px;margin-top: 210px;position: absolute;';
		profilePic.appendChild(profilePicImg2);
		profilePicInput.addEventListener("dragover", function(event) {
  			event.preventDefault();
		});
		profilePicInput.addEventListener("drop", function(event) {
  			if (ev.dataTransfer.items) {
    			var file = ev.dataTransfer.items[0].getAsFile();
  			} else {
    			var file = ev.dataTransfer.files[0];
  			}			
			renderFun(file,this.config);    		
		});
		let excelButton = document.createElement('button'); 			
		excelButton.id = 'ppbutton'; 		
		profilePicInput.onclick = function () {
  			this.value = null;
		};
		profilePicInput.onchange = function () { 
  			console.info(this.files[0]);
  			//if (e.dataTransfer.items) {
    		//	var file = e.dataTransfer.items[0].getAsFile();
  			//} else {
    		//	var file = e.dataTransfer.files[0];
  			//}			
			renderFun(this.files[0], this.config);
		}; 					
		excelButton.onclick = function (e) { 
			uploadimg();
		}; 				
		excelButton.style = 'width: 465px;height: 282px;margin-top: -40px;position: absolute;opacity: 0.3;border: 2px dashed lightyellow;background: repeating-linear-gradient(90deg, #9c989b, #c7c7c7 51%, #8a00c7) var(--x, 0)/ 400%;margin-left: -388px;'; 	
		profilePic.appendChild(profilePicLabel);
		profilePicLabel.appendChild(excelButton);		
		document.body.appendChild(profilePic);
		renderDOM(document, this.config['theme'], this.config['height'], this.config['width']);
		//document.getElementById('ppbutton').click();
  }

	hideClean() {
  		rows = document.getElementById('sheet_rows').childNodes();
  		for (var j = 0; j < rows.length; j++) {
			if (rows[j].name !== 'errorRow'){
				rows[j].style.display = 'none';		
			}  
  		}
	}

	hideUnedited() {
  		rows = document.getElementById('sheet_rows').childNodes();
  		for (var j = 0; j < rows.length; j++) {
			if (typeof rows[j].edited === 'undefined'){
				rows[j].style.display = 'none';		
			}	  
  		}
	}

	tagEdited(idx) {
  		idx.edited = 1;
	}

	rightCell(idx) {
  		idx.style.backgroundColor = 'green';
  		idx.parent.name = '';
	}

	showClean() {
  		rows = document.getElementById('sheet_rows').childNodes();
  		for (var j = 0; j < rows.length; j++) {
			if (rows[j].style.display === 'none'){
				rows[j].style.display = 'block';		
			}  
  		}
	}

	showUnedited() {
  		rows = document.getElementById('sheet_rows').childNodes();
  		for (var j = 0; j < rows.length; j++) {
			if (typeof rows[j].edited === 'undefined'){
				if (typeof rows[j].style.display === 'undefined'){
					rows[j].style.display = 'block';		
				}
			}  
  		}
	}

	readFields(fields){
		//Usando los campos del objeto en JSON
		//devuelve un objeto que contiene la
		//representación de esos datos en el DOM
		if (typeof fields !== 'object'){
			return 'validationError';
		}
		if (fields['userId'] !== ''){
			this.verify_user = validate_api(fields['apiKey'], fields['userId']);
		}
		else{
			this.verify_user = validate_api(fields['apiKey'], '');	
		}
		if (this.verify_user !== 1){
			this.invalidUnknown(); //validationError
			return 1;
		}
		dom_factor = [];
	   for (var j = 0; j < fields.length; j++) {
			if (typeof fields[j]['validators'] !== 'undefined'){
				validators = new ElReqs();
				fields[j]['validators'].forEach((key, index) => {
					if (fields[j]['validators'][key] === 'required'){
						validators.required = true;				
					}
					else if (fields[j]['validators'][key] === 'unique'){
						validators.unique = true;				
					}
					else if (fields[j]['validators'][key] === 'error'){
						validators.error = true;				
					}
					else if (key === 'regex'){
						validators.regex = true;				
					}
				});
			}
			if (validators.required === true){
				dom_node_data = new DOMNodeFactors(true, fields[j]['label'], this.fields[j]['key']);
			}
			else{
				dom_node_data = new DOMNodeFactors(false, fields[j]['label'], this.fields[j]['key']);		
			}
			if (fields[j]['validators'].keys().includes('error')){
	   		dom_node_data.error = fields[j]['validators']['error'];
   		}
			else if (validators.regex === true){
		    	dom_node_data.re = fields[j]['validators']['regex'];
   		}
			else if (dom_node_data){
		    	dom_node_data.label = fields[j]['label'];
   		}
			else if (dom_node_data){
		    	dom_node_data.key = fields[j]['key'];
   		}
			dom_factor.push([]);
			dom_factor[j].push(dom_node_data);
	   }
   	return dom_factor; //object to render
	}

	//XLSX.writeFile(workbook, fname, write_opts) write file back

	values2JS(data){
		//Completa valores para renderizar en JSON en el documento
   	labeled_data = [];
   	first_idx = 1;
   	first = data[0][0];
   	item = 0;
   	for (var j = 0; j < data.length; j++) {
   		if (first_idx === 1){
   			labeled_data.push({});
   			first_idx = 0;
			}
   		if (j === 0){
   		}
   		else{
   			if (data[j][0] === first){
					first_idx = 1;   		
					item += 1;
   			}
   			else{
					first_idx = 0;   		
   			}
   		}
	   	labeled_data[item][data[j][0]] = data[j][1];
   		if (data[j][0] === first){  		
				item += 1;
   		}
   	}
   	document.getElementById('js_data').innerHTML = JSON.stringify(labeled_data); //copy data to HTML
	}
}
function uploadimg(){
	document.getElementById('pIn').click();
};
let renderer = new renderWidget(document.getElementById('cecilio-importer'), options);		