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
  	if(typeof renderer.errorColor === 'undefined'){
		idx.style.backgroundColor = 'red';
  	}
  	else{
  		idx.style.backgroundColor = renderer.errorColor;  	
	}
}

function renderDOM(instance,theme,h,w){
	//Función que renderiza el tema personalizado
 	let children = document.getElementsByTagName('button');
 	if (typeof h !== 'undefined'){
 		document.getElementById('cencilio-importer').style.height = String(h)+'px';
 	}
 	if (typeof w !== 'undefined'){
 		document.getElementById('cencilio-importer').style.width = String(w)+'px';
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
					//console.info(fields[j]['validators'][set]);
					if (fields[j]['validators'][set]['validate'] === 'required'){
						validators.required = true;				
					}
					else if (fields[j]['validators'][set]['validate']  === 'unique'){
						//console.info('VALIDATE UNIQUE');
						validators.unique = true;				
					}
					else if (fields[j]['validators'][set]['validate']  === 'regex_match'){
		   			//console.info('VALIDATE REGEX');
						validators.regex = true;				
					}
					if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
		   			//console.info('HAS ERROR');
						validators.error = true;				
					}				
					if (validators.required === true){
						renderer.ndata = new DOMNodeFactors(true, fields[j]['label'], fields[j]['key']);
						if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
		   				renderer.ndata.error = fields[j]['validators'][set]['error'];
   					}
						if (fields[j]['validators'][set]['validate'] === 'regex_match'){
		   				renderer.ndata.re = fields[j]['validators'][set].regex;
		   				//console.info('NDATA REGEX');
   					}
					}
					else{
						renderer.ndata = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);
						if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
		   				renderer.ndata.error = fields[j]['validators'][set]['error'];
   					}
						if (fields[j]['validators'][set]['validate'] === 'regex_match'){
		   				renderer.ndata.re = fields[j]['validators'][set].regex;
		   				//console.info('NDATA REGEX');
   					}
					}
					//console.info(renderer.ndata );
				   if (typeof renderer.ndata !== 'undefined'){
						if (renderer.dom_factor.length <= j){
							renderer.dom_factor.push([]);
							renderer.dom_factor[renderer.dom_factor.length-1].push([renderer.ndata,validators]);
						}  
						else{
							renderer.dom_factor.push([]);
							renderer.dom_factor[j].push([renderer.ndata,validators]); 						
						}
					}
				}
				catch(error){
				}	
   		}		
		}
		else if (typeof fields[j]['validators'] === 'undefined'){
		   renderer.ndata = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);
		   if (typeof renderer.ndata !== 'undefined'){
				if (renderer.dom_factor.length <= j){
					renderer.dom_factor.push([]);
					renderer.dom_factor[renderer.dom_factor.length-1].push([renderer.ndata,null]);
				}  
				else{
					renderer.dom_factor.push([]);
					renderer.dom_factor[j].push([renderer.ndata,validators]); 						
				}
			}	
   	}
   	else{
			let validators = null;   	
   	}
   	//console.info(renderer.dom_factor);
	}
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
			sheetDiv.id='sheet_div'; 
			sheetDiv.style='position: absolute;z-index: 4; margin-top: 80px; padding: 16px; width: 80%; margin-left: 160px;border-radius: 4px;height: 80%;overflow-y: scroll;';
			//cencilio default background color
			if (typeof config['theme']['global']['backgroundColor'] === 'undefined'){
				sheetDiv.style.backgroundColor = 'rgb(180, 178, 183)';
				document.getElementById('raw_response_header').style.backgroundColor = 'rgb(180, 178, 183)';
				document.getElementById('data_exported').style.backgroundColor = 'rgb(180, 178, 183)';
			}
			else{ //cencilio user background color
				if (config['theme']['global']['backgroundColor'].length <= 7){
					if (config['theme']['global']['backgroundColor'].includes('#')){
						sheetDiv.style.backgroundColor = config['theme']['global']['backgroundColor'];
						document.getElementById('raw_response_header').style.backgroundColor = config['theme']['global']['backgroundColor'];
						document.getElementById('data_exported').style.backgroundColor = config['theme']['global']['backgroundColor'];
					}
				}
			}
			//cencilio default text color
			if (typeof config['theme']['global']['textColor'] === 'undefined'){
				sheetDiv.style.color = '#9400d3';
				document.getElementById('raw_response_header').style.color = '#9400d3';
				document.getElementById('data_exported').style.color = '#9400d3';
			}
			else{ //cencilio user text color
				if (7 <= config['theme']['global']['textColor'].length <= 9){
					if (config['theme']['global']['textColor'].includes('#')){
						sheetDiv.style.color = config['theme']['global']['textColor'];
						document.getElementById('raw_response_header').style.color = config['theme']['global']['textColor'];
						document.getElementById('data_exported').style.color = config['theme']['global']['textColor'];
					}
				}
			}
			//cencilio user defined font color
 			if (typeof config['theme']['global']['fontFamily'] !== 'undefined'){
 				sheetDiv.style.fontFamily = config['theme']['global']['fontFamily']; 
 				document.getElementById('raw_response_header').style.fontFamily = config['theme']['global']['fontFamily'];
 				document.getElementById('data_exported').style.fontFamily = config['theme']['global']['fontFamily'];
 			} 				
	  		let sheetDivChildDiv = document.createElement('div');
			sheetDivChildDiv.id='header_xlsx';
			sheetDivChildDiv.style='max-height: 144px;';
	  		let sheetDivChildStrong = document.createElement('strong');
	  		sheetDivChildStrong.id = 'cencilio_file_name';
			sheetDivChildStrong.style='font-family: "Gotham Black";margin-left: 56px;font-size: 24px;position: absolute;margin-top: 2px;';
			sheetDivChildStrong.innerHTML = '';
			//cencilio default primary text color
			if (typeof config['theme']['global']['primaryTextColor'] === 'undefined'){
				sheetDivChildStrong.style.color = 'darkviolet';
			}
			else{ //cencilio user primary text color
				if (7 <= config['theme']['global']['primaryTextColor'].length <= 9){
					if (config['theme']['global']['primaryTextColor'].includes('#')){
						sheetDivChildStrong.style.color = config['theme']['global']['primaryTextColor'];
					}
				}
			}
			//cencilio default shadow color
			if (typeof config['theme']['global']['shadowColor'] === 'undefined'){
				sheetDiv.style.boxShadow = 'rgb(210, 191, 241) 0px 2px 8px 5px;';
				document.getElementById('raw_response_header').style.boxShadow = 'rgb(210, 191, 241) 0px 2px 8px 5px;';
			}
			else{ //cencilio user shadow color
				if (7 <= config['theme']['global']['shadowColor'].length <= 9){
					if (config['theme']['global']['shadowColor'].includes('#')){
						sheetDiv.style.boxShadow = config['theme']['global']['shadowColor'];
						document.getElementById('raw_response_header').style.boxShadow = config['theme']['global']['shadowColor'];
					}
				}
			}
			//cencilio default JSON background color
			if (typeof config['theme']['global']['jsDataColor'] === 'undefined'){
				document.getElementById('js_data').style.boxShadow = 'rgb(0 0 0 / 16%)';
			}
			else{ //cencilio user JSON background color
				if (7 <= config['theme']['global']['jsDataColor'].length <= 9){
					if (config['theme']['global']['jsDataColor'].includes('#')){
						document.getElementById('js_data').style.boxShadow = config['theme']['global']['jsDataColor'];
					}
				}
			}
	  		let sheetDivChildInput = document.createElement('select');
			sheetDivChildInput.id='sheet_select';
			sheetDivChildInput.placeholder='Nombre de hoja'; 
			sheetDivChildInput.style='max-height: 144px;width: 136px;margin-top: 2px;margin-left: 466px;border-radius: 2px;height: 32px;margin-bottom: 16px;';
			sheetDivChildInput.onchange = function(e){
				let sheet = renderer.loadTable(workbook.SheetNames.indexOf(e.target.value));
				renderer.page = 0;	
				console.info(sheet);
				document.getElementById('sheet_rows').childNodes[0] = sheet;		
			}
	  		let sheetDivGrandChildDiv = document.createElement('div');
			sheetDivGrandChildDiv.id='sheets_span';
			sheetDivGrandChildDiv.placeholder='Nombre de hoja'; 
			sheetDivGrandChildDiv.style='max-height: 144px; padding: 2px;';
	  		let sheetDivGrandChildSpan = document.createElement('span');
			sheetDivGrandChildSpan.style='max-height: 144px;margin-left: 276px;margin-top: -106px;position: absolute;';
			sheetDivGrandChildSpan.innerHTML='Total:';
	  		let sheetDivGrandChildLabel = document.createElement('label');
			sheetDivGrandChildLabel.style='max-height: 144px;margin-left: 320px;margin-top: -106px;position: absolute;';
			sheetDivGrandChildLabel.id='total_sheets';
			sheetDivGrandChildLabel.innerHTML = '0';
	  		let sheetDivGrandChildSpan2 = document.createElement('span');
			sheetDivGrandChildSpan2.style='max-height: 174px;position: absolute;margin-top: -106px;margin-left: 340px;';
			sheetDivGrandChildSpan2.innerHTML = '| Con errores:'; 
	  		let sheetDivGrandChildLabel2 = document.createElement('label');
			sheetDivGrandChildLabel2.style='max-height: 144px;margin-top: -106px;position: absolute;margin-left: 440px;';
			sheetDivGrandChildLabel2.id='error_sheets'; 
			sheetDivGrandChildLabel2.innerHTML = '0';
	  		let sheetDivGrandChildButton = document.createElement('button');
			sheetDivGrandChildButton.id='cargar'; 
			sheetDivGrandChildButton.type = 'button';
			sheetDivGrandChildButton.onclick = function(e){
				document.getElementById('raw_response_header').style.display = 'block';
				document.getElementById('data_exported').style.display = 'block';
				let json_string = '{';
				for (var Page = 0; Page < renderer.excel_data.length; Page++) {
					json_string += '"Page '+Page+'": ';
					for (var R = 0; R < renderer.excel_data[Page].length; R++){
						if (R ===0){
							json_string += '[{';						
						}
						json_string += '"row_'+R+'": [';
						for (var C = 0; C < renderer.excel_data[Page][R].length; C++){
							json_string += '{"'+renderer.dom_factor[C][0][0].key+'": "'+renderer.excel_data[Page][R][C]+'"}';
							if (C+1 < renderer.excel_data[Page][R].length){
								json_string += ',';			
							}
						}
						json_string += ']';
						if (R+1 < renderer.excel_data[Page].length){
							json_string += ',';					
						}
					}
					json_string += '}]';
					if (Page+1 < renderer.excel_data.length){
						json_string += ',';					
					}
				}
				json_string += '}';
				let jsonData = json_string;
				document.getElementById('js_data').innerHTML = jsonData;
				console.info(JSON.parse(jsonData));
				//document.getElementById('js_data').innerHTML = jsonData; //copy data to HTML			
				fs.writeFile(renderer.file_name+".json", jsonData, (err) => {
    				if (err) {
        				console.error(err);
        				return;
    				};
    				console.log("Datos cargados correctamente.");
				});
			}
			sheetDivGrandChildButton.name='cargar';
			sheetDivGrandChildButton.class='cargar'; 
			sheetDivGrandChildButton.style='background: blue;height: 36px;width: 122px;border-width: 0px;margin-left: 720px;border-radius: 16px;padding: 8px;margin-top: -114px;position: absolute;';
			let sheetDivGrandChildButtonChild = document.createElement('img'); 
			sheetDivGrandChildButtonChild.src='https://assets.cencilio.com/info.png'; 
			sheetDivGrandChildButtonChild.style='height: 16px;width: 16px;margin-left: -76px;margin-top: -2px;';
			let sheetDivGrandChildButtonLabel = document.createElement('label');  
			sheetDivGrandChildButtonLabel.style='height: 20px;margin-top: 5px;margin-left: 3px;font-size: 9px;position: absolute;';
			sheetDivGrandChildButtonLabel.innerHTML = 'CARGAR DATOS';
			//default primary button color
			if (typeof config['primaryButtonColor'] === 'undefined'){
				sheetDivGrandChildButton.style.backgroundColor = 'blue';
				document.getElementById('close_button').style.backgroundColor = 'blue';
			}
			else{ //user primary button color
				if (7 <= config['primaryButtonColor'].length <= 9){
					if (config['primaryButtonColor'].includes('#')){
						sheetDivGrandChildButton.style.backgroundColor = config['primaryButtonColor'];
						document.getElementById('close_button').style.backgroundColor = config['primaryButtonColor'];
					}
				}
			}
			let sheetDivGrandChildOptions = document.createElement('div');  
			sheetDivGrandChildOptions.style='max-height: 144px;';
			sheetDivGrandChildOptions.id = 'options_xlsx';
			let sheetDivGrandChildOptionsDiv = document.createElement('div');  
			sheetDivGrandChildOptionsDiv.style='max-height: 144px;';
			sheetDivGrandChildOptionsDiv.id = 'sheets_span';
			let sheetDivGrandChildOptionsDivSpan = document.createElement('span');  
			sheetDivGrandChildOptionsDivSpan.style='max-height: 144px;margin-top: 18px;margin-left: 32px;position: absolute;';
			sheetDivGrandChildOptionsDivSpan.innerHTML = 'Instrucciones:'; 
			let sheetDivGrandChildOptionsDivLabel = document.createElement('label');  
			sheetDivGrandChildOptionsDivLabel.style='max-height: 144px;width: 40%;margin-left: 140px;margin-top: 18px;';
			sheetDivGrandChildOptionsDivLabel.id = 'instruction'; 
			sheetDivGrandChildOptionsDivLabel.innerHTML = 'Selecciona la página que necesites validar y corrobora que no hayan errores.';
			let sheetDivTable = document.createElement('table');  
			let sheetDivHead = document.createElement('thead');  
			let sheetDivTableBody = document.createElement('tbody');  
         sheetDivTableBody.id='sheet_rows';
			let sheetDivDtypeRow = document.createElement('tr');  
			sheetDivDtypeRow.style = 'margin-top: 150px;';
			sheetDivTableBody.appendChild(sheetDivDtypeRow);
			let sheetFieldSelector = document.createElement('tr');  
			sheetFieldSelector.style = 'margin-top: 32px;position: absolute;';
			sheetDivTableBody.appendChild(sheetFieldSelector);
			let sheetDivCheckInvalid = document.createElement('input');  
			sheetDivCheckInvalid.style='width: 24px; height: 258px; margin-left: 820px; margin-top: -141px;';
			sheetDivCheckInvalid.id = 'show_errors'; 
			sheetDivCheckInvalid.type='checkbox'; 
			sheetDivCheckInvalid.onchange = function(e){
				document.getElementById('select_all').incoming = 'show_errors';
				if (document.getElementById('select_all').checked === false){
					document.getElementById('select_all').click();
				}
				else{
					if (e.target.checked === true){
						renderer.render_invalid_page(e.target.checked);
					}
					else{
						renderer.render_invalid_page(e.target.checked);
					}						
				}
			}; 
			let sheetDivCheckChanged = document.createElement('input');  
			sheetDivCheckChanged.style='width: 24px;height: 24px;margin-left: 616px;margin-top: -48px;';
			sheetDivCheckChanged.id = 'show_changed'; 
			sheetDivCheckChanged.type='checkbox'; 
			sheetDivCheckChanged.onchange = function(e){
				document.getElementById('select_all').incoming = 'show_changed';
				if (document.getElementById('select_all').checked === false){
					document.getElementById('select_all').click();
				}
				else{
					if (e.target.checked === true){
						renderer.render_edited_page(e.target.checked);
					}
					else{
						renderer.render_edited_page(e.target.checked);
					}						
				}
			}; 
			let sheetDivCheckInvalidLabel = document.createElement('label');  
			sheetDivCheckInvalidLabel.style='max-height: 144px; width: 40%; margin-left: 850px; margin-top: -138px; position: absolute;';
			sheetDivCheckInvalidLabel.id = 'show_errors_label'; 
			sheetDivCheckInvalidLabel.innerHTML = 'Mostrar filas con errores';
			let sheetDivCheckChangedLabel = document.createElement('label');  
			sheetDivCheckChangedLabel.style='max-height: 144px; width: 40%; margin-left: 646px; margin-top: -138px; position: absolute;';
			sheetDivCheckChangedLabel.id = 'show_changed_label'; 
			sheetDivCheckChangedLabel.innerHTML = 'Mostrar filas editadas';
			sheetDivTable.appendChild(sheetDivTableBody);
			sheetDivTable.appendChild(sheetDivHead);
			let sheetDivSpan2 = document.createElement('span');  
         sheetDivSpan2.innerHTML = 'Sólo fila inválida';
         sheetDivSpan2.style = 'margin-top: -140px;position: absolute;margin-left: 32px;font-size: 80%;';						
			let sheetDivGrandChildOptionsDiv2 = document.createElement('div');  
			sheetDivGrandChildOptionsDiv2.style='overflow-y: scroll; overflow-x: hidden; max-height: 144px;';
			sheetDivGrandChildOptionsDiv2.id = 'mensajes';
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivSpan);
			sheetDivGrandChildOptionsDiv.appendChild(sheetDivGrandChildOptionsDivLabel);			
			sheetDivGrandChildOptions.appendChild(sheetDivGrandChildOptionsDiv);
			sheetDivGrandChildButton.appendChild(sheetDivGrandChildButtonChild);
			sheetDivGrandChildButton.appendChild(sheetDivGrandChildButtonLabel);
			sheetDivGrandChildDiv.appendChild(sheetDivGrandChildOptions);
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
			//DATA STRUCTURE BEFORE VALIDITY 
			for(var sh = 0; sh <= workbook.SheetNames.length; ++sh){ 
				try{
					var sheet = workbook.Sheets[workbook.SheetNames[sh]]; // get the first worksheet
	  				/* loop through every cell manually */
	  				if (typeof sheet === 'undefined'){
						continue;	  				
	  				} 
	  				let pageOption = document.createElement('option');
	  				pageOption.value = workbook.SheetNames[sh];
	  				pageOption.innerHTML = workbook.SheetNames[sh];
	  				document.getElementById('sheet_select').appendChild(pageOption);
	  				var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
	  				let page_data = [];
	  				//dtype checkbox 
					let sheetDivTableD = document.createElement('td');  
					let sheetDivTableDIn = document.createElement('input'); 
					sheetDivTableDIn.id='select_all'; 
					sheetDivTableDIn.onchange = function(e){
						if (e.target.incoming === 'show_changed'){
							renderer.render_edited_page(e.target.checked);
						}
						if (e.target.incoming === 'show_errors'){
							renderer.render_invalid_page(e.target.checked);
						}
					}; 
					sheetDivTableDIn.type='checkbox'; 
					sheetDivTableDIn.style='width: 24px;height: 24px;margin-left: 32px;margin-bottom: 16px;margin-right: 16px;margin-top: 32px;';					 
					sheetDivTableD.appendChild(sheetDivTableDIn);	
					sheetDivDtypeRow.appendChild(sheetDivTableD);
					//dtype labels		
					let colsize = range.e.c;	
					//console.info(colsize);	
					let selectorIncrement = 148;		
	  				for(var vtypei = 0; vtypei <= colsize; ++vtypei) {
						let tdLabelShiftDiv = document.createElement('div');  
						tdLabelShiftDiv.style = 'max-height: 144px;font-size: 16px;margin-right: 16px;margin-top: -148px;position: absolute;width: 80px;margin-left: 748px;';
						tdLabelShiftDiv.style.marginLeft = String(selectorIncrement)+'px';
						selectorIncrement += 150;
						let tdLabelSelector = document.createElement('select');  
						tdLabelSelector.id='select_all_selector'; 
						tdLabelSelector.style='width: 150px;height: 24px;margin: 32px 16px 16px 32px;margin-left: 16px;';	
						tdLabelSelector.onchange = function (e){
							let children = e.target.choices;
							renderer.swap_columns(0, e.target.choices.indexOf(e.target.prev)+1, e.target.choices.indexOf(e.target.value)+1);	
							e.target.prev = e.target.value;					
						}				 
						tdLabelSelector.choices = [];
						tdLabelShiftDiv.appendChild(tdLabelSelector);					
						let tdFieldSelector = document.createElement('td');  
						let selector_size = range.e.c;
	  					for(var vtypec = 0; vtypec <= selector_size; ++vtypec) {
							let selectOption = document.createElement('option'); 
							try{
								selectOption.value = renderer.dom_factor[vtypec][0][0].key;
								tdLabelSelector.choices.push(renderer.dom_factor[vtypec][0][0].key);
								selectOption.innerHTML = renderer.dom_factor[vtypec][0][0].label;
								if (vtypei === vtypec){
									selectOption.defaultSelected = true;	
									tdLabelSelector.prev = renderer.dom_factor[vtypec][0][0].key;							
								}
								tdLabelSelector.appendChild(selectOption);
							}
							catch (error){
								console.info(error);
							}
						};  	
						vtypec = 0;
						selector_size = range.e.c;	
						tdLabelShiftDiv.appendChild(tdLabelSelector);
						tdFieldSelector.appendChild(tdLabelShiftDiv);	
						sheetFieldSelector.appendChild(tdFieldSelector);	
						let tdDtypeCol = document.createElement('td');  
						let dtypeColSpan = document.createElement('span');  
						dtypeColSpan.id = 'dtype_'+String(vtypei);  
						dtypeColSpan.style = 'max-height: 144px;font-size: 16px;margin-right: 16px;margin-top: -4px;position: absolute;';
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
	   	      		page_data[R].push(v);  
         			}	       	
	   			}
	   			renderer.excel_data[sh] = page_data; //element-wise
				}
				catch (error){ //looping sums 1
					console.info(error);
				}
	   	}
	   	renderer.page = 0;
	   	let sheet1 = renderer.loadTable(0);	
	   	for (var s = 0; s < sheet1.length; s++) {
	   		document.getElementById('sheet_rows').appendChild(sheet1[s]);	
	   	}
	   	document.getElementById('cencilio_file_name').innerHTML = renderer.file_name;
		};		
    	reader.onerror = function (e) {
    		switch(e.target.error.code) {
      		case e.target.error.NOT_FOUND_ERR:
        		console.info('File Not Found!');
        		break;
      		case e.target.error.NOT_READABLE_ERR:
        		console.info('File is not readable'); ///////////////////
        		break;
      		case e.target.error.ABORT_ERR:
        		break; 
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
		this.nselected = 0;
		this.sizeIncrement = 0;
		let dragger = document.createElement('div');	
		dragger.className = 'dragger';
		dragger.id = 'xls_dragger';
		dragger.style = 'position: relative;margin-left: -1246px; z-index: -1;';
		let draggerForm = document.createElement('form');	
		draggerForm.className = 'pimg';
		draggerForm.id = 'pimg';
		draggerForm.style = 'visibility: hidden; margin-top: 96px;position: absolute;margin-left: 1714px;background-color: #0000ff08;width: 464px;height: 280px;';
		draggerForm.enctype = 'multipart/form-data';
		let draggerInput = document.createElement('input');	
		draggerInput.type = 'file';
		draggerInput.id = 'pIn';
		draggerInput.accept = '.xlsx, .xls, .csv';
		draggerInput.style='display: none; visibility: hidden; height: 282px;width: 464px;';
		draggerForm.appendChild(draggerInput);
		let draggerInput2 = document.createElement('input');	
		draggerInput2.type='submit';
		draggerInput2.name='btnSubmit';
		draggerInput2.style='visibility: hidden;';
		draggerInput2.value='Submit';
		draggerForm.appendChild(draggerInput2);
		dragger.appendChild(draggerForm);
		let draggerLabel = document.createElement('label');	
		draggerLabel.innerHTML = 'Arrastra archivos aquí o haz click para cargar';   
		draggerLabel.class='perfil_label';
		draggerLabel.style='position: absolute; margin-left: 1760px; margin-top: 160px; width: 342px;';
		let draggerImg2 = document.createElement('img');	
		draggerImg2.src = 'icons.png';
		draggerImg2.style='height: 78px;width: 65px;margin-left: 1891px;margin-top: 210px;position: absolute;';
		dragger.appendChild(draggerImg2);
		draggerInput.addEventListener("dragover", function(event) {
  			event.preventDefault();
		});
		draggerInput.addEventListener("drop", function(event) {
			//console.info(ev.dataTransfer.items[0].getAsFile());
  			if (ev.dataTransfer.items) {
    			var file = ev.dataTransfer.items[0].getAsFile();
    			document.getElementById('cencilio_file_name').innerHTML = file.name;
  			} else {
    			var file = ev.dataTransfer.files[0];
    			document.getElementById('cencilio_file_name').innerHTML = file.name;
  			}			
  			//console.info(config);
			renderFun(file,config);    		
		});
		let excelButton = document.createElement('button'); 			
		excelButton.id = 'ppbutton'; 		
		draggerInput.onclick = function (e) {
  			this.value = null;
		};
		draggerInput.onchange = function (e) { 
			renderer.file_name = this.files[0].name;
			renderFun(this.files[0], config);
		}; 					
		excelButton.onclick = function (e) { 
			uploadimg();
		}; 				
		excelButton.style = 'width: 465px;height: 282px;margin-top: -40px;position: absolute;opacity: 0.3;border: 2px dashed lightyellow;background: repeating-linear-gradient(90deg, #9c989b, #c7c7c7 51%, #8a00c7) var(--x, 0)/ 400%;margin-left: -388px;'; 	
		dragger.appendChild(draggerLabel);
		draggerLabel.appendChild(excelButton);		
		let dataExportDiv = document.createElement('div');
		dataExportDiv.id = 'data_exported';
		dataExportDiv.name = 'data_exported';
		dataExportDiv.className = 'data_exported'; 	
		dataExportDiv.style='background-color: rgb(138, 82, 231);box-shadow: rgb(138, 82, 231) 0px 2px 8px 5px;position: absolute;display: none;z-index: 7;margin-left: 396px;width: 512px;margin-top: 166px;border-radius: 4px;';
		let dataExportSpan = document.createElement('span');
		dataExportSpan.style = 'max-height: 144px;margin-left: 56px;font-size: 24px;';
		dataExportSpan.innerHTML = 'Datos cargados exitosamente';
		let dataExportButton = document.createElement('button');
		dataExportButton.type = 'button';
		dataExportButton.id = 'close_button';
		dataExportButton.onclick = function (e){
			dataExportDiv.style.display = 'none';		
		}
		dataExportButton.style='background: blue;height: 26px;width: 26px;border-width: 0px;margin-top: 11px;margin-left: 32px;border-radius: 6px;';
		let dataExportButtonImg = document.createElement('img');
		dataExportButtonImg.src='close.png';
		dataExportButtonImg.style='width: 26px;height: 26px;margin-left: -6px;';
		dataExportButton.appendChild(dataExportButtonImg);
		let dataExportDash = document.createElement('hr');
		dataExportDash.style='max-height: 144px;';
		let dataExportChildDiv = document.createElement('div');
		dataExportChildDiv.id='board'; 
		dataExportChildDiv.style='max-height: 144px;';
		let dataExportSpan2 = document.createElement('span');
		dataExportSpan2.style='max-height: 144px;';
		dataExportSpan2.innerHTML='Para ver sus datos cargados observe la respuesta de procesamiento de los datos actualizados.';
		let dataExportAccept = document.createElement('button');
		dataExportAccept.type='button'; 
		dataExportAccept.style='background: blue;visibility: hidden;height: 52px;width: 52px;border-width: 0px;margin-top: 11px;margin-left: 16px;';
		dataExportAccept.innerHTML = 'ACEPTAR';
		dataExportChildDiv.appendChild(dataExportSpan2);
		dataExportChildDiv.appendChild(dataExportAccept);
		dataExportDiv.appendChild(dataExportSpan);
		dataExportButton.appendChild(dataExportButtonImg);
		dataExportDiv.appendChild(dataExportButton);
		dataExportDiv.appendChild(dataExportDash);	
		document.body.appendChild(dataExportDiv);		
		let headerDiv = document.createElement('div');
		headerDiv.className = 'raw_response_header';
		headerDiv.id = 'raw_response_header';
		headerDiv.style = 'position: absolute; display: none; justify-content:center;margin-left: 0px;width: 273px;margin-top: 6px;height: 42px;background-color: #b05cc5b8;border-radius: 4px;margin-left: 8px;box-shadow: rgb(231 82 220 / 44%) 0px 2px 8px 5px;';		
		let headerLabel = document.createElement('label');
		headerLabel.style = 'background: transparent;height: 240px;width: 208px;border-width: 0px;margin-top: 10px;margin-left: 56px;';		
		headerLabel.innerHTML = 'Raw response header';
		let headerHR = document.createElement('hr');
		let headerLabel2 = document.createElement('label');
		headerLabel2.style = 'height: 226px;width: 270px;border-width: 0px;margin-top: -247px;position: absolute;border-radius: 8px;margin-left: 2px;font-size: 12px;padding: 16px;overflow-y: scroll;';		
		headerLabel2.id = 'js_data';
		headerDiv.appendChild(headerLabel);
		headerDiv.appendChild(headerHR);
		headerDiv.appendChild(headerLabel2);
		let progressBarDiv = document.createElement('div'); 	
		progressBarDiv.className = 'progress_bar';
		progressBarDiv.id = 'progress_bar';		
		progressBarDiv.name = 'progress_bar';		
		progressBarDiv.style = 'display: block;margin-top: 60px;background-color: rgb(142, 53, 53);height: 40px;width: 400px;margin-left: 483px;border-radius: 12px;position: absolute;';	
		let progressBarLabel = document.createElement('label'); 	
		progressBarLabel.className = 'pmsg';
		progressBarLabel.id = 'pmsg';		
		progressBarLabel.name = 'pmsg';		
		progressBarLabel.style = 'font-size: 18px;margin-left: 24px;margin-top: 4px;';	
		progressBarLabel.innerHTML = 'Uploading';	
		let progressBarChildDiv = document.createElement('div'); 	
		progressBarChildDiv.className = 'percent';
		progressBarChildDiv.id = 'percent';		
		progressBarChildDiv.name = 'percent';		
		progressBarChildDiv.style = 'font-size: 20px;margin-left: 160px;margin-top: -32px;width: 55%;border-radius: 4px;height: 80%;';	
		let progressBarChildDivLabel = document.createElement('label'); 	
		progressBarChildDivLabel.className = 'p%';
		progressBarChildDivLabel.id = 'p%';		
		progressBarChildDivLabel.name = 'p%';		
		progressBarChildDivLabel.style='width: 100%;margin-left: 16px;';
		progressBarChildDivLabel.innerHTML = '0%';
		progressBarDiv.appendChild(progressBarLabel);
		progressBarChildDiv.appendChild(progressBarChildDivLabel);
		progressBarDiv.appendChild(progressBarChildDiv);
		dragger.appendChild(progressBarDiv);
		document.body.appendChild(dragger);
		document.body.appendChild(headerDiv);
		//importer graphics are defined after the dragger
		renderDOM(document, config['theme'], config['height'], config['width']); 
 		if (typeof config['theme']['global']['errorColor'] !== 'undefined'){
 			this.errorColor = config['theme']['global']['errorColor']; 
 		}		
		//document.getElementById('ppbutton').click();
  }

	tdCombined(event) {
		renderer.cells_names_selected.push(event.target); 		
  		event.target.style.backgroundColor = 'aliceblue';
		if (1 < renderer.cells_names_selected.length){
			//console.info(renderer.cells_names_selected[0]);
			renderer.cells_names_selected[0].value += renderer.cells_names_selected[1].value; 
			renderer.excel_data[renderer.page][renderer.cells_names_selected[0].col][renderer.cells_names_selected[0].row] = renderer.cells_names_selected[0].value;
			renderer.cells_names_selected[1].value = ''; 
			renderer.excel_data[renderer.page][renderer.cells_names_selected[1].col][renderer.cells_names_selected[1].row] = '';
			if (renderer.cells_names_selected[0].row !== renderer.cells_names_selected[1].row){ //column combined
				renderer.cells_names_selected[0].style.height = '66px';
				if (renderer.cells_names_selected[0].C < renderer.cells_names_selected[1].C){
					renderer.cells_names_selected[0].style.marginTop = '0px';
				}
				else if (renderer.cells_names_selected[1].C < renderer.cells_names_selected[0].C){
					renderer.cells_names_selected[0].style.marginTop = '-32px';
				}
				renderer.cells_names_selected[0].style.position = 'none';
				let parentSelected = renderer.cells_names_selected[0].parentElement;
				let grandParentSelected = parentSelected.parentElement;
				let parentSelectedChildren = grandParentSelected.childNodes;
				for (var tds = 0; tds < parentSelectedChildren.length; tds++){
					let selectedChildren = parentSelectedChildren[tds].childNodes;
					for (var neighbor = 0; neighbor < selectedChildren.length; neighbor++){
						if (selectedChildren[neighbor].value === renderer.cells_names_selected[0].value){
							continue;
						}
						else if (selectedChildren[neighbor].value === renderer.cells_names_selected[1].value){
							continue;
						}
						else if (selectedChildren[neighbor].style.marginTop !== '0px'){ //cell uncombined
							console.info('SEEKING POSITION');
							console.info(renderer.cells_names_selected[0].C === renderer.cells_names_selected[1].C);
							if (renderer.cells_names_selected[0].C < renderer.cells_names_selected[1].C){
								selectedChildren[neighbor].style.marginTop = '-31px';
							}
							else if (renderer.cells_names_selected[0].C === renderer.cells_names_selected[1].C){
								console.info('LIFTING');
								selectedChildren[neighbor].style.marginTop = '-31px';
							}
							else{
								console.info('SETTING DEFAULT ROW');
								selectedChildren[neighbor].style.marginTop = 'none';
							}
						}
					}
				}
				renderer.cells_names_selected[1].style.visibility = 'hidden';
			}
			else{ //row combined
				renderer.cells_names_selected[0].style.width = '300px';
				let pivot_from = renderer.cells_names_selected[0].R+2;
				let parentSelected = renderer.cells_names_selected[0].parentElement;
				let parentSelectedChildren = parentSelected.childNodes;
				for (var neighbor = 0; neighbor < parentSelectedChildren.length; neighbor++){
					if (parentSelectedChildren[neighbor].R+2 === pivot_from){
						parentSelectedChildren[neighbor].style.marginLeft = '-150px'; //shift back neighbors in row
					}
				}				
				renderer.cells_names_selected[1].style.visibility = 'hidden';
				if (renderer.cells_names_selected[1].R < renderer.cells_names_selected[0].R){
					renderer.cells_names_selected[0].style.marginLeft = '-150px'; //shift back neighbors in row
					parentSelectedChildren[neighbor].R -= 1;
					renderer.cells_names_selected[0].style.width = '315px';
				}				
			}
			renderer.cells_names_selected = [];
			renderer.nselected += 1;
			event.target.style.backgroundColor = '';
			return;	
		}
	}

	swap_columns(Page,a,b) {
		let a_idx= [];	
		//let b_idx= [];		
  		for (var row = 0; row < renderer.excel_data[Page].length; row++) {
			for (var col = 1; col < document.getElementById('sheet_rows').childNodes.length; col++){
				let row_vals = document.getElementById('sheet_rows').childNodes[col];
				if (a_idx.includes(row_vals.childNodes[b].childNodes[0].value) === false){
					if (typeof row_vals.childNodes[b].childNodes[0].value !== 'undefined'){
						a_idx.push(row_vals.childNodes[b].childNodes[0].value);
					}
				}				
			}
		}			
  		for (var row = 0; row < renderer.excel_data[Page].length; row++) {
			for (var col = 1; col < document.getElementById('sheet_rows').childNodes.length; col++){
				let row_vals = document.getElementById('sheet_rows').childNodes[col];
				row_vals.childNodes[a].childNodes[0].value = a_idx[col-2];
				try{
					renderer.excel_data[Page][col-2][a-1] = renderer.excel_data[Page][col-2][b-1];
				}
				catch (error){
				}
			}
		}			
	}	

	render_invalid_page(state) {
  		let rows = document.getElementById('sheet_rows').childNodes;
  		for (var i = 0; i < rows.length; i++) {
  			try{
  				document.getElementById('render_row_'+String(i)).incoming = 'show_errors';
				document.getElementById('render_row_'+String(i)).click();
				document.getElementById('render_row_'+String(i)).checked = state;
			}
			catch (error){
			}
		}			
	}	

	render_invalid(state,row) {
		//console.info(state);
		let Row = row.parentElement;
		if (state === true){
			let children = Row.childNodes;
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				for (var k = 0; k < grandchildren.length; k++) {
  					if (grandchildren[k].type === 'checkbox'){
						continue;  					
  					}
  					else if (grandchildren[k].type !== 'text'){
						continue;  					
  					}
					if (grandchildren[k].isinvalid === true){
						if (grandchildren[k].style.backgroundColor === 'black'){
							grandchildren[k].style.backgroundColor = this.errorColor;
						}
						else if (grandchildren[k].style.color === 'black'){
							grandchildren[k].style.color = document.getElementById('sheet_div').style.color;
						}
					}  
					else{
						if (document.getElementById('show_changed').checked === true){
							if (grandchildren[k].isedited === true){
								continue;							
							}
						}	
						grandchildren[k].style.backgroundColor = 'black';	
						grandchildren[k].style.color = 'black';
					}  
				}
			}			
		}
		else{
			let grandRow = row.parentElement;
			let children = grandRow.childNodes;
			//console.info(children);
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				//console.info(grandchildren);
  				for (var k = 0; k < grandchildren.length; k++) {
					if (grandchildren[k].style.backgroundColor === 'black'){
						grandchildren[k].style.backgroundColor = null;
						grandchildren[k].style.backgroundColor = 'none';
					}
					else if (grandchildren[k].style.color === 'black'){
						grandchildren[k].style.color = null;
						grandchildren[k].style.color = document.getElementById('sheet_div').style.color;
					} 					
				}
			}				
		}
	}		

	render_edited_page(state) {
  		let rows = document.getElementById('sheet_rows').childNodes;
  		for (var i = 0; i < rows.length; i++) {
  			if (document.getElementById('render_row_'+String(i)) !== null){
  				if (state === true){
					document.getElementById('render_row_'+String(i)).checked = false;
				}
				else{
					document.getElementById('render_row_'+String(i)).checked = true;
				}
  				document.getElementById('render_row_'+String(i)).incoming = 'show_changed';
				document.getElementById('render_row_'+String(i)).click();
			}
  		}		
	}	
	
	render_edited(state,row) {	
		let Row = row.parentElement;
		//console.info(state);
		if (state === true){
			let children = Row.childNodes;
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				for (var k = 0; k < grandchildren.length; k++) {
  					if (grandchildren[k].type === 'checkbox'){
						continue;  					
  					}
  					else if (grandchildren[k].type !== 'text'){
						continue;  					
  					}
					if (grandchildren[k].isedited === true){
						if (grandchildren[k].style.backgroundColor === 'black'){
							grandchildren[k].style.backgroundColor = 'none';
						}
						else if (grandchildren[k].style.color === 'black'){
							grandchildren[k].style.color = document.getElementById('sheet_div').style.color;
						}
					}  
					else{
						if (document.getElementById('show_errors').checked === true){
							if (grandchildren[k].isinvalid === true){
								continue;							
							}
						}	
						grandchildren[k].style.backgroundColor = 'black';	
						grandchildren[k].style.color = 'black';
					}  
				}
			}			
		}
		else{
			let grandRow = Row.parentElement;
			let children = grandRow.childNodes;
			//console.info(children);
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				//console.info(grandchildren);
  				for (var k = 0; k < grandchildren.length; k++) { 
  					//console.info(grandchildren[k]);
  					let greatgrandchildren = grandchildren[k].childNodes;
  					for (var l = 0; l < greatgrandchildren.length; l++){
  						//console.info(greatgrandchildren[l]);
						if (greatgrandchildren[l].style.backgroundColor === 'black'){
							greatgrandchildren[l].style.backgroundColor = null;
							if (greatgrandchildren[l].isinvalid !== true){
								greatgrandchildren[l].style.backgroundColor = 'none';
							}
							else{
								greatgrandchildren[l].style.backgroundColor = renderer.errorColor;
							}
						}
						else if (greatgrandchildren[l].style.color === 'black'){
							greatgrandchildren[l].style.color = null;
							greatgrandchildren[l].style.color = document.getElementById('sheet_div').style.color;
						}
					} 					
				}
			}				
		}
	}

	loadTable(idx) {
		let ipage = renderer.excel_data[idx];
		let cells_sum = 0;
		let errors_sum = 0;
		this.trs = [];
  		for (var R = 0; R < ipage.length; R++) {
	      let trDiv = document.createElement('tr');
	      let tdDiv = document.createElement('td');
	      let checkbox = document.createElement('input');
	      checkbox.type = 'checkbox';
	      checkbox.id = 'render_row_'+String(R);
	      checkbox.onchange = function(e){
				let row = e.target.parentNode;
				//console.info(e.target.incoming);
				if (e.target.incoming === 'show_changed'){
					renderer.render_edited(e.target.checked,row);
				}
				else if (e.target.incoming === 'show_errors'){
					renderer.render_invalid(e.target.checked,row);
				}
			}; 
	      checkbox.style = 'width: 24px;height: 24px;margin-left: 32px;margin-right: 124px;';
	      tdDiv.appendChild(checkbox);
	      trDiv.appendChild(tdDiv);
	      trDiv.style = 'position: absolute;';
	      trDiv.style.marginTop = String(renderer.sizeIncrement)+'px';
	      //console.info(trDiv.style.marginTop);
	      renderer.sizeIncrement += 32;
	      tdDiv.style = 'width: 110px;';
  			for (var C = 0; C < ipage[R].length; C++){
  				 let v = ipage[R][C]; 
	   	    try{
		         	if (this.dom_factor[C][0][0].critical === true){            	
							if (v === ''){             	
      		 	  			this.textbox = document.createElement('input');
       			  			this.textbox.type = 'text';
       			  			this.textbox.style = 'width: 150px;';
       		  				if (0 === C){
       		  					this.textbox.style.marginLeft = '-16px';
       		  				}
	       	  				errorCell(this.textbox); //coloriza campo crítico vacío
	       	  				this.textbox.critical = 1;
       	  					if (typeof this.textbox.trying === 'undefined'){
									this.textbox.trying = [];       	  						
       	  					}	       	  				
	       	  				this.textbox.trying.push('critical');
       	  					this.textbox.col = C;
       	  					this.textbox.row = R;
	       	  				this.textbox.onchange = function (e){
									renderer.prove(e, this.textbox.col, this.textbox.row, renderer.page);	       	  				
									e.target.isedited = true;	       
	       	  				}
       	  					this.textbox.readOnly = false;	
       	  					this.textbox.onselect = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					this.textbox.value = this.dom_factor[C][0][0].error;
       	  					this.textbox.isinvalid = true;
       	  					this.textbox.err_msg = this.dom_factor[C][0][0].error;
       	  					this.textbox.selecting = false;			
       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  						document.getElementById('dtype_'+String(C)).innerHTML = 'Exception';
       	  					}
       	  					
       	  					if (0<C){
       	  						console.info((C+1)*128);
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
       	  						document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  					}    
       	  					else{
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
       	  						document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  					}           	  
       	  					errors_sum += 1;	
       	  					cells_sum += 1;	
       	  					let tdDiv = document.createElement('td');
	      					tdDiv.appendChild(this.textbox);
	       	  				trDiv.appendChild(tdDiv);
	       	  				continue;  
							}
							else{
      	 	  				this.textbox = document.createElement('input');
       		  				this.textbox.type = 'text';
       		  				this.textbox.style = 'width: 150px;';
       		  				if (0 === C){
       		  					this.textbox.style.marginLeft = '-16px';
       		  				}
	       	  				this.textbox.critical = 1;
       	  					if (typeof this.textbox.trying === 'undefined'){
									this.textbox.trying = [];       	  						
       	  					}	       	  				
	       	  				this.textbox.trying.push('critical');
	       	  				//console.info('ADDING CRITICAL');
       	  					this.textbox.col = C;
       	  					this.textbox.row = R;
       	  					this.textbox.value = ipage[R][C];
       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  						document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
       	  					}
       	  					if (0<parseInt(C)){
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
									document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  					}    
       	  					else{
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
									document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  					}           	  					   	  					
       	  					this.textbox.err_msg = this.dom_factor[C][0][0].error;
       	  					this.textbox.isinvalid = false;
	       	  				this.textbox.onchange = function (e){
									renderer.prove(e, e.target.col, e.target.row, renderer.page);	       	  				
									e.target.isedited = true;	       
	       	  				}
       	  					this.textbox.readOnly = false;	
       	  					this.textbox.onselect = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	 					this.textbox.selecting = false;						
       	  					cells_sum += 1;												
       	  					let tdDiv = document.createElement('td');
	      					tdDiv.appendChild(this.textbox);
	       	  				trDiv.appendChild(tdDiv);
	       	  				continue;  
							}
	            	}
		         	else if (this.dom_factor[C][0][1] !== null){  
		         		if (this.dom_factor[C][0][1].unique !== false){	
		         			//console.info(this.dom_factor[C][0][0].childs);	         			   	    		           	
								if (this.dom_factor[C][0][0].childs.includes(v)){            	
       							this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
       	  						this.textbox.style = 'width: 150px;';    	  						
       	  						this.textbox.readOnly = false;	
       	  						this.textbox.col = C;
       	  						this.textbox.row = R;
       		  					if (0 === C){
       		  						this.textbox.style.marginLeft = '-16px';
       		  					}
	         					this.textbox.onchange = function (e){
										renderer.prove(e, e.target.col, e.target.row, renderer.page);	       	  				
										e.target.isedited = true;	       
       	  						}
       	  						this.textbox.onselect = function(e){
										renderer.tdCombined(e);       	  		
       	  						}	
       	  						if (typeof this.textbox.trying === 'undefined'){
										this.textbox.trying = [];       	  						
         						}
	       	  					this.textbox.trying.push('unique');
       	  						this.textbox.selecting = false;
       	  						console.info(this.dom_factor[C][0][0].error);
       	  						this.textbox.value = this.dom_factor[C][0][0].error;
       	  						this.textbox.err_msg = this.dom_factor[C][0][0].error;
       	  						this.textbox.isinvalid = true;
	       	  					this.textbox.unique = 1;       	  				
       	  						errorCell(this.textbox); //coloriza campo contenido duplicado   
       	  						if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  							document.getElementById('dtype_'+String(C)).innerHTML = 'Exception';
       	  						}
       	  						console.info(C);
       	  						if (0<C){
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
										document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  						}    
       	  						else{
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
										document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  						}           	  
	       	  					errors_sum += 1;		       	
	       	  					cells_sum += 1;	  					
       	  						let tdDiv = document.createElement('td');
	      						tdDiv.appendChild(this.textbox);
	       	  					trDiv.appendChild(tdDiv);
	       	  					continue;  
       	  					}	
								else{
       							this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
       	  						this.textbox.style = 'width: 150px;'; 	  						
       	  						this.textbox.readOnly = false;	
       	  						this.textbox.col = C;
       	  						this.textbox.row = R;
       		  					if (0 === C){
       		  						this.textbox.style.marginLeft = '-16px';
       		  					}
	         					this.textbox.onchange = function (e){
										renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
										e.target.isedited = true;	       
       	  						}
	       	  					//console.info('ADDING UNIQUE');
       	  						this.textbox.onselect = function(e){
										renderer.tdCombined(e);       	  		
       	  						}	
       	  						if (typeof this.textbox.trying === 'undefined'){
										this.textbox.trying = [];       	  						
         						}
         						this.textbox.value = ipage[R][C];
	       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
   	    	  						document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
      	 	  					}
       		  					if (0<parseInt(C)){
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
										document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  						}           
       		  					else{
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
										document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  						}                  	  							 	  					
         						this.textbox.err_msg = this.dom_factor[C][0][0].error;
         						this.textbox.isinvalid = false;
	       	  					this.textbox.trying.push('unique');
       	  						this.textbox.selecting = false;
	       	  					this.textbox.unique = 1;       	  					  
	       	  					cells_sum += 1;	     	  													
       	  						let tdDiv = document.createElement('td');
	      						tdDiv.appendChild(this.textbox);
	       	  					trDiv.appendChild(tdDiv);
	       	  					continue;  
								}
	            		}		       	  									
               		else if (this.dom_factor[C][0][0].re !== false){  
               			let matching = v.match(this.dom_factor[C][0][0].re);    
								if (matching === null){        	
       			 				this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
       	  						this.textbox.style = 'width: 150px;';
       	  						this.textbox.col = C;
       	  						this.textbox.row = R;
       		  					if (0 === C){
       		  						this.textbox.style.marginLeft = '-16px';
       		  					}
       	  						if (typeof this.textbox.trying === 'undefined'){
										this.textbox.trying = [];       	  						
       	  						}       	  				
	        						this.textbox.onchange = function (e){
										renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
										e.target.isedited = true;	       
	       	  					}       	  								
	       	  					this.textbox.trying.push('re');
       	  						errorCell(this.textbox); //coloriza campo contenido duplicado       	  						
       	  						this.textbox.readOnly = false;	
       	  						this.textbox.onselect = function(e){
										renderer.tdCombined(e);       	  		
       	  						}	
       	  						this.textbox.selecting = false;
       	  						errors_sum += 1;
       	  						cells_sum += 1;	
       	  						this.textbox.isinvalid = true;
      	 	  					this.textbox.value = this.dom_factor[C][0][0].error;
      	 	  					this.textbox.err_msg = this.dom_factor[C][0][0].error;
	       	  					this.textbox.re = this.dom_factor[C][0][0].re;		
       	  						if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  							document.getElementById('dtype_'+String(C)).innerHTML = 'Exception';
       	  						}
       	  						
       	  						if (0< C){
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
										document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  						}    
       	  						else{
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
										document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  						}           	  
       	  						let tdDiv = document.createElement('td');
	      						tdDiv.appendChild(this.textbox);
	       	  					trDiv.appendChild(tdDiv);
	       	  					continue;  
       	  					}	
       	  				}					
							else{
       						this.textbox = document.createElement('input');
       	  					this.textbox.type = 'text';
       	  					this.textbox.style = 'width: 150px;'; 	  						
       	  					this.textbox.readOnly = false;	
       	  					this.textbox.col = C;
       	  					this.textbox.row = R;
	         				this.textbox.onchange = function (e){
									renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
									e.target.isedited = true;	       
       	  					}
       		  				if (0 === C){
       		  					this.textbox.style.marginLeft = '-16px';
       		  				}
	       	  				//console.info('ADDING VALID REGEX');
       	  					this.textbox.onselect = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					if (typeof e.trying === 'undefined'){
									e.trying = [];       	  						
         					}
         					this.textbox.value = ipage[R][C];
	       	  				this.textbox.trying.push('unique');
       	  					this.textbox.selecting = false;
       	  					this.textbox.isinvalid = false;
       	  					this.textbox.err_msg = this.dom_factor[C][0][0].error;
       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  						document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
       	  					}
       	  					console.info(C);
       	  					if (0<parseInt(C)){
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
									document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  					}     
       	  					else{
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
									document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  					}    
       	  					cells_sum += 1;	
	       	  				this.textbox.re = this.dom_factor[C][0][0].re;		      	  													
       	  					let tdDiv = document.createElement('td');
	      					tdDiv.appendChild(this.textbox);
	       	  				trDiv.appendChild(tdDiv);
	       	  				continue;  
							}
						}
						else{
       		 			this.textbox = document.createElement('input');
       	  				this.textbox.type = 'text';
       	  				this.textbox.style = 'width: 150px;';
       	  				this.textbox.value = ipage[R][C];
       	  				this.textbox.col = C;
       	  				this.textbox.row = R;
       		  			if (0 === C){
       		  				this.textbox.style.marginLeft = '-16px';
       		  			}
	       	  			this.textbox.onchange = function (e){
								renderer.excel_data[renderer.page][e.target.col][e.target.row] = e.target.value;
								e.target.isedited = true;	    	  				
	       	  			}
       	  				this.textbox.onselect = function(e){
								renderer.tdCombined(e);       	  		
         				}	
       	  				if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  					document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
       	  				}
       	  				if (0<parseInt(C)){
       	  					document.getElementById('dtype_'+String(C)).style.marginLeft = String((C+1)*128)+'px';
								document.getElementById('dtype_'+String(C)).style.paddingLeft = String((C+1)*16)+'px';
       	  				}   
       	  				else{
       	  					document.getElementById('dtype_'+String(C)).style.marginLeft = '128px';
								document.getElementById('dtype_'+String(C)).style.paddingLeft = '16px';
       	  				}           	  				  
         				this.textbox.isinvalid = false;
      	  				this.textbox.selecting = false;
       	  				cells_sum += 1;		
       	  				let tdDiv = document.createElement('td');
	      				tdDiv.appendChild(this.textbox);
	       	  			trDiv.appendChild(tdDiv);
	       	  			continue;  
					  }  						  	
   	       }	
      		 catch (error){
      			console.info(error);
      		 }	  	  			
       	 }
       	 this.trs.push(trDiv); 
		}
		document.getElementById('error_sheets').innerHTML = errors_sum;
		document.getElementById('total_sheets').innerHTML = cells_sum;
		return this.trs;	
  	}

	proveFilled(idx,C,R,Page) {
		if (idx.value !== ''){
  			idx.style.backgroundColor = null;
  			idx.critical = 0;
			this.excel_data[Page][C][R] = idx.value;	 
			idx.isinvalid = false;
  		}
  		else{
			idx.critical = 1;  		
			errorCell(idx);  		
       	idx.value = idx.err_msg;
       	this.excel_data[Page][C][R] = idx.value;	 
       	idx.isinvalid = true;	      	
  		}
	}

	proveUnique(idx,C,R,Page) {
		this.isunique = true;
		if (typeof this.vals_unique === 'undefined'){
			this.vals_unique = [];
		}
		for (var row = 0; row < this.excel_data[Page].length; row++){
			this.vals_unique.push(this.excel_data[Page][row][C]);
			if (row === R){
				if (this.vals_unique.includes(this.excel_data[Page][row][C])){
					this.isunique = false;
				}							
			}
		}
		if (this.isunique === false){
			idx.unique = 1;  		
			errorCell(idx);  
       	idx.value = idx.err_msg;
       	this.excel_data[Page][C][R] = idx.value;	 
       	idx.isinvalid = true;			
  		}
  		else{
  			idx.style.backgroundColor = null;
  			idx.unique = 0;					
			this.excel_data[Page][C][R] = idx.value;	  
			idx.isinvalid = false;  
  		}
	}

	proveRe(idx,C,R,Page) {
		let matching = idx.value.match(idx.re);          	
		if (typeof matching !== 'object'){
			idx.unique = 1;  		
			errorCell(idx);  
       	idx.value = idx.err_msg;	
       	this.excel_data[Page][C][R] = idx.value;	 	
       	idx.isinvalid = true;	
  		}
  		else{
  			idx.style.backgroundColor = null;
  			idx.unique = 0;					
			this.excel_data[Page][C][R] = idx.value;	    
			idx.isinvalid = false;
  		}
	}

	prove(idx,C,R,Page) {
		for (var j = 0; j < idx.target.trying.length; j++) {
			if (idx.target.trying[j] === 'critical'){
				this.proveFilled(idx.target,C,R,Page);
			}
			else if (idx.target.trying[j] === 'unique'){
				this.proveUnique(idx.target,C,R,Page);
			}
			else if (idx.target.trying[j] === 're'){
				this.proveRe(idx.target,C,R,Page);
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
