/**
 * Copyright 2021 Perry Hartono (pcdandy)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
function Jamo(parent, keypress, type, letter, decomposed) {
  this.parent = parent; // The parent of this jamo (if it's composed of multiple jamos)
  this.keypress = keypress; // Keypresses required to input this jamo
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
 * > ㅊ is transliterated to 'c' since the 'h' in 'ch' is redundant
 * > ㄹ is always transliterated to 'r', never 'l'
 * > ㅇ is transliterated 'x', the archaic variant ᅌ (with short vertical stroke) is 'ng'
 * > The bottom part of letters like 'ᄫ' and 'ᄛ' is transliterated 'S'
 * > ᅀ is transliterated 'z'
 * > ᆞ (arae-a) is transliterated 'v'
 * > If a jamo letter is made up of other jamos, its name is composed of the names
 *   of the component jamos, separated by an underscore
 */

// Null jamo
var jamo_nil = undefined;

// INITIALS
var jamo_init_filler   = new Jamo(jamo_nil, "Y", JAMO_INITIAL, 'ᅟ', undefined);
var jamo_init_g        = new Jamo(jamo_nil, "r", JAMO_INITIAL, 'ᄀ', undefined);
var jamo_init_gg       = new Jamo(jamo_nil, "R", JAMO_INITIAL, 'ᄁ', undefined);
var jamo_init_n        = new Jamo(jamo_nil, "s", JAMO_INITIAL, 'ᄂ', undefined);
var jamo_init_d        = new Jamo(jamo_nil, "e", JAMO_INITIAL, 'ᄃ', undefined);
var jamo_init_dd       = new Jamo(jamo_nil, "E", JAMO_INITIAL, 'ᄄ', undefined);
var jamo_init_r        = new Jamo(jamo_nil, "f", JAMO_INITIAL, 'ᄅ', undefined);
var jamo_init_m        = new Jamo(jamo_nil, "a", JAMO_INITIAL, 'ᄆ', undefined);
var jamo_init_b        = new Jamo(jamo_nil, "q", JAMO_INITIAL, 'ᄇ', undefined);
var jamo_init_bb       = new Jamo(jamo_nil, "Q", JAMO_INITIAL, 'ᄈ', undefined);
var jamo_init_s        = new Jamo(jamo_nil, "t", JAMO_INITIAL, 'ᄉ', undefined);
var jamo_init_ss       = new Jamo(jamo_nil, "T", JAMO_INITIAL, 'ᄊ', undefined);
var jamo_init_x        = new Jamo(jamo_nil, "d", JAMO_INITIAL, 'ᄋ', undefined);
var jamo_init_j        = new Jamo(jamo_nil, "w", JAMO_INITIAL, 'ᄌ', undefined);
var jamo_init_jj       = new Jamo(jamo_nil, "W", JAMO_INITIAL, 'ᄍ', undefined);
var jamo_init_c        = new Jamo(jamo_nil, "c", JAMO_INITIAL, 'ᄎ', undefined);
var jamo_init_k        = new Jamo(jamo_nil, "z", JAMO_INITIAL, 'ᄏ', undefined);
var jamo_init_t        = new Jamo(jamo_nil, "x", JAMO_INITIAL, 'ᄐ', undefined);
var jamo_init_p        = new Jamo(jamo_nil, "v", JAMO_INITIAL, 'ᄑ', undefined);
var jamo_init_h        = new Jamo(jamo_nil, "g", JAMO_INITIAL, 'ᄒ', undefined);
var jamo_init_s_left   = new Jamo(jamo_nil, "Z", JAMO_INITIAL, 'ᄼ', undefined);
var jamo_init_s_right  = new Jamo(jamo_nil, "X", JAMO_INITIAL, 'ᄾ', undefined);
var jamo_init_z        = new Jamo(jamo_nil, "A", JAMO_INITIAL, 'ᅀ', undefined);
var jamo_init_ng       = new Jamo(jamo_nil, "D", JAMO_INITIAL, 'ᅌ', undefined);
var jamo_init_j_left   = new Jamo(jamo_nil, "C", JAMO_INITIAL, 'ᅎ', undefined);
var jamo_init_j_right  = new Jamo(jamo_nil, "V", JAMO_INITIAL, 'ᅐ', undefined);
var jamo_init_c_left   = new Jamo(jamo_nil, "B", JAMO_INITIAL, 'ᅔ', undefined);
var jamo_init_c_right  = new Jamo(jamo_nil, "N", JAMO_INITIAL, 'ᅕ', undefined);
var jamo_init_q        = new Jamo(jamo_nil, "G", JAMO_INITIAL, 'ᅙ', undefined);
var jamo_init_high     = new Jamo(jamo_nil, "F", JAMO_INITIAL, '〮', undefined);
var jamo_init_ris      = new Jamo(jamo_nil, "H", JAMO_INITIAL, '〯', undefined);

var jamo_init_ss_left  = new Jamo(jamo_init_s_left, "ZZ", JAMO_INITIAL, 'ᄽ', undefined);
var jamo_init_ss_right = new Jamo(jamo_init_s_right, "XX", JAMO_INITIAL, 'ᄿ', undefined);
var jamo_init_jj_left  = new Jamo(jamo_init_j_left, "CC", JAMO_INITIAL, 'ᅏ', undefined);
var jamo_init_jj_right = new Jamo(jamo_init_j_right, "VV", JAMO_INITIAL, 'ᅑ', undefined);

// INITIAL CLUSTERS
var jamo_init_g_d  = new Jamo(jamo_init_g,  "re", JAMO_INITIAL, 'ᅚ', undefined);
var jamo_init_n_g  = new Jamo(jamo_init_n,  "sr", JAMO_INITIAL, 'ᄓ', undefined);
var jamo_init_n_n  = new Jamo(jamo_init_n,  "ss", JAMO_INITIAL, 'ᄔ', undefined);
var jamo_init_n_d  = new Jamo(jamo_init_n,  "se", JAMO_INITIAL, 'ᄕ', undefined);
var jamo_init_n_b  = new Jamo(jamo_init_n,  "sq", JAMO_INITIAL, 'ᄖ', undefined);
var jamo_init_n_s  = new Jamo(jamo_init_n,  "st", JAMO_INITIAL, 'ᅛ', undefined);
var jamo_init_n_j  = new Jamo(jamo_init_n,  "sw", JAMO_INITIAL, 'ᅜ', undefined);
var jamo_init_n_h  = new Jamo(jamo_init_n,  "sg", JAMO_INITIAL, 'ᅝ', undefined);
var jamo_init_d_g  = new Jamo(jamo_init_d,  "er", JAMO_INITIAL, 'ᄗ', undefined);
var jamo_init_d_r  = new Jamo(jamo_init_d,  "ef", JAMO_INITIAL, 'ᅞ', undefined);
var jamo_init_r_n  = new Jamo(jamo_init_r,  "fs", JAMO_INITIAL, 'ᄘ', undefined);
var jamo_init_r_r  = new Jamo(jamo_init_r,  "ff", JAMO_INITIAL, 'ᄙ', undefined);
var jamo_init_r_h  = new Jamo(jamo_init_r,  "fg", JAMO_INITIAL, 'ᄚ', undefined);
var jamo_init_r_S  = new Jamo(jamo_init_r,  "fS", JAMO_INITIAL, 'ᄛ', undefined);
var jamo_init_m_b  = new Jamo(jamo_init_m,  "aq", JAMO_INITIAL, 'ᄜ', undefined);
var jamo_init_m_S  = new Jamo(jamo_init_m,  "aS", JAMO_INITIAL, 'ᄝ', undefined);
var jamo_init_b_g  = new Jamo(jamo_init_b,  "qr", JAMO_INITIAL, 'ᄞ', undefined);
var jamo_init_b_n  = new Jamo(jamo_init_b,  "qs", JAMO_INITIAL, 'ᄟ', undefined);
var jamo_init_b_d  = new Jamo(jamo_init_b,  "qe", JAMO_INITIAL, 'ᄠ', undefined);
var jamo_init_b_s  = new Jamo(jamo_init_b,  "qt", JAMO_INITIAL, 'ᄡ', undefined);
var jamo_init_b_j  = new Jamo(jamo_init_b,  "qw", JAMO_INITIAL, 'ᄧ', undefined);
var jamo_init_b_c  = new Jamo(jamo_init_b,  "qc", JAMO_INITIAL, 'ᄨ', undefined);
var jamo_init_b_t  = new Jamo(jamo_init_b,  "qx", JAMO_INITIAL, 'ᄩ', undefined);
var jamo_init_b_p  = new Jamo(jamo_init_b,  "qv", JAMO_INITIAL, 'ᄪ', undefined);
var jamo_init_b_S  = new Jamo(jamo_init_b,  "qS", JAMO_INITIAL, 'ᄫ', undefined);
var jamo_init_b_ss = new Jamo(jamo_init_b, "qT", JAMO_INITIAL, 'ᄥ', undefined);
var jamo_init_bb_S = new Jamo(jamo_init_bb, "QS", JAMO_INITIAL, 'ᄬ', undefined);
var jamo_init_s_g  = new Jamo(jamo_init_s,  "tr", JAMO_INITIAL, 'ᄭ', undefined);
var jamo_init_s_n  = new Jamo(jamo_init_s,  "ts", JAMO_INITIAL, 'ᄮ', undefined);
var jamo_init_s_d  = new Jamo(jamo_init_s,  "te", JAMO_INITIAL, 'ᄯ', undefined);
var jamo_init_s_r  = new Jamo(jamo_init_s,  "tf", JAMO_INITIAL, 'ᄰ', undefined);
var jamo_init_s_m  = new Jamo(jamo_init_s,  "ta", JAMO_INITIAL, 'ᄱ', undefined);
var jamo_init_s_b  = new Jamo(jamo_init_s,  "tq", JAMO_INITIAL, 'ᄲ', undefined);
var jamo_init_s_x  = new Jamo(jamo_init_s,  "td", JAMO_INITIAL, 'ᄵ', undefined);
var jamo_init_s_j  = new Jamo(jamo_init_s,  "tw", JAMO_INITIAL, 'ᄶ', undefined);
var jamo_init_s_c  = new Jamo(jamo_init_s,  "tc", JAMO_INITIAL, 'ᄷ', undefined);
var jamo_init_s_k  = new Jamo(jamo_init_s,  "tz", JAMO_INITIAL, 'ᄸ', undefined);
var jamo_init_s_t  = new Jamo(jamo_init_s,  "tx", JAMO_INITIAL, 'ᄹ', undefined);
var jamo_init_s_p  = new Jamo(jamo_init_s,  "tv", JAMO_INITIAL, 'ᄺ', undefined);
var jamo_init_s_h  = new Jamo(jamo_init_s,  "tg", JAMO_INITIAL, 'ᄻ', undefined);
var jamo_init_ss_s = new Jamo(jamo_init_ss, "Tt", JAMO_INITIAL, 'ᄴ', undefined);
var jamo_init_x_g  = new Jamo(jamo_init_x,  "dr", JAMO_INITIAL, 'ᅁ', undefined);
var jamo_init_x_d  = new Jamo(jamo_init_x,  "de", JAMO_INITIAL, 'ᅂ', undefined);
var jamo_init_x_m  = new Jamo(jamo_init_x,  "da", JAMO_INITIAL, 'ᅃ', undefined);
var jamo_init_x_b  = new Jamo(jamo_init_x,  "dq", JAMO_INITIAL, 'ᅄ', undefined);
var jamo_init_x_s  = new Jamo(jamo_init_x,  "dt", JAMO_INITIAL, 'ᅅ', undefined);
var jamo_init_x_z  = new Jamo(jamo_init_x,  "dA", JAMO_INITIAL, 'ᅆ', undefined);
var jamo_init_x_x  = new Jamo(jamo_init_x,  "dd", JAMO_INITIAL, 'ᅇ', undefined);
var jamo_init_x_j  = new Jamo(jamo_init_x,  "dw", JAMO_INITIAL, 'ᅈ', undefined);
var jamo_init_x_c  = new Jamo(jamo_init_x,  "dc", JAMO_INITIAL, 'ᅉ', undefined);
var jamo_init_x_t  = new Jamo(jamo_init_x,  "dx", JAMO_INITIAL, 'ᅊ', undefined);
var jamo_init_x_p  = new Jamo(jamo_init_x,  "dv", JAMO_INITIAL, 'ᅋ', undefined);
var jamo_init_j_x  = new Jamo(jamo_init_j,  "wd", JAMO_INITIAL, 'ᅍ', undefined);
var jamo_init_c_k  = new Jamo(jamo_init_c,  "cz", JAMO_INITIAL, 'ᅒ', undefined);
var jamo_init_c_h  = new Jamo(jamo_init_c,  "cg", JAMO_INITIAL, 'ᅓ', undefined);
var jamo_init_p_b  = new Jamo(jamo_init_p,  "vq", JAMO_INITIAL, 'ᅖ', undefined);
var jamo_init_p_S  = new Jamo(jamo_init_p,  "vS", JAMO_INITIAL, 'ᅗ', undefined);
var jamo_init_h_h  = new Jamo(jamo_init_h,  "gg", JAMO_INITIAL, 'ᅘ', undefined);

