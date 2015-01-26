ReactionCore.registerPackage
  name: 'reaction-auth-net'
  provides: ['paymentMethod']
  paymentTemplate: "authnetPaymentForm"
  label: 'Authorize.net'
  description: 'Accept Authorize.net payments'
  icon: 'fa fa-credit-card'
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
