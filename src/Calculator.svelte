<script lang="ts">
	import { onMount } from 'svelte';

	import { type Goal, getGoals, calculateResults } from './lib/goals';
	import { type Customer, getCustomer } from './lib/customerInfo';

	let customer: Customer;
	let goals: Goal[] = [];

	onMount(async () => {
		const target = document.getElementById('sustainability-calculator');
		const customerKey = target.getAttribute('data-CustomerKey');
		const licenseKey = target.getAttribute('data-LicenseKey');

		goals = await getGoals(customerKey, licenseKey);
		customer = await getCustomer(customerKey, licenseKey);
	});
</script>

{#if goals.length > 0 || true}
	<h1>Please select goals that you are interested in achieving:</h1>

	{#each goals as goal}
		<div class="form-control">
			<label class="label cursor-pointer">
				<input type="checkbox" class="toggle toggle-primary" bind:checked={goal.UserIsSelected} />
				{goal.Name}
			</label>
			{#if goal.UserIsSelected}
				<div>
					Years to Model: {goal.YearsToModel}
					<!-- <input type="number" bind:value={goal.YearsToModel} /> -->
					<input
						type="range"
						min="3"
						max="20"
						bind:value={goal.YearsToModel}
						class="range range-primary range-sm"
						on:input={() => {
							goal.Result = calculateResults(goal);
						}}
					/>
				</div>
				<div>
					What is your current value? <input
						type="number"
						bind:value={goal.UserInputCurrent}
						on:input={() => {
							goal.Result = calculateResults(goal);
						}}
					/>
				</div>
				<div>
					What is your future goal? <input
						type="number"
						bind:value={goal.UserInputFuture}
						on:input={() => {
							goal.Result = calculateResults(goal);
						}}
					/>
				</div>
				<div>
					How many years do you think it will take you to get there? <input
						type="number"
						bind:value={goal.UserInputTTM}
						on:input={() => {
							goal.Result = calculateResults(goal);
						}}
					/>
				</div>
				<h3>Results</h3>
				<p>
					If you continue with status quo, you would be able to achieve your goal in <b
						>{goal.Result.AsIsRiskFactoredTTM} years
					</b>
					(risk adjusted per industry standards). This will add up to
					<b>{goal.Result.AsIsYearsSum}</b>
					{goal.Unit} of {goal.Item} over {goal.YearsToModel} years.
				</p>
				<p>
					With {customer.Name}, you will be able to acheive your goal in
					<b>{goal.Result.FutureRiskFactoredTTM} years</b> (also risk adjusted). This will add up to
					<b>{goal.Result.FutureYearsSum}</b>
					{goal.Unit} of {goal.Item} over {goal.YearsToModel} years.
				</p>
			{/if}
		</div>
	{/each}
{/if}
