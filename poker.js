const cards = require("./cards");
const match = require("./match");

const suits = ["spade", "heart", "diamond", "club"];
const ranks = ["A", "2", "3", "4", "5", "6", 
    "7", "8", "9", "10", "J", "Q", "K"];
const deck = [];
for (const suit of suits) {
  for (const rank of ranks) {
    deck.push(cards.makeCard(suit, rank));
  }
}

const patterns = {
  royal_flush: match.Unordered(
    [match.Variable("s1"), "10"],
    [match.Variable("s1"), "J"],
    [match.Variable("s1"), "Q"],
    [match.Variable("s1"), "K"],
    [match.Variable("s1"), "A"]
  ),
  straight_flush: match.Unordered(
    [match.Variable("s1"), match.Variable("r1")],
    [match.Variable("s1"), match.FunctionCall(
      addRank, match.Variable("r1"), 1)],
    [match.Variable("s1"), match.FunctionCall(
      addRank, match.Variable("r1"), 2)],
    [match.Variable("s1"), match.FunctionCall(
      addRank, match.Variable("r1"), 3)],
    [match.Variable("s1"), match.FunctionCall(
      addRank, match.Variable("r1"), 4)]
  ),
  four_of_a_kind: match.Unordered(
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    match.wildcard
  ),
  full_house: match.Unordered(
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r2")],
    [match.wildcard, match.Variable("r2")]
  ),
  flush: match.Unordered(
    [match.Variable("s1"), match.wildcard],
    [match.Variable("s1"), match.wildcard],
    [match.Variable("s1"), match.wildcard],
    [match.Variable("s1"), match.wildcard],
    [match.Variable("s1"), match.wildcard]
  ),
  straight: match.Unordered(
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.FunctionCall(
      addRank, match.Variable("r1"), 1)],
    [match.wildcard, match.FunctionCall(
      addRank, match.Variable("r1"), 2)],
    [match.wildcard, match.FunctionCall(
      addRank, match.Variable("r1"), 3)],
    [match.wildcard, match.FunctionCall(
      addRank, match.Variable("r1"), 4)]
  ),
  three_of_a_kind: match.Unordered(
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    match.wildcard,
    match.wildcard
  ),
  two_pairs: match.Unordered(
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r2")],
    [match.wildcard, match.Variable("r2")],
    match.wildcard
  ),
  jacks_or_better: match.Unordered(
    [match.wildcard, 
      match.Capture("r1",
                    match.Any("J", "Q", "K", "A"))],
    [match.wildcard, match.Variable("r1")],
    match.wildcard,
    match.wildcard,
    match.wildcard
  ),
  pair: match.Unordered(
    [match.wildcard, match.Variable("r1")],
    [match.wildcard, match.Variable("r1")],
    match.wildcard,
    match.wildcard,
    match.wildcard
  )
};

function addRank(rank, n) {
  return cards.addRank(ranks, rank, n);
}

module.exports = {
  suits,
  cards,
  deck,
  patterns,
  addRank
};
