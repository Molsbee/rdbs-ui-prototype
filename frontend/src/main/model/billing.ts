declare var atlas: any;

interface BillingResponse {
    productCode: string;
    metadata: Object;
    monthlyEstimate: string;
    monthToDate: string;
    currentHour: string;
}

interface Callback {
    (): void;
}

export class Billing {

    // billingUrl: string;

    currentHour: string;
    monthToDate: string;
    monthlyEstimate: string;

    constructor() {
    }

    loadBilling(billingURL: string, callback: Callback) {
        console.log("loading billing data");
        let self = this;
        self.currentHour = "...";
        self.monthToDate = "...";
        self.monthlyEstimate = "...";

        atlas.ajax({
            method: 'GET',
            url: billingURL,
            success: function(response: BillingResponse) {
                self.currentHour = response.currentHour;
                self.monthToDate = response.monthToDate;
                self.monthlyEstimate = response.monthlyEstimate;
            },
            error: function() {
                self.currentHour = "-";
                self.monthToDate = "-";
                self.monthlyEstimate = "-"
            },
            complete: function() {
                callback();
            }
        })
    }

}

