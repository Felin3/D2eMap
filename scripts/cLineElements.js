function LineClass(elementName, elementID) {
	this.elementName = elementName;
	this.elementID = folderize(elementID).toLowerCase();
	this.NameListValues;
	this.needSideList = false;
	this.needCoordinates = false;
	this.XYBase = "1x1";				// -> should have a value if needCoordinates = true
	this.needAngleList = false;
	this.needOpenedCheckbox = false;
	this.needHPInput = false;
	this.needFatigueInput = false;
	this.needArchetypeList = false;
	this.needClassList = false;
	this.needAddTokenButton = false;
	this.needAddRelicButton = false;
	this.needAddAuraButton = false;
	this.needRemoveButton = false;

	this.AddOneEmptyLine = function() {
			var lineHTML = $('<div>');
			lineHTML.addClass('select-row');

			lineHTML.append(Create_MainElementList(this.elementName, this.elementID, this.NameListValues));

			if (this.needSideList == true) {
				lineHTML.append(Create_SideList());
			}
			if (this.needCoordinates == true) {
				lineHTML.append(Create_CoordinatesSystem(this.XYBase));
			}
			if (this.needOpenedCheckbox == true) {
				lineHTML.append(Create_OpenCheckbox());
			}
			if (this.needAngleList == true) {
				lineHTML.append(Create_AngleList());
			}
			if (this.needHPInput == true) {
				lineHTML.append(Create_HPInput());
			}
			if (this.needFatigueInput == true) {
			}
			if (this.needArchetypeList == true) {
			}
			if (this.needClassList == true) {
			}
			if (this.needAddTokenButton == true) {
			}
			if (this.needAddRelicButton == true) {
			}
			if (this.needAddAuraButton == true) {
			}
			if (this.needRemoveButton == true) {
				lineHTML.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove ' + this.elementName + '</button>'));
			}
			return lineHTML;
		};
	this.Set_MainElement = function(RowElement, NewValue, NewXYBase) {
			Set_MainElement(RowElement, this.elementID, NewValue);
			if (this.needCoordinates == true) {
				if (NewXYBase != undefined) {
					Update_XY(RowElement, NewXYBase)
				}
			}
		};
	this.UnSet_MainElement = function(RowElement) {
			UnSet_MainElement(RowElement, this.elementName,this.elementID);
			if (this.needCoordinates == true) {
				UnSet_X(RowElement);
				UnSet_Y(RowElement);
			}
		};
	this.AddOneLineWithData = function(ConfigData) {
			var lineHTMLwithData = this.AddOneEmptyLine();

			Set_MainElement(lineHTMLwithData, this.elementID, ConfigData.title);
			if (this.needSideList == true) {
				Set_Side(lineHTMLwithData, ConfigData.side);
			}
			if (this.needCoordinates == true) {
				Set_Coordinates(lineHTMLwithData,ConfigData);
			}
			if (this.needOpenedCheckbox == true) {
				Set_OpenCheckbox(lineHTMLwithData,ConfigData.opened);
			}
			if (this.needAngleList == true) {
				Set_Angle(lineHTMLwithData,ConfigData.angle);
			}
			if (this.needHPInput == true) {
			}
			if (this.needFatigueInput == true) {
			}
			if (this.needArchetypeList == true) {
			}
			if (this.needClassList == true) {
			}
			if (this.needAddTokenButton == true) {
			}
			if (this.needAddRelicButton == true) {
			}
			if (this.needAddAuraButton == true) {
			}
			if (this.needRemoveButton == true) {
			}
			return lineHTMLwithData;
		};
	this.GetOneLineData = function(RowElement) {
			var LineData = {};

			LineData.title = Get_MainElement(RowElement);
			if (this.needSideList == true) {
				LineData.side = Get_Side(RowElement);
			}
			if (this.needCoordinates == true) {
				var Coordinates = Get_Coordinates(RowElement);
				LineData.base = Coordinates.base;
				LineData.direction = Coordinates.direction;
				LineData.x = Coordinates.x;
				LineData.y = Coordinates.y;
			}
			if (this.needOpenedCheckbox == true) {
				LineData.opened = Get_OpenCheckbox(RowElement);
			}
			if (this.needAngleList == true) {
				LineData.angle = Get_Angle(RowElement);
			}
			if (this.needHPInput == true) {
			}
			if (this.needFatigueInput == true) {
			}
			if (this.needArchetypeList == true) {
			}
			if (this.needClassList == true) {
			}
			if (this.needAddTokenButton == true) {
			}
			if (this.needAddRelicButton == true) {
			}
			if (this.needAddAuraButton == true) {
			}
			if (this.needRemoveButton == true) {
			}
			return LineData;
		};
}

