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

// Clear all elements in the stack
FixedStack.prototype.clear = function() {
	this.top = -1;
	this.stack = new Array(this.size);
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

// some constants
const JAMO_INITIAL = 0;
const JAMO_MEDIAL = 1;
const JAMO_FINAL = 2;

/*
 * A prototype that represents a Hangul letter (jamo) and its variant forms
 */
function Jamo(parent, type, letter, decomposed) {
	this.parent = parent; // The parent of this jamo (if it's composed of multiple jamos)
	this.type = type; // Jamo type (int): initial = 0, medial = 1, final = 2
	this.letter = letter; // Jamo letter
	this.decomposed = decomposed; // The decomposed form of this jamo
}

// Check if this Jamo is composed of multiple Jamos
Jamo.prototype.hasMultipleJamo = function() {
	return (this.parent != undefined);
}

// (DEBUGGING ONLY) Display the contents of this Jamo
Jamo.prototype.toString = function() {
	var result = [];
	result.push(
		"{ parent=" + ((this.parent == undefined) ? "NULL" : this.parent.letter),
		", type=" + this.type,
		", letter=" + this.letter,
		", decomp=" + this.decomposed,
		" }"
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
	
	// Clear the stack
	stacko.clear();
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("g");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("l");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
	stacko.push("o");
	console.log("STACKO TOP = " + stacko.getTop() + " " + stacko.toString());
}

function jamoTest() {
  var jamo_r = new Jamo(undefined, JAMO_INITIAL, "ᄅ", "");
  var jamo_rr = new Jamo(jamo_r, JAMO_INITIAL, "ᄙ", "");
  console.log("jamo_r: " + jamo_r.toString());
  console.log("jamo_rr: " + jamo_rr.toString());
}

/*======================================
========HANGUL JAMO DEFINITIONS=========
======================================*/

/**
 * GUIDE TO JAMO NAMES
 * All names use the standard Revised Romanisation of Korean, with a few exceptions:
 * > ㄹ is always transliterated to 'r', never 'l'
 * > ㅇ is transliterated 'x' as it functions as a component of other jamos
 * > ᅀ is transliterated 'z'
 * > ᆞ (arae-a) is transliterated 'v'
 * > If a jamo letter is made up of other jamos, its name is composed of the names
 *   of the component jamos, separated by an underscore
 */

// Null jamo
var jamo_nil = undefined;

// INITIALS
var jamo_init_g       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄀ', undefined);
var jamo_init_gg      = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄁ', undefined);
var jamo_init_n       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄂ', undefined);
var jamo_init_d       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄃ', undefined);
var jamo_init_dd      = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄄ', undefined);
var jamo_init_r       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄅ', undefined);
var jamo_init_m       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄆ', undefined);
var jamo_init_b       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄇ', undefined);
var jamo_init_bb      = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄈ', undefined);
var jamo_init_s       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄉ', undefined);
var jamo_init_ss      = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄊ', undefined);
var jamo_init_x       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄋ', undefined);
var jamo_init_j       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄌ', undefined);
var jamo_init_jj      = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄍ', undefined);
var jamo_init_c       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄎ', undefined);
var jamo_init_k       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄏ', undefined);
var jamo_init_t       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄐ', undefined);
var jamo_init_p       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄑ', undefined);
var jamo_init_h       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄒ', undefined);
var jamo_init_s_left  = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄼ', undefined);
var jamo_init_s_rite  = new Jamo(jamo_nil, JAMO_INITIAL, 'ᄾ', undefined);
var jamo_init_z       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅀ', undefined);
var jamo_init_ng      = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅌ', undefined);
var jamo_init_j_left  = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅎ', undefined);
var jamo_init_j_rite  = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅐ', undefined);
var jamo_init_c_left  = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅔ', undefined);
var jamo_init_c_rite  = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅕ', undefined);
var jamo_init_q       = new Jamo(jamo_nil, JAMO_INITIAL, 'ᅙ', undefined);

var jamo_init_ss_left = new Jamo(jamo_init_s_left, JAMO_INITIAL, 'ᄽ', undefined);
var jamo_init_ss_rite = new Jamo(jamo_init_s_rite, JAMO_INITIAL, 'ᄿ', undefined);
var jamo_init_jj_left = new Jamo(jamo_init_j_left, JAMO_INITIAL, 'ᅏ', undefined);
var jamo_init_jj_rite = new Jamo(jamo_init_j_rite, JAMO_INITIAL, 'ᅑ', undefined);

// INITIAL CLUSTERS
var jamo_init_g_d  = new Jamo(jamo_init_g,  JAMO_INITIAL, 'ᅚ', undefined);
var jamo_init_n_g  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᄓ', undefined);
var jamo_init_n_n  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᄔ', undefined);
var jamo_init_n_d  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᄕ', undefined);
var jamo_init_n_b  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᄖ', undefined);
var jamo_init_n_s  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᅛ', undefined);
var jamo_init_n_j  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᅜ', undefined);
var jamo_init_n_h  = new Jamo(jamo_init_n,  JAMO_INITIAL, 'ᅝ', undefined);
var jamo_init_d_g  = new Jamo(jamo_init_d,  JAMO_INITIAL, 'ᄗ', undefined);
var jamoinit__d_r  = new Jamo(jamo_init_d,  JAMO_INITIAL, 'ᅞ', undefined);
var jamo_init_r_n  = new Jamo(jamo_init_r,  JAMO_INITIAL, 'ᄘ', undefined);
var jamo_init_r_r  = new Jamo(jamo_init_r,  JAMO_INITIAL, 'ᄙ', undefined);
var jamo_init_r_h  = new Jamo(jamo_init_r,  JAMO_INITIAL, 'ᄚ', undefined);
var jamo_init_r_S  = new Jamo(jamo_init_r,  JAMO_INITIAL, 'ᄛ', undefined);
var jamo_init_m_b  = new Jamo(jamo_init_m,  JAMO_INITIAL, 'ᄜ', undefined);
var jamo_init_m_S  = new Jamo(jamo_init_m,  JAMO_INITIAL, 'ᄝ', undefined);
var jamo_init_b_g  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄞ', undefined);
var jamo_init_b_n  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄟ', undefined);
var jamo_init_b_d  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄠ', undefined);
var jamo_init_b_s  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄡ', undefined);
var jamo_init_b_j  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄧ', undefined);
var jamo_init_b_c  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄨ', undefined);
var jamo_init_b_t  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄩ', undefined);
var jamo_init_b_p  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄪ', undefined);
var jamo_init_b_S  = new Jamo(jamo_init_b,  JAMO_INITIAL, 'ᄫ', undefined);
var jamo_init_bb_S = new Jamo(jamo_init_bb, JAMO_INITIAL, 'ᄬ', undefined);
var jamo_init_s_g  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄭ', undefined);
var jamo_init_s_n  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄮ', undefined);
var jamo_init_s_d  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄯ', undefined);
var jamo_init_s_r  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄰ', undefined);
var jamo_init_s_m  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄱ', undefined);
var jamo_init_s_b  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄲ', undefined);
var jamo_init_s_x  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄵ', undefined);
var jamo_init_s_j  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄶ', undefined);
var jamo_init_s_c  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄷ', undefined);
var jamo_init_s_k  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄸ', undefined);
var jamo_init_s_t  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄹ', undefined);
var jamo_init_s_p  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄺ', undefined);
var jamo_init_s_h  = new Jamo(jamo_init_s,  JAMO_INITIAL, 'ᄻ', undefined);
var jamo_init_ss_s = new Jamo(jamo_init_ss, JAMO_INITIAL, 'ᄴ', undefined);
var jamo_init_x_g  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅁ', undefined);
var jamo_init_x_d  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅂ', undefined);
var jamo_init_x_m  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅃ', undefined);
var jamo_init_x_b  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅄ', undefined);
var jamo_init_x_s  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅅ', undefined);
var jamo_init_x_z  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅆ', undefined);
var jamo_init_x_x  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅇ', undefined);
var jamo_init_x_j  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅈ', undefined);
var jamo_init_x_c  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅉ', undefined);
var jamo_init_x_t  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅊ', undefined);
var jamo_init_x_p  = new Jamo(jamo_init_x,  JAMO_INITIAL, 'ᅋ', undefined);
var jamo_init_j_x  = new Jamo(jamo_init_j,  JAMO_INITIAL, 'ᅍ', undefined);
var jamo_init_c_k  = new Jamo(jamo_init_c,  JAMO_INITIAL, 'ᅒ', undefined);
var jamo_init_c_h  = new Jamo(jamo_init_c,  JAMO_INITIAL, 'ᅓ', undefined);
var jamo_init_p_b  = new Jamo(jamo_init_p,  JAMO_INITIAL, 'ᅖ', undefined);
var jamo_init_p_S  = new Jamo(jamo_init_p,  JAMO_INITIAL, 'ᅗ', undefined);
var jamo_init_h_h  = new Jamo(jamo_init_h,  JAMO_INITIAL, 'ᅘ', undefined);

var jamo_init_b_s_g = new Jamo(jamo_init_b_s, JAMO_INITIAL, 'ᄢ', undefined);
var jamo_init_b_s_d = new Jamo(jamo_init_b_s, JAMO_INITIAL, 'ᄣ', undefined);
var jamo_init_b_s_b = new Jamo(jamo_init_b_s, JAMO_INITIAL, 'ᄤ', undefined);
var jamo_init_b_s_s = new Jamo(jamo_init_b_s, JAMO_INITIAL, 'ᄥ', undefined);
var jamo_init_b_s_j = new Jamo(jamo_init_b_s, JAMO_INITIAL, 'ᄦ', undefined);
var jamo_init_s_b_g = new Jamo(jamo_init_s_b, JAMO_INITIAL, 'ᄳ', undefined);

// MEDIALS
var jamo_med_a   = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅡ', undefined);
var jamo_med_ae  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅢ', undefined);
var jamo_med_ya  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅣ', undefined);
var jamo_med_yae = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅤ', undefined);
var jamo_med_eo  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅥ', undefined);
var jamo_med_e   = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅦ', undefined);
var jamo_med_yeo = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅧ', undefined);
var jamo_med_ye  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅨ', undefined);
var jamo_med_o   = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅩ', undefined);
var jamo_med_yo  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅭ', undefined);
var jamo_med_u   = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅮ', undefined);
var jamo_med_yu  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅲ', undefined);
var jamo_med_eu  = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅳ', undefined);
var jamo_med_i   = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᅵ', undefined);
var jamo_med_v   = new Jamo(jamo_nil, JAMO_MEDIAL, 'ᆞ', undefined);

// MEDIAL CLUSTERS
var jamo_med_a_o    = new Jamo(jamo_med_a,   JAMO_MEDIAL, 'ᅶ', undefined);
var jamo_med_a_u    = new Jamo(jamo_med_a,   JAMO_MEDIAL, 'ᅷ', undefined);
var jamo_med_a_eu   = new Jamo(jamo_med_a,   JAMO_MEDIAL, 'ᆣ', undefined);
var jamo_med_ya_o   = new Jamo(jamo_med_ya,  JAMO_MEDIAL, 'ᅸ', undefined);
var jamo_med_ya_yo  = new Jamo(jamo_med_ya,  JAMO_MEDIAL, 'ᅹ', undefined);
var jamo_med_ya_u   = new Jamo(jamo_med_ya,  JAMO_MEDIAL, 'ᆤ', undefined);
var jamo_med_eo_o   = new Jamo(jamo_med_eo,  JAMO_MEDIAL, 'ᅺ', undefined);
var jamo_med_eo_u   = new Jamo(jamo_med_eo,  JAMO_MEDIAL, 'ᅻ', undefined);
var jamo_med_eo_eu  = new Jamo(jamo_med_eo,  JAMO_MEDIAL, 'ᅼ', undefined);
var jamo_med_yeo_ya = new Jamo(jamo_med_yeo, JAMO_MEDIAL, 'ᆥ', undefined);
var jamo_med_yeo_o  = new Jamo(jamo_med_yeo, JAMO_MEDIAL, 'ᅽ', undefined);
var jamo_med_yeo_u  = new Jamo(jamo_med_yeo, JAMO_MEDIAL, 'ᅾ', undefined);
var jamo_med_o_a    = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᅪ', undefined);
var jamo_med_o_ae   = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᅫ', undefined);
var jamo_med_o_i    = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᅬ', undefined);
var jamo_med_o_eo   = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᅿ', undefined);
var jamo_med_o_e    = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᆀ', undefined);
var jamo_med_o_ye   = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᆁ', undefined);
var jamo_med_o_o    = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᆂ', undefined);
var jamo_med_o_u    = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᆃ', undefined);
var jamo_med_o_ya   = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᆦ', undefined);
var jamo_med_o_yae  = new Jamo(jamo_med_o,   JAMO_MEDIAL, 'ᆧ', undefined);
var jamo_med_yo_ya  = new Jamo(jamo_med_yo,  JAMO_MEDIAL, 'ᆄ', undefined);
var jamo_med_yo_yae = new Jamo(jamo_med_yo,  JAMO_MEDIAL, 'ᆅ', undefined);
var jamo_med_yo_yeo = new Jamo(jamo_med_yo,  JAMO_MEDIAL, 'ᆆ', undefined);
var jamo_med_yo_o   = new Jamo(jamo_med_yo,  JAMO_MEDIAL, 'ᆇ', undefined);
var jamo_med_yo_i   = new Jamo(jamo_med_yo,  JAMO_MEDIAL, 'ᆈ', undefined);
var jamo_med_u_eo   = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᅯ', undefined);
var jamo_med_u_e    = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᅰ', undefined);
var jamo_med_u_i    = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᅱ', undefined);
var jamo_med_u_a    = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᆉ', undefined);
var jamo_med_u_ae   = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᆊ', undefined);
var jamo_med_u_ye   = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᆌ', undefined);
var jamo_med_u_u    = new Jamo(jamo_med_u,   JAMO_MEDIAL, 'ᆍ', undefined);
var jamo_med_yu_a   = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆎ', undefined);
var jamo_med_yu_eo  = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆏ', undefined);
var jamo_med_yu_e   = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆐ', undefined);
var jamo_med_yu_eo  = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆑ', undefined);
var jamo_med_yu_ye  = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆒ', undefined);
var jamo_med_yu_u   = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆓ', undefined);
var jamo_med_yu_i   = new Jamo(jamo_med_yu,  JAMO_MEDIAL, 'ᆔ', undefined);
var jamo_med_eu_i   = new Jamo(jamo_med_eu,  JAMO_MEDIAL, 'ᅴ', undefined);
var jamo_med_eu_u   = new Jamo(jamo_med_eu,  JAMO_MEDIAL, 'ᆕ', undefined);
var jamo_med_eu_eu  = new Jamo(jamo_med_eu,  JAMO_MEDIAL, 'ᆖ', undefined);
var jamo_med_i_a    = new Jamo(jamo_med_i,   JAMO_MEDIAL, 'ᆘ', undefined);
var jamo_med_i_ya   = new Jamo(jamo_med_i,   JAMO_MEDIAL, 'ᆙ', undefined);
var jamo_med_i_o    = new Jamo(jamo_med_i,   JAMO_MEDIAL, 'ᆚ', undefined);
var jamo_med_i_u    = new Jamo(jamo_med_i,   JAMO_MEDIAL, 'ᆛ', undefined);
var jamo_med_i_eu   = new Jamo(jamo_med_i,   JAMO_MEDIAL, 'ᆜ', undefined);
var jamo_med_i_v    = new Jamo(jamo_med_i,   JAMO_MEDIAL, 'ᆝ', undefined);
var jamo_med_v_eo   = new Jamo(jamo_med_v,   JAMO_MEDIAL, 'ᆟ', undefined);
var jamo_med_v_u    = new Jamo(jamo_med_v,   JAMO_MEDIAL, 'ᆠ', undefined);
var jamo_med_v_i    = new Jamo(jamo_med_v,   JAMO_MEDIAL, 'ᆡ', undefined);
var jamo_med_v_v    = new Jamo(jamo_med_v,   JAMO_MEDIAL, 'ᆢ', undefined);

var jamo_med_u_eo_eu = new Jamo(jamo_med_u_eo, JAMO_MEDIAL, 'ᆋ', undefined);
var jamo_med_eu_i_u  = new Jamo(jamo_med_eu_i, JAMO_MEDIAL, 'ᆗ', undefined);

// FINALS
var jamo_fin_g  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆨ', "ᄀ");
var jamo_fin_gg = new Jamo(jamo_nil, JAMO_FINAL, 'ᆩ', "ᄁ");
var jamo_fin_n  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆫ', "ᄂ");
var jamo_fin_d  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆮ', "ᄃ");
var jamo_fin_r  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆯ', "ᄅ");
var jamo_fin_m  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆷ', "ᄆ");
var jamo_fin_b  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆸ', "ᄇ");
var jamo_fin_s  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆺ', "ᄉ");
var jamo_fin_ss = new Jamo(jamo_nil, JAMO_FINAL, 'ᆻ', "ᄊ");
var jamo_fin_x  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆼ', "ᄋ");
var jamo_fin_j  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆽ', "ᄌ");
var jamo_fin_c  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆾ', "ᄎ");
var jamo_fin_k  = new Jamo(jamo_nil, JAMO_FINAL, 'ᆿ', "ᄏ");
var jamo_fin_t  = new Jamo(jamo_nil, JAMO_FINAL, 'ᇀ', "ᄐ");
var jamo_fin_p  = new Jamo(jamo_nil, JAMO_FINAL, 'ᇁ', "ᄑ");
var jamo_fin_h  = new Jamo(jamo_nil, JAMO_FINAL, 'ᇂ', "ᄒ");
var jamo_fin_z  = new Jamo(jamo_nil, JAMO_FINAL, 'ᇫ', "ᅀ");
var jamo_fin_ng = new Jamo(jamo_nil, JAMO_FINAL, 'ᇰ', "ᅌ");
var jamo_fin_q  = new Jamo(jamo_nil, JAMO_FINAL, 'ᇹ', "ᅙ");

// FINAL CLUSTERS
var jamo_fin_g_r   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᇃ', "ᆨᄅ");
var jamo_fin_g_s   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᆪ', "ᆨᄉ");
var jamo_fin_g_n   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᇺ', "ᆨᄂ");
var jamo_fin_g_b   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᇻ', "ᆨᄇ");
var jamo_fin_g_c   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᇼ', "ᆨᄎ");
var jamo_fin_g_k   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᇽ', "ᆨᄏ");
var jamo_fin_g_h   = new Jamo(jamo_fin_g,  JAMO_FINAL, 'ᇾ', "ᆨᄒ");
var jamo_fin_n_j   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᆬ', "ᆫᄌ");
var jamo_fin_n_h   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᆭ', "ᆫᄒ");
var jamo_fin_n_g   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᇅ', "ᆫᄀ");
var jamo_fin_n_d   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᇆ', "ᆫᄃ");
var jamo_fin_n_s   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᇇ', "ᆫᄉ");
var jamo_fin_n_z   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᇈ', "ᆫᅀ");
var jamo_fin_n_t   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᇉ', "ᆫᄐ");
var jamo_fin_n_n   = new Jamo(jamo_fin_n,  JAMO_FINAL, 'ᇿ', "ᆫᄂ");
var jamo_fin_d_g   = new Jamo(jamo_fin_d,  JAMO_FINAL, 'ᇊ', "ᆮᄀ");
var jamo_fin_d_r   = new Jamo(jamo_fin_d,  JAMO_FINAL, 'ᇋ', "ᆮᄅ");
var jamo_fin_r_g   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆰ', "ᆯᄀ");
var jamo_fin_r_m   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆱ', "ᆯᄆ");
var jamo_fin_r_b   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆲ', "ᆯᄇ");
var jamo_fin_r_s   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆳ', "ᆯᄉ");
var jamo_fin_r_t   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆴ', "ᆯᄐ");
var jamo_fin_r_p   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆵ', "ᆯᄑ");
var jamo_fin_r_h   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᆶ', "ᆯᄒ");
var jamo_fin_r_n   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᇍ', "ᆯᄂ");
var jamo_fin_r_d   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᇎ', "ᆯᄃ");
var jamo_fin_r_r   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᇐ', "ᆯᄅ");
var jamo_fin_r_z   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᇗ', "ᆯᅀ");
var jamo_fin_r_k   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᇘ', "ᆯᄏ");
var jamo_fin_r_q   = new Jamo(jamo_fin_r,  JAMO_FINAL, 'ᇙ', "ᆯᅙ");
var jamo_fin_m_g   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇚ', "ᆷᄀ");
var jamo_fin_m_r   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇛ', "ᆷᄅ");
var jamo_fin_m_b   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇜ', "ᆷᄇ");
var jamo_fin_m_s   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇝ', "ᆷᄉ");
var jamo_fin_m_z   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇟ', "ᆷᅀ");
var jamo_fin_m_c   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇠ', "ᆷᄎ");
var jamo_fin_m_h   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇡ', "ᆷᄒ");
var jamo_fin_m_S   = new Jamo(jamo_fin_m,  JAMO_FINAL, 'ᇢ', "ᄝ");
var jamo_fin_b_s   = new Jamo(jamo_fin_b,  JAMO_FINAL, 'ᆹ', "ᆸᄉ");
var jamo_fin_b_r   = new Jamo(jamo_fin_b,  JAMO_FINAL, 'ᇣ', "ᆸᄅ");
var jamo_fin_b_p   = new Jamo(jamo_fin_b,  JAMO_FINAL, 'ᇤ', "ᆸᄑ");
var jamo_fin_b_h   = new Jamo(jamo_fin_b,  JAMO_FINAL, 'ᇥ', "ᆸᄒ");
var jamo_fin_b_S   = new Jamo(jamo_fin_b,  JAMO_FINAL, 'ᇦ', "ᄫ");
var jamo_fin_s_g   = new Jamo(jamo_fin_s,  JAMO_FINAL, 'ᇧ', "ᆺᄀ");
var jamo_fin_s_d   = new Jamo(jamo_fin_s,  JAMO_FINAL, 'ᇨ', "ᆺᄃ");
var jamo_fin_s_r   = new Jamo(jamo_fin_s,  JAMO_FINAL, 'ᇩ', "ᆺᄅ");
var jamo_fin_s_b   = new Jamo(jamo_fin_s,  JAMO_FINAL, 'ᇪ', "ᆺᄇ");
var jamo_fin_x_g   = new Jamo(jamo_fin_x,  JAMO_FINAL, 'ᇬ', "ᆼᄀ");
var jamo_fin_x_x   = new Jamo(jamo_fin_x,  JAMO_FINAL, 'ᇮ', "ᆼᄋ");
var jamo_fin_x_k   = new Jamo(jamo_fin_x,  JAMO_FINAL, 'ᇯ', "ᆼᄏ");
var jamo_fin_p_b   = new Jamo(jamo_fin_p,  JAMO_FINAL, 'ᇳ', "ᇁᄇ");
var jamo_fin_p_S   = new Jamo(jamo_fin_p,  JAMO_FINAL, 'ᇴ', "ᅗ");
var jamo_fin_h_n   = new Jamo(jamo_fin_h,  JAMO_FINAL, 'ᇵ', "ᇂᄂ");
var jamo_fin_h_r   = new Jamo(jamo_fin_h,  JAMO_FINAL, 'ᇶ', "ᇂᄅ");
var jamo_fin_h_m   = new Jamo(jamo_fin_h,  JAMO_FINAL, 'ᇷ', "ᇂᄆ");
var jamo_fin_h_b   = new Jamo(jamo_fin_h,  JAMO_FINAL, 'ᇸ', "ᇂᄇ");
var jamo_fin_ng_s  = new Jamo(jamo_fin_ng, JAMO_FINAL, 'ᇱ', "ᇰᄉ");
var jamo_fin_ng_z  = new Jamo(jamo_fin_ng, JAMO_FINAL, 'ᇲ', "ᇰᅀ");

var jamo_fin_g_s_g  = new Jamo(jamo_fin_g_s, JAMO_FINAL, 'ᇄ', "ᆪᄀ");
var jamo_fin_r_g_s  = new Jamo(jamo_fin_r_g, JAMO_FINAL, 'ᇌ', "ᆰᄉ");
var jamo_fin_r_m_g  = new Jamo(jamo_fin_r_m, JAMO_FINAL, 'ᇑ', "ᆱᄀ");
var jamo_fin_r_m_s  = new Jamo(jamo_fin_r_m, JAMO_FINAL, 'ᇒ', "ᆱᄉ");
var jamo_fin_r_b_s  = new Jamo(jamo_fin_r_b, JAMO_FINAL, 'ᇓ', "ᆲᄉ");
var jamo_fin_r_b_h  = new Jamo(jamo_fin_r_b, JAMO_FINAL, 'ᇔ', "ᆲᄒ");
var jamo_fin_r_b_S  = new Jamo(jamo_fin_r_b, JAMO_FINAL, 'ᇕ', "ᆯᄫ");
var jamo_fin_r_s_s  = new Jamo(jamo_fin_r_s, JAMO_FINAL, 'ᇖ', "ᆳᄉ");
var jamo_fin_r_d_h  = new Jamo(jamo_fin_r_d, JAMO_FINAL, 'ᇏ', "ᇎᄒ");
var jamo_fin_m_s_s  = new Jamo(jamo_fin_m_s, JAMO_FINAL, 'ᇞ', "ᇝᄉ");
var jamo_fin_x_g_g  = new Jamo(jamo_fin_x_g, JAMO_FINAL, 'ᇭ', "ᇬᄀ");

////////////////////
// JAMO MAPPINGS  //
////////////////////

var map_jamo_init = new Map([
	// INITIALS
	["r", jamo_init_g],
	["R", jamo_init_gg],
	["s", jamo_init_n],
	["e", jamo_init_d],
	["E", jamo_init_dd],
	["f", jamo_init_r],
	["a", jamo_init_m],
	["q", jamo_init_b],
	["Q", jamo_init_bb],
	["t", jamo_init_s],
	["T", jamo_init_ss],
	["d", jamo_init_x],
	["w", jamo_init_j],
	["W", jamo_init_jj],
	["C", jamo_init_c],
	["z", jamo_init_k],
	["x", jamo_init_t],
	["v", jamo_init_p],
	["g", jamo_init_h],
	["Z", jamo_init_s_left],
	["X", jamo_init_s_rite],
	["A", jamo_init_z],
	["D", jamo_init_ng],
	["C", jamo_init_j_left],
	["V", jamo_init_j_rite],
	["B", jamo_init_c_left],
	["N", jamo_init_c_rite],
	["G", jamo_init_q],

	["ZZ", jamo_init_ss_left],
	["XX", jamo_init_ss_rite],
	["CC", jamo_init_jj_left],
	["VV", jamo_init_jj_rite],

	// INITIAL CLUSTERS
	["re", jamo_init_g_d],
	["sr", jamo_init_n_g],
	["ss", jamo_init_n_n],
	["se", jamo_init_n_d],
	["sq", jamo_init_n_b],
	["st", jamo_init_n_s],
	["sw", jamo_init_n_j],
	["sg", jamo_init_n_h],
	["er", jamo_init_d_g],
	["ef", jamoinit__d_r],
	["fs", jamo_init_r_n],
	["ff", jamo_init_r_r],
	["fg", jamo_init_r_h],
	["fS", jamo_init_r_S],
	["aq", jamo_init_m_b],
	["aS", jamo_init_m_S],
	["qr", jamo_init_b_g],
	["qs", jamo_init_b_n],
	["qe", jamo_init_b_d],
	["qt", jamo_init_b_s],
	["qw", jamo_init_b_j],
	["qc", jamo_init_b_c],
	["qx", jamo_init_b_t],
	["qv", jamo_init_b_p],
	["qS", jamo_init_b_S],
	["QS", jamo_init_bb_S],
	["tr", jamo_init_s_g],
	["ts", jamo_init_s_n],
	["te", jamo_init_s_d],
	["tf", jamo_init_s_r],
	["ta", jamo_init_s_m],
	["tq", jamo_init_s_b],
	["td", jamo_init_s_x],
	["tw", jamo_init_s_j],
	["tc", jamo_init_s_c],
	["tz", jamo_init_s_k],
	["tx", jamo_init_s_t],
	["tv", jamo_init_s_p],
	["tg", jamo_init_s_h],
	["Tt", jamo_init_ss_s],
	["dr", jamo_init_x_g],
	["de", jamo_init_x_d],
	["da", jamo_init_x_m],
	["dq", jamo_init_x_b],
	["dt", jamo_init_x_s],
	["dA", jamo_init_x_z],
	["dd", jamo_init_x_x],
	["dw", jamo_init_x_j],
	["dc", jamo_init_x_c],
	["dx", jamo_init_x_t],
	["dv", jamo_init_x_p],
	["wd", jamo_init_j_x],
	["cz", jamo_init_c_k],
	["cg", jamo_init_c_h],
	["vq", jamo_init_p_b],
	["vS", jamo_init_p_S],
	["gg", jamo_init_h_h],

	["qtr", jamo_init_b_s_g],
	["qte", jamo_init_b_s_d],
	["qtq", jamo_init_b_s_b],
	["qtt", jamo_init_b_s_s],
	["qtw", jamo_init_b_s_j],
	["tqw", jamo_init_s_b_g]
]);

var map_jamo_med = new Map([
	// MEDIALS
	["k", jamo_med_a],
	["o", jamo_med_ae],
	["i", jamo_med_ya],
	["O", jamo_med_yae],
	["j", jamo_med_eo],
	["p", jamo_med_e],
	["u", jamo_med_yeo],
	["P", jamo_med_ye],
	["h", jamo_med_o],
	["y", jamo_med_yo],
	["n", jamo_med_u],
	["b", jamo_med_yu],
	["m", jamo_med_eu],
	["l", jamo_med_i],
	["K", jamo_med_v],

	// MEDIAL CLUSTERS
	["kh", jamo_med_a_o],
	["kn", jamo_med_a_u],
	["km", jamo_med_a_eu],
	["ih", jamo_med_ya_o],
	["iy", jamo_med_ya_yo],
	["in", jamo_med_ya_u],
	["jh", jamo_med_eo_o],
	["jn", jamo_med_eo_u],
	["jm", jamo_med_eo_eu],
	["ui", jamo_med_yeo_ya],
	["uh", jamo_med_yeo_o],
	["un", jamo_med_yeo_u],
	["hk", jamo_med_o_a],
	["ho", jamo_med_o_ae],
	["hl", jamo_med_o_i],
	["hj", jamo_med_o_eo],
	["hp", jamo_med_o_e],
	["hP", jamo_med_o_ye],
	["hh", jamo_med_o_o],
	["hn", jamo_med_o_u],
	["hi", jamo_med_o_ya],
	["hO", jamo_med_o_yae],
	["yi", jamo_med_yo_ya],
	["yO", jamo_med_yo_yae],
	["yu", jamo_med_yo_yeo],
	["yh", jamo_med_yo_o],
	["yl", jamo_med_yo_i],
	["nj", jamo_med_u_eo],
	["np", jamo_med_u_e],
	["nl", jamo_med_u_i],
	["nk", jamo_med_u_a],
	["no", jamo_med_u_ae],
	["nP", jamo_med_u_ye],
	["nn", jamo_med_u_u],
	["bk", jamo_med_yu_a],
	["bj", jamo_med_yu_eo],
	["bp", jamo_med_yu_e],
	["bj", jamo_med_yu_eo],
	["bP", jamo_med_yu_ye],
	["bn", jamo_med_yu_u],
	["bl", jamo_med_yu_i],
	["ml", jamo_med_eu_i],
	["mn", jamo_med_eu_u],
	["mm", jamo_med_eu_eu],
	["lk", jamo_med_i_a],
	["li", jamo_med_i_ya],
	["lh", jamo_med_i_o],
	["ln", jamo_med_i_u],
	["lm", jamo_med_i_eu],
	["lK", jamo_med_i_v],
	["Kj", jamo_med_v_eo],
	["Kn", jamo_med_v_u],
	["Kl", jamo_med_v_i],
	["KK", jamo_med_v_v],

	["njm", jamo_med_u_eo_eu],
	["mln", jamo_med_eu_i_u]
]);

var map_jamo_fin = new Map([
	// FINALS
	["r", jamo_fin_g],
	["R", jamo_fin_gg],
	["s", jamo_fin_n],
	["e", jamo_fin_d],
	["f", jamo_fin_r],
	["a", jamo_fin_m],
	["q", jamo_fin_b],
	["t", jamo_fin_s],
	["T", jamo_fin_ss],
	["d", jamo_fin_x],
	["w", jamo_fin_j],
	["c", jamo_fin_c],
	["z", jamo_fin_k],
	["x", jamo_fin_t],
	["v", jamo_fin_p],
	["g", jamo_fin_h],
	["A", jamo_fin_z],
	["D", jamo_fin_ng],
	["G", jamo_fin_q],

	// FINAL CLUSTERS
	["rf", jamo_fin_g_r],
	["rt", jamo_fin_g_s],
	["rs", jamo_fin_g_n],
	["rq", jamo_fin_g_b],
	["rc", jamo_fin_g_c],
	["rz", jamo_fin_g_k],
	["rg", jamo_fin_g_h],
	["sw", jamo_fin_n_j],
	["sg", jamo_fin_n_h],
	["sr", jamo_fin_n_g],
	["se", jamo_fin_n_d],
	["st", jamo_fin_n_s],
	["sA", jamo_fin_n_z],
	["sx", jamo_fin_n_t],
	["ss", jamo_fin_n_n],
	["er", jamo_fin_d_g],
	["ef", jamo_fin_d_r],
	["fr", jamo_fin_r_g],
	["fa", jamo_fin_r_m],
	["fq", jamo_fin_r_b],
	["ft", jamo_fin_r_s],
	["fx", jamo_fin_r_t],
	["fv", jamo_fin_r_p],
	["fg", jamo_fin_r_h],
	["fs", jamo_fin_r_n],
	["fe", jamo_fin_r_d],
	["ff", jamo_fin_r_r],
	["fA", jamo_fin_r_z],
	["fz", jamo_fin_r_k],
	["fG", jamo_fin_r_q],
	["ar", jamo_fin_m_g],
	["af", jamo_fin_m_r],
	["aq", jamo_fin_m_b],
	["at", jamo_fin_m_s],
	["aA", jamo_fin_m_z],
	["ac", jamo_fin_m_c],
	["ag", jamo_fin_m_h],
	["aS", jamo_fin_m_S],
	["qt", jamo_fin_b_s],
	["qf", jamo_fin_b_r],
	["qv", jamo_fin_b_p],
	["qg", jamo_fin_b_h],
	["qS", jamo_fin_b_S],
	["tr", jamo_fin_s_g],
	["te", jamo_fin_s_d],
	["tf", jamo_fin_s_r],
	["tq", jamo_fin_s_b],
	["dr", jamo_fin_x_g],
	["dd", jamo_fin_x_x],
	["dz", jamo_fin_x_k],
	["vq", jamo_fin_p_b],
	["vS", jamo_fin_p_S],
	["gs", jamo_fin_h_n],
	["gf", jamo_fin_h_r],
	["ga", jamo_fin_h_m],
	["gq", jamo_fin_h_b],
	["Dt", jamo_fin_ng_s],
	["DA", jamo_fin_ng_z],

	["rtr", jamo_fin_g_s_g],
	["frt", jamo_fin_r_g_s],
	["far", jamo_fin_r_m_g],
	["fat", jamo_fin_r_m_s],
	["fqt", jamo_fin_r_b_s],
	["fqg", jamo_fin_r_b_h],
	["fqS", jamo_fin_r_b_S],
	["ftt", jamo_fin_r_s_s],
	["feg", jamo_fin_r_d_h],
	["att", jamo_fin_m_s_s],
	["drr", jamo_fin_x_g_g]
]);

/*======================================
=========OLD HANGUL IME LOGIC===========
======================================*/
// TODO: Implement [F] key, indicates that any consonants typed after it are for the next syllable
// TODO: Fix final consonant clusters becoming initial clusters

// Some more constants
const STATE_DEFAULT = 0;
const STATE_INSERT_LETTER = 1;
const STATE_INSERT_INIT = 2;
const STATE_INSERT_MED = 3;
const STATE_INSERT_FIN = 4;
const STATE_INSERT_INIT_CLUSTER = 5;
const STATE_INSERT_MED_CLUSTER = 6;
const STATE_INSERT_FIN_CLUSTER = 7;

// IME input string
var input = "";

// FixedStack prototypes containing the last 4 keypresses (in ASCII format)
var num = 4;
var stackPressedKeys = new FixedStack(num);
var stackValidJamos = new FixedStack(num);

// The current selection positions
var selStart = 0;
var selEnd = 0;

// Current state of the IME
var currState = STATE_DEFAULT;

// Indicate if current character should be overridden (for inserting composite Hangul jamo)
var overrideCurrChar = false;

var overridePrevChar = false;

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

// Convert the state int into a string
function getStateName(state) {
	switch (state) {
		case STATE_DEFAULT: return "STATE_DEFAULT";
		case STATE_INSERT_LETTER: return "STATE_INSERT_LETTER";
		case STATE_INSERT_INIT: return "STATE_INSERT_INIT";
		case STATE_INSERT_MED: return "STATE_INSERT_MED";
		case STATE_INSERT_FIN: return "STATE_INSERT_FIN";
		case STATE_INSERT_INIT_CLUSTER: return "STATE_INSERT_INIT_CLUSTER";
		case STATE_INSERT_MED_CLUSTER: return "STATE_INSERT_MED_CLUSTER";
		case STATE_INSERT_FIN_CLUSTER: return "STATE_INSERT_FIN_CLUSTER";
		default: return "INVALID";
	}
}

// Insert or remove Hangul jamo into the given input string
function insertInput(input, pressedKey, context) {
	var output = "";
	var currChar = pressedKey;
	overrideCurrChar = false;
	overridePrevChar = false;

	// Add the pressed key to the fixed stack of previous keypresses
	stackPressedKeys.push(pressedKey);
	
	// The last N pressed keys as a string
	var pressedKeys = stackPressedKeys.toString();
	
	// Get current char, scanning for trigraphs first before
	// narrowing down the search
	for (var c = pressedKeys.length; c > 0; c--) {
		var lastCPressedKeys = pressedKeys.substring(pressedKeys.length-c, pressedKeys.length);
		var chosenJamo = undefined;
		
		// Update the IME state given the current state and the last 3 pressed keys
		switch (currState) {
			case STATE_DEFAULT: 
				console.log("STATE: Default");
			case STATE_INSERT_LETTER: 
				console.log("STATE: Insert Letter");
			case STATE_INSERT_INIT:
				console.log("STATE: Insert Initial");
				if (map_jamo_init.has(lastCPressedKeys)) {
					currState = STATE_INSERT_INIT;
					chosenJamo = map_jamo_init.get(lastCPressedKeys);
					console.log("* Changed state to Insert Initial");
				}
				else if (map_jamo_med.has(lastCPressedKeys)) {
					currState = STATE_INSERT_MED;
					chosenJamo = map_jamo_med.get(lastCPressedKeys);
					console.log("* Changed state to Insert Medial");
				}
				break;
			case STATE_INSERT_MED:
				console.log("STATE: Insert Medial");
				if (map_jamo_med.has(lastCPressedKeys)) {
					currState = STATE_INSERT_MED;
					chosenJamo = map_jamo_med.get(lastCPressedKeys);
					console.log("* Changed state to Insert Medial");
				}
				else if (map_jamo_fin.has(lastCPressedKeys)) {
					currState = STATE_INSERT_FIN;
					chosenJamo = map_jamo_fin.get(lastCPressedKeys);
					console.log("* Changed state to Insert Final");
				}
				break;
			case STATE_INSERT_FIN:
				console.log("STATE: Insert Final");
				if (map_jamo_fin.has(lastCPressedKeys)) {
					currState = STATE_INSERT_FIN;
					chosenJamo = map_jamo_fin.get(lastCPressedKeys);
					console.log("* Changed state to Insert Final");
				}
				else if (map_jamo_init.has(lastCPressedKeys)) {
					currState = STATE_INSERT_INIT;
					chosenJamo = map_jamo_init.get(lastCPressedKeys);
					console.log("* Changed state to Insert Initial");
				}
				else if (map_jamo_med.has(lastCPressedKeys)) {
					currState = STATE_INSERT_MED;
					chosenJamo = map_jamo_med.get(lastCPressedKeys);
					overridePrevChar = true;
					console.log("* Changed state to Insert Medial (after Insert Final)");
				}
				break;
			default: break;
		}
		
		console.log("c=" + c + " len-c=" + (pressedKeys.length-c) + " lastCPressedKeys=" + lastCPressedKeys + " chosenJamo=" + chosenJamo);

		// Exit the loop if a valid Jamo object is found
		if (chosenJamo !== undefined) {
			overrideCurrChar = chosenJamo.hasMultipleJamo();
			stackValidJamos.push(chosenJamo);
			console.log(" OVERRIDE=" + overrideCurrChar);
			break;
		}
	}
	
	// Set the character as a Hangul Jamo character
	if (chosenJamo !== undefined) {
		currChar = chosenJamo.letter;
	}
	// Set character as the original keypress if no valid Jamo entry was found
	else {
		currState = STATE_INSERT_LETTER;
		console.log("Changed state to Insert Non-Hangul Letter");
		
		currChar = pressedKey;
		stackValidJamos.push(undefined);
	}
	
	// Swap the final char for init char
	if (overridePrevChar) {
		var lastJamo = stackValidJamos.nthTop(1).decomposed;
		input = input.slice(0, input.length - 1) + lastJamo;
		selStart += (lastJamo.length - 1);
		selEnd += (lastJamo.length - 1);
	}

	// Insert character at cursor position
	output = (overrideCurrChar)
			? input.slice(0, selStart-1) + currChar + input.slice(selStart)
			: input.slice(0, selStart) + currChar + input.slice(selStart);
	console.log("LAST JAMO = " + stackValidJamos.nthTop(1));
	console.log("CURRENT STATE = " + getStateName(currState));
	console.log("overrideCurrChar = " + overrideCurrChar + " overridePrevChar = " + overridePrevChar);
	console.log("INPUT =  '" + input + "'");
	console.log("OUTPUT = '" + output + "'");
	console.log("stackPressedKeys = '" + stackPressedKeys.toString() + "'");
	console.log("stackValidJamos = '" + stackValidJamos.toString() + "'");

	return output;
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
	//console.log("e.key = " + e.key);

	// Get the current cursor position
	selStart = context.selectionStart;
	selEnd = context.selectionEnd;
	console.log("START=" + selStart + " END=" + selEnd);

	// Disable inserting the char if it's an ASCII char or the Enter key
	if (keynum == 13 || (keynum >= 32 && keynum <= 126)) e.preventDefault();

	// Calculate the next Hangul jamo to be inserted, except if backspace is pressed
	if (keynum != 8 && keynum != undefined) {
		input = context.value;
		//context.value = input + pressedKey;
		context.value = insertInput(input, pressedKey, context);

		// Reset cursor to previously known position
		var incrementAmount = (overrideCurrChar) ? 0 : 1;
		context.selectionEnd = selStart + incrementAmount;
	}
}

// Get all input keypresses including non-character keys (e.g. backspace, arrow keys)
function receiveKeydown(e, context) {
	// Revert to default state and clear all stacks
	// if backspace or arrow keys are pressed
	if (e.key == "Backspace" ||
		e.key == "ArrowLeft" || 
		e.key == "ArrowRight" || 
		e.key == "ArrowUp" || 
		e.key == "ArrowDown") {
		currState = STATE_DEFAULT;
		stackPressedKeys = new FixedStack(num);
		stackValidJamos = new FixedStack(num);
		console.log("KEYDOWN: State changed to Default");		
	}
}

function init() {
	// Add event listener to Old Hangul IME textarea
	var hangulInput = document.getElementById("hangulime");
	hangulInput.addEventListener("keypress", function(event) {
		receiveKeypress(event, this);
	}, true);

	hangulInput.addEventListener("keydown", function(event) {
		receiveKeydown(event, this);
	}, true);

	// console.log("map_jamo_init =");
	// console.log(map_jamo_init);
	// fixedStackTest();
	// jamoTest();
}
