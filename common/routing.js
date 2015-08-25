Router.map(function() {
  return this.route('authnet', {
    controller: ShopSettingsController,
    path: 'dashboard/settings/authnet',
    template: 'authnet',
    waitOn: function() {
      return ReactionCore.Subscriptions.Packages;
    }
  });
});
