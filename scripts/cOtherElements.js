//Act Button Element
function Create_ActButton()
{
	var DisplayAct = "II";
	if (CurrentAct == "I")
	{
		DisplayAct = "I";
	}

	var html;
	html = $('<div>').addClass('SelectAct');
	html.append('<input type="image" src="images/misc/Act' + DisplayAct + '.png" class="ImgAct" onclick="SwitchAct();" />');
	return html;
}

function Fill_ActButton()
{
	var ActImg = $('.ImgAct');
	var ActImgSrc = ActImg.attr('src');
	ActImgSrc = ActImgSrc.replace('ActII','ActI');
	ActImgSrc = ActImgSrc.replace('ActI', 'Act' + CurrentAct);
	ActImg.attr('src', ActImgSrc);
}

function SwitchAct()
{
	var SwitcToAct = "I";
	if (CurrentAct == "I")
	{
		SwitcToAct = "II";
	}

	var ActImg = $('.ImgAct');
	var ActImgSrc = ActImg.attr('src');
	ActImgSrc = ActImgSrc.replace('Act' + CurrentAct, 'Act' + SwitcToAct)
	ActImg.attr('src', ActImgSrc);

	//new current Act
	CurrentAct = SwitcToAct;

	UpdateWindow_OLFigures();
	UpdateWindow_MapDesign();
}

function updateAct(NewAct) {
	CurrentAct = NewAct;
	Fill_ActButton();
	//Data Linked
	UpdateWindow_OLFigures();
}

//expansions
function Create_ExpansionList()
{
	var html;
	html = $('<div>').addClass('expansions');
	for (var expansionGroup in EXPANSION_GROUPS) {
		if (EXPANSION_GROUPS[expansionGroup] == undefined) continue;
		var GroupHTML = $('<div>').addClass('expansions-group');
		GroupHTML.append("<b>"+expansionGroup+"</b>");

		var expansionList = EXPANSION_GROUPS[expansionGroup];
		for (var i = 0; i < expansionList.length; i++) {
			var expansion = expansionList[i];
			var expansionObject = $('<div>').addClass('checkbox');
			var expansionInput = $('<input type="checkbox" name="' + folderize(expansion) + '" onClick="Set_Expansion(this, \'' + folderize(expansion) + '\');" />');
			expansionInput.prop('checked', true);
			expansionObject.append($('<label> ' + expansion + '</label>').prepend(expansionInput));
			GroupHTML.append(expansionObject);
		}
		html.append(GroupHTML);
	}
	return html;
}

function Set_Expansion(element, value) {
	var container = $(element).parents('.select-row');
	//Data Linked
	adjustMonsterList();
}




function updateExpansionsFromConfig() {
	if (config.expansions != undefined) {
		selectedExpansions = config.expansions;
		updateExpansions();
	}
}

function updateExpansions() {
	$('#expansions input').prop('checked',false);
	for (var selectedExpansion in selectedExpansions) {
		if (selectedExpansions[selectedExpansion] == undefined) continue;
		$('[name="' + urlize(selectedExpansion) + '"]').prop('checked',true);
	}
}
