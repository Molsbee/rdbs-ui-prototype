import {BillingAPI} from "../api/BillingAPI";
declare var atlas: any;

interface Callback {
    (): void;
}

export class Billing {

    private billingApi: BillingAPI;

    currentHour: string;
    monthToDate: string;
    monthlyEstimate: string;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.billingApi = new BillingAPI(api, accountContext);
    }

    loadCustomerBilling = (callback: Callback): void => {
        console.log("loading billing data");
        this.currentHour = "...";
        this.monthToDate = "...";
        this.monthlyEstimate = "...";

        this.billingApi.getCustomerBilling((billing) => {
            this.currentHour = billing.currentHour;
            this.monthToDate = billing.monthToDate;
            this.monthlyEstimate = billing.monthlyEstimate;
            callback();
        });
    };

    loadSubscriptionBilling = (subscriptionId: number, callback: Callback): void => {
        console.log("loading subscription billing data");
        this.currentHour = "...";
        this.monthToDate = "...";
        this.monthlyEstimate = "...";

        this.billingApi.getSubscriptionBilling(subscriptionId, (billing) => {
            this.currentHour = billing.currentHour;
            this.monthToDate = billing.monthToDate;
            this.monthlyEstimate = billing.monthlyEstimate;
            callback();
        })
    };

}

