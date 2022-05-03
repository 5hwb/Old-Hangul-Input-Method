/**
 * Old Hangul IME
 * by Perry Hartono, 2018
 *
 * This is a script that turns a HTML Textarea into a Korean Hangul IME
 * capable of inserting archaic Hangul letters.
 * NOTE: this is an older version of hangulime.js - for the latest version check hangulime_new.js.
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
var jamo_g   = new Jamo(jamo_nil, 'ᄀ', 'ᆨ');
var jamo_kk  = new Jamo(jamo_nil, 'ᄁ', 'ᆩ');
var jamo_n   = new Jamo(jamo_nil, 'ᄂ', 'ᆫ');
var jamo_d   = new Jamo(jamo_nil, 'ᄃ', 'ᆮ');
var jamo_tt  = new Jamo(jamo_nil, 'ᄄ', undefined);
var jamo_r   = new Jamo(jamo_nil, 'ᄅ', 'ᆯ');
var jamo_m   = new Jamo(jamo_nil, 'ᄆ', 'ᆷ');
var jamo_b   = new Jamo(jamo_nil, 'ᄇ', 'ᆸ');
var jamo_pp  = new Jamo(jamo_nil, 'ᄈ', undefined);
var jamo_s   = new Jamo(jamo_nil, 'ᄉ', 'ᆺ');
var jamo_ss  = new Jamo(jamo_nil, 'ᄊ', 'ᆻ');
var jamo_x   = new Jamo(jamo_nil, 'ᄋ', 'ᆼ');
var jamo_j   = new Jamo(jamo_nil, 'ᄌ', 'ᆽ');
var jamo_jj  = new Jamo(jamo_nil, 'ᄍ', undefined);
var jamo_c   = new Jamo(jamo_nil, 'ᄎ', 'ᆾ');
var jamo_k   = new Jamo(jamo_nil, 'ᄏ', 'ᆿ');
var jamo_t   = new Jamo(jamo_nil, 'ᄐ', 'ᇀ');
var jamo_p   = new Jamo(jamo_nil, 'ᄑ', 'ᇁ');
var jamo_h   = new Jamo(jamo_nil, 'ᄒ', 'ᇂ');
var jamo_g_s = new Jamo(jamo_g, undefined, 'ᆪ'); /*jamo_g_s.setDecomposed("ᆨᄉ");*/
var jamo_n_j = new Jamo(jamo_n, 'ᅜ', 'ᆬ'); /*jamo_n_j.setDecomposed("ᆫᄌ");*/
var jamo_n_h = new Jamo(jamo_n, 'ᅝ', 'ᆭ'); /*jamo_n_h.setDecomposed("ᆫᄒ");*/
var jamo_r_g = new Jamo(jamo_r, undefined, 'ᆰ'); /*jamo_r_g.setDecomposed("ᆯᄀ");*/
var jamo_r_m = new Jamo(jamo_r, undefined, 'ᆱ'); /*jamo_r_m.setDecomposed("ᆯᄆ");*/
var jamo_r_b = new Jamo(jamo_r, undefined, 'ᆲ'); /*jamo_r_b.setDecomposed("ᆯᄇ");*/
var jamo_r_s = new Jamo(jamo_r, undefined, 'ᆳ'); /*jamo_r_s.setDecomposed("ᆯᄉ");*/
var jamo_r_t = new Jamo(jamo_r, undefined, 'ᆴ'); /*jamo_r_t.setDecomposed("ᆯᄐ");*/
var jamo_r_p = new Jamo(jamo_r, undefined, 'ᆵ'); /*jamo_r_p.setDecomposed("ᆯᄑ");*/
var jamo_r_h = new Jamo(jamo_r, 'ᄚ', 'ᆶ'); /*jamo_r_h.setDecomposed("ᆯᄒ");*/
var jamo_b_s = new Jamo(jamo_b, 'ᄡ', 'ᆹ'); /*jamo_b_s.setDecomposed("ᆸᄉ");*/

// INITIAL CLUSTERS HANGEUL EXTENDED BLOCK A
var jamo_init_d_m = new Jamo(jamo_init_b_s, "ea", JAMO_INITIAL, 'ꥠ', undefined);


