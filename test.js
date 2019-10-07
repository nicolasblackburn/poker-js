const assert = require("assert");
const match = require("./match"); 
const cards = require("./cards");
const poker = require("./poker");

const hands = {
  royal_flush: [
    ["diamond", "10"],
    ["diamond", "J"],
    ["diamond", "K"],
    ["diamond", "A"],
    ["diamond", "Q"]
  ],
  straight_flush: [
    ["diamond", "2"],
    ["diamond", "3"],
    ["diamond", "4"],
    ["diamond", "5"],
    ["diamond", "6"]
  ],
  four_of_a_kind: [
    [ 'heart', '5' ],
    [ 'spade', '5' ],
    [ 'diamond', '5' ],
    [ 'spade', 'A' ],
    [ 'club', '5' ]
  ],
  full_house: [
    [ 'heart', 'A' ],
    [ 'spade', '5' ],
    [ 'diamond', '5' ],
    [ 'spade', 'A' ],
    [ 'club', '5' ]
  ],
  flush: [ 
    ["spade", "2"],
    ["spade", "3"],
    ["spade", "4"],
    ["spade", "5"],
    ["spade", "6"]
  ],
  straight: [
    ["spade", "2"],
    ["hearth", "3"],
    ["spade", "4"],
    ["diamond", "5"],
    ["diamond", "6"]
  ],
  three_of_a_kind: [
    [ 'heart', 'A' ],
    [ 'spade', '5' ],
    [ 'diamond', '5' ],
    [ 'heart', '3' ],
    [ 'club', '5' ]
  ],
  two_pairs: [
    [ 'spade', '8' ],
    [ 'heart', '3' ],
    [ 'spade', 'Q' ],
    [ 'club', '3' ],
    [ 'heart', 'Q' ]
  ],
  jacks_or_better: [
    ["spade", "J"],
    ["hearth", "K"],
    ["diamond", "5"],
    ["club", "3"],
    ["diamond", "K"]
  ],
  pair: [
    ["spade", "J"],
    ["hearth", "5"],
    ["diamond", "5"],
    ["club", "3"],
    ["diamond", "K"]
  ]
};

for (const [key, hand] of Object.entries(hands)) {
  assert(
    !!match.match(poker.patterns[key], hand),
    `Test match ${key} of [${
      cards.toString(hand)}]`);
}
