Template.authnet.helpers
  packageData: ->
    return ReactionCore.Collections.Packages.findOne({name:"reaction-authnet"})

AutoForm.hooks "authnet-update-form":
  onSuccess: (operation, result, template) ->
    Alerts.removeSeen()
    Alerts.add "Paypal settings saved.", "success"

  onError: (operation, error, template) ->
    Alerts.removeSeen()
    Alerts.add "Paypal settings update failed. " + error, "danger"
