// ============================================================
// SHA-256 Educational Implementation
// Exposes every intermediate value for visualization.
// ============================================================

// SHA-256 Constants: first 32 bits of the fractional parts
// of the cube roots of the first 64 primes (2..311).
export const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

// Initial hash values: first 32 bits of the fractional parts
// of the square roots of the first 8 primes (2..19).
export const H_INIT = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

// ---------- Bitwise helpers (all operate on 32-bit unsigned) ----------

/** Right-rotate a 32-bit word by n bits. */
export function rotr(x, n) {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}

/** Right-shift a 32-bit word by n bits. */
export function shr(x, n) {
  return x >>> n;
}

/** 32-bit unsigned addition (mod 2^32). */
export function add32(...args) {
  let sum = 0;
  for (const v of args) sum = (sum + v) >>> 0;
  return sum;
}

// ---------- SHA-256 functions ----------

/** Σ0(x) = ROTR²(x) ⊕ ROTR¹³(x) ⊕ ROTR²²(x) */
export function bigSigma0(x) {
  return (rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)) >>> 0;
}

/** Σ1(x) = ROTR⁶(x) ⊕ ROTR¹¹(x) ⊕ ROTR²⁵(x) */
export function bigSigma1(x) {
  return (rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)) >>> 0;
}

/** σ0(x) = ROTR⁷(x) ⊕ ROTR¹⁸(x) ⊕ SHR³(x) */
export function smallSigma0(x) {
  return (rotr(x, 7) ^ rotr(x, 18) ^ shr(x, 3)) >>> 0;
}

/** σ1(x) = ROTR¹⁷(x) ⊕ ROTR¹⁹(x) ⊕ SHR¹⁰(x) */
export function smallSigma1(x) {
  return (rotr(x, 17) ^ rotr(x, 19) ^ shr(x, 10)) >>> 0;
}

/** Ch(x, y, z) = (x AND y) XOR (NOT x AND z) */
export function ch(x, y, z) {
  return ((x & y) ^ (~x & z)) >>> 0;
}

/** Maj(x, y, z) = (x AND y) XOR (x AND z) XOR (y AND z) */
export function maj(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z)) >>> 0;
}

// ---------- UTF-8 encoding ----------

/** Encode a JS string to a Uint8Array of UTF-8 bytes. */
export function utf8Encode(str) {
  return new TextEncoder().encode(str);
}

// ---------- Formatting helpers ----------

export function toHex32(n) {
  return (n >>> 0).toString(16).padStart(8, '0');
}

export function toBin32(n) {
  return (n >>> 0).toString(2).padStart(32, '0');
}

export function byteToBin(b) {
  return b.toString(2).padStart(8, '0');
}

export function byteToHex(b) {
  return b.toString(16).padStart(2, '0');
}

// ---------- Padding ----------

/**
 * Pad a message according to SHA-256 rules.
 * Returns { padded: Uint8Array, details }
 */
export function padMessage(messageBytes) {
  const msgLen = messageBytes.length;
  const bitLen = msgLen * 8;

  // We need: msgLen + 1 (0x80 byte) + K zeros + 8 (length) ≡ 0 mod 64
  let padLen = 64 - ((msgLen + 1 + 8) % 64);
  if (padLen === 64) padLen = 0;

  const totalLen = msgLen + 1 + padLen + 8;
  const padded = new Uint8Array(totalLen);
  padded.set(messageBytes);
  padded[msgLen] = 0x80; // append 1-bit

  // Append original message length as 64-bit big-endian
  // JS bitwise only handles 32 bits, so we split.
  const hiLen = Math.floor(bitLen / 0x100000000);
  const loLen = bitLen >>> 0;
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 8, hiLen, false);
  view.setUint32(totalLen - 4, loLen, false);

  return {
    padded,
    details: {
      originalLength: msgLen,
      originalBitLength: bitLen,
      paddingOneBit: true,
      zeroBytes: padLen,
      lengthField: [hiLen, loLen],
      totalLength: totalLen,
      numBlocks: totalLen / 64,
    },
  };
}

// ---------- Parse blocks ----------

/** Split padded message into 512-bit (16-word) blocks. */
export function parseBlocks(padded) {
  const numBlocks = padded.length / 64;
  const blocks = [];
  const view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  for (let i = 0; i < numBlocks; i++) {
    const words = [];
    for (let j = 0; j < 16; j++) {
      words.push(view.getUint32(i * 64 + j * 4, false));
    }
    blocks.push(words);
  }
  return blocks;
}

// ---------- Message schedule ----------