// Medials
var jamo_a    = new Jamo(jamo_nil, 'ᅡ');
var jamo_ae   = new Jamo(jamo_nil, 'ᅢ');
var jamo_ya   = new Jamo(jamo_nil, 'ᅣ');
var jamo_yae  = new Jamo(jamo_nil, 'ᅤ');
var jamo_eo   = new Jamo(jamo_nil, 'ᅥ');
var jamo_e    = new Jamo(jamo_nil, 'ᅦ');
var jamo_yeo  = new Jamo(jamo_nil, 'ᅧ');
var jamo_ye   = new Jamo(jamo_nil, 'ᅨ');
var jamo_o    = new Jamo(jamo_nil, 'ᅩ');
var jamo_o_a  = new Jamo(jamo_o, 'ᅪ');
var jamo_o_ae = new Jamo(jamo_o, 'ᅫ');
var jamo_o_i  = new Jamo(jamo_o, 'ᅬ');
var jamo_yo   = new Jamo(jamo_nil, 'ᅭ');
var jamo_u    = new Jamo(jamo_nil, 'ᅮ');
var jamo_u_eo = new Jamo(jamo_u, 'ᅯ');
var jamo_u_e  = new Jamo(jamo_u, 'ᅰ');
var jamo_u_i  = new Jamo(jamo_u, 'ᅱ');
var jamo_yu   = new Jamo(jamo_nil, 'ᅲ');
var jamo_eu   = new Jamo(jamo_nil, 'ᅳ');
var jamo_eu_i = new Jamo(jamo_eu, 'ᅴ');
var jamo_i    = new Jamo(jamo_nil, 'ᅵ');

