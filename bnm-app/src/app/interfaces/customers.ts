export interface Customer {
    id: string;
    companyName: string;
    companyPhone: string;
    companyAddress: {
        street: string,
        city: string,
        state: string,
        zip: string,

    };
    contactName: string;
    contactPhone: string;
    creationDate: any;
}
