const btnElement = document.getElementById('calculate');
const billInput = document.getElementById('bill-amount');
const tipInput = document.getElementById('tip-percentage');
const tipAmount = document.getElementById('tip-amount');
const totalAmount = document.getElementById('total-amount');

btnElement.addEventListener('click', function() {
    const bill = parseFloat(billInput.value);
    const tip = parseFloat(tipInput.value);
    const tipCalc = (bill * tip) / 100;
    const totalCalc = bill + tipCalc;
    tipAmount.textContent = tipCalc.toFixed(2);
    totalAmount.textContent = totalCalc.toFixed(2);
});