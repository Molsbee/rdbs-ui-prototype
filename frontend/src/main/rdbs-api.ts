import {BillingAPI} from "./api/BillingAPI";
import {ActionLogAPI} from "./api/ActionLogAPI";
import {SubscriptionAPI} from "./api/SubscriptionAPI";
import {EngineAPI} from "./api/EngineAPI";
import {ConfigurationProfilesAPI} from "./api/ConfigurationProfilesAPI";

declare var atlas: any;

export class RdbsApi {

    private api: string;
    private accountContext: KnockoutObservable<any>;

    private subscriptionsApi: SubscriptionAPI;
    private actionLogApi: ActionLogAPI;
    private billingAPI: BillingAPI;
    private engineAPI: EngineAPI;
    private configurationProfileAPI: ConfigurationProfilesAPI;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    subscriptions = () => {
        if (!this.subscriptionsApi) {
            console.log("Creating new instance of subscription api");
            this.subscriptionsApi = new SubscriptionAPI(this.api, this.accountContext);
        }

        return this.subscriptionsApi;
    };

    actionLog = () => {
        if (!this.actionLogApi) {
            console.log("Creating new instance of action log api");
            this.actionLogApi = new ActionLogAPI(this.api, this.accountContext);
        }

        return this.actionLogApi;
    };

    billing = () => {
        if (!this.billingAPI) {
            console.log("Creating new instance of billing api");
            this.billingAPI = new BillingAPI(this.api, this.accountContext);
        }

        return this.billingAPI;
    };

    engine = () => {
        if (!this.engineAPI) {
            console.log("Creating new instance of engine api");
            this.engineAPI = new EngineAPI(this.api, this.accountContext);
        }

        return this.engineAPI;
    };

    configurationProfile = () => {
        if (!this.configurationProfileAPI) {
            console.log("Creating new instance of configuration profile api");
            this.configurationProfileAPI = new ConfigurationProfilesAPI(this.api, this.accountContext);
        }

        return this.configurationProfileAPI;
    };

}
