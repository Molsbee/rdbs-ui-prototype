define(["require", "exports", "../model/subscription"], function (require, exports, subscription_1) {
    "use strict";
    var SubscriptionAPI = (function () {
        function SubscriptionAPI(api, accountContext) {
            var _this = this;
            this.getSubscriptions = function (callback) {
                var subscriptionsArray = [];
                atlas.ajax({
                    method: 'GET',
                    url: _this.api + "/" + _this.accountContext().accountAlias + "/subscriptions",
                    success: function (data) {
                        data.forEach(function (d) {
                            subscriptionsArray.push(new subscription_1.Subscription(d));
                        });
                    },
                    complete: function () {
                        callback(subscriptionsArray);
                    }
                });
            };
            this.getSubscriptionsByEngine = function (engine, callback) {
                var subscriptionsArray = [];
                atlas.ajax({
                    method: 'GET',
                    url: _this.api + "/" + _this.accountContext().accountAlias + "/subscriptions?engine=" + engine,
                    success: function (data) {
                        data.forEach(function (d) {
                            subscriptionsArray.push(new subscription_1.Subscription(d));
                        });
                    },
                    complete: function () {
                        callback(subscriptionsArray);
                    }
                });
            };
            this.getSubscription = function (subscriptionId, callback) {
                var subscription;
                atlas.ajax({
                    method: 'GET',
                    url: _this.api + "/" + _this.accountContext().accountAlias + "/subscriptions/" + subscriptionId,
                    success: function (data) {
                        subscription = new subscription_1.Subscription(data);
                    },
                    complete: function () {
                        callback(subscription);
                    }
                });
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return SubscriptionAPI;
    }());
    exports.SubscriptionAPI = SubscriptionAPI;
});
//# sourceMappingURL=SubscriptionAPI.js.map