(function() {
  var root = window;

  // Default settings
  var config = {
    api_url: "https://api.printfection.com/v2",
    api_token: null,
    popup_settings: 'height=850,width=1000,left=100,top=100,scrollbars=yes,toolbar=no,status=no'
  };

  var PF = {};
  root.Printfection = PF;

  PF.configure = function(settings) {
    for (var key in settings) {
      config[key] = settings[key];
    }
  };


  //
  // Backward compatibility
  //
  // If callback arity is 1, the client is not expecting
  // the callback arguments in the form of (error, ...).
  // As a result, they won't be configured to handle an error,
  // so we will fail when arity is 1.
  // The length property specifies the number
  // of arguments expected by the function.
  PF.handle_success_callback = function(callback, data) {
    if (callback.length == 1) {
      callback(data);
    } else {
      callback(null, data);
    }
  }

  PF.handle_error_callback = function(callback, error) {
    if (callback.length == 1) {
      return; // Do nothing. Fail silently for backward compatibility.
    } else {
      callback(error, null);
    }
  }


  //
  // API Service
  //
  var API = {
    request: function(type, endpoint, callback) {
      callback    = callback || function(){};
      var url     = config.api_url + endpoint;
      var auth    = btoa(config.api_token + ":");
      var request = new XMLHttpRequest();
      request.open(type.toUpperCase(), url, true);
      request.setRequestHeader("Authorization","Basic " + auth);
      request.setRequestHeader("Content-type", "application/json");
      request.onreadystatechange = function () {
        if (request.readyState != 4) return;
        if (request.status != 200) {
          var error = JSON.parse(request.responseText);
          callback(error, null);
        } else {
          var response = JSON.parse(request.responseText);
          if (response.object == "list" && response.data) {
            callback(null, response.data);
          } else {
            callback(null, response);
          }
        }
      }
      return request;
    },

    get: function(endpoint, callback) {
      API.request("GET", endpoint, callback).send();
    },

    post: function(endpoint, payload, callback) {
      API.request("POST", endpoint, callback).send(JSON.stringify(payload));
    }
  };


  //
  // API Module
  //
  var UI = {
    init: function() {
      var buttons = document.getElementsByClassName('pf-order-button');
      for (i = 0; i < buttons.length; i += 1) {
        UI.bindButton(buttons[i]);
      }
    },

    bindButton: function(button) {
      button.addEventListener("click", function(event) {
        event.preventDefault();
        var campaign_id = button.dataset.campaignId;
        var ship_to = {
          name:      button.dataset.name,
          company:   button.dataset.company,
          address:   button.dataset.address,
          address_2: button.dataset.address_2,
          city:      button.dataset.city,
          state:     button.dataset.state,
          zipcode:   button.dataset.zipcode,
          country:   button.dataset.country,
          email:     button.dataset.email,
          phone:     button.dataset.phone
        };
        UI.createAndOpenOrder(campaign_id, ship_to);
      });
    },

    createAndOpenOrder: function(campaign_id, ship_to) {
      Printfection.Orders.create({
        campaign_id: campaign_id,
      }, function(order) {
        order.open(ship_to);
      });
    }
  };


  //
  // Campaigns Service
  //
  PF.Campaigns = {
    retrieve: function(id, callback) {
      callback = callback || function(){};
      API.get("/campaigns/" + id, function(error, data) {
        if (error) {
          PF.handle_error_callback(callback, error);
        } else {
          var campaign = new Campaign(data);
          PF.handle_success_callback(callback, campaign);
        }
      });
    }
  };


  //
  // Campaign Class
  //
  var Campaign = function(properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  };


  //
  // Orders Service
  //
  PF.Orders = {
    all: function(callback) {
      callback = callback || function(){};
      API.get("/orders", function(error, data) {
        if (error) {
          PF.handle_error_callback(callback, error);
        } else {
          var orders = [];
          for (i = 0; i < data.length; i += 1) {
            orders.push(new Order(data[i]));
          }
          PF.handle_success_callback(callback, orders);
        }
      });
    },
    retrieve: function(id, callback) {
      callback = callback || function(){};
      API.get("/orders/" + id, function(error, data) {
        if (error) {
          PF.handle_error_callback(callback, error)
        } else {
          var order = new Order(data);
          PF.handle_success_callback(callback, order);
        }
      });
    },
    create: function(properties, callback) {
      callback = callback || function(){};
      API.post("/orders", properties, function(error, data) {
        if (error) {
          PF.handle_error_callback(callback, error);
        } else {
          var order = new Order(data);
          PF.handle_success_callback(callback, order);
        }
      });
    }
  };


  //
  // Order Class
  //
  var Order = function(properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  };

  Order.prototype.open = function(options, callback) {
    options = options || {};
    callback = callback || function(){};

    var queries = [];
    options['name']       ? queries.push('name='      + options['name'])      : '';
    options['company']    ? queries.push('company='   + options['company'])   : '';
    options['address']    ? queries.push('address='   + options['address'])   : '';
    options['address_2']  ? queries.push('address_2=' + options['address_2']) : '';
    options['city']       ? queries.push('city='      + options['city'])      : '';
    options['state']      ? queries.push('state='     + options['state'])     : '';
    options['zipcode']    ? queries.push('zipcode='   + options['zipcode'])   : '';
    options['country']    ? queries.push('country='   + options['country'])   : '';
    options['email']      ? queries.push('email='     + options['email'])     : '';
    options['phone']      ? queries.push('phone='     + options['phone'])     : '';
    var url = this.url + "?" + queries.join("&");

    var child_window = window.open(url, "_blank", config.popup_settings);
    var timer = setInterval(function(){
      if (child_window.closed) {
        clearInterval(timer);
        callback();
      }
    }, 500);
  };

  //
  // Initialize
  //
  root.addEventListener('load', function() {
    UI.init();
  });
})();