var jamo_init_b_s_g = new Jamo(jamo_init_b_s, "qtr", JAMO_INITIAL, 'ᄢ', undefined);
var jamo_init_b_s_d = new Jamo(jamo_init_b_s, "qte", JAMO_INITIAL, 'ᄣ', undefined);
var jamo_init_b_s_b = new Jamo(jamo_init_b_s, "qtq", JAMO_INITIAL, 'ᄤ', undefined);
var jamo_init_b_s_j = new Jamo(jamo_init_b_s, "qtw", JAMO_INITIAL, 'ᄦ', undefined);
var jamo_init_s_b_g = new Jamo(jamo_init_s_b, "tqr", JAMO_INITIAL, 'ᄳ', undefined);

// INITIAL CLUSTERS (HANGUL JAMO EXTENDED-A)
var jamo_init_d_m   = new Jamo(jamo_init_d,   "ea",  JAMO_INITIAL, 'ꥠ', undefined);
var jamo_init_d_b   = new Jamo(jamo_init_d,   "eq",  JAMO_INITIAL, 'ꥡ', undefined);
var jamo_init_d_s   = new Jamo(jamo_init_d,   "et",  JAMO_INITIAL, 'ꥢ', undefined);
var jamo_init_d_j   = new Jamo(jamo_init_d,   "ew",  JAMO_INITIAL, 'ꥣ', undefined);
var jamo_init_r_g   = new Jamo(jamo_init_r,   "fr",  JAMO_INITIAL, 'ꥤ', undefined);
var jamo_init_r_gg  = new Jamo(jamo_init_r,   "fR",  JAMO_INITIAL, 'ꥥ', undefined);
var jamo_init_r_d   = new Jamo(jamo_init_r,   "fe",  JAMO_INITIAL, 'ꥦ', undefined);
var jamo_init_r_dd  = new Jamo(jamo_init_r,   "fE",  JAMO_INITIAL, 'ꥧ', undefined);
var jamo_init_r_m   = new Jamo(jamo_init_r,   "fa",  JAMO_INITIAL, 'ꥨ', undefined);
var jamo_init_r_b   = new Jamo(jamo_init_r,   "fq",  JAMO_INITIAL, 'ꥩ', undefined);
var jamo_init_r_bb  = new Jamo(jamo_init_r,   "fQ",  JAMO_INITIAL, 'ꥪ', undefined);
var jamo_init_r_b_S = new Jamo(jamo_init_r_b, "fqS", JAMO_INITIAL, 'ꥫ', undefined);
var jamo_init_r_s   = new Jamo(jamo_init_r,   "ft",  JAMO_INITIAL, 'ꥬ', undefined);
var jamo_init_r_j   = new Jamo(jamo_init_r,   "fw",  JAMO_INITIAL, 'ꥭ', undefined);
var jamo_init_r_k   = new Jamo(jamo_init_r,   "fz",  JAMO_INITIAL, 'ꥮ', undefined);
var jamo_init_m_g   = new Jamo(jamo_init_m,   "ar",  JAMO_INITIAL, 'ꥯ', undefined);
var jamo_init_m_d   = new Jamo(jamo_init_m,   "ae",  JAMO_INITIAL, 'ꥰ', undefined);
var jamo_init_m_s   = new Jamo(jamo_init_m,   "at",  JAMO_INITIAL, 'ꥱ', undefined);
var jamo_init_b_s_t = new Jamo(jamo_init_b_s, "qtx", JAMO_INITIAL, 'ꥲ', undefined);
var jamo_init_b_k   = new Jamo(jamo_init_b,   "qz",  JAMO_INITIAL, 'ꥳ', undefined);
var jamo_init_b_h   = new Jamo(jamo_init_b,   "qg",  JAMO_INITIAL, 'ꥴ', undefined);
var jamo_init_ss_b  = new Jamo(jamo_init_ss,  "Tq",  JAMO_INITIAL, 'ꥵ', undefined);
var jamo_init_x_r   = new Jamo(jamo_init_x,   "df",  JAMO_INITIAL, 'ꥶ', undefined);
var jamo_init_x_h   = new Jamo(jamo_init_x,   "dg",  JAMO_INITIAL, 'ꥷ', undefined);
var jamo_init_jj_g  = new Jamo(jamo_init_jj,  "Wg",  JAMO_INITIAL, 'ꥸ', undefined);
var jamo_init_t_t   = new Jamo(jamo_init_t,   "xx",  JAMO_INITIAL, 'ꥹ', undefined);
var jamo_init_p_h   = new Jamo(jamo_init_p,   "vg",  JAMO_INITIAL, 'ꥺ', undefined);
var jamo_init_h_t   = new Jamo(jamo_init_h,   "gt",  JAMO_INITIAL, 'ꥻ', undefined);
var jamo_init_q_q   = new Jamo(jamo_init_q,   "GG",  JAMO_INITIAL, 'ꥼ', undefined);

