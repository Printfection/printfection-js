# Printfection JavaScript API

Implementation of the [Printfection API](http://printfection.github.io/API-Documentation) for JavaScript.

## WARNING

**This is project is a work in progress. It is incomplete and largely untested.**

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
