Router.map(function() {
  return this.route('dashboard/authnet', {
    controller: ShopAdminController,
    path: 'dashboard/settings/authnet',
    template: 'authnet',
    waitOn: function() {
      return ReactionCore.Subscriptions.Packages;
    }
  });
});