// MEDIALS
var jamo_med_filler = new Jamo(jamo_nil, "U", JAMO_MEDIAL, 'ᅠ', undefined);
var jamo_med_a   = new Jamo(jamo_nil, "k", JAMO_MEDIAL, 'ᅡ', undefined);
var jamo_med_ae  = new Jamo(jamo_nil, "o", JAMO_MEDIAL, 'ᅢ', undefined);
var jamo_med_ya  = new Jamo(jamo_nil, "i", JAMO_MEDIAL, 'ᅣ', undefined);
var jamo_med_yae = new Jamo(jamo_nil, "O", JAMO_MEDIAL, 'ᅤ', undefined);
var jamo_med_eo  = new Jamo(jamo_nil, "j", JAMO_MEDIAL, 'ᅥ', undefined);
var jamo_med_e   = new Jamo(jamo_nil, "p", JAMO_MEDIAL, 'ᅦ', undefined);
var jamo_med_yeo = new Jamo(jamo_nil, "u", JAMO_MEDIAL, 'ᅧ', undefined);
var jamo_med_ye  = new Jamo(jamo_nil, "P", JAMO_MEDIAL, 'ᅨ', undefined);
var jamo_med_o   = new Jamo(jamo_nil, "h", JAMO_MEDIAL, 'ᅩ', undefined);
var jamo_med_yo  = new Jamo(jamo_nil, "y", JAMO_MEDIAL, 'ᅭ', undefined);
var jamo_med_u   = new Jamo(jamo_nil, "n", JAMO_MEDIAL, 'ᅮ', undefined);
var jamo_med_yu  = new Jamo(jamo_nil, "b", JAMO_MEDIAL, 'ᅲ', undefined);
var jamo_med_eu  = new Jamo(jamo_nil, "m", JAMO_MEDIAL, 'ᅳ', undefined);
var jamo_med_i   = new Jamo(jamo_nil, "l", JAMO_MEDIAL, 'ᅵ', undefined);
var jamo_med_v   = new Jamo(jamo_nil, "K", JAMO_MEDIAL, 'ᆞ', undefined);

// MEDIAL CLUSTERS
var jamo_med_a_o    = new Jamo(jamo_med_a,   "kh", JAMO_MEDIAL, 'ᅶ', undefined);
var jamo_med_a_u    = new Jamo(jamo_med_a,   "kn", JAMO_MEDIAL, 'ᅷ', undefined);
var jamo_med_a_eu   = new Jamo(jamo_med_a,   "km", JAMO_MEDIAL, 'ᆣ', undefined);
var jamo_med_ya_o   = new Jamo(jamo_med_ya,  "ih", JAMO_MEDIAL, 'ᅸ', undefined);
var jamo_med_ya_yo  = new Jamo(jamo_med_ya,  "iy", JAMO_MEDIAL, 'ᅹ', undefined);
var jamo_med_ya_u   = new Jamo(jamo_med_ya,  "in", JAMO_MEDIAL, 'ᆤ', undefined);
var jamo_med_eo_o   = new Jamo(jamo_med_eo,  "jh", JAMO_MEDIAL, 'ᅺ', undefined);
var jamo_med_eo_u   = new Jamo(jamo_med_eo,  "jn", JAMO_MEDIAL, 'ᅻ', undefined);
var jamo_med_eo_eu  = new Jamo(jamo_med_eo,  "jm", JAMO_MEDIAL, 'ᅼ', undefined);
var jamo_med_yeo_ya = new Jamo(jamo_med_yeo, "ui", JAMO_MEDIAL, 'ᆥ', undefined);
var jamo_med_yeo_o  = new Jamo(jamo_med_yeo, "uh", JAMO_MEDIAL, 'ᅽ', undefined);
var jamo_med_yeo_u  = new Jamo(jamo_med_yeo, "un", JAMO_MEDIAL, 'ᅾ', undefined);
var jamo_med_o_a    = new Jamo(jamo_med_o,   "hk", JAMO_MEDIAL, 'ᅪ', undefined);
var jamo_med_o_ae   = new Jamo(jamo_med_o,   "ho", JAMO_MEDIAL, 'ᅫ', undefined);
var jamo_med_o_i    = new Jamo(jamo_med_o,   "hl", JAMO_MEDIAL, 'ᅬ', undefined);
var jamo_med_o_eo   = new Jamo(jamo_med_o,   "hj", JAMO_MEDIAL, 'ᅿ', undefined);
var jamo_med_o_e    = new Jamo(jamo_med_o,   "hp", JAMO_MEDIAL, 'ᆀ', undefined);
var jamo_med_o_ye   = new Jamo(jamo_med_o,   "hP", JAMO_MEDIAL, 'ᆁ', undefined);
var jamo_med_o_o    = new Jamo(jamo_med_o,   "hh", JAMO_MEDIAL, 'ᆂ', undefined);
var jamo_med_o_u    = new Jamo(jamo_med_o,   "hn", JAMO_MEDIAL, 'ᆃ', undefined);
var jamo_med_o_ya   = new Jamo(jamo_med_o,   "hi", JAMO_MEDIAL, 'ᆦ', undefined);
var jamo_med_o_yae  = new Jamo(jamo_med_o,   "hO", JAMO_MEDIAL, 'ᆧ', undefined);
var jamo_med_yo_ya  = new Jamo(jamo_med_yo,  "yi", JAMO_MEDIAL, 'ᆄ', undefined);
var jamo_med_yo_yae = new Jamo(jamo_med_yo,  "yO", JAMO_MEDIAL, 'ᆅ', undefined);
var jamo_med_yo_yeo = new Jamo(jamo_med_yo,  "yu", JAMO_MEDIAL, 'ᆆ', undefined);
var jamo_med_yo_o   = new Jamo(jamo_med_yo,  "yh", JAMO_MEDIAL, 'ᆇ', undefined);
var jamo_med_yo_i   = new Jamo(jamo_med_yo,  "yl", JAMO_MEDIAL, 'ᆈ', undefined);
var jamo_med_u_eo   = new Jamo(jamo_med_u,   "nj", JAMO_MEDIAL, 'ᅯ', undefined);
var jamo_med_u_e    = new Jamo(jamo_med_u,   "np", JAMO_MEDIAL, 'ᅰ', undefined);
var jamo_med_u_i    = new Jamo(jamo_med_u,   "nl", JAMO_MEDIAL, 'ᅱ', undefined);
var jamo_med_u_a    = new Jamo(jamo_med_u,   "nk", JAMO_MEDIAL, 'ᆉ', undefined);
var jamo_med_u_ae   = new Jamo(jamo_med_u,   "no", JAMO_MEDIAL, 'ᆊ', undefined);
var jamo_med_u_ye   = new Jamo(jamo_med_u,   "nP", JAMO_MEDIAL, 'ᆌ', undefined);
var jamo_med_u_u    = new Jamo(jamo_med_u,   "nn", JAMO_MEDIAL, 'ᆍ', undefined);
var jamo_med_yu_a   = new Jamo(jamo_med_yu,  "bk", JAMO_MEDIAL, 'ᆎ', undefined);
var jamo_med_yu_eo  = new Jamo(jamo_med_yu,  "bj", JAMO_MEDIAL, 'ᆏ', undefined);
var jamo_med_yu_e   = new Jamo(jamo_med_yu,  "bp", JAMO_MEDIAL, 'ᆐ', undefined);
var jamo_med_yu_eo  = new Jamo(jamo_med_yu,  "bj", JAMO_MEDIAL, 'ᆑ', undefined);
var jamo_med_yu_ye  = new Jamo(jamo_med_yu,  "bP", JAMO_MEDIAL, 'ᆒ', undefined);
var jamo_med_yu_u   = new Jamo(jamo_med_yu,  "bn", JAMO_MEDIAL, 'ᆓ', undefined);
var jamo_med_yu_i   = new Jamo(jamo_med_yu,  "bl", JAMO_MEDIAL, 'ᆔ', undefined);
var jamo_med_eu_i   = new Jamo(jamo_med_eu,  "ml", JAMO_MEDIAL, 'ᅴ', undefined);
var jamo_med_eu_u   = new Jamo(jamo_med_eu,  "mn", JAMO_MEDIAL, 'ᆕ', undefined);
var jamo_med_eu_eu  = new Jamo(jamo_med_eu,  "mm", JAMO_MEDIAL, 'ᆖ', undefined);
var jamo_med_i_a    = new Jamo(jamo_med_i,   "lk", JAMO_MEDIAL, 'ᆘ', undefined);
var jamo_med_i_ya   = new Jamo(jamo_med_i,   "li", JAMO_MEDIAL, 'ᆙ', undefined);
var jamo_med_i_o    = new Jamo(jamo_med_i,   "lh", JAMO_MEDIAL, 'ᆚ', undefined);
var jamo_med_i_u    = new Jamo(jamo_med_i,   "ln", JAMO_MEDIAL, 'ᆛ', undefined);
var jamo_med_i_eu   = new Jamo(jamo_med_i,   "lm", JAMO_MEDIAL, 'ᆜ', undefined);
var jamo_med_i_v    = new Jamo(jamo_med_i,   "lK", JAMO_MEDIAL, 'ᆝ', undefined);
var jamo_med_v_eo   = new Jamo(jamo_med_v,   "Kj", JAMO_MEDIAL, 'ᆟ', undefined);
var jamo_med_v_u    = new Jamo(jamo_med_v,   "Kn", JAMO_MEDIAL, 'ᆠ', undefined);
var jamo_med_v_i    = new Jamo(jamo_med_v,   "Kl", JAMO_MEDIAL, 'ᆡ', undefined);
var jamo_med_v_v    = new Jamo(jamo_med_v,   "KK", JAMO_MEDIAL, 'ᆢ', undefined);

var jamo_med_u_eo_eu = new Jamo(jamo_med_u_eo, "njm", JAMO_MEDIAL, 'ᆋ', undefined);
var jamo_med_eu_i_u  = new Jamo(jamo_med_eu_i, "mln", JAMO_MEDIAL, 'ᆗ', undefined);

