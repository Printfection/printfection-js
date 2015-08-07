# Printfection JavaScript API

Implementation of the [Printfection API](http://printfection.github.io/API-Documentation) for JavaScript.

## WARNING

**This API wrapper is in beta and not all methods have been fully finalized and tested.**

## Usage

First, include Printfection.js on the page and configure your API token. This can be found in your account on [printfection.com](http://printfection.com).

```html
<script type="text/javascript" src="https://api.printfection.com/v2/printfection.js"></script>
<script type="text/javascript">
  Printfection.configure({ api_token: "my-api-token" });
</script>
```

Next, anywhere in your markup:

```html
<a class="pf-order-button"
  data-campaign-id="1"
  data-name="Joseph Schmo"
  data-address="123 Main Street"
  data-address2="Suite 101"
  data-company="ACME Inc."
  data-city="Denver"
  data-state="Colorado"
  data-zip="80202"
  data-country="United States"
  data-email="joseph.schmo@example.com"
  data-phone="751-166-2910"
>Open Order</a>
```


## Salesforce Example

```javascript
{!requireScript("https://api.printfection.com/v2/printfection.js")}

Printfection.configure({
  api_token: "my-api-token"
});

var campaign_id = 1;
var order_id = '{!Task.PF_Order_Id__c}';

var address = {
      name:    "{!Contact.Name}",
      company: "{!Account.Name}",
      address: "{!Account.BillingStreet}",
      city:    "{!Account.BillingCity}",
      state:   "{!Account.BillingState}",
      zip:     "{!Account.BillingPostalCode}",
      country: "{!Account.BillingCountryCode}",
      email:   "{!User.Email}",
      phone:   "{!Account.Phone}"
    };

if (order_id.length) {
  Printfection.Orders.retrieve(order_id, function(order) {
    order.open(address);
  });
} else {
  Printfection.Orders.create({
    campaign_id: campaign_id
  }, function(order) {
    // Save new PF Order Id to this task
    var task = new sforce.SObject("Task");
    task.id = '{!Task.Id}';
    task.PF_Order_Id__c = order.id;
    sforce.connection.update([task]);

    // Open order in popup window
    order.open(address);
  });
}
```


## License

[MIT](LICENSE.txt)

## Issues & Support

[casey.ohara@printfection.com](mailto:casey.ohara@printfection.com)

## Contributing

1. Fork it ( https://github.com/printfection/printfection-js/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