// Main Element
function Create_MainElementList(elementTitle, elementID, MainElementListValues) {
	var html = createInputSelect('Select ' + elementTitle, elementID + '-title', 'select-' + elementID);
	html.find('ul').append(MainElementListValues);
	html.append($('<input type="hidden" name="line-title" value=""/>'));
	return html;
}

function Get_MainElement(RowElement) {
	return RowElement.find('[name="line-title"]').val();
}

function Set_MainElement(RowElement, elementID, NewValue) {
	RowElement.find('.' + elementID + '-title').html(NewValue + ' ');
	RowElement.find('input[name="line-title"]').attr('value',NewValue);
}

function UnSet_MainElement(RowElement, elementTitle, elementID) {
	RowElement.find('.' + elementID + '-title').html('Select ' + elementTitle);
	RowElement.find('input[name="line-title"]').attr('value','');
}

// Side Element
function Create_SideList() {
	var html = createInputSelect('Select side', 'side-title', 'select-side');
	html.find('ul').append(addOption('Clear', '', 'UnSet_Side(this,\'\');'));
	html.find('ul').append(addOption('A' + ' ', '', 'Set_Side(this, \'' + 'A' + '\');'));
	html.find('ul').append(addOption('B' + ' ', '', 'Set_Side(this, \'' + 'B' + '\');'));
	html.append($('<input type="hidden" name="line-side" value=""/>'));
	return html;
}

function Set_Side(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.side-title').html(value + ' ');
	container.find('input[name="line-side"]').attr('value',value);
}

function Get_Side(RowElement) {
	return RowElement.find('[name="line-side"]').val();
}

function UnSet_Side(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.side-title').html('Select side ');
	container.find('input[name="line-side"]').attr('value','');
}

// Coordinates
// Has it's own File -> cCoordinatesElements.js


// Open Check Box
function Create_OpenCheckbox(elementTitle) {
	var html = $('<div>').addClass('checkbox').addClass('door-opened');
	var checkboxContent = $('<label>');
	checkboxContent.append($('<input>').attr('type', 'checkbox').attr('name','opened'));
	checkboxContent.append('opened');
	html.append(checkboxContent);
	return html;
}

function Get_OpenCheckbox(RowElement) {
	return RowElement.find('[name="opened"]').prop('checked');
}

function Set_OpenCheckbox(RowElement, value) {
	RowElement.find('[name="opened"]').prop('checked',value);
}

// Angle Element
function Create_AngleList(elementTitle) {
	var html = createInputSelect('Select angle', 'angle-title', 'select-angle');
	html.find('ul').append(addOption('Clear', '', 'UnSet_Angle(this,\'\');'));
	html.find('ul').append(addOption('0' + ' ', '', 'Set_Angle(this, \'' + '0' + '\');'));
	html.find('ul').append(addOption('90' + ' ', '', 'Set_Angle(this, \'' + '90' + '\');'));
	html.find('ul').append(addOption('180' + ' ', '', 'Set_Angle(this, \'' + '180' + '\');'));
	html.find('ul').append(addOption('270' + ' ', '', 'Set_Angle(this, \'' + '270' + '\');'));
	html.append($('<input type="hidden" name="line-angle" value=""/>'));
	return html;
}

function Set_Angle(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.angle-title').html(value + ' ');
	container.find('input[name="line-angle"]').attr('value',value);
}

function UnSet_Angle(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.angle-title').html('Select angle ');
	container.find('input[name="line-angle"]').attr('value','');
}

function Get_Angle(RowElement) {
	return RowElement.find('[name="line-angle"]').val();
}

// HP Element
function Create_HPInput(elementTitle) {
	var html = $('<input type="text" name="line-hp" class="form-control" placeholder="Set HP" value=""/>');
	return html;
}