// Initials (obsolete Hangul)
var jamo_g_d   = new Jamo(jamo_g,   'ᅚ', undefined);
var jamo_n_g   = new Jamo(jamo_n,   'ᄓ', 'ᇅ');
var jamo_n_n   = new Jamo(jamo_n,   'ᄔ', 'ᇿ');
var jamo_n_d   = new Jamo(jamo_n,   'ᄕ', 'ᇆ');
var jamo_n_b   = new Jamo(jamo_n,   'ᄖ', undefined);
var jamo_n_s   = new Jamo(jamo_n,   'ᅛ', 'ᇇ');
var jamo_d_r   = new Jamo(jamo_d,   'ᅞ', 'ᇋ');
var jamo_d_g   = new Jamo(jamo_d,   'ᄗ', 'ᇊ');
var jamo_r_n   = new Jamo(jamo_r,   'ᄘ', 'ᇍ');
var jamo_r_r   = new Jamo(jamo_r,   'ᄙ', 'ᇐ');
var jamo_r_x   = new Jamo(jamo_r,   'ᄛ', undefined);
var jamo_m_b   = new Jamo(jamo_m,   'ᄜ', 'ᇜ');
var jamo_m_x   = new Jamo(jamo_m,   'ᄝ', 'ᇢ');
var jamo_b_g   = new Jamo(jamo_b,   'ᄞ', undefined);
var jamo_b_n   = new Jamo(jamo_b,   'ᄟ', undefined);
var jamo_b_d   = new Jamo(jamo_b,   'ᄠ', undefined);
var jamo_b_s_g = new Jamo(jamo_b_s, 'ᄢ', undefined);
var jamo_b_s_d = new Jamo(jamo_b_s, 'ᄣ', undefined);
var jamo_b_s_b = new Jamo(jamo_b_s, 'ᄤ', undefined);
var jamo_b_s_s = new Jamo(jamo_b_s, 'ᄥ', undefined);
var jamo_b_s_j = new Jamo(jamo_b_s, 'ᄦ', undefined);
var jamo_b_j   = new Jamo(jamo_b,   'ᄧ', undefined);
var jamo_b_c   = new Jamo(jamo_b,   'ᄨ', undefined);
var jamo_b_t   = new Jamo(jamo_b,   'ᄩ', undefined);
var jamo_b_p   = new Jamo(jamo_b,   'ᄪ', 'ᇤ');
var jamo_b_x   = new Jamo(jamo_b,   'ᄫ', 'ᇦ');
var jamo_pp_x  = new Jamo(jamo_pp,  'ᄬ', undefined);
var jamo_s_g   = new Jamo(jamo_s,   'ᄭ', 'ᇧ');
var jamo_s_n   = new Jamo(jamo_s,   'ᄮ', undefined);
var jamo_s_d   = new Jamo(jamo_s,   'ᄯ', 'ᇨ');
var jamo_s_r   = new Jamo(jamo_s,   'ᄰ', 'ᇩ');
var jamo_s_m   = new Jamo(jamo_s,   'ᄱ', undefined);
var jamo_s_b   = new Jamo(jamo_s,   'ᄲ', 'ᇪ');
var jamo_s_b_g = new Jamo(jamo_s_b, 'ᄳ', undefined);
var jamo_s_x   = new Jamo(jamo_s,   'ᄵ', undefined);
var jamo_s_j   = new Jamo(jamo_s,   'ᄶ', undefined);
var jamo_s_c   = new Jamo(jamo_s,   'ᄷ', undefined);
var jamo_s_k   = new Jamo(jamo_s,   'ᄸ', undefined);
var jamo_s_t   = new Jamo(jamo_s,   'ᄹ', undefined);
var jamo_s_p   = new Jamo(jamo_s,   'ᄺ', undefined);
var jamo_s_h   = new Jamo(jamo_s,   'ᄻ', undefined);
var jamo_s_s_s = new Jamo(jamo_ss,  'ᄴ', undefined);
var jamo_x_g   = new Jamo(jamo_x,   'ᅁ', 'ᇬ');
var jamo_x_d   = new Jamo(jamo_x,   'ᅂ', undefined);
var jamo_x_m   = new Jamo(jamo_x,   'ᅃ', undefined);
var jamo_x_b   = new Jamo(jamo_x,   'ᅄ', undefined);
var jamo_x_s   = new Jamo(jamo_x,   'ᅅ', undefined);
var jamo_x_z   = new Jamo(jamo_x,   'ᅆ', undefined);
var jamo_x_x   = new Jamo(jamo_x,   'ᅇ', 'ᇮ');
var jamo_x_j   = new Jamo(jamo_x,   'ᅈ', undefined);
var jamo_x_c   = new Jamo(jamo_x,   'ᅉ', undefined);
var jamo_x_t   = new Jamo(jamo_x,   'ᅊ', undefined);
var jamo_x_p   = new Jamo(jamo_x,   'ᅋ', undefined);
var jamo_j_x   = new Jamo(jamo_j,   'ᅍ', undefined);
var jamo_c_k   = new Jamo(jamo_c,   'ᅒ', undefined);
var jamo_c_h   = new Jamo(jamo_c,   'ᅓ', undefined);
var jamo_p_b   = new Jamo(jamo_p,   'ᅖ', 'ᇳ');
var jamo_p_x   = new Jamo(jamo_p,   'ᅗ', 'ᇴ');
var jamo_h_h   = new Jamo(jamo_h,   'ᅘ', undefined);
var jamo_s_left  = new Jamo(jamo_nil,    'ᄼ', undefined);
var jamo_ss_left = new Jamo(jamo_s_left, 'ᄽ', undefined);
var jamo_s_rite  = new Jamo(jamo_nil,    'ᄾ', undefined);
var jamo_ss_rite = new Jamo(jamo_s_rite, 'ᄿ', undefined);
var jamo_z       = new Jamo(jamo_nil,    'ᅀ', 'ᇫ');
var jamo_ng      = new Jamo(jamo_nil,    'ᅌ', 'ᇰ');
var jamo_j_left  = new Jamo(jamo_nil,    'ᅎ', undefined);
var jamo_jj_left = new Jamo(jamo_j_left, 'ᅏ', undefined);
var jamo_j_rite  = new Jamo(jamo_nil,    'ᅐ', undefined);
var jamo_jj_rite = new Jamo(jamo_j_rite, 'ᅑ', undefined);
var jamo_c_left  = new Jamo(jamo_nil,    'ᅔ', undefined);
var jamo_c_rite  = new Jamo(jamo_nil,    'ᅕ', undefined);
var jamo_q       = new Jamo(jamo_nil,    'ᅙ', 'ᇹ');

