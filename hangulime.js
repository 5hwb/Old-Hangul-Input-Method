/**
 * Old Hangul IME
 * by Perry Hartono, 2018
 *
 * This is a script that turns a HTML Textarea into a Korean Hangul IME
 * capable of inserting archaic Hangul letters.
 */

/*======================================
=======FIXED STACK IMPLEMENTATION=======
======================================*/

/**
 * A stack data structure contains a fixed amount of elements.
 * If the stack is full, the oldest elements are overwritten by newly added elements
 */
function FixedStack(stackSize) {
	this.size = stackSize;
	this.top = -1;
	this.stack = new Array(stackSize);
}

// Push an item onto the top of the stack
FixedStack.prototype.push = function(item) {
	this.top = (this.top + 1) % this.size;
	this.stack[this.top] = item;
	return false;
}

// Get the 1st element (top) in the stack
FixedStack.prototype.getTop = function() {
	return this.stack[this.top];
}

// Get the nth added element in the stack
FixedStack.prototype.nthTop = function(n) {
	if (n >= 0 && n < this.size) {
		var nIndex = this.top - n;
		return this.stack[(nIndex % this.size + this.size) % this.size];
	}
	return undefined;
}

// Print the contents of the stack, starting with the oldest elements and ending with the last
FixedStack.prototype.toString = function() {
	var res = "";
	for (var i = 0; i > (-this.size); i--) {
		var iAdjusted = ((i + this.top) % this.size + this.size) % this.size;
		var disp = (this.stack[iAdjusted] != undefined) ? this.stack[iAdjusted] : "";
		res = disp + res;
	}
	//res += "]";
	return res;
}

// DEBUGGING ONLY: Print the contents of the stack starting with the most recently pushed one
FixedStack.prototype.showContents = function() {
	var res = "[";
	for (var i = 0; i > (-this.size); i--) {
		var iAdjusted = ((i + this.top) % this.size + this.size) % this.size;
		var disp = (this.stack[iAdjusted] != undefined) ? this.stack[iAdjusted] : "null";
		res += (disp + ",");
	}
	res += "]";
	return res;
}

/*======================================
==========JAMO IMPLEMENTATION===========
======================================*/

/*
 * A prototype that represents a Hangul letter (jamo) and its variant forms
 */
function Jamo(parent, letter1, letter2) {
	// Mechanism: if letter2 is not defined, the jamo being defined is a medial vowel.
	// If the last argument is defined, the jamo being defined is a consonant:
	// letter1 is the initial form and letter2 is the final form
	l2isDefined = (typeof letter2 !== "undefined");
	this.initial = (l2isDefined) ? letter1 : undefined; // Initial form
	this.medial = (!l2isDefined) ? letter1 : undefined; // Medial form
	this.final   = (l2isDefined) ? letter2 : undefined; // Final form
	this.parent = parent; // The parent of this jamo (if it's composed of multiple jamos)
	this.decomposed = undefined; // The decomposed form of this jamo
}

// Set the decomposed form of this Jamo
Jamo.prototype.setDecomposed = function(decomposed) {
	this.decomposed = decomposed;
}

// Check if this Jamo is composed of multiple Jamos
Jamo.prototype.hasMultipleJamo = function() {
	return (this.parent != undefined);
}

// (DEBUGGING ONLY) Display the contents of this Jamo
Jamo.prototype.toString = function() {
	var result = [];
	result.push(
		"{ini=" + this.initial,
		",med=" + this.medial,
		",fin=" + this.final,
		",decomp=" + this.decomposed,
		"}"
	);
	return result.join("");
}

/*======================================
========TESTING THE PROTOTYPES==========
======================================*/

// Test the FixedStack
function fixedStackTest() {
	var stacko = new FixedStack(5);
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("p");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("a");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("e");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("s");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("t");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("m");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("a");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
}

