export function compute (axiom, rules, iterations) {
  let cur = axiom;
  // Want to apply all rules simultaneously, so prepend a ',' character to mark
  //  which instructions are from the old string vs added in this pass
  for (let i = 0; i < iterations; i++) {
    for (let k in rules) {
      cur = cur.split(k).join(','+k);
    }

    for (let k in rules) {
      cur = cur.split(','+k).join(rules[k]);
    }
  }

  return cur;
}
