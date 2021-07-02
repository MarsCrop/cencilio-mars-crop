/*Please notice this module uses SheetJS to process xls and xlsx.
You should include both CDNs (as script or in a different way) https://oss.sheetjs.com/sheetjs/shim.js
and https://oss.sheetjs.com/sheetjs/xlsx.full.min.js before importing this module*/

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
  	idx.parent.name = 'errorRow';
  	if(typeof renderer.errorColor === 'undefined'){
		idx.style.backgroundColor = 'red';
  	}
  	else{
  		idx.style.backgroundColor = idx.style.errorColor;  	
	}
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
 		document.body.style.fontFamily = theme['fontFamily']; 
 	}
 	catch (error){
 	}
 	try{
 		renderer.errorColor = theme['errorColor']; 
 	}
 	catch (error){
 	}
 	try{
 		for (var j = 0; j < children.length; j++) {
 			let isPrimary = instance.body !== children[j] && document.body.contains(children[j]);
 			if (isPrimary === true){
				children[j].style.color = theme['primaryTextColor'];	 	
 			}
 			let grandChildren = children.childNodes;
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
	try{
		if (typeof fields !== 'object'){
			return 'validationError';
		}
		if (fields['userId'] !== ''){
			let verify_user = validate_api(fields['apiKey'], fields['userId']);
		}
		else{
			let verify_user = validate_api(fields['apiKey'], '');	
		}
		if (verify_user !== 1){
			invalidUnknown(); //validationError
			return 1;
		}
	}
	catch (error){
	}
	renderer.dom_factor = [];
	for (var j = 0; j < fields.length; j++) {
		if (typeof fields[j]['validators'] !== 'undefined'){
			let validators = new ElReqs();
			for(var set = 0; set <= fields[j]['validators'].length; ++set){
				try{
					if (typeof fields[j]['validators'][set].validate === 'required'){
						validators.required = true;				
					}
					else if (typeof fields[j]['validators'][set].validate === 'unique'){
						validators.unique = true;				
					}
					else if (typeof fields[j]['validators'][set].validate === 'regex'){
						validators.regex = true;				
					}
					if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
						validators.error = true;				
					}				
					if (validators.required === true){
						let ndata = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);
						if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
		   				ndata.error = fields[j]['validators'][set]['error'];
   					}
						else if (typeof fields[j]['validators'][set]['validate'] === 'regex'){
		   				ndata.re = fields[j]['validators'][set]['regex'];
   					}
					}
					else{
						let ndata = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);
						if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
		   				ndata.error = fields[j]['validators'][set]['error'];
   					}
						else if (typeof fields[j]['validators'][set]['regex'] === 'regex'){
		   				ndata.re = fields[j]['validators'][set]['regex'];
   					}
					}
				   if (typeof ndata !== 'undefined'){
		   			console.info(ndata);
						if (renderer.dom_factor.length < j){
							renderer.dom_factor.push([]);
							renderer.dom_factor[renderer.dom_factor.length-1].push(ndata);
						}  
						else{
							renderer.dom_factor[j].push(ndata); 						
						}
					}
				}
				catch(error){
				}	
   		}		
		}
		else if (typeof fields[j]['validators'] === 'undefined'){
		   let ndata = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);
		   if (typeof ndata !== 'undefined'){
		   	console.info(ndata);
				if (renderer.dom_factor.length < j){
					renderer.dom_factor.push([]);
					renderer.dom_factor[renderer.dom_factor.length-1].push(ndata);
				}  
				else{
					renderer.dom_factor[j].push(ndata); 						
				}
			}	
   	}
   	else{
			let validators = null;   	
   	}
	}
	console.info(renderer.dom_factor);
}