// Test the Jamo
function jamoTest() {
	var jamo_o = new Jamo(undefined, 'ᅩ');
	var jamo_oi = new Jamo(jamo_o, 'ᅬ');
	var jamo_oa = new Jamo(jamo_o, 'ᅪ');
	var jamo_r = new Jamo(undefined, 'ᄅ', 'ᆯ');
	var jamo_rs = new Jamo(jamo_r, undefined, 'ᆳ');
	var jamo_rp = new Jamo(jamo_r, undefined, 'ᆲ');
	console.log("JAMOTEST1! " + jamo_oa.medial + jamo_oa.parent.medial);
	console.log("OA is composed of Multiple Jamos? " + jamo_oa.hasMultipleJamo());
	console.log("O is composed of Multiple Jamos? " + jamo_o.hasMultipleJamo());
	console.log("JAMOTEST2! " + jamo_r.initial + jamo_r.final);
	console.log("JAMOTEST2! " + jamo_rs.final + jamo_rs.parent.final);
	console.log("RS is composed of Multiple Jamos? " + jamo_rs.hasMultipleJamo());
	console.log("RP is composed of Multiple Jamos? " + jamo_rp.hasMultipleJamo());
	console.log("R is composed of Multiple Jamos? " + jamo_r.hasMultipleJamo());
}

//fixedStackTest();
//jamoTest();

/*======================================
========MAP OF ALL HANGUL JAMOS=========
======================================*/

// Null jamo
var jamo_nil = undefined;

// Initials/finals
var jamo_g = new Jamo(jamo_nil, 'ᄀ', 'ᆨ');
var jamo_g_s = new Jamo(jamo_g, undefined, 'ᆪ'); jamo_g_s.setDecomposed("ᆨᄉ");
var jamo_kk = new Jamo(jamo_nil, 'ᄁ', 'ᆩ');
var jamo_n = new Jamo(jamo_nil, 'ᄂ', 'ᆫ');
var jamo_n_j = new Jamo(jamo_n, undefined, 'ᆬ'); jamo_n_j.setDecomposed("ᆫᄌ");
var jamo_n_h = new Jamo(jamo_n, undefined, 'ᆭ'); jamo_n_h.setDecomposed("ᆫᄒ");
var jamo_d = new Jamo(jamo_nil, 'ᄃ', 'ᆮ');
var jamo_tt = new Jamo(jamo_nil, 'ᄄ', undefined);
var jamo_r = new Jamo(jamo_nil, 'ᄅ', 'ᆯ');
var jamo_r_g = new Jamo(jamo_r, undefined, 'ᆰ'); jamo_r_g.setDecomposed("ᆯᄀ");
var jamo_r_m = new Jamo(jamo_r, undefined, 'ᆱ'); jamo_r_m.setDecomposed("ᆯᄆ");
var jamo_r_b = new Jamo(jamo_r, undefined, 'ᆲ'); jamo_r_b.setDecomposed("ᆯᄇ");
var jamo_r_s = new Jamo(jamo_r, undefined, 'ᆳ'); jamo_r_s.setDecomposed("ᆯᄉ");
var jamo_r_t = new Jamo(jamo_r, undefined, 'ᆴ'); jamo_r_t.setDecomposed("ᆯᄐ");
var jamo_r_p = new Jamo(jamo_r, undefined, 'ᆵ'); jamo_r_p.setDecomposed("ᆯᄑ");
var jamo_r_h = new Jamo(jamo_r, undefined, 'ᆶ'); jamo_r_h.setDecomposed("ᆯᄒ");
var jamo_m = new Jamo(jamo_nil, 'ᄆ', 'ᆷ');
var jamo_b = new Jamo(jamo_nil, 'ᄇ', 'ᆸ');
var jamo_b_s = new Jamo(jamo_b, undefined, 'ᆹ'); jamo_b_s.setDecomposed("ᆸᄉ");
var jamo_pp = new Jamo(jamo_nil, 'ᄈ', undefined);
var jamo_s = new Jamo(jamo_nil, 'ᄉ', 'ᆺ');
var jamo_ss = new Jamo(jamo_nil, 'ᄊ', 'ᆻ');
var jamo_ng = new Jamo(jamo_nil, 'ᄋ', 'ᆼ');
var jamo_j = new Jamo(jamo_nil, 'ᄌ', 'ᆽ');
var jamo_jj = new Jamo(jamo_nil, 'ᄍ', undefined);
var jamo_c = new Jamo(jamo_nil, 'ᄎ', 'ᆾ');
var jamo_k = new Jamo(jamo_nil, 'ᄏ', 'ᆿ');
var jamo_t = new Jamo(jamo_nil, 'ᄐ', 'ᇀ');
var jamo_p = new Jamo(jamo_nil, 'ᄑ', 'ᇁ');
var jamo_h = new Jamo(jamo_nil, 'ᄒ', 'ᇂ');

