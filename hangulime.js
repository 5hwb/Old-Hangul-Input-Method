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
		cs = state.FINAL;
	} else if (cs === state.FINAL) {
		cs = state.INITIAL;
	} else {
		cs = state.NONE;
	}

	return cs;
}

function calculate(input, pressedKey, selStart) {
	var last3chars = input.substring(selStart-3, selStart);

	// Get current char
	var b = pressedKey;
	var character = (currentStatus === state.INITIAL)
			? initials.get(b)
			: (currentStatus === state.MEDIAL) ? medials.get(b)
			: (currentStatus === state.FINAL) ? finals.get(b)
			: initials.get(b);
	console.log("last3chars=" + last3chars + " PressedKey=" + b
			+ " CHAR=" + character
			+ " STATUS=" + currentStatus);
	// If no hangul letter in the maps were found, add original char
	if (character === undefined) {
		character = b;
	}

	// Insert character at cursor position
	var output = input.slice(0, selStart) + character + input.slice(selStart);
	console.log("INPUT =  '" + input + "'");
	console.log("OUTPUT = '" + output + "'");

	return output;
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

	var pressedKey = String.fromCharCode(keynum);
	console.log("Pressed Key: -" + keynum + "- " + pressedKey);

	// TODO for some reason, the selectionStart value (cursor position) is delayed by 1 keypress!
	// TODO find out why!
	var selStart = document.forms[0].hangulime.selectionStart;
	var selEnd = document.forms[0].hangulime.selectionEnd;
	console.log("START=" + selStart + " END=" + selEnd);

	// Disable inserting the char if it's an ASCII char
	if (keynum >= 32 && keynum <= 126) e.preventDefault();

	//if (document.forms[0].hangulime.value==input)
	//	return;

	// Do not calculate if backspace is pressed
	if (keynum != 8 && keynum != undefined) {
		input = document.forms[0].hangulime.value;
		document.forms[0].hangulime.value = calculate(input, pressedKey, selStart);
	}

	currentStatus = changeStatus(currentStatus);
}
