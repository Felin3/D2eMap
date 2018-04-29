function InitializeWindowFor_Monsters() {
	var html = $('#monsters');

	html.append(Create_ActButton());

	html.append('<div><h1>Monsters</h1></div>');
	html.append('<div id="monsters-cards"></div>');
	html.append('<div id="monsters-container"></div>');
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="addMonsterLine();">Add monster row</button>');
	html.append('<div id="lieutenants-container"><h1>Lieutenants</h1></div>');
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="addLieutenantLine();">Add lieutenant row</button>');
	html.append('<div id="agents-container"><h1>Agents</h1></div>');
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="addAgentLine();">Add agent row</button>');
	html.append('<div id="monster-traits"></div>');
	html.append('<div id="expansions"></div>');
}

function constructMonstersAndLieutenantsTabFromConfig() {
	removeMonsterRows();

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

function addMonsterLine() {
	var monsterLine = $('<div>').attr('id','monster' + monsterNumber.toString());
	monsterNumber += 1;
	addUnitLine(monsterLine, 'monster');
	monsterLine.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	monsterLine.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove monster</button>'));
	monsterLine.append($('<input type="hidden" name="master" value=""/>'));
	monsterLine.append($('<input type="hidden" name="monster-y-size" value=""/>'));
	monsterLine.append($('<input type="hidden" name="monster-x-size" value=""/>'));

	monsterLine.find('.select-monster ul').append(createMonsterSelectContent());
	monsterLine.find('.select-x ul').append(createXSelectContent(false));
	monsterLine.find('.select-y ul').append(createYSelectContent(false));
	$('#monsters-container').append(monsterLine);
	return monsterLine;
}

function updateMonstersVisibility() {
	monsterTraits = {};
	selectedExpansions = {};
	var traitInputs = $('#monster-traits input');
	var expansionInputs = $('#expansions input');
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

function createMonsterSelectContent() {
	var html = '';
	for (var i = 0; i < MONSTERS_LIST.length; i++) {
		var monsterClass = folderize(MONSTERS_LIST[i][4]);
		for (var j = 0; j < MONSTERS_LIST[i][5].length; j++) {
			monsterClass += ' ';
			monsterClass += urlize(MONSTERS_LIST[i][5][j]);
		}
		var monsterTitle = MONSTERS_LIST[i][0];
		var monsterVisible = (monsterTraits[MONSTERS[monsterTitle].traits[0]] != undefined || monsterTraits[MONSTERS[monsterTitle].traits[1]] != undefined) && selectedExpansions[MONSTERS[monsterTitle].expansion] != undefined;
		var option = $(addOption(monsterTitle + ' master', monsterClass, 'updateMonster(this, \'' + monsterTitle + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
		option = $(addOption(monsterTitle + ' minion', monsterClass, 'updateMonster(this, \'' + monsterTitle + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
	}
	return html;
}

function removeMonsterRows() {
	$('#monsters-container .select-row').remove();
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


function updateTraitsAndExpansionsFromConfig() {
	updateTraitsFromConfig();
	updateExpansionsFromConfig();
}

function createMonsterTraitsBlock() {
	var html = $('#monster-traits');
	for (var i = 0; i < MONSTER_TRAITS.length; i++) {
		var monsterTrait = MONSTER_TRAITS[i];
		var traitObject = $('<div>').addClass('checkbox');
		traitObject.append($('<img src="images/monster_traits/' + urlize(monsterTrait) + '.png"/>'));
		var traitInput = $('<input type="checkbox" name="' + urlize(monsterTrait) + '" onClick="updateMonstersVisibility();" />');
		traitInput.prop('checked', true);
		traitObject.append($('<label></label>').append(traitInput));
		html.append(traitObject);
	}
	return html;
}

function updateTraitsFromConfig() {
	if (config.monsterTraits != undefined) {
		monsterTraits = config.monsterTraits;
		updateTraits();
	}
}

function updateTraits() {
	$('#monster-traits input').prop('checked',false);
	for (var monsterTrait in monsterTraits) {
		if (monsterTraits[monsterTrait] == undefined) continue;
		$('[name="' + urlize(monsterTrait) + '"]').prop('checked',true);
	}
}

function createExpansionsBlock() {
	var html = $('#expansions');
	for (var expansionGroup in EXPANSION_GROUPS) {
		if (EXPANSION_GROUPS[expansionGroup] == undefined) continue;
		var GroupHTML = $('<div>').addClass('expansions-group');
		GroupHTML.append("<b>"+expansionGroup+"</b>");
		var expansionList = EXPANSION_GROUPS[expansionGroup];

		for (var i = 0; i < expansionList.length; i++) {
			var expansion = expansionList[i];
			var expansionObject = $('<div>').addClass('checkbox');
			var expansionInput = $('<input type="checkbox" name="' + folderize(expansion) + '" onClick="updateMonstersVisibility();" />');
			expansionInput.prop('checked', true);
			expansionObject.append($('<label> ' + expansion + '</label>').prepend(expansionInput));
			GroupHTML.append(expansionObject);
		}
		html.append(GroupHTML);
	}

	return html;
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
