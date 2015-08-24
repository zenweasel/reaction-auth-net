Template.authnet.helpers({
  packageData: function() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-auth-net"
    });
  }
});

AutoForm.hooks({
  "authnet-update-form": {
    onSuccess: function(operation, result, template) {
      Alerts.removeSeen();
      return Alerts.add("Authorize.net settings saved.", "success", {
        autoHide: true
      });
    },
    onError: function(operation, error, template) {
      Alerts.removeSeen();
      return Alerts.add("Authorize.net settings update failed. " + error, "danger");
    }
  }
});
