function drawFrom(n, arr) {
  return [...new Array(n)]
    .reduce(([r, arr]) => {
      const n = Math.random() * arr.length | 0;
      return [[...r, arr[n]], 
              [...arr.slice(0, n),
               ...arr.slice(n)]];
    },[[], arr])[0];
}

function addRank(ranks, rank, add) {
  return ranks[
    (ranks.indexOf(rank) + add) % ranks.length];
}

function makeCard(suit, rank) {
  return [suit, rank];
}

function cardToString(card) {
  return card[1] + " of " + card[0];
}

function toString(cards) {
  return cards.map(cardToString).join(", ");
}

module.exports = {
  drawFrom, 
  addRank, 
  cardToString,
  toString,
  makeCard
};
