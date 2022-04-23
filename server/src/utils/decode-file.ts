export const decodeFile = (encoded: string) => {
  const fileBuffer = encoded.replace(/^data:\w+\/\w+;base64,/, "");
  const contentType = encoded.slice(encoded.indexOf(":") + 1, encoded.indexOf(";"));

  const buffer = Buffer.from(fileBuffer, "base64");

  return { buffer, contentType };
};
