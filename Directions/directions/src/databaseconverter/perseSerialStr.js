function parseSerializedString(serializedString) {
  const regex = /"([^"]*)"/g;
  let match;
  const result = {};

  while ((match = regex.exec(serializedString)) !== null) {
    const key = match[1];
    match = regex.exec(serializedString);
    const value = match[1];
    result[key] = value;
  }

  return result;
}

export default parseSerializedString;

// If this is an async function, everything stops.

/* async function parseSerializedString(serializedString) {
  const regex = /"([^"]*)"/g;
  let match;
  const result = {};

  while ((match = regex.exec(serializedString)) !== null) {
    const key = match[1];
    match = regex.exec(serializedString);
    const value = match[1];
    result[key] = value;
  }

  return result;
}

export default parseSerializedString;
 */
