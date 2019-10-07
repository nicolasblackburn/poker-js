/**
 * @file 
 * This is a small module to allow pattern matching 
 * simple nested array structures using a unification 
 * algorithm. Patterns are defined using various 
 * pattern expressions like variable captures,
 * function calls, wildcards, etc.
 */

/**
 * A variable pattern. Match any expression and 
 * capture the matched expression into a javascript
 * object.
 *
 * ```
 * const {match, Variable} = require("./match");
 *
 * match([1, 2, [3, Variable("x")]], 
 *       [1, 2, [3, "hello"]]);
 *
 * // returns {x: "hello"}
 * ```
 */ 
function Variable(label) {
  if (!(this instanceof Variable)) {
    return new Variable(label);
  } else {
    this.label = label;
  }
}

/**
 * Match an array. The order of elements does not
 * affect the match.
 *
 * ```
 * const {match, Unordered} = require("./match");
 *
 * match(Unordered(3, 2, "a", 1), 
 *       [1, 2, 3, "a"]);
 *
 * // returns {}
 * ```
 */
function Unordered(...values) {
  if (!(this instanceof Unordered)) {
    return new Unordered(...values);
  } else {
    // This is not optimal as some permutations
    // applied to the values gives the same
    // result and duplicate the number of checks 
    // that needs to be done.
    this.permutations = permutations(values);
  }
}

function FunctionCall(fun, ...parameters) {
  if (!(this instanceof FunctionCall)) {
    return new FunctionCall(fun, ...parameters);
  } else {
    this.fun = fun;
    this.parameters = parameters;
  }
}

function Any(...patterns) {
  if (!(this instanceof Any)) {
    return new Any(...patterns);
  } else {
    this.patterns = patterns;
  }
}

function Capture(label, pattern) {
  if (!(this instanceof Capture)) {
    return new Capture(label, pattern);
  } else {
    this.label = label;
    this.pattern = pattern;
  }
}

const wildcard = Symbol("@@wildcard");

function isConstant(expr) {
  return expr === undefined || expr === null || ["string", "number", "boolean"].includes(typeof expr);
}

function isArray(expr) {
  return Array.isArray(expr);
}

function substitute(subs, pat) {
  if (isConstant(pat)) {
    return pat;
  } else if (pat instanceof Variable && 
             subs[pat.label] !== undefined) {
    return subs[pat.label];
  } else if (isArray(pat)) {
    return pat.map(pat => substitute(subs, pat));
  } else if (pat instanceof Capture) {
    return Capture(pat.label,
                   substitute(subs, pat.pattern));
  } else if (pat instanceof Any) {
    return Any(
      ...pat.patterns.map(pat => substitute(subs, pat)));
  } else if (pat instanceof Unordered) {
    return Unordered(
      ...pat.permutations[0]
        .map(pat => substitute(subs, pat)));
  } else if (pat instanceof FunctionCall) {
    return FunctionCall(
      pat.fun,
      ...pat.parameters
        .map(pat => substitute(subs, pat)));
  } else {
    return pat;
  }
}

function permutations(arr) {
  if (arr.length === 0){
    return [[]];
  }

  const perms = [];
  for (let i = 0; i < arr.length; i++) {
    perms.push( 
      ...permutations([
        ...arr.slice(0, i),
        ...arr.slice(i + 1)])
      .map(rest => [arr[i], ...rest]));
  }
  return perms;
}

function match(pat, expr) {
  if (isConstant(expr) && isConstant(pat)) {
    if (expr === pat) {
      return {};
    
    } else {
      return false;
    }

  } else if (pat === wildcard) {
    return {};

  } else if (pat instanceof Variable) {
    return {[pat.label]: expr};

  } else if (pat instanceof FunctionCall) {
    return match(pat.fun(...pat.parameters), expr);

  } else if (pat instanceof Capture) {
    const subs = match(pat.pattern, expr);
    if (!subs) {
      return false;
    }

    return {...subs, [pat.label]: expr};

  } else if (pat instanceof Any) {
    for (const pat1 of pat.patterns) {
      const subs = match(pat1, expr);
      if (subs) {
        return subs;
      }
    }

    return false;

  } else if (pat instanceof Unordered) {
    for (const pat1 of pat.permutations) {
      const subs = match(pat1, expr);
      if (subs) {
        return subs;
      }
    }

    return false;
    
  } else if (isArray(expr) && isArray(pat)) {
    if (expr.length === 0 && pat.length === 0) {
      return {};
    }

    if (expr.length !== pat.length) {
      return false;
    }

    let subsFinal = {};
    for (let i = 0; i < expr.length; i++) {
      const subs = 
        match(substitute(subsFinal, pat[i]), 
              expr[i]);

      if (!subs) {
        return false;
      }

      subsFinal = {...subsFinal, ...subs};
    }

    return subsFinal;

  } else {
    return false;
  }
}

module.exports = {
  match, 
  Variable, 
  wildcard, 
  Unordered, 
  FunctionCall,
  Any,
  Capture
};
