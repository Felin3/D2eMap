function InitializeWindowFor_QuestObjectives() {
	var html = $('#quest-objectives');
	html.append(addTextareaWithLabel("Heroes victory conditions:", "heroes-victory"));
	html.append(addTextareaWithLabel("Overlord victory conditions:", "overlord-victory"));
	html.append(addTextareaWithLabel("Current quest status:", "current-status"));
	html.append(addTextareaWithLabel("Reinforcements:", "reinforcements"));
}

function Get_QuestObjectives() {
	var questObjectives = {};
	questObjectives.heroesVictory = $('#heroes-victory').val();
	questObjectives.ovelordVictory = $('#overlord-victory').val();
	questObjectives.currentStatus = $('#current-status').val();
	questObjectives.reinforcements = $('#reinforcements').val();
	return questObjectives;
}

function FillWindow_QuestObjectives() {
	var questObjectives = config.questObjectives;
	if (questObjectives != undefined) {
		$('#heroes-victory').val(questObjectives.heroesVictory);
		$('#overlord-victory').val(questObjectives.ovelordVictory);
		$('#current-status').val(questObjectives.currentStatus);
		$('#reinforcements').val(questObjectives.reinforcements);
	}
}

function Clear_QuestObjectives() {
	$('#heroes-victory').val('');
	$('#overlord-victory').val('');
	$('#current-status').val('');
	$('#reinforcements').val('');
}
