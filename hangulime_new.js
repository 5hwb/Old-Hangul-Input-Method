/**
 * Old Hangul IME
 * by Perry Hartono, 2021
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

//fixedStackTest();
//jamoTest();

/*======================================
========MAP OF ALL HANGUL JAMOS=========
======================================*/

/**
 * GUIDE TO JAMO NAMES
 * All names use the standard Revised Romanisation of Korean, with a few exceptions:
 * > ㄹ is always transliterated to 'r', never 'l'
 * > ㅇ is transliterated 'x' as it functions as a component of other jamos
 * > If a jamo letter is made up of other jamos, its name is composed of the names
 *   of the component jamos, separated by an underscore
 */

// Null jamo
var jamo_nil = undefined;

// Initials/finals
// TODO

// Medials
// TODO


// Initials (obsolete Hangul)
// TODO

// Medials (obsolete Hangul)
// TODO

// Finals (obsolete Hangul)
// TODO

/*======================================
=========OLD HANGUL IME LOGIC===========
======================================*/
// TODO: Implement [F] key, indicates that any consonants typed after it are for the next syllable
// TODO: Fix final consonant clusters becoming initial clusters

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

// Check if this char is a Hangul Jamo initial
function isInitial(c) {
	return ('\u1100' <= c && c <= '\u115F');
}
// Check if this char is a Hangul Jamo medial
function isMedial(c) {
	return ('\u1161' <= c && c <= '\u11A7');
}
// Check if this char is a Hangul Jamo final
function isFinal(c) {
	return ('\u11A8' <= c && c <= '\u11FF');
}

// Get all input keypresses
function receiveKeypress(e, context) {
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
	selStart = context.selectionStart;
	selEnd = context.selectionEnd;
	console.log("START=" + selStart + " END=" + selEnd);

	// Disable inserting the char if it's an ASCII char or the Enter key
	if (keynum == 13 || (keynum >= 32 && keynum <= 126)) e.preventDefault();

	// Calculate the next Hangul jamo to be inserted, except if backspace is pressed
	if (keynum != 8 && keynum != undefined) {
		input = context.value;
		//context.value = calculate(input, pressedKey, context);

		// Reset cursor to previously known position
		var incrementAmount = (overrideCurrChar) ? 0 : 1;
		context.selectionEnd = selStart + incrementAmount;
	}
}

function init() {
  // Add event listener to Old Hangul IME textarea
  var hangulInput = document.getElementById("hangulime");
  hangulInput.addEventListener("keypress", function(event) {
    receiveKeypress(event, this);
  }, true);
}
