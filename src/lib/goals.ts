interface YearlyResult {
	AsIsResultPerYear?: number;
	FutureResultPerYear?: number;
}

interface Result {
	IsGoalToDecrease: boolean;
	AsIsRiskFactoredTTM: number;
	FutureRiskFactoredTTM: number;
	YearlyResults: YearlyResult[];
	AsIsYearsSum: number;
	FutureYearsSum: number;
}

export interface Goal {
	Id: number;
	CustomerId: number;
	Order: number;
	Name: string;
	Item: string;
	Unit: string;
	IndustrySuccessRate: number;
	YourSuccessRate: number;
	YourTTMImprovement: number;
	Tooltip: string;
	DefaultCurrent: number;
	DefaultFuture: number;
	DefaultTTM: number;
	YearsToModel: number;
	IsActive: boolean;
	UserInputCurrent: number;
	UserInputFuture: number;
	UserInputTTM: number;
	UserIsSelected: boolean;
	Result: Result;
}

export const calculateResults = (goal: Goal): Result => {
	const AsIsRiskFactoredTTM = goal.UserInputTTM / goal.IndustrySuccessRate;
	const FutureRiskFactoredTTM =
		goal.UserInputTTM / (goal.YourSuccessRate * goal.YourTTMImprovement);
	const IsGoalToDecrease = goal.UserInputCurrent > goal.UserInputFuture ? true : false;

	const multiplyingFactor = IsGoalToDecrease ? 1 : -1;

	let YearlyResults: YearlyResult[] = new Array(goal.YearsToModel);
	let AsIsResultPerYear: number;
	let FutureResultPerYear: number;
	let AsIsYearsSum: number = 0;
	let FutureYearsSum: number = 0;
	let year: number;
	for (let i = 0; i < goal.YearsToModel; i++) {
		year = i + 1;
		AsIsResultPerYear =
			Math.min(Math.max(0, year - AsIsRiskFactoredTTM), 1) *
			multiplyingFactor *
			(goal.UserInputCurrent - goal.UserInputFuture);
		FutureResultPerYear =
			Math.min(Math.max(0, year - FutureRiskFactoredTTM), 1) *
			multiplyingFactor *
			(goal.UserInputCurrent - goal.UserInputFuture);

		AsIsYearsSum += AsIsResultPerYear;
		FutureYearsSum += FutureResultPerYear;

		YearlyResults[i] = {
			AsIsResultPerYear,
			FutureResultPerYear
		};
	}

	goal.Result = {
		IsGoalToDecrease,
		AsIsRiskFactoredTTM,
		FutureRiskFactoredTTM,
		YearlyResults,
		AsIsYearsSum,
		FutureYearsSum
	};

	return goal.Result;
};

export const getGoals = async (customerKey: string, licenseKey: string): Promise<Goal[]> => {
	const options = {
		method: 'POST',
		headers: {
			CustomerKey: customerKey,
			LicenseKey: licenseKey
		}
	};

	const goals: Goal[] = await (await fetch(import.meta.env.VITE_GOALS_ENDPOINT, options)).json();
	for (let i in goals) {
		const goal = goals[i];
		goal.UserInputCurrent = goal.DefaultCurrent;
		goal.UserInputFuture = goal.DefaultFuture;
		goal.UserInputTTM = goal.DefaultTTM;
		goal.UserIsSelected = false;
		$: goal.Result = calculateResults(goal);
	}

	if (goals.length === 0) {
		console.log('No goals found');
	}

	return goals;
};
