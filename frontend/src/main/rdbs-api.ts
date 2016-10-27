import {Subscription} from "./model/subscription";

declare var atlas: any;

export class RdbsApi {

    api: string;
    accountContext: any;
    private subscriptionsApi: SubscriptionAPI;

    constructor(api: string, accountContext: any) {
        this.api = api;
        this.accountContext = accountContext;
    }

    subscriptions = () => {
        if (!this.subscriptionsApi) {
            console.log("New instance of subscript api created");
            this.subscriptionsApi = new SubscriptionAPI(this.api, this.accountContext);
        }

        return this.subscriptionsApi;
    }

}

export interface SubscriptionCallback {
    (subsciptions: Array<Subscription>) : void;
}

class SubscriptionAPI {

    subscriptionsEndpoint: string;

    constructor(api: string, accountContext: any) {
        this.subscriptionsEndpoint = api + "/" + accountContext().accountAlias + "/subscriptions"
    }

    getSubscriptions = (callback: SubscriptionCallback): void => {
        let subscriptionsArray: Array<Subscription> = [];
        atlas.ajax({
            method: 'GET',
            url: this.subscriptionsEndpoint,
            success: (data: Array<any>) => {
                data.forEach((d: any) => {
                    subscriptionsArray.push(new Subscription(d));
                });
            },
            complete: () => {
                callback(subscriptionsArray);
            }
        });
    }

}