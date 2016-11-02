declare var atlas: any;

export interface Cost {
    hourlyCost: string;
    monthlyCost: string;
}

interface PricingEstimate {
    id: number;
    engine: string;
    replicated: boolean;
    cpu: number;
    memory: number;
    storage: number;
    dataCenters: Array<any>;
}

export class PricingEstimator {

    private api: string;
    private cpu: KnockoutObservable<number>;
    private memory: KnockoutObservable<number>;
    private storage: KnockoutObservable<number>;

    cost: KnockoutObservable<PricingEstimate> = ko.observable<PricingEstimate>();
    pricingError: KnockoutObservable<boolean> = ko.observable(false);
    pricingEstimate: KnockoutComputed<Cost> = ko.computed(() => {
        if (this.pricingError()) { return {hourlyCost: "-", monthlyCost: "-"}}
        if (!this.cost()) { return {hourlyCost: "...", monthlyCost: "..."}}

        let hourlyCost = (this.cpu() * this.cost().cpu) + (this.memory() * this.cost().memory) + (this.storage() * this.cost().storage);
        let monthlyCost = 720 * hourlyCost;
        return {hourlyCost: "$" + hourlyCost.toFixed(2), monthlyCost: "$" + monthlyCost.toFixed(2)}
    });

    constructor(api: string, cpu: KnockoutObservable<number>, memory: KnockoutObservable<number>, storage: KnockoutObservable<number>) {
        this.api = api;
        this.cpu = cpu;
        this.memory = memory;
        this.storage = storage;
    }

    loadPricing = (engine: string, replicated: boolean, dataCenter: string) => {
        atlas.ajax({
            method: 'GET',
            url: this.api + "/pricing?engine=" + engine + "&replicated=" + replicated + "&dataCenter=" + dataCenter,
            success: (data: PricingEstimate) => {
                this.cost(data);
                this.pricingError(false);
            },
            error: () => {
                this.pricingError(true);
            }
        });
    };

}
