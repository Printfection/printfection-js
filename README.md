# Printfection JavaScript API

Implementation of the [Printfection API](http://printfection.github.io/API-Documentation) for JavaScript.

## Please Note: This SDK is still in development!

**This API wrapper has been tested for specific use cases: 'Import/Collection' and 'Giveaway' campaign integration. However, it is _important_ to note that not all API methods and Printfection campaigns are supported. Examples not presented in this Readme have not been tested.**

## Usage

First, include Printfection.js on the page and configure your API token. This can be found in your account on [printfection.com](http://printfection.com).

```html
<script type="text/javascript" src="https://api.printfection.com/v2/printfection.js"></script>
<script type="text/javascript">
  Printfection.configure({ api_token: "YOUR-API-TOKEN" });
</script>
```

Next, anywhere in your markup:

```html
<a class="pf-order-button"
  data-campaign-id="123456"
  data-name="Joseph Schmo"
  data-address="123 Main Street"
  data-address_2="Suite 201"
  data-company="ACME Inc."
  data-city="Denver"
  data-state="Colorado"
  data-zip="80202"
  data-country="United States"
  data-email="joseph.schmo@example.com"
  data-phone="555-166-2910"
>Order Swag</a>
```


## Salesforce Example

```javascript
{!REQUIRESCRIPT("/soap/ajax/19.0/connection.js")}
{!requireScript("https://api.printfection.com/v2/printfection.js")}

Printfection.configure({
  api_token: "my-api-token"
});

var campaign_id = 123456;
var order_id = '{!Task.PF_Order_Id__c}';

var address = {
      name:    "{!Contact.Name}",
      company: "{!Account.Name}",
      address: "{!Account.BillingStreet}",
      city:    "{!Account.BillingCity}",
      state:   "{!Account.BillingState}",
      zipcode: "{!Account.BillingPostalCode}",
      country: "{!Account.BillingCountryCode}",
      email:   "{!Contact.Email}",
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
    task.PF_Order_Id__c = order.code;
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

