Meteor.AuthNet =
  accountOptions: ->
    settings = ReactionCore.Collections.Packages.findOne("name" : "reaction-auth-net").settings
    if settings?.mode is true then mode = 'secure.authorize.net' else mode = 'test.authorize.net'
    options =
      level: mode
      login: settings?.client_id || Meteor.settings.authnet?.client_id
      tran_key: settings?.client_secret || Meteor.settings.authnet?.client_secret
    unless options.login then throw new Meteor.Error 403, "Invalid Authnet Credentials"
    return options

  #authorize submits a payment authorization to AuthNet
  authorize: (cardData, paymentData, callback) ->
    Meteor.call "authnetSubmit", "authorize", cardData, paymentData, callback
    return

  # TODO - add a "charge" function that creates a new charge and captures all at once

  capture: (authCode, amount, callback) ->
    captureDetails =
      x_type: "CAPTURE_ONLY"
      x_amount: amount
      x_auth_code: authCode

    Meteor.call "authnetCapture", captureDetails, callback
    return

  #config is for the authnet configuration settings.
  config: (options) ->
    @accountOptions = options
    return

  paymentObj: (cardData, paymentData)->
    x_type: "AUTH_ONLY"
    x_method: "CC"
    x_card_num: cardData.number
    x_card_code: cardData.cvv2
    x_exp_date: cardData.expire_date
    x_amount: paymentData.total
    x_first_name: cardData.first_name
    x_last_name: cardData.last_name
    x_currency_code: paymentData.currency
