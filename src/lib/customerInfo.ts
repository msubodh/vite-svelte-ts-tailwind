export interface CustomerInfo {
	customerKey: string;
	licenseKey: string;
}

export interface Customer {
	Id: number;
	Name: string;
	LicenseKey: string;
	URL: string;
	StartDate: string;
	EndDate: string;
	CustomerKey: string;
}

export const getCustomer = async (customerKey: string, licenseKey: string): Promise<Customer> => {
	const options = {
		method: 'POST',
		headers: {
			CustomerKey: customerKey,
			LicenseKey: licenseKey
		}
	};
	const customer: Customer = await (
		await fetch(import.meta.env.VITE_CUSTOMER_ENDPOINT, options)
	).json();
	return customer;
};
