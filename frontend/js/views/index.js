define(["require", "exports", "knockout", "../model/subscription", "jquery"], function (require, exports, ko, subscription_1, $) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel(dbaasApi, accountContext) {
            this.subscriptionTab = ko.observable(true);
            // TODO: Figure out how to handle filterableArray
            this.subscriptions = ko.observableArray();
            this.subscriptionsIsLoading = ko.observable(true);
            this.promotionAvailable = ko.observable(false);
            this.configurationTab = ko.observable(window.location.hash == "#configuration");
            this.configurations = ko.observableArray();
            this.configurationsIsLoading = ko.observable(true);
            this.dbaasApi = dbaasApi;
            this.accountContext = accountContext;
            this.subscriptionTab(!this.configurationTab());
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
        ViewModel.prototype.getPromotionConsumed = function () {
            var viewModel = this;
            atlas.ajax({
                method: 'GET',
                url: viewModel.dbaasApi + "/" + viewModel.accountContext().accountAlias + "/promotions",
                success: function (data) {
                    var shouldBeAvailable = true;
                    data.forEach(function (p) {
                        if (p.promotionGroup == "Free Trial") {
                            shouldBeAvailable = false;
                            return;
                        }
                    });
                    viewModel.promotionAvailable(shouldBeAvailable);
                }
            });
        };
        // TODO: Will this even work with scope of this
        ViewModel.prototype.getSubscription = function () {
            var viewModel = this;
            this.subscriptionsIsLoading(true);
            // TODO Can this be made cleaner with promise
            atlas.ajax({
                method: 'GET',
                url: viewModel.dbaasApi + "/" + viewModel.accountContext().accountAlias + "/subscriptions",
                success: function (data) {
                    var subscriptionArray = [];
                    data.forEach(function (d) {
                        subscriptionArray.push(new subscription_1.Subscription(d));
                    });
                    viewModel.subscriptions(subscriptionArray);
                },
                complete: function () {
                    viewModel.subscriptionsIsLoading(false);
                }
            });
        };
        ViewModel.prototype.getConfigurations = function () {
            var viewModel = this;
            atlas.ajax({
                method: 'GET',
                url: viewModel.dbaasApi + "/" + viewModel.accountContext().accountAlias + "/configurationprofiles",
                success: function (data) {
                    var configurationArray = [];
                    data.forEach(function (d) {
                        d.configProfileUrl = "/" + viewModel.accountContext().accountAlias + "/configurationprofiles/" + d.id;
                        configurationArray.push(d);
                    });
                    viewModel.configurations(configurationArray);
                },
                complete: function () {
                    viewModel.configurationsIsLoading(false);
                }
            });
        };
        ViewModel.prototype.updatePage = function () {
            this.getPromotionConsumed();
            this.getSubscription();
            this.getConfigurations();
        };
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=index.js.map