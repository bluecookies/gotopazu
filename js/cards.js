
var hoverBox = $(".hoverBox");
var hoverBoxShown = false; // to get around async
var doCopyHoverInfo = false;

function setHoverSkill(skill) {
	var div = hoverBox.find("#hoverSkill");
	if (skill) {
		var tbody = div.find("tbody").empty();

		var row = $("<tr>")
			.append($("<th>").append("Name"))
			.append($("<td>").append(skill[0]));

		tbody.append(row);

		for (var i = 0; i < skill[1].length; i++) {
			var s = skill[1][i];
			var c = $("<span>").append(s[0]).css({ color: "grey "});
			var row = $("<tr>")
				.append($("<th>").append("Level " + (i + 1) ))
				.append($("<td>").append(c).append(s[1]));
			tbody.append(row);
		}

		div.show();
	} else {
		div.hide();
	}
}

function setHoverBonus(bonus, id) {
	var div = hoverBox.find(id);
	if (bonus) {
		var tbody = div.find("tbody").empty();

		for (var i = 0; i < bonus.length; i++) {
			var row = $("<tr>")
				.append($("<th>").append("Level " + (i + 1)))
				.append($("<td>").append(bonus[i]));
			tbody.append(row);
		}

		div.show();
	} else {
		div.hide();
	}
}

function copyHoverInfo() {
	var clone = hoverBox.clone();
	$("#info").html(clone.html());
	doCopyHoverInfo = false;
}

function showHoverBox(id) {
	return function(e) {
		$(this).css({ "background-color": "pink" })
		// can't use offset while display is none, so would have to set to invisible
		// pointer-events is none on the box, so can put it directly under
		// without the mouseleave event instantly triggering
		hoverBox.css({ left: e.pageX, top: e.pageY });
		hoverBoxShown = true;
		$.get("data/" + id + ".json", (data) => {
			if (hoverBoxShown) {
				setHoverSkill(data.skill);
				setHoverBonus(data.bonus, "#hoverBonus");
				setHoverBonus(data.kirakira, "#hoverKira");
				setHoverBonus(data.dokidoki, "#hoverDoki");
				hoverBox.show();
				if (doCopyHoverInfo) {
					copyHoverInfo();
				}
			}
		}, "json");
	};
}

function hideHoverBox() {
	$(this).css({ "background-color": "" });
	hoverBoxShown = false;
	hoverBox.hide();
}

// man i hate writing raw js
function updateTable(data) {
	var tbody = $("#cards > tbody");
	data.forEach((card) => {
		var src = "https://img.altema.jp/gotopazu/card/icon/" + card.id + ".jpg";
		var skill_src = "https://img.altema.jp/gotopazu/skill_type/icon/" + card.skill + ".jpg";

		var img = $("<img>", { "class": "lazy", "data-src": src });
		var skill_img;
		if (card.skill == 0) {
			skill_img = $();
		} else {
			skill_img = $("<img>", { "class": "lazy", "data-src": skill_src });
		}
		var row = $("<tr>")
			.append($("<td>").append(img).append($("<br>")).append(card.name))
			.append($("<td>").append(card.name2))
			.append($("<td>").append(card.rea))
			.append($("<td>").append(skill_img))
			.data("chara", card.chara)
			.data("rarity", card.rea);

		row.hover(showHoverBox(card.id), hideHoverBox);
		row.click(() => {
			if (hoverBox.is(":hidden")) {
				doCopyHoverInfo = true;
			} else {
				copyHoverInfo();
			}
		});
		tbody.append(row);
	});

	// or update existing instance?
	var lazyLoadInstance = new LazyLoad();

	filterCards();
}

function filterCards() {
	// man this is so dodgy
	var filterCharas = [];
	$("#filter-charas > input").each((_, input) => {
		filterCharas[input.value] = input.checked;
	});

	var filterRarities = [];
	$("#filter-rarities > input").each((_, input) => {
		filterRarities[input.value] = input.checked;
	});

	var rows = $("#cards > tbody > tr");
	rows.each((_, row) => {
		var r = $(row);
		if (filterCharas[r.data("chara")] && filterRarities[r.data("rarity")]) {
			r.show();
		} else {
			r.hide();
		}
	});
}

$("#filter > button").click(filterCards);
$.get("data/cards.json", updateTable, "json");
