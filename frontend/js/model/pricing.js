define(["require", "exports"], function (require, exports) {
    "use strict";
    var PricingEstimator = (function () {
        function PricingEstimator(api, cpu, memory, storage) {
            var _this = this;
            this.cost = ko.observable();
            this.pricingError = ko.observable(false);
            this.pricingEstimate = ko.computed(function () {
                if (_this.pricingError()) {
                    return { hourlyCost: "-", monthlyCost: "-" };
                }
                if (!_this.cost()) {
                    return { hourlyCost: "...", monthlyCost: "..." };
                }
                var hourlyCost = (_this.cpu() * _this.cost().cpu) + (_this.memory() * _this.cost().memory) + (_this.storage() * _this.cost().storage);
                var monthlyCost = 720 * hourlyCost;
                return { hourlyCost: "$" + hourlyCost.toFixed(2), monthlyCost: "$" + monthlyCost.toFixed(2) };
            });
            this.loadPricing = function (engine, replicated, dataCenter) {
                atlas.ajax({
                    method: 'GET',
                    url: _this.api + "/pricing?engine=" + engine + "&replicated=" + replicated + "&dataCenter=" + dataCenter,
                    success: function (data) {
                        _this.cost(data);
                        _this.pricingError(false);
                    },
                    error: function () {
                        _this.pricingError(true);
                    }
                });
            };
            this.api = api;
            this.cpu = cpu;
            this.memory = memory;
            this.storage = storage;
        }
        return PricingEstimator;
    }());
    exports.PricingEstimator = PricingEstimator;
});
//# sourceMappingURL=pricing.js.map