// Medials (obsolete Hangul)
var jamo_a_o     = new Jamo(jamo_a,   'ᅶ');
var jamo_a_u     = new Jamo(jamo_a,   'ᅷ');
var jamo_a_eu    = new Jamo(jamo_a,   'ᆣ');
var jamo_ya_o    = new Jamo(jamo_ya,  'ᅸ');
var jamo_ya_yo   = new Jamo(jamo_ya,  'ᅹ');
var jamo_ya_u    = new Jamo(jamo_ya,  'ᆤ');
var jamo_eo_o    = new Jamo(jamo_eo,  'ᅺ');
var jamo_eo_u    = new Jamo(jamo_eo,  'ᅻ');
var jamo_eo_eu   = new Jamo(jamo_eo,  'ᅼ');
var jamo_yeo_ya  = new Jamo(jamo_yeo, 'ᆥ');
var jamo_yeo_o   = new Jamo(jamo_yeo, 'ᅽ');
var jamo_yeo_u   = new Jamo(jamo_yeo, 'ᅾ');
var jamo_o_eo    = new Jamo(jamo_o,   'ᅿ');
var jamo_o_e     = new Jamo(jamo_o,   'ᆀ');
var jamo_o_ye    = new Jamo(jamo_o,   'ᆁ');
var jamo_o_o     = new Jamo(jamo_o,   'ᆂ');
var jamo_o_u     = new Jamo(jamo_o,   'ᆃ');
var jamo_o_ya    = new Jamo(jamo_o,   'ᆦ');
var jamo_o_yae   = new Jamo(jamo_o,   'ᆧ');
var jamo_yo_ya   = new Jamo(jamo_yo,  'ᆄ');
var jamo_yo_yae  = new Jamo(jamo_yo,  'ᆅ');
var jamo_yo_yeo  = new Jamo(jamo_yo,  'ᆆ');
var jamo_yo_o    = new Jamo(jamo_yo,  'ᆇ');
var jamo_yo_i    = new Jamo(jamo_yo,  'ᆈ');
var jamo_u_a     = new Jamo(jamo_u,   'ᆉ');
var jamo_u_ae    = new Jamo(jamo_u,   'ᆊ');
var jamo_u_eo_eu = new Jamo(jamo_u,   'ᆋ');
var jamo_u_ye    = new Jamo(jamo_u,   'ᆌ');
var jamo_u_u     = new Jamo(jamo_u,   'ᆍ');
var jamo_yu_a    = new Jamo(jamo_yu,  'ᆎ');
var jamo_yu_eo   = new Jamo(jamo_yu,  'ᆏ');
var jamo_yu_e    = new Jamo(jamo_yu,  'ᆐ');
var jamo_yu_yeo  = new Jamo(jamo_yu,  'ᆑ');
var jamo_yu_ye   = new Jamo(jamo_yu,  'ᆒ');
var jamo_yu_u    = new Jamo(jamo_yu,  'ᆓ');
var jamo_yu_i    = new Jamo(jamo_yu,  'ᆔ');
var jamo_eu_u    = new Jamo(jamo_eu,  'ᆕ');
var jamo_eu_eu   = new Jamo(jamo_eu,  'ᆖ');
var jamo_eu_i_u  = new Jamo(jamo_eu,  'ᆗ');
var jamo_i_a     = new Jamo(jamo_i,   'ᆘ');
var jamo_i_ya    = new Jamo(jamo_i,   'ᆙ');
var jamo_i_o     = new Jamo(jamo_i,   'ᆚ');
var jamo_i_u     = new Jamo(jamo_i,   'ᆛ');
var jamo_i_eu    = new Jamo(jamo_i,   'ᆜ');
var jamo_i_aa    = new Jamo(jamo_i,   'ᆝ');
var jamo_aa      = new Jamo(jamo_nil, 'ᆞ');
var jamo_aa_eo   = new Jamo(jamo_aa,  'ᆟ');
var jamo_aa_u    = new Jamo(jamo_aa,  'ᆠ');
var jamo_aa_i    = new Jamo(jamo_aa,  'ᆡ');
var jamo_aa_aa   = new Jamo(jamo_aa,  'ᆢ');

// Finals (obsolete Hangul)
var jamo_g_r    = new Jamo(jamo_g,   undefined, 'ᇃ');
var jamo_g_s_g  = new Jamo(jamo_g,   undefined, 'ᇄ');
var jamo_g_n    = new Jamo(jamo_g,   undefined, 'ᇺ');
var jamo_g_b    = new Jamo(jamo_g,   undefined, 'ᇻ');
var jamo_g_c    = new Jamo(jamo_g,   undefined, 'ᇼ');
var jamo_g_k    = new Jamo(jamo_g,   undefined, 'ᇽ');
var jamo_g_h    = new Jamo(jamo_g,   undefined, 'ᇾ');
var jamo_n_s    = new Jamo(jamo_n,   undefined, 'ᇇ');
var jamo_n_z    = new Jamo(jamo_n,   undefined, 'ᇈ');
var jamo_n_t    = new Jamo(jamo_n,   undefined, 'ᇉ');
var jamo_r_g_s  = new Jamo(jamo_r_g, undefined, 'ᇌ');
var jamo_r_m_g  = new Jamo(jamo_r_m, undefined, 'ᇑ');
var jamo_r_m_s  = new Jamo(jamo_r_m, undefined, 'ᇒ');
var jamo_r_b_s  = new Jamo(jamo_r_b, undefined, 'ᇓ');
var jamo_r_b_h  = new Jamo(jamo_r_b, undefined, 'ᇔ');
var jamo_r_b_x  = new Jamo(jamo_r_b, undefined, 'ᇕ');
var jamo_r_s_s  = new Jamo(jamo_r_s, undefined, 'ᇖ');
var jamo_r_d    = new Jamo(jamo_r,   undefined, 'ᇎ');
var jamo_r_d_h  = new Jamo(jamo_r_d, undefined, 'ᇏ');
var jamo_r_z    = new Jamo(jamo_r,   undefined, 'ᇗ');
var jamo_r_k    = new Jamo(jamo_r,   undefined, 'ᇘ');
var jamo_r_q    = new Jamo(jamo_r,   undefined, 'ᇙ');
var jamo_m_g    = new Jamo(jamo_m,   undefined, 'ᇚ');
var jamo_m_r    = new Jamo(jamo_m,   undefined, 'ᇛ');
var jamo_m_s    = new Jamo(jamo_m,   undefined, 'ᇝ');
var jamo_m_s_s  = new Jamo(jamo_m_s, undefined, 'ᇞ');
var jamo_m_z    = new Jamo(jamo_m,   undefined, 'ᇟ');
var jamo_m_c    = new Jamo(jamo_m,   undefined, 'ᇠ');
var jamo_m_h    = new Jamo(jamo_m,   undefined, 'ᇡ');
var jamo_b_r    = new Jamo(jamo_b,   undefined, 'ᇣ');
var jamo_b_h    = new Jamo(jamo_b,   undefined, 'ᇥ');
var jamo_x_g_g  = new Jamo(jamo_x_g, undefined, 'ᇭ');
var jamo_x_k    = new Jamo(jamo_x,   undefined, 'ᇯ');
var jamo_h_n    = new Jamo(jamo_h,   undefined, 'ᇵ');
var jamo_h_r    = new Jamo(jamo_h,   undefined, 'ᇶ');
var jamo_h_m    = new Jamo(jamo_h,   undefined, 'ᇷ');
var jamo_h_b    = new Jamo(jamo_h,   undefined, 'ᇸ');
var jamo_ng_s   = new Jamo(jamo_ng,  undefined, 'ᇱ');
var jamo_ng_z   = new Jamo(jamo_ng,  undefined, 'ᇲ');


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
    ["d", jamo_x],
    ["w", jamo_j ],
    ["W", jamo_jj],
    ["c", jamo_c ],
    ["z", jamo_k ],
    ["x", jamo_t ],
    ["v", jamo_p ],
    ["g", jamo_h ],
	////////////////////////////////////////
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
	////////////////////////////////////////
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
	////////////////////////////////////////
    ["re", jamo_g_d    ],
    ["sr", jamo_n_g    ],
    ["ss", jamo_n_n    ],
    ["se", jamo_n_d    ],
    ["sq", jamo_n_b    ],
    ["st", jamo_n_s    ],
    ["ef", jamo_d_r    ],
    ["er", jamo_d_g    ],
    ["fs", jamo_r_n    ],
    ["ff", jamo_r_r    ],
    ["fS", jamo_r_x    ],
    ["aq", jamo_m_b    ],
    ["aS", jamo_m_x    ],
    ["qr", jamo_b_g    ],
    ["qs", jamo_b_n    ],
    ["qe", jamo_b_d    ],
    ["qtr", jamo_b_s_g  ],
    ["qte", jamo_b_s_d  ],
    ["qtq", jamo_b_s_b  ],
    ["qtt", jamo_b_s_s  ],
    ["qtw", jamo_b_s_j  ],
    ["qw", jamo_b_j    ],
    ["qc", jamo_b_c    ],
    ["qx", jamo_b_t    ],
    ["qv", jamo_b_p    ],
    ["qS", jamo_b_x    ],
    ["QS", jamo_pp_x   ],
    ["tr", jamo_s_g    ],
    ["ts", jamo_s_n    ],
    ["te", jamo_s_d    ],
    ["tf", jamo_s_r    ],
    ["ta", jamo_s_m    ],
    ["tq", jamo_s_b    ],
    ["tqr", jamo_s_b_g  ],
    ["td", jamo_s_x    ],
    ["tw", jamo_s_j    ],
    ["tc", jamo_s_c    ],
    ["tz", jamo_s_k    ],
    ["tx", jamo_s_t    ],
    ["tv", jamo_s_p    ],
    ["tg", jamo_s_h    ],
    ["ttt", jamo_s_s_s  ],
    ["dr", jamo_x_g    ],
    ["de", jamo_x_d    ],
    ["da", jamo_x_m    ],
    ["dq", jamo_x_b    ],
    ["dt", jamo_x_s    ],
    ["dA", jamo_x_z    ],
    ["dd", jamo_x_x    ],
    ["dw", jamo_x_j    ],
    ["dc", jamo_x_c    ],
    ["dx", jamo_x_t    ],
    ["dv", jamo_x_p    ],
    ["wd", jamo_j_x    ],
    ["cz", jamo_c_k    ],
    ["cg", jamo_c_h    ],
    ["vq", jamo_p_b    ],
    ["vS", jamo_p_x    ],
    ["gg", jamo_h_h    ],
    ["Z", jamo_s_left ],
    ["ZZ", jamo_ss_left],
    ["X", jamo_s_rite ],
    ["XX", jamo_ss_rite],
    ["A", jamo_z      ],
    ["D", jamo_ng     ],
    ["C", jamo_j_left ],
    ["CC", jamo_jj_left],
    ["V", jamo_j_rite ],
    ["VV", jamo_jj_rite],
    ["B", jamo_c_left ],
    ["N", jamo_c_rite ],
    ["G", jamo_q      ],
    ////////////////////////////////////////
    ["kh", jamo_a_o      ],
    ["kn", jamo_a_u      ],
    ["km", jamo_a_eu     ],
    ["ih", jamo_ya_o     ],
    ["iy", jamo_ya_yo    ],
    ["in", jamo_ya_u     ],
    ["jh", jamo_eo_o     ],
    ["jn", jamo_eo_u     ],
    ["jm", jamo_eo_eu    ],
    ["ui", jamo_yeo_ya   ],
    ["uh", jamo_yeo_o    ],
    ["un", jamo_yeo_u    ],
    ["hj", jamo_o_eo     ],
    ["hp", jamo_o_e      ],
    ["hP", jamo_o_ye     ],
    ["hh", jamo_o_o      ],
    ["hn", jamo_o_u      ],
    ["hi", jamo_o_ya     ],
    ["hO", jamo_o_yae    ],
    ["yi", jamo_yo_ya    ],
    ["yO", jamo_yo_yae   ],
    ["yu", jamo_yo_yeo   ],
    ["yh", jamo_yo_o     ],
    ["yl", jamo_yo_i     ],
    ["nk", jamo_u_a      ],
    ["no", jamo_u_ae     ],
    ["njm", jamo_u_eo_eu  ],
    ["nP", jamo_u_ye     ],
    ["nn", jamo_u_u      ],
    ["bk", jamo_yu_a     ],
    ["bj", jamo_yu_eo    ],
    ["bp", jamo_yu_e     ],
    ["bu", jamo_yu_yeo   ],
    ["bp", jamo_yu_ye    ],
    ["bn", jamo_yu_u     ],
    ["bm", jamo_yu_i     ],
    ["mn", jamo_eu_u     ],
    ["mm", jamo_eu_eu    ],
    ["mln", jamo_eu_i_u   ],
    ["lk", jamo_i_a      ],
    ["li", jamo_i_ya     ],
    ["lh", jamo_i_o      ],
    ["ln", jamo_i_u      ],
    ["lm", jamo_i_eu     ],
    ["lK", jamo_i_aa     ],
    ["K", jamo_aa       ],
    ["Kj", jamo_aa_eo    ],
    ["Kn", jamo_aa_u     ],
    ["Kl", jamo_aa_i     ],
    ["KK", jamo_aa_aa    ],
    ////////////////////////////////////
    ["rf", jamo_g_r   ],
    ["rtr", jamo_g_s_g ],
    ["rs", jamo_g_n   ],
    ["rq", jamo_g_b   ],
    ["rc", jamo_g_c   ],
    ["rz", jamo_g_k   ],
    ["rg", jamo_g_h   ],
    ["st", jamo_n_s   ],
    ["sA", jamo_n_z   ],
    ["sx", jamo_n_t   ],
    ["frt", jamo_r_g_s ],
    ["far", jamo_r_m_g ],
    ["fat", jamo_r_m_s ],
    ["fqt", jamo_r_b_s ],
    ["fqg", jamo_r_b_h ],
    ["fqS", jamo_r_b_x ],
    ["ftt", jamo_r_s_s ],
    ["fe", jamo_r_d   ],
    ["feg", jamo_r_d_h ],
    ["fA", jamo_r_z   ],
    ["fz", jamo_r_k   ],
    ["fG", jamo_r_q   ],
    ["ar", jamo_m_g   ],
    ["af", jamo_m_r   ],
    ["at", jamo_m_s   ],
    ["att", jamo_m_s_s ],
    ["aA", jamo_m_z   ],
    ["ac", jamo_m_c   ],
    ["ag", jamo_m_h   ],
    ["qf", jamo_b_r   ],
    ["qg", jamo_b_h   ],
    ["drr", jamo_x_g_g ],
    ["dz", jamo_x_k   ],
    ["gs", jamo_h_n   ],
    ["gf", jamo_h_r   ],
    ["ga", jamo_h_m   ],
    ["gq", jamo_h_b   ],
    ["Dt", jamo_ng_s  ],
    ["DA", jamo_ng_z  ],
]);

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

// Convert the given final consonant input into an initial consonant
function convertFinToInit(previousJamoKeypress) {
	var jamoMapValue = jamoMap.get(previousJamoKeypress);
	var newChar = undefined;

	if (jamoMapValue !== undefined) {
		console.log("FIN->INIT: All good. " + jamoMapValue.toString());
		if (jamoMapValue.decomposed !== undefined) {
			newChar = jamoMapValue.decomposed;
		} else {
			newChar = (jamoMapValue.initial !== undefined) ? jamoMapValue.initial : "";
		}
	} else {
		console.log("FIN->INIT: nothing was found FOR REAL");
	}

	if (newChar !== undefined) {
		return newChar;
	} else {
		return "";
	}
}

// Get the next jamo to be inserted
function getNextJamo(jamoMapValue, lastChar) {
	// INITIAL
	if (jamoMapValue.initial !== undefined
				&& !jamoMapValue.hasMultipleJamo()) {
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