// MEDIAL CLUSTERS (HANGUL JAMO EXTENDED-B)
var jamo_med_o_yeo  = new Jamo(jamo_med_o,    "hu", JAMO_MEDIAL,  'ힰ', undefined);
var jamo_med_o_o_i  = new Jamo(jamo_med_o_o,  "hhl", JAMO_MEDIAL, 'ힱ', undefined);
var jamo_med_yo_a   = new Jamo(jamo_med_yo,   "yk", JAMO_MEDIAL,  'ힲ', undefined);
var jamo_med_yo_ae  = new Jamo(jamo_med_yo,   "yo", JAMO_MEDIAL,  'ힳ', undefined);
var jamo_med_yo_eo  = new Jamo(jamo_med_yo,   "yj", JAMO_MEDIAL,  'ힴ', undefined);
var jamo_med_u_yeo  = new Jamo(jamo_med_u,    "nu", JAMO_MEDIAL,  'ힵ', undefined);
var jamo_med_u_i_i  = new Jamo(jamo_med_u_i,  "nll", JAMO_MEDIAL,  'ힶ', undefined);
var jamo_med_yu_ae  = new Jamo(jamo_med_yu,   "bo", JAMO_MEDIAL,  'ힷ', undefined);
var jamo_med_yu_o   = new Jamo(jamo_med_yu,   "bh", JAMO_MEDIAL,  'ힸ', undefined);
var jamo_med_eu_a   = new Jamo(jamo_med_eu,   "mk", JAMO_MEDIAL,  'ힹ', undefined);
var jamo_med_eu_eo  = new Jamo(jamo_med_eu,   "mj", JAMO_MEDIAL,  'ힺ', undefined);
var jamo_med_eu_e   = new Jamo(jamo_med_eu,   "mp", JAMO_MEDIAL,  'ힻ', undefined);
var jamo_med_eu_o   = new Jamo(jamo_med_eu,   "mh", JAMO_MEDIAL,  'ힼ', undefined);
var jamo_med_i_ya_o = new Jamo(jamo_med_i_ya, "lih", JAMO_MEDIAL, 'ힽ', undefined);
var jamo_med_i_yae  = new Jamo(jamo_med_i,    "lO", JAMO_MEDIAL,  'ힾ', undefined);
var jamo_med_i_yeo  = new Jamo(jamo_med_i,    "lU", JAMO_MEDIAL,  'ힿ', undefined);
var jamo_med_i_ye   = new Jamo(jamo_med_i,    "lP", JAMO_MEDIAL,  'ퟀ', undefined);
var jamo_med_i_o_i  = new Jamo(jamo_med_i_o,  "lhl", JAMO_MEDIAL, 'ퟁ', undefined);
var jamo_med_i_yo   = new Jamo(jamo_med_i,    "ly", JAMO_MEDIAL,  'ퟂ', undefined);
var jamo_med_i_yu   = new Jamo(jamo_med_i,    "lb", JAMO_MEDIAL,  'ퟃ', undefined);
var jamo_med_i_i    = new Jamo(jamo_med_i,    "ll", JAMO_MEDIAL,  'ퟄ', undefined);
var jamo_med_v_a    = new Jamo(jamo_med_v,    "Kk", JAMO_MEDIAL,  'ퟅ', undefined);
var jamo_med_v_e    = new Jamo(jamo_med_v,    "Kp", JAMO_MEDIAL,  'ퟆ', undefined);

// FINALS
var jamo_fin_g  = new Jamo(jamo_nil, "r", JAMO_FINAL, 'ᆨ', "ᄀ");
var jamo_fin_gg = new Jamo(jamo_nil, "R", JAMO_FINAL, 'ᆩ', "ᄁ");
var jamo_fin_n  = new Jamo(jamo_nil, "s", JAMO_FINAL, 'ᆫ', "ᄂ");
var jamo_fin_d  = new Jamo(jamo_nil, "e", JAMO_FINAL, 'ᆮ', "ᄃ");
var jamo_fin_r  = new Jamo(jamo_nil, "f", JAMO_FINAL, 'ᆯ', "ᄅ");
var jamo_fin_m  = new Jamo(jamo_nil, "a", JAMO_FINAL, 'ᆷ', "ᄆ");
var jamo_fin_b  = new Jamo(jamo_nil, "q", JAMO_FINAL, 'ᆸ', "ᄇ");
var jamo_fin_s  = new Jamo(jamo_nil, "t", JAMO_FINAL, 'ᆺ', "ᄉ");
var jamo_fin_ss = new Jamo(jamo_nil, "T", JAMO_FINAL, 'ᆻ', "ᄊ");
var jamo_fin_x  = new Jamo(jamo_nil, "d", JAMO_FINAL, 'ᆼ', "ᄋ");
var jamo_fin_j  = new Jamo(jamo_nil, "w", JAMO_FINAL, 'ᆽ', "ᄌ");
var jamo_fin_c  = new Jamo(jamo_nil, "c", JAMO_FINAL, 'ᆾ', "ᄎ");
var jamo_fin_k  = new Jamo(jamo_nil, "z", JAMO_FINAL, 'ᆿ', "ᄏ");
var jamo_fin_t  = new Jamo(jamo_nil, "x", JAMO_FINAL, 'ᇀ', "ᄐ");
var jamo_fin_p  = new Jamo(jamo_nil, "v", JAMO_FINAL, 'ᇁ', "ᄑ");
var jamo_fin_h  = new Jamo(jamo_nil, "g", JAMO_FINAL, 'ᇂ', "ᄒ");
var jamo_fin_z  = new Jamo(jamo_nil, "A", JAMO_FINAL, 'ᇫ', "ᅀ");
var jamo_fin_ng = new Jamo(jamo_nil, "D", JAMO_FINAL, 'ᇰ', "ᅌ");
var jamo_fin_q  = new Jamo(jamo_nil, "G", JAMO_FINAL, 'ᇹ', "ᅙ");

