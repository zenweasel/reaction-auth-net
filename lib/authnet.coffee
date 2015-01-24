Meteor.AuthNet =
  accountOptions: ->
    settings = ReactionCore.Collections.Packages.findOne("name" : "reaction-auth-net").settings
    if settings?.mode is true then mode = 'secure.authorize.net' else mode = 'test.authorize.net'
    options =
      level: mode
      login: settings?.client_id || Meteor.settings.authnet.client_id
      tran_key: settings?.client_secret || Meteor.settings.authnet.client_secret
    return options

  #authorize submits a payment authorization to AuthNet
  authorize: (cardInfo, paymentInfo, callback) ->
    Meteor.call "authnetSubmit", "authorize", cardInfo, paymentInfo, callback
    return

  # purchase: function(card_info, payment_info, callback){
  #   Meteor.call('authnetSubmit', 'sale', card_info, payment_info, callback);
  # },
  capture: (transactionId, amount, callback) ->
    console.log("Capture Info: " + transactionId + amount + callback)
    captureDetails =
      amount:
        currency: "USD"
        total: amount
      is_final_capture: true

    Meteor.call "authnetCapture", transactionId, captureDetails, callback
    return

  #config is for the authnet configuration settings.
  config: (options) ->
    @accountOptions = options
    return

  paymentObj: ->
    intent: "sale"
    payer:
      payment_method: "CC"
      funding_instruments: []
    transactions: []

  parseCardData: (data) ->
    console.log("Parsing card data:" + data)
    type: data.type
    number: data.number
    first_name: data.first_name
    last_name: data.last_name
    cvv2: data.cvv2
    expire_month: data.expire_month
    expire_year: data.expire_year

  #parsePaymentData splits up the card data and gets it into a authnet friendly format.
  parsePaymentData: (data) ->
    console.log("Parsing payment data: " + data.total + data.currency)
    amount:
      total: data.total
      currency: data.currency
