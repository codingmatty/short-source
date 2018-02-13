const { encode, decode } = require('./hasher');

describe('hasher', () => {
  it('encodes a value', () => {
    const encoded = encode(10000);
    expect(encoded).toBe('3Yq');
  });

  it('decodes a value', () => {
    const decoded = decode('abc');
    expect(decoded).toBe(30867);
  });
});
