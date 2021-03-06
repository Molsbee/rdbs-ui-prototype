define(["require", "exports", "jquery", "knockout", "../model/billing", "../model/history", "../rdbs-api"], function (require, exports, $, ko, billing_1, history_1, rdbs_api_1) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel(dbaasApi, accountContext) {
            var _this = this;
            this.billing = ko.observable();
            this.history = ko.observable();
            this.subscriptionTab = ko.observable(true);
            // TODO: Figure out how to handle filterableArray
            this.subscriptions = ko.observableArray();
            this.subscriptionsIsLoading = ko.observable(true);
            this.promotionAvailable = ko.observable(false);
            this.configurationTab = ko.observable(window.location.hash == "#configuration");
            this.configurations = ko.observableArray();
            this.configurationsIsLoading = ko.observable(true);
            this.getPromotionConsumed = function () {
                atlas.ajax({
                    method: 'GET',
                    url: _this.dbaasApi + "/" + _this.accountContext().accountAlias + "/promotions",
                    success: function (data) {
                        var shouldBeAvailable = true;
                        data.forEach(function (p) {
                            if (p.promotionGroup == "Free Trial") {
                                shouldBeAvailable = false;
                            }
                        });
                        console.log(shouldBeAvailable);
                        _this.promotionAvailable(shouldBeAvailable);
                    }
                });
            };
            this.getSubscription = function () {
                _this.subscriptionsIsLoading(true);
                _this.rdbsApi.subscriptions().getSubscriptions(function (subscriptions) {
                    _this.subscriptions(subscriptions);
                    _this.subscriptionsIsLoading(false);
                });
            };
            this.getConfigurations = function () {
                atlas.ajax({
                    method: 'GET',
                    url: _this.dbaasApi + "/" + _this.accountContext().accountAlias + "/configurationprofiles",
                    success: function (data) {
                        var configurationArray = [];
                        data.forEach(function (d) {
                            d.configProfileUrl = "/" + _this.accountContext().accountAlias + "/configurationprofiles/" + d.id;
                            configurationArray.push(d);
                        });
                        _this.configurations(configurationArray);
                    },
                    complete: function () {
                        _this.configurationsIsLoading(false);
                    }
                });
            };
            this.updatePage = function () {
                _this.getPromotionConsumed();
                _this.getSubscription();
                _this.getConfigurations();
                _this.billing().loadCustomerBilling(function () {
                    console.log("Billing call completed");
                    _this.billing.valueHasMutated();
                });
                _this.history().loadActionLogs();
            };
            this.dbaasApi = dbaasApi;
            this.rdbsApi = new rdbs_api_1.RdbsApi(dbaasApi, accountContext);
            this.accountContext = accountContext;
            this.subscriptionTab(!this.configurationTab());
            this.billing(new billing_1.Billing(dbaasApi, accountContext));
            this.history(new history_1.History(dbaasApi, accountContext));
        }
        ViewModel.prototype.activeTab = function (data) {
            if (data == "database") {
                this.subscriptionTab(true);
                this.configurationTab(false);
            }
            else if (data == "configuration") {
                this.configurationTab(true);
                this.subscriptionTab(false);
            }
        };
        ViewModel.prototype.clearFilter = function () {
            console.log("Filter Called");
        };
        ViewModel.prototype.addItemAnimation = function (element) {
            $(element).filter("li")
                .hide()
                .animate({ height: "toggle", backgroundColor: '#d9edf7' }, 200)
                .animate({ backgroundColor: 'transparent' }, 800);
        };
        ViewModel.prototype.removeItemAnimation = function (element) {
            $(element).filter("li").slideUp();
        };
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=index.js.map