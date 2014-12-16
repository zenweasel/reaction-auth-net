ReactionCore.registerPackage
  name: 'reaction-authnet'
  provides: ['paymentMethod']
  label: 'AuthNet'
  description: 'Accept AuthNet'
  icon: 'fa fa-shopping-cart'
  settingsRoute: 'authnet'
  defaultSettings:
    mode: false
    client_id: ""
    client_secret: ""
  priority: '2'
  hasWidget: false
  autoEnable: true
  shopPermissions: [
    {
      label: "Authorize.net"
      permission: "dashboard/payments"
      group: "Shop Settings"
    }
  ]
