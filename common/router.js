Router.map(function () {
  this.route("dashboard/authnet", {
    controller: ShopAdminController,
    path: "/dashboard/authnet",
    template: "authnetDashboard",
    waitOn: function () {
      return ReactionCore.Subscriptions.Packages;
    }
  });
});
