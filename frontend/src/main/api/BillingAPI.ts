declare var atlas: any;

interface BillingResponse {
    productCode: string;
    metadata: Object;
    monthlyEstimate: string;
    monthToDate: string;
    currentHour: string;
}

interface BillingCallback {
    (response: BillingResponse): void;
}

export class BillingAPI {

    private api: string;
    private accountContext: KnockoutObservable<any>;

    constructor(api: string, accountContext: KnockoutObservable<any>) {
        this.api = api;
        this.accountContext = accountContext;
    }

    getCustomerBilling = (callback: BillingCallback): void => {
        let url = this.api + "/" + this.accountContext().accountAlias + "/billing";
        this.getBilling(url, callback);
    };

    getSubscriptionBilling = (subscriptionId: number, callback: BillingCallback): void => {
        let url = this.api + "/" + this.accountContext().accountAlias + "/billing?subscriptionId=" + subscriptionId;
        this.getBilling(url, callback);
    };

    private getBilling = (url: string, callback: BillingCallback): void => {
        atlas.ajax({
            method: 'GET',
            url: url,
            success: (response: BillingResponse) => {
                callback(response);
            }
        });
    }

}