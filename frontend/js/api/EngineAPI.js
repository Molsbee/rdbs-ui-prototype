define(["require", "exports"], function (require, exports) {
    "use strict";
    var EngineAPI = (function () {
        function EngineAPI(api, accountContext) {
            this.get = function (callback) {
                atlas.ajax({
                    method: 'GET',
                    url: "${dbaasApi}/engines",
                    success: function (data) {
                        callback(data);
                    }
                });
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return EngineAPI;
    }());
    exports.EngineAPI = EngineAPI;
});
//# sourceMappingURL=EngineAPI.js.map