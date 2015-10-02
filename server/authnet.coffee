AuthNet = Npm.require("paynode").use("authorizenet")
Fiber = Npm.require("fibers")
Future = Npm.require("fibers/future")

Meteor.methods
  #submit (sale, authorize)
  authnetSubmit: (transactionType, cardData, paymentData) ->
    ReactionCore.Log.info("authnetSubmit: " + transactionType + cardData + paymentData)
    paymentObj = Meteor.AuthNet.paymentObj(cardData, paymentData)

    client = AuthNet.createClient Meteor.AuthNet.accountOptions()

    fut = new Future()
    @unblock()
    client.performAimTransaction(paymentObj).on("success", (error, result) ->
      ReactionCore.Log.info "Processed successfully."
      fut.return
        saved: true
        response: result
      return
    , (e) ->
      console.error e
      return
    # fut.wait()
    ).on "failure", (error, result) ->
      ReactionCore.Log.warn "Encountered an error"
      fut.return
        saved: false
        error: result.responsereasontext
      return
    , (e) ->
      console.error e
      return
    fut.wait()


  # capture (existing authorization)
  authnetCapture: (captureDetails) ->
    ReactionCore.Log.info ("Capture Info: " + transactionId + captureDetails)

    client = AuthNet.createClient Meteor.AuthNet.accountOptions()

    fut = new Future()
    @unblock()
    client.performAimTransaction(captureDetails).on("success", (error, result) ->
      ReactionCore.Log.info "Processed successfully."
      fut.return
        saved: true
        response: result
      return
    , (e) ->
      console.error e
      return
    # fut.wait()
    ).on "failure", (error, result) ->
      ReactionCore.Log.warn "Encountered an error"
      fut.return
        saved: false
        error: result.responsereasontext
      return
    , (e) ->
      console.error e
      return
    fut.wait()
