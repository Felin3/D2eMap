function InitializeWindowFor_OLFigures() {
	var html = $('#monsters');

	html.append(Create_ActButton());

	//tiles zone
	html.append(CreateZone_Monsters());
	//doors zone
	html.append(CreateZone_Lieutenants());
	//xMarks zone
	html.append(CreateZone_Agents());
	//monsters traits
	html.append(Create_MonsterTraitsList());
	//expansions
	html.append(Create_ExpansionList());
}

function UpdateWindow_OLFigures() {
	//after Act Set
	//Update_MonsterImages(RowElement);
	Update_MonsterImages();
}

function GetWindow_OLFigures(DataToUpdate) {
	DataToUpdate = GetZone_Monsters(DataToUpdate);
	DataToUpdate = GetZone_Lieutenants(DataToUpdate);
	DataToUpdate = GetZone_Agents(DataToUpdate);
	DataToUpdate = GetZone_MonsterTraits(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_OLFigures(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Monsters(NewData, FromPreFilledMaps);
	FillZone_Lieutenants(NewData, FromPreFilledMaps);
	FillZone_Agents(NewData, FromPreFilledMaps);
	FillZone_MonsterTraits(NewData, FromPreFilledMaps);
}

function ResetWindow_OLFigures(FromPreFilledMaps) {
	ResetZone_Monsters(FromPreFilledMaps);
	ResetZone_Lieutenants(FromPreFilledMaps);
	ResetZone_Agents(FromPreFilledMaps);
	ResetZone_MonsterTraits(FromPreFilledMaps);
}

//monsters zone
function CreateZone_Monsters() {
	var html = $('<div>');
	var container = $('<div>').addClass('monster-container');
	container.append('<h1>Monsters</h1>');
	container.append('<div class="monsters-cards"></div>');
	container.append('<div class="monsters-relicscards"></div>');
	container.append('<div class="monsters-tokenscards"></div>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Monster();">Add monster</button>');
	//initialize LineClass
	monsterLine.NameListValues = Create_MonsterListValues();
	monsterLine.RelicCommonImageContainer = "monsters-relicscards";
	monsterLine.TokenCommonImageContainer = "monsters-tokenscards";

	return html;
}

function GetZone_Monsters(DataToUpdate) {
	var result = [];
	var monsters = $('.monster-container .select-row');
	for (var i = 0; i < monsters.length; i++) {
		var container = $(monsters[i]);
		var monster = {};
		monster = monsterLine.GetOneLineData(container);
		result.push(monster);
	}
	DataToUpdate.monsters = result;
	return DataToUpdate;
}

function FillZone_Monsters(NewData, FromPreFilledMaps) {
	ResetZone_Monsters(FromPreFilledMaps);
	if (NewData.monsters != undefined) {
		for (var i = 0 ; i < NewData.monsters.length; i++) {
			monsterLine.XYBase = MONSTERS[NewData.monsters[i].title.replace(' master','').replace(' minion','')].width + 'x' + MONSTERS[NewData.monsters[i].title.replace(' master','').replace(' minion','')].height;
			var html = monsterLine.AddOneLineWithData(NewData.monsters[i]);
			$('.monster-container').append(html);
		}
		Update_MonsterImages();
	}
}

function ResetZone_Monsters(FromPreFilledMaps) {
	$('.monster-container .select-row').remove();
}

function AddLine_Monster() {
	monsterLine.XYBase = "1x1";
	var html = monsterLine.AddOneEmptyLine();
	$('.monster-container').append(html);
	return html;
}

function RemoveLine_Monster(Button) {
	Update_MonsterImages();
}

function Create_MonsterListValues() {
	var html = addOption('Clear', '', 'UnSet_Monster(this);');
	for (var i = 0; i < MONSTERS_LIST.length; i++) {
		var monsterClass = folderize(MONSTERS_LIST[i][4]);
		for (var j = 0; j < MONSTERS_LIST[i][5].length; j++) {
			monsterClass += ' ';
			monsterClass += urlize(MONSTERS_LIST[i][5][j]);
		}
		var monsterTitle = MONSTERS_LIST[i][0];
		var monsterVisible = (monsterTraits[MONSTERS[monsterTitle].traits[0]] != undefined || monsterTraits[MONSTERS[monsterTitle].traits[1]] != undefined) && selectedExpansions[MONSTERS[monsterTitle].expansion] != undefined;
		var option = $(addOption(monsterTitle + ' master', monsterClass, 'Set_Monster(this, \'' + monsterTitle + ' master' + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
		option = $(addOption(monsterTitle + ' minion', monsterClass, 'Set_Monster(this, \'' + monsterTitle + ' minion' + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
	}
	return html;
}

function Set_Monster(element, value) {
	var container = $(element).parents('.select-row');
	//for copatibility
	if (value.indexOf(" minion") < 0 && value.indexOf(" master") < 0)
	{
		//by default minion
		value = value + ' minion';
	}
	var OneMonsterValue = value.replace(' master','').replace(' minion','');
	monsterLine.XYBase = MONSTERS[OneMonsterValue].width + 'x' + MONSTERS[OneMonsterValue].height;
	monsterLine.Set_MainElement(container, value);
	Update_MonsterImages(container);
}

function UnSet_Monster(element) {
	var container = $(element).parents('.select-row');
	monsterLine.UnSet_MainElement(container);
	Update_MonsterImages(container);
}

function Update_MonsterImages(RowElement) {
	var MonsterImageContainer = $('.monsters-cards');
	var MonsterList = $('.monster-container').find('.MainElement-Value');
	Reset_MonsterImages(RowElement);
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';
	for (var i = 0; i < MonsterList.length; i++) {
		var OneMonsterValue = $(MonsterList[i]).attr('value').replace(' master','').replace(' minion','');
		if (OneMonsterValue == undefined || OneMonsterValue == '') continue;
		if (MonsterImageContainer.find('.' + urlize(OneMonsterValue)).length == 0)
		{
			var MonsterImage = $('<img>');
			MonsterImage.attr('src', 'images/monster_cards/' + urlize(OneMonsterValue) + actAddition + '.png').addClass('monster').addClass(urlize(OneMonsterValue));
			MonsterImageContainer.append(MonsterImage);
			if (MONSTERS[OneMonsterValue].hasBack) {
				var monsterCardBack = $('<img>');
				monsterCardBack.attr('src', 'images/monster_cards/' + urlize(OneMonsterValue) + '_back' + actAddition + '.png');
				MonsterImageContainer.append(monsterCardBack);
			}
		}
	}
}

function Reset_MonsterImages(RowElement) {
	var MonsterImageContainer = $('.monsters-cards');
	MonsterImageContainer.find('img').remove()
}
























//lieutenants zone
function CreateZone_Lieutenants() {
	var html = $('<div>');
	var container = $('<div>').addClass('lieutenant-container');
	container.append('<h1>Lieutenants</h1>');
	// non global -> line by line
	//container.append('<div class="lieutenants-cards"></div>');
	//container.append('<div class="lieutenants-relicscards"></div>');
	//container.append('<div class="lieutenants-tokenscards"></div>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Lieutenant();">Add lieutenant</button>');
	//initialize LineClass
	lieutenantLine.NameListValues = Create_LieutenantListValues();
	//lieutenantLine.RelicCommonImageContainer = "lieutenants-relicscards";
	//lieutenantLine.TokenCommonImageContainer = "lieutenants-tokenscards";

	return html;
}

function GetZone_Lieutenants(DataToUpdate) {
	var result = [];
	var lieutenants = $('.lieutenant-container .select-row');
	for (var i = 0; i < lieutenants.length; i++) {
		var container = $(lieutenants[i]);
		var lieutenant = {};
		lieutenant = lieutenantLine.GetOneLineData(container);
		result.push(lieutenant);
	}
	DataToUpdate.lieutenants = result;
	return DataToUpdate;
}

function FillZone_Lieutenants(NewData, FromPreFilledMaps) {
	ResetZone_Lieutenants(FromPreFilledMaps);
	if (NewData.lieutenants != undefined) {
		for (var i = 0 ; i < NewData.lieutenants.length; i++) {
			lieutenantLine.XYBase = "1x1";
			var html = lieutenantLine.AddOneLineWithData(NewData.lieutenants[i]);
			Update_LieutenantImages(html);
			$('.lieutenant-container').append(html);
		}
	}
}

function ResetZone_Lieutenants(FromPreFilledMaps) {
	$('.lieutenant-container .select-row').remove();
}

function AddLine_Lieutenant() {
	lieutenantLine.XYBase = "1x1";
	var html = lieutenantLine.AddOneEmptyLine();
	$('.lieutenant-container').append(html);
	return html;
}

function RemoveLine_Lieutenant(Button) {
}

function Create_LieutenantListValues() {
	var html = addOption('Clear', '', 'UnSet_Lieutenant(this);');
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		var lieutenantTitle = LIEUTENANTS_LIST[i][0];
		html += addOption(lieutenantTitle + ' ', '', 'Set_Lieutenant(this, \'' + lieutenantTitle + '\')');
	}
	return html;
}

function Set_Lieutenant(element, value) {
	var container = $(element).parents('.select-row');
	lieutenantLine.XYBase = LIEUTENANTS[value].width + 'x' + LIEUTENANTS[value].height;
	lieutenantLine.Set_MainElement(container, value);
	Update_LieutenantImages(container);
}

function UnSet_Lieutenant(element) {
	var container = $(element).parents('.select-row');
	lieutenantLine.UnSet_MainElement(container);
	Update_LieutenantImages(container);
}

function Update_LieutenantImages(RowElement) {
	var LieutenantImageContainer = RowElement.find('.Row-cards');
	Reset_LieutenantImages(RowElement);
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';

	var OneLieutenantValue = RowElement.find('.MainElement-Value').val();
	if (OneLieutenantValue == undefined || OneLieutenantValue == '') return;

	if (LieutenantImageContainer.find('.' + urlize(OneLieutenantValue)).length == 0)
	{
		var LieutenantImage = $('<img>');
		LieutenantImage.attr('src', 'images/lieutenant_cards/' + urlize(OneLieutenantValue) + actAddition + '.png').addClass('lieutenant').addClass(urlize(OneLieutenantValue));
		LieutenantImageContainer.append(LieutenantImage);
		if (LIEUTENANTS[OneLieutenantValue].hasBack) {
			var LieutenantCardBack = $('<img>');
			LieutenantCardBack.attr('src', 'images/lieutenant_cards/' + urlize(OneLieutenantValue) + actAddition + '_back' + '.png');
			LieutenantImageContainer.append(LieutenantCardBack);
		}
	}

}

function Reset_LieutenantImages(RowElement) {
	var LieutenantImageContainer = RowElement.find('.Row-cards');
	LieutenantImageContainer.find('img').remove();
}


//agents zone
function CreateZone_Agents() {
	var html = $('<div>');
	var container = $('<div>').addClass('agent-container');
	container.append('<h1>Agents</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Agent();">Add agent</button>');
	//initialize LineClass
	agentLine.NameListValues = Create_AgentListValues();

	return html;
}

function GetZone_Agents(DataToUpdate) {
	var result = [];
	var agents = $('.agent-container .select-row');
	for (var i = 0; i < agents.length; i++) {
		var container = $(agents[i]);
		var agent = {};
		agent = agentLine.GetOneLineData(container);
		result.push(agent);
	}
	DataToUpdate.agents = result;
	return DataToUpdate;
}

function FillZone_Agents(NewData, FromPreFilledMaps) {
	ResetZone_Agents(FromPreFilledMaps);
	if (NewData.agents != undefined) {
		for (var i = 0 ; i < NewData.agents.length; i++) {
			agentLine.XYBase = "1x1";
			var html = agentLine.AddOneLineWithData(NewData.agents[i]);
			$('.agent-container').append(html);
		}
	}
}

function ResetZone_Agents(FromPreFilledMaps) {
	$('.agent-container .select-row').remove();
}

function AddLine_Agent() {
	agentLine.XYBase = "1x1";
	var html = agentLine.AddOneEmptyLine();
	$('.agent-container').append(html);
	return html;
}

function RemoveLine_Agent(Button) {
}

function Create_AgentListValues() {
	var html = addOption('Clear', '', 'UnSet_Agent(this);');
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		var agentTitle = LIEUTENANTS_LIST[i][0];
		html += addOption('Agent ' + agentTitle + ' ', '', 'Set_Agent(this, \'' + agentTitle + '\')');
	}
	return html;
}

function Set_Agent(element, value) {
	var container = $(element).parents('.select-row');
	agentLine.XYBase = LIEUTENANTS[value].width + 'x' + LIEUTENANTS[value].height;
	agentLine.Set_MainElement(container, value);
	Update_AgentImages(container);
}

function UnSet_Agent(element) {
	var container = $(element).parents('.select-row');
	agentLine.UnSet_MainElement(container);
	Update_AgentImages(container);
}

function Update_AgentImages(RowElement) {
	var AgentImageContainer = RowElement.find('.Row-cards');
	Reset_AgentImages(RowElement);
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';

	var OneAgentValue = RowElement.find('.MainElement-Value').val();
	if (OneAgentValue == undefined || OneAgentValue == '') return;

	if (AgentImageContainer.find('.' + urlize(OneAgentValue)).length == 0)
	{
		var AgentImage = $('<img>');
		AgentImage.attr('src', 'images/plot_cards/agents/' + urlize(OneAgentValue) + actAddition + '.png').addClass('agent').addClass(urlize(OneAgentValue));
		AgentImageContainer.append(AgentImage);
		if (LIEUTENANTS[OneAgentValue].hasBack) {
			var AgentCardBack = $('<img>');
			AgentCardBack.attr('src', 'images/plot_cards/agents/' + urlize(OneAgentValue) + actAddition + '_back' + '.png');
			AgentImageContainer.append(AgentCardBack);
		}
	}

}

function Reset_AgentImages(RowElement) {
	var AgentImageContainer = RowElement.find('.Row-cards');
	AgentImageContainer.find('img').remove();
}


//monsters traits
function Create_MonsterTraitsList()
{
	var html;
	html = $('<div>').addClass('monster-traits');
	for (var i = 0; i < MONSTER_TRAITS.length; i++) {
		var monsterTrait = MONSTER_TRAITS[i];
		var traitObject = $('<div>').addClass('checkbox');
		traitObject.append($('<img src="images/monster_traits/' + urlize(monsterTrait) + '.png"/>'));
		var traitInput = $('<input type="checkbox" class="MonstrerTraits-Value" name="' + urlize(monsterTrait) + '" onClick="Set_MonsterTrait(this, \'' + folderize(monsterTrait) + '\');" />');
		traitInput.prop('checked', true);
		traitObject.append($('<label></label>').append(traitInput));
		html.append(traitObject);
	}
	return html;
}

function GetZone_MonsterTraits(DataToUpdate) {
	var result = [];
	var SelecttedMonsterTraits = $('.MonstrerTraits-Value:checkbox:checked')
	for (var i = 0; i < SelecttedMonsterTraits.length; i++) {
		var checkedTrait = $(SelecttedMonsterTraits[i]).attr('name');
		result[checkedTrait] = checkedTrait;
	}
	DataToUpdate.monsterTraits = result;
	return DataToUpdate;
}

function FillZone_MonsterTraits(NewData, FromPreFilledMaps) {
	ResetZone_MonsterTraits(FromPreFilledMaps);
	if (NewData.monsterTraits != undefined) {
		for (var i = 0 ; i < NewData.monsterTraits.length; i++) {
			Set_MonsterTrait($('.monster-traits'), NewData.monsterTraits[i]);
		}
	}
}

function ResetZone_MonsterTraits(FromPreFilledMaps) {
	//$('.agent-container .select-row').remove();
}

function Set_MonsterTrait(element, value) {
	//$('[name="' + urlize(value) + '"]').prop('checked',true);
	//Data Linked
	adjustMonsterList();
}

function updateTraitsFromConfig() {
	if (config.monsterTraits != undefined) {
		monsterTraits = config.monsterTraits;
		updateTraits();
	}
}

function updateTraits() {
	$('.monster-traits input').prop('checked',false);
	for (var monsterTrait in monsterTraits) {
		if (monsterTraits[monsterTrait] == undefined) continue;
		$('[name="' + urlize(monsterTrait) + '"]').prop('checked',true);
	}
}

















function constructMonstersAndLieutenantsTabFromConfig() {
	ResetZone_Monsters();

	if (config.currentAct != undefined) {
		Fill_ActButton();
	}

	if (config.monsters != undefined) {
		for (var i = 0; i < config.monsters.length; i++) {
			var monster = config.monsters[i];
			if (monster.title != '') {
				var monsterLine = addMonsterLine();
				var width = monster.vertical ? MONSTERS[monster.title].width : MONSTERS[monster.title].height;
				var height = monster.vertical ? MONSTERS[monster.title].height : MONSTERS[monster.title].width;

				var monsterSelectUnit = monsterLine.find('[onclick="updateMonster(this, \'' + monster.title + '\');"]');
				var correctMonsterSelectUnit;

				if (monster.master && $(monsterSelectUnit[0]).html().indexOf('master') > -1 || !monster.master && !($(monsterSelectUnit[0]).html().indexOf('master') > -1)) {
					correctMonsterSelectUnit = monsterSelectUnit[0];
				} else {
					correctMonsterSelectUnit = monsterSelectUnit[1];
				}
				updateMonster(correctMonsterSelectUnit, monster.title);

				var xValue = width.toString() + monster.x.toString();
				updateCoordinate(monsterLine.find('.select-x [onclick="updateCoordinate(this, \'' + xValue + '\');"]'), xValue);
				var yValue = height.toString() + monster.y.toString();
				updateCoordinate(monsterLine.find('.select-y [onclick="updateCoordinate(this, \'' + yValue + '\');"]'), yValue);
				monsterLine.find('input[name="monster-hp"]').val(monster.hp);
				updateConditionsInSettings(monster.conditions, monsterLine);
			}
		}
	}
	if (config.lieutenants != undefined) {
		for (var i = 0 ; i < config.lieutenants.length; i++) {
			var container = addLieutenantLine();
			var lieutenant = config.lieutenants[i];
			updateLieutenant(container.find('.select-lieutenant li')[0], lieutenant.title, lieutenant.hasBack);
			container.find('[name="lieutenant-x"]').val(lieutenant.x);
			container.find('.x-title').html(getAlphabetChar(lieutenant.x - 1) + ' ');
			container.find('[name="lieutenant-y"]').val(lieutenant.y);
			container.find('.y-title').html(lieutenant.y.toString() + ' ');
			container.find('[name="lieutenant-hp"]').val(lieutenant.hp);
			var direction = lieutenant.vertical == undefined || !lieutenant.vertical ? 'horizontal' : 'vertical';
			container.find('.direction-title').html(direction + ' ');
			container.find('[name="lieutenant-direction"]').val(direction);
			for (var j = 0; lieutenant.skills != undefined && j < lieutenant.skills.length; j++) {
				container.find('[name="' + lieutenant.skills[j] + '"]').prop('checked', true);
			}
			updateConditionsInSettings(lieutenant.conditions, container);
			for (var k = 0; lieutenant.relics != undefined && k < lieutenant.relics.length; k++) {
				var relicContainer = addRelic(container.find('[onclick="addRelic(this);"]'));
				updateOverlordRelic(relicContainer.find('li')[0], lieutenant.relics[k]);
			}
		}
	}

	if (config.agents != undefined) {
		for (var i = 0 ; i < config.agents.length; i++) {
			var container = addAgentLine();
			var agent = config.agents[i];
			updateAgent(container.find('.select-agent li')[0], agent.title, agent.hasBack);
			container.find('[name="agent-x"]').val(agent.x);
			container.find('.x-title').html(getAlphabetChar(agent.x - 1) + ' ');
			container.find('[name="agent-y"]').val(agent.y);
			container.find('.y-title').html(agent.y.toString() + ' ');
			container.find('[name="agent-hp"]').val(agent.hp);
			var direction = agent.vertical == undefined || !agent.vertical ? 'horizontal' : 'vertical';
			container.find('.direction-title').html(direction + ' ');
			container.find('[name="agent-direction"]').val(direction);
			for (var j = 0; agent.skills != undefined && j < agent.skills.length; j++) {
				container.find('[name="' + agent.skills[j] + '"]').prop('checked', true);
			}
			updateConditionsInSettings(agent.conditions, container);
		}
	}
}

function monster(element) {
	var container = $(element);
	var monster = {};
	monster.title = container.find('[name="monster-title"]').val();
	monster.master = container.find('[name="master"]').val() == 'true';
	monster.x = container.find('[name="monster-x"]').val();
	monster.y = container.find('[name="monster-y"]').val();
	monster.vertical = container.find('[name="monster-x-size"]').val() < container.find('[name="monster-y-size"]').val();
	monster.hp = container.find('[name="monster-hp"]').val();
	monster.conditions = getConditions(container);
	return monster;
}


function updateMonstersVisibility() {
	monsterTraits = {};
	selectedExpansions = {};
	var traitInputs = $('.monster-traits input');
	var expansionInputs = $('.expansions input');
	for (var i = 0; i < traitInputs.length; i++) {
		if ($(traitInputs[i]).prop('checked')) {
			var checkedTrait = $(traitInputs[i]).attr('name');
			monsterTraits[checkedTrait] = checkedTrait;
		}
	}
	for (var i = 0; i < expansionInputs.length; i++) {
		if ($(expansionInputs[i]).prop('checked')) {
			var selectedExpansion = $(expansionInputs[i]).attr('name');
			selectedExpansions[selectedExpansion] = selectedExpansion;
		}
	}
	$('#monsters-container .select-monster li').css('display', 'none');
	for (var monsterTrait in monsterTraits) {
		for (var selectedExpansion in selectedExpansions) {
			if (monsterTraits[monsterTrait] == undefined || selectedExpansions[selectedExpansion] == undefined) continue;
			$('#monsters-container .' + monsterTrait + '.' + selectedExpansion).css('display', 'block');
		}
	}
}

function adjustMonsterList() {
	monsterList = [];
	var monsters = $('[name="monster-title"]');
	var monsterCardsContainer = $('#monsters-cards');
	monsterCardsContainer.html('');
	for (var i = 0; i < monsters.length; i++) {
		var title = $(monsters[i]).val();
		var inSet = false; //there is not Set in old browsers - thats why such a poor code is used
		for (var j = 0; j < monsterList.length && !inSet; j++) {
			if (monsterList[j] == title) {
				inSet = true;
			}
		}
		if (!inSet) {
			monsterList.push(title);
		}
	}
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';
	for (var i = 0; i < monsterList.length; i++) {
		var monster = monsterList[i];
		if (monster == '') continue;
		var monsterCard = $('<img>');
		monsterCard.attr('src', 'images/monster_cards/' + urlize(monster) + actAddition + '.png');
		monsterCardsContainer.append(monsterCard);
		if (MONSTERS[monster].hasBack) {
			var monsterCardBack = $('<img>');
			monsterCardBack.attr('src', 'images/monster_cards/' + urlize(monster) + '_back' + actAddition + '.png');
			monsterCardsContainer.append(monsterCardBack);
		}
	}
	addConditions(getConditions($('#monsters')), monsterCardsContainer);
}

function updateMonster(element, value) {
	updateOption(element, value, true);
	adjustMonsterList();
}


function addLieutenantLine() {
	var lieutenant = $('<div>');
	addUnitLine(lieutenant, 'Lieutenant');

	lieutenant.find('.select-lieutenant ul').append(createLieutenantsSelectContent());
	lieutenant.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	lieutenant.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	lieutenant.find('.select-lieutenant').after(createInputSelect('Select direction', 'direction-title', 'select-direction'));
	lieutenant.append($('<input type="hidden" name="lieutenant-direction" value=""/>'));
	lieutenant.find('.select-direction ul').append(createDirectionSelectContent());
	lieutenant.append($('<button type="button" class="btn btn-info" aria-expanded="false" onclick="addRelic(this);">Add relic</button>'));
	lieutenant.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	lieutenant.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	lieutenant.append($('<br/>'));
	lieutenant.append($('<img src="" style="display: none;">').addClass('lieutenant-image'));
	lieutenant.append($('<img src="" style="display: none;">').addClass('lieutenant-image-back'));
	$('#lieutenants-container').append(lieutenant);
	return lieutenant;
}

function createLieutenantsSelectContent() {
	var html = addOption('Clear', '', 'clearLieutenant(this);');
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		var lieutenantTitle = LIEUTENANTS_LIST[i][0];
		html += addOption(lieutenantTitle + ' ', '', 'updateLieutenant(this, \'' + lieutenantTitle + '\', ' + LIEUTENANTS_LIST[i][1].toString() + ')');
	}
	return html;
}

function updateLieutenant(element, value, showBack) {
	var container = $(element).parents('.select-row');
	container.find('.lieutenant-title').html(value + ' ');
	container.find('input[name="lieutenant-title"]').attr('value',value);
	var actAcronym = '_act';
	container.find('img.lieutenant-image').attr('src', 'images/lieutenant_cards/' + urlize(value) + actAcronym + ((CurrentAct == "I") ? '1' : '2') + '.png').css('display','inline-block');
	if (showBack) {
		container.find('img.lieutenant-image-back').attr('src', 'images/lieutenant_cards/' + urlize(value) + actAcronym + ((CurrentAct == "I") ? '1' : '2') + '_back' + '.png').css('display','inline-block');
	} else {
		container.find('img.lieutenant-image-back').css('display','none');
	}
	container.find('[lieutenant="' + value + '"] input[type="checkbox"]').parent().parent().css('display', 'block');
}

function clearLieutenant(element) {
	var container = $(element).parents('.select-row');
	container.find('.lieutenant-title').html('Select Lieutenant ');
	container.find('input[name="lieutenant-title"]').attr('value','');
	container.find('img.lieutenant-image').css('display','none');
	container.find('img.lieutenant-image-back').css('display','none');
}

function addRelic(button) {
	var relicNumber = overlordRelicNumber += 1;
	var relic = $(createInputSelect('Select relic', 'relic-title', 'select-relic'));
	relic.attr('id', 'relic-select-' + relicNumber.toString());
	relic.find('ul').append(createOverlordRelicsSelectContent());
	var buttonObject = $(button);
	buttonObject.before(relic);
	buttonObject.before('<input type="hidden" name="relic-title" id="relic' + relicNumber.toString() + '" value=""/>');
	return relic;
}

function updateOverlordRelic(element, value) {
	var container = $(element).parents('.select-row');
	var relicContainer = $(element).parents('.select-relic');
	var relicNumber = relicContainer.attr('id').replace('relic-select-', '');
	relicContainer.find('.relic-title').html(value + ' ');
	$('#relic' + relicNumber.toString()).val(value);
	var relicImage = $('#relic-image-' + relicNumber.toString());
	if (relicImage.length == 0) {
		relicImage = $('<img>').addClass('relic-image').attr('id', 'relic-image-' + relicNumber.toString());
		container.append(relicImage);
	}
	relicImage.attr('src', 'images/items_cards/relic/overlord/' + urlize(value) + '.png');
}

function removeOverlordRelic(element) {
	var relicContainer = $(element).parents('.select-relic');
	var relicNumber = relicContainer.attr('id').replace('relic-select-', '');
	$('#relic' + relicNumber.toString()).remove();
	$('#relic-image-' + relicNumber.toString()).remove();
	relicContainer.remove();
}

function createOverlordRelicsSelectContent() {
	var html = addOption('Remove relic', '', 'removeOverlordRelic(this);');
	for (var i = 0; i < OVERLORD_RELICS_LIST.length; i++) {
		html += addOption(OVERLORD_RELICS_LIST[i] + ' ', '', 'updateOverlordRelic(this, \'' + OVERLORD_RELICS_LIST[i] + '\')');
	}
	return html;
}

function getLieutenants() {
	var result = [];
	var lieutenants = $('#lieutenants-container .select-row');
	for (var i = 0; i < lieutenants.length; i++) {
		var container = $(lieutenants[i]);
		var lieutenant = {};
		lieutenant.title = container.find('[name="lieutenant-title"]').val();
		lieutenant.x = container.find('[name="lieutenant-x"]').val();
		lieutenant.y = container.find('[name="lieutenant-y"]').val();
		lieutenant.hp = container.find('[name="lieutenant-hp"]').val();
		lieutenant.conditions = getConditions(container);
		lieutenant.hasBack = container.find('img.lieutenant-image-back').css('display') != 'none';
		lieutenant.vertical = container.find('[name="lieutenant-direction"]').val() == 'vertical';
		lieutenant.relics = [];
		var relics = container.find('[name="relic-title"]');
		for (var j = 0; j < relics.length; j++) {
			lieutenant.relics.push($(relics[j]).val());
		}
		lieutenant.skills = [];
		var skillCheckboxes = container.find('input[type="checkbox"]');
		for (var k = 0; k < skillCheckboxes.length; k++) {
			var skillCheckbox = $(skillCheckboxes[k]);
			if (skillCheckbox.prop('checked')) {
				lieutenant.skills.push(skillCheckbox.attr('name'));
			}
		}
		result.push(lieutenant);
	}
	return result;
}

function clearLieutenants() {
	$('#lieutenants-container .select-row').remove();
}



function addAgentLine() {
	var agent = $('<div>');
	addUnitLine(agent, 'Agent');

	agent.find('.select-agent ul').append(createAgentsSelectContent());
	agent.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	agent.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	agent.find('.select-agent').after(createInputSelect('Select direction', 'direction-title', 'select-direction'));
	agent.append($('<input type="hidden" name="agent-direction" value=""/>'));
	agent.find('.select-direction ul').append(createDirectionSelectContent());
	agent.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	agent.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	agent.append($('<br/>'));
	agent.append($('<img src="" style="display: none;">').addClass('agent-image'));
	agent.append($('<img src="" style="display: none;">').addClass('agent-image-back'));
	$('#agents-container').append(agent);
	return agent;
}

function createAgentsSelectContent() {
	var html = addOption('Clear', '', 'clearAgent(this);');
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		if (LIEUTENANTS_LIST[i][0].indexOf('act') != -1 || LIEUTENANTS_LIST[i][0].indexOf('Act') != -1) {
			continue;
		}
		var agentTitle = 'Agent ' + LIEUTENANTS_LIST[i][0];
		html += addOption(agentTitle + ' ', '', 'updateAgent(this, \'' + agentTitle + '\', ' + LIEUTENANTS_LIST[i][1].toString() + ')');
	}
	return html;
}

function updateAgent(element, value, showBack) {
	var container = $(element).parents('.select-row');
	var realName = value.replace('Agent ', '');
	container.find('.agent-title').html(value + ' ');
	container.find('input[name="agent-title"]').attr('value',value);
	container.addClass('agent');
	var actAcronym = '_act';
	container.find('img.agent-image').attr('src', 'images/plot_cards/agents/' + urlize(realName) + actAcronym + ((CurrentAct == "I") ? '1' : '2') + '.png').css('display','inline-block');
	if (showBack) {
		container.find('img.agent-image-back').attr('src', 'images/plot_cards/agents/' + urlize(realName) + actAcronym + ((CurrentAct == "I") ? '1' : '2') + '_back' + '.png').css('display','inline-block');
	} else {
		container.find('img.agent-image-back').css('display','none');
	}
	container.find('[agent="' + value + '"] input[type="checkbox"]').parent().parent().css('display', 'block');
}

function clearAgent(element) {
	var container = $(element).parents('.select-row');
	container.find('.agent-title').html('Select Agent ');
	container.find('input[name="agent-title"]').attr('value','');
	container.find('img.agent-image').css('display','none');
	container.find('img.agent-image-back').css('display','none');
}

function getAgents() {
	var result = [];
	var agents = $('#agents-container .select-row');
	for (var i = 0; i < agents.length; i++) {
		var container = $(agents[i]);
		var agent = {};
		agent.title = container.find('[name="agent-title"]').val();
		agent.x = container.find('[name="agent-x"]').val();
		agent.y = container.find('[name="agent-y"]').val();
		agent.hp = container.find('[name="agent-hp"]').val();
		agent.conditions = getConditions(container);
		agent.hasBack = container.find('img.agent-image-back').css('display') != 'none';
		agent.vertical = container.find('[name="agent-direction"]').val() == 'vertical';
		agent.skills = [];
		var skillCheckboxes = container.find('input[type="checkbox"]');
		for (var k = 0; k < skillCheckboxes.length; k++) {
			var skillCheckbox = $(skillCheckboxes[k]);
			if (skillCheckbox.prop('checked')) {
				agent.skills.push(skillCheckbox.attr('name'));
			}
		}
		result.push(agent);
	}
	return result;
}

function clearAgents() {
	$('#agents-container .select-row').remove();
}