// Medials
var jamo_a = new Jamo(jamo_nil, 'ᅡ');
var jamo_ae = new Jamo(jamo_nil, 'ᅢ');
var jamo_ya = new Jamo(jamo_nil, 'ᅣ');
var jamo_yae = new Jamo(jamo_nil, 'ᅤ');
var jamo_eo = new Jamo(jamo_nil, 'ᅥ');
var jamo_e = new Jamo(jamo_nil, 'ᅦ');
var jamo_yeo = new Jamo(jamo_nil, 'ᅧ');
var jamo_ye = new Jamo(jamo_nil, 'ᅨ');
var jamo_o = new Jamo(jamo_nil, 'ᅩ');
var jamo_o_a = new Jamo(jamo_o, 'ᅪ');
var jamo_o_ae = new Jamo(jamo_o, 'ᅫ');
var jamo_o_i = new Jamo(jamo_o, 'ᅬ');
var jamo_yo = new Jamo(jamo_nil, 'ᅭ');
var jamo_u = new Jamo(jamo_nil, 'ᅮ');
var jamo_u_eo = new Jamo(jamo_u, 'ᅯ');
var jamo_u_e = new Jamo(jamo_u, 'ᅰ');
var jamo_u_i = new Jamo(jamo_u, 'ᅱ');
var jamo_yu = new Jamo(jamo_nil, 'ᅲ');
var jamo_eu = new Jamo(jamo_nil, 'ᅳ');
var jamo_eu_i = new Jamo(jamo_eu, 'ᅴ');
var jamo_i = new Jamo(jamo_nil, 'ᅵ');