/**
 * Expand 16-word block into 64-word message schedule.
 * Returns array of { w, sigma0Detail?, sigma1Detail? } for each word.
 */
export function computeMessageSchedule(block) {
  const W = new Array(64);
  const details = new Array(64);

  for (let t = 0; t < 16; t++) {
    W[t] = block[t];
    details[t] = { w: W[t], source: 'direct' };
  }

  for (let t = 16; t < 64; t++) {
    const s1 = smallSigma1(W[t - 2]);
    const s0 = smallSigma0(W[t - 15]);
    W[t] = add32(s1, W[t - 7], s0, W[t - 16]);
    details[t] = {
      w: W[t],
      source: 'computed',
      sigma1: { input: W[t - 2], result: s1 },
      sigma0: { input: W[t - 15], result: s0 },
      wt7: W[t - 7],
      wt16: W[t - 16],
    };
  }
  return { W, details };
}

// ---------- Compression rounds ----------

/**
 * Run 64 compression rounds on a block.
 * Returns detailed round-by-round state.
 */
export function compressBlock(prevHash, W) {
  let [a, b, c, d, e, f, g, h] = prevHash;
  const rounds = [];

  for (let t = 0; t < 64; t++) {
    const chVal = ch(e, f, g);
    const majVal = maj(a, b, c);
    const sig1 = bigSigma1(e);
    const sig0 = bigSigma0(a);
    const T1 = add32(h, sig1, chVal, K[t], W[t]);
    const T2 = add32(sig0, majVal);

    const newA = add32(T1, T2);
    const newE = add32(d, T1);

    const prevState = { a, b, c, d, e, f, g, h };

    // Update working variables
    h = g;
    g = f;
    f = e;
    e = newE;
    d = c;
    c = b;
    b = a;
    a = newA;

    rounds.push({
      round: t,
      prevState,
      newState: { a, b, c, d, e, f, g, h },
      intermediates: {
        ch: chVal,
        maj: majVal,
        bigSigma0: sig0,
        bigSigma1: sig1,
        T1,
        T2,
        K: K[t],
        W: W[t],
      },
    });
  }

  // Add round values to previous hash
  const newHash = prevHash.map((hv, i) => add32(hv, [a, b, c, d, e, f, g, h][i]));

  return { rounds, finalWorkingVars: { a, b, c, d, e, f, g, h }, newHash };
}

// ---------- Full SHA-256 with intermediate state ----------

/**
 * Compute SHA-256 of a string, returning all intermediate state.
 */
export function sha256Full(input) {
  // Step 1: UTF-8 encode
  const messageBytes = utf8Encode(input);

  // Step 2: Binary representation
  const binaryRepresentation = Array.from(messageBytes).map((b) => ({
    byte: b,
    char: input.length <= messageBytes.length ? String.fromCharCode(b) : '·',
    binary: byteToBin(b),
    hex: byteToHex(b),
  }));

  // Step 3: Padding
  const { padded, details: paddingDetails } = padMessage(messageBytes);

  // Step 4: Parse into blocks
  const blocks = parseBlocks(padded);

  // Step 5: Process each block
  let currentHash = [...H_INIT];
  const blockResults = [];

  for (let i = 0; i < blocks.length; i++) {
    const { W, details: scheduleDetails } = computeMessageSchedule(blocks[i]);
    const { rounds, finalWorkingVars, newHash } = compressBlock(currentHash, W);

    blockResults.push({
      blockIndex: i,
      blockWords: blocks[i],
      schedule: { W, details: scheduleDetails },
      compression: { rounds, finalWorkingVars },
      hashBefore: [...currentHash],
      hashAfter: [...newHash],
    });

    currentHash = newHash;
  }

  // Step 6: Final hash
  const hashHex = currentHash.map(toHex32).join('');
  const hashBinary = currentHash.map(toBin32).join('');

  return {
    input,
    messageBytes: Array.from(messageBytes),
    binaryRepresentation,
    padding: paddingDetails,
    paddedMessage: Array.from(padded),
    blocks,
    blockResults,
    initialHash: [...H_INIT],
    finalHash: currentHash,
    hashHex,
    hashBinary,
  };
}

/**
 * Validate our implementation against Web Crypto API.
 * Returns a promise that resolves to { ours, expected, match }.
 */
export async function validateHash(input) {
  const result = sha256Full(input);
  const ours = result.hashHex;

  const msgBytes = utf8Encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBytes);
  const hashArray = new Uint8Array(hashBuffer);
  const expected = Array.from(hashArray)
    .map((b) => byteToHex(b))
    .join('');

  return { ours, expected, match: ours === expected };
}
