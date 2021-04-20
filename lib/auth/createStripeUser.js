/**
 *  lib/auth/createStripeUser.js
 *
 *
 */

const axios = require("axios");
const qs = require("qs");

module.exports = async (name, email) => {

  let existingAccounts = [];

  try {
    let { data } = await axios({
      method: "GET",
      url: "https://api.stripe.com/v1/customers",
      params: {
        limit: 5,
        email,
      },
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    });

    existingAccounts = data.data;

    if (existingAccounts.length > 0) {
      console.log(`Found existing Stripe User for ${email}:`, existingAccounts[0]);
      return existingAccounts[0];
    }

  } catch (err) {
    console.log("err getting existing stripe user", err);
    return {
      message: "bummer :( couldn't get stripe users"
    }
  }

  try {
    const { data } = await axios({
      method: "POST",
      url: "https://api.stripe.com/v1/customers",
      data: qs.stringify({ name, email }),
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });

    console.log("stripeUser?:", data);
    return data;

  } catch (err) {
    console.log("err in lib/auth/createStripeUser.js", err);
    return {
      message: "bummer :( couldn't create stripe user"
    }
  }


}
