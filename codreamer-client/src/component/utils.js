export const generateid = (L) =>
  [...Array(L)].map(() => Math.random().toString(36)[3]).join("");
