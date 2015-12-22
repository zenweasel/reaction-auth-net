/* eslint camelcase: 0 */

const AuthNet = Npm.require("node-authorize-net");

Meteor.methods({
  authnetSubmit: function (cardInfo, paymentInfo) {
    check(cardInfo, Object);
    check(paymentInfo, Object);

    let {
      login,
      tran_key
    } = Meteor.AuthNet.accountOptions();
    let {
      cardNumber,
      expirationYear,
      expirationMonth
    } = cardInfo;
    let { total } = paymentInfo;
    const authnetService = new AuthNet(login, tran_key);

    return authnetService.authCaptureTransaction(total,
      cardNumber,
      expirationYear,
      expirationMonth
    );
  }
});
