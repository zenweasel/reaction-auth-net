AuthNet = Npm.require("auth-net-request")
Fiber = Npm.require("fibers")
Future = Npm.require("fibers/future")

Meteor.methods
  #submit (sale, authorize)
  authnetSubmit: (transactionType, cardData, paymentData) ->
    AuthNet.configure Meteor.AuthNet.accountOptions()
    paymentObj = Meteor.AuthNet.paymentObj()
    paymentObj.intent = transactionType
    paymentObj.payer.funding_instruments.push Meteor.AuthNet.parseCardData(cardData)
    paymentObj.transactions.push Meteor.AuthNet.parsePaymentData(paymentData)

    fut = new Future()
    @unblock()
    AuthNet.payment.create paymentObj, Meteor.bindEnvironment((err, payment) ->
      if err
        fut.return
          saved: false
          error: err
      else
        fut.return
          saved: true
          payment: payment
      return
    , (e) ->
      console.error e
      return
    )
    fut.wait()


  # capture (existing authorization)
  authnetCapture: (transactionId, captureDetails) ->
    AuthNet.configure Meteor.AuthNet.accountOptions()

    fut = new Future()
    @unblock()
    AuthNet.authorization.capture transactionId, captureDetails, (error, capture) ->
      if error
        fut.return
          saved: false
          error: error
      else
        fut.return
          saved: true
          capture: capture
      return
    fut.wait()
