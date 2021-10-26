var clamp = function (v, lower, upper) {
  return Math.max(lower, Math.min(v, upper));
};

export { clamp };
