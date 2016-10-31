define(["require", "exports"], function (require, exports) {
    "use strict";
    var BillingAPI = (function () {
        function BillingAPI(api, accountContext) {
            var _this = this;
            this.getCustomerBilling = function (callback) {
                var url = _this.api + "/" + _this.accountContext().accountAlias + "/billing";
                _this.getBilling(url, callback);
            };
            this.getSubscriptionBilling = function (subscriptionId, callback) {
                var url = _this.api + "/" + _this.accountContext().accountAlias + "/billing?subscriptionId=" + subscriptionId;
                _this.getBilling(url, callback);
            };
            this.getBilling = function (url, callback) {
                atlas.ajax({
                    method: 'GET',
                    url: url,
                    success: function (response) {
                        callback(response);
                    }
                });
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return BillingAPI;
    }());
    exports.BillingAPI = BillingAPI;
});
//# sourceMappingURL=BillingAPI.js.map