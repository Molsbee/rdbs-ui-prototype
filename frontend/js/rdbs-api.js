define(["require", "exports", "./model/subscription"], function (require, exports, subscription_1) {
    "use strict";
    var RdbsApi = (function () {
        function RdbsApi(api, accountContext) {
            var _this = this;
            this.subscriptions = function () {
                if (!_this.subscriptionsApi) {
                    console.log("New instance of subscript api created");
                    _this.subscriptionsApi = new SubscriptionAPI(_this.api, _this.accountContext);
                }
                return _this.subscriptionsApi;
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return RdbsApi;
    }());
    exports.RdbsApi = RdbsApi;
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
            this.api = api;
            this.accountContext = accountContext;
        }
        return SubscriptionAPI;
    }());
});
//# sourceMappingURL=rdbs-api.js.map