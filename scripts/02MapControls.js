function InitializeWindowFor_MapControls() {
	var html = $('#map-controls');

	//Act Button
	html.append(Create_ActButton());

	//pre-filled Maps zone
	html.append(CreateZone_PreFilledMaps());
	//tiles zone
	html.append(CreateZone_Tiles());
	//doors zone
	html.append(CreateZone_Doors());
	//Xs zone
	html.append(CreateZone_Xs());
}

function ResetWindow_MapControls() {
	ResetZone_Tiles();
	ResetZone_Doors();
	ResetZone_Xs();
}

function UpdateWindow_MapControls() {
	//after Act Set
	Update_EncounterList('', CurrentAct);
}

function FillWindow_MapControls() {
	FillZone_Tile();
	FillZone_Door();
	FillZone_Xs();
}

//pre-filled Maps zone
function CreateZone_PreFilledMaps() {
	var html = $('<div>').addClass('full-maps-container');
	html.append('<h1>Full maps</h1>');
	html.append(Create_CampaignList());
	html.append(Create_EncounterList());
	return html;
}

function Create_CampaignList() {
	var html = createInputSelect('Select Campaign ', 'campaign-title', 'select-campaign');
	html.find('ul').addClass('showcampaign ' + ALL_CAMPAIGNS_CLASSES);
	html.find('ul').append(addOption('Clear', '', 'UnSet_Campaign(this,\'\');'));
	for (var i = 0; i < CAMPAIGNS.length; i++) {
		var code = CAMPAIGNS[i][1];
		var title = CAMPAIGNS[i][0];
		html.find('ul').append(addOption(title + ' ', code, 'Set_Campaign(this, \'' + code + '\');'));
	}
	html.append($('<input type="hidden" name="campaign-title" value=""/>'));
	return html;
}

function Create_EncounterList() {
	var html = createInputSelect('Remove and replace current map with : Quest / Encounter ', 'encounter-title', 'select-encounter');
	html.find('ul').addClass('showencounter ' + ALL_CAMPAIGNS_CLASSES + ' ' + ALL_ACTS);
	for (var i = 0; i < MAP_HASES_LIST.length; i++) {
		html.find('ul').append(addOption(MAP_HASES_LIST[i][1] + ' ',MAP_HASES_LIST[i][0] + ' ' + 'Act' + MAP_HASES_LIST[i][2], 'rebuildMap(this, \'' + i + '\', false);'));
	}
	return html;
}

function Set_Campaign(element, value) {
	var container = $(element).parents('.full-maps-container');
	container.find('.campaign-title').html(element.innerText + ' ');
	container.find('input[name="campaign-title"]').attr('value',value);
	Update_EncounterList(value, CurrentAct);
}

function UnSet_Campaign(element, value) {
	var container = $(element).parents('.full-maps-container');
	container.find('.select-campaign ul').addClass(ALL_CAMPAIGNS_CLASSES);
	container.find('.campaign-title').html('Select campaign ');
	container.find('input[name="campaign-title"]').attr('value',value);
	Update_EncounterList(ALL_CAMPAIGNS_CLASSES, ALL_ACTS);
}

function Update_EncounterList(campaign, act) {
	var container = $('.full-maps-container');
	if (campaign != '') {
		container.find('.select-encounter ul').removeClass(ALL_CAMPAIGNS_CLASSES).addClass(campaign);
	}
	if (act == "I" || act == "II") {
		act = 'Act' + act;
	}
	container.find('.select-encounter ul').removeClass(ALL_ACTS).addClass(act);
}

//tiles zone
function CreateZone_Tiles() {
	var html = $('<div>');
	var container = $('<div>').addClass('tiles-container');
	container.append('<h1>Map tiles</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Tile();">Add map tile</button>');
	//initialize LineClass
	tileLine.NameListValues = Create_TileListValues();

	return html;
}

function GetZone_Tile() {
	var result = [];
	var tiles = $('.tiles-container .select-row');
	for (var i = 0; i < tiles.length; i++) {
		var container = $(tiles[i]);
		var tile = {};
		tile = tileLine.GetOneLineData(container);
		result.push(tile);
	}
	return result;
}

function FillZone_Tile() {
	if (config.tiles != undefined) {
		for (var i = 0 ; i < config.tiles.length; i++) {
			var html = tileLine.AddOneLineWithData(config.tiles[i]);
			$('.tiles-container').append(html);
		}
	}
}

