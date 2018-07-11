// HANGUL IME BY PERRY H
// TODO make the input of initial, medial and finals complete (currently only works with initials)

var input = "";

var initials = new Map([
	["r", 'ᄀ'],
	["R", 'ᄁ'],
	["s", 'ᄂ'],
	["e", 'ᄃ'],
	["E", 'ᄄ'],
	["f", 'ᄅ'],
	["a", 'ᄆ'],
	["q", 'ᄇ'],
	["Q", 'ᄈ'],
	["t", 'ᄉ'],
	["T", 'ᄊ'],
	["d", 'ᄋ'],
	["w", 'ᄌ'],
	["W", 'ᄍ'],
	["c", 'ᄎ'],
	["z", 'ᄏ'],
	["x", 'ᄐ'],
	["v", 'ᄑ'],
	["g", 'ᄒ']
]);


var medials = new Map([
	["k",  'ᅡ'],
	["o",  'ᅢ'],
	["i",  'ᅣ'],
	["O",  'ᅤ'],
	["j",  'ᅥ'],
	["p",  'ᅦ'],
	["u",  'ᅧ'],
	["P",  'ᅨ'],
	["h",  'ᅩ'],
	["hk", 'ᅪ'],
	["ho", 'ᅫ'],
	["hl", 'ᅬ'],
	["y",  'ᅭ'],
	["n",  'ᅮ'],
	["nj", 'ᅯ'],
	["np", 'ᅰ'],
	["nl", 'ᅱ'],
	["b",  'ᅲ'],
	["m",  'ᅳ'],
	["ml", 'ᅴ'],
	["l",  'ᅵ']
]);

var finals = new Map([
	["", ' '],
	["r",  'ᆨ'],
	["R",  'ᆩ'],
	["rt", 'ᆪ'],
	["s",  'ᆫ'],
	["sw", 'ᆬ'],
	["sg", 'ᆭ'],
	["e",  'ᆮ'],
	["f",  'ᆯ'],
	["fr", 'ᆰ'],
	["fa", 'ᆱ'],
	["fq", 'ᆲ'],
	["ft", 'ᆳ'],
	["fx", 'ᆴ'],
	["fv", 'ᆵ'],
	["fg", 'ᆶ'],
	["a",  'ᆷ'],
	["q",  'ᆸ'],
	["qt", 'ᆹ'],
	["t",  'ᆺ'],
	["T",  'ᆻ'],
	["d",  'ᆼ'],
	["w",  'ᆽ'],
	["c",  'ᆾ'],
	["z",  'ᆿ'],
	["x",  'ᇀ'],
	["v",  'ᇁ'],
	["g",  'ᇂ']
]);

// Enum for storing current state
var state = {
	"INITIAL": 1,
	"MEDIAL": 2,
	"FINAL": 3,
	"NONE": 4,
};
Object.freeze(state);

var currentStatus = state.INITIAL;
console.log("STATUS = " + currentStatus);

// Change the state for every new character inputted
function changeStatus(cs) {
	if (cs === state.INITIAL) {
		cs = state.MEDIAL;
	} else if (cs === state.MEDIAL) {
		cs = state.INITIAL;
	} else if (cs === state.FINAL) {
		cs = state.INITIAL;
	} else {
		cs = state.NONE;
	}

	return cs;
}

function calculate(a) {
	s = "";
	for (i=0; i < a.length; i++) {
		// Get current char
		var b = a.substring(i, i+1);
		var character = (currentStatus === state.INITIAL)
				? initials.get(b) : medials.get(b);
		console.log("CHAR = " + character + " STATUS = " + currentStatus);
		if (character === undefined) {
			character = b;
		}
		s += (character);
	}
	return s;
}

function update(e) {
	console.log("=================");

	// Get keycode of pressed key
	var keynum;
	if (window.event) { // IE
		keynum = e.keyCode;
	} else if (e.which) { // Netscape/Firefox/Opera
		keynum = e.which;
	}
	console.log(String.fromCharCode(keynum));

	//if (document.forms[0].hangulime.value==input)
	//	return;

	input = document.forms[0].hangulime.value;
	document.forms[0].hangulime.value = calculate(input);

	currentStatus = changeStatus(currentStatus);
}
