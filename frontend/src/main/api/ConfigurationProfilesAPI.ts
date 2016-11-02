export var atlas: any;

export class ConfigurationProfile {

    id: number;
    name: string;
    description: string;
    parameters: Array<any>;
    lastEditedBy: string;
    lastEdited: string;
    isDefault: boolean;
    lastEditedMessage: string;
    subscriptions: Array<SubscriptionReference>;

    constructor(data: ConfigurationProfileResponse) {
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

}

export interface ConfigurationProfileResponse {
    id: number;
    name: string;
    description: string;
    lastEditedBy: string
    lastEdited: string;
    parameters: Array<any>;
    isDefault: boolean;
    subscriptions: Array<SubscriptionReference>;
}

export interface SubscriptionReference {
    id: number;
    externalId: string;
}

export interface ConfigurationProfilesCallback {
    (response: Array<ConfigurationProfile>): void;
}

export class ConfigurationProfilesAPI {

    private api: string;
    private accountContext: KnockoutObservable<any>;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    getProfiles = (callback: ConfigurationProfilesCallback): void => {
        let configurationProfiles: Array<ConfigurationProfile> = [];
        atlas.ajax({
            url: this.api + "/" + this.accountContext().accountAlias + "/configurationprofiles",
            success: (data: Array<ConfigurationProfileResponse>) => {
                data.forEach((d) => {
                    configurationProfiles.push(new ConfigurationProfile(d));
                })
            },
            complete: () => {
                callback(configurationProfiles);
            }
        })
    }

}
