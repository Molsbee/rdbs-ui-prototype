import {Subscription} from "../../model/subscription";
import {History} from "../../model/history";
import {Billing} from "../../model/billing";
import {RdbsApi} from "../../rdbs-api";

export class ViewModel {

    rdbsApi: RdbsApi;

    // Page controls and subscriptions
    subscription: KnockoutObservable<Subscription> = ko.observable<Subscription>();
    activeTab: KnockoutObservable<String> = ko.observable("backups");
    billing: KnockoutObservable<Billing> = ko.observable<Billing>();

    // Resources
    history: KnockoutObservable<History> = ko.observable<History>();

    construct(subscriptionId: number, api: string, accountContext: KnockoutObservable<any>) {
        this.rdbsApi = new RdbsApi(api, accountContext);
        this.rdbsApi.subscriptions().getSubscription(subscriptionId, (s) => {
            this.subscription(s);
        });

        this.history(new History(api, accountContext));
        this.billing(new Billing(api, accountContext));



    }

}