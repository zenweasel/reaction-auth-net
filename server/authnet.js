/* eslint camelcase: 0 */

const AuthNet = Npm.require("node-authorize-net");

Meteor.methods({
  authnetSubmit: function (cardInfo, paymentInfo) {
    check(cardInfo, Object);
    check(paymentInfo, Object);

    this.unblock();

    const {
      cardNumber,
      expirationYear,
      expirationMonth
    } = cardInfo;
    const { total } = paymentInfo;
    const authnetService = getAuthnetService(Meteor.AuthNet.accountOptions());

    return authnetService.authCaptureTransaction(total,
      cardNumber,
      expirationYear,
      expirationMonth
    );
  }
});

function getAuthnetService(accountOptions) {
  const {
    login,
    tran_key
  } = accountOptions;

  return new AuthNet(login, tran_key);
}
