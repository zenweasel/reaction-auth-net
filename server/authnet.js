/* eslint camelcase: 0 */
/* eslint quote-props: 0 */

const AuthNet = Npm.require("authorize-net");

Meteor.methods({
  authnetSubmit: function (transactionType = "authorizeTransaction", cardInfo, paymentInfo) {
    check(cardInfo, Object);
    check(paymentInfo, Object);
    check(transactionType, String);

    this.unblock();

    let result;
    const order = {
      amount: paymentInfo.total
    };
    const creditCard = {
      creditCardNumber: cardInfo.cardNumber,
      cvv2: cardInfo.cvv2,
      expirationYear: cardInfo.expirationYear,
      expirationMonth: cardInfo.expirationMonth
    };
    const authnetService = getAuthnetService(Meteor.AuthNet.accountOptions());
    const authnetTransactionFunc = authnetService[transactionType];

    if (authnetTransactionFunc) {
      try {
        result = authnetTransactionFunc.call(authnetService,
          order,
          creditCard
        );
      } catch (error) {
        ReactionCore.Log.warn(error);
      }
    } else {
      throw new Meteor.Error(403, "Invalid Transaction Type");
    }

    return result;
  },

  "authnet/payment/capture": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);

    this.unblock();

    const {
      transactionId,
      amount
    } = paymentMethod;
    const authnetService = getAuthnetService(Meteor.AuthNet.accountOptions());

    return priorAuthCaptureTransaction(transactionId,
      amount,
      authnetService
    );
  },

  "authnet/refund/create": function (cardInfo, paymentMethod) {
    check(cardInfo, Object);
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);

    this.unblock();

    const {
      transactionId,
      amount
    } = paymentMethod;
    const options = {
      creditCardNumber: cardInfo.cardNumber.toString(), // Last 4 digits
      expirationYear: cardInfo.expireYear,
      expirationMonth: cardInfo.expirationMonth,
      amount
    };
    const authnetService = getAuthnetService(Meteor.AuthNet.accountOptions());

    return authnetService.refundTransaction.call(authnetService,
      transactionId,
      options
    );
  },

  // TODO find out if there's a way to get list of refunds
  "authnet/refund/list": function (paymentMethod) {
    check(paymentMethod, ReactionCore.Schemas.PaymentMethod);

    this.unblock();

    let list = [];
    const {
      transationId
    } = paymentMethod;

    return list;
  }
});

function getAuthnetService(accountOptions) {
  const {
    login,
    tran_key,
    mode
  } = accountOptions;

  return new AuthNet({
    API_LOGIN_ID: login,
    TRANSACTION_KEY: tran_key,
    testMode: !mode
  });
}

function priorAuthCaptureTransaction(transId, amount, service) {
  let body = {
    transactionType: "priorAuthCaptureTransaction",
    amount: amount,
    refTransId: transId
  };

  return service.sendTransactionRequest.call(service, body, function (trans) {
    return {
      authCode: trans.authCode[0],
      _original: trans,
      transactionId: trans.transId[0]
    };
  });
}
