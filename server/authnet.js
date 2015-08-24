var AuthNet, Fiber, Future;

AuthNet = Npm.require("paynode").use("authorizenet");

Fiber = Npm.require("fibers");

Future = Npm.require("fibers/future");

Meteor.methods({
  authnetSubmit: function(transactionType, cardData, paymentData) {
    var client, fut, paymentObj;
    ReactionCore.Events.info("authnetSubmit: " + transactionType + cardData + paymentData);
    paymentObj = Meteor.AuthNet.paymentObj(cardData, paymentData);
    client = AuthNet.createClient(Meteor.AuthNet.accountOptions());
    fut = new Future();
    this.unblock();
    client.performAimTransaction(paymentObj).on("success", function(error, result) {
      ReactionCore.Events.info("Processed successfully.");
      fut["return"]({
        saved: true,
        response: result
      });
    }, function(e) {
      console.error(e);
    }).on("failure", function(error, result) {
      ReactionCore.Events.warn("Encountered an error");
      fut["return"]({
        saved: false,
        error: result.responsereasontext
      });
    }, function(e) {
      console.error(e);
    });
    return fut.wait();
  },
  authnetCapture: function(captureDetails) {
    var client, fut;
    ReactionCore.Events.info("Capture Info: " + transactionId + captureDetails);
    client = AuthNet.createClient(Meteor.AuthNet.accountOptions());
    fut = new Future();
    this.unblock();
    client.performAimTransaction(captureDetails).on("success", function(error, result) {
      ReactionCore.Events.info("Processed successfully.");
      fut["return"]({
        saved: true,
        response: result
      });
    }, function(e) {
      console.error(e);
    }).on("failure", function(error, result) {
      ReactionCore.Events.warn("Encountered an error");
      fut["return"]({
        saved: false,
        error: result.responsereasontext
      });
    }, function(e) {
      console.error(e);
    });
    return fut.wait();
  }
});