function ResetZone_Tiles() {
	$('.tiles-container .select-row').remove();
}

function AddLine_Tile() {
	var html = tileLine.AddOneEmptyLine();
	$('.tiles-container').append(html);
	return html;
}

function Create_TileListValues() {
	var html = addOption('Clear', '', 'UnSet_Tile(this);');
	for (var i = 0; i < MAP_TILES_LIST.length; i++) {
		html += addOption(MAP_TILES_LIST[i] + ' ', '', 'Set_Tile(this, \'' + MAP_TILES_LIST[i] + '\')');
	}
	return html;
}

function Set_Tile(element, value) {
	var container = $(element).parents('.select-row');
	tileLine.Set_MainElement(container, value);
}

function UnSet_Tile(element) {
	var container = $(element).parents('.select-row');
	tileLine.UnSet_MainElement(container);
}

//doors zone
function CreateZone_Doors() {
	var html = $('<div>');
	var container = $('<div>').addClass('doors-container');
	container.append('<h1>Doors</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Door();">Add door</button>');
	//initialize LineClass
	doorLine.NameListValues = Create_DoorListValues();

	return html;
}

function GetZone_Doors() {
	var result = [];
	var doors = $('.doors-container .select-row');
	for (var i = 0; i < doors.length; i++) {
		var container = $(doors[i]);
		var door = {};
		door = doorLine.GetOneLineData(container);
		result.push(door);
	}
	return result;
}

function FillZone_Door() {
	if (config.doors != undefined) {
		for (var i = 0 ; i < config.doors.length; i++) {
			var html = doorLine.AddOneLineWithData(config.doors[i]);
			$('.doors-container').append(html);
		}
	}
}

function ResetZone_Doors() {
	$('.doors-container .select-row').remove();
}

function AddLine_Door() {
	var html = doorLine.AddOneEmptyLine()
	$('.doors-container').append(html);
	return html;
}

function Create_DoorListValues() {
	var html = addOption('Clear', '', 'UnSet_Door(this);');
	for (var i = 0; i < DOORS_LIST.length; i++) {
		html += addOption(DOORS_LIST[i] + ' ', '', 'Set_Door(this, \'' + DOORS_LIST[i] + '\')');
	}
	return html;
}

function Set_Door(element, value) {
	var container = $(element).parents('.select-row');
	doorLine.Set_MainElement(container, value);
}

function UnSet_Door(element) {
	var container = $(element).parents('.select-row');
	doorLine.UnSet_MainElement(container);
}


//Xs zone
function CreateZone_Xs() {
	var html = $('<div>');
	var container = $('<div>').addClass('xs-container');
	container.append('<h1>Xs</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Xs();">Add X</button>');
	//initialize LineClass
	xBlockLine.NameListValues = Create_xBlockListValues();
	return html;
}

function GetZone_Xs() {
	var result = [];
	var xs = $('.xs-container .select-row');
	for (var i = 0; i < xs.length; i++) {
		var container = $(xs[i]);
		var x = {};
		x = xBlockLine.GetOneLineData(container);
		result.push(x);
	}
	return result;
}

function FillZone_Xs() {
	if (config.xs != undefined) {
		for (var i = 0 ; i < config.xs.length; i++) {
			var html = xBlockLine.AddOneLineWithData(config.xs[i]);
			$('.xs-container').append(html);
		}
	}
}

function ResetZone_Xs() {
	$('.xs-container .select-row').remove();
}

function AddLine_Xs() {
	var html = xBlockLine.AddOneEmptyLine()
	$('.xs-container').append(html);
	return html;
}

function Create_xBlockListValues() {
	var html = addOption('Clear', '', 'UnSet_Xs(this);');
	for (var i = 0; i < BLOCKS_LIST.length; i++) {
		html += addOption(BLOCKS_LIST[i][0] + ' ', '', 'Set_Xs(this, \'' + BLOCKS_LIST[i][0] + '\')');
	}
	return html;
}

function Set_Xs(element, value) {
	var container = $(element).parents('.select-row');
	xBlockLine.Set_MainElement(container, value, BLOCKS[value].width + 'x' + BLOCKS[value].height);
}

function UnSet_Xs(element) {
	var container = $(element).parents('.select-row');
	xBlockLine.UnSet_MainElement(container);
}

