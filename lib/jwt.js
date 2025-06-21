import jwt from "jsonwebtoken";

/**
 * Sign a JWT token with payload and optional expiry.
 */
export function signJwtToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, secret, options);
}

/**
 * Verify a JWT token (handles Bearer prefix and errors).
 */
export function verifyJwtToken(token) {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET is not defined");

    if (!token || typeof token !== "string") {
      throw new Error("Token is missing or not a string");
    }

    // If "Bearer ..." format, remove the prefix
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    return jwt.verify(token, secret);
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return null;
  }
}