// Initials (obsolete Hangul)
// TODO: Merge existing final forms with these initial forms!
/*
var jamo_g_d = new Jamo(jamo_nil, 'ᅚ', undefined);
var jamo_n_g = new Jamo(jamo_nil, 'ᄓ', undefined);
var jamo_n_n = new Jamo(jamo_nil, 'ᄔ', undefined);
var jamo_n_d = new Jamo(jamo_nil, 'ᄕ', undefined);
var jamo_n_b = new Jamo(jamo_nil, 'ᄖ', undefined);
var jamo_n_s = new Jamo(jamo_nil, 'ᅛ', undefined);
var jamo_n_j = new Jamo(jamo_nil, 'ᅜ', undefined);
var jamo_n_h = new Jamo(jamo_nil, 'ᅝ', undefined);
var jamo_d_r = new Jamo(jamo_nil, 'ᅞ', undefined);
var jamo_d_g = new Jamo(jamo_nil, 'ᄗ', undefined);
var jamo_r_n = new Jamo(jamo_nil, 'ᄘ', undefined);
var jamo_r_r = new Jamo(jamo_nil, 'ᄙ', undefined);
var jamo_r_h = new Jamo(jamo_nil, 'ᄚ', undefined);
var jamo_r_x = new Jamo(jamo_nil, 'ᄛ', undefined);
var jamo_m_b = new Jamo(jamo_nil, 'ᄜ', undefined);
var jamo_m_x = new Jamo(jamo_nil, 'ᄝ', undefined);
var jamo_b_g = new Jamo(jamo_nil, 'ᄞ', undefined);
var jamo_b_n = new Jamo(jamo_nil, 'ᄟ', undefined);
var jamo_b_d = new Jamo(jamo_nil, 'ᄠ', undefined);
var jamo_b_s = new Jamo(jamo_nil, 'ᄡ', undefined);
var jamo_b_s_g = new Jamo(jamo_nil, 'ᄢ', undefined);
var jamo_b_s_d = new Jamo(jamo_nil, 'ᄣ', undefined);
var jamo_b_s_b = new Jamo(jamo_nil, 'ᄤ', undefined);
var jamo_b_s_s = new Jamo(jamo_nil, 'ᄥ', undefined);
var jamo_b_s_j = new Jamo(jamo_nil, 'ᄦ', undefined);
var jamo_b_j = new Jamo(jamo_nil, 'ᄧ', undefined);
var jamo_b_c = new Jamo(jamo_nil, 'ᄨ', undefined);
var jamo_b_t = new Jamo(jamo_nil, 'ᄩ', undefined);
var jamo_b_p = new Jamo(jamo_nil, 'ᄪ', undefined);
var jamo_b_x = new Jamo(jamo_nil, 'ᄫ', undefined);
var jamo_pp_x = new Jamo(jamo_nil, 'ᄬ', undefined);
var jamo_s_g = new Jamo(jamo_nil, 'ᄭ', undefined);
var jamo_s_n = new Jamo(jamo_nil, 'ᄮ', undefined);
var jamo_s_d = new Jamo(jamo_nil, 'ᄯ', undefined);
var jamo_s_r = new Jamo(jamo_nil, 'ᄰ', undefined);
var jamo_s_m = new Jamo(jamo_nil, 'ᄱ', undefined);
var jamo_s_b = new Jamo(jamo_nil, 'ᄲ', undefined);
var jamo_s_b_g = new Jamo(jamo_nil, 'ᄳ', undefined);
var jamo_s_ng = new Jamo(jamo_nil, 'ᄵ', undefined);
var jamo_s_j = new Jamo(jamo_nil, 'ᄶ', undefined);
var jamo_s_c = new Jamo(jamo_nil, 'ᄷ', undefined);
var jamo_s_k = new Jamo(jamo_nil, 'ᄸ', undefined);
var jamo_s_t = new Jamo(jamo_nil, 'ᄹ', undefined);
var jamo_s_p = new Jamo(jamo_nil, 'ᄺ', undefined);
var jamo_s_h = new Jamo(jamo_nil, 'ᄻ', undefined);
var jamo_s_s_s = new Jamo(jamo_nil, 'ᄴ', undefined);
var jamo_ng_g = new Jamo(jamo_nil, 'ᅁ', undefined);
var jamo_ng_d = new Jamo(jamo_nil, 'ᅂ', undefined);
var jamo_ng_m = new Jamo(jamo_nil, 'ᅃ', undefined);
var jamo_ng_b = new Jamo(jamo_nil, 'ᅄ', undefined);
var jamo_ng_s = new Jamo(jamo_nil, 'ᅅ', undefined);
var jamo_ng_z = new Jamo(jamo_nil, 'ᅆ', undefined);
var jamo_ng_ng = new Jamo(jamo_nil, 'ᅇ', undefined);
var jamo_ng_j = new Jamo(jamo_nil, 'ᅈ', undefined);
var jamo_ng_c = new Jamo(jamo_nil, 'ᅉ', undefined);
var jamo_ng_t = new Jamo(jamo_nil, 'ᅊ', undefined);
var jamo_ng_p = new Jamo(jamo_nil, 'ᅋ', undefined);
var jamo_j_ng = new Jamo(jamo_nil, 'ᅍ', undefined);
var jamo_c_k = new Jamo(jamo_nil, 'ᅒ', undefined);
var jamo_c_h = new Jamo(jamo_nil, 'ᅓ', undefined);
var jamo_p_b = new Jamo(jamo_nil, 'ᅖ', undefined);
var jamo_p_x = new Jamo(jamo_nil, 'ᅗ', undefined);
var jamo_h_h = new Jamo(jamo_nil, 'ᅘ', undefined);

var jamo_s_left = new Jamo(jamo_nil, 'ᄼ', undefined);
var jamo_ss_left = new Jamo(jamo_nil, 'ᄽ', undefined);
var jamo_s_rite = new Jamo(jamo_nil, 'ᄾ', undefined);
var jamo_ss_rite = new Jamo(jamo_nil, 'ᄿ', undefined);
var jamo_z = new Jamo(jamo_nil, 'ᅀ', undefined);
var jamo_ng = new Jamo(jamo_nil, 'ᅌ', undefined);
var jamo_j_left = new Jamo(jamo_nil, 'ᅎ', undefined);
var jamo_jj_left = new Jamo(jamo_nil, 'ᅏ', undefined);
var jamo_j_rite = new Jamo(jamo_nil, 'ᅐ', undefined);
var jamo_jj_rite = new Jamo(jamo_nil, 'ᅑ', undefined);
var jamo_c_left = new Jamo(jamo_nil, 'ᅔ', undefined);
var jamo_c_rite = new Jamo(jamo_nil, 'ᅕ', undefined);
var jamo_q = new Jamo(jamo_nil, 'ᅙ', undefined);
*/

