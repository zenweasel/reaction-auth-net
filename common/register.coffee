ReactionCore.registerPackage
  name: 'reaction-auth-net'
  provides: ['paymentMethod']
  paymentTemplate: "authnetPaymentForm"
  label: 'AuthNet'
  description: 'Accept AuthNet'
  icon: 'fa fa-shopping-cart'
  settingsRoute: 'authnet'
  defaultSettings:
    mode: false
    client_id: ""
    client_secret: ""
  priority: '2'
  hasWidget: true
  shopPermissions: [
    {
      label: "Authorize.net"
      permission: "dashboard/payments"
      group: "Shop Settings"
    }
  ]
