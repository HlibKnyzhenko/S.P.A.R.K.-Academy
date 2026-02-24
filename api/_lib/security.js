const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) {
    return false;
  }

  const [salt, originalHash] = stored.split(':');
  const candidateHash = crypto.scryptSync(password, salt, 64).toString('hex');

  const originalBuf = Buffer.from(originalHash, 'hex');
  const candidateBuf = Buffer.from(candidateHash, 'hex');

  if (originalBuf.length !== candidateBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuf, candidateBuf);
}

module.exports = {
  hashPassword,
  verifyPassword
};