// FINAL CLUSTERS
var jamo_fin_g_r   = new Jamo(jamo_fin_g,  "rf", JAMO_FINAL, 'ᇃ', "ᆨᄅ");
var jamo_fin_g_s   = new Jamo(jamo_fin_g,  "rt", JAMO_FINAL, 'ᆪ', "ᆨᄉ");
var jamo_fin_g_n   = new Jamo(jamo_fin_g,  "rs", JAMO_FINAL, 'ᇺ', "ᆨᄂ");
var jamo_fin_g_b   = new Jamo(jamo_fin_g,  "rq", JAMO_FINAL, 'ᇻ', "ᆨᄇ");
var jamo_fin_g_c   = new Jamo(jamo_fin_g,  "rc", JAMO_FINAL, 'ᇼ', "ᆨᄎ");
var jamo_fin_g_k   = new Jamo(jamo_fin_g,  "rz", JAMO_FINAL, 'ᇽ', "ᆨᄏ");
var jamo_fin_g_h   = new Jamo(jamo_fin_g,  "rg", JAMO_FINAL, 'ᇾ', "ᆨᄒ");
var jamo_fin_n_j   = new Jamo(jamo_fin_n,  "sw", JAMO_FINAL, 'ᆬ', "ᆫᄌ");
var jamo_fin_n_h   = new Jamo(jamo_fin_n,  "sg", JAMO_FINAL, 'ᆭ', "ᆫᄒ");
var jamo_fin_n_g   = new Jamo(jamo_fin_n,  "sr", JAMO_FINAL, 'ᇅ', "ᆫᄀ");
var jamo_fin_n_d   = new Jamo(jamo_fin_n,  "se", JAMO_FINAL, 'ᇆ', "ᆫᄃ");
var jamo_fin_n_s   = new Jamo(jamo_fin_n,  "st", JAMO_FINAL, 'ᇇ', "ᆫᄉ");
var jamo_fin_n_z   = new Jamo(jamo_fin_n,  "sA", JAMO_FINAL, 'ᇈ', "ᆫᅀ");
var jamo_fin_n_t   = new Jamo(jamo_fin_n,  "sx", JAMO_FINAL, 'ᇉ', "ᆫᄐ");
var jamo_fin_n_n   = new Jamo(jamo_fin_n,  "ss", JAMO_FINAL, 'ᇿ', "ᆫᄂ");
var jamo_fin_d_g   = new Jamo(jamo_fin_d,  "er", JAMO_FINAL, 'ᇊ', "ᆮᄀ");
var jamo_fin_d_r   = new Jamo(jamo_fin_d,  "ef", JAMO_FINAL, 'ᇋ', "ᆮᄅ");
var jamo_fin_r_g   = new Jamo(jamo_fin_r,  "fr", JAMO_FINAL, 'ᆰ', "ᆯᄀ");
var jamo_fin_r_m   = new Jamo(jamo_fin_r,  "fa", JAMO_FINAL, 'ᆱ', "ᆯᄆ");
var jamo_fin_r_b   = new Jamo(jamo_fin_r,  "fq", JAMO_FINAL, 'ᆲ', "ᆯᄇ");
var jamo_fin_r_s   = new Jamo(jamo_fin_r,  "ft", JAMO_FINAL, 'ᆳ', "ᆯᄉ");
var jamo_fin_r_ss  = new Jamo(jamo_fin_r,  "fT", JAMO_FINAL, 'ᇖ', "ᆯᄊ");
var jamo_fin_r_t   = new Jamo(jamo_fin_r,  "fx", JAMO_FINAL, 'ᆴ', "ᆯᄐ");
var jamo_fin_r_p   = new Jamo(jamo_fin_r,  "fv", JAMO_FINAL, 'ᆵ', "ᆯᄑ");
var jamo_fin_r_h   = new Jamo(jamo_fin_r,  "fg", JAMO_FINAL, 'ᆶ', "ᆯᄒ");
var jamo_fin_r_n   = new Jamo(jamo_fin_r,  "fs", JAMO_FINAL, 'ᇍ', "ᆯᄂ");
var jamo_fin_r_d   = new Jamo(jamo_fin_r,  "fe", JAMO_FINAL, 'ᇎ', "ᆯᄃ");
var jamo_fin_r_r   = new Jamo(jamo_fin_r,  "ff", JAMO_FINAL, 'ᇐ', "ᆯᄅ");
var jamo_fin_r_z   = new Jamo(jamo_fin_r,  "fA", JAMO_FINAL, 'ᇗ', "ᆯᅀ");
var jamo_fin_r_k   = new Jamo(jamo_fin_r,  "fz", JAMO_FINAL, 'ᇘ', "ᆯᄏ");
var jamo_fin_r_q   = new Jamo(jamo_fin_r,  "fG", JAMO_FINAL, 'ᇙ', "ᆯᅙ");
var jamo_fin_m_g   = new Jamo(jamo_fin_m,  "ar", JAMO_FINAL, 'ᇚ', "ᆷᄀ");
var jamo_fin_m_r   = new Jamo(jamo_fin_m,  "af", JAMO_FINAL, 'ᇛ', "ᆷᄅ");
var jamo_fin_m_b   = new Jamo(jamo_fin_m,  "aq", JAMO_FINAL, 'ᇜ', "ᆷᄇ");
var jamo_fin_m_s   = new Jamo(jamo_fin_m,  "at", JAMO_FINAL, 'ᇝ', "ᆷᄉ");
var jamo_fin_m_ss  = new Jamo(jamo_fin_m,  "aT", JAMO_FINAL, 'ᇞ', "ᆷᄊ");
var jamo_fin_m_z   = new Jamo(jamo_fin_m,  "aA", JAMO_FINAL, 'ᇟ', "ᆷᅀ");
var jamo_fin_m_c   = new Jamo(jamo_fin_m,  "ac", JAMO_FINAL, 'ᇠ', "ᆷᄎ");
var jamo_fin_m_h   = new Jamo(jamo_fin_m,  "ag", JAMO_FINAL, 'ᇡ', "ᆷᄒ");
var jamo_fin_m_S   = new Jamo(jamo_fin_m,  "aS", JAMO_FINAL, 'ᇢ', "ᄝ");
var jamo_fin_b_s   = new Jamo(jamo_fin_b,  "qt", JAMO_FINAL, 'ᆹ', "ᆸᄉ");
var jamo_fin_b_r   = new Jamo(jamo_fin_b,  "qf", JAMO_FINAL, 'ᇣ', "ᆸᄅ");
var jamo_fin_b_p   = new Jamo(jamo_fin_b,  "qv", JAMO_FINAL, 'ᇤ', "ᆸᄑ");
var jamo_fin_b_h   = new Jamo(jamo_fin_b,  "qg", JAMO_FINAL, 'ᇥ', "ᆸᄒ");
var jamo_fin_b_S   = new Jamo(jamo_fin_b,  "qS", JAMO_FINAL, 'ᇦ', "ᄫ");
var jamo_fin_s_g   = new Jamo(jamo_fin_s,  "tr", JAMO_FINAL, 'ᇧ', "ᆺᄀ");
var jamo_fin_s_d   = new Jamo(jamo_fin_s,  "te", JAMO_FINAL, 'ᇨ', "ᆺᄃ");
var jamo_fin_s_r   = new Jamo(jamo_fin_s,  "tf", JAMO_FINAL, 'ᇩ', "ᆺᄅ");
var jamo_fin_s_b   = new Jamo(jamo_fin_s,  "tq", JAMO_FINAL, 'ᇪ', "ᆺᄇ");
var jamo_fin_ng_g  = new Jamo(jamo_fin_ng, "Dr", JAMO_FINAL, 'ᇬ', "ᇰᄀ");
var jamo_fin_ng_gg = new Jamo(jamo_fin_ng, "DR", JAMO_FINAL, 'ᇭ', "ᇰᄁ");
var jamo_fin_ng_ng = new Jamo(jamo_fin_ng, "Dd", JAMO_FINAL, 'ᇮ', "ᇰᅌ");
var jamo_fin_ng_k  = new Jamo(jamo_fin_ng, "Dz", JAMO_FINAL, 'ᇯ', "ᇰᄏ");
var jamo_fin_ng_s  = new Jamo(jamo_fin_ng, "Dt", JAMO_FINAL, 'ᇱ', "ᇰᄉ");
var jamo_fin_ng_z  = new Jamo(jamo_fin_ng, "DA", JAMO_FINAL, 'ᇲ', "ᇰᅀ");
var jamo_fin_p_b   = new Jamo(jamo_fin_p,  "vq", JAMO_FINAL, 'ᇳ', "ᇁᄇ");
var jamo_fin_p_S   = new Jamo(jamo_fin_p,  "vS", JAMO_FINAL, 'ᇴ', "ᅗ");
var jamo_fin_h_n   = new Jamo(jamo_fin_h,  "gs", JAMO_FINAL, 'ᇵ', "ᇂᄂ");
var jamo_fin_h_r   = new Jamo(jamo_fin_h,  "gf", JAMO_FINAL, 'ᇶ', "ᇂᄅ");
var jamo_fin_h_m   = new Jamo(jamo_fin_h,  "ga", JAMO_FINAL, 'ᇷ', "ᇂᄆ");
var jamo_fin_h_b   = new Jamo(jamo_fin_h,  "gq", JAMO_FINAL, 'ᇸ', "ᇂᄇ");

var jamo_fin_g_s_g  = new Jamo(jamo_fin_g_s, "rtr", JAMO_FINAL, 'ᇄ', "ᆪᄀ");
var jamo_fin_r_g_s  = new Jamo(jamo_fin_r_g, "frt", JAMO_FINAL, 'ᇌ', "ᆰᄉ");
var jamo_fin_r_m_g  = new Jamo(jamo_fin_r_m, "far", JAMO_FINAL, 'ᇑ', "ᆱᄀ");
var jamo_fin_r_m_s  = new Jamo(jamo_fin_r_m, "fat", JAMO_FINAL, 'ᇒ', "ᆱᄉ");
var jamo_fin_r_b_s  = new Jamo(jamo_fin_r_b, "fqt", JAMO_FINAL, 'ᇓ', "ᆲᄉ");
var jamo_fin_r_b_h  = new Jamo(jamo_fin_r_b, "fqg", JAMO_FINAL, 'ᇔ', "ᆲᄒ");
var jamo_fin_r_b_S  = new Jamo(jamo_fin_r_b, "fqS", JAMO_FINAL, 'ᇕ', "ᆯᄫ");
var jamo_fin_r_d_h  = new Jamo(jamo_fin_r_d, "feg", JAMO_FINAL, 'ᇏ', "ᇎᄒ");

// FINALS (HANGUL JAMO EXTENDED-B)
var jamo_fin_dd    = new Jamo(jamo_nil,     "E",   JAMO_FINAL, 'ퟍ', "ᄄ");
var jamo_fin_bb    = new Jamo(jamo_nil,     "Q",   JAMO_FINAL, 'ퟦ', "ᄈ");
var jamo_fin_jj    = new Jamo(jamo_nil,     "W",   JAMO_FINAL, 'ퟹ', "ᄍ");

