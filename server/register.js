ReactionCore.registerPackage({
  label: "Authorize.net",
  name: "reaction-auth-net",
  icon: "fa fa-credit-card",
  autoEnable: false,
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Authorize.net",
      route: "dashboard/authnet",
      description: "Authorize.net Payment for Reaction Commerce",
      icon: "fa fa-credit-card",
      cycle: 3,
      container: "dashboard"
    },

    // Settings panel
    {
      provides: "settings",
      label: "Authorize.net Settings",
      route: "dashboard/authnet",
      container: "reaction-auth-net",
      template: "authnetSettings"
    },

    // Payment form for checkout
    {
      template: "authnetPaymentForm",
      provides: "paymentMethod"
    }
  ],
  permissions: [{
    label: "Authorize.net",
    permission: "dashboard/payments",
    group: "Shop Settings"
  }]
});
