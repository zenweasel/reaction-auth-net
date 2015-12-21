Template.authnetSettings.helpers({
  packageData() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-auth-net"
    });
  }
});

AutoForm.hooks({
  "authnet-update-form": {
    onSuccess() {
      Alerts.removeSeen();
      return Alerts.add("Authorize.net settings saved", "success", {
        autoHide: true
      });
    },

    onError(operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Authorize.net settings update failed. " + error, "danger");
    }
  }
});
