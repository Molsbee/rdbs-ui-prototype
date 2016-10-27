import {Subscription} from "./model/subscription";
import {Observable} from "knockout";

declare var atlas: any;

export class RdbsApi {

    api: string;
    accountContext: Observable<any>;

    private subscriptionsApi: SubscriptionAPI;

    constructor(api: string, accountContext: Observable<any>) {
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

    api: string;
    accountContext: Observable<any>;

    constructor(api: string, accountContext: Observable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    getSubscriptions = (callback: SubscriptionCallback): void => {
        let subscriptionsArray: Array<Subscription> = [];
        atlas.ajax({
            method: 'GET',
            url: this.api + "/" + this.accountContext().accountAlias + "/subscriptions",
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