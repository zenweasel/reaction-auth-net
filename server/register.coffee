ReactionCore.registerPackage
  name: 'reaction-auth-net' # usually same as meteor package
  autoEnable: false # auto-enable in dashboard
  settings: # private package settings config (blackbox)
    mode: false
    client_id: ""
    client_secret: ""
  registry: [
    # all options except route and template
    # are used to describe the
    # dashboard 'app card'.
    {
      provides: 'dashboard'
      label: 'Authorize.net'
      description: "Accept Authorize.net Payments"
      icon: 'fa fa-credit-card' # glyphicon/fa
      cycle: '4' # Core, Stable, Testing (currently testing)
      container: 'dashboard'  #group this with settings
    }
    # configures settings link for app card
    # use 'group' to link to dashboard card
    {
      route: 'authnet'
      provides: 'settings'
      container: 'dashboard'
    }
    # configures template for checkout
    # paymentMethod dynamic template
    {
      template: 'authnetPaymentForm'
      provides: 'paymentMethod'
    }
  ]
  # array of permission objects
  permissions: [
    {
      label: "Authorize.net"
      permission: "dashboard/payments"
      group: "Shop Settings"
    }
  ]
