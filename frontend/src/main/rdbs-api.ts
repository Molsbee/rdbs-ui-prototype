import {BillingAPI} from "./api/BillingAPI";
import {ActionLogAPI} from "./api/ActionLogAPI";
import {SubscriptionAPI} from "./api/SubscriptionAPI";

declare var atlas: any;

export class RdbsApi {

    api: string;
    accountContext: KnockoutObservable<any>;

    private subscriptionsApi: SubscriptionAPI;
    private actionLogApi: ActionLogAPI;
    private billingAPI: BillingAPI;

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

}