// Medials (obsolete Hangul)
// TODO: Implement Medials (obsolete Hangul)

// Finals (obsolete Hangul)
// TODO: Implement Finals (obsolete Hangul)

var jamoMap = new Map([
    ["r", jamo_g ],
    ["R", jamo_kk],
    ["s", jamo_n ],
    ["e", jamo_d ],
    ["E", jamo_tt],
    ["f", jamo_r ],
    ["a", jamo_m ],
    ["q", jamo_b ],
    ["Q", jamo_pp],
    ["t", jamo_s ],
    ["T", jamo_ss],
    ["d", jamo_ng],
    ["w", jamo_j ],
    ["W", jamo_jj],
    ["c", jamo_c ],
    ["z", jamo_k ],
    ["x", jamo_t ],
    ["v", jamo_p ],
    ["g", jamo_h ],

    ["k",  jamo_a  ],
    ["o",  jamo_ae ],
    ["i",  jamo_ya ],
    ["O",  jamo_yae],
    ["j",  jamo_eo ],
    ["p",  jamo_e  ],
    ["u",  jamo_yeo],
    ["P",  jamo_ye ],
    ["h",  jamo_o  ],
    ["hk", jamo_o_a ],
    ["ho", jamo_o_ae],
    ["hl", jamo_o_i ],
    ["y",  jamo_yo ],
    ["n",  jamo_u  ],
    ["nj", jamo_u_eo],
    ["np", jamo_u_e ],
    ["nl", jamo_u_i ],
    ["b",  jamo_yu ],
    ["m",  jamo_eu ],
    ["ml", jamo_eu_i],
    ["l",  jamo_i  ],

    ["rt", jamo_g_s],
    ["sw", jamo_n_j],
    ["sg", jamo_n_h],
    ["fr", jamo_r_g],
    ["fa", jamo_r_m],
    ["fq", jamo_r_b],
    ["ft", jamo_r_s],
    ["fx", jamo_r_t],
    ["fv", jamo_r_p],
    ["fg", jamo_r_h],
    ["qt", jamo_b_s],
]);

// Check if this char is a Hangul Jamo initial
function isInitial(c) {
	return ('\u1100' <= c && c <= '\u1112');
}
// Check if this char is a Hangul Jamo medial
function isMedial(c) {
	return ('\u1161' <= c && c <= '\u1175');
}
// Check if this char is a Hangul Jamo final
function isFinal(c) {
	return ('\u11A8' <= c && c <= '\u11C2');
}

// IME input string
var input = "";

// The last 2 keypresses (in ASCII format)
var num = 4;
var lastNPressedKeys = new FixedStack(num);
var lastNValidJamoKeypresses = new FixedStack(num);

// The last char before the cursor
var lastChar = undefined;

// Indicate if current character should be overridden (for inserting composite Hangul jamo)
var overrideCurrChar = false;

// The current selection positions
var selStart;
var selEnd;

// Convert the given final consonant input into an initial consonant
function convertFinToInit(previousJamoKeypress) {
	var jamoMapValue = jamoMap.get(previousJamoKeypress);

	if (jamoMapValue !== undefined) {
		console.log("FIN->INIT: All good. " + jamoMapValue.toString());
		if (jamoMapValue.decomposed !== undefined) {
			return jamoMapValue.decomposed;
		}
		return jamoMapValue.initial + "";
	} else {
		console.log("FIN->INIT: nothing was found FOR REAL");
		return undefined;
	}
}

// Get the next jamo to be inserted
function getNextJamo(jamoMapValue, lastChar) {
	// INITIAL
	if (jamoMapValue.initial !== undefined) {
		// Return final form if vowel precedes it
		if (isMedial(lastChar) && jamoMapValue.final !== undefined) {
			return jamoMapValue.final;
		}
		return jamoMapValue.initial;
	}
	// MEDIAL
	else if (jamoMapValue.medial !== undefined) {
		return jamoMapValue.medial;
	}
	// FINAL
	else if (jamoMapValue.final !== undefined) {
		return jamoMapValue.final;
	}
	else {
		return undefined;
	}
}

