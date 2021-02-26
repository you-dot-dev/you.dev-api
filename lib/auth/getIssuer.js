/**
 *  ./lib/auth/getIssuer.js
 *
 *  @param String "issuerStr" Ex. getIssuer("https://accounts.google.com");
 *
 *  @returns Issuer
 */

const { Issuer } = require("openid-client");

module.exports = async function getIssuer(issuerStr) {
  try {
    const issuer = await Issuer.discover(issuerStr);
    return issuer;
  } catch (err) {
    console.error("err:", err);
    return err
  }
}
