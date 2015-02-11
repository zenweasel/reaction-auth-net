uiEnd = (template, buttonText) ->
  template.$(":input").removeAttr("disabled")
  template.$("#btn-complete-order").text(buttonText)
  template.$("#btn-processing").addClass("hidden")

paymentAlert = (errorMessage) ->
  $(".alert").removeClass("hidden").text(errorMessage)

hidePaymentAlert = () ->
  $(".alert").addClass("hidden").text('')

handleAuthNetSubmitError = (error) ->
  # TODO - this error handling needs to be reworked for the Authorize.net API
  console.log error

# used to track asynchronous submitting for UI changes
submitting = false

AutoForm.addHooks "authnet-payment-form",
  onSubmit: (doc) ->
    # Process form (pre-validated by autoform)
    submitting = true
    template = this.template
    hidePaymentAlert()

    # regEx in the schema ensures that there will be exactly two names with one space between
    payerNamePieces = doc.payerName.split " "

    # Format data for authnet
    form = {
      first_name: payerNamePieces[0]
      last_name: payerNamePieces[1]
      number: doc.cardNumber
      expire_date: doc.expireMonth.toString() + doc.expireYear.slice(-2)
      cvv2: doc.cvv
      type: getCardType(doc.cardNumber)
    }

    # Reaction only stores type and 4 digits
    storedCard = form.type.charAt(0).toUpperCase() + form.type.slice(1) + " " + doc.cardNumber.slice(-4)

    # Submit for processing
    Meteor.AuthNet.authorize form,
      total: ReactionCore.Collections.Cart.findOne().cartTotal()
      currency: Shops.findOne().currency
    , (error, transaction) ->
      console.log("entering form callback")
      submitting = false
      if error
        # this only catches connection/authentication errors
        handlePaypalSubmitError(error)
        # Hide processing UI
        uiEnd(template, "Resubmit payment")
        return
      else
        if transaction.saved is true #successful transaction

          # Normalize status
          normalizedStatus = switch transaction.response.responsecode
            when "1" then "created"
            else "failed"

          # Normalize mode
          normalizedMode = switch transaction.response.transactiontype
            when "auth_only" then "authorize"
            else "capture"

          # Format the transaction to store with order and submit to CartWorkflow
          paymentMethod =
            processor: "AuthNet"
            storedCard: transaction.response.md5hash
            method: transaction.response.method
            transactionId: transaction.response.transactionid
            authorizationCode: transaction.response.authorizationcode
            amount: transaction.response.amount
            status: normalizedStatus
            mode: normalizedMode
            createdAt: new Date()
            updatedAt: new Date()
            transactions: []
          paymentMethod.transactions.push transaction.response

          # Store transaction information with order
          # paymentMethod will auto transition to
          # CartWorkflow.paymentAuth() which
          # will create order, clear the cart, and update inventory,
          # and goto order confirmation page
          CartWorkflow.paymentMethod(paymentMethod)
          return
        else # card errors are returned in transaction
          handleAuthNetSubmitError(error)
          # Hide processing UI
          uiEnd(template, "Resubmit payment")
          return

    return false;

  beginSubmit: (formId, template) ->
    # Show Processing
    template.$(":input").attr("disabled", true)
    template.$("#btn-complete-order").text("Submitting ")
    template.$("#btn-processing").removeClass("hidden")
  endSubmit: (formId, template) ->
    # Hide processing UI here if form was not valid
    uiEnd(template, "Complete your order") if not submitting
