let a = [1, 2, 3];

console.log(a.length);

console.log(Object.entries({ first: "jay", last: "jag" }));

Object.entries({ first: "jay", last: "jag" }).forEach(([key, value]) =>
  console.log(key, value)
);
