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
  	alert('INVALID SESSION');
}

var isFirefox = {
    that: function() {
    		console.info(navigator.userAgent);
        return navigator.userAgent.match(/Firefox/i);
    },
};	

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
 		if (h <= 200){
 			console.info(h);
 			document.getElementById('ppbutton').style.height = String(h)+'px'; 
 			document.getElementById('importer-msg').style.marginLeft = '-240px'; 		
 			document.getElementById('importer-msg').style.marginTop = '180px'; 		
 			document.getElementById('importer-img').style.marginLeft = '-235px'; 
 			document.getElementById('importer-msg').style.width = '100px'; 		
 			document.getElementById('importer-img').style.marginTop = '260px'; 	
 		}
 		else{
 			document.getElementById('ppbutton').style.height = String(h)+'px';
 		}
 	}
 	if (typeof w !== 'undefined'){
 		if (w <= 300){
 			console.info(w);
 			document.getElementById('ppbutton').style.width = String(w)+'px'; 
 			document.getElementById('importer-msg').style.marginLeft = '-240px'; 		
 			document.getElementById('importer-msg').style.marginTop = '180px'; 		
 			document.getElementById('importer-img').style.marginLeft = '-235px'; 
 			document.getElementById('importer-msg').style.width = '100px'; 		
 			document.getElementById('importer-img').style.marginTop = '260px'; 	
 		}
 		else{
 			document.getElementById('ppbutton').style.width = String(w)+'px';
 		}	
 	}
}

//got from https://stackoverflow.com/questions/5783969/how-to-get-child-element-by-id-in-javascript by Gil Epshtain and marc_s to remove jquery dependency
var _Utils = function ()
{
    this.findChildById = function (element, childID, isSearchInnerDescendant) // isSearchInnerDescendant <= true for search in inner childern 
    {
        var retElement = null;
        var lstChildren = isSearchInnerDescendant ? Utils.getAllDescendant(element) : element.childNodes;

        for (var i = 0; i < lstChildren.length; i++)
        {
            if (lstChildren[i].id == childID)
            {
                retElement = lstChildren[i];
                break;
            }
        }

        return retElement;
    }

    this.getAllDescendant = function (element, lstChildrenNodes)
    {
        lstChildrenNodes = lstChildrenNodes ? lstChildrenNodes : [];

        var lstChildren = element.childNodes;

        for (var i = 0; i < lstChildren.length; i++) 
        {
            if (lstChildren[i].nodeType == 1) // 1 is 'ELEMENT_NODE'
            {
                lstChildrenNodes.push(lstChildren[i]);
                lstChildrenNodes = Utils.getAllDescendant(lstChildren[i], lstChildrenNodes);
            }
        }

        return lstChildrenNodes;
    }        
}
var Utils = new _Utils;

