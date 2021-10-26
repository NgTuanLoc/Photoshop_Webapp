function benchmark(func) {
  let startT = new Date();
  func();
  let endT = new Date();
  console.log("time cost = " + (endT - startT) + "ms");
}

export { benchmark };