function renderFun(file, config){
	/*Función que toma la configuración del módulo como argumento
	y el nombre de archivo cargado mediante drag and drop para renderizar el documento.
	*/
	//console.info(config);
	//console.info(typeof config);
	renderer.excel_data = [];
	//console.info(document.getElementById('profpic'));
	try{
		//console.info(document.getElementById('pIn'));
	  	var reader = new FileReader();
	  	let next_col = false;
	  	reader.onloadend = function(e) {
     		// Ensure that the progress bar displays 100% at the end.
     		document.getElementById('percent').style.width = '100%';
     		document.getElementById('percent').textContent = '100%';
     		setTimeout("document.getElementById('progress_bar').className='';", 300);
	  		var data = e.target.result;
	  		data = new Uint8Array(data);
	  		//process_wb(XLSX.read(data, {type: 'array'}));
	  		/* read the file */
			//console.info(data);	  		
	  		var workbook = XLSX.read(data, {type: 'array'}); // parse the file
	  		//console.info(range);
	  		let sheetDiv = document.createElement('div');
			sheetDiv.className='sheet_div'; 
			sheetDiv.style='background-color: rgb(180, 178, 183);box-shadow: rgb(210, 191, 241) 0px 2px 8px 5px;position: absolute;z-index: 4;width: 80%;margin-top: -56px;margin-left: 160px;border-radius: 4px;height: 80%;overflow-y: scroll;';
	  		let sheetDivChildDiv = document.createElement('div');
			sheetDivChildDiv.id='header_xlsx';
			sheetDivChildDiv.style='max-height: 144px;';
	  		let sheetDivChildStrong = document.createElement('strong');
			sheetDivChildStrong.style='font-family: "Gotham Black";margin-left: 32px;font-size: 24px;position: absolute;margin-top: 2px;';
			sheetDivChildStrong.innerHTML = 'Nombre de archivo Excel.xlsx';
	  		let sheetDivChildInput = document.createElement('input');
			sheetDivChildInput.id='sheet_select';
			sheetDivChildInput.placeholder='Nombre de hoja'; 
			sheetDivChildInput.style='max-height: 144px;width: 136px;margin-top: 16px;margin-left: 466px;border-radius: 2px;';
			sheetDivChildInput.onchange = function(e){
				let sheet = renderer.loadTable(workbook.SheetNames.indexOf(e.target.value));	
				console.info(sheet);
				document.getElementById('sheet_rows').childNodes[0] = sheet;		
			}
	  		let sheetDivGrandChildDiv = document.createElement('div');
			sheetDivGrandChildDiv.id='sheets_span';
			sheetDivGrandChildDiv.placeholder='Nombre de hoja'; 
			sheetDivGrandChildDiv.style='max-height: 144px;';
	  		let sheetDivGrandChildSpan = document.createElement('span');
			sheetDivGrandChildSpan.style='max-height: 144px;margin-left: 32px;';
			sheetDivGrandChildSpan.innerHTML='Total:';
	  		let sheetDivGrandChildLabel = document.createElement('label');
			sheetDivGrandChildLabel.style='max-height: 144px;';
			sheetDivGrandChildLabel.id='total_sheets';
			sheetDivGrandChildLabel.innerHTML = '0';
	  		let sheetDivGrandChildSpan2 = document.createElement('span');
			sheetDivGrandChildSpan2.style='max-height: 144px;';
			sheetDivGrandChildSpan2.innerHTML = '| Con errores:'; 
	  		let sheetDivGrandChildLabel2 = document.createElement('label');
			sheetDivGrandChildLabel2.style='max-height: 144px;';
			sheetDivGrandChildLabel2.id='total_sheets'; 
			sheetDivGrandChildLabel2.innerHTML = '0';
	  		let sheetDivGrandChildButton = document.createElement('button');
			sheetDivGrandChildButton.style='max-height: 144px;';
			sheetDivGrandChildButton.id='contact'; 
			sheetDivGrandChildButton.type = 'button';
			sheetDivGrandChildButton.onclick = function(e){
				document.getElementById('js_data').innerHTML = JSON.parse(JSON.stringify(renderer.excel_data)); //copy data to HTML			
			}
			sheetDivGrandChildButton.name='id';
			sheetDivGrandChildButton.class='notifications'; 
			sheetDivGrandChildButton.style='background: blue;height: 36px;width: 122px;border-width: 0px;margin-left: 720px;border-radius: 16px;padding: 8px;margin-top: -33px;position: absolute;';
			let sheetDivGrandChildButtonChild = document.createElement('img'); 
			sheetDivGrandChildButtonChild.src='https://assets.cencilio.com/info.png'; 
			sheetDivGrandChildButtonChild.style='height: 16px;width: 16px;margin-left: -76px;margin-top: -10px;';
			let sheetDivGrandChildButtonLabel = document.createElement('label');  
			sheetDivGrandChildButtonLabel.style='height: 26px;margin-top: -4px;margin-left: 6px;font-size: 8px;position: absolute;';
			sheetDivGrandChildButtonLabel.innerHTML = 'CARGAR DATOS';
			let sheetDivGrandChildOptions = document.createElement('div');  
			sheetDivGrandChildOptions.style='max-height: 144px;';
			sheetDivGrandChildOptions.id = 'options_xlsx';
			let sheetDivGrandChildOptionsDiv = document.createElement('div');  
			sheetDivGrandChildOptionsDiv.style='max-height: 144px;';
			sheetDivGrandChildOptionsDiv.id = 'sheets_span';
			let sheetDivGrandChildOptionsDivSpan = document.createElement('span');  
			sheetDivGrandChildOptionsDivSpan.style='max-height: 144px;margin-top: 0px;margin-left: -432px;position: absolute;';
			sheetDivGrandChildOptionsDivSpan.innerHTML = 'Instrucciones:'; 
			let sheetDivGrandChildOptionsDivLabel = document.createElement('label');  
			sheetDivGrandChildOptionsDivLabel.style='max-height: 144px;width: 40%;margin-left: -346px;/* position: absolute; */';
			sheetDivGrandChildOptionsDivLabel.id = 'total_sheets'; 
			sheetDivGrandChildOptionsDivLabel.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.';
			let sheetDivGrandChildOptionsDivInput = document.createElement('input');  
			sheetDivGrandChildOptionsDivInput.style='width: 24px;height: 24px;margin-left: 700px;margin-top: -32px;';
			sheetDivGrandChildOptionsDivInput.id = 'show_errors'; 
			sheetDivGrandChildOptionsDivInput.type='checkbox'; 
			let sheetDivGrandChildOptionsDivSpan2 = document.createElement('input');  
			sheetDivGrandChildOptionsDivSpan2.style='max-height: 144px;margin-left: 126px;margin-top: -22px;position: absolute;';
			sheetDivGrandChildOptionsDivSpan2.id = 'total_sheets'; 
			sheetDivGrandChildOptionsDivSpan2.type='checkbox'; 
			sheetDivGrandChildOptionsDivSpan2.innerHTML = 'Mostrar filas con errores';
			let sheetDivGrandChildOptionsDivInput3 = document.createElement('input');  
			sheetDivGrandChildOptionsDivInput3.style='width: 24px;height: 24px;margin-left: 920px;margin-top: -24px;';
			sheetDivGrandChildOptionsDivInput3.id = 'show_edits'; 
			sheetDivGrandChildOptionsDivInput3.type='checkbox'; 
			sheetDivGrandChildOptionsDivInput3.innerHTML = 'Mostrar filas con errores';
			let sheetDivGrandChildOptionsDivSpan3 = document.createElement('input');  
			sheetDivGrandChildOptionsDivSpan3.style='max-height: 144px;margin-left: 344px;margin-top: -22px;position: absolute;';
			sheetDivGrandChildOptionsDivSpan3.id = 'total_sheets'; 
			sheetDivGrandChildOptionsDivSpan3.type='checkbox'; 
			sheetDivGrandChildOptionsDivSpan3.innerHTML = 'Mostrar filas editadas';
			let sheetDivTable = document.createElement('table');  
			let sheetDivHead = document.createElement('thead');  
			let sheetDivSpan = document.createElement('span');  
         sheetDivSpan.innerHTML = 'Filas editadas';
         sheetDivSpan.style = 'margin-top: -140px;position: absolute;margin-left: 32px;font-size: 80%;';
			let sheetDivTableBody = document.createElement('tbody');  
         sheetDivTableBody.id='sheet_rows';
			let sheetDivDtypeRow = document.createElement('tr');  
			sheetDivDtypeRow.style = 'margin-top: 150px;';
			sheetDivTableBody.appendChild(sheetDivDtypeRow);
			let sheetDivCheckInvalid = document.createElement('input');  
			sheetDivCheckInvalid.style='width: 24px;height: 24px;margin-left: 700px;margin-top: -32px;';
			sheetDivCheckInvalid.id = 'show_errors'; 
			sheetDivCheckInvalid.type='checkbox'; 
			sheetDivCheckInvalid.onchange = function(e){
				//console.info(e);
				renderer.checkAll(e);
			}; 
			let sheetDivCheckChanged = document.createElement('input');  
			sheetDivCheckChanged.style='width: 24px;height: 24px;margin-left: 700px;margin-top: -32px;';
			sheetDivCheckChanged.id = 'show_changed'; 
			sheetDivCheckChanged.type='checkbox'; 
			sheetDivCheckChanged.onchange = function(e){
				//console.info(e);
				renderer.checkSize(e);
			}; 
			let sheetDivCheckInvalidLabel = document.createElement('label');  
			sheetDivCheckInvalidLabel.style='max-height: 144px;width: 40%;margin-left: -346px;/* position: absolute; */';
			sheetDivCheckInvalidLabel.id = 'show_errors_label'; 
			sheetDivCheckInvalidLabel.innerHTML = 'Mostrar filas con errores';
			let sheetDivCheckChangedLabel = document.createElement('label');  
			sheetDivCheckChangedLabel.style='max-height: 144px;width: 40%;margin-left: -346px;/* position: absolute; */';
			sheetDivCheckChangedLabel.id = 'show_changed_label'; 
			sheetDivCheckChangedLabel.innerHTML = 'Mostrar filas editadas';
			sheetDivTable.appendChild(sheetDivTableBody);
			sheetDivTable.appendChild(sheetDivHead);
			let sheetDivSpan2 = document.createElement('span');  
         sheetDivSpan2.innerHTML = 'Sólo fila inválida';
         sheetDivSpan2.style = 'margin-top: -140px;position: absolute;margin-left: 32px;font-size: 80%;';			
			sheetDivTable.appendChild(sheetDivSpan);			
			let sheetDivGrandChildOptionsDiv2 = document.createElement('div');  
			sheetDivGrandChildOptionsDiv2.style='overflow-y: scroll; overflow-x: hidden; max-height: 144px;';
			sheetDivGrandChildOptionsDiv2.id = 'mensajes';
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivSpan);
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivLabel);			
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivInput);
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivSpan2);
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivInput3);
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivSpan3);
			sheetDivGrandChildOptions.appendChild(sheetDivGrandChildOptionsDiv);
			sheetDivGrandChildButton.appendChild(sheetDivGrandChildButtonChild);
			sheetDivGrandChildButton.appendChild(sheetDivGrandChildButtonLabel);
			sheetDivGrandChildDiv.appendChild(sheetDivGrandChildSpan);
			sheetDivGrandChildDiv.appendChild(sheetDivGrandChildButton);
			sheetDivGrandChildDiv.appendChild(sheetDivGrandChildLabel);
			sheetDivGrandChildDiv.appendChild(sheetDivGrandChildSpan2);
			sheetDivGrandChildDiv.appendChild(sheetDivGrandChildLabel2);
			sheetDivChildDiv.appendChild(sheetDivChildStrong);
			sheetDivChildDiv.appendChild(sheetDivChildInput);
			sheetDivChildDiv.appendChild(sheetDivGrandChildDiv);
			sheetDivChildDiv.appendChild(sheetDivCheckChanged);
			sheetDivChildDiv.appendChild(sheetDivCheckInvalid);
			sheetDivChildDiv.appendChild(sheetDivCheckChangedLabel);
			sheetDivChildDiv.appendChild(sheetDivCheckInvalidLabel);
			sheetDiv.appendChild(sheetDivChildDiv);
			sheetDiv.appendChild(sheetDivTable);
			document.body.appendChild(sheetDiv);
			let labeled_data = [];
			readFields(config['fields']); 
			for(var sh = 0; sh <= workbook.SheetNames.length; ++sh){ 
				try{
					var sheet = workbook.Sheets[workbook.SheetNames[sh]]; // get the first worksheet
	  				/* loop through every cell manually */
	  				var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
	  				let page_data = [];
	  				//dtype checkbox 
					let sheetDivTableD = document.createElement('td');  
					let sheetDivTableDIn = document.createElement('input'); 
					sheetDivTableDIn.id='select_all'; 
					sheetDivTableDIn.type='checkbox'; 
					sheetDivTableDIn.style='width: 24px;height: 24px;margin-left: 32px;margin-bottom: 16px;margin-right: 16px;margin-top: 32px;';					 
					sheetDivTableD.appendChild(sheetDivTableDIn);	
					sheetDivDtypeRow.appendChild(sheetDivTableD);
					let tdLabelShiftDiv = document.createElement('div');  
					tdLabelShiftDiv.style = 'max-height: 144px;font-size: 16px;margin-right: 16px;margin-top: -4px;position: absolute;margin-left: 56px;';
					let tdLabelSelector = document.createElement('select');  
					tdLabelSelector.id='select_all'; 
					tdLabelSelector.style='width: 24px;height: 24px;margin-left: 32px;margin-bottom: 16px;margin-right: 16px;margin-top: 32px;';					 
					sheetDivTableD.appendChild(sheetDivTableDIn);	
					sheetDivDtypeRow.appendChild(sheetDivTableD);
					//dtype labels						
	  				for(var vtypei = range.s.r; vtypei <= range.e.r; ++vtypei) {
						let tdDtypeCol = document.createElement('td');  
						let dtypeColSpan = document.createElement('span');  
						dtypeColSpan.style = 'max-height: 144px;font-size: 16px;margin-right: 16px;margin-top: -4px;position: absolute;margin-left: 56px;';
						//dtypeColSpan.innerHTML = vtypei;
						tdDtypeCol.appendChild(dtypeColSpan);	
						sheetDivDtypeRow.appendChild(tdDtypeCol);	
					}  			
	  				for(var R = range.s.r; R <= range.e.r; ++R) { //R = row   
	  					page_data.push([]);
	      			for(var C = range.s.c; C <= range.e.c; ++C) { //C = col
	         			/* find the cell object */
	            		var cellref = XLSX.utils.encode_cell({c:C, r:R}); // construct A1 reference for cell
		         		if(!sheet[cellref]) continue; // if cell doesn't exist, move on
	   	      		var cell = sheet[cellref];
	   	      		let v = String(cell.v); //string parse the value in cell
	   	      		try{
	         				if (renderer.dom_factor[C][0].critical === true){            	
									if (v === ''){
										labeled_data.push([renderer.dom_factor[C][0].key, v]); 
										page_data[R].push(v);                  	
									}
	            			}
		         			if (renderer.dom_factor[C][0].unique === true){            	
									if (renderer.dom_factor[C][0].childs.includes(v)){
										if (labeled_data.includes([renderer.dom_factor[C][0].key,v])){								
										}	
										else{
											labeled_data.push([renderer.dom_factor[C][0].key,v]); 
											page_data[R].push(v);                   	
       	  							}							
									}
									else{
										renderer.dom_factor[C][0].childs.push(v); //add name to find unique values
									}
         	   			}
               			if (renderer.dom_factor[C][0].re !== false){  
               				let matching = v.match(renderer.dom_factor[C][0].re);          	
									if (typeof matching !== 'object'){
										if (labeled_data.includes([renderer.dom_factor[C][0].key,v])){}
										else{
											labeled_data.push([renderer.dom_factor[C][0].key,v]);     
											page_data[R].push(v);               	
       	  							}						
									}
   	         			}
								if (labeled_data.includes([renderer.dom_factor[C][0].key,v])){}
								else{          	
									labeled_data.push([renderer.dom_factor[C][0].key, v]);     	
									page_data[R].push(v);    			
       	  					} 
       	  				}
      					catch (error){
      					}		
         			}	       	
	   			}
	   			renderer.excel_data[sh] = page_data; //element-wise
				}
				catch (error){ //looping sums 1
				}
	   	}
	   	let sheet1 = renderer.loadTable(0);	
	   	for (var s = 0; s < sheet1.length; s++) {
	   		document.getElementById('sheet_rows').appendChild(sheet1[s]);	
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
			   document.getElementById('progress_bar').style.display = 'block';
			   // Increase the progress bar length.
			   if (percentLoaded <= 100) {
			      document.getElementById('p%').style.width = percentLoaded + '%';
			   	document.getElementById('p%').textContent = percentLoaded + '%';
				}
			}
    	};
    	reader.onabort = function (e) {
      	e.abort();
    	};    		
    	reader.onloadstart = function (e) {
      	document.getElementById('progress_bar').className = 'loading';
      	document.getElementById('progress_bar').style.display = 'block';
    	};    	  	
	  	reader.readAsArrayBuffer(file);
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
		this.cells = [];
		this.cells_names_selected = [];
		let profilePic = document.createElement('div');	
		profilePic.className = 'profpic';
		profilePic.id = 'profpic';
		profilePic.style = 'position: relative;margin-left: -1246px;margin-top: -180px;z-index: -1;';
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
  			//console.info(config);
			renderFun(file,config);    		
		});
		let excelButton = document.createElement('button'); 			
		excelButton.id = 'ppbutton'; 		
		profilePicInput.onclick = function () {
  			this.value = null;
		};
		profilePicInput.onchange = function () { 
  			//if (e.dataTransfer.items) {
    		//	var file = e.dataTransfer.items[0].getAsFile();
  			//} else {
    		//	var file = e.dataTransfer.files[0];
  			//}			
  			//console.info(config);
			renderFun(this.files[0], config);
		}; 					
		excelButton.onclick = function (e) { 
			uploadimg();
		}; 				
		excelButton.style = 'width: 465px;height: 282px;margin-top: -40px;position: absolute;opacity: 0.3;border: 2px dashed lightyellow;background: repeating-linear-gradient(90deg, #9c989b, #c7c7c7 51%, #8a00c7) var(--x, 0)/ 400%;margin-left: -388px;'; 	
		profilePic.appendChild(profilePicLabel);
		profilePicLabel.appendChild(excelButton);		
		document.body.appendChild(profilePic);
		//console.info(config);
		renderDOM(document, config['theme'], config['height'], config['width']);
		//document.getElementById('ppbutton').click();
  }

	tdCombined(event) {
		event.target.n = event.target.value;
		if (event.target.selecting === true){
			event.target.selecting = false;
			event.style.backgroundColor = '';
			renderer.cells_names_selected = event.target.n;	
			return;	
		}
		else{
  			if (0 < renderer.cells_names_selected.length) {
				let children = rows[i].childNodes;
  				for (var j = 0; j < children.length; j++) {
					if (children[j].n === renderer.cells_names_selected[0]){
						break;
					}  
  				}
  				children[j].value += event.target.value;
  				event.target.value = '';
  			}
  			else{
				renderer.cells_names_selected.push(event.target.n); 		
  			}
  			event.target.selecting = true;
  			event.target.style.backgroundColor = 'aliceblue';
  		}
	}

	checkAll(event) {
		if (event.target.checked === true){
  			let rows = document.getElementById('sheet_rows').childNodes;
  			for (var i = 0; i < rows.length; i++) {
				let children = rows[i].childNodes;
  				for (var j = 0; j < children.length; j++) {
  					let grandchildren = children[j].childNodes;
  					for (var k = 0; k < grandchildren.length; k++) {
  						if (grandchildren[k].type === 'checkbox'){
							continue;  					
  						}
  						else if (grandchildren[k].type !== 'text'){
							continue;  					
  						}
						if (grandchildren[k].trying === 'critical'){
							grandchildren[k].style.visibility = 'visible';	
						}  
						else if (grandchildren[k].trying === 'unique'){
							grandchildren[k].style.visibility = 'visible';	
						}  
						else if (grandchildren[k].trying === 're'){
							grandchildren[k].style.visibility = 'visible';	
						}  
						else{
							if (grandchildren[k].type !== 'checkbox'){
								grandchildren[k].style.visibility = 'hidden';	
								//children[j].disabled = false;
							}
						}  
					}
  				}
  			}			
		}	
		else{	
  			let rows = document.getElementById('sheet_rows').childNodes;
  			for (var i = 0; i < rows.length; i++) {
  				let grandchildren = rows[i].childNodes;
  				for (var k = 0; k < grandchildren.length; k++) {  	
  					let children =grandchildren[k].childNodes;
  					for (var j = 0; j < children.length; j++) {			
  						if (children[j].checked === true){
  							console.info('ROW HAS EDITING ENABLED');
							continue;  				
  						}
						if (children[j].style.visibility === 'hidden'){
							children[j].style.visibility = 'visible';	
							//children[j].disabled = false;
						}  
						else{
						}
					}	  
  				}
  			}			
		}
	}

	loadTable(idx) {
		let ipage = renderer.excel_data[idx];
		let sizeIncrement = 0;
		let cells_sum = 0;
		this.trs = [];
  		for (var R = 0; R < ipage.length; R++) {
	      let trDiv = document.createElement('tr');
	      let tdDiv = document.createElement('td');
	      let checkbox = document.createElement('input');
	      checkbox.type = 'checkbox';
	      checkbox.onchange = function (e) {
	      	renderer.checkSize(e);
	      }
	      checkbox.style = 'width: 24px;height: 24px;margin-left: 32px;margin-right: 124px;';
	      tdDiv.appendChild(checkbox);
	      trDiv.appendChild(tdDiv);
	      trDiv.style = 'margin-left: -115px; position: absolute;';
	      if (0 < R){
	      	trDiv.style += 'margin-top: 40px;';
	      }
	      else{
	      	sizeIncrement += 32;
	      	trDiv.style += 'margin-top: '+String(40+sizeIncrement)+'px;';
	      }
	      tdDiv.style = '/* margin-left: -90px; */ width: 110px;';
  			for (var C = 0; C < ipage[R].length; C++){
	   	    try{
	         		if (this.dom_factor[C][0]['critical'] === true){            	
							if (v === ''){
								console.info(this.dom_factor[C][0]);                	
      	 	  				let textbox = document.createElement('input');
       		  				textbox.type = 'text';
       		  				textbox.style = 'width: 165px;margin-left: -16px;';
       		  				if (0 === C){
       		  					textbox.style += 'margin-left: 12px;';
       		  				}
       	  					textbox.placeholder = 'Campo sin completar';
	       	  				errorCell(textbox); //coloriza campo crítico vacío
	       	  				textbox.critical = 1;
       	  					if (typeof e.trying === 'undefined'){
									e.trying = [];       	  						
       	  					}	       	  				
	       	  				e.trying.push('critical');
       	  					textbox.col = C;
       	  					textbox.row = R;
	       	  				textbox.onchange = function (e){
									this.prove(e, textbox.col, textbox.row);	       	  				
									e.target.isedited = true;	       
	       	  				}
       	  					textbox.readOnly = false;	
       	  					textbox.onselect = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					textbox.selecting = false;			
       	  					cells_sum += 1;	
							}
	            	}
		         	else if (typeof this.dom_factor[C][0]['unique'] !== 'undefined'){            	
							if (this.dom_factor[C][0].childs.includes(v)){            	
       						let textbox = document.createElement('input');
       	  					textbox.type = 'text';
       	  					textbox.style = 'width: 165px;margin-left: -16px;';
       	  					errorCell(textbox); //coloriza campo contenido duplicado       	  						
       	  					textbox.readOnly = false;	
       	  					textbox.col = C;
       	  					textbox.row = R;
	         				textbox.onchange = function (e){
									this.prove(e,textbox.col,textbox.row);	       	  				
									e.target.isedited = true;	       
       	  					}
       	  					textbox.onselect = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					if (typeof e.trying === 'undefined'){
									e.trying = [];       	  						
         					}
	       	  				e.trying.push('unique');
       	  					textbox.selecting = false;
       	  				}
       	  				textbox.value = 'Error de tipo: el campo es un conjunto único.';
	       	  			textbox.unique = 1;       	  				
	       	  			cells_sum += 1;									
						}
               	else if (this.dom_factor[C][0]['re'] !== false){  
               		let matching = v.match(this.dom_factor[C][0].re);          	
							if (typeof matching !== 'object'){
								console.info(this.dom_factor);              	
       			 			let textbox = document.createElement('input');
       	  					textbox.type = 'text';
       	  					textbox.style = 'width: 165px;margin-left: -16px;';
       	  					textbox.col = C;
       	  					textbox.row = R;
       	  					if (typeof e.trying === 'undefined'){
									e.trying = [];       	  						
       	  					}       	  				
	        					textbox.onchange = function (e){
									this.prove(e,textbox.col,textbox.row);	       	  				
									e.target.isedited = true;	       
	       	  				}       	  								
	       	  				e.trying.push('re');
       	  					errorCell(textbox); //coloriza campo contenido duplicado       	  						
       	  					textbox.readOnly = false;	
       	  					textbox.onselect = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					textbox.selecting = false;
       	  					cells_sum += 1;
       	  				}
      	 	  			textbox.value = 'Error de sintaxis: el valor no cuenta con las marcas de expresión buscadas.';
	       	  			textbox.re = 1;							
						}
						else{
       		 			let textbox = document.createElement('input');
       	  				textbox.type = 'text';
       	  				textbox.style = 'width: 165px;margin-left: -16px;';
       	  				textbox.value = ipage[R][C];
       	  				textbox.col = C;
       	  				textbox.row = R;
	       	  			textbox.onchange = function (e){
								renderer.excel_data[0][textbox.col][textbox.row] = e.target.value;
								e.target.isedited = true;	       	  				
	       	  			}
       	  				textbox.onselect = function(e){
								renderer.tdCombined(e);       	  		
         				}	
      	  				textbox.selecting = false;
       	  				cells_sum += 1;
       	  				let tdDiv = document.createElement('td');
	      				tdDiv.appendChild(textbox);
	       	  			trDiv.appendChild(tdDiv);    			
					  }
   	       }
      		 catch (error){
      			console.info(error);
      		 }	  	  			
       	 }
       	 this.trs.push(trDiv); 
		}
		return this.trs;	
  	}

	checkSize(event) {
		if (event.target.checked === true){
			this.sizeChecked = true;	
		}	
		else{
			this.sizeChecked = false;		
		}
		let parentRow = event.target.parentNode;
		let grandparent = parentRow.parentNode;
		let children = grandparent.childNodes;
  		for (var j = 0; j < children.length; j++) {
  			let grandc = children[j].childNodes;
  			for (var i = 0; i < grandc.length; i++){
  				if (grandc[i].type === 'checkbox'){
					continue;  			
  				}
				if (grandc[i].isedited === true){
					grandc[i].style.visibility = 'visible';	
					//children[j].disabled = false;
				}  
				else if (event.target.checked === false){
					grandc[i].style.visibility = 'visible';	
				}	
				else{
					grandc[i].style.visibility = 'hidden';
					//children[j].disabled = true;	
				}  
			}
  		}
	}

	proveFilled(idx,C,R) {
		if (idx.value !== ''){
  			idx.style.backgroundColor = null;
  			idx.critical = 0;
	      console.info('CURRENT COLUMN', C);
	      console.info('CURRENT ROW', R);
			renderer.excel_data[C][R] = idx.value;	 
  		}
  		else{
			idx.critical = 1;  		
			errorCell(idx);  		
       	idx.value = 'Campo sin completar.';	
	      console.info('CURRENT COLUMN', C);
	      console.info('CURRENT ROW', R);
			renderer.excel_data[C][R] = idx.value;	        	
  		}
	}

	proveUnique(idx,C,R) {
		if (renderer.dom_factor[C].childs.includes(idx.value)){
			idx.unique = 1;  		
			errorCell(idx);  
       	idx.value = 'Error de tipo: el campo es un conjunto único.';			
	      console.info('CURRENT COLUMN', C);
	      console.info('CURRENT ROW', R);
			renderer.excel_data[C][R] = idx.value;	    
  		}
  		else{
  			idx.style.backgroundColor = null;
  			idx.unique = 0;					
	      console.info('CURRENT COLUMN', C);
	      console.info('CURRENT ROW', R);
			renderer.excel_data[C][R] = idx.value;	    
  		}
	}

	proveRe(idx,C,R) {
		let matching = idx.value.match(dom_factor[C].re);          	
		if (typeof matching !== 'object'){
			idx.unique = 1;  		
			errorCell(idx);  
       	idx.value = 'Error de sintaxis: el valor no cuenta con las marcas de expresión buscadas.';			
  		}
  		else{
  			idx.style.backgroundColor = null;
  			idx.unique = 0;					
	      console.info('CURRENT COLUMN', C);
	      console.info('CURRENT ROW', R);
			renderer.excel_data[C][R] = idx.value;	    
  		}
	}

	prove(idx,C,R) {
		for (var j = 0; j < idx.target.trying.length; j++) {
			if (idx[j].trying === 'critical'){
				this.proveFilled(idx.target,C,R);
			}
			else if (idx[j].trying === 'unique'){
				this.proveUnique(idx.target,C,R);
			}
			else if (idx[j].trying === 're'){
				this.proveRe(idx.target,C,R);
			}
		}
	}

	showClean() {
  		rows = document.getElementById('sheet_rows').childNodes;
  		for (var j = 0; j < rows.length; j++) {
			if (rows[j].style.display === 'none'){
				rows[j].style.display = 'block';		
			}  
  		}
	}

	showUnedited() {
  		rows = document.getElementById('sheet_rows').childNodes;
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
		try{
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
		}
		catch (error){
		}
		this.dom_factor = [];
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
   		if (typeof dom_node_data !== 'undefined'){
				this.dom_factor.push([]);
				console.info(dom_node_data);
				this.dom_factor[j].push(dom_node_data);
			}
	   }
	}

	//XLSX.writeFile(workbook, fname, write_opts) write file back
}
function uploadimg(){
	document.getElementById('pIn').click();
};

let renderer = new renderWidget(document.getElementById('cecilio-importer'), options);		