//AS THREAD
function table_maker(Options, workbook){
	//Usando los campos del objeto en JSON
	//devuelve un objeto que contiene la
	//representación de esos datos en el DOM
	if (typeof Options !== 'object'){
		return 'validationError';
	}
	if (typeof Options['apiKey'] === 'undefined'){
		return 'validationError';
	}
	else if (Options['apiKey'] === ''){
		return 'validationError';	
	}
	//console.info('RUNNING AJAX REQUEST');
   var xhr = new XMLHttpRequest();
   xhr.open('GET', 'https://app.cencilio.com/api/1.1/obj/account/'+Options['apiKey'], true); 	
   xhr.setRequestHeader('Content-Type', 'application/json');	
   xhr.onload = function (data) {
   	//console.info(data.currentTarget.response);
   	//console.info(data.target.response);
   	let resp = data.currentTarget.response;
		if (resp.id !== null) {
   		if (Options['userId'] !== null){	
				renderer.split_resp = resp.split('}');
				renderer.split_resp = renderer.split_resp.slice(0, -1);
				renderer.split_resp += '"_mail": "'+Options['userId']+'"';
				renderer.split_resp += '}}';		 
   		}
   		else{
				renderer.split_resp = resp;   		
   		}
			//console.info('SESSION IS VALID');
			renderer.dom_factor = [];
	  		renderer.sheetDiv = document.createElement('div');
			renderer.sheetDiv.className='sheet_div'; 
			renderer.sheetDiv.id='sheet_div'; 
			renderer.sheetDiv.style='overflow-x: hidden; position: absolute;z-index: 4;top: 50%;padding: 16px;width: 72%;margin-left: 194px;border-radius: 4px;height: 80%;overflow-y: scroll;/* margin: 0; */-ms-transform: translateY(-50%);transform: translateY(-50%);border: 1px solid #DEDEDE;box-sizing: border-box;box-shadow: 0px 4px 38px rgba(0, 0, 0, 0.4);border-radius: 4px;';
			//cencilio default background color
			if (typeof Options['theme']['global']['backgroundColor'] === 'undefined'){
				renderer.sheetDiv.style.backgroundColor = 'rgb(180, 178, 183)';
				document.getElementById('raw_response_header').style.backgroundColor = 'rgb(180, 178, 183)';
				document.getElementById('data_exported').style.backgroundColor = 'rgb(180, 178, 183)';
				//document.getElementById('cencilio-importer').style.backgroundColor = 'repeating-linear-gradient(90deg, #9c989b, #c7c7c7 51%, #8a00c7) var(--x, 0)/ 400%';
				document.getElementById('ppbutton').style.backgroundColor = 'repeating-linear-gradient(90deg, #9c989b, #c7c7c7 51%, #8a00c7) var(--x, 0)/ 400%';
			}
			else{ //cencilio user background color
				if (Options['theme']['global']['backgroundColor'].length <= 7){
					if (Options['theme']['global']['backgroundColor'].includes('#')){
						renderer.sheetDiv.style.backgroundColor = Options['theme']['global']['backgroundColor'];
						document.getElementById('raw_response_header').style.backgroundColor = Options['theme']['global']['backgroundColor'];
						document.getElementById('data_exported').style.backgroundColor = Options['theme']['global']['backgroundColor'];
						//document.getElementById('cencilio-importer').style.backgroundColor = Options['theme']['global']['backgroundColor'];
						document.getElementById('ppbutton').style.backgroundColor = Options['theme']['global']['backgroundColor'];
					}
				}
			}
			//cencilio default text color
			if (typeof Options['theme']['global']['textColor'] === 'undefined'){
				renderer.sheetDiv.style.color = '#9400d3';
				document.getElementById('raw_response_header').style.color = '#9400d3';
				document.getElementById('data_exported').style.color = '#9400d3';
				document.getElementById('cencilio-importer').style.color = '#9400d3';
			}
			else{ //cencilio user text color
				if (7 <= Options['theme']['global']['textColor'].length <= 9){
					if (Options['theme']['global']['textColor'].includes('#')){
						renderer.sheetDiv.style.color = Options['theme']['global']['textColor'];
						document.getElementById('raw_response_header').style.color = Options['theme']['global']['textColor'];
						document.getElementById('data_exported').style.color = Options['theme']['global']['textColor'];
						document.getElementById('cencilio-importer').style.color = Options['theme']['global']['textColor'];
					}
				}
			}
			//cencilio user defined font color
 			if (typeof Options['theme']['global']['fontFamily'] !== 'undefined'){
 				renderer.sheetDiv.style.fontFamily = Options['theme']['global']['fontFamily']; 
 				document.getElementById('raw_response_header').style.fontFamily = Options['theme']['global']['fontFamily'];
 				document.getElementById('data_exported').style.fontFamily = Options['theme']['global']['fontFamily'];
 				document.getElementById('cencilio-importer').style.fontFamily = Options['theme']['global']['fontFamily'];
 			} 				
	  		renderer.sheetDivChildStrong = document.createElement('strong');
	  		renderer.sheetDivChildStrong.id = 'cencilio_file_name';
			renderer.sheetDivChildStrong.style='font-family: "Gotham Black";margin-left: 32px;font-size: 18px;position: absolute;margin-top: 6px;color: rgb(148, 0, 211);display: inline-block;text-overflow: ellipsis;overflow: hidden;width: 222px;white-space: nowrap;';
			renderer.sheetDivChildStrong.innerHTML = '';
			//cencilio default shadow color
			if (typeof Options['theme']['global']['shadowColor'] === 'undefined'){
				renderer.sheetDiv.style.boxShadow = 'rgb(210, 191, 241) 0px 2px 8px 5px;';
				document.getElementById('raw_response_header').style.boxShadow = 'rgb(210, 191, 241) 0px 2px 8px 5px;';
			}
			else{ //cencilio user shadow color
				if (7 <= Options['theme']['global']['shadowColor'].length <= 9){
					if (Options['theme']['global']['shadowColor'].includes('#')){
						renderer.sheetDiv.style.boxShadow = Options['theme']['global']['shadowColor'];
						document.getElementById('raw_response_header').style.boxShadow = Options['theme']['global']['shadowColor'];
					}
				}
			}
			//cencilio default JSON background color
			if (typeof Options['theme']['global']['jsDataColor'] === 'undefined'){
				document.getElementById('js_data').style.boxShadow = 'rgb(0 0 0 / 16%)';
			}
			else{ //cencilio user JSON background color
				if (7 <= Options['theme']['global']['jsDataColor'].length <= 9){
					if (Options['theme']['global']['jsDataColor'].includes('#')){
						document.getElementById('js_data').style.boxShadow = Options['theme']['global']['jsDataColor'];
					}
				}
			}
	  		renderer.sheetDivGrandChildSpan = document.createElement('span');
			renderer.sheetDivGrandChildSpan.style='max-height: 144px;margin-left: 276px;margin-top: -106px;position: absolute;';
			renderer.sheetDivGrandChildSpan.innerHTML='Total:';
	  		renderer.sheetDivGrandChildLabel = document.createElement('label');
			renderer.sheetDivGrandChildLabel.style='max-height: 144px;margin-left: 318px;margin-top: -106px;position: absolute;';
			renderer.sheetDivGrandChildLabel.id='total_sheets';
			renderer.sheetDivGrandChildLabel.innerHTML = '0';
	  		renderer.sheetDivGrandChildSpan2 = document.createElement('span');
			renderer.sheetDivGrandChildSpan2.style='max-height: 174px; position: absolute; margin-top: -106px; margin-left: 340px;';
			renderer.sheetDivGrandChildSpan2.innerHTML = '| Con errores:'; 
	  		renderer.sheetDivGrandChildLabel2 = document.createElement('label');
			renderer.sheetDivGrandChildLabel2.style='max-height: 144px;margin-top: -106px;position: absolute;margin-left: 440px;';
			renderer.sheetDivGrandChildLabel2.id='error_sheets'; 
			renderer.sheetDivGrandChildLabel2.innerHTML = '0';
	  		renderer.sheetDivGrandChildButton = document.createElement('button');
			renderer.sheetDivGrandChildButton.id='cargar'; 
			renderer.sheetDivGrandChildButton.type = 'button';
			renderer.sheetDivGrandChildButton.onclick = function(e){
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
				//console.info(JSON.parse(jsonData));
				//document.getElementById('js_data').innerHTML = jsonData; //copy data to HTML			
				fs.writeFile(renderer.file_name+".json", jsonData, (err) => {
    				if (err) {
        				console.error(err);
        				return;
    				};
    				//console.log("Datos cargados correctamente.");
				});
			}
			renderer.sheetDivGrandChildButton.name='cargar';
			renderer.sheetDivGrandChildButton.class='cargar'; 
			renderer.sheetDivGrandChildButton.style='height: 36px;width: 122px;border-width: 0px;margin-left: 720px;border-radius: 16px;padding: 8px;margin-top: -114px;position: absolute;';
			renderer.sheetDivGrandChildButtonChild = document.createElement('img'); 
			renderer.sheetDivGrandChildButtonChild.src='https://assets.cencilio.com/info.png'; 
			renderer.sheetDivGrandChildButtonChild.style='height: 16px;width: 16px;margin-left: -76px;margin-top: -2px;';
			renderer.sheetDivGrandChildButtonLabel = document.createElement('label');  
			renderer.sheetDivGrandChildButtonLabel.style='height: 20px;margin-top: 5px;margin-left: 3px;font-size: 9px;position: absolute;';
			renderer.sheetDivGrandChildButtonLabel.innerHTML = 'CARGAR DATOS';
			//default primary button color
			//console.info(Options['theme']['global']['primaryButtonColor']);
			if (typeof Options['theme']['global']['primaryButtonColor'] === 'undefined'){
				renderer.sheetDivGrandChildButton.style.backgroundColor = 'blue';
				document.getElementById('close_button').style.backgroundColor = 'blue';
			}
			else{ //user primary button color
				if (7 <= Options['theme']['global']['primaryButtonColor'].length <= 9){
					if (Options['theme']['global']['primaryButtonColor'].includes('#')){
						renderer.sheetDivGrandChildButton.style.backgroundColor = Options['theme']['global']['primaryButtonColor'];
						document.getElementById('close_button').style.backgroundColor = Options['theme']['global']['primaryButtonColor'];
					}
				}
			}
			//cencilio default primary text color
			if (typeof Options['theme']['global']['primaryTextColor'] === 'undefined'){
				renderer.sheetDivGrandChildButtonLabel.style.color = 'darkviolet';
			}
			else{ //cencilio user primary text color
				if (7 <= Options['theme']['global']['primaryTextColor'].length <= 9){
					if (Options['theme']['global']['primaryTextColor'].includes('#')){
						renderer.sheetDivGrandChildButtonLabel.style.color = Options['theme']['global']['primaryTextColor'];
					}
				}
			}			
			renderer.sheetDivGrandChildOptions = document.createElement('div');  
			renderer.sheetDivGrandChildOptions.style='max-height: 144px;';
			renderer.sheetDivGrandChildOptions.id = 'options_xlsx';
			renderer.sheetDivGrandChildOptionsDiv = document.createElement('div');  
			renderer.sheetDivGrandChildOptionsDiv.style='max-height: 144px;';
			renderer.sheetDivGrandChildOptionsDiv.id = 'sheets_span';
			renderer.sheetDivGrandChildOptionsDivSpan = document.createElement('span');  
			renderer.sheetDivGrandChildOptionsDivSpan.style='font-weight: 400; max-height: 144px;margin-top: 18px;margin-left: 32px;position: absolute;';
			renderer.sheetDivGrandChildOptionsDivSpan.innerHTML = 'Instrucciones:'; 
			renderer.sheetDivGrandChildOptionsDivLabel = document.createElement('label');  
			renderer.sheetDivGrandChildOptionsDivLabel.style='max-height: 144px; font-weight: 400; width: 40%;margin-left: 140px;margin-top: 18px;';
			renderer.sheetDivGrandChildOptionsDivLabel.id = 'instruction'; 
			renderer.sheetDivGrandChildOptionsDivLabel.innerHTML = 'Selecciona la página que necesites validar y corrobora que no hayan errores.';
			renderer.sheetDivCheckInvalid = document.createElement('input');  
			renderer.sheetDivCheckInvalid.style='width: 24px;height: 258px;margin-left: 690px;margin-top: -141px;';
			renderer.sheetDivCheckInvalid.id = 'show_errors'; 
			renderer.sheetDivCheckInvalid.type='checkbox'; 
			renderer.sheetDivCheckInvalid.onchange = function(e){
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
			renderer.sheetDivCheckChanged = document.createElement('input');  
			renderer.sheetDivCheckChanged.style='width: 24px;height: 24px;margin-left: 500px;margin-top: -48px;';
			renderer.sheetDivCheckChanged.id = 'show_changed'; 
			renderer.sheetDivCheckChanged.type='checkbox'; 
			renderer.sheetDivCheckChanged.onchange = function(e){
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
			renderer.sheetDivCheckInvalidLabel = document.createElement('label');  
			renderer.sheetDivCheckInvalidLabel.style='max-height: 144px;width: 40%;margin-left: 720px;margin-top: -138px;position: absolute;';
			renderer.sheetDivCheckInvalidLabel.id = 'show_errors_label'; 
			renderer.sheetDivCheckInvalidLabel.innerHTML = 'Mostrar filas con errores';
			renderer.sheetDivCheckChangedLabel = document.createElement('label');  
			renderer.sheetDivCheckChangedLabel.style='max-height: 144px;width: 40%;margin-left: 530px;margin-top: -138px;position: absolute;';
			renderer.sheetDivCheckChangedLabel.id = 'show_changed_label'; 
			renderer.sheetDivCheckChangedLabel.innerHTML = 'Mostrar filas editadas';
			renderer.sheetDivSpan2 = document.createElement('span');  
         renderer.sheetDivSpan2.innerHTML = 'Sólo fila inválida';
         renderer.sheetDivSpan2.style = 'margin-top: -140px;position: absolute;margin-left: 32px;font-size: 80%;';						
			renderer.sheetDivGrandChildOptionsDiv2 = document.createElement('div');  
			renderer.sheetDivGrandChildOptionsDiv2.style='overflow-y: scroll; overflow-x: hidden; max-height: 144px;';
			renderer.sheetDivGrandChildOptionsDiv2.id = 'mensajes';
			renderer.sheetDivGrandChildOptionsDiv.appendChild(renderer.sheetDivGrandChildOptionsDivSpan);
			renderer.sheetDivGrandChildOptionsDiv.appendChild(renderer.sheetDivGrandChildOptionsDivLabel);			
			renderer.sheetDivGrandChildOptions.appendChild(renderer.sheetDivGrandChildOptionsDiv);
			renderer.sheetDivGrandChildButton.appendChild(renderer.sheetDivGrandChildButtonChild);
			renderer.sheetDivGrandChildButton.appendChild(renderer.sheetDivGrandChildButtonLabel);
	  		renderer.sheetDivGrandChildDiv = document.createElement('div');
			renderer.sheetDivGrandChildDiv.id='sheets_span';
			renderer.sheetDivGrandChildDiv.placeholder='Nombre de hoja'; 
			renderer.sheetDivGrandChildDiv.style='max-height: 144px; padding: 2px;';
			renderer.sheetDivGrandChildDiv.appendChild(renderer.sheetDivGrandChildOptions);
			renderer.sheetDivGrandChildDiv.appendChild(renderer.sheetDivGrandChildSpan);
			renderer.sheetDivGrandChildDiv.appendChild(renderer.sheetDivGrandChildButton);
			renderer.sheetDivGrandChildDiv.appendChild(renderer.sheetDivGrandChildLabel);
			renderer.sheetDivGrandChildDiv.appendChild(renderer.sheetDivGrandChildSpan2);
			renderer.sheetDivGrandChildDiv.appendChild(renderer.sheetDivGrandChildLabel2);			
	  		renderer.sheetDivChildDiv = document.createElement('div');
			renderer.sheetDivChildDiv.id='header_xlsx';
			renderer.sheetDivChildDiv.style='max-height: 144px;';
	  		let sheetDivChildInput = document.createElement('select');
			sheetDivChildInput.id='sheet_select';
			sheetDivChildInput.placeholder='Nombre de hoja'; 
			sheetDivChildInput.style='max-height: 144px;width: 136px;margin-top: 2px;margin-left: 506px;border-radius: 2px;height: 32px;margin-bottom: 16px;';
			sheetDivChildInput.onchange = function(e){
				//console.info('PAGE IS', workbook.SheetNames.indexOf(e.target.value));
				let sheet = renderer.loadTable(workbook.SheetNames.indexOf(e.target.value));
				renderer.page = 0;	
				//console.info('DONE LOADING SHEET');
				for(var c = 2; c <= document.getElementById('sheet_div').length; ++c){
					//console.info(sheet[c-2]);
					//console.info(document.getElementById('sheet_div').childNodes[c]);
					document.getElementById('sheet_div').childNodes[c] = sheet[c-2];		
				}
				renderer.page_shift = false;
			}			
			let sheetDivTable = document.createElement('table');  
			sheetDivTable.style = 'position: relative;';
			let sheetDivHead = document.createElement('thead');  
			let sheetDivTableBody = document.createElement('tbody');  
         sheetDivTableBody.id='sheet_rows';
			let sheetFieldSelector = document.createElement('tr');  
			sheetFieldSelector.style = 'position: relative;';
			sheetDivTableBody.appendChild(sheetFieldSelector);			
			let sheetDivDtypeRow = document.createElement('tr');  
			sheetDivDtypeRow.style = 'position: relative;';
			sheetDivTableBody.appendChild(sheetDivDtypeRow);
			sheetDivTable.appendChild(sheetDivTableBody);
			sheetDivTable.appendChild(sheetDivHead);
			let fields = Options['fields'];
			//console.info(renderer.dom_factor);
			//console.info(fields);
			for (var j = 0; j < fields.length; j++) {
				//console.info(renderer.dom_factor);
				if (typeof fields[j]['validators'] !== 'undefined'){
					let validators = new ElReqs();
					//console.info(fields[j]['validators'][0].validate);
					//console.info(renderer.dom_factor);
					//console.info(fields[j]['validators'] === null);
					//console.info(typeof fields[j]['validators'] === 'undefined');
					for(var set = 0; set <= fields[j]['validators'].length; ++set){
						try{
							//console.info(fields[j]['validators'][set]);
							//console.info(typeof fields[j]['validators'][set] === 'undefined');
							//console.info(renderer.dom_factor);
							if (typeof fields[j]['validators'][set] === 'undefined'){
								continue;				
							}
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
							//console.info(renderer.dom_factor);
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
							//console.info(renderer.dom_factor);
							console.info(error);
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
			}
			//console.info(renderer.dom_factor);
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
	  				sheetDivChildInput.appendChild(pageOption);
	  				var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
	  				let page_data = [];
	  				//dtype checkbox 
					let sheetDivTableD = document.createElement('td');  
					let sheetDivTableDIn = document.createElement('input'); 
					sheetDivTableDIn.id='select_all'; //place selector in ground empty
					sheetDivTableDIn.onchange = function(e){
						if (e.target.incoming === 'show_changed'){
							renderer.render_edited_page(e.target.checked);
						}
						if (e.target.incoming === 'show_errors'){
							renderer.render_invalid_page(e.target.checked);
						}
					}; 
					sheetDivTableDIn.type='checkbox'; 
					sheetDivTableDIn.style='width: 24px;height: 24px;margin: 68px 16px 16px 32px;position: relative;margin-top: -47px;';	
					//getElementById returns null!
					//child is added to structure before substracting another 
					if (Utils.findChildById(sheetDivDtypeRow,'select_all',true) === null){				 
						sheetDivTableD.appendChild(sheetDivTableDIn);	
					}
					sheetDivDtypeRow.appendChild(sheetDivTableD);
					//dtype labels		
					let colsize = range.e.c;	
					//console.info(colsize);	
					let selectorIncrement = 125;		
					//console.info(sheet);
	  				for(var vtypei = 0; vtypei <= colsize; ++vtypei) {
						let tdLabelShiftDiv = document.createElement('div');  
						tdLabelShiftDiv.style = 'max-height: 144px;font-size: 12px;margin-right: 16px;position: relative;width: 80px;margin-left: 54px; margin-top: -16px';
						if (vtypei !== 0){
							tdLabelShiftDiv.style.marginLeft = '54px';					
						}
						else{
							tdLabelShiftDiv.style.marginLeft = '125px';							
						}
						let tdLabelSelector = document.createElement('select');  
						tdLabelSelector.id='select_all_selector_'+String(vtypei); 
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
								//console.info(renderer.dom_factor[vtypec]);
								selectOption.value = renderer.dom_factor[vtypec][0][0].key;
								//console.info('VERTICAL COLUMN TRAVERSE', selectOption.value);
								tdLabelSelector.choices.push(renderer.dom_factor[vtypec][0][0].key);
								selectOption.innerHTML = renderer.dom_factor[vtypec][0][0].label;
								if (vtypei === vtypec){
									selectOption.defaultSelected = true;	
									tdLabelSelector.prev = renderer.dom_factor[vtypec][0][0].key;							
								}
								tdLabelSelector.appendChild(selectOption);
							}
							catch (error){
								//console.info('Faltan argumentos para renderizar columnas'); //no hay argumentos === no hay columnas
								console.info(error);
							}
						};  	
						vtypec = 0;
						selector_size = range.e.c;	
						tdLabelShiftDiv.appendChild(tdLabelSelector);
						tdFieldSelector.appendChild(tdLabelShiftDiv);	
						tdFieldSelector.id='selectortd_'+vtypei;
						//CHILDS WITH TDS OUTSIDE			
						if (Utils.findChildById(sheetFieldSelector,tdLabelSelector.id,true) !== null){	
							//console.info(tdFieldSelector.id);
							continue;			
						}														
						sheetFieldSelector.appendChild(tdFieldSelector);	
						let tdDtypeCol = document.createElement('td');  
						let dtypeColSpan = document.createElement('span');  
						dtypeColSpan.id = 'dtype_'+String(vtypei);  
						if (document.getElementById(dtypeColSpan.id) !== null){
							//console.info('DTYPE SPAN ALREADY EXISTS');
						}														
						dtypeColSpan.style = 'max-height: 144px;font-size: 12px;margin-right: 16px;/* margin-top: 16px; */position: relative;display: block;padding-left: 16px; margin-left: -32px';
						//dtypeColSpan.innerHTML = vtypei;
						sheetDivDtypeRow.appendChild(tdDtypeCol);							
						tdDtypeCol.appendChild(dtypeColSpan);							
					}  		
	  				for(var R = range.s.r; R <= range.e.r; ++R) { //R = row   
	  					if (typeof renderer.falsable_cells[sh] === 'undefined'){
	  						renderer.falsable_cells.push([]);					
	  					}
	  					page_data.push([]);
	  					renderer.falsable_cells[sh].push([]);
	      			for(var C = range.s.c; C <= range.e.c; ++C) { //C = col
	         			/* find the cell object */
	            		var cellref = XLSX.utils.encode_cell({c:C, r:R}); // construct A1 reference for cell
		         		if(!sheet[cellref]) continue; // if cell doesn't exist, move on
	   	      		var cell = sheet[cellref];
	   	      		let v = String(cell.v); //string parse the value in cell
	   	      		page_data[R].push(v);
	   	      		//renderer.falsable_cells[sh].push([]);  
	   	      		renderer.falsable_cells[sh][R][C] = false;
         			}	       	
	   			}
	   			renderer.excel_data[sh] = page_data; //element-wise
	   			//console.info(renderer.excel_data);	   			
				}
				catch (error){ //looping sums 1
					console.info(error);
				}
	   	}
	   	renderer.page = 0;
	   	renderer.sheetDivTable = sheetDivTable;
	   	renderer.sheetDivChildInput = sheetDivChildInput;
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivChildStrong);
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivChildInput);
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivGrandChildDiv);
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivCheckChanged);
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivCheckInvalid);
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivCheckChangedLabel);
			renderer.sheetDivChildDiv.appendChild(renderer.sheetDivCheckInvalidLabel);
			renderer.sheetDiv.appendChild(renderer.sheetDivChildDiv);
			renderer.sheetDiv.appendChild(renderer.sheetDivTable); 
			let closeRenderer = document.createElement('button');
			closeRenderer.style = 'position: absolute;margin-top: -442px;z-index: 1000;border-radius: 8px;background-color: white;border: 0px;width: 27px;height: 27px;';
			closeRenderer.onclick = function(e){
				document.getElementById('sheet_div').remove();			
			}
			closeRenderer.id = 'close_sheet';
			let closeImg = document.createElement('img');
			closeImg.src='close.png';
			closeImg.style='width: 20px;height: 26px;height: 20px;margin-left: -3px;';
			let tableScrollDiv = document.createElement('div');
			tableScrollDiv.style = 'overflow-x: scroll; height: 300px; overflow-y: scroll;max-width: 930px;table-layout: fixed;';
			tableScrollDiv.id = 'page_table';
			tableScrollDiv.appendChild(renderer.sheetDivTable);
			renderer.sheetDiv.appendChild(tableScrollDiv);		
			closeRenderer.appendChild(closeImg);			
			document.body.appendChild(renderer.sheetDiv);
			document.getElementById('sheet_div').appendChild(closeRenderer);	
			renderer.prev_exp = 0; //start transversal		
	   	let sheet1 = renderer.loadTable(0);	
	   	for (var s = 0; s < sheet1.length; s++) {
	   		document.getElementById('page_table').appendChild(sheet1[s]);	
	   	}
	   	renderer.sheetDivChildStrong.innerHTML = renderer.file_name;
			//CONSENT BEFORE DATA STRUCTURE BEFORE VALIDITY	
			renderer.complete = true;   	
			renderer.set_virtual = false;
			return renderer.split_resp;
		}				
		else if (data.currentTarget.response.statusCode === 404){
			console.info('validationError');	
			return 'validationError';				
		}
  	};
  	//console.info('SENDING API REQUEST');
   xhr.send();
}

function renderFun(file, config){
	/*Función que toma la configuración del módulo como argumento
	y el nombre de archivo cargado mediante drag and drop para renderizar el documento.
	*/
	//console.info(config);
	//console.info(typeof config);
	renderer.excel_data = [];
	renderer.falsable_cells = [] //virtual structure that responds with an error
	//console.info(document.getElementById('profpic'));
	try{
		//console.info(document.getElementById('pIn'));
	  	var reader = new FileReader();
	  	let next_col = false;
	  	reader.onloadend = function(e) {
     		document.getElementById('percent').style.width = '65%';
     		document.getElementById('percent').style.padding = '2px';
     		document.getElementById('percent').textContent = '100%';
     		//setTimeout("document.getElementById('progress_bar').className='';", 300);
	  		var data = e.target.result;
	  		data = new Uint8Array(data);
	  		//process_wb(XLSX.read(data, {type: 'array'}));
	  		/* read the file */
			//console.info(data);	  		
	  		var workbook = XLSX.read(data, {type: 'array'}); // parse the file
	  		//console.info(range);
			//USER BASED
			//console.info(config);			
			table_maker(config, workbook);
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
      		document.getElementById('percent').style.backgroundColor= '#99ccff';
      		//document.getElementById('progress_bar').style.width = '200px';
			   // Increase the progress bar length.
			   //if (percentLoaded <= 100) {
			   //   document.getElementById('p%').style.width = percentLoaded + '%';
			   //	document.getElementById('p%').textContent = percentLoaded + '%';
				//}
			}
    	};
    	reader.onabort = function (e) {
      	e.abort();
    	};    		
    	reader.onloadstart = function (e) {
      	document.getElementById('progress_bar').style.opacity =  '1';
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
		this.complete = false;
		this.page_shift = false;
		this.set_virtual = true;
		let dragger = document.getElementById('cencilio-importer');	
		dragger.className = 'dragger';
		//dragger.id = 'xls_dragger';
		dragger.style = 'position: absolute;margin-left: 860px;z-index: -1;height: 200px;width: 300px;/* display: none; */';
		dragger.draggable = true;
		dragger.ondragstart = function (event) {
    		event.dataTransfer.setData('application/vnd.ms-excel', null); //cannot be empty string
		}
		dragger.ondragover = function(event) {
  			event.preventDefault();
		};
		dragger.ondrop = function(ev) {
			ev.preventDefault();
  			if (ev.dataTransfer.items) {
    			var file = ev.dataTransfer.items[0].getAsFile();
				renderFun(file,config);  
  			} else {
    			var file = ev.dataTransfer.files[0];
  				//console.info(config);
				renderFun(file,config);    	
  			}				
		};
		let draggerForm = document.createElement('form');	
		draggerForm.className = 'pimg';
		draggerForm.id = 'pimg';
		draggerForm.style = 'visibility: hidden;margin-top: 146px;position: absolute;margin-left: -350px;width: 324px;height: 280px;';
		draggerForm.enctype = 'multipart/form-data';
		let draggerInput = document.createElement('input');	
		draggerInput.type = 'file';
		draggerInput.id = 'pIn';
		draggerInput.accept = '.xlsx, .xls, .csv';
		draggerInput.style='/* display: none; *//* visibility: hidden; */height: 282px; z-index: 1000; width: 464px;margin-left: 0px;margin-top: 0px;';
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
		draggerLabel.id='importer-msg';
		draggerLabel.style='position: absolute;margin-left: -240px;margin-top: 188px;width: 382px;';
		let draggerImg2 = document.createElement('img');	
		draggerImg2.src = 'icons.png';
		draggerImg2.id='importer-img';
		draggerImg2.style='height: 78px; width: 65px; margin-left: -135px; margin-top: 244px; position: absolute;';
		dragger.appendChild(draggerImg2);
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
			uploadxls();
		}; 				
		excelButton.style = 'width: 465px;height: 282px;margin-top: 140px;position: absolute;opacity: 0.3;border: 2px dashed lightyellow;margin-left: -340px;'; 	
		dragger.appendChild(draggerLabel);
		dragger.appendChild(excelButton);		
		let dataExportDiv = document.createElement('div');
		dataExportDiv.id = 'data_exported';
		dataExportDiv.name = 'data_exported';
		dataExportDiv.className = 'data_exported'; 	
		dataExportDiv.style='background-color: rgb(180, 178, 183);box-shadow: rgb(138, 82, 231) 0px 2px 8px 5px;position: absolute;display: none; z-index: 7;margin-left: 396px;width: 458px;margin-top: 166px;border-radius: 4px;color: rgba(101, 0, 211, 0.82);';
		let dataExportSpan = document.createElement('span');
		dataExportSpan.style = 'max-height: 144px;margin-left: 56px;font-size: 20px;';
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
		headerDiv.style = 'position: absolute; display: none; justify-content:center;margin-left: 0px;width: 273px;margin-top: 8px;height: 42px;background-color: #b05cc5b8;border-radius: 4px;margin-left: 8px;box-shadow: rgb(231 82 220 / 44%) 0px 2px 8px 5px;';		
		let headerLabel = document.createElement('label');
		headerLabel.style = 'background: transparent;height: 240px;width: 208px;border-width: 0px;margin-top: 10px;margin-left: 56px;';		
		headerLabel.innerHTML = 'Raw response header';
		let headerHR = document.createElement('hr');
		let headerLabel2 = document.createElement('label');
		headerLabel2.style = 'height: 226px;width: 270px;border-width: 0px;margin-top: -247px;position: absolute;border-radius: 8px;margin-left: 2px;font-size: 12px;padding: 16px; overflow-y: scroll;';		//overflow-y: scroll; overflow-x: hidden;
		headerLabel2.id = 'js_data';
		headerDiv.appendChild(headerLabel);
		headerDiv.appendChild(headerHR);
		headerDiv.appendChild(headerLabel2);
		let progressBarDiv = document.createElement('div'); 	
		progressBarDiv.className = 'progress_bar';
		progressBarDiv.id = 'progress_bar';		
		progressBarDiv.name = 'progress_bar';		
		progressBarDiv.style = 'display: block;/* margin-top: 20px; */background-color: rgb(142, 53, 53);height: 40px;width: 400px;border-radius: 12px;position: absolute;margin-left: 480px;opacity: 1;top: 8%;/* margin: 0; */-ms-transform: translateY(-50%);transform: translateY(-50%);';	
		let progressBarLabel = document.createElement('label'); 	
		progressBarLabel.className = 'pmsg';
		progressBarLabel.id = 'pmsg';		
		progressBarLabel.name = 'pmsg';		
		progressBarLabel.style = 'font-size: 14px; margin-left: 32px; margin-top: 10px; color: white;';	
		progressBarLabel.innerHTML = 'Uploading';	
		let progressBarChildDiv = document.createElement('div'); 	
		progressBarChildDiv.className = 'percent';
		progressBarChildDiv.id = 'percent';		
		progressBarChildDiv.name = 'percent';		
		progressBarChildDiv.style = 'font-size: 16px;margin-left: 120px;margin-top: -26px;width: 65%;border-radius: 4px;height: 55%;color: white;background-color: rgb(153, 204, 255);';	
		let progressBarChildDivLabel = document.createElement('label'); 	
		progressBarChildDivLabel.className = 'p%';
		progressBarChildDivLabel.id = 'p%';		
		progressBarChildDivLabel.name = 'p%';		
		progressBarChildDivLabel.style='width: 100%;margin-left: 16px;';
		progressBarChildDivLabel.innerHTML = '0%';
		progressBarDiv.appendChild(progressBarLabel);
		progressBarChildDiv.appendChild(progressBarChildDivLabel);
		progressBarDiv.appendChild(progressBarChildDiv);
		document.body.appendChild(progressBarDiv);
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
			//console.info(renderer.falsable_cells[renderer.page][renderer.cells_names_selected[0].col][renderer.cells_names_selected[0].row]);
			renderer.falsable_cells[renderer.page][renderer.cells_names_selected[0].col][renderer.cells_names_selected[0].row] = false;
			renderer.cells_names_selected[1].value = ''; 
			renderer.excel_data[renderer.page][renderer.cells_names_selected[1].col][renderer.cells_names_selected[1].row] = '';
			//if (renderer.cells_names_selected[0].row !== renderer.cells_names_selected[1].row){ //column combined
				//renderer.cells_names_selected[0].style.height = '66px';
				//if (renderer.cells_names_selected[0].col < renderer.cells_names_selected[1].col){
				//	renderer.cells_names_selected[0].style.marginTop = '0px';
				//}
				//else if (renderer.cells_names_selected[1].col < renderer.cells_names_selected[0].col){
				//	renderer.cells_names_selected[0].style.marginTop = '-32px';
				//}
				//renderer.cells_names_selected[0].style.position = 'none';
				//let parentSelected = renderer.cells_names_selected[0].parentElement;
				//let grandParentSelected = parentSelected.parentElement;
				//let parentSelectedChildren = grandParentSelected.childNodes;
				//for (var tds = 0; tds < parentSelectedChildren.length; tds++){
				//	let selectedChildren = parentSelectedChildren[tds].childNodes;			
				//	for (var neighbor = 0; neighbor < selectedChildren.length; neighbor++){
				//		if (selectedChildren[neighbor].value === renderer.cells_names_selected[0].value){
				//			selectedChildren[neighbor].style.marginTop = '-31px';
				//			continue;
				//		}
				//		else if (selectedChildren[neighbor].value === renderer.cells_names_selected[1].value){
				//			continue;
				//		}
				//		else if (selectedChildren[neighbor].style.marginTop !== '0px'){ //cell uncombined
				//			if (renderer.cells_names_selected[0].col < renderer.cells_names_selected[1].col){
				//				selectedChildren[neighbor].style.marginTop = '-31px';
				//			}
				//			else{
				//				selectedChildren[neighbor].style.marginTop = 'none';
				//			}
				//		}
				//	}
				//}
				//renderer.cells_names_selected[1].style.visibility = 'hidden';
			//}
			//else{ //row combined
			//	renderer.cells_names_selected[0].style.width = '300px';
			//	let pivot_from = renderer.cells_names_selected[0].row+2;
			//	let parentSelected = renderer.cells_names_selected[0].parentElement;
			//	let parentSelectedChildren = parentSelected.childNodes;
			//	for (var neighbor = 0; neighbor < parentSelectedChildren.length; neighbor++){
			//		if (parentSelectedChildren[neighbor].row+2 === pivot_from){
			//			parentSelectedChildren[neighbor].style.marginLeft = '-150px'; //shift back neighbors in row
			//		}
			//	}				
			//	renderer.cells_names_selected[1].style.visibility = 'hidden';
			//	if (renderer.cells_names_selected[1].row < renderer.cells_names_selected[0].row){
			//		renderer.cells_names_selected[0].style.marginLeft = '-150px'; //shift back neighbors in row
			//		parentSelectedChildren[neighbor].row -= 1;
			//		renderer.cells_names_selected[0].style.width = '315px';
			//	}				
			//}
			renderer.cells_names_selected = [];
			//renderer.nselected += 1;
			event.target.style.backgroundColor = '';
			return;	
		}
	}

	swap_columns(Page,a,b,empty) {
		//DATA STRUCTURE OF SWAPPED COLUMNS
		let a_idx= [];	
		//let b_idx= [];		
		this.col = 2;		
  		for (var row = 0; row < renderer.excel_data[Page].length; row++) {
			for (var col = 1; col < document.getElementById('page_table').childNodes.length; col++){
				let row_vals = document.getElementById('page_table').childNodes[col];
				if (a_idx.includes(row_vals.childNodes[b].childNodes[0].value) === false){
					if (typeof row_vals.childNodes[b].childNodes[0].value !== 'undefined'){
						a_idx.push(row_vals.childNodes[b].childNodes[0]);
						//console.info(a_idx);
	       	  		//console.info('VALUE IN SWAPPING', renderer.excel_data[Page][col-2][this.a-1]);
	       	  		//console.info('VALUE IN SWAPPED', renderer.excel_data[Page][col-2][b-1]);
					}
				}				
			}
		}			
		this.a = a;		
		//console.info('A IDX',  a_idx);
  		for (var row = 0; row < renderer.excel_data[Page].length; row++) {
			for (var col = this.col-1; col < document.getElementById('page_table').childNodes.length; col++){
				let row_vals = document.getElementById('page_table').childNodes[col];
				try{
					//console.info('CURRENT A', row_vals.childNodes[a].childNodes[0]);
					//console.info('VALUE OF A', a_idx[col-1]);
					//console.info('COL',col-1);
					//this.col
					row_vals.childNodes[a].childNodes[0].value = a_idx[col-1].value;
					//FINDS A TRAVERSED NODE
					if (row_vals.childNodes[a].childNodes[0].isinvalid === true){
						if (a_idx[col-1].isinvalid === false){
							row_vals.childNodes[a].childNodes[0].isinvalid = false;
							row_vals.childNodes[a].childNodes[0].isedited = true;
							row_vals.childNodes[a].childNodes[0].style.backgroundColor = renderer.errorColor;					
						}				
					}
					else if (row_vals.childNodes[a].childNodes[0].isinvalid === false){ //BOTH INVALID AFTER TRANSFER
						if (a_idx[col-1].isinvalid === true){
							row_vals.childNodes[a].childNodes[0].isinvalid = true;
							row_vals.childNodes[a].childNodes[0].trying = a_idx[col-1].trying;
							row_vals.childNodes[a].childNodes[0].isedited = true;
							renderer.falsable_cells[Page][row][col] = true;
							//ALL EMPTY ROWS SHOULD CONTAIN AN ERROR
							row_vals.childNodes[a].childNodes[0].falsable = true;
							row_vals.childNodes[a].childNodes[0].style.backgroundColor = renderer.errorColor;	
							//console.info(row_vals.childNodes[a].childNodes[0]);		
       	  				//APPLIES
       	  				let tooltip = document.createElement('span');
       	  				tooltip.style = 'display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s; margin-top: -40px;';	
       	  				tooltip.style.left = '0px';
       	  				tooltip.style.top = '0px';
       	  				if (empty !== true){
								this.tooltip_center = 157;       	  				
       	  				}
       	  				else{
								this.tooltip_center = 151;   //332px    			
       	  				}
       	  				tooltip.style.marginLeft = '24px'; //relative
       	  				tooltip.innerHTML = this.dom_factor[b-1][0][0].error;
       	  				tooltip.displayed = false;
    						row_vals.childNodes[a].appendChild(tooltip);	
       	  				row_vals.childNodes[a].onmouseover = function(e){ //DEPENDENCY === no parenting
    							try{
									//console.info('INVALID AS CHILD', e.target.parentElement.childNodes[1].childNodes[0].isinvalid);    								
    								if (e.target.parentElement.childNodes[1].childNodes[0].isinvalid === false){ //falsable as child
    									return null;
    								}
    								else{ //falsable as target
    								}
    								if (typeof e.target.parentElement.childNodes[1].childNodes[0].falsable !== 'undefined'){ //falsable as child
    									this.falsability = e.target.parentElement.childNodes[1].childNodes[0];
    								}
    								else if (typeof e.target.falsable !== 'undefined'){ //falsable as target
    									this.falsability = e.target;
    								}
    								//console.info('FALSABLE AS', this.falsability);
    								if (this.falsability.falsable === true){
    									if (typeof e.target.parentElement.childNodes[1].displayed === 'undefined'){
											  this.absent = e.target.childNodes[1];  									
    									}
    									else{
    										this.absent = e.target.parentElement.childNodes[1];
    									}
    									//console.info('IS ABSENT SHOWN?', this.absent.displayed);
						        		if (this.absent.displayed === false){
            							this.absent.style.display = "block";
            							this.absent.displayed = true;
        								}
        								else{
                						this.absent.displayed = false;
            							this.absent.style.display = "none";
        								}
        							}	    
									else if (this.falsability.falsable === false){ //TRANSVERSALLY NULLIFIED 
										if (e.target.parentElement.childNodes[0].isinvalid === false){								
											e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
										}					
									}             							    	  						
    							}
    							catch(error){
    								console.info(error);//CHILD IS MUTUAL AS CHILD OF NODE
    							}
    						}	
						}				
					}	
					else if(row_vals.childNodes[a].childNodes[0].isinvalid === true){
						if(row_vals.childNodes[b].childNodes[0].isinvalid === false){
    						row_vals.childNodes[a].childNodes[0].falsable = false;
    					}	
	       	  	}					
	       	  	//console.info('VALUE IN SWAPPED', renderer.excel_data[Page][col-1][b-1]);
					renderer.excel_data[Page][col-1][a] = renderer.excel_data[Page][col-1][b-1];
					//SHIFT DTYPE
				}
				catch (error){
					 console.info(error); //TRAVERSES NODES WITHOUT CHILDS
				}
			}
		}			
	}	

	render_invalid_page(state) {
  		let rows = document.getElementById('page_table').childNodes;
  		for (var i = 0; i < rows.length; i++) {
  			try{
  				document.getElementById('render_row_'+String(i)).incoming = 'show_errors';
				document.getElementById('render_row_'+String(i)).click();
				document.getElementById('render_row_'+String(i)).checked = state;
			}
			catch (error){
				//INDEX IS OF ANOTHER CHILD
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
							grandchildren[k].parentElement.childNodes[1].style.backgroundColor = 'black';
						}
						else if (grandchildren[k].style.color === 'black'){
							grandchildren[k].style.color = document.getElementById('sheet_div').style.color;
							grandchildren[k].parentElement.childNodes[1].style.backgroundColor = 'black';
						}
					}  
					else{
						if (document.getElementById('show_changed').checked === true){
							if (grandchildren[k].isedited === true){
								continue;							
							}
						}	
						grandchildren[k].style.backgroundColor = 'black';	
						if (document.getElementById('sheet_div').style.color !== 'black'){
							grandchildren[k].style.color = 'black';
						}
						else{
							grandchildren[k].style.color = document.getElementById('sheet_div').style.color;						
							grandchildren[k].parentElement.childNodes[1].style.backgroundColor = 'black';
						}
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
						//grandchildren[k].style.backgroundColor = null;
						//grandchildren[k].style.backgroundColor = 'none';
						grandchildren[k].style.backgroundColor = 'white';
						grandchildren[k].style.color = document.getElementById('sheet_div').style.color;						
						//color exceptions to display error 
						try{
							grandchildren[k].parentElement.childNodes[1].style.backgroundColor = 'black'; 
							grandchildren[k].parentElement.childNodes[1].style.color = 'yellow'; 
						}
						catch (error) {
						}  	
					}
					else if (grandchildren[k].style.color === 'black'){
						//grandchildren[k].style.color = null;
						grandchildren[k].style.color = document.getElementById('sheet_div').style.color;
					} 					
				}
			}				
		}
	}		

	render_edited_page(state) {
  		let rows = document.getElementById('page_table').childNodes;
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
							grandchildren[k].style.backgroundColor = 'white';
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
							greatgrandchildren[l].style.backgroundColor = 'white';
							if (greatgrandchildren[l].isinvalid !== true){
								greatgrandchildren[l].style.backgroundColor = 'white';
							}
							else{
								greatgrandchildren[l].style.backgroundColor = renderer.errorColor;
							}
						}
						else if (greatgrandchildren[l].style.color === 'black'){
							greatgrandchildren[l].style.color = document.getElementById('sheet_div').style.color;
						}
					} 					
				}
			}				
		}
	}

	loadTable(idx) {
		let ipage = renderer.excel_data[idx];
		//console.info('CURRENT PAGE',ipage);
		let cells_sum = 0;
		let errors_sum = 0;
		this.trs = [];
		renderer.page = idx;
		//console.info('LOADING PAGE', renderer.page);
		//console.info('CAN SHIFT PAGE', renderer.page_shift);
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
	      trDiv.style = 'position: relative;';
	      trDiv.style.marginTop = String(renderer.sizeIncrement)+'px';
	      //console.info(trDiv.style.marginTop);
	      renderer.sizeIncrement += 32;
	      tdDiv.style = 'width: 110px;';
			if (renderer.dom_factor.length < ipage[R].length){
				this.tableSize = ipage[R].length; //doc based
				//console.info('USING USER PARAMS FOR SIZE');
			}
			else if (ipage[R].length < renderer.dom_factor.length){
				this.tableSize = renderer.dom_factor.length; //user based
				//console.info('USING USER PARAMS FOR SIZE');
				//console.info(this.tableSize);
			}
			else{
				this.tableSize = ipage[R].length; //property based
				//console.info('DEFAULT SIZE');
			}
			//console.info(this.tableSize);
  			for (var C = 0; C < this.tableSize; C++){
  				 let v = ipage[R][C]; 
  				 //console.info(this.dom_factor[C][0][0]);
  				 //console.info(this.dom_factor[C][0]);
  				 //console.info(this.dom_factor[C]);
	   	    try{
	   	    	//if not, prepare context to show virtual information
	   	    	if (this.set_virtual === true){
						if (typeof v === 'undefined'){
							//console.info('TRAVERSING EMPTY VALUE');
       		 			this.textbox = document.createElement('input');
       	  				this.textbox.type = 'text';
       	  				this.textbox.style = 'width: 150px;';
       	  				this.textbox.value = '';
       	  				this.textbox.col = C;
       	  				this.textbox.row = R;
       		  			if (0 === C){
       		  				this.textbox.style.marginLeft = '-40px';
       		  			}
	       	  			this.textbox.onchange = function (e){
								if (typeof e.value !== 'undefined'){
									renderer.excel_data[renderer.page][e.col][e.row] = e.value;
									e.isedited = true;	    	
									//e.target.style.backgroundColor = renderer.errorColor;  
									renderer.prove(e, this.textbox.col, this.textbox.row, renderer.page);									
								}
								else if (typeof e.target.value !== 'undefined'){
									renderer.excel_data[renderer.page][e.target.row][e.target.col] = e.target.value;
									e.target.isedited = true;	    	
									//e.target.style.backgroundColor = renderer.errorColor;  
									renderer.prove(e.target, e.target.col, e.target.row, renderer.page);									
								}											
								else{
									//console.info('VALUE IS UNDEFINED');								
								}		
	       	  			}
       	  				this.textbox.onfocus = function(e){
								renderer.tdCombined(e);       	  		
         				}	
         				if (document.getElementById('dtype_'+String(C)) === null){ //ABSTRACT COLUMNS WITH DTYPE
         					if (typeof this.abstract_c === 'undefined'){
									this.abstract_c = C;         					
         					}
								let tdLabelShiftDiv = document.createElement('div');  
								tdLabelShiftDiv.style = 'max-height: 144px; margin-top: -16px; font-size: 12px; margin-right: 16px; position: relative; width: 80px; margin-left: 54px;';
								//tdLabelShiftDiv.style.marginLeft = '54px';
								if (0<parseInt(C)){
									//tdLabelShiftDiv.style.marginLeft = (parseInt(tdLabelShiftDiv.style.marginLeft)-72)+'px';
								}
								if (C === this.abstract_c){
									//tdLabelShiftDiv.style.marginLeft = String((150 * (C+1))-25)+'px';
								}
								let tdLabelSelector = document.createElement('select');  
								tdLabelSelector.id='select_all_selector_'+String(C); 
								tdLabelSelector.style='width: 150px;height: 24px;margin: 32px 16px 16px 32px;margin-left: 16px;';		 
								tdLabelSelector.choices = [];		
								//tdLabelShiftDiv.appendChild(tdLabelSelector);					
								let tdFieldSelector = document.createElement('td'); 
								this.textbox.trying = [null]; 
								let selector_size = this.tableSize;
								this.abstract_empty = null;
	  							for(var vtypec = 0; vtypec <= this.tableSize; ++vtypec) {
									let selectOption = document.createElement('option'); 
									try{
										//applies for abstract options
										if (this.abstract_c <= vtypec){
											this.abstract_key	= 'empty_'+String(vtypec);	
											this.abstract_label = 'empty'; 		
											this.abstract_empty = true;						
											//console.info(this.abstract_key);		
										}
										else if (this.abstract_empty !== true){ //get recognized values
											this.abstract_key	= renderer.dom_factor[vtypec][0][0].key;	
											//console.info('CURRENT COL', vtypec);
											this.abstract_label = renderer.dom_factor[vtypec][0][0].label; 
											this.abstract_empty = false;														
										}
										//add abstract option in a column that is in the table
										if (this.abstract_empty === false){									
											document.getElementById('page_table').parentElement.childNodes[1].childNodes[0].childNodes[0].childNodes[R].childNodes[vtypec].childNodes[0].childNodes[0].choices.push('empty_'+String(vtypec));
											let padTrue = document.createElement('option'); 
											padTrue.value = 'empty_'+String(vtypec);
											padTrue.innerHTML = 'empty';
											document.getElementById('page_table').parentElement.childNodes[1].childNodes[0].childNodes[0].childNodes[R].childNodes[vtypec].childNodes[0].childNodes[0].appendChild(padTrue);
										}
										selectOption.value = this.abstract_key;
										tdLabelSelector.choices.push(this.abstract_key);
										selectOption.innerHTML = this.abstract_label;
										if (C === vtypec){
											selectOption.defaultSelected = true;	
											tdLabelSelector.prev = this.abstract_key;							
										}
										tdLabelSelector.appendChild(selectOption);						
										//empty cell in traversed page can be proven false after leave				
										if (typeof renderer.falsable_cells[idx][R][C] === 'undefined'){
											renderer.falsable_cells[idx][R][C] = false; 									
										}
									}
									catch (error){
										console.info(error);
									}
								};  	
								tdLabelSelector.onchange = function (e){
									let children = e.target.choices;
									renderer.swap_columns(0, e.target.choices.indexOf(e.target.prev)+1, e.target.choices.indexOf(e.target.value)+1,true);	
									e.target.prev = e.target.value;					
								}			
								tdLabelShiftDiv.appendChild(tdLabelSelector);
								tdFieldSelector.appendChild(tdLabelShiftDiv);
								tdFieldSelector.id='selectortd_empty';
								//CHILDS WITH TDS OUTSIDE	
								document.getElementById('page_table').childNodes[0].childNodes[0].childNodes[0].appendChild(tdFieldSelector);	
								let tdDtypeCol = document.createElement('td');  
								let dtypeColSpan = document.createElement('span');  
								dtypeColSpan.id = 'dtype_'+String(C);  								
								dtypeColSpan.style = 'margin-left: -192px; max-height: 144px;font-size: 12px;margin-right: 16px;/* margin-top: 32px; */position: relative;display: block;padding-left: 16px;';
								if (parseInt(C) === (this.tableSize-1)){
									dtypeColSpan.style.marginLeft = 'margin-left: -32px';
								}
								tdDtypeCol.appendChild(dtypeColSpan);				
								document.getElementById('page_table').childNodes[0].childNodes[R].childNodes[1].appendChild(tdDtypeCol);	
       	  				}
       	  				else {
       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  						document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
       	  					}
       	  					if (0<parseInt(C)){
       	  						if (typeof this.abstract_c !== 'undefined'){
       	  							if (this.abstract_c === C){
       	  								//document.getElementById('dtype_'+String(C)).style.marginLeft = '54px';
       	  							}
       	  							else if (this.abstract_c < C){
       	  								//document.getElementById('dtype_'+String(C)).style.marginLeft = '54px';
       	  							}
       	  						}	
       	  						else{
       	  							document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';
       	  						}
									document.getElementById('dtype_'+String(C)).style.paddingLeft = '-32px';
       	  					}   
       	  					else{
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = '-64px';
									document.getElementById('dtype_'+String(C)).style.paddingLeft = '0px';
       	  					}   
       	  				}        	  				  
         				this.textbox.isinvalid = false;
      	  				this.textbox.selecting = false;
      	  				this.textbox.falsable = false;
       	  				cells_sum += 1;		
       	  				let tdDiv = document.createElement('td');
	      				tdDiv.appendChild(this.textbox);
	       	  			trDiv.appendChild(tdDiv);
	       	  			continue;  
					   } 	
		         	else if (renderer.dom_factor[C][0][0].critical === true){            	
							if (v === ''){           
      		 	  			this.textbox = document.createElement('input');
       			  			this.textbox.type = 'text';
       			  			this.textbox.style = 'width: 150px;';
       		  				if (0 === C){
       		  					this.textbox.style.marginLeft = '-40px';
       		  					if (0 === R){
       		  						this.textbox.style.marginTop = '16px';
       		  					}
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
									e.target.isedited = true;	
									if (e.target.isinvalid === true){
										e.target.style.backgroundColor = renderer.errorColor;  
									}	
									//console.info('PROVING');
									renderer.prove(e, this.textbox.col, this.textbox.row, renderer.page);																		       
	       	  				}
       	  					this.textbox.readOnly = false;	
       	  					this.textbox.onfocus = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					this.textbox.isinvalid = true;
								renderer.falsable_cells[idx][R][C] = true;       	  					
       	  					this.textbox.falsable = true;
       	  					this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       	  					this.textbox.selecting = false;			
       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  						document.getElementById('dtype_'+String(C)).innerHTML = 'Exception';
       	  					}
       	  					document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';
       	  					errors_sum += 1;	
       	  					cells_sum += 1;
       	  					let tooltip = document.createElement('span');
       	  					tooltip.style = 'display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; margin-left: -12px; margin-top: -40px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s;';	
       	  					tooltip.style.left = '0px';
       	  					tooltip.style.top = '0px';
       	  					tooltip.innerHTML = renderer.dom_factor[C][0][0].error;
       	  					tooltip.displayed = false;
       	  					let tdDiv = document.createElement('td');
	      					tdDiv.appendChild(this.textbox);
	      					tdDiv.appendChild(tooltip);
    							tdDiv.onmouseover = function(e){
    									//console.info('HOVERING');
    									//console.info('IS FALSABLE', e.target.parentElement.childNodes[0].falsable);
    									if (e.target.parentElement.childNodes[0].falsable === true){
    										//console.info('ENABLING INVALID ARGUMENT');
    										//console.info(e.target.parentElement);
    										//console.info(e.target.parentElement.childNodes[1].displayed);
						        			if (e.target.parentElement.childNodes[1].displayed === false){
						        			//	console.info(e.target);
            								e.target.parentElement.childNodes[1].style.display = "block";
           									e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           									e.target.parentElement.childNodes[1].displayed = true;
        									}
        									else{
            								e.target.parentElement.childNodes[1].animate({"opacity" : 0});
            								setTimeout(function (){
                    							e.target.parentElement.childNodes[1].style.display = "none";
                							}, 
                							400);
                							e.target.parentElement.childNodes[1].displayed = false;
                							//console.info('IS ARGUMENT DISPLAYED?', e.target.parentElement.childNodes[1].displayed);
                							e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
                							//console.info(e.target.parentElement.childNodes[1].style.transition);
        									}
        								}	        	  					
										else if (e.target.parentElement.childNodes[0].falsable === false){ //TRANSVERSALLY NULLIFIED 
											//console.info('DISABLING INVALID ARGUMENT');
											if (e.target.parentElement.childNodes[0].isinvalid === false){								
												e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
											}					
										}      								        	  					
    							};
	       	  				trDiv.appendChild(tdDiv);
	       	  				trDiv.bad_row = true;
	       	  				continue;  
							}
							else{
								//console.info('CURRENT R', R); 
								//console.info('CURRENT C', C);  								
      	 	  				this.textbox = document.createElement('input');
       		  				this.textbox.type = 'text';
       		  				this.textbox.style = 'width: 150px;';
       		  				if (0 === C){
       		  					this.textbox.style.marginLeft = '-40px';
       		  					if (0 === R){
       		  						this.textbox.style.marginTop = '16px';
       		  					}       		  					
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
       	  					document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px'; 	  					
       	  					this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       	  					this.textbox.isinvalid = false;
       	  					this.textbox.falsable = false;
	       	  				this.textbox.onchange = function (e){
	       	  					//console.info('PROVING');
									renderer.prove(e, e.target.col, e.target.row, renderer.page);	       	  				
									e.target.isedited = true;	       
									//e.target.style.backgroundColor = renderer.errorColor;  
									if (e.target.isinvalid === true){
										e.target.style.backgroundColor = renderer.errorColor;  
									}										
	       	  				}
       	  					this.textbox.readOnly = false;	
       	  					this.textbox.onfocus = function(e){
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
		         	else if (renderer.dom_factor[C][0][1] !== null){  
		         		if (renderer.dom_factor[C][0][1].unique !== false){	
		         			//console.info(renderer.dom_factor[C][0][0].childs);	         			   	    		           	
								if (renderer.dom_factor[C][0][0].childs.includes(v)){            	
									//console.info('CURRENT R', R); 
									//console.info('CURRENT C', C);  
       							this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
       	  						this.textbox.style = 'width: 150px;';    	  						
       	  						this.textbox.readOnly = false;	
       	  						this.textbox.col = C;
       	  						this.textbox.row = R;
       		  					if (0 === C){
       		  						this.textbox.style.marginLeft = '-40px';
       		  						if (0 === R){
       		  							this.textbox.style.marginTop = '16px';
       		  						}       		  						
       		  					}
	         					this.textbox.onchange = function (e){
	         						//console.info('PROVING');
										renderer.prove(e, e.target.col, e.target.row, renderer.page);	       	  				
										e.target.isedited = true;	       
										if (e.target.isinvalid === true){
											e.target.style.backgroundColor = renderer.errorColor;  
										}	
       	  						}
       	  						this.textbox.onfocus = function(e){
										renderer.tdCombined(e);       	  		
       	  						}	
       	  						if (typeof this.textbox.trying === 'undefined'){
										this.textbox.trying = [];       	  						
         						}
	       	  					this.textbox.trying.push('unique');
       	  						this.textbox.selecting = false;
       	  						//console.info(renderer.dom_factor[C][0][0].error);
       	  						this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       	  						this.textbox.isinvalid = true;
       	  						renderer.falsable_cells[idx][R][C] = true;       
       	  						this.textbox.falsable = true;
	       	  					this.textbox.unique = 1;       	  				
       	  						errorCell(this.textbox); //coloriza campo contenido duplicado   
       	  						if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  							document.getElementById('dtype_'+String(C)).innerHTML = 'Exception';
       	  						}
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';
	       	  					errors_sum += 1;		       	
	       	  					cells_sum += 1;	  					
       	  						let tooltip = document.createElement('span');
       	  						tooltip.style = 'display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; margin-top: -40px; margin-left: -12px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s;';	
       	  						tooltip.style.left = '0px';
       	  						tooltip.style.top = '0px';
       	  						tooltip.innerHTML = renderer.dom_factor[C][0][0].error;
       	  						tooltip.displayed = false;
       	  						let tdDiv = document.createElement('td');
	      						tdDiv.appendChild(this.textbox);
	      						tdDiv.appendChild(tooltip);
    								tdDiv.onmouseover = function(e){
    									//console.info('HOVERING');
    									//console.info('IS FALSABLE', e.target.parentElement.childNodes[0].falsable);
    									if (e.target.parentElement.childNodes[0].falsable === true){
    										//console.info('ENABLING INVALID ARGUMENT');
    										//console.info(e.target.parentElement);
    										//console.info(e.target.parentElement.childNodes[1].displayed);
						        			if (e.target.parentElement.childNodes[1].displayed === false){
						        			//	console.info(e.target);
            								e.target.parentElement.childNodes[1].style.display = "block";
           									e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           									e.target.parentElement.childNodes[1].displayed = true;
        									}
        									else{
            								e.target.parentElement.childNodes[1].animate({"opacity" : 0});
            								setTimeout(function (){
                    							e.target.parentElement.childNodes[1].style.display = "none";
                							}, 
                							400);
                							e.target.parentElement.childNodes[1].displayed = false;
                							//console.info('IS ARGUMENT DISPLAYED?', e.target.parentElement.childNodes[1].displayed);
                							e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
                							//console.info(e.target.parentElement.childNodes[1].style.transition);
        									}
        								}	        	  					
										else if (e.target.parentElement.childNodes[0].falsable === false){ //TRANSVERSALLY NULLIFIED 
											//console.info('DISABLING INVALID ARGUMENT');
											if (e.target.parentElement.childNodes[0].isinvalid === false){								
												e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
											}					
										}    
    								};
	       	  					trDiv.appendChild(tdDiv);
	       	  					trDiv.bad_row = true;
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
       		  						this.textbox.style.marginLeft = '-40px';
       		  						if (0 === R){
       		  							this.textbox.style.marginTop = '16px';
       		  						}       		  						
       		  					}
	         					this.textbox.onchange = function (e){
	         						//console.info('PROVING');
										renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
										e.target.isedited = true;	       
										if (e.target.isinvalid === true){
											e.target.style.backgroundColor = renderer.errorColor;  
										}	
       	  						}
	       	  					//console.info('ADDING UNIQUE');
       	  						this.textbox.onfocus = function(e){
										renderer.tdCombined(e);       	  		
       	  						}	
       	  						if (typeof this.textbox.trying === 'undefined'){
										this.textbox.trying = [];       	  						
         						}
         						this.textbox.value = ipage[R][C];
	       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
   	    	  						document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
      	 	  					}
       		  					document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';							 	  					
         						this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
         						this.textbox.isinvalid = false;
         						this.textbox.falsable = false;
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
               		else if (renderer.dom_factor[C][0][0].re !== false){  
               			//console.info(renderer.dom_factor[C]);
               			let matching = v.match(renderer.dom_factor[C][0][0].re);    
								if (matching === null){        	
									//console.info('CURRENT R', R); 
									//console.info('CURRENT C', C);  
       			 				this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
       	  						this.textbox.style = 'width: 150px;';
       	  						this.textbox.col = C;
       	  						this.textbox.row = R;
       		  					if (0 === C){
       		  						this.textbox.style.marginLeft = '-40px';
       		  						if (0 === R){
       		  							this.textbox.style.marginTop = '16px';
       		  						}       		  						
       		  					}
       	  						if (typeof this.textbox.trying === 'undefined'){
										this.textbox.trying = [];       	  						
       	  						}       	  				
	        						this.textbox.onchange = function (e){
	        							//console.info('PROVING');
										renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
										e.target.isedited = true;	       
										if (e.target.isinvalid === true){
											e.target.style.backgroundColor = renderer.errorColor;  
										}	
	       	  					}       	  								
	       	  					this.textbox.trying.push('re');
       	  						errorCell(this.textbox); //coloriza campo contenido duplicado       	  						
       	  						this.textbox.readOnly = false;	
       	  						this.textbox.onfocus = function(e){
										renderer.tdCombined(e);       	  		
       	  						}	
       	  						this.textbox.selecting = false;
       	  						errors_sum += 1;
       	  						cells_sum += 1;	
       	  						this.textbox.isinvalid = true;
       	  						renderer.falsable_cells[idx][R][C] = true;       
       	  						this.textbox.falsable = true;
      	 	  					this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
	       	  					this.textbox.re = renderer.dom_factor[C][0][0].re;		
       	  						if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  							document.getElementById('dtype_'+String(C)).innerHTML = 'Exception';
       	  						}
       	  						document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';
       	  						let tooltip = document.createElement('span');
       	  						tooltip.style = 'display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; margin-left: -12px; margin-top: -40px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s;';	
       	  						tooltip.style.left = '0px';
       	  						tooltip.style.top = '0px';
       	  						tooltip.innerHTML = renderer.dom_factor[C][0][0].error;
       	  						tooltip.displayed = false;
       	  						let tdDiv = document.createElement('td');
	      						tdDiv.appendChild(this.textbox);
	      						tdDiv.appendChild(tooltip);
    								tdDiv.onmouseover = function(e){ //e is always first result in z
    									//console.info('HOVERING');
    									//console.info('IS FALSABLE', e.target.parentElement.childNodes[0].falsable);
    									if (e.target.parentElement.childNodes[0].falsable === true){
    										//console.info('ENABLING INVALID ARGUMENT');
    										//console.info(e.target.parentElement);
    										//console.info(e.target.parentElement.childNodes[1].displayed);
						        			if (e.target.parentElement.childNodes[1].displayed === false){
						        			//	console.info(e.target);
            								e.target.parentElement.childNodes[1].style.display = "block";
           									e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           									e.target.parentElement.childNodes[1].displayed = true;
        									}
        									else{
            								e.target.parentElement.childNodes[1].animate({"opacity" : 0});
            								setTimeout(function (){
                    							e.target.parentElement.childNodes[1].style.display = "none";
                							}, 
                							400);
                							e.target.parentElement.childNodes[1].displayed = false;
                							//console.info('IS ARGUMENT DISPLAYED?', e.target.parentElement.childNodes[1].displayed);
                							e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
                							//console.info(e.target.parentElement.childNodes[1].style.transition);
        									}
        								}	        	  					
										else if (e.target.parentElement.childNodes[0].falsable === false){ //TRANSVERSALLY NULLIFIED 
											//console.info('DISABLING INVALID ARGUMENT');
											if (e.target.parentElement.childNodes[0].isinvalid === false){								
												e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
											}					
										}          								
    								};
	       	  					trDiv.appendChild(tdDiv);
	       	  					trDiv.bad_row = true;
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
	         					//console.info('PROVING');
									renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
									e.target.isedited = true;	       
									if (e.target.isinvalid === true){
										e.target.style.backgroundColor = renderer.errorColor;  
									}	
       	  					}
       		  				if (0 === C){
       		  					this.textbox.style.marginLeft = '-40px';
       		  					if (0 === R){
       		  						this.textbox.style.marginTop = '16px';
       		  					}       		  					
       		  				}
	       	  				//console.info('ADDING VALID REGEX');
       	  					this.textbox.onfocus = function(e){
									renderer.tdCombined(e);       	  		
       	  					}	
       	  					if (typeof e.trying === 'undefined'){
									e.trying = [];       	  						
         					}
         					this.textbox.value = ipage[R][C];
	       	  				this.textbox.trying.push('unique');
       	  					this.textbox.selecting = false;
       	  					this.textbox.isinvalid = false;
       	  					this.textbox.falsable = false;
       	  					this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       	  					if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  						document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
       	  					}
       	  					//console.info(C);
       	  					document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';
       	  					cells_sum += 1;	
	       	  				this.textbox.re = renderer.dom_factor[C][0][0].re;		      	  													
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
       	  				this.textbox.trying = [null];
       		  			if (0 === C){
       		  				this.textbox.style.marginLeft = '-40px';
       		  				if (0 === R){
       		  					this.textbox.style.marginTop = '16px';
       		  				}       		  				
       		  			}
	       	  			this.textbox.onchange = function (e){
								renderer.excel_data[renderer.page][e.target.col][e.target.row] = e.target.value;
								e.target.isedited = true;	    	  				
	         				//console.info('DEMONSTRATES VALID');
								renderer.prove(e, e.target.col, e.target.row,renderer.page);	       	  				
								if (e.target.isinvalid === true){
									e.target.style.backgroundColor = renderer.errorColor;  
								}	
	       	  			}
       	  				this.textbox.onfocus = function(e){
								renderer.tdCombined(e);       	  		
         				}	
       	  				if (document.getElementById('dtype_'+String(C)).innerHTML === ''){
       	  					document.getElementById('dtype_'+String(C)).innerHTML = String(typeof this.textbox.value);
       	  				}
       	  				document.getElementById('dtype_'+String(C)).style.marginLeft = '-32px';			  
         				this.textbox.isinvalid = false;
         				this.textbox.falsable = false;
      	  				this.textbox.selecting = false;
       	  				cells_sum += 1;		
       	  				let tdDiv = document.createElement('td');
	      				tdDiv.appendChild(this.textbox);
	       	  			trDiv.appendChild(tdDiv);
	       	  			continue;  
					  }
					 }
					 else{
						//console.info(v);		
						if (this.page_shift === false){	
							//skip things in table		 
							for (var page_row = 1; page_row < document.getElementById('page_table').childNodes.length; page_row++){
								//console.info(document.getElementById('sheet_div').childNodes[page_row].childNodes[0]);
								let page_td = document.getElementById('page_table').childNodes[page_row];
								for (var page_col = 1; page_col < page_td.childNodes.length; page_col++){ //seek cells
									try{			
										//traversing all virtual values		
										if (ipage[page_row-1][page_col-1] === null){
											continue;
										}	
										else if (typeof ipage[page_row-1][page_col-1] === 'undefined'){
											continue;
										}		
										//console.info('SHIFTING PAGE', ipage);
										//add virtual values in page columns
										page_td.childNodes[page_col].childNodes[0].value = ipage[page_row-1][page_col-1];
										page_td.childNodes[page_col].childNodes[0].innerHTML = ipage[page_row-1][page_col-1];																			
										//set invalid attribute using the attribute with error
										if (renderer.prev_exp < idx){
											this.check_transversal = renderer.prev_exp;	//user did									
										}
										else{
											this.check_transversal = idx; //user wants again
										}
										if (renderer.falsable_cells[this.check_transversal][page_row-1][page_col-1] === true){ //traversed value in field must be invalid
											if (renderer.falsable_cells[idx][page_row-1][page_col-1] === false){
       	  									page_td.childNodes[page_col].childNodes[0].isinvalid = false;
       	  									page_td.childNodes[page_col].childNodes[0].falsable = false;											
											}
											else{
												//VIRTUALLY UNFINISHED AT REQUESTING TRANSVERSAL
       	  									page_td.childNodes[page_col].childNodes[0].isinvalid = true;
       	  									page_td.childNodes[page_col].childNodes[0].falsable = true;
       	  								}
											renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, idx);
       	  							}
       	  						}
       	  						catch (error){
       	  							console.info(error);
       	  						}				
								}
							}
							this.page_shift = true;
							this.prev_exp = idx;
						}
					 }   						  	
   	       }	
      		 catch (error){
      			console.info(error);
      		 }	  	  			
       	}
       	this.trs.push(trDiv); 
			if (trDiv.bad_row === true){
				for (var col = 0; col < trDiv.childNodes.length; col++){
					if (trDiv.childNodes[col].isinvalid === false){
						trDiv.childNodes[col].style.marginTop = '-16px';	
						trDiv.childNodes[col].style.position = 'relative';					
					}		
					else{
						trDiv.childNodes[col].style.marginTop = '0px';			
						trDiv.childNodes[col].style.position = 'relative';				
					}		
				}		
			}       	 
		}
		document.getElementById('error_sheets').innerHTML = errors_sum;
		document.getElementById('total_sheets').innerHTML = cells_sum;
		return this.trs;	
  	}

	proveFilled(idx,C,R,Page) {
		//console.info('PROVING CRITICAL');
		if (idx.value !== ''){
  			idx.style.backgroundColor = null;
  			idx.critical = 0;
  			idx.falsable = false;
			this.excel_data[Page][R][C] = idx.value;	 
			idx.isinvalid = false;
			idx.isedited = false;
			document.getElementById('error_sheets').innerHTML = String(parseInt(document.getElementById('error_sheets').innerHTML-1));
  		}
  		else{
			idx.critical = 1;  		
			errorCell(idx);  		
       	idx.falsable = true;
       	//console.info('VALUE TO BE SWAPPED', this.excel_data[Page][R][C]);
       	//console.info('VALUE', idx.value);       	
       	renderer.falsable_cells[Page][R][C] = true;  
       	this.excel_data[Page][R][C] = idx.value;	
       	//console.info(this.excel_data); 
       	idx.isinvalid = true;	  
       	if (typeof idx.parentElement.childNodes[1] === 'undefined'){
       		let tooltip = document.createElement('span');
       		tooltip.style = 'margin-top: -40px; display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; margin-left: -12px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s;';	
       		tooltip.style.left = '0px';
       		tooltip.style.top = '0px';
       		tooltip.innerHTML = this.dom_factor[C][0][0].error;
       		tooltip.displayed = false;
    			//console.info(idx);
    			//console.info(idx.falsable);
    			idx.parentElement.appendChild(tooltip);	
    			idx.parentElement.onmouseover = function(e){
    				//console.info('HOVERING');
    				//console.info('IS FALSABLE', e.target.parentElement.childNodes[0].falsable);
    				try{
	    				if (e.target.parentElement.childNodes[0].falsable === true){
   	 					//console.info('ENABLING INVALID ARGUMENT');
    						//console.info(e.target.parentElement);
    						//console.info(e.target.parentElement.childNodes[1]);
							if (e.target.parentElement.childNodes[1].displayed === false){
							   //	console.info(e.target);
            				e.target.parentElement.childNodes[1].style.display = "block";
           					e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           					e.target.parentElement.childNodes[1].displayed = true;
	        				}
   	     				else{
      	      			e.target.parentElement.childNodes[1].animate({"opacity" : 0});
         	   			setTimeout(function (){
            	        		e.target.parentElement.childNodes[1].style.display = "none";
               	 		}, 
                			400);
                			e.target.parentElement.childNodes[1].displayed = false;
	                		//console.info('IS ARGUMENT DISPLAYED?', e.target.parentElement.childNodes[1].displayed);
   	             		e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
      	          		//console.info(e.target.parentElement.childNodes[1].style.transition);
        					}
	        			}	        	  					
						else if (e.target.parentElement.childNodes[0].falsable === false){ //TRANSVERSALLY NULLIFIED 
							//console.info('DISABLING INVALID ARGUMENT');
							if (e.target.parentElement.childNodes[0].isinvalid === false){								
								e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
							}					
						} 
					}
					catch (error){
						 console.info(error);
					}   
				}	        								        	  					
    		}
    		else{
    			//console.info(idx);
    			//console.info(idx.falsable);
    			if (idx.falsable === false){
    				idx.falsable = true;
    				renderer.falsable_cells[Page][R][C] = true;  
    			}
    		}
			document.getElementById('error_sheets').innerHTML = String(parseInt(document.getElementById('error_sheets').innerHTML+1));
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
       	//idx.value = idx.err_msg;
       	this.excel_data[Page][R][C] = idx.value;	 
       	idx.falsable = true;
       	renderer.falsable_cells[Page][R][C] = true;  
       	idx.isinvalid = true;		
			document.getElementById('error_sheets').innerHTML = String(parseInt(document.getElementById('error_sheets').innerHTML+1));       		
       	//console.info(typeof idx.parentElement.childNodes[1]);
    		//console.info(idx);
    		//console.info(idx.falsable);
       	if (typeof idx.parentElement.childNodes[1] === 'undefined'){
       		let tooltip = document.createElement('span');
       		tooltip.style = 'display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; margin-left: -12px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s; margin-top: -40px';	
       		tooltip.style.left = '0px';
       		tooltip.style.top = '0px';
       		tooltip.innerHTML = this.dom_factor[C][0][0].error;
       		tooltip.displayed = false;
    			//console.info(idx);
    			//console.info(idx.falsable);
    			idx.parentElement.appendChild(tooltip);	
    			idx.parentElement.onmouseover = function(e){
    				//console.info('HOVERING');
    				//console.info('IS FALSABLE', e.target.parentElement.childNodes[0].falsable);
    				try{
    					if (e.target.parentElement.childNodes[0].falsable === true){
    						//console.info('ENABLING INVALID ARGUMENT');
    						//console.info(e.target.parentElement);
    						//console.info(e.target.parentElement.childNodes[1].displayed);
							if (e.target.parentElement.childNodes[1].displayed === false){
						   	//	console.info(e.target);
            				e.target.parentElement.childNodes[1].style.display = "block";
           					e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           					e.target.parentElement.childNodes[1].displayed = true;
        					}
        					else{
            				e.target.parentElement.childNodes[1].animate({"opacity" : 0});
            				setTimeout(function (){
                    			e.target.parentElement.childNodes[1].style.display = "none";
                			}, 
                			400);
                			e.target.parentElement.childNodes[1].displayed = false;
                			//console.info('IS ARGUMENT DISPLAYED?', e.target.parentElement.childNodes[1].displayed);
                			e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
                			//console.info(e.target.parentElement.childNodes[1].style.transition);
        					}
        				}	        	  					
						else if (e.target.parentElement.childNodes[0].falsable === false){ //TRANSVERSALLY NULLIFIED 
							//console.info('DISABLING INVALID ARGUMENT');
							if (e.target.parentElement.childNodes[0].isinvalid === false){								
								e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
							}					
						}
					}
					catch(error){
					}	    
				}	        								        	  					
    		}
    		else{
    			//console.info(idx);
    			//console.info(idx.falsable);
    			if (idx.falsable === false){
    				idx.falsable = true;
    				renderer.falsable_cells[Page][R][C] = true;  
    			}
    		}
  		}
  		else{
  			idx.style.backgroundColor = null;
  			idx.unique = 0;					
			this.excel_data[Page][R][C] = idx.value;	 
			idx.falsable = false; 
			idx.isinvalid = false;
			idx.isedited = false;  
			document.getElementById('error_sheets').innerHTML = String(parseInt(document.getElementById('error_sheets').innerHTML-1));
  		}
	}

	proveRe(idx,C,R,Page) {
		let matching = idx.value.match(idx.re);   
		//console.info(matching);   
		//console.info(typeof matching !== 'object');       	
		if (matching === null){ //no match of expressions 
			idx.unique = 1;  		
			errorCell(idx);  
       	//idx.value = idx.err_msg;	
       	this.excel_data[Page][R][C] = idx.value;	 	
       	idx.isinvalid = true;
       	idx.falsable = true;	
       	renderer.falsable_cells[Page][R][C] = true;  
			document.getElementById('error_sheets').innerHTML = String(parseInt(document.getElementById('error_sheets').innerHTML+1));
       	//console.info(typeof idx.parentElement.childNodes[1]);
    		//console.info(idx);
    		//console.info(idx.falsable);
       	if (typeof idx.parentElement.childNodes[1] === 'undefined'){
       		let tooltip = document.createElement('span');
       		tooltip.style = 'display: none; border: 2px solid rgb(49, 71, 84); border-radius: 5px; box-shadow: rgb(51, 51, 51) 5px 5px 5px; color: rgb(248, 250, 135); padding: 3px; width: 100px; position: relative; z-index: 100; left: 0px; top: 0px; margin-left: -12px; background-color: black; height: 30px; overflow: hidden; font-size: 7px; transition: opacity 6s ease-in-out 0s; margin-top: -40px';	
       		tooltip.style.left = '0px';
       		tooltip.style.top = '0px';
       		tooltip.innerHTML = this.dom_factor[C][0][0].error;
       		tooltip.displayed = false;
    			//console.info(idx);
    			//console.info(idx.falsable);
    			idx.parentElement.appendChild(tooltip);	
    			idx.parentElement.onmouseover = function(e){
    				//console.info('HOVERING');
    				//console.info('IS FALSABLE', e.target.parentElement.childNodes[0].falsable);
    				try{
    					if (e.target.parentElement.childNodes[0].falsable === true){
    						//console.info('ENABLING INVALID ARGUMENT');
    						//console.info(e.target.parentElement);
    						//console.info(e.target.parentElement.childNodes[1].displayed);
							if (e.target.parentElement.childNodes[1].displayed === false){
						   	//	console.info(e.target);
            				e.target.parentElement.childNodes[1].style.display = "block";
           					e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           					e.target.parentElement.childNodes[1].displayed = true;
        					}
        					else{
            				e.target.parentElement.childNodes[1].animate({"opacity" : 0});
            				setTimeout(function (){
                    			e.target.parentElement.childNodes[1].style.display = "none";
                			}, 
                			400);
                			e.target.parentElement.childNodes[1].displayed = false;
                			//console.info('IS ARGUMENT DISPLAYED?', e.target.parentElement.childNodes[1].displayed);
                			e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
                			//console.info(e.target.parentElement.childNodes[1].style.transition);
        					}
        				}	        	  					
						else if (e.target.parentElement.childNodes[0].falsable === false){ //TRANSVERSALLY NULLIFIED 
							//console.info('DISABLING INVALID ARGUMENT');
							if (e.target.parentElement.childNodes[0].isinvalid === false){								
								e.target.parentElement.childNodes[1].style.display = "none";	//SPAN IS CHILD OF TD		
							}					
						}
					}
					catch (error){
						console.info(error);
					}	    
				}	        								        	  					
    		}
    		else{
    			//console.info(idx);
    			//console.info(idx.falsable);
    			if (idx.falsable === false){
    				idx.falsable = true;
    				renderer.falsable_cells[Page][R][C] = true;  
    			}
    		}
  		}
  		else{		
  			idx.unique = 0;					
			document.getElementById('error_sheets').innerHTML = String(parseInt(document.getElementById('error_sheets').innerHTML+1));
			this.excel_data[Page][R][C] = idx.value;	    
			idx.isinvalid = false;
			idx.falsable = false;
			idx.isedited = false;
  			idx.style.backgroundColor = 'white';  
  			//console.info(idx);
  			//console.info(idx.style.backgroundColor);
  		}
	}

	prove(idx,C,R,Page) {
		if (typeof idx.target !== 'undefined'){ //PROOF IS AN EVENT
			this.proving = idx.target;			
		}
		else if (typeof idx !== 'undefined'){ //PROOF IS AN OBJECT
			this.proving = idx;			
		}
		else{
			return null;		
		}
		//console.info('PROVING', this.proving);
		for (var j = 0; j < this.proving.trying.length; j++) {
			//console.info('TRYING', this.proving.trying);
			if (this.proving.trying[j] === 'critical'){
				this.proveFilled(this.proving,C,R,Page);
			}
			else if (this.proving.trying[j] === 'unique'){
				this.proveUnique(this.proving,C,R,Page);
			}
			else if (this.proving.trying[j] === 're'){
				this.proveRe(this.proving,C,R,Page);
			}
		}
	}
	//XLSX.writeFile(workbook, fname, write_opts) write file back
}

function uploadxls(){
	document.getElementById('pIn').click();
};

let renderer = new renderWidget(document.getElementById('cecilio-importer'), options);		
