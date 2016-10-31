define(["require", "exports", "../api/BillingAPI"], function (require, exports, BillingAPI_1) {
    "use strict";
    var Billing = (function () {
        function Billing(api, accountContext) {
            var _this = this;
            this.loadCustomerBilling = function (callback) {
                console.log("loading billing data");
                _this.currentHour = "...";
                _this.monthToDate = "...";
                _this.monthlyEstimate = "...";
                _this.billingApi.getCustomerBilling(function (billing) {
                    _this.currentHour = billing.currentHour;
                    _this.monthToDate = billing.monthToDate;
                    _this.monthlyEstimate = billing.monthlyEstimate;
                    callback();
                });
            };
            this.loadSubscriptionBilling = function (subscriptionId, callback) {
                console.log("loading subscription billing data");
                _this.currentHour = "...";
                _this.monthToDate = "...";
                _this.monthlyEstimate = "...";
                _this.billingApi.getSubscriptionBilling(subscriptionId, function (billing) {
                    _this.currentHour = billing.currentHour;
                    _this.monthToDate = billing.monthToDate;
                    _this.monthlyEstimate = billing.monthlyEstimate;
                    callback();
                });
            };
            this.billingApi = new BillingAPI_1.BillingAPI(api, accountContext);
        }
        return Billing;
    }());
    exports.Billing = Billing;
});
//# sourceMappingURL=billing.js.map