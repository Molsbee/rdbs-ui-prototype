define(["require", "exports", "../../model/history", "../../model/billing", "../../rdbs-api"], function (require, exports, history_1, billing_1, rdbs_api_1) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            // Page controls and subscriptions
            this.subscription = ko.observable();
            this.activeTab = ko.observable("backups");
            this.billing = ko.observable();
            // Resources
            this.history = ko.observable();
        }
        ViewModel.prototype.construct = function (subscriptionId, api, accountContext) {
            var _this = this;
            this.rdbsApi = new rdbs_api_1.RdbsApi(api, accountContext);
            this.rdbsApi.subscriptions().getSubscription(subscriptionId, function (s) {
                _this.subscription(s);
            });
            this.history(new history_1.History(api, accountContext));
            this.billing(new billing_1.Billing(api, accountContext));
        };
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=details.js.map