// FINAL CLUSTERS (HANGUL JAMO EXTENDED-B)
var jamo_fin_n_r   = new Jamo(jamo_fin_n,   "sf",  JAMO_FINAL, 'ퟋ', "ᆫᄅ");
var jamo_fin_n_c   = new Jamo(jamo_fin_n,   "sc",  JAMO_FINAL, 'ퟌ', "ᆫᄎ");
var jamo_fin_dd_b  = new Jamo(jamo_fin_dd,  "Eq",  JAMO_FINAL, 'ퟎ', "ퟍᄇ");
var jamo_fin_d_b   = new Jamo(jamo_fin_d,   "eq",  JAMO_FINAL, 'ퟏ', "ᆮᄇ");
var jamo_fin_d_s   = new Jamo(jamo_fin_d,   "et",  JAMO_FINAL, 'ퟐ', "ᆮᄉ");
var jamo_fin_d_s_g = new Jamo(jamo_fin_d_s, "etr", JAMO_FINAL, 'ퟑ', "ퟐᄀ");
var jamo_fin_d_j   = new Jamo(jamo_fin_d,   "ew",  JAMO_FINAL, 'ퟒ', "ᆮᄌ");
var jamo_fin_d_c   = new Jamo(jamo_fin_d,   "ec",  JAMO_FINAL, 'ퟓ', "ᆮᄎ");
var jamo_fin_d_t   = new Jamo(jamo_fin_d,   "ex",  JAMO_FINAL, 'ퟔ', "ᆮᄐ");
var jamo_fin_r_gg  = new Jamo(jamo_fin_r,   "fR",  JAMO_FINAL, 'ퟕ', "ᆯᄁ");
var jamo_fin_r_g_h = new Jamo(jamo_fin_r_g, "frg", JAMO_FINAL, 'ퟖ', "ᆰᄒ");
var jamo_fin_r_r_k = new Jamo(jamo_fin_r_r, "ffz", JAMO_FINAL, 'ퟗ', "ᇐᄏ");
var jamo_fin_r_m_g = new Jamo(jamo_fin_r_m, "fag", JAMO_FINAL, 'ퟘ', "ᆱᄒ");
var jamo_fin_r_b_d = new Jamo(jamo_fin_r_b, "fqe", JAMO_FINAL, 'ퟙ', "ᆲᄃ");
var jamo_fin_r_b_p = new Jamo(jamo_fin_r_b, "fqv", JAMO_FINAL, 'ퟚ', "ᆲᄑ");
var jamo_fin_r_ng  = new Jamo(jamo_fin_r,   "fD",  JAMO_FINAL, 'ퟛ', "ᆯᅌ");
var jamo_fin_r_q_h = new Jamo(jamo_fin_r_q, "fGg", JAMO_FINAL, 'ퟜ', "ᇙᄒ");
var jamo_fin_r_S   = new Jamo(jamo_fin_r,   "fS",  JAMO_FINAL, 'ퟝ', "ᄛ");
var jamo_fin_m_n   = new Jamo(jamo_fin_m,   "as",  JAMO_FINAL, 'ퟞ', "ᆷᄂ");
var jamo_fin_m_n_n = new Jamo(jamo_fin_m_n, "ass", JAMO_FINAL, 'ퟟ', "ퟞᄂ");
var jamo_fin_m_m   = new Jamo(jamo_fin_m,   "aa",  JAMO_FINAL, 'ퟠ', "ᆷᄆ");
var jamo_fin_m_b_s = new Jamo(jamo_fin_m_b, "aqt", JAMO_FINAL, 'ퟡ', "ᇜᄉ");
var jamo_fin_m_j   = new Jamo(jamo_fin_m,   "aw",  JAMO_FINAL, 'ퟢ', "ᆷᄌ");
var jamo_fin_b_d   = new Jamo(jamo_fin_b,   "qe",  JAMO_FINAL, 'ퟣ', "ᆸᄃ");
var jamo_fin_b_r_p = new Jamo(jamo_fin_b_r, "qfv", JAMO_FINAL, 'ퟤ', "ᇣᄑ");
var jamo_fin_b_m   = new Jamo(jamo_fin_b,   "qa",  JAMO_FINAL, 'ퟥ', "ᆸᄆ");
var jamo_fin_b_s_d = new Jamo(jamo_fin_b_s, "qte", JAMO_FINAL, 'ퟧ', "ᆹᄃ");
var jamo_fin_b_j   = new Jamo(jamo_fin_b,   "qw",  JAMO_FINAL, 'ퟨ', "ᆸᄌ");
var jamo_fin_b_c   = new Jamo(jamo_fin_b,   "qc",  JAMO_FINAL, 'ퟩ', "ᆸᄎ");
var jamo_fin_s_m   = new Jamo(jamo_fin_s,   "ta",  JAMO_FINAL, 'ퟪ', "ᆺᄆ");
var jamo_fin_s_b_S = new Jamo(jamo_fin_s_b, "tqS", JAMO_FINAL, 'ퟫ', "ᆺᄫ");
var jamo_fin_ss_g  = new Jamo(jamo_fin_ss,  "Tr",  JAMO_FINAL, 'ퟬ', "ᆻᄀ");
var jamo_fin_ss_d  = new Jamo(jamo_fin_ss,  "Te",  JAMO_FINAL, 'ퟭ', "ᆻᄃ");
var jamo_fin_s_z   = new Jamo(jamo_fin_s,   "tA",  JAMO_FINAL, 'ퟮ', "ᆺᅀ");
var jamo_fin_s_j   = new Jamo(jamo_fin_s,   "tw",  JAMO_FINAL, 'ퟯ', "ᆺᄌ");
var jamo_fin_s_c   = new Jamo(jamo_fin_s,   "tc",  JAMO_FINAL, 'ퟰ', "ᆺᄎ");
var jamo_fin_s_t   = new Jamo(jamo_fin_s,   "tx",  JAMO_FINAL, 'ퟱ', "ᆺᄐ");
var jamo_fin_s_h   = new Jamo(jamo_fin_s,   "tg",  JAMO_FINAL, 'ퟲ', "ᆺᄒ");
var jamo_fin_z_b   = new Jamo(jamo_fin_z,   "Aq",  JAMO_FINAL, 'ퟳ', "ᇫᄇ");
var jamo_fin_z_b_S = new Jamo(jamo_fin_z_b, "AqS", JAMO_FINAL, 'ퟴ', "ᇫᄫ");
var jamo_fin_ng_m  = new Jamo(jamo_fin_ng,  "Da",  JAMO_FINAL, 'ퟵ', "ᇰᄆ");
var jamo_fin_ng_h  = new Jamo(jamo_fin_ng,  "Dg",  JAMO_FINAL, 'ퟶ', "ᇰᄒ");
var jamo_fin_j_b   = new Jamo(jamo_fin_j,   "wq",  JAMO_FINAL, 'ퟷ', "ᆽᄒ");
var jamo_fin_j_bb  = new Jamo(jamo_fin_j,   "wQ",  JAMO_FINAL, 'ퟸ', "ᆽᄈ");
var jamo_fin_p_s   = new Jamo(jamo_fin_p,   "vt",  JAMO_FINAL, 'ퟺ', "ᇁᄉ");
var jamo_fin_p_t   = new Jamo(jamo_fin_p,   "vx",  JAMO_FINAL, 'ퟻ', "ᇁᄐ");

////////////////////
// JAMO LISTINGS  //
////////////////////

var list_jamo_init = [
  // INITIALS
  jamo_init_filler,
  jamo_init_g,
  jamo_init_gg,
  jamo_init_n,
  jamo_init_d,
  jamo_init_dd,
  jamo_init_r,
  jamo_init_m,
  jamo_init_b,
  jamo_init_bb,
  jamo_init_s,
  jamo_init_ss,
  jamo_init_x,
  jamo_init_j,
  jamo_init_jj,
  jamo_init_c,
  jamo_init_k,
  jamo_init_t,
  jamo_init_p,
  jamo_init_h,
  jamo_init_s_left,
  jamo_init_s_right,
  jamo_init_z,
  jamo_init_ng,
  jamo_init_j_left,
  jamo_init_j_right,
  jamo_init_c_left,
  jamo_init_c_right,
  jamo_init_q,
  jamo_init_ris,
  jamo_init_high,

  jamo_init_ss_left,
  jamo_init_ss_right,
  jamo_init_jj_left,
  jamo_init_jj_right,

  // INITIAL CLUSTERS
  jamo_init_g_d,
  jamo_init_n_g,
  jamo_init_n_n,
  jamo_init_n_d,
  jamo_init_n_b,
  jamo_init_n_s,
  jamo_init_n_j,
  jamo_init_n_h,
  jamo_init_d_g,
  jamo_init_d_r,
  jamo_init_r_n,
  jamo_init_r_r,
  jamo_init_r_h,
  jamo_init_r_S,
  jamo_init_m_b,
  jamo_init_m_S,
  jamo_init_b_g,
  jamo_init_b_n,
  jamo_init_b_d,
  jamo_init_b_s,
  jamo_init_b_j,
  jamo_init_b_c,
  jamo_init_b_t,
  jamo_init_b_p,
  jamo_init_b_S,
  jamo_init_b_ss,
  jamo_init_bb_S,
  jamo_init_s_g,
  jamo_init_s_n,
  jamo_init_s_d,
  jamo_init_s_r,
  jamo_init_s_m,
  jamo_init_s_b,
  jamo_init_s_x,
  jamo_init_s_j,
  jamo_init_s_c,
  jamo_init_s_k,
  jamo_init_s_t,
  jamo_init_s_p,
  jamo_init_s_h,
  jamo_init_ss_s,
  jamo_init_x_g,
  jamo_init_x_d,
  jamo_init_x_m,
  jamo_init_x_b,
  jamo_init_x_s,
  jamo_init_x_z,
  jamo_init_x_x,
  jamo_init_x_j,
  jamo_init_x_c,
  jamo_init_x_t,
  jamo_init_x_p,
  jamo_init_j_x,
  jamo_init_c_k,
  jamo_init_c_h,
  jamo_init_p_b,
  jamo_init_p_S,
  jamo_init_h_h,

  jamo_init_b_s_g,
  jamo_init_b_s_d,
  jamo_init_b_s_b,
  jamo_init_b_s_j,
  jamo_init_s_b_g,

// INITIAL CLUSTERS (HANGUL JAMO EXTENDED-A)
  jamo_init_d_m,
  jamo_init_d_b,
  jamo_init_d_s,
  jamo_init_d_j,
  jamo_init_r_g,
  jamo_init_r_gg,
  jamo_init_r_d,
  jamo_init_r_dd,
  jamo_init_r_m,
  jamo_init_r_b,
  jamo_init_r_bb,
  jamo_init_r_b_S,
  jamo_init_r_s,
  jamo_init_r_j,
  jamo_init_r_k,
  jamo_init_m_g,
  jamo_init_m_d,
  jamo_init_m_s,
  jamo_init_b_s_t,
  jamo_init_b_k,
  jamo_init_b_h,
  jamo_init_ss_b,
  jamo_init_x_r,
  jamo_init_x_h,
  jamo_init_jj_g,
  jamo_init_t_t,
  jamo_init_p_h,
  jamo_init_h_t,
  jamo_init_q_q
];

var list_jamo_med = [
  // MEDIALS
  jamo_med_filler,
  jamo_med_a,
  jamo_med_ae,
  jamo_med_ya,
  jamo_med_yae,
  jamo_med_eo,
  jamo_med_e,
  jamo_med_yeo,
  jamo_med_ye,
  jamo_med_o,
  jamo_med_yo,
  jamo_med_u,
  jamo_med_yu,
  jamo_med_eu,
  jamo_med_i,
  jamo_med_v,

  // MEDIAL CLUSTERS
  jamo_med_a_o,
  jamo_med_a_u,
  jamo_med_a_eu,
  jamo_med_ya_o,
  jamo_med_ya_yo,
  jamo_med_ya_u,
  jamo_med_eo_o,
  jamo_med_eo_u,
  jamo_med_eo_eu,
  jamo_med_yeo_ya,
  jamo_med_yeo_o,
  jamo_med_yeo_u,
  jamo_med_o_a,
  jamo_med_o_ae,
  jamo_med_o_i,
  jamo_med_o_eo,
  jamo_med_o_e,
  jamo_med_o_ye,
  jamo_med_o_o,
  jamo_med_o_u,
  jamo_med_o_ya,
  jamo_med_o_yae,
  jamo_med_yo_ya,
  jamo_med_yo_yae,
  jamo_med_yo_yeo,
  jamo_med_yo_o,
  jamo_med_yo_i,
  jamo_med_u_eo,
  jamo_med_u_e,
  jamo_med_u_i,
  jamo_med_u_a,
  jamo_med_u_ae,
  jamo_med_u_ye,
  jamo_med_u_u,
  jamo_med_yu_a,
  jamo_med_yu_eo,
  jamo_med_yu_e,
  jamo_med_yu_eo,
  jamo_med_yu_ye,
  jamo_med_yu_u,
  jamo_med_yu_i,
  jamo_med_eu_i,
  jamo_med_eu_u,
  jamo_med_eu_eu,
  jamo_med_i_a,
  jamo_med_i_ya,
  jamo_med_i_o,
  jamo_med_i_u,
  jamo_med_i_eu,
  jamo_med_i_v,
  jamo_med_v_eo,
  jamo_med_v_u,
  jamo_med_v_i,
  jamo_med_v_v,

  jamo_med_u_eo_eu,
  jamo_med_eu_i_u,

  // MEDIAL CLUSTERS (HANGUL JAMO EXTENDED-B)
  jamo_med_o_yeo,
  jamo_med_o_o_i,
  jamo_med_yo_a,
  jamo_med_yo_ae,
  jamo_med_yo_eo,
  jamo_med_u_yeo,
  jamo_med_u_i_i,
  jamo_med_yu_ae,
  jamo_med_yu_o,
  jamo_med_eu_a,
  jamo_med_eu_eo,
  jamo_med_eu_e,
  jamo_med_eu_o,
  jamo_med_i_ya_o,
  jamo_med_i_yae,
  jamo_med_i_yeo,
  jamo_med_i_ye,
  jamo_med_i_o_i,
  jamo_med_i_yo,
  jamo_med_i_yu,
  jamo_med_i_i,
  jamo_med_v_a,
  jamo_med_v_e
];

var list_jamo_fin = [
  // FINALS
  jamo_fin_g,
  jamo_fin_gg,
  jamo_fin_n,
  jamo_fin_d,
  jamo_fin_r,
  jamo_fin_m,
  jamo_fin_b,
  jamo_fin_s,
  jamo_fin_ss,
  jamo_fin_x,
  jamo_fin_j,
  jamo_fin_c,
  jamo_fin_k,
  jamo_fin_t,
  jamo_fin_p,
  jamo_fin_h,
  jamo_fin_z,
  jamo_fin_ng,
  jamo_fin_q,

  // FINAL CLUSTERS
  jamo_fin_g_r,
  jamo_fin_g_s,
  jamo_fin_g_n,
  jamo_fin_g_b,
  jamo_fin_g_c,
  jamo_fin_g_k,
  jamo_fin_g_h,
  jamo_fin_n_j,
  jamo_fin_n_h,
  jamo_fin_n_g,
  jamo_fin_n_d,
  jamo_fin_n_s,
  jamo_fin_n_z,
  jamo_fin_n_t,
  jamo_fin_n_n,
  jamo_fin_d_g,
  jamo_fin_d_r,
  jamo_fin_r_g,
  jamo_fin_r_m,
  jamo_fin_r_b,
  jamo_fin_r_s,
  jamo_fin_r_t,
  jamo_fin_r_p,
  jamo_fin_r_h,
  jamo_fin_r_n,
  jamo_fin_r_d,
  jamo_fin_r_r,
  jamo_fin_r_z,
  jamo_fin_r_k,
  jamo_fin_r_q,
  jamo_fin_m_g,
  jamo_fin_m_r,
  jamo_fin_m_b,
  jamo_fin_m_s,
  jamo_fin_m_z,
  jamo_fin_m_c,
  jamo_fin_m_h,
  jamo_fin_m_S,
  jamo_fin_b_s,
  jamo_fin_b_r,
  jamo_fin_b_p,
  jamo_fin_b_h,
  jamo_fin_b_S,
  jamo_fin_s_g,
  jamo_fin_s_d,
  jamo_fin_s_r,
  jamo_fin_s_b,
  jamo_fin_ng_g,
  jamo_fin_ng_gg,
  jamo_fin_ng_ng,
  jamo_fin_ng_k,
  jamo_fin_p_b,
  jamo_fin_p_S,
  jamo_fin_h_n,
  jamo_fin_h_r,
  jamo_fin_h_m,
  jamo_fin_h_b,
  jamo_fin_ng_s,
  jamo_fin_ng_z,

  jamo_fin_g_s_g,
  jamo_fin_r_g_s,
  jamo_fin_r_m_g,
  jamo_fin_r_m_s,
  jamo_fin_r_b_s,
  jamo_fin_r_b_h,
  jamo_fin_r_b_S,
  jamo_fin_r_ss,
  jamo_fin_r_d_h,
  jamo_fin_m_ss,
  jamo_fin_ng_gg,

  // FINAL CLUSTERS (HANGUL JAMO EXTENDED-B)
  jamo_fin_n_r,
  jamo_fin_n_c,
  jamo_fin_dd,
  jamo_fin_dd_b,
  jamo_fin_d_b,
  jamo_fin_d_s,
  jamo_fin_d_s_g,
  jamo_fin_d_j,
  jamo_fin_d_c,
  jamo_fin_d_t,
  jamo_fin_r_gg,
  jamo_fin_r_g_h,
  jamo_fin_r_r_k,
  jamo_fin_r_m_g,
  jamo_fin_r_b_d,
  jamo_fin_r_b_p,
  jamo_fin_r_ng,
  jamo_fin_r_q_h,
  jamo_fin_r_S,
  jamo_fin_m_n,
  jamo_fin_m_n_n,
  jamo_fin_m_m,
  jamo_fin_m_b_s,
  jamo_fin_m_j,
  jamo_fin_b_d,
  jamo_fin_b_r_p,
  jamo_fin_b_m,
  jamo_fin_bb,
  jamo_fin_b_s_d,
  jamo_fin_b_j,
  jamo_fin_b_c,
  jamo_fin_s_m,
  jamo_fin_s_b_S,
  jamo_fin_ss_g,
  jamo_fin_ss_d,
  jamo_fin_s_z,
  jamo_fin_s_j,
  jamo_fin_s_c,
  jamo_fin_s_t,
  jamo_fin_s_h,
  jamo_fin_z_b,
  jamo_fin_z_b_S,
  jamo_fin_ng_m,
  jamo_fin_ng_h,
  jamo_fin_j_b,
  jamo_fin_j_bb,
  jamo_fin_jj,
  jamo_fin_p_s,
  jamo_fin_p_t
];

////////////////////
// JAMO MAPPINGS  //
////////////////////

// From a list of Jamo instances, create a mapping from a jamo character to its corresponding Jamo instance
function createCharToJamoMap(jamoList) {
  var charToJamoMap = new Map();
  for (let jamoVal of jamoList) {
    charToJamoMap.set(jamoVal.letter, jamoVal);
  }
  return charToJamoMap;
}

// From a list of Jamo instances, create a mapping from a keypress string sequence to its corresponding Jamo instance
function createKeypressToJamoMap(jamoList) {
  var keypressToJamoMap = new Map();
  for (let jamoVal of jamoList) {
    keypressToJamoMap.set(jamoVal.keypress, jamoVal);
  }
  return keypressToJamoMap;
}

var map_keypress_jamo_init = createKeypressToJamoMap(list_jamo_init);
var map_keypress_jamo_med  = createKeypressToJamoMap(list_jamo_med);
var map_keypress_jamo_fin  = createKeypressToJamoMap(list_jamo_fin);

var map_char_jamo_init = createCharToJamoMap(list_jamo_init);
var map_char_jamo_med  = createCharToJamoMap(list_jamo_med);
var map_char_jamo_fin  = createCharToJamoMap(list_jamo_fin);

/*======================================
=========OLD HANGUL IME LOGIC===========
======================================*/

// Some more constants
const STATE_DEFAULT = 0;
const STATE_INSERT_LETTER = 1;
const STATE_INSERT_INIT = 2;
const STATE_INSERT_MED = 3;
const STATE_INSERT_FIN = 4;
const STATE_INSERT_INIT_CLUSTER = 5;
const STATE_INSERT_MED_CLUSTER = 6;
const STATE_INSERT_FIN_CLUSTER = 7;

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
// Indicate if previous character should be overridden (for decomposing composite Hangul jamo)
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

// Revert to default state and clear all stacks
function clearStacks() {
  currState = STATE_DEFAULT;
  stackPressedKeys = new FixedStack(num);
  stackValidJamos = new FixedStack(num);
}

// Insert or remove Hangul jamo into the given input string, given the pressed key
function insertInput(input, pressedKey) {
  var output = "";
  var currChar = pressedKey;
  
  // Reset boolean flags
  overrideCurrChar = false;
  overridePrevChar = false;

  // Add the pressed key to the fixed stack of previous keypresses
  stackPressedKeys.push(pressedKey);
  
  // Get the most recently pressed keys as a string
  var pressedKeys = stackPressedKeys.toString();
  
  // Get current char, scanning for trigraphs first before narrowing down the search
  for (var c = pressedKeys.length; c > 0; c--) {
    var lastCPressedKeys = pressedKeys.substring(pressedKeys.length-c, pressedKeys.length);
    var chosenJamo = undefined;
    
    // Update the IME state given the current state and the most recently pressed keys
    switch (currState) {
      // States: Default, Insert Non-Hangul Letter, Insert Initial
      case STATE_DEFAULT: 
        console.log("STATE: Default");
      case STATE_INSERT_LETTER: 
        console.log("STATE: Insert Letter");
      case STATE_INSERT_INIT:
        console.log("STATE: Insert Initial");
        if (map_keypress_jamo_init.has(lastCPressedKeys)) {
          currState = STATE_INSERT_INIT;
          chosenJamo = map_keypress_jamo_init.get(lastCPressedKeys);
          console.log("* Changed state to Insert Initial");
        }
        else if (map_keypress_jamo_med.has(lastCPressedKeys)) {
          currState = STATE_INSERT_MED;
          chosenJamo = map_keypress_jamo_med.get(lastCPressedKeys);
          console.log("* Changed state to Insert Medial");
        }
        break;
      
      // State: Insert Medial
      case STATE_INSERT_MED:
        console.log("STATE: Insert Medial");
        if (map_keypress_jamo_med.has(lastCPressedKeys)) {
          currState = STATE_INSERT_MED;
          chosenJamo = map_keypress_jamo_med.get(lastCPressedKeys);
          console.log("* Changed state to Insert Medial");
        }
        else if (map_keypress_jamo_fin.has(lastCPressedKeys)) {
          currState = STATE_INSERT_FIN;
          chosenJamo = map_keypress_jamo_fin.get(lastCPressedKeys);
          console.log("* Changed state to Insert Final");
        }
        // Transition to Insert Initial if initial-only jamo (e.g. ㅃ) was inputted
        else if (map_keypress_jamo_init.has(lastCPressedKeys)) {
          currState = STATE_INSERT_INIT;
          chosenJamo = map_keypress_jamo_init.get(lastCPressedKeys);
          console.log("* Changed state to Insert Initial");
        }
        break;
      
      // State: Insert Final
      case STATE_INSERT_FIN:
        console.log("STATE: Insert Final");
        if (map_keypress_jamo_fin.has(lastCPressedKeys)) {
          currState = STATE_INSERT_FIN;
          chosenJamo = map_keypress_jamo_fin.get(lastCPressedKeys);
          console.log("* Changed state to Insert Final");
        }
        else if (map_keypress_jamo_init.has(lastCPressedKeys)) {
          currState = STATE_INSERT_INIT;
          chosenJamo = map_keypress_jamo_init.get(lastCPressedKeys);
          console.log("* Changed state to Insert Initial");
        }
        // Transition to Insert Medial if medial jamo (e.g. ㅓ) was inputted,
        // indicating that the final jamo needs to be decomposed 
        else if (map_keypress_jamo_med.has(lastCPressedKeys)) {
          currState = STATE_INSERT_MED;
          chosenJamo = map_keypress_jamo_med.get(lastCPressedKeys);
          overridePrevChar = true;
          console.log("* Changed state to Insert Medial (after Insert Final)");
        }
        break;
      
      default: break;
    }
    
    console.log("c=" + c + " len-c=" + (pressedKeys.length-c) + " lastCPressedKeys=" + lastCPressedKeys + " chosenJamo=" + chosenJamo);

    // Exit the loop if a valid Jamo object is found
    if (chosenJamo !== undefined) {
      
      // If the selected Jamo cluster is not directly descended from the current Jamo,
      // the detected cluster is NOT valid, so it can be ignored
      if (chosenJamo.parent !== undefined) {
        if (chosenJamo.parent.letter != input.charAt(selStart-1)) {
          console.log(" OVERRIDE cancelled since jamo has diff parent");
          continue;
        }
      }
      
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
  
  // If medial vowel was inputted after final was inputted,
  // replace the final jamos with their decomposed final+initial forms
  if (overridePrevChar) {
    var lastJamo = stackValidJamos.nthTop(1).decomposed;
    input = input.slice(0, selStart-1) + lastJamo + input.slice(selStart);
    
    // Adjust cursor position to accomodate the decomposed final+initial jamos
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

// Modify the given input string on backspace, depending on which Hangul jamo is before the cursor
function deleteInput(input) {
  console.log("<<<<<<<<<<<<<<<<<");
  
  // Exit function if cursor is at beginning of string
  if (selStart == 0 && selEnd == 0) {
    console.log("Nothing to delete. Returning original string");
    return input;
  }
  
  // Output string
  output = "";
  
  // The previous character before the cursor
  var prevChar = (selStart >= 1) ? input[selStart-1] : undefined;
  var chosenPrevJamo = undefined;
  console.log("prevChar = " + prevChar);
  console.log("selStart = " + selStart + " selEnd = " + selEnd);
  
  // The new character to replace the previous character with
  var replChar = "";
  
  // Indicate if selection covers 1 or more char
  var isSelectingMultipleChars = (selStart != selEnd);

  // Reset boolean flags
  overridePrevChar = false;
  
  // Update the IME state given the current state and the preceding chracter prior to this one
  if (map_char_jamo_init.has(prevChar)) {
    currState = STATE_INSERT_INIT;
    chosenPrevJamo = map_char_jamo_init.get(prevChar);
    console.log("* Changed state to Insert Initial");
  }
  else if (map_char_jamo_med.has(prevChar)) {
    currState = STATE_INSERT_MED;
    chosenPrevJamo = map_char_jamo_med.get(prevChar);
    console.log("* Changed state to Insert Medial");
  }
  else if (map_char_jamo_fin.has(prevChar)) {
    currState = STATE_INSERT_FIN;
    chosenPrevJamo = map_char_jamo_fin.get(prevChar);
    console.log("* Changed state to Insert Final");
  }
  else {
    console.log("* State was left unchanged");
  }

  // Set replacement char if parent of prev char jamo was found
  if (chosenPrevJamo != undefined && chosenPrevJamo.hasMultipleJamo()) {
    replChar = chosenPrevJamo.parent.letter;
    overridePrevChar = true;
    console.log("REPLCHAR = " + replChar);
  }
  
  // If cursor is selecting 1 or more characters, delete the selection
  if (isSelectingMultipleChars) {
    output = input.slice(0, selStart) + input.slice(selEnd);
    console.log("DELETED: 1 or more chars");
  }
  // Adjust the cursor position if char was deleted (assuming jamo size is 1)
  else if (!overridePrevChar) { 
    output = input.slice(0, selStart-1) + replChar + input.slice(selStart);
    selStart -= 1;
    selEnd -= 1;
    console.log("DELETED: !overridePrevChar");
  }
  else {
    output = input.slice(0, selStart-1) + replChar + input.slice(selStart);
    console.log("DELETED: default");
  }
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
  console.log("keypress: START=" + selStart + " END=" + selEnd);

  // Disable inserting the char if it's an ASCII char, the [F] key or the Enter key
  if (keynum == 13 || (keynum >= 32 && keynum <= 126)) {
    e.preventDefault();
  }
  
  // Reset stacks if [F] key is pressed
  if (keynum == 74) {
    clearStacks();    
  }
  
  // Calculate the next Hangul jamo to be inserted, except if backspace is pressed
  else if (keynum != 8 && keynum != undefined) {
    //context.value = context.value + pressedKey;
    context.value = insertInput(context.value, pressedKey);

    // Reset cursor to previously known position
    var incrementAmount = (overrideCurrChar) ? 0 : 1;
    context.selectionEnd = selStart + incrementAmount;
  }
}

// Get all input keypresses including non-character keys (e.g. backspace, arrow keys)
function receiveKeydown(e, context) {
  // Get the current cursor position
  selStart = context.selectionStart;
  selEnd = context.selectionEnd;

  if (e.key == "ArrowLeft" || 
      e.key == "ArrowRight" || 
      e.key == "ArrowUp" || 
      e.key == "ArrowDown") {
    clearStacks();
    //console.log("KEYDOWN: State changed to Default");
  }
  
  if (e.key == "Backspace") {
    // Clear all stacks
    stackPressedKeys = new FixedStack(num);
    stackValidJamos = new FixedStack(num);

    context.value = deleteInput(context.value);

    // Reset cursor to previously known position
    context.selectionEnd = selStart;
    
    // Prevent backspace from deleting char by default  
    e.preventDefault();
  }
}

function init() {
  var hangulInput = document.getElementById("hangulime");

  // Add event listeners to Old Hangul IME textarea
  hangulInput.addEventListener("keypress", function(event) {
    receiveKeypress(event, this);
  }, true);
  hangulInput.addEventListener("keydown", function(event) {
    receiveKeydown(event, this);
  }, true);

  console.log("map_char_jamo_init =");
  console.log(map_char_jamo_init);
  console.log("map_keypress_jamo_init =");
  console.log(map_keypress_jamo_init);
  // fixedStackTest();
  // jamoTest();
}
