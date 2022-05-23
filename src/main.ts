import Calculator from './Calculator.svelte';
import './index.css';

const calculator = new Calculator({
	target: document.getElementById('sustainability-calculator')
});

export default calculator;
