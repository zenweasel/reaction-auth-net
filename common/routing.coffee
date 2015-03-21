Router.map ->
  @route 'authnet',
    controller: ShopAdminController
    path: 'dashboard/settings/authnet',
    template: 'authnet'
    waitOn: ->
      return ReactionCore.Subscriptions.Packages
