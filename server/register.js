ReactionCore.registerPackage({
  name: 'reaction-auth-net',
  autoEnable: false,
  settings: {
    mode: false,
    client_id: "",
    client_secret: ""
  },
  registry: [
    {
      provides: 'dashboard',
      label: 'Authorize.net',
      description: "Accept Authorize.net Payments",
      icon: 'fa fa-credit-card',
      cycle: '4',
      container: 'dashboard'
    }, {
      route: 'authnet',
      provides: 'settings',
      container: 'dashboard'
    }, {
      template: 'authnetPaymentForm',
      provides: 'paymentMethod'
    }
  ],
  permissions: [
    {
      label: "Authorize.net",
      permission: "dashboard/payments",
      group: "Shop Settings"
    }
  ]
});
