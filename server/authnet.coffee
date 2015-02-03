AuthNet = Npm.require("paynode").use("authorizenet")
Fiber = Npm.require("fibers")
Future = Npm.require("fibers/future")

Meteor.methods
  #submit (sale, authorize)
  authnetSubmit: (transactionType, cardData, paymentData) ->
    ReactionCore.Events.info("authnetSubmit: " + transactionType + cardData + paymentData)
    paymentObj = Meteor.AuthNet.paymentObj()
    paymentObj.intent = transactionType
    paymentObj.payer.funding_instruments.push Meteor.AuthNet.parseCardData(cardData)
    paymentObj.transactions.push Meteor.AuthNet.parsePaymentData(paymentData)
    ReactionCore.Events.info paymentObj.transactions

    client = AuthNet.createClient Meteor.AuthNet.accountOptions()

    fut = new Future()
    @unblock()
    client.performAimTransaction(
      x_type: "AUTH_CAPTURE"
      x_method: "CC"
      x_card_num: "4111111111111111"
      x_exp_date: "0115"
      x_amount: "19.99"
      x_description: "Sample Transaction"
      x_first_name: "John"
      x_last_name: "Doe"
      x_address: "1234 Street"
      x_state: "WA"
      x_zip: "98004"
    ).on("success", (err, result) ->
      ReactionCore.Events.info "Processed successfully."
      fut.return
        saved: true
        result: result
      return
    , (e) ->
      console.error e
      return
    # fut.wait()
    ).on "failure", (err, result) ->
      ReactionCore.Events.warn "Encountered an error"
      fut.return
        saved: false
        error: result.responsereasontext
      return
    , (e) ->
      console.error e
      return
    fut.wait()


  # capture (existing authorization)
  authnetCapture: (transactionId, captureDetails) ->
    ReactionCore.Events.info ("Capture Info: " + transactionId, captureDetails)
    client = AuthNet.createClient(
      level: AuthNet.levels.sandbox
      login: "2CxyF7b3njd"
      tran_key: "75Bm5295n53Rr5CA"
    )

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
