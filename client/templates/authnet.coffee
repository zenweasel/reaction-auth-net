Template.authnet.helpers
  packageData: ->
    return ReactionCore.Collections.Packages.findOne({name:"reaction-auth-net"})

AutoForm.hooks "authnet-update-form":
  onSuccess: (operation, result, template) ->
    Alerts.removeSeen()
    Alerts.add "Authorize.net settings saved.", "success", autoHide: true

  onError: (operation, error, template) ->
    Alerts.removeSeen()
    Alerts.add "Authorize.net settings update failed. " + error, "danger"
