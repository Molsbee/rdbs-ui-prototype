define(["require", "exports"], function (require, exports) {
    "use strict";
    var ConfigurationProfile = (function () {
        function ConfigurationProfile(data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.parameters = data.parameters;
            this.lastEditedBy = data.lastEdited;
            this.lastEditedBy = moment.utc(data.lastEdited).format("MMMM DD, YYYY HH:mm:ss z");
            this.isDefault = data.isDefault;
            this.lastEditedMessage = "Last edited " + data.lastEdited + " by " + data.lastEditedBy;
            this.subscriptions = data.subscriptions;
        }
        return ConfigurationProfile;
    }());
    exports.ConfigurationProfile = ConfigurationProfile;
    var ConfigurationProfilesAPI = (function () {
        function ConfigurationProfilesAPI(api, accountContext) {
            var _this = this;
            this.getProfiles = function (callback) {
                var configurationProfiles = [];
                exports.atlas.ajax({
                    url: _this.api + "/" + _this.accountContext().accountAlias + "/configurationprofiles",
                    success: function (data) {
                        data.forEach(function (d) {
                            configurationProfiles.push(new ConfigurationProfile(d));
                        });
                    },
                    complete: function () {
                        callback(configurationProfiles);
                    }
                });
            };
            this.api = api;
            this.accountContext = accountContext;
        }
        return ConfigurationProfilesAPI;
    }());
    exports.ConfigurationProfilesAPI = ConfigurationProfilesAPI;
});
//# sourceMappingURL=ConfigurationProfilesAPI.js.map