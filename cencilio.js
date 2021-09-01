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

function regexFromString (string) {
  var match = /^\/(.*)\/([a-z]*)$/.exec(string)
  return new RegExp(match[1], match[2])
}

function errorCell(idx) {
	/*Función que coloriza en rojo una celda
	con placeholder de required inválido*/
	//console.info('COLORING CELL');
  	if(typeof renderer.errorColor === 'undefined'){
		idx.style.backgroundColor = ' #F97F7F';
  	}
  	else{
  		idx.style.backgroundColor = renderer.errorColor;  	
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
	
	//user without setting options
	if (typeof Options !== 'object'){
		document.getElementById('api_error').style.display = 'block';   
		document.getElementById('spinner').style.display = 'none';
		return 'validationError';
	}
	
	//user without key
	if (typeof Options['apiKey'] === 'undefined'){
		document.getElementById('api_error').style.display = 'block'; 
		document.getElementById('spinner').style.display = 'none';  
		return 'validationError';
	}
	else if (Options['apiKey'] === ''){ //user with a key empty
		document.getElementById('api_error').style.display = 'block';   
		document.getElementById('spinner').style.display = 'none';
		return 'validationError';	
	}
	//console.info('RUNNING AJAX REQUEST');
   var xhr = new XMLHttpRequest();
   xhr.open('GET', 'https://app.cencilio.com/api/1.1/obj/account/'+Options['apiKey'], true); 	
   xhr.setRequestHeader('Content-Type', 'application/json');	
   xhr.onload = function (data) {
   	//since response is of a different dtype we know where is key 
   	let resp = data.currentTarget.response;
		if (resp.split('_')[1].split(':')[1].split('"')[1] === Options['apiKey']) {
   		if (Options['userId'] !== null){	
				renderer.split_resp = resp.split('}');
				renderer.split_resp = renderer.split_resp.slice(0, -1);
				renderer.split_resp += '"_mail": "'+Options['userId']+'"';
				renderer.split_resp += '}}';		 
   		}
   		else{
				renderer.split_resp = resp;   		
   		}
   		if (typeof Options['timestamps'] !== 'undefined'){	
				renderer.timestamps = Options['timestamps'];	 
   		}
   		else{
				renderer.timestamps = [null];   	
				//console.info('SETTING TIMESTAMPS TO', renderer.timestamps);	
   		}
			//console.info('SESSION IS VALID');
			renderer.dom_factor = [];
	  		renderer.sheetDiv = document.createElement('div');
			renderer.sheetDiv.className='sheet_div'; 
			renderer.sheetDiv.id='sheet_div'; 
			renderer.sheetDiv.style='overflow-x: hidden; position: absolute;z-index: 1000;top: 50%;padding: 16px;width: 72%;margin-left: 194px;border-radius: 4px;height: 80%;overflow-y: scroll;/* margin: 0; */-ms-transform: translateY(-50%);transform: translateY(-50%);border: 1px solid #DEDEDE;box-sizing: border-box;box-shadow: 0px 4px 38px rgba(0, 0, 0, 0.4);border-radius: 4px;';				
	  		
			// Contenedor de HEADER de tabla
			renderer.sheetDivChildDiv = document.createElement('div');
			renderer.sheetDivChildDiv.id='header_xlsx';
			renderer.sheetDivChildDiv.style='padding: 10px 0;';
			
		    //Prime fila de HEADER
			renderer.sheetHeaderChildRow1 = document.createElement('div');
			renderer.sheetHeaderChildRow1.class = 'cencilio_row';
			renderer.sheetHeaderChildRow1.style = 'margin-bottom: 50px;';

			renderer.sheetHeaderChildCol1 = document.createElement('div');
			renderer.sheetHeaderChildCol1.class = 'cencilio-col';
			renderer.sheetHeaderChildCol1.style = 'width: 50%; float:left;';

			renderer.sheetHeaderChildCol2 = document.createElement('div');
			renderer.sheetHeaderChildCol2.class = 'cencilio-col';
			renderer.sheetHeaderChildCol2.style = 'position:relative; width: 50%; float:left;';

			//Boton de cerrar
			let closeRenderer = document.createElement('button');
			closeRenderer.style = 'background-color: white;border: 0px;';
			closeRenderer.onclick = function(e){
				document.getElementById('sheet_div').remove();		
				renderer.set_virtual = true; //user decides to rebuild context	
			}
			closeRenderer.id = 'close_sheet';
			let closeImg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			let iconClosePath = document.createElementNS('http://www.w3.org/2000/svg','path');
			closeImg.setAttribute('fill', Options['theme']['global']['primaryButtonColor']);
			closeImg.setAttribute('viewBox', '0 0 24 24');
			closeImg.setAttribute('width', '24px');
			closeImg.setAttribute('height', '24px');
			closeImg.classList.add('post-icon');
			iconClosePath.setAttribute(
			  'd',
			  'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
			);	
			closeImg.appendChild(iconClosePath);	
			closeRenderer.appendChild(closeImg);			
			document.body.appendChild(renderer.sheetDiv);
			renderer.sheetHeaderChildCol1.appendChild(closeRenderer);
			//document.getElementById('sheet_div').appendChild(closeRenderer);	

			// Nombre de archivo
			renderer.sheetDivChildStrong = document.createElement('strong');
	  		renderer.sheetDivChildStrong.id = 'cencilio_file_name';
			renderer.sheetDivChildStrong.style='font-size: 18px;text-overflow: ellipsis;overflow: hidden; white-space: nowrap; display: inline-grid; max-width: 200px;';
			renderer.sheetDivChildStrong.innerHTML = '';
			renderer.sheetHeaderChildCol1.appendChild(renderer.sheetDivChildStrong);

			//SELECT DE HOJAS
			let sheetDivChildInput = document.createElement('select');
			sheetDivChildInput.id='sheet_select';
			sheetDivChildInput.placeholder='Nombre de hoja'; 
			sheetDivChildInput.style='width: 136px; border-radius: 2px;height: 32px; display: inline-block; margin: 0 10px;';
			//change page
			sheetDivChildInput.onchange = function(e){
				let sheet = renderer.loadTable(workbook.SheetNames.indexOf(e.target.value));
				renderer.page = 0;	
				for(var c = 2; c <= document.getElementById('sheet_div').length; ++c){
					document.getElementById('sheet_div').childNodes[c] = sheet[c-2];		
				}
				renderer.page_shift = false;
			}
			renderer.sheetDivChildInput = sheetDivChildInput;
			renderer.sheetHeaderChildCol1.appendChild(renderer.sheetDivChildInput);

			// Texto de total de filas con y sin errores
			renderer.sheetHeaderSelectsContainer = document.createElement('div');
			renderer.sheetHeaderSelectsContainer.style ='position: absolute; top: 50%; transform: translateY(-50%);';
			renderer.sheetDivGrandChildSpan = document.createElement('span');
			renderer.sheetDivGrandChildSpan.id = 'total_sheets';
			renderer.sheetDivGrandChildSpan.innerHTML = 'Total: 0 | ';
	  		renderer.sheetDivGrandChildSpan2 = document.createElement('span');
			renderer.sheetDivGrandChildSpan2.id = 'error_sheets'; 
			renderer.sheetDivGrandChildSpan2.innerHTML = 'Con errores:'; 
			renderer.sheetHeaderSelectsContainer.appendChild(renderer.sheetDivGrandChildSpan);
			renderer.sheetHeaderSelectsContainer.appendChild(renderer.sheetDivGrandChildSpan2);
			renderer.sheetHeaderChildCol2.appendChild(renderer.sheetHeaderSelectsContainer);

			//Boton de cargar
	  		renderer.sheetDivGrandChildButton = document.createElement('button');
			renderer.sheetDivGrandChildButton.id='cargar'; 
			renderer.sheetDivGrandChildButton.type = 'button';
			renderer.sheetDivGrandChildButton.name='cargar';
			renderer.sheetDivGrandChildButton.class='cargar'; 
			renderer.sheetDivGrandChildButton.style='height: 36px; width: 122px; border-width: 0px; border-radius: 5px; padding: 8px;  background-color: rgb(7, 40, 140); color: #FFFFFF; float: right;';
			renderer.sheetDivGrandChildButton.innerHTML = 'CARGAR DATOS';
			renderer.sheetHeaderChildCol2.appendChild(renderer.sheetDivGrandChildButton);

			//SEGUNDA FILA de Header
			renderer.sheetHeaderChildRow2 = document.createElement('div');
			renderer.sheetHeaderChildRow2.class = 'cencilio_row';
			renderer.sheetHeaderChildRow2.style = 'margin-bottom: 50px;';

			renderer.sheetHeaderChildCol3 = document.createElement('div');
			renderer.sheetHeaderChildCol3.class = 'cencilio-col';
			renderer.sheetHeaderChildCol3.style = 'width: 50%; float:left;';

			renderer.sheetHeaderChildCol4 = document.createElement('div');
			renderer.sheetHeaderChildCol4.class = 'cencilio-col';
			renderer.sheetHeaderChildCol4.style = 'position:relative; width: 50%; float:left;';

			//Instrucciones

			renderer.sheetDivGrandChildOptionsDivSpan = document.createElement('p');  
			renderer.sheetDivGrandChildOptionsDivSpan.style='font-weight: 700;';
			renderer.sheetDivGrandChildOptionsDivSpan.innerHTML = 'Instrucciones:'; 
			renderer.sheetDivGrandChildOptionsDivLabel = document.createElement('span');  
			renderer.sheetDivGrandChildOptionsDivLabel.style='font-weight: 400; ';
			renderer.sheetDivGrandChildOptionsDivLabel.innerHTML = 'Selecciona la página que necesites validar y corrobora que no hayan errores.';
			renderer.sheetHeaderChildCol3.appendChild(renderer.sheetDivGrandChildOptionsDivSpan);
			renderer.sheetHeaderChildCol3.appendChild(renderer.sheetDivGrandChildOptionsDivLabel);


			//Filtros de checkbox
			renderer.sheetDivCheckChanged = document.createElement('input');  
			renderer.sheetDivCheckChanged.id = 'show_changed'; 
			renderer.sheetDivCheckChanged.type='checkbox'; 
			//view changed
			renderer.sheetDivCheckChanged.onchange = function(e){
				renderer.render_edited_page(e.target.checked);
			}; 
			
			renderer.sheetDivCheckChangedLabel = document.createElement('label');  
			renderer.sheetDivCheckChangedLabel.style='font-size: 14px; top: -2px; position: relative; margin-right: 10px;';
			renderer.sheetDivCheckChangedLabel.id = 'show_changed_label'; 
			renderer.sheetDivCheckChangedLabel.htmlFor = 'show_changed';
			renderer.sheetDivCheckChangedLabel.innerHTML = ' Mostrar filas editadas';

			renderer.sheetDivCheckInvalid = document.createElement('input');  
			renderer.sheetDivCheckInvalid.id = 'show_errors'; 
			renderer.sheetDivCheckInvalid.name = 'show_errors'; 
			renderer.sheetDivCheckInvalid.type='checkbox'; 
			//view errors
			renderer.sheetDivCheckInvalid.onchange = function(e){
				renderer.render_invalid_page(e.target.checked);			
			}; 
			renderer.sheetDivCheckInvalidLabel = document.createElement('label');  
			renderer.sheetDivCheckInvalidLabel.style='font-size: 14px; top: -2px; position: relative; margin-right: 10px;';
			renderer.sheetDivCheckInvalidLabel.id = 'show_errors_label'; 
			renderer.sheetDivCheckInvalidLabel.htmlFor = 'show_errors';
			renderer.sheetDivCheckInvalidLabel.innerHTML = ' Mostrar filas con errores';
			
			renderer.sheetHeaderChildCol4.appendChild(renderer.sheetDivCheckChanged);
			renderer.sheetHeaderChildCol4.appendChild(renderer.sheetDivCheckChangedLabel);
			renderer.sheetHeaderChildCol4.appendChild(renderer.sheetDivCheckInvalid);
			renderer.sheetHeaderChildCol4.appendChild(renderer.sheetDivCheckInvalidLabel);

			renderer.sheetHeaderChildRow1.appendChild(renderer.sheetHeaderChildCol1); 
			renderer.sheetHeaderChildRow1.appendChild(renderer.sheetHeaderChildCol2); 
			renderer.sheetDivChildDiv.appendChild(renderer.sheetHeaderChildRow1);
			renderer.sheetHeaderChildRow2.appendChild(renderer.sheetHeaderChildCol3); 
			renderer.sheetHeaderChildRow2.appendChild(renderer.sheetHeaderChildCol4); 
			renderer.sheetDivChildDiv.appendChild(renderer.sheetHeaderChildRow2);


			//default primary button color
			//console.info(Options['theme']['global']['primaryButtonColor']);
			if (typeof Options['theme']['global']['primaryButtonColor'] === 'undefined'){
				renderer.sheetDivGrandChildButton.style.backgroundColor = '#07288C';
				document.getElementById('close_button').style.backgroundColor = '#07288C';
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
				renderer.sheetDivGrandChildButton.style.color = '#FFFFFF';
			}
			else{ //cencilio user primary text color
				if (7 <= Options['theme']['global']['primaryTextColor'].length <= 9){
					if (Options['theme']['global']['primaryTextColor'].includes('#')){
						renderer.sheetDivGrandChildButton.style.color = Options['theme']['global']['primaryTextColor'];
					}
				}
			}

			//cencilio default background color
			if (typeof Options['theme']['global']['backgroundColor'] === 'undefined'){
				renderer.sheetDiv.style.backgroundColor = '#FFFFFF';
				//document.getElementById('raw_response_header').style.backgroundColor = '#FFFFFF';
				document.getElementById('data_exported').style.backgroundColor = '#FFFFFF';
				//document.getElementById('cencilio-importer').style.backgroundColor = 'repeating-linear-gradient(90deg, #9c989b, #c7c7c7 51%, #8a00c7) var(--x, 0)/ 400%';
				document.getElementById('ppbutton').style.backgroundColor = '#FFFFFF';
			}
			else{ //cencilio user background color
				if (Options['theme']['global']['backgroundColor'].length <= 7){
					if (Options['theme']['global']['backgroundColor'].includes('#')){
						renderer.sheetDiv.style.backgroundColor = Options['theme']['global']['backgroundColor'];
						//document.getElementById('raw_response_header').style.backgroundColor = Options['theme']['global']['backgroundColor'];
						document.getElementById('data_exported').style.backgroundColor = Options['theme']['global']['backgroundColor'];
						//document.getElementById('cencilio-importer').style.backgroundColor = Options['theme']['global']['backgroundColor'];
						document.getElementById('ppbutton').style.backgroundColor = Options['theme']['global']['backgroundColor'];
					}
				}
			}
			//cencilio default text color
			if (typeof Options['theme']['global']['textColor'] === 'undefined'){
				renderer.sheetDiv.style.color = '#07288C';
				//document.getElementById('raw_response_header').style.color = '#07288C';
				document.getElementById('data_exported').style.color = '#07288C';
			}
			else{ //cencilio user text color
				if (7 <= Options['theme']['global']['textColor'].length <= 9){
					if (Options['theme']['global']['textColor'].includes('#')){
						renderer.sheetDiv.style.color = Options['theme']['global']['textColor'];
						//document.getElementById('raw_response_header').style.color = Options['theme']['global']['textColor'];
						document.getElementById('data_exported').style.color = Options['theme']['global']['textColor'];
						renderer.sheetDivChildStrong.style.color = Options['theme']['global']['textColor'];
					}
				}
			}
			//cencilio user defined font color
 			if (typeof Options['theme']['global']['fontFamily'] !== 'undefined'){
 				renderer.sheetDiv.style.fontFamily = Options['theme']['global']['fontFamily']; 
 				//document.getElementById('raw_response_header').style.fontFamily = Options['theme']['global']['fontFamily'];
 				document.getElementById('data_exported').style.fontFamily = Options['theme']['global']['fontFamily'];
 				document.getElementById('cencilio-importer').style.fontFamily = Options['theme']['global']['fontFamily'];
 				renderer.sheetDivChildStrong.style.color = Options['theme']['global']['fontFamily'];
 			} 
			//cencilio default shadow color
			if (typeof Options['theme']['global']['shadowColor'] === 'undefined'){
				renderer.sheetDiv.style.boxShadow = 'rgb(210, 191, 241) 0px 2px 8px 5px;';
				//document.getElementById('raw_response_header').style.boxShadow = 'rgb(210, 191, 241) 0px 2px 8px 5px;';
			}
			else{ //cencilio user shadow color
				if (7 <= Options['theme']['global']['shadowColor'].length <= 9){
					if (Options['theme']['global']['shadowColor'].includes('#')){
						renderer.sheetDiv.style.boxShadow = Options['theme']['global']['shadowColor'];
						//document.getElementById('raw_response_header').style.boxShadow = Options['theme']['global']['shadowColor'];
					}
				}
			}
			//cencilio default JSON background color
			if (typeof Options['theme']['global']['jsDataColor'] === 'undefined'){
				//document.getElementById('js_data').style.boxShadow = 'rgb(0 0 0 / 16%)';
			}
			else{ //cencilio user JSON background color
				if (7 <= Options['theme']['global']['jsDataColor'].length <= 9){
					if (Options['theme']['global']['jsDataColor'].includes('#')){
						//document.getElementById('js_data').style.boxShadow = Options['theme']['global']['jsDataColor'];
					}
				}
			}
				

			//DIV contenedor de respueta JSON
			renderer.sheetDivGrandChildButton.onclick = function(e){
				/* add to workbook */
				var wb = XLSX.utils.book_new();
				let xlsDoc = [];				
				let json_string = '{';
				this.await = true;
				if (typeof renderer.check_transversal !== 'undefined'){
					this.editing = renderer.check_transversal; //user basis
				}
				else{
					this.editing = renderer.page; //program basis
				}
				try{
					json_string += '"Page '+ this.editing +'": ';
					let xlsTable = document.createElement('table');
					this.total_rows = '';
					this.total_cols = '';
					let first_out = false;
					let col_out = false;
					let first_passed = false;						
					for (var R = 0; R < renderer.excel_data[this.editing].length; R++){
						try{
							if (document.getElementById('render_row_'+R).discarded === true){
								if (R === 0){
									if (first_passed === false){
										first_out = true;
									}
								}
								continue;					
							}
							else if (document.getElementById('render_row_'+(R+1)) !== null){
								//add syntax to keep storage after only z0			
								if (document.getElementById('render_row_'+(R+1)).discarded === true){
									this.await = false;
								}
								else{
									this.await = true;							
								}
							}														
							else{
								//storing is irrelevant							
							}
						}
						catch (error){ //row with id does not exist
							console.info(error);
							continue;							
						}
						if (R === 0){
							//open page
							this.json_row = '[{';
							this.col = '[{';						
						}
						else if (first_out === true){
								//start page without first row
							this.json_row = '[{';
							this.col = '[{';	
							first_out = false;	
							first_passed = true;				
						}
						else{
							if (document.getElementById('render_row_'+(R-1)).discarded === true){
								//must have await syntax
								this.col = ',{';																				
							}	
							else{
								//does not need await syntax
								this.col = '{';																		
							}												
						}
						this.json_row += '';
						//open row
						this.row = '[';
						for (var C = 0; C < renderer.excel_data[this.editing][R].length; C++){
							this.process = document.getElementById('sheet_rows').childNodes[R].childNodes[C+1].childNodes[0].trying;
							this.ground = true;		
							if (this.process.length === 0){
								this.process = [null];
								this.ground = false;
							}						
							else{
								if (1 === this.process.length){
									if (this.process[0] === null){
										this.ground = false;
									}
								}
							}				
							if (this.process.includes('re')){
								//prove all data in document without editing
								this.ground_truth = renderer.prove(document.getElementById('sheet_rows').childNodes[R].childNodes[C+1].childNodes[0], C, R, this.editing, renderer.excel_data[this.editing][R][C], this.process, renderer.dom_factor[C][0][0].error, true, false); //all info has been traversed and processed							
							}
							else if (this.process.includes('unique')){
								//prove all data in document without editing
								this.ground_truth = renderer.prove(document.getElementById('sheet_rows').childNodes[R].childNodes[C+1].childNodes[0], C, R, this.editing, renderer.excel_data[this.editing][R][C], this.process, renderer.dom_factor[C][0][0].error, true, false); //all info has been traversed and processed							
							}
							else{
								//prove all data in document without editing
								this.ground_truth = renderer.prove(false, C, R, this.editing, renderer.excel_data[this.editing][R][C], this.process, renderer.dom_factor[C][0][0].error, true, false); //all info has been traversed and processed														
							}
							//item to validate
							if (this.ground === true){
								if (R !== 0){
									//not fundamental
									console.info('GROUND TRUTH', this.ground_truth);
									if (this.ground_truth !== true){
										alert('Error de indice: el documento aun contiene celdas sin corregir.');	
										return null;
									}
									else{
									}
								}										
							}												
							try{
								this.key = renderer.dom_factor[C][0][0].key; //user key
							} 
							catch (error){
								this.key = 'New';	//system key		
								console.info(error);				
							}
							if (renderer.excel_data[this.editing][R][C] === null){
								this.data = '';								
							}
							else{
								this.data = renderer.excel_data[this.editing][R][C];								
							}
							//add row
							this.row += '{"'+this.key+'": "'+this.data+'"}';
							this.col += '"'+this.key+'": "'+this.data+'"';
							if (C+1 < renderer.excel_data[this.editing][R].length){
								this.row += ',';			
								this.col += ',';
							}
						}
						//close row
						this.row += ']';
						if (R+1 < renderer.excel_data[this.editing].length){
							//close column
							this.col += '}';
							//waiting for next checked info at both
							if (this.await === true){
								this.col += ',';				
								this.row += ',';	
							}	
							else{
								//rows are not disclosed in new documents						
							}							
						}
						else{
							this.col += '}';					
						}							
						this.total_rows += this.row;		
						this.total_cols += this.col;		
					}		
					//finish info										
					this.total_cols += ']';
					XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(JSON.parse(this.total_cols)), renderer.page_names[this.editing]);	
					this.json_row += this.total_rows;
					//closes while not awaiting
					this.json_row += '}]';		
					json_string += this.json_row;		
					//annotates while not awaiting
					if (this.editing+1 < renderer.excel_data.length){
						json_string += ',';					
					}
					xlsDoc.push(xlsTable);
				}
				catch (error){
					console.info(error);
					console.info('RESPONSE IS DAMAGED');						
					//column is not transversal because it has damaged response
					console.info('Info obtenida', this.total_cols); 
					//independent damage occurs for all data in pages
					console.info('Respuesta', this.total_rows); 
					alert('No ha seleccionado filas para guardar sus datos.');						
					//console.info('La respuesta de pagina aun se puede guardar', JSON.parse('{ "Page 0": [{'+this.total_rows+'}]}'));
					return null;					
				}
				json_string += '}';
				let jsonData = json_string;
				/* make the worksheet */
				/* generate an XLSX file */
				XLSX.writeFile(wb, '[cencilio]'+document.getElementById('cencilio_file_name').innerHTML);					
            console.log('JSON RESPONSE:', jsonData);	
            document.getElementById('sheet_div').remove();
            document.getElementById('data_exported').style.display = 'block';
            //response is clean
            return jsonData;		
			}
			

			//Mensaje de Sólo fila invalida
			renderer.sheetDivSpan2 = document.createElement('span');  
         renderer.sheetDivSpan2.innerHTML = 'Sólo fila inválida';
         renderer.sheetDivSpan2.style = 'margin-top: -140px;position: absolute;margin-left: 32px;font-size: 80%;';
			 
			 //Contenedor de MENSAJE
			renderer.sheetDivGrandChildOptionsDiv2 = document.createElement('div');  
			renderer.sheetDivGrandChildOptionsDiv2.style='overflow-y: scroll; overflow-x: hidden; max-height: 144px;';
			renderer.sheetDivGrandChildOptionsDiv2.id = 'mensajes';	

			//TABLA DE RENDERIZADO DE EXCEL
			let sheetDivTable = document.createElement('table');  
			let sheetDivHead = document.createElement('thead');  
			let sheetDivTableBody = document.createElement('tbody');  
			sheetDivHead.id = 'sheet_headers'
         sheetDivTableBody.id='sheet_rows';

			let sheetFieldSelector = document.createElement('tr');  
			sheetFieldSelector.id = 'sheetFieldSelector';
			//Empty th for table structure
			sheetFieldSelector.appendChild(document.createElement('th'));
			sheetDivHead.appendChild(sheetFieldSelector);		

			// DATA TYPES TEXTs
			let sheetDivDtypeRow = document.createElement('tr');  
			sheetDivDtypeRow.id = 'sheetDtype'
			sheetDivHead.appendChild(sheetDivDtypeRow);
			
			sheetDivTable.appendChild(sheetDivHead);
			sheetDivTable.appendChild(sheetDivTableBody);
			
			let fields = Options['fields'];
			for (var j = 0; j < fields.length; j++) {
				//console.info(renderer.dom_factor);
				if (typeof fields[j]['validators'] !== 'undefined'){
					let validators = new ElReqs();
					for(var set = 0; set <= fields[j]['validators'].length; ++set){
						try{
							if (typeof fields[j]['validators'][set] === 'undefined'){
								continue;				
							}
							if (fields[j]['validators'][set]['validate'] === 'required'){
								validators.required = true;				
							}
							else if (fields[j]['validators'][set]['validate']  === 'unique'){
								validators.unique = true;				
							}
							else if (fields[j]['validators'][set]['validate']  === 'regex_match'){
								validators.regex = true;				
							}
							if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
								validators.error = true;				
							}				
							if (validators.required === true){
								renderer.ndata = new DOMNodeFactors(true, fields[j]['label'], fields[j]['key']);
								if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
			   					renderer.ndata.error = fields[j]['validators'][set]['error'];
	  	 						}
								if (fields[j]['validators'][set]['validate'] === 'regex_match'){
			   					renderer.ndata.re = fields[j]['validators'][set].regex;
	  	 						}
							}
							else{
								renderer.ndata = new DOMNodeFactors(false, fields[j]['label'], fields[j]['key']);
								if (typeof fields[j]['validators'][set]['error'] !== 'undefined'){
			   					renderer.ndata.error = fields[j]['validators'][set]['error'];
	  	 						}
								if (fields[j]['validators'][set]['validate'] === 'regex_match'){
			   					renderer.ndata.re = fields[j]['validators'][set].regex;
	   						}
							}

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

			for(var sh = 0; sh <= workbook.SheetNames.length; ++sh){ 
				try{
					var sheet = workbook.Sheets[workbook.SheetNames[sh]]; // get the first worksheet
					renderer.page_names.push(workbook.SheetNames[sh]);
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
					//avoid creating an extra option to store at new page
					if (sh === 0){					
						let sheetDivTableD = document.createElement('th'); 
						sheetDivTableD.id = 'show_changed_container'; 
						let sheetDivTableDIn = document.createElement('input'); 
						sheetDivTableDIn.id='select_all'; 
						this.range = range.e.r;
						//unclick or click all rows as a user option
						sheetDivTableDIn.onchange = function(e){
							if (renderer.excel_data.length === 0){
								this.Size = this.range;							
							}
							else{
								this.Size = renderer.excel_data[0].length;							
							}
  							for (var i = 0; i < this.Size; i++) {
  								if (document.getElementById('render_row_'+String(i)) !== null){
  									document.getElementById('render_row_'+String(i)).click();
								}
  							}		
						}; 
						sheetDivTableDIn.type='checkbox'; 
						sheetDivTableDIn.click();
						//getElementById returns null!
						//child is added to structure before substracting another 
						if (Utils.findChildById(sheetDivDtypeRow,'select_all',true) === null){				 
							sheetDivTableD.appendChild(sheetDivTableDIn);	
						} 
						sheetDivDtypeRow.appendChild(sheetDivTableD);
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
	   	      		renderer.falsable_cells[sh][R][C] = false;
         			}	       	
	   			}
	   			//copying original information 
	   			renderer.excel_data[sh] = page_data; //element-wise			
				}
				catch (error){ //looping sums 1
					console.info(error);
				}
	   	}
	   	renderer.page = 0;
	   	renderer.sheetDivTable = sheetDivTable;
	   	renderer.deep_excel_data = JSON.parse(JSON.stringify(renderer.excel_data));			
			renderer.sheetDiv.appendChild(renderer.sheetDivChildDiv);
			renderer.sheetDiv.appendChild(renderer.sheetDivTable); 
			//Contenedor de tabla
			let tableScrollDiv = document.createElement('div');
			tableScrollDiv.id = 'page_table';
			tableScrollDiv.style = 'overflow-x: scroll; height: 300px; overflow-y: scroll;width: 100%;table-layout: fixed;';
			tableScrollDiv.appendChild(renderer.sheetDivTable);
			renderer.sheetDiv.appendChild(tableScrollDiv);	
			renderer.prev_exp = 0; //start transversal		
	   	let sheet1 = renderer.loadTable(0);	
			let selectorIncrement = 125;		
	  		for (var vtypei = 0; vtypei < renderer.tableSize+1; ++vtypei) { //test inside (not from) table
	  			if (renderer.tableSize+1 <= vtypei){
					break;	  					
	  			}
				let tdLabelShiftDiv = document.createElement('div');
				  
				//Estilo de container de select de campos
				let tdLabelSelector = document.createElement('select');  
				tdLabelSelector.id='select_all_selector_'+String(vtypei); 
				//Estilo de selects de campos
				//swap testing when necessary
				tdLabelSelector.onchange = function (e){
					try{
						let children = e.target.choices;
						this.selectors = document.getElementById('sheetFieldSelector').childNodes;
						for(var vtypec = 1; vtypec <= this.selectors.length-1; ++vtypec) {
							this.selectors[vtypec].childNodes[0].childNodes[0].childNodes[e.target.choices.indexOf(e.target.value)].disabled = true; 
							this.selectors[vtypec].childNodes[0].childNodes[0].childNodes[e.target.choices.indexOf(e.target.prev)].disabled = false;															
						}		
						e.target.prev = e.target.value;	
						if (typeof renderer.check_transversal === 'undefined'){
							this.editing = renderer.check_transversal; //user basis
						}
						else{
							this.editing = renderer.page; //program basis
						}
						
						this.validating = false;	
						this.pure = true;		
						try{
							if (renderer.dom_factor[e.target.choices.indexOf(e.target.value)][0][1] !== null){								
								if (renderer.dom_factor[e.target.choices.indexOf(e.target.value)][0][1].error === true){
									this.validating = true;
								}				
							}
						}
						catch (error){								
							renderer.swap_columns(this.editing, parseInt(e.target.id.split('select_all_selector_')[1])+1, 'pure', this.pure);	
							return null;
						}

						if (this.validating === true){
							this.pure = false;			
						}						
						renderer.swap_columns(this.editing, parseInt(e.target.id.split('select_all_selector_')[1])+1, e.target.choices.indexOf(e.target.value)+1, this.pure);					
					}
					catch (error){
					}
				}				 
				tdLabelSelector.choices = [];
				tdLabelShiftDiv.appendChild(tdLabelSelector);					
				let tdFieldSelector = document.createElement('th');
				//user structure => unbiased test possibilities
	  			for(var vtypec = 0; vtypec <= renderer.tableSize+1; ++vtypec) { 
					let selectOption = document.createElement('option'); 
					try{
						if (renderer.tableSize+1 === vtypec){ //applies for user test
							this.abstract_key	= '--';	
							this.abstract_label = '--'; 		
							this.abstract_empty = true;																		
							selectOption.value = this.abstract_key;
							tdLabelSelector.choices.push(this.abstract_key);
							selectOption.innerHTML = this.abstract_label;
							selectOption.defaultSelected = true;	
							tdLabelSelector.prev = this.abstract_key;							
							tdLabelSelector.appendChild(selectOption);							
						} 	
						else{
							selectOption.value = renderer.dom_factor[vtypec][0][0].key;
							tdLabelSelector.choices.push(renderer.dom_factor[vtypec][0][0].key);
							selectOption.innerHTML = renderer.dom_factor[vtypec][0][0].label;
							if (vtypei === vtypec){
								tdLabelSelector.prev = renderer.dom_factor[vtypec][0][0].key;							
							}
							tdLabelSelector.appendChild(selectOption);									
						}
					}
					catch (error){
					}
				};  	
				tdLabelShiftDiv.appendChild(tdLabelSelector);
				tdFieldSelector.appendChild(tdLabelShiftDiv);	
				tdFieldSelector.id='selectortd_'+vtypei;
				if (Utils.findChildById(sheetFieldSelector,tdLabelSelector.id,true) !== null){	
					continue;			
				}														
				if (vtypei === renderer.tableSize){ 
					//skip before unset testing 
				}
				else{
					sheetFieldSelector.appendChild(tdFieldSelector);	
					let tdDtypeCol = document.createElement('th');  
					let dtypeColSpan = document.createElement('span');  
					dtypeColSpan.id = 'dtype_'+String(vtypei);  
					if (document.getElementById(dtypeColSpan.id) !== null){
					}														
					
					//ghost dtype
					dtypeColSpan.innerHTML = 'unset';	
   	    	  	if (parseInt(renderer.excel_data[0][3][vtypei]) === Number.isNaN()){
						dtypeColSpan.innerHTML = 'String';      						
       		  	}
	       		else if (renderer.excel_data[0][3][vtypei] === ''){    	  						
   					dtypeColSpan.innerHTML = 'undef';	  						
       	  		}
	       		else if (renderer.excel_data[0][3][vtypei] === null){    	  						
   					dtypeColSpan.innerHTML = 'undef';	  						
       	  		}
	       	  	else if (renderer.excel_data[0][3][vtypei].match(/\d+/g) === null){	  //string without numbers	  						
   					dtypeColSpan.innerHTML = 'String';	  						
	       	  	}
		       	else if ((parseFloat(renderer.excel_data[0][3][vtypei]) % 1) !== 0){	  //number with remaining part 	  						
   					dtypeColSpan.innerHTML = 'Float';	  						
       	  		}
	       	  	else{ //does not have remaining part
   					dtypeColSpan.innerHTML = 'Int';	  			
      	 	  	}
       		  	dtypeColSpan.style.marginLeft = '-32px';		
					tdDtypeCol.appendChild(dtypeColSpan);	
					document.getElementById('sheetDtype').appendChild(tdDtypeCol);							
				}				
			}	  	   	
	   	for (var s = 0; s < sheet1.length; s++) {
				document.getElementById('sheet_rows').appendChild(sheet1[s]);	   
	   	}
	   	renderer.sheetDivChildStrong.innerHTML = renderer.file_name;
			//CONSENT BEFORE DATA STRUCTURE BEFORE VALIDITY	
			renderer.complete = true;   	
			renderer.set_virtual = false;
			return renderer.split_resp;
		}				
		else { //validationError since key is nowhere in database
			document.getElementById('api_error').style.display = 'block';
			document.getElementById('spinner').style.display = 'none';
			return 'validationError';				
		}
  	};
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
	  	var reader = new FileReader();
	  	let next_col = false;
	  	reader.onloadend = function(e) {

	  		var data = e.target.result;
	  		data = new Uint8Array(data);
	  		//process_wb(XLSX.read(data, {type: 'array'}));
	  		/* read the file */  		
	  		var workbook = XLSX.read(data, {type: 'array'}); // parse the file
			//USER BASED
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
			   	document.getElementById('draggerInputsContainer').style.display = 'none';
				document.getElementById('spinner').style.display = 'block';
			

			}
    	};
    	reader.onabort = function (e) {
      	e.abort();
    	};    		
    	reader.onloadstart = function (e) {
 
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
		this.page_names = [];
		this.vals_unique = [];
		if (typeof config['theme'] === 'undefined'){
			config['theme'] = {
        				global: {
              			backgroundColor: '#FFFFFF',
              			textColor: '#07288C',
              			primaryTextColor: '#FFFFFF',
              			primaryButtonColor: '#07288C',
              			errorColor: '#F97F7F'
            		}
    				}
		}
		let invalidKey = document.createElement('div');
		invalidKey.id = 'api_error';
		invalidKey.style = 'position: relative; top: 50%; transform: translateY(-50%); display: none;';
		invalidKey.innerHTML = 'Error en la carga: valida tu API key';
		let dragger = document.getElementById('cencilio-importer');	
		dragger.className = 'dragger';
		//dragger.id = 'xls_dragger';
		dragger.style.backgroundColor = config['theme']['global']['backgroundColor']; 
		if (typeof config['height'] !== 'undefined'){
			dragger.style.height = String(config['height'])+'px'; //user based
		}
		else{
			dragger.style.height = '200px'; //load based	
		}
		if (typeof config['width'] !== 'undefined'){
			dragger.style.width = String(config['width'])+'px'; //user based
		}	
		else{
			dragger.style.width = '300px'; //load based 
		}
		if (typeof config['theme']['global']['textColor'] === 'undefined'){
			document.getElementById('cencilio-importer').style.color = '#07288C';
		}
		else{
			document.getElementById('cencilio-importer').style.color = config['theme']['global']['textColor'];
		}	

		dragger.draggable = true; //No ocurre
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
    			try{
					renderer.file_name = file.name;
					renderFun(file,config);  
				}
				catch (error){				
				}
  			} else {
    			var file = ev.dataTransfer.files[0];
				renderFun(file,config);    	
  			}				
		};


		let draggerForm = document.createElement('form');	
		draggerForm.className = 'pimg';
		draggerForm.id = 'pimg';
		draggerForm.style = 'position: relative; width: 100%;height: 100%; text-align: center; outline-offset: -10px; outline: 2px dashed'+config['theme']['global']['textColor']+';';
		draggerForm.enctype = 'multipart/form-data';

		let draggerInputsContainer = document.createElement('div');
		draggerInputsContainer.id= 'draggerInputsContainer';
		draggerInputsContainer.style = 'position: relative; top: 50%; transform: translateY(-50%);';

		let draggerImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		let iconPath = document.createElementNS('http://www.w3.org/2000/svg','path');
		draggerImg2.setAttribute('fill', config['theme']['global']['textColor']);
		draggerImg2.setAttribute('viewBox', '0 0 50 43');
		draggerImg2.setAttribute('width', '100%');
		draggerImg2.setAttribute('height', '30px');
		draggerImg2.classList.add('post-icon');
		iconPath.setAttribute(
		  'd',
		  'M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z'
		);	  
		draggerImg2.appendChild(iconPath);
		draggerInputsContainer.appendChild(draggerImg2);

		let draggerInput = document.createElement('input');	
		draggerInput.type = 'file';
		draggerInput.id = 'pIn';
		draggerInput.accept = '.xlsx, .xls, .csv';
		draggerInput.style='height: 0.1px; width: 0.1px; z-index: -1; opacity: 0; overflow: hidden; position: absolute;';
		draggerInputsContainer.appendChild(draggerInput);
		//process data in file
		draggerInput.onchange = function (e) { 
			renderer.file_name = this.files[0].name;
			renderFun(this.files[0], config);
		};

		let draggerLabel = document.createElement('label');	
		draggerLabel.appendChild(document.createTextNode("Arrastra un archivo aquí o haz click para cargar"));
		draggerLabel.htmlFor='pIn';
		draggerLabel.class='perfil_label';
		draggerLabel.id='importer-msg';
		draggerLabel.style = 'margin-top: 10px; cursor: pointer;';
		draggerInputsContainer.appendChild(draggerLabel);	

		let excelButton = document.createElement('button'); 			
		excelButton.id = 'ppbutton'; 		
		excelButton.style = 'display:none;'; 
		
		//children must be inside parent elements to fit
	 	if (typeof config['height'] !== 'undefined'){ //user basis
 			if (config['height'] <= 200){
 				//fix children displacement	
 				excelButton.style.height = String(config['height'])+'px';
 				//raises the child up to the parent if the size is smaller but child is displaced if parameters change
 			}
 			else{
 				//normal fit
 				excelButton.style.height = String(config['height'])+'px'; 
 			}
 		}
 		if (typeof config['width'] !== 'undefined'){ //user basis
 			if (config['width'] <= 300){
 				//fix children displacement	
 				excelButton.style.width = String(config['width'])+'px'; 
 				//same as 1086
 			}
 			else{
 				//normal fit
 				excelButton.style.width = String(config['width'])+'px';
 			}	
 		}

		let draggerSpinner = document.createElement('div');
		draggerSpinner.appendChild(document.createTextNode("Cargando..."));
		draggerSpinner.id = 'spinner';	
		draggerSpinner.style = 'position: relative; top: 50%; transform: translateY(-50%); display: none;';
		
		draggerInputsContainer.appendChild(excelButton);
		draggerForm.appendChild(draggerSpinner);
		draggerForm.appendChild(draggerInputsContainer);	
		draggerForm.appendChild(invalidKey);
		dragger.appendChild(draggerForm);


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
			document.getElementById('data_exported').style.display = 'none';
			renderer.set_virtual = true;
			//document.getElementById('data_exported').remove();		
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
		document.getElementById('cencilio-importer').appendChild(dataExportDiv);				
		
 		if (typeof config['theme']['global']['errorColor'] !== 'undefined'){
 			this.errorColor = config['theme']['global']['errorColor']; 
 		}		
  }

	tdCombined(event) {
		//solve passive trigger on active element
		if (event.target){
			renderer.cells_names_selected.push(event.target); 		
  			event.target.style.backgroundColor = 'aliceblue';
			if (1 < renderer.cells_names_selected.length){
				renderer.cells_names_selected[0].value += ' '+ event.target.value; //empty the last fired and take the value to the first (delete it itself if the fireing to itself)
				if (renderer.hasOwnProperty('check_transversal')){
					this.editing = renderer.check_transversal; //user basis
				}
				else{
					this.editing = renderer.page; //program basis
				}		
				renderer.excel_data[this.editing][renderer.cells_names_selected[0].row][renderer.cells_names_selected[0].col] += ' '+event.target.value; 		
				renderer.cells_names_selected[1].value = ''; 
				renderer.excel_data[this.editing][event.target.row][event.target.col] = '';
				renderer.cells_names_selected[0].style.backgroundColor = 'white';
				renderer.cells_names_selected[1].style.backgroundColor = 'white';
				//prove cells before emptying combination
				renderer.prove(renderer.cells_names_selected[0],renderer.cells_names_selected[0].col,renderer.cells_names_selected[0].row,this.editing,false,renderer.cells_names_selected[0].trying,renderer.cells_names_selected[0].err_msg,false,false);
				renderer.prove(renderer.cells_names_selected[1],renderer.cells_names_selected[1].col,renderer.cells_names_selected[1].row,this.editing,false,renderer.cells_names_selected[1].trying,renderer.cells_names_selected[1].err_msg,false,false);
				renderer.cells_names_selected = [];
				return null;	
			}
		}
		return null;
	}

	swap_columns(Page,a,b,pure) {
		//DATA STRUCTURE OF SWAPPED COLUMNS
		if (renderer.hasOwnProperty('check_transversal')){
			this.editing = renderer.check_transversal; //user basis
		}
		else{
			this.editing = renderer.page; //program basis
		}
		Page = this.editing;
		let a_idx= [];	
		//let b_idx= [];		
		this.col = 1;	
		if (b !== 'pure'){
			this.dtypeb = document.getElementById('dtype_'+String(b-1));
		}
		this.dtypea = document.getElementById('dtype_'+String(a-1)); 
		//first we get child nodes
		if (b !== 'pure'){
  			for (var row = 0; row < renderer.excel_data[Page].length; row++) {
				for (var col = 0; col < document.getElementById('page_table').childNodes[0].childNodes[1].childNodes.length; col++){
					let row_vals = document.getElementById('page_table').childNodes[0].childNodes[1].childNodes[col];
					if (a_idx.includes(row_vals.childNodes[b].childNodes[0].value) === false){
						if (typeof row_vals.childNodes[b].childNodes[0].value !== 'undefined'){
							//inherit properties from the deep column
							if (row !== 0){
								let invalid = row_vals.childNodes[b].childNodes[0].isinvalid;
								let falsable = row_vals.childNodes[b].childNodes[0].falsable;
								let edited = row_vals.childNodes[b].childNodes[0].isedited;
								let proving = []; 
								//add selected verifications in a list
								if (typeof renderer.dom_factor[b-1][0][1] !== 'undefined'){
									if (renderer.dom_factor[b-1][0][1] !== null){
										if (renderer.dom_factor[b-1][0][1].unique !== false){
											proving.push('unique');								
										}	
										else if (renderer.dom_factor[b-1][0][0].critical !== false){
											proving.push('critical');		
										}		
										else if (renderer.dom_factor[b-1][0][0].re !== false){
											proving.push('re');								
										}
									}
									else if (renderer.dom_factor[b-1][0][0].critical !== false){
										proving.push('critical');				
									}		
									else if (renderer.dom_factor[b-1][0][0].re !== false){
										proving.push('re');								
									}				
								}	
								else if (renderer.dom_factor[b-1][0][0].critical !== false){
									proving.push('critical');						
								}		
								else if (renderer.dom_factor[b-1][0][0].re !== false){
									proving.push('re');								
								}										
								if (proving.length === 0){
									proving = [null];
								}											
								a_idx.push([renderer.deep_excel_data[Page][row][b-1], invalid, falsable, edited, proving]); //value, isinvalid, isfalsable, isedited, trying
							}
							else{
								a_idx.push([renderer.deep_excel_data[Page][row][b-1], false, false, true, [null]]); //value, isinvalid, isfalsable, isedited, trying
							}
	       	  			break;
						}
					}				
				}
			}	
		}	
		//swapping with a pure argument		
		this.a = a;		
  		for (var row = 1; row < renderer.excel_data[Page].length; row++) {
			let row_vals = document.getElementById('page_table').childNodes[0].childNodes[1].childNodes[row];
			if (pure === false){
				//test all values to see which can be corrected
				try{
					//given regexp cannot be accessed from the index
					if (renderer.dom_factor[b-1][0][0].re !== false){
						this.ground_truth = renderer.prove(false, a-1, row, Page, row_vals.childNodes[a].childNodes[0].value, a_idx[row][4], renderer.dom_factor[b-1][0][0].error, false, true, renderer.dom_factor[b-1][0][0].re); //wants to exchange processes with a different regexp				
					}
					else {
						this.ground_truth = renderer.prove(false, a-1, row, Page, row_vals.childNodes[a].childNodes[0].value, a_idx[row][4], renderer.dom_factor[b-1][0][0].error, false, false); //wants to exchange processes		
					}
					//FINDS A TRAVERSED NODE
					if (row_vals.childNodes[a].childNodes[0].isinvalid === true){
						if (this.ground_truth !== false){
							//value passes process
							row_vals.childNodes[a].childNodes[0].isinvalid = false;
							//value can be erroneous
							row_vals.childNodes[a].childNodes[0].falsable = false;
							//information in cell has changed
							row_vals.childNodes[a].childNodes[0].isnewinfo = true;
							row_vals.childNodes[a].childNodes[0].style.backgroundColor = 'white';					
						}		
						else{
							row_vals.childNodes[a].childNodes[0].err_msg = renderer.dom_factor[b-1][0][0].error;		
							row_vals.childNodes[a].childNodes[1].innerHTML = renderer.dom_factor[b-1][0][0].error;		
						}		
					}
					else if (row_vals.childNodes[a].childNodes[0].isinvalid === false){ //ONE CAN BE INVALID AFTER TRANSFER
						row_vals.childNodes[a].childNodes[0].trying = a_idx[row][4]; //test is determined by chooser
						row_vals.childNodes[a].childNodes[0].err_msg = this.dom_factor[b-1][0][0].error; //error must be shown after choosing
						if (this.ground_truth !== true){
							row_vals.childNodes[a].childNodes[0].isinvalid = true;
							row_vals.childNodes[a].childNodes[0].isedited = true;
							//ALL EMPTY ROWS SHOULD CONTAIN AN ERROR
							row_vals.childNodes[a].childNodes[0].falsable = true;
							row_vals.childNodes[a].childNodes[0].style.backgroundColor = renderer.errorColor;			
							//handled row in cell was given a message	
							this.addTooltip(row_vals.childNodes[a], this.dom_factor[b-1][0][0].error);	  					
						}				
					}	
					else if(row_vals.childNodes[a].childNodes[0].isinvalid === true){
						if(row_vals.childNodes[b].childNodes[0].isinvalid === false){
    						row_vals.childNodes[a].childNodes[0].falsable = false;
    					}	
	      		}					
					//CHANGE PROOF AND DTYPE
				}
				catch (error){
					console.info(error, 'ERROR USING', row_vals.childNodes[a], 'WITH A SELECTED', a, 'AND ERROR', this.dom_factor[b-1][0][0].error, 'B', b-1); //TRAVERSES NODES WITHOUT CHILDS
				}
			}
			else{
				//clean selected cell in row  
				this.purify(row_vals.childNodes[a].childNodes[0],a-1,row_vals.childNodes[a].childNodes[0].row,Page);		
			}			
		}	
		if (b !== 'pure'){
			//falsability in structure is only tested after rebuttable write
			//console.info(this.dtypeb);
			this.dtypea.innerHTML = this.dtypeb.innerHTML;	
		}		
	}	

	render_invalid_page(state) {
  		let rows = document.getElementById('sheet_rows').childNodes;
  		this.skip_bad_row = false;
  		this.row = 0;
  		for (var i = 0; i < rows.length; i++) {
  			try{
  				document.getElementById('render_row_'+String(i)).incoming = 'show_errors';
  				if (this.skip_bad_row === false){
  					//continous loop
					this.render_invalid(state,rows[i]); 
				}
  				else{
  					//get the last row
  					this.render_invalid(state,rows[i - this.row]);
					if (i >= (rows.length - this.row)){
						this.render_invalid(state,rows[i]);	//show all the remaining false values at recursion				
					}
				}
			}
			catch (error){
				//the id of an element was skipped due to data structure violations
				this.skip_bad_row = true; 
				this.row += 1;
			}
		}			
	}	

	render_invalid(state,row) {
		if (state === true){
			let children = row.childNodes;
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
			let children = row.childNodes;
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				for (var k = 0; k < grandchildren.length; k++) {		
					if (grandchildren[k].style.backgroundColor === 'black'){
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
						grandchildren[k].style.color = document.getElementById('sheet_div').style.color;
					} 					
				}
			}				
		}
	}		

	allNull(cell) {
  		return cell === null;
	}	

	render_edited_page(state) {
  		let rows = document.getElementById('sheet_rows').childNodes;
  		this.skip_bad_row = false;
  		this.row = 0;
  		for (var i = 0; i < rows.length; i++) {
  			try{
  				document.getElementById('render_row_'+String(i)).incoming = 'show_changed';
  				if (this.skip_bad_row === false){
  					//continous loop
					this.render_edited(state,rows[i]); 
				}
  				else{
  					//get the last row
  					this.render_edited(state,rows[i - this.row]);
					if (i >= (rows.length - this.row)){
						this.render_edited(state,rows[i]);	//show all the remaining edited at recursion				
					}
				}
			}
			catch (error){
				//the id of an element was skipped due to data structure violations
				this.skip_bad_row = true; 
				this.row += 1;
			}
		}					
	}	
	
	render_edited(state,row) {	
		if (state === true){
			let children = row.childNodes;
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				for (var k = 0; k < grandchildren.length; k++) {
  					if (grandchildren[k].type === 'checkbox'){
						continue;  					
  					}
  					else if (grandchildren[k].type !== 'text'){
						continue;  					
  					}
					if (grandchildren[k].isnewinfo === true){
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
			let children = row.childNodes;
  			for (var j = 0; j < children.length; j++) {
  				let grandchildren = children[j].childNodes;
  				for (var l = 0; l < grandchildren.length; l++){
					if (grandchildren[l].style.backgroundColor === 'black'){
						grandchildren[l].style.backgroundColor = 'white';
						if (grandchildren[l].isinvalid !== true){
							grandchildren[l].style.backgroundColor = 'white';
						}
						else{
							grandchildren[l].style.backgroundColor = renderer.errorColor;
						}
					}
					else if (grandchildren[l].style.color === 'black'){
						grandchildren[l].style.color = document.getElementById('sheet_div').style.color;
					}
					grandchildren[l].style.color = document.getElementById('sheet_div').style.color;
				} 					
			}				
		}
	}

	addTooltip(k, msg){
		/*  
			Una funcion que crea un tooltip con un mensaje y lo anexa con su pariente contenedor 	
			Argumentos:
				- k: contenedor pariente de tooltip
				- msg: mensaje para mostrar	
		*/
		//definir el elemento inmutable 'svg' como parte del namespace
		let tooltipSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		//coordenadas de resolucion de la burbuja
		tooltipSVG.setAttribute('viewBox', '0 0 500 375');
		//ancho en mm de la burbuja
		tooltipSVG.setAttribute('width', '68.7916mm');
		//altura en mm de la burbuja
		tooltipSVG.setAttribute('height', '14.31875mm');
		//El dato no tiene control valido (se falsifica y afecta la integridad) por ende necesita un atributo extra que muestre el error cuando el valor se falsifica
		tooltipSVG.setAttributeNS(null, 'displayed', 'true');
		//atributo estandar de visibilidad de burbuja inicial
		tooltipSVG.setAttribute('display', 'none');
										
		//definir el atributo 'path' que guarda los datos del trazo de la burbuja
		let tooltipPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		tooltipPath.setAttribute('id', 'bordered');
		//fill para el color de fondo de la burbuja
		tooltipPath.setAttribute('fill', 'black');
		//stroke para el color del trazo de la burbuja
		tooltipPath.setAttribute('stroke', 'black');
		//stroke-width para el ancho del trazo de la burbuja
		tooltipPath.setAttribute('stroke-width', '1');
		//d para definir el trazo con punto de partida M y contorno C que termina en Z
		tooltipPath.setAttribute('d', 'M 40.00,0.09 C 40.00,0.09 81.00,0.09 81.00,0.09 81.00,0.09 159.00,0.09 159.00,0.09 159.00,0.09 398.00,0.09 398.00,0.09 398.00,0.09 452.00,0.09 452.00,0.09 472.05,0.03 489.76,12.14 496.94,31.00 499.45,37.60 499.99,41.03 500.00,48.00 500.00,48.00 500.00,252.00 500.00,252.00 499.96,278.44 478.44,299.96 452.00,300.00 452.00,300.00 334.00,300.00 334.00,300.00 331.91,300.00 328.94,299.88 327.00,300.60 323.10,302.03 314.38,311.62 311.00,315.00 311.00,315.00 270.00,356.00 270.00,356.00 270.00,356.00 257.00,369.00 257.00,369.00 255.33,370.63 252.49,373.80 250.00,373.80 247.51,373.80 244.67,370.63 243.00,369.00 243.00,369.00 230.00,356.00 230.00,356.00 230.00,356.00 189.00,315.00 189.00,315.00 185.62,311.62 176.90,302.03 173.00,300.60 171.06,299.88 168.09,300.00 166.00,300.00 166.00,300.00 48.00,300.00 48.00,300.00 21.56,299.96 0.04,278.44 0.00,252.00 0.00,252.00 0.00,48.00 0.00,48.00 0.04,23.64 16.68,5.64 40.00,0.09 Z');

		//definir el atributo 'text' que guarda la tipografia del mensaje
		let tooltip_errParent = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		//usamos x como interlineado heredado
		tooltip_errParent.setAttributeNS(null, 'x', '16');
		//usamos y como posicion vertical heredada
		tooltip_errParent.setAttributeNS(null, 'y', '46');
		//font-size
		tooltip_errParent.setAttributeNS(null, 'font-size', '52');
		
		//definimos la cantidad maxima de caracteres segun el ancho
		let max_char = 18;		
		
		//si el mensaje es muy largo hay que acomodarlo en la burbuja
		if (msg.length > max_char){
			//total de caracteres que ocupa el mensaje
			let msg_sum = 0; 	
			//cantidad de caracteres
			let msg_size = msg.length;
			//lista que guarda los tokens textuales
			this.msg_blocks = [];
			//variable que sirve para cambiar el flow del mensaje
			this.msg_overflow = false;
			//variable que mide la cantidad de parrafos segun el flujo
			let parag = 0;
			//variable que puede servir para saber si faltan parrafos
			let remain = 0;
			//variable que determina si el mensaje esta completo
			this.msg_complete = true;
			//cantidad de caracteres por parrafo
			this.span_sum = 0;		
			//cantidad de parrafos por cumputar en relacion al limite de caracteres
			let blocks = parseInt(msg.length/max_char);
			
			//tokenizamos el texto para comenzar a acomodar el mensaje
			for (var token = 0; token < msg.split(' ').length; token++){																				
				let msg_split = msg.split(' ');
				//usamos el parrafo como escalar de caracteres
				let char_scalar = parag + 1;

				//como el espaciado no es un valor de la lista lo sumamos para calcular el limite
				let msg_bound = msg_sum + this.msg_blocks.length;
				//vemos si la dimension del mensaje excede el limite tipografico 
				if ( (max_char * char_scalar) <= (msg_bound) ){
					this.msg_fit = this.msg_blocks.join(' ');
					
					//si el mensaje excede la cantidad de caracteres es necesario extraer una parte para el proximo parrafo  
					this.deep_msg_blocks = JSON.parse(JSON.stringify(this.msg_blocks));
					if (this.msg_fit.length > max_char){
						let last_word = this.deep_msg_blocks.slice(-1);
						this.msg_blocks = this.deep_msg_blocks.pop(); 
						this.msg_fit = this.deep_msg_blocks.join(' ');
						this.msg_blocks = [];							
						this.msg_blocks.push(last_word);																				
					}
					else{
						this.msg_blocks = [];		
					}																																			
					parag += 1;
					//definimos un span de texto para el parrafo
					let tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					//interlineado x
					tooltip_err_span.setAttributeNS(null, 'x', '12');
					//posicion y
					tooltip_err_span.setAttributeNS(null, 'dy', '50');
					//el color de texto se aplica con el atributo de relleno
					tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');
					//asignamos el parrafo resultante  														
					tooltip_err_span.innerHTML = this.msg_fit;
					//el span de texto hereda los atributos de la tipografia
					tooltip_errParent.appendChild(tooltip_err_span);
					//marcamos el exceso de flujo
					this.msg_overflow = true;
					this.span_sum = 0;
					//si el exceso de flujo cambio la cantidad de parrafos el mensaje esta sin completar
					if	(parag >= blocks-1){
						this.msg_complete = false;
						this.msg_blocks = this.msg_blocks;
						this.blocks = blocks;													
					}
				}
				else{
					//si cambio el flujo y al acomodar se separo una parte es necesario agregarla al parrafo nuevo
					if (this.msg_overflow === true){
						this.msg_blocks.push(msg_split[token-1]);	
						this.msg_overflow = false;
					}
					else{
						//condicion para este termino
						if (token === msg.split(' ').length-1){
							this.msg_fit = msg;						
						}					
					}
					//un bloque de mensajes guarda las palabras de un parrafo
					this.msg_blocks.push(msg_split[token]);	
					//la palabra agrega caracteres
					msg_sum += msg_split[token].length;
					//y agrega span
					this.span_sum += msg_split[token].length;												
					remain = 0;
				}
			}	
			//el mensaje no se completo y falta una parte
			if (this.msg_complete === false){
				this.msg_fit = this.msg_blocks.join(' ');						
				this.deep_msg_blocks = this.msg_blocks;
				//suponemos que el ultimo parrafo se puede acomodar a la tipografia
				this.last_slice = true;
				//la ultima parte excede el limite de caracteres
				if (this.msg_fit.length > max_char){	
					let char_sum = 0;
					//eso hace que necesitemos saber si es necesario reacomodar la ultima parte por el limite de caracteres
					for (var token = 0; token < this.deep_msg_blocks.length; token++){
						char_sum += this.deep_msg_blocks[token].length;		
						//nos posicionamos en la palabra que viola el limite para reacomodar la ultima parte
						if ( (char_sum+this.deep_msg_blocks.length) > max_char){
							this.begin_token = token;
							this.last_slice = false;
							break;						
						}			
					}		
					//si la palabra excedida era la ultima la usamos en otro parrafo
					if (this.last_slice === true){
						this.begin_token = this.deep_msg_blocks.length-1;
						this.last_word = this.deep_msg_blocks.slice(-1);
					}	
					else{
						//usamos las que estan fuera de la vista en el proximo acomodamiento
						this.last_word = this.deep_msg_blocks.slice(this.begin_token, this.deep_msg_blocks.length);
						this.last_word = this.last_word.join(' ');
					}	
					//el ultimo bloque que teniamos se divide y acomoda mas palabras en la burbuja
					let last_block = this.deep_msg_blocks.slice(0,this.begin_token).join(' ');	
					//por ende hay mas spans heredados por la division en el limite
					this.tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					this.tooltip_err_span.setAttributeNS(null, 'x', '12');
					this.tooltip_err_span.setAttributeNS(null, 'dy', '50');
					this.tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');														
					this.tooltip_err_span.innerHTML = last_block;		
					tooltip_errParent.appendChild(this.tooltip_err_span);														
					this.tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					this.tooltip_err_span.setAttributeNS(null, 'x', '12');
					this.tooltip_err_span.setAttributeNS(null, 'dy', '50');
					this.tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');														
					this.tooltip_err_span.innerHTML = this.last_word;		
					tooltip_errParent.appendChild(this.tooltip_err_span);	
				}
				else{
					//si la cantidad es mas corta se acomoda con pocas instrucciones
					let tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					tooltip_err_span.setAttributeNS(null, 'x', '12');
					tooltip_err_span.setAttributeNS(null, 'dy', '50');
					tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');
					//el ultimo bloque tiene posicion fija														
					tooltip_err_span.innerHTML = this.msg_fit;		
					tooltip_errParent.appendChild(tooltip_err_span);		
				}												
			}
			else{
				//si el mensaje excedido es de un unico parrafo no esta controlado				
				this.deep_msg_blocks = this.msg_blocks;
				//se divide como si fuese un parrafo excedido
				this.last_slice = true;
				let char_sum = 0;
				for (var token = 0; token < this.deep_msg_blocks.length; token++){
					char_sum += this.deep_msg_blocks[token].length;		
					if ( (char_sum+this.deep_msg_blocks.length) > max_char){
						this.begin_token = token;
						this.last_slice = false;
						break;						
					}			
				}										
				if (this.last_slice === true){
					this.begin_token = this.deep_msg_blocks.length-1;
					this.last_word = this.deep_msg_blocks.slice(-1);
				}	
				else{
					this.last_word = this.deep_msg_blocks.slice(this.begin_token, this.deep_msg_blocks.length);
					this.last_word = this.last_word.join(' ');
				}	
				let last_block = this.deep_msg_blocks.slice(0,this.begin_token).join(' ');	
				//el bloque excedido unico se divide
				this.tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
				this.tooltip_err_span.setAttributeNS(null, 'x', '12');
				this.tooltip_err_span.setAttributeNS(null, 'dy', '50');
				this.tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');														
				this.tooltip_err_span.innerHTML = last_block;		
				tooltip_errParent.appendChild(this.tooltip_err_span);														
				this.tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
				this.tooltip_err_span.setAttributeNS(null, 'x', '12');
				this.tooltip_err_span.setAttributeNS(null, 'dy', '50');
				this.tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');
				//se incluye el bloque unico que habia estado sin control														
				this.tooltip_err_span.innerHTML = this.last_word;		
				tooltip_errParent.appendChild(this.tooltip_err_span);					
			}									
		}
		else{
			//el mensaje ya se ajusta y necesita minimo acomodamiento
			let tooltip_err_span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
			tooltip_err_span.setAttributeNS(null, 'x', '12');
			tooltip_err_span.setAttributeNS(null, 'dy', '50');
			tooltip_err_span.setAttributeNS(null, 'fill', 'yellow');
			tooltip_err_span.innerHTML = msg;			
			tooltip_errParent.appendChild(tooltip_err_span);																		
		}

		//la ruta del trazo hereda los datos de la burbuja
		tooltipSVG.appendChild(tooltipPath);	      							
		//la tipografia hereda los datos de la burbuja
		tooltipSVG.appendChild(tooltip_errParent);
		//la imagen vectorial no usa propiedades de posicion pero recibe coordenadas
		tooltipSVG.style.marginTop = '-60px';
	      							
	   //la burbuja hereda los datos de la celda									
	   k.appendChild(tooltipSVG);
    	k.onmouseover = function(e){ 
    		/* Normalmente utilizamos hover de CSS para estilizar elementos en los que esta el cursor pero en este caso necesitamos usar onmouseover */
    		//Buscamos el pariente de la celda que guarda propiedades para controlar la vista del mensaje
		//Un elemento que guarda informacion falsa guarda un estado positivo de falsabilidad
    		if (e.target.parentElement.childNodes[0].falsable === true){
    			//Si el dato se falsifica su valor no es valido
    			//Usamos la propiedad de visibilidad para saber si el elemento con la informacion falsa expone su error
				if (e.target.parentElement.childNodes[1].getAttributeNS(null,'displayed') === 'false'){
      	      e.target.parentElement.childNodes[1].setAttribute('display', "block");
         	  	e.target.parentElement.childNodes[1].animate({"opacity" : 1});
           		e.target.parentElement.childNodes[1].setAttributeNS(null, 'displayed', true);
        		}
        		else{
            	e.target.parentElement.childNodes[1].animate({"opacity" : 0});
            	//Si el error esta expuesto necesitamos controlar la visibilidad temporalmente para seguir cambiando los datos
            	setTimeout(function (){
                   e.target.parentElement.childNodes[1].setAttribute('display', "none");
               }, 
               250);
               e.target.parentElement.childNodes[1].setAttributeNS(null, 'displayed', false);
	            e.target.parentElement.childNodes[1].style.transition =  'opacity 6s ease-in-out';
      	  	}
        	}	        	  					
			else if (e.target.parentElement.childNodes[0].falsable === false){ 
				//Si el elemento se controla validamente no se puede demostrar su falsedad por lo tanto no se expone la burbuja
				if (e.target.parentElement.childNodes[0].isinvalid === false){								
					e.target.parentElement.childNodes[1].setAttribute('display', "none");
				}					
			}          								
	   };	
		return k;
	}

	//Renderizados de tabla (celdas)
	loadTable(idx) {
		let ipage = renderer.excel_data[idx];
		let cells_sum = 0;
		let errors_sum = 0;
		this.trs = [];
		renderer.old = renderer.page;
		renderer.page = idx;
		document.getElementById('spinner').style.display = 'none'; 
		document.getElementById('draggerInputsContainer').style.display = 'block';
		let cells_len = [];
		for (var cells = 0; cells < ipage.length; cells++) {
			cells_len.push(ipage[cells].length);		
		}
		let complete_size = Math.max(...cells_len); //traverse based on maximum number of items in row
		if (renderer.dom_factor.length < complete_size){
			this.tableSize = complete_size; //doc based
		}
		else if (complete_size < renderer.dom_factor.length){
			this.tableSize = renderer.dom_factor.length; //user based
		}
		else{
			this.tableSize = complete_size; //property based
		}
		this.abstract_c = complete_size; //add one for --
  		for (var R = 0; R < ipage.length; R++) {
			//renderer.deep_excel_data[prow][shape].push(null);
	      if (ipage[R].every(this.allNull) === true){
				continue;	      
	      }
	      let trDiv = document.createElement('tr');
	      let tdDiv = document.createElement('td');
	      let checkbox = document.createElement('input');
	      checkbox.type = 'checkbox';
	      checkbox.id = 'render_row_'+String(R);
	      checkbox.discarded = false;
	      //accept or reject row for storage
	      checkbox.onchange = function(e){
				if (e.target.checked === true){
					e.target.discarded = false;
				}
				else{
					e.target.discarded = true;
				}
			}; 
			//click user boxes
			checkbox.click();
	      tdDiv.appendChild(checkbox);
	      trDiv.appendChild(tdDiv);
	      renderer.sizeIncrement += 32;
			//falsability similar to shape and content in table
			for (var prow = 0; prow < renderer.falsable_cells.length; prow++){
				for (var shape = 0; shape < renderer.falsable_cells[prow].length; shape++){
					for (var Size = 0; Size < this.tableSize; Size++){
						if (typeof renderer.falsable_cells[prow][shape][Size] === 'undefined'){
							renderer.falsable_cells[prow][shape][Size] = false; 					
						}
						if (typeof renderer.excel_data[prow][shape][Size] === 'undefined'){
							try{
								renderer.excel_data[prow][shape].push(null);
							} 	
							catch (error){
							}					
						}
					}
				}		
			}					
			//Data in page is independent of the table
  			for (var C = 0; C < this.tableSize; C++){
  			 	let v = ipage[R][C];
	   	   try{
	   	    	//if not, prepare context to show virtual information
	   			if (this.set_virtual === true){	
						if (v === null){
       		 			this.textbox = document.createElement('input');
       	  				this.textbox.type = 'text';
       	  				this.textbox.value = '';
       	  				this.textbox.col = C;
       	  				this.textbox.row = R;
       		  			if (0 === C){
       		  				this.textbox.style.marginLeft = '-114px';
       		  			}
       		  			//filling unknown field with new factor
	       	  			this.textbox.onchange = function (e){
								if (typeof e.value !== 'undefined'){
									renderer.excel_data[renderer.page][e.col][e.row] = e.value;
									e.isedited = true;	    	
									e.target.isnewinfo = true; //acknowledge the value is changed  
									if (renderer.hasOwnProperty('check_transversal')){
										this.editing = renderer.check_transversal; //user basis
									}
									else{
										this.editing = renderer.page; //program basis
									}
									renderer.prove(e, this.textbox.col, this.textbox.row, this.editing, false, true, e.target.err_msg, false, false);									
									e.isedited = false;
								}
								else if (typeof e.target.value !== 'undefined'){
									e.target.isedited = true;	
									e.target.isnewinfo = true;    	 
									if (renderer.hasOwnProperty('check_transversal')){
										this.editing = renderer.check_transversal; //user basis
									}
									else{
										this.editing = renderer.page; //program basis
									}
									//value cannot be stored before processing or it will be discarded
									renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);									
									renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value; //if value is objective it has to be added after processing it
									e.target.isedited = false;	  
								}											
								else{						
								}		
	       	  			}
							this.textbox.trying = [null]; 	       	  			
       	  				this.textbox.onfocus = function(e){
								renderer.tdCombined(e);       	  		
								if (renderer.hasOwnProperty('check_transversal')){
									this.editing = renderer.check_transversal; //user basis
								}
								else{
									this.editing = renderer.page; //program basis
								}
								renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	
         				}				  
         				this.textbox.isinvalid = false;
      	  				this.textbox.selecting = false;
      	  				this.textbox.falsable = false;	   	  				
       	  				let tdDiv = document.createElement('td');
	      				tdDiv.appendChild(this.textbox);
	       	  			trDiv.appendChild(tdDiv);
       	  				cells_sum += 1;	  
	       	  			continue;  
					   } 	
					   else if (typeof renderer.dom_factor[C] !== 'undefined'){ //user validates
					   	if (R !== 0){ //bypass first row
		         			if (renderer.dom_factor[C][0][0].critical === true){            	
									if (v === ''){           
						   	      this.textbox.value = ipage[R][C];	
      		 	  					this.textbox = document.createElement('input');
       			  					this.textbox.type = 'text';
	       		  					if (0 === C){
   	    		  						this.textbox.style.marginLeft = '-114px';
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
   	    	  						this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       	  							//place data and verify if it is critical
	       	  						this.textbox.onchange = function (e){   	  				
											e.target.isedited = true;	//is going to be processed
											e.target.isnewinfo = true; //acknowledge the value is changed   
											if (e.target.isinvalid === true){
												e.target.style.backgroundColor = renderer.errorColor;  
											}	
											if (typeof renderer.check_transversal === 'undefined'){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}							
											renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;									
											renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
											renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);																		       
											e.target.isedited = false;	
	   	    	  					}
       		  						this.textbox.readOnly = false;	
       	  							this.textbox.onfocus = function(e){
											renderer.tdCombined(e);   
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}
											renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	    	  		
       	  							}	
       	  							this.textbox.isinvalid = true;
										renderer.falsable_cells[idx][R][C] = true;       	  					
	       	  						this.textbox.falsable = true;
      	 	  						this.textbox.selecting = false;
       	  							errors_sum += 1;	
	       	  						cells_sum += 1;
										//create table container
   	    	  						let tdDiv = document.createElement('td');
	      							tdDiv.appendChild(this.textbox);	
										this.tdDiv = this.addTooltip(tdDiv, renderer.dom_factor[C][0][0].error);
		       	  					trDiv.appendChild(this.tdDiv);	       	  						
		       	  					trDiv.bad_row = true;
	       	  						continue;  
									}
									else{								
      		 	  					this.textbox = document.createElement('input');
       			  					this.textbox.type = 'text';
		       	  					this.textbox.critical = 1;
      	 	  						if (typeof this.textbox.trying === 'undefined'){
											this.textbox.trying = [];       	  						
       	  							}	       	  				
	       	  						this.textbox.trying.push('critical');
       	  							this.textbox.col = C;
       	  							this.textbox.row = R;
					   	      	if (R === 0){
	   	      						this.textbox.value = ipage[R][C];					   	      	
					   	      	}
	   					      	else if (renderer.timestamps.includes(C)){
	   					      		let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   					      		if (istimestamp === true){
	   	   				   			let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      						time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   					ipage[R][C] = time;
	   	   		   					this.textbox.value = time;
	   	      						}
	   	      					}
	   	  			    			else{				
	   	      						this.textbox.value = ipage[R][C];
		   	     					}				
	       	  						this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
   	    	  						this.textbox.isinvalid = false;
      	 	  						this.textbox.falsable = false;
       		  						//verify if it is lacking critical data
	       		  					this.textbox.onchange = function (e){
	       	  							e.target.isnewinfo = true; //acknowledge the value is changed  
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}			
											renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;	       	  					
											renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;	
											e.target.isedited = true;	     
											renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				  
											e.target.isedited = false;	 
											if (e.target.isinvalid === true){
												e.target.style.backgroundColor = renderer.errorColor;  
											}										
	       	  						}
	       	  						this.textbox.readOnly = false;	
   	    	  						this.textbox.onfocus = function(e){
											renderer.tdCombined(e);  
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}										 
											renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	    	  		
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
		         					console.info('CHILDREN IN FACTOR', renderer.dom_factor[C][0][0].childs);	   			   	    		           	
										if (renderer.dom_factor[C][0][0].childs.includes(v)){            	
	       								this.textbox = document.createElement('input');
   	    	  							this.textbox.type = 'text';  						
       		  							this.textbox.readOnly = false;	
       	  								this.textbox.col = C;
       	  								this.textbox.row = R;
						   	      	this.textbox.value = ipage[R][C];	
       		  							if (0 === C){
       		  								this.textbox.style.marginLeft = '-114px';
       		  								if (0 === R){
       		  									this.textbox.style.marginTop = '16px';
       		  								}       		  						
       		  							}
	       		  						//place data and verify it has does not have the same info
   	    	  							this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
	   	      						this.textbox.onchange = function (e){  
												if (renderer.hasOwnProperty('check_transversal')){
													this.editing = renderer.check_transversal; //user basis
												}
												else{
													this.editing = renderer.page; //program basis
												}				
												e.target.isnewinfo = true; //acknowledge the value is changed  
												renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;	         						
												renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
												e.target.isedited = true;	 
												renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				      
												e.target.isedited = false;	 
												if (e.target.isinvalid === true){
													e.target.style.backgroundColor = renderer.errorColor;  
												}	
       	  								}
	       	  							this.textbox.onfocus = function(e){
												renderer.tdCombined(e);     
												if (renderer.hasOwnProperty('check_transversal')){
													this.editing = renderer.check_transversal; //user basis
												}
												else{
													this.editing = renderer.page; //program basis
												}
												renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	  	  		
       	  								}	
       	  								if (typeof this.textbox.trying === 'undefined'){
												this.textbox.trying = [];       	  						
	         							}
		       	  						this.textbox.trying.push('unique');
      	 	  							this.textbox.selecting = false;
       		  							this.textbox.isinvalid = true;
       	  								renderer.falsable_cells[idx][R][C] = true;       
       	  								this.textbox.falsable = true;
	       	  							this.textbox.unique = 1;    				
       	  								errorCell(this.textbox); //coloriza campo contenido duplicado   
	       	  							errors_sum += 1;		       	
	       	  							cells_sum += 1;	  					
											//create table container
   	    	  							let tdDiv = document.createElement('td');
	      								tdDiv.appendChild(this.textbox);	
											this.tdDiv = this.addTooltip(tdDiv, renderer.dom_factor[C][0][0].error);
		       	  						trDiv.appendChild(this.tdDiv);
		       	  						trDiv.bad_row = true;     	  									   	      	
	   	    	  						continue;  
       		  						}	
										else{
		   	     						renderer.dom_factor[C][0][0].childs.push(ipage[R][C]);
		   	     						renderer.vals_unique.push(ipage[R][C]);
       									this.textbox = document.createElement('input');
       	  								this.textbox.type = 'text';
       	  								////this.textbox.style = 'width: 150px;'; 	  						
       	  								this.textbox.readOnly = false;	
       	  								this.textbox.col = C;
       	  								this.textbox.row = R;
	       		  						if (0 === C){
   	    		  							this.textbox.style.marginLeft = '-114px';
      	 		  							if (0 === R){
       			  								this.textbox.style.marginTop = '16px';
       			  							}       		  						
       		  							}
         								this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       		  							//change data and verify it is not copied
	         							this.textbox.onchange = function (e){    
												if (renderer.hasOwnProperty('check_transversal')){
													this.editing = renderer.check_transversal; //user basis
												}
												else{
													this.editing = renderer.page; //program basis
												}				
												e.target.isnewinfo = true; //acknowledge the value is changed  	        							
												renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;	         						
												renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
												e.target.isedited = true;	  
												renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				     
												e.target.isedited = false;	 
												if (e.target.isinvalid === true){
													e.target.style.backgroundColor = renderer.errorColor;  
												}	
       	  								}
       	  								this.textbox.onfocus = function(e){
												renderer.tdCombined(e);   
												if (renderer.hasOwnProperty('check_transversal')){
													this.editing = renderer.check_transversal; //user basis
												}
												else{
													this.editing = renderer.page; //program basis
												}											
												renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	    	  		
   	    	  							}	
      	 	  							if (typeof this.textbox.trying === 'undefined'){
												this.textbox.trying = [];       	  						
         								}
						   	      	if (R === 0){
		   	      						this.textbox.value = ipage[R][C];					   	      	
						   	      	}
	   						      	else if (renderer.timestamps.includes(C)){
	   						      		let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   						      		console.info('IS VALUE', ipage[R][C], ' IN CELL A TIMESTAMP?', istimestamp);
	   						      		if (istimestamp === true){
	   	   					   			let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      							time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   						ipage[R][C] = time;
	   	   		   						this.textbox.value = time;
	   	      								//console.info(mmddyy);
	   	      							}
	   	      						}
	   	  			    				else{				
	   	      							this.textbox.value = ipage[R][C];
		   	     						}				
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
               					if (v === null){ //unlikely to happen due to previous condition
											this.matching = null; //null is not a regexp           			
	               				}
   	            				else{
      	         					this.matching = v.match(new RegExp(renderer.dom_factor[C][0][0].re));  
            	   				}   
       				 				this.textbox = document.createElement('input');
										if (this.matching === null){     
       	  								errorCell(this.textbox); //coloriza campo con re   
	       	  							errors_sum += 1;
   	    	  							this.textbox.isinvalid = true;
      	 	  							renderer.falsable_cells[idx][R][C] = true;       
       		  							this.textbox.falsable = true;
						   	      	this.textbox.value = ipage[R][C];					   	      	
       	  							}
										else if (this.matching.length === null){     
       	  								errorCell(this.textbox); //coloriza campo con re   
	       	  							errors_sum += 1;
   	    	  							this.textbox.isinvalid = true;
      	 	  							renderer.falsable_cells[idx][R][C] = true;       
       		  							this.textbox.falsable = true;
						   	      	this.textbox.value = ipage[R][C];					   	      	
       	  							}
       	  							else{	
       	  								this.textbox.isinvalid = false;
       	  								renderer.falsable_cells[idx][R][C] = false;       
       	  								this.textbox.falsable = false;   
						   	      	if (R === 0){
		   	      						this.textbox.value = ipage[R][C];					   	      	
						   	      	}
	   						      	else if (renderer.timestamps.includes(C)){
	   						      		let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   						      		console.info('IS VALUE', ipage[R][C], ' IN CELL A TIMESTAMP?', istimestamp);
	   						      		if (istimestamp === true){
	   	   					   			let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      							time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   						ipage[R][C] = time;
	   	   		   						this.textbox.value = time;
	   	      							}
	   	      						}
	   	  			    				else{				
	   	      							this.textbox.value = ipage[R][C];
		   	     						}				
	       	  						}
   	    	  						this.textbox.type = 'text';
       		  						this.textbox.col = C;
       	  							this.textbox.row = R;
      	 	  						this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       		  						if (0 === C){
       		  							this.textbox.style.marginLeft = '-114px';
       		  							if (0 === R){
       		  								this.textbox.style.marginTop = '16px';
       		  							}       		  						
	       		  					}
   	    	  						if (typeof this.textbox.trying === 'undefined'){
											this.textbox.trying = [];       	  						
       		  						}       	  
       	  							//place data and verify it corresponds to the expression		
	        							this.textbox.onchange = function (e){
	        								//triggers nonsense
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}	
											else{
												this.editing = renderer.page; //program basis
											}			        		
											e.target.isnewinfo = true; //acknowledge the value is changed  						  
											renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
											renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;    			        																	
											e.target.isedited = true;	  
											renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				     
											e.target.isedited = false;	 
											if (e.target.isinvalid === true){
												e.target.style.backgroundColor = renderer.errorColor;  
											}	
	       	  						}       	  								
	       	  						this.textbox.trying.push('re');  	  						
       	  							this.textbox.readOnly = false;	
       	  							this.textbox.onfocus = function(e){
											renderer.tdCombined(e);       
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}
											renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);		  		
       	  							}	
       	  							this.textbox.selecting = false;
       	  							cells_sum += 1;	
		       	  					this.textbox.re = renderer.dom_factor[C][0][0].re;			
										//create table container
   	    	  						let tdDiv = document.createElement('td');
	      							tdDiv.appendChild(this.textbox);	
										this.tdDiv = this.addTooltip(tdDiv, renderer.dom_factor[C][0][0].error);
		       	  					trDiv.appendChild(this.tdDiv);
	   	    	  					trDiv.bad_row = true;
	       		  					continue;  
       	  						}					
									else{
       								this.textbox = document.createElement('input');
       	  							this.textbox.type = 'text';					
	       	  						this.textbox.readOnly = false;	
   	    	  						this.textbox.col = C;
      	 	  						this.textbox.row = R;
       		  						this.textbox.err_msg = renderer.dom_factor[C][0][0].error;
       	  							//place data and verify the expression is different
	         						this.textbox.onchange = function (e){
	         							//triggers known information
	         							e.target.isnewinfo = true; //acknowledge the value is changed  
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}				        							        						
											renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;	         					
											renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;            							
											e.target.isedited = true;	       
											renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				
											e.target.isedited = false;	 
											if (e.target.isinvalid === true){
												e.target.style.backgroundColor = renderer.errorColor;  
											}	
       		  						}
       			  					if (0 === C){
       		  							this.textbox.style.marginLeft = '-114px';
       		  							if (0 === R){
       		  								this.textbox.style.marginTop = '16px';
       		  							}       		  					
       		  						}
	       	  						this.textbox.onfocus = function(e){
											renderer.tdCombined(e);       
											if (renderer.hasOwnProperty('check_transversal')){
												this.editing = renderer.check_transversal; //user basis
											}
											else{
												this.editing = renderer.page; //program basis
											}
											renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);		  		
       	  							}	
	       	  						if (typeof e.trying === 'undefined'){
											e.trying = [];       	  						
      	   						}
					   	      	if (R === 0){
	   	      						this.textbox.value = ipage[R][C];					   	      	
					   	      	}
	   					      	else if (renderer.timestamps.includes(C)){
	   					      		let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   					      		console.info('IS VALUE', ipage[R][C], ' IN CELL A TIMESTAMP?', istimestamp);
	   					      		if (istimestamp === true){
	   	   				   			let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      						time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   					ipage[R][C] = time;
	   	   		   					this.textbox.value = time;
	   	      						}
	   	      					}
	   	  			    			else{				
	   	      						this.textbox.value = ipage[R][C];
		   	     					}				
	       		  					this.textbox.trying.push('unique');
       	  							this.textbox.selecting = false;
       	  							this.textbox.isinvalid = false;
       	  							this.textbox.falsable = false;
       		  						cells_sum += 1;	
	       		  					this.textbox.re = renderer.dom_factor[C][0][0].re;		      	  													
       	  							let tdDiv = document.createElement('td');
	      							tdDiv.appendChild(this.textbox);
	       	  						trDiv.appendChild(tdDiv);    	  					
	       	  						continue;  
									}
								}
								else{
									//LABEL SET WITHOUT VALIDATION
       			 				this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
					   	      if (R === 0){
	   	      					this.textbox.value = ipage[R][C];					   	      	
					   	      }
	   					      else if (renderer.timestamps.includes(C)){
	   					      	let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   					      	console.info('IS VALUE', ipage[R][C], ' IN CELL A TIMESTAMP?', istimestamp);
	   					      	if (istimestamp === true){
	   	   				   		let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      					time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   				ipage[R][C] = time;
	   	   		   				this.textbox.value = time;
	   	      					}
	   	      				}
	   	  			    		else{				
	   	      					this.textbox.value = ipage[R][C];
		   	     				}				

	       	  					this.textbox.col = C;
   		    	  				this.textbox.row = R;
       		  					this.textbox.trying = [null];
       	  						this.textbox.err_msg = '';
       		  					if (0 === C){
       		  						this.textbox.style.marginLeft = '-114px';
       		  						if (0 === R){
       		  							this.textbox.style.marginTop = '16px';
       		  						}       		  				
	       		  				}
   	    		  				//changes value without contrasting known information
	   	    	  				this.textbox.onchange = function (e){
										if (renderer.hasOwnProperty('check_transversal')){
											this.editing = renderer.check_transversal; //user basis
										}
										else{
											this.editing = renderer.page; //program basis
										}						        				
										e.target.isnewinfo = true; //acknowledge the value is changed  			    	  					
										renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
										renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;				        							
										e.target.isedited = true;	    	  				
										renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				
										e.target.isedited = false;	 
										if (e.target.isinvalid === true){
											e.target.style.backgroundColor = renderer.errorColor;  
										}	
		       	  				}
		       	  				//reacts to known value
      	 	  					this.textbox.onfocus = function(e){
										renderer.tdCombined(e);       
										if (renderer.hasOwnProperty('check_transversal')){
											this.editing = renderer.check_transversal; //user basis
										}
										else{
											this.editing = renderer.page; //program basis
										}
										renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);		  		
      	   					}	 
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
       				 			this.textbox = document.createElement('input');
       	  						this.textbox.type = 'text';
       	  						////this.textbox.style = 'width: 150px;';
					   	      if (R === 0){
	   	      					this.textbox.value = ipage[R][C];					   	      	
					   	      }
	   					      else if (renderer.timestamps.includes(C)){
	   					      	let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   					      	console.info('IS VALUE', ipage[R][C], ' IN CELL A TIMESTAMP?', istimestamp);
	   					      	if (istimestamp === true){
	   	   				   		let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      					time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   				ipage[R][C] = time;
	   	   		   				this.textbox.value = time;
	   	      					}
	   	      				}
	   	  			    		else{				
	   	      					this.textbox.value = ipage[R][C];
		   	     				}				
       	  						this.textbox.col = C;
	       	  					this.textbox.row = R;
   	    	  					this.textbox.trying = [null];
      	 	  					this.textbox.err_msg = '';
       			  				if (0 === C){
       			  					this.textbox.style.marginLeft = '-114px';
       		  						if (0 === R){
       		  							this.textbox.style.marginTop = '16px';
       		  						}       		  				
       		  					}
      	 		  				//changes value without contrasting unknown information
	      	 	  				this.textbox.onchange = function (e){  
										if (renderer.hasOwnProperty('check_transversal')){
											this.editing = renderer.check_transversal; //user basis
										}
										else{
											this.editing = renderer.page; //program basis
										}				        						
										e.target.isnewinfo = true; //acknowledge the value is changed  	        	  				
										renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
										renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;        							
										e.target.isedited = true;	    	  				
										renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				
										e.target.isedited = false;	 
										if (e.target.isinvalid === true){
											e.target.style.backgroundColor = renderer.errorColor;  
										}	
		       	  				}
		       	  				//reacts to unknown value
      	 	  					this.textbox.onfocus = function(e){
										renderer.tdCombined(e);       	  	
										if (renderer.hasOwnProperty('check_transversal')){
											this.editing = renderer.check_transversal; //user basis
										}
										else{
											this.editing = renderer.page; //program basis
										}
										renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);		
      	   					}	
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
								//COLUMN NAME IS IN FIRST ROW
       				 		this.textbox = document.createElement('input');
       	  					this.textbox.type = 'text';
					   	   if (R === 0){
	   	      				this.textbox.value = ipage[R][C];					   	      	
					   	   }
	   					   else if (renderer.timestamps.includes(C)){
	   					      let istimestamp = (new Date(Math.round((ipage[R][C]- (25567 + 1)) * 86400))).getTime() > 0;
	   					      console.info('IS VALUE', ipage[R][C], ' IN CELL A TIMESTAMP?', istimestamp);
	   					      if (istimestamp === true){
	   	   				   	let time = new Date(Math.round((ipage[R][C] - (25567 + 1)) * 86400 * 1000));
	   		      				time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	   		   			ipage[R][C] = time;
	   	   		   			this.textbox.value = time;
	   	      				}
	   	      			}
	   	  			    	else{				
	   	      				this.textbox.value = ipage[R][C];
		   	     			}				
       	  					this.textbox.col = C;
	       	  				this.textbox.row = R;
   	    	  				this.textbox.trying = [null];
      	 	  				this.textbox.err_msg = '';
       			  			if (0 === C){
       			  				this.textbox.style.marginLeft = '-114px';
       		  					if (0 === R){
       		  						this.textbox.style.marginTop = '16px';
       		  					}       		  				
	       		  			}
   	    		  			//changes value without contrasting unknown information
	   	    	  			this.textbox.onchange = function (e){
									e.target.isnewinfo = true; //acknowledge the value is changed       
									if (renderer.hasOwnProperty('check_transversal')){
										this.editing = renderer.check_transversal; //user basis
									}
									else{
										this.editing = renderer.page; //program basis
									}						        							        	  				
									renderer.excel_data[this.editing][e.target.row][e.target.col] = e.target.value;
									renderer.deep_excel_data[this.editing][e.target.row][e.target.col] = e.target.value;			        							
									e.target.isedited = true;	    	  				
									renderer.prove(e, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);	       	  				
									e.target.isedited = false;	 
									if (e.target.isinvalid === true){
										e.target.style.backgroundColor = renderer.errorColor;  
									}	
	       	  				}
	       	  				//reaction at unconstrasted value      	  				
       	  					this.textbox.onfocus = function(e){
									renderer.tdCombined(e);       	  	
									if (renderer.hasOwnProperty('check_transversal')){
										this.editing = renderer.check_transversal; //user basis
									}
									else{
										this.editing = renderer.page; //program basis
									}
									renderer.prove(e.target, e.target.col, e.target.row, this.editing, false, true, e.target.err_msg, false, false);		
         					}	
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
						 else{ //user shows another page
							//Data in page depends on element focus
							//Is it possible to exclude validators from nest to avoid proof overriding 
							if (this.page_shift === false){	
								this.edits = [];
								let edition_errors = 0;
								for (var page_row = 0; page_row < document.getElementById('sheet_rows').childNodes.length; page_row++){
									let page_td = document.getElementById('sheet_rows').childNodes[page_row];
									this.edits.push([]);
									for (var page_col = 1; page_col < page_td.childNodes.length+1; page_col++){ //seek cells
										try{			
											this.old_transversal = renderer.prev_exp;	//previous action
											this.check_transversal = idx;	//new action						
											//add modified data in virtual structure (virtual<=>real transversal) and timestamp in edition structures
		   	      					if (renderer.timestamps.includes(page_col-1)){
	   		      						if (ipage[page_row][page_col-1].includes('/') === false){ //month/day/year is unset
	   		      							//hidden_matches => real output
       	  										if (isNaN(parseInt(ipage[page_row][page_col-1])) === false){ //only hidden timestamps as integers match   	  									
	   	      									let time = new Date(Math.round((this.textbox.value - (25567 + 1)) * 86400 * 1000));
	   	      									time = String(time.getMonth()+1)+'/'+String(time.getDate())+'/'+String(time.getFullYear());
	   	      									if (time === 'Invalid Date'){ //name is placed at first cell
	   	      										time = 'mm/dd/yy'; 
	   	      									}
														ipage[page_row][page_col-1] = time;
														renderer.excel_data[renderer.page][page_row][page_col-1] = time;
														//continue;	
														//VALIDATE DATA BEFORE CONTINUING
													}
												}
		   	      					}
											//set invalid attribute using the attribute with error	
											if (renderer.falsable_cells[this.check_transversal][page_row][page_col-1] === true){ //traversed value in field must be invalid
												//demonstrating info is false after showing real info
												if (renderer.falsable_cells[this.old_transversal][page_row][page_col-1] === false){
       		  									page_td.childNodes[page_col].childNodes[0].value = ipage[page_row][page_col-1];
													renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, this.check_transversal, false, true, page_td.childNodes[page_col].childNodes[0].err_msg, false, true); 
													edition_errors += 1;	 //avoid confused deletion after proving error  
													cells_sum += 1;	 	      	  									
												}
												else if (renderer.falsable_cells[this.old_transversal][page_row][page_col-1] === null){ //demonstrating info is false after showing unknown info
       	  										page_td.childNodes[page_col].childNodes[0].value = ipage[page_row][page_col-1];
													renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, this.check_transversal, false, true, page_td.childNodes[page_col].childNodes[0].err_msg, false, true); 
													edition_errors += 1;	 //avoid confused deletion after proof
													cells_sum += 1;	 	      	  									
												}
												else{
													//										
												}
											}	
											else if (renderer.falsable_cells[this.check_transversal][page_row][page_col-1] === false){ //MOST LIKELY TO HAPPEN
												//demonstrating true info after exposing false info (this must be corrected afterwards)
												if (renderer.falsable_cells[this.old_transversal][page_row][page_col-1] === true){
       	  										page_td.childNodes[page_col].childNodes[0].value = ipage[page_row][page_col-1];
													renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, this.check_transversal, false, true, page_td.childNodes[page_col].childNodes[0].err_msg, false, true);       
													cells_sum += 1;	 	  									
   	    	  								}
      	 	  								else{
       		  									//if current value could be corrected before it can be used to replace other useful ones
													page_td.childNodes[page_col].childNodes[0].value = renderer.excel_data[this.check_transversal][page_row][page_col-1];
													page_td.childNodes[page_col].childNodes[0].innerHTML = renderer.excel_data[this.check_transversal][page_row][page_col-1];
													let ground_truth = renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, this.check_transversal, false, true, page_td.childNodes[page_col].childNodes[0].err_msg, false, true);  
													if (ground_truth === false){
														edition_errors += 1;												
													}
													cells_sum += 1;	       	  							
	       	  								}	    	         	  								
   	    	  							}   								
											else if (renderer.falsable_cells[this.check_transversal][page_row][page_col-1] === null){ //
												//demonstrating true info after exposing unknown info
												if (renderer.falsable_cells[this.old_transversal][page_row][page_col-1] === true){
       	  										page_td.childNodes[page_col].childNodes[0].value = ipage[page_row][page_col-1];
													renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, this.check_transversal, false, true, page_td.childNodes[page_col].childNodes[0].err_msg, false, true);       
													cells_sum += 1;	 	  									
	       	  								}	
   	    	  								else{
													page_td.childNodes[page_col].childNodes[0].value = ipage[page_row][page_col-1];
													page_td.childNodes[page_col].childNodes[0].innerHTML = ipage[page_row][page_col-1];
													let ground_truth = renderer.prove(page_td.childNodes[page_col].childNodes[0], page_td.childNodes[page_col].childNodes[0].col, page_td.childNodes[page_col].childNodes[0].row, this.check_transversal, false, true, page_td.childNodes[page_col].childNodes[0].err_msg, false, true);  
													//count erroneous outcome at traversing
													if (ground_truth === false){
														edition_errors += 1;												
													}
													cells_sum += 1;	       	  							
	       	  								}	    	         	  								
   	    	  							} 
      	 	  						}
       		  						catch (error){
       	  								//SEE LAST COLUMNS
       	  							}				
									}
								}
								//Get total number of errors
								document.getElementById('error_sheets').innerHTML = 'Con errores: '+String(parseInt(document.getElementById('error_sheets').innerHTML.split('Con errores: ')[1])+edition_errors);
								//wants to show only false information
								renderer.render_invalid_page(document.getElementById('show_errors').checked);	
								//wants to show only changed information	
								renderer.render_edited_page(document.getElementById('show_changed').checked);	
								//states of proofs are read at the end of the loop	

								this.page_shift = true;
								renderer.prev_exp = idx;
								return null;
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
		document.getElementById('error_sheets').innerHTML = 'Con errores: '+errors_sum;
		document.getElementById('total_sheets').innerHTML = 'Total: '+cells_sum+' | ';
		return this.trs;	
  	}

	proveFilled(idx,C,R,Page,X, error, save, swap, newreq) {			
		//index => saving (save condition), change => update (real ground conditions applicate only if values are changed and focusing is discounted), structure => loop (swap condition)
		if (X === null){ //value is handled
			if (idx != false){
				if (idx.value !== ''){
					if (document.activeElement === idx){ //skip reactivity to focus in case critical info is not given
						return null;		
					}				
				}
			}
			//assert (this.x !== null)
			this.x = idx.value;		//if edited === undefined: imported, edited === false: focused, edited === true: changed
			//if value in index must be the virtual: idx.val !== null, idx.val !== '' only idx.val === virtual is a valid fill as x is not given, therefore if given must be null then virtual must be null
			//only a value that is never given and does not provide any information is also inexistent
			//virtual information can be visibilized
		}
		else{
			this.x = X;	//empty value is never taken	
		}

		if (R === 0){
			renderer.excel_data[Page][R][C] = this.x;
			return true;		
		}
		if (idx !== false){
			if (idx.value !== ''){
				if (document.activeElement === idx){ //skip reactivity to focus
					return null;		
				}		
			}		
		}	

		if (this.x !== ''){
			if (idx !== false){
  				idx.style.backgroundColor = null;
  				idx.critical = 0;
  				idx.falsable = false;
				idx.isinvalid = false;
				idx.isedited = false;
  			} 
			renderer.falsable_cells[Page][R][C] = false;
			return true;
  		}
  		else{
  			//mantain process using the handler
  			if (idx !== false){ 
				idx.critical = 1;  		
				errorCell(idx);  		
      	 	idx.falsable = true; 
       		idx.isinvalid = true;	         	   
       		if (typeof idx.parentElement.childNodes[1] === 'undefined'){
					//El mensaje es dado en un evento o manejado por el elemento que contiene la verificacion		
					if (typeof error === 'undefined'){	
						this.falsek = this.addTooltip(idx.parentElement, idx.err_msg);	
					}
					else{
	       			this.falsek = this.addTooltip(idx.parentElement, error);	
	       		}   								        	  					
   	 		}
       	}
    		else{
    		}       
       	renderer.falsable_cells[Page][R][C] = true;
			document.getElementById('error_sheets').innerHTML = 'Con errores: '+String(parseInt(document.getElementById('error_sheets').innerHTML.split('Con errores: ')[1])+1);
			return false;
  		}
	}

	purify(idx,C,R,Page) {
		/* A function that eliminates validator and trial of column in all pages */
		renderer.falsable_cells[Page][R][C] = false;	 		
		idx.falsable = false; 
		idx.isinvalid = false;
		idx.isedited = false;  
		idx.trying = [null];
		idx.style.background = 'white';
		return true;
	}

	proveUnique(idx,C,R,Page,X, error, save, swap, newreq) {
		if (R === 0){
			renderer.excel_data[Page][R][C] = idx.value;
			return true;		
		}
		if (X === null){
			this.x = idx.value;	
			this.row = idx.row;	
		}
		else{
			this.x = X;	
			this.row = R;			
		}
		
		this.isunique = true;
		if (renderer.hasOwnProperty('vals_unique') === false){
			renderer.vals_unique = [];
		}
		if (idx !== false){
			if (document.activeElement === idx){ //skip reactivity to focus
				return null;		
			}
		}	
	
		for (var row = 0; row < this.row; row++){ ///search only first ocurrence in event loop
			if (renderer.vals_unique.includes(renderer.excel_data[Page][row][C])){
			}
			else{	
				renderer.vals_unique.push(renderer.excel_data[Page][row][C]);	
			}
		}
		//copy data
		let vals_unique = renderer.vals_unique;
		if (X === null){ //x was indexed
			if (vals_unique.includes(this.x) === false){
				vals_unique.push(this.x);	//it was indexed before
			}
			else if (idx.isedited === true){
				vals_unique.push(this.x);	//addition is intended
			}
			else if (save === true){ //x was indexed
				console.info(idx.isnewinfo);
				if (idx.hasOwnProperty('isnewinfo') === false){
					vals_unique.push(this.x);	//storing value with a previous origin
				}
				else{ //storing repeated values
				}
			}				
		}	
		else{
			vals_unique.push(this.x);	
		}	
		//is it remaining unique if changed?
		if (vals_unique.indexOf(this.x) !== vals_unique.lastIndexOf(this.x)){
			if (X !== null){ 
				this.isunique = false; //copy can be found before indexing it	
			}	
			else{
				if (idx.isedited === true){ //duplicating unique value
					this.isunique = false;
				}
				else if (swap === true){
					if (R === vals_unique.indexOf(this.x)){
						//we're at start, so the copy of it will be false
						renderer.falsable_cells[Page][R][C] = false;   
						this.isunique = true;
      				//values correspond to position of the original while x is in an index and can be erroneous
      				//not saving so correction is unfinished
						return null;
					}
					else{
						this.isunique = false;					
					}
				}
				else if (save === true){
					console.info('VALUES', vals_unique);
					this.isunique = false;	//false origin in page				
				}
			}	
		}
		if (this.isunique === false){
			if (save === true){
				console.info('GROUND TRUTH', false);
				return false;			
			}
			if (idx !== false){
				idx.unique = 1;  		
				errorCell(idx);  
   	    	idx.falsable = true;
      	 	idx.isinvalid = true;		
	       	if (typeof idx.parentElement.childNodes[1] === 'undefined'){
					//El mensaje es dado en un evento o manejado por el elemento que contiene la verificacion		
					if (typeof error === 'undefined'){	
						this.falsek = this.addTooltip(idx.parentElement, idx.err_msg);	
					}
					else{
	       			this.falsek = this.addTooltip(idx.parentElement, error);	
	       		}       								        	  					
	    		}
       	}     	
       	renderer.falsable_cells[Page][R][C] = true;         	
			document.getElementById('error_sheets').innerHTML = 'Con errores: '+String(parseInt(document.getElementById('error_sheets').innerHTML.split('Con errores: ')[1])+1);       		
			return false;
  		}
  		else{
  			if (idx !== false){
	  			idx.style.backgroundColor = null;
  				idx.unique = 0;					
				idx.falsable = false; 
				idx.isinvalid = false;
				idx.isedited = false;  
			}
			renderer.falsable_cells[Page][R][C] = false;	 
       	//confusion is cleared during valid demonstration
			return true;
  		}
	}

	proveRe(idx,C,R,Page,X,Y, error, save, re) {
		if (R === 0){
			renderer.excel_data[Page][R][C] = idx.value;
			return true;		
		}
		if (X === null){ //x is handled
			this.x = idx.value;		
			if (document.activeElement === idx){ //reactive to focus
				return null;		
			}			
		}
		else{
			this.x = X;	//x is given	
		}

		//y is handled
		if (Y === null){ 
			this.y = idx.re;		
		}
		else if (typeof Y === 'undefined'){ 
			this.y = idx.re;		
		}
		else if (typeof re !== 'undefined'){ //y is given exported
			this.y = re;		
		}
		else{
			this.y = Y;	//y is given imported	
		}		
		if (typeof this.y !== 'undefined'){
			this.matching = this.x.match(new RegExp(this.y));  //expression is given or is in an event
		}
		else{
			this.matching = this.x.match(new RegExp(idx.re)); //expression is fixed	transversally		
		}
		if (this.matching === null){
			this.matched = null;		
		} 	
		else if (this.matching.length === null){
			this.matched = null;
		}
		else{
			this.matched = true;		
		}
		if (this.matched === null){ //no match of expressions (outcome is erroneous)
			if (idx !== false){
				idx.unique = 1;  		
				errorCell(idx);  
	       	idx.isinvalid = true;
	       	idx.falsable = true;	
	       	if (typeof idx.parentElement.childNodes[1] === 'undefined'){
					//El mensaje es dado en un evento o manejado por el elemento que contiene la verificacion	
					if (typeof error === 'undefined'){	
						this.falsek = this.addTooltip(idx.parentElement, idx.err_msg);	
					}
					else{
	       			this.falsek = this.addTooltip(idx.parentElement, error);	
	       		}   								        	  					
	    		}
       	} 
       	renderer.falsable_cells[Page][R][C] = true;  
			document.getElementById('error_sheets').innerHTML = 'Con errores: '+String(parseInt(document.getElementById('error_sheets').innerHTML.split('Con errores: ')[1])+1);
			return false;
  		}
  		else{		
			if (idx !== false){
	  			idx.unique = 0;	
				idx.isinvalid = false;
				idx.falsable = false;
				idx.isedited = false;
  				idx.style.backgroundColor = 'white';  
  			}				
			renderer.falsable_cells[Page][R][C] = false;	 
  			return true;
  		}
	}

	prove(idx,C,R,Page,X,process,error,save,swap, re) {
		/* function that returns a boolean for the outcome of true data testing 
			vargs:
				idx: renderer cell with process attributes
				C (required integer): column of data position
				R (required integer): row of data position
				Page (required integer): page of data
				X: string value of data   
				process (required array): process that returns the boolean of outcome
				error (required string): response to show when data contains invalid values
				save (required boolean): change process conditions if values are saved
				swap (required boolean): change process conditions if values are traversed
				re (required string): regular expression is given since when the indexed is changed	
		*/
		if (idx === false){
			if (X === null){
				return null;			
			}		
		}
		if (typeof idx.target !== 'undefined'){ //PROVING IN AN EVENT
			this.proving = idx.target;			
		}
		else if (typeof idx !== 'undefined'){ //PROVING WITH AN OBJECT
			this.proving = idx;			
		}
		else if (idx === false){ //PROVING WITH DATA
			this.proving = false;			
		}
		else{
			return null;		
		}
		if (this.proving === false){
			this.process = process;			
			this.x = X; //x is given
			this.obj_err_msg = 'none';
		}
		else{
			this.process = this.proving.trying;		
			//x can be given as long as is valid	
			this.x = null; //x is handled
			this.obj_err_msg = this.proving.err_msg;
		}
		//prove in page context (initial or transversal)
		for (var j = 0; j < this.process.length; j++) {
			if (typeof renderer.check_transversal !== 'undefined'){
				this.currentp = renderer.check_transversal;			
			}
			else{
				this.currentp = renderer.page;			
			}
			if (this.process[j] === 'critical'){
				this.outcome = this.proveFilled(this.proving,C,R,this.currentp, this.x, error, save, swap);
				if (this.outcome === false){ //stop verification and raise the error
					return this.outcome;				
				}
			}
			else if (this.process[j] === 'unique'){
				console.info('CELL', this.proving,'COLUMN',C,'ROW',R,'PAGE',this.currentp,'X',this.x,'ERROR',error,'SAVE',save,'SWAP',swap );
				this.outcome = this.proveUnique(this.proving,C,R,this.currentp, this.x, error, save, swap);
				if (this.outcome === false){
					return this.outcome;				
				}
			}
			else if (this.process[j] === 're'){
				if (swap === true){
					if (typeof re !== 'undefined'){
						this.outcome = this.proveRe(this.proving,C,R,this.currentp, this.x, false, error, save, re); //factor is handled but expression is given
					}
					else{
						this.outcome = this.proveRe(this.proving,C,R,this.currentp, this.x, this.dom_factor[C][0].re, error, save, re); //factor is handled					
					}
				}
				else{
					this.outcome = this.proveRe(this.proving,C,R,this.currentp, this.x, this.dom_factor[C][0].re, error, save); //factor is handled				
				}
				if (this.outcome === false){
					return this.outcome;				
				}
			}
			else if (this.process[j] === null){
				this.outcome = true;			
			}
		}
		return this.outcome;
	}
	//XLSX.writeFile(workbook, fname, write_opts) write file back
}

function uploadxls(){
	document.getElementById('pIn').click();
};

let renderer = new renderWidget(document.getElementById('cecilio-importer'), options);		
