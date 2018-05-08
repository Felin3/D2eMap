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

	adjustMonsterList();
	UpdateWindow_MapControls();
}

function updateAct(NewAct) {
	CurrentAct = NewAct;
	Fill_ActButton();
	adjustMonsterList();
}
