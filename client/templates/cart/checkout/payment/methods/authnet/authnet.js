/* eslint camelcase: 0 */

// used to track asynchronous submitting for UI changes
let submitting = false;

AutoForm.addHooks("authnet-payment-form", {
  onSubmit(doc) {
    // Process form (pre-validated by autoform)
    submitting = true;
    let tpl = this.template;
    // regEx in the schema ensures that there will be exactly two names with one space between
    let payerNamePieces = doc.payerName.split(" ");
    let form = {
      first_name: payerNamePieces[0],
      last_name: payerNamePieces[1],
      number: doc.cardNumber,
      expire_date: doc.expireMonth.toString() + doc.expireYear.slice(-2),
      cvv2: doc.cvv,
      type: getCardType(doc.cardNumber)
    };

    // Reaction only stores type and 4 digits
    let storedCard = form.type.charAt(0).toUpperCase() + form.type.slice(1) + " " + doc.cardNumber.slice(-4);

    hidePaymentAlert();

    let paymentInfo = {
      total: ReactionCore.Collections.Cart.findOne().cartTotal(),
      currency: ReactionCore.Collections.Shops.findOne().currency
    };

    // Submit for processing
    Meteor.AuthNet.authorize(
      {
        cardNumber: doc.cardNumber,
        expirationYear: doc.expireYear,
        expirationMonth: doc.expireMonth
      },
      paymentInfo,
      function (error, transaction) {
        if (error) {
          console.log(error);
          uiEnd(tpl, "Resubmit payment");
        } else {
          let normalizedStatus = "failed";
          if (transaction.transactionResponse.responseCode === "1") {
            normalizedStatus = "created";
          }

          let normalizedMode = "authorize";

          let paymentMethod = {
            processor: "AuthNet",
            storedCard: storedCard,
            method: "method", // TODO investigate what it is
            transactionId: transaction.transactionResponse.transId.toString(),
            // Schema changed
            // authorizationCode: transaction.transactionResponse.authCode,
            amount: +paymentInfo.total,
            status: normalizedStatus,
            mode: normalizedMode,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactions: [
              transaction
            ]
          };

          Meteor.call("cart/submitPayment", paymentMethod);
          uiEnd(tpl, "Resubmit payment");
        }
      }
    );

    return false;
  },

  beginSubmit() {
    let tpl$ = this.template.$;
    // Show processing
    // tpl$(":input").attr("disabled", true);
    // tpl$("#btn-complete-order").text("Submitting ");
    // tpl$("#btn-processing").removeClass("hidden");
  },

  endSubmit() {
    // Hide processing UI here if form was not valid
    if (!submitting) {
      uiEnd(this.template, "Complete your order");
    }
  }
});

function uiEnd(tpl, buttonText) {
  tpl.$(":input").removeAttr("disabled");
  tpl.$("#btn-complete-order").text(buttonText);
  tpl.$("#btn-processing").addClass("hidden");
}

// function paymentAlert(errorMessage) {
//   $(".alert").removeClass("hidden").text(errorMessage);
// }

function hidePaymentAlert() {
  $(".alert").addClass("hidden").text("");
}

function handleAuthNetSubmitError(error) {
  // TODO - this error handling needs to be reworked for the Authorize.net API
  console.log(error);
}
