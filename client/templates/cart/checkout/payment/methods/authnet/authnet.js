(function() {
  var handleAuthNetSubmitError, hidePaymentAlert, paymentAlert, submitting, uiEnd;

  uiEnd = function(template, buttonText) {
    template.$(":input").removeAttr("disabled");
    template.$("#btn-complete-order").text(buttonText);
    return template.$("#btn-processing").addClass("hidden");
  };

  paymentAlert = function(errorMessage) {
    return $(".alert").removeClass("hidden").text(errorMessage);
  };

  hidePaymentAlert = function() {
    return $(".alert").addClass("hidden").text('');
  };

  handleAuthNetSubmitError = function(error) {
    return error;
  };

  submitting = false;

  AutoForm.addHooks("authnet-payment-form", {
    onSubmit: function(doc) {
      var form, payerNamePieces, storedCard, template;
      submitting = true;
      template = this.template;
      hidePaymentAlert();
      payerNamePieces = doc.payerName.split(" ");
      form = {
        first_name: payerNamePieces[0],
        last_name: payerNamePieces[1],
        number: doc.cardNumber,
        expire_date: doc.expireMonth.toString() + doc.expireYear.slice(-2),
        cvv2: doc.cvv,
        type: getCardType(doc.cardNumber)
      };
      storedCard = form.type.charAt(0).toUpperCase() + form.type.slice(1) + " " + doc.cardNumber.slice(-4);
      Meteor.AuthNet.authorize(form, {
        total: ReactionCore.Collections.Cart.findOne().cartTotal(),
        currency: Shops.findOne().currency
      }, function(error, transaction) {
        var normalizedMode, normalizedStatus, paymentMethod;
        submitting = false;
        if (error) {
          handleAuthNetSubmitError(error);
          uiEnd(template, "Resubmit payment");
        } else {
          if (transaction.saved === true) {
            normalizedStatus = (function() {
              switch (transaction.response.responsecode) {
                case "1":
                  return "created";
                default:
                  return "failed";
              }
            })();
            normalizedMode = (function() {
              switch (transaction.response.transactiontype) {
                case "auth_only":
                  return "authorize";
                default:
                  return "capture";
              }
            })();
            paymentMethod = {
              processor: "AuthNet",
              storedCard: transaction.response.md5hash,
              method: transaction.response.method,
              transactionId: transaction.response.transactionid,
              authorizationCode: transaction.response.authorizationcode,
              amount: transaction.response.amount,
              status: normalizedStatus,
              mode: normalizedMode,
              createdAt: new Date(),
              updatedAt: new Date(),
              transactions: []
            };
            paymentMethod.transactions.push(transaction.response);
            CartWorkflow.paymentMethod(paymentMethod);
          } else {
            handleAuthNetSubmitError(error);
            uiEnd(template, "Resubmit payment");
          }
        }
      });
      return false;
    },
    beginSubmit: function() {
      this.template.$(":input").attr("disabled", true);
      this.template.$("#btn-complete-order").text("Submitting ");
      return this.template.$("#btn-processing").removeClass("hidden");
    },
    endSubmit: function(formId, template) {
      if (!submitting) {
        return uiEnd(this.template, "Complete your order");
      }
    }
  });

}).call(this);