// Calculate the next Hangul jamo to insert/remove
function calculate(input, pressedKey, thisObject) {
	var output = "";
	overrideCurrChar = false;

	// Add the pressed key to the fixed stack of previous keypresses
	lastNPressedKeys.push(pressedKey);

	// Last character before the cursor in the input string
	lastChar = input.substring(0, selStart).charAt(selStart-1);

	// Get current char, scanning for trigraphs first before
	// narrowing down the search
	for (var c = num; c > 0; c--) {
		var b = lastNPressedKeys.toString().substring(num-c, num);
		var jamoMapValue = jamoMap.get(b);
		var character = undefined;
		console.log("b=" + b + " jamoMapValue=" + jamoMapValue);

		if (jamoMapValue === undefined) {
			continue;
		}

		// Get the next jamo to be inserted
		character = getNextJamo(jamoMapValue, lastChar);
		console.log("lastChar" + lastChar + " PressedKey=" + b
				+ " CHAR=" + character
				+ " lastNPressedKeys=" + lastNPressedKeys.toString()
				+ " lastNValidJamoKeypresses=" + lastNValidJamoKeypresses.showContents()
				+ " isIni()=" + isInitial(character)
				+ " isMed()=" + isMedial(character)
				+ " isFin()=" + isFinal(character));

		// Exit the loop if a valid Jamo object is found
		if (character !== undefined) {
			overrideCurrChar = jamoMapValue.hasMultipleJamo();
			lastNValidJamoKeypresses.push(b);
			console.log(" OVERRIDE=" + overrideCurrChar);
			break;
		}
	}

	// Check if the last jamo needs to change from final to initial form
	// or a multi-consonant cluster needs to be broken up between 2 syllables
	if (isFinal(lastChar) && isMedial(character)) {
		var newChar = convertFinToInit(lastNValidJamoKeypresses.nthTop(1));
		console.log("this fincon needs to be replaced with initcon NOW! " + newChar);

		// If so, replace it
		input = input.slice(0, selStart-1) + newChar + input.slice(selStart);

		// Increment cursor if the replacement is longer than 1
		if (newChar.length > 1) {
			selStart++;
		}
	}

	// Set character as the original keypress if no valid Jamo entry was found
	if (character === undefined) {
		character = pressedKey;
		lastNValidJamoKeypresses.push(undefined);
	}

	// Insert character at cursor position
	output = (overrideCurrChar)
			? input.slice(0, selStart-1) + character + input.slice(selStart)
			: input.slice(0, selStart) + character + input.slice(selStart);
	console.log("LAST CHAR = " + input.charAt(selStart-1));
	console.log("INPUT =  '" + input + "'");
	console.log("OUTPUT = '" + output + "'");

	return output;
}

// Get all input keypresses
function receiveKeypress(e, thisObject) {
	console.log("=================");

	// Get keycode of pressed key
	var keynum;
	if (window.event) { // IE
		keynum = e.keyCode;
	} else if (e.which) { // Netscape/Firefox/Opera
		keynum = e.which;
	}

	// Get the pressed key
	var pressedKey = String.fromCharCode(keynum);
	console.log("Pressed Key: -" + keynum + "- " + pressedKey);

	// Get the current cursor position
	selStart = thisObject.selectionStart;
	selEnd = thisObject.selectionEnd;
	console.log("START=" + selStart + " END=" + selEnd);

	// Disable inserting the char if it's an ASCII char or the Enter key
	if (keynum == 13 || (keynum >= 32 && keynum <= 126)) e.preventDefault();

	// Calculate the next Hangul jamo to be inserted, except if backspace is pressed
	if (keynum != 8 && keynum != undefined) {
		input = thisObject.value;
		thisObject.value = calculate(input, pressedKey, thisObject);

		// Reset cursor to previously known position
		var incrementAmount = (overrideCurrChar) ? 0 : 1;
		thisObject.selectionEnd = selStart + incrementAmount;
	}
}
