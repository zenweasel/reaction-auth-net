Template.authnetDashboard.helpers({
  packageData() {
    return ReactionCore.Collections.Packages.findOne({
      name: "reaction-auth-net"
    });
  }
});

Template.authnetDashboard.events({
  "click [data-event-action=showPaypalSettings]": function () {
    ReactionCore.showActionView();
  }
});
