document.addEventListener('DOMContentLoaded', function() {
    const btnElement = document.getElementById('calculate-button');
    const resetBtn = document.getElementById('reset-button');
    const billInput = document.getElementById('bill-amount');
    const customTipInput = document.getElementById('custom-tip');
    const tipOutput = document.getElementById('tip-number');
    const totalOutput = document.getElementById('total-number');
    const totalAmountOutput = document.getElementById('total-amount-number');
    const tipButtons = document.querySelectorAll('.tip-button');
    const guestCountInput = document.getElementById('guestCount');
    const countOutput = document.getElementById('count');

    let selectedTip = null;

    // Tip button selection
    tipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tipButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTip = parseFloat(btn.dataset.tip);
            customTipInput.value = '';
            customTipInput.classList.remove('active');
        });
    });

    customTipInput.addEventListener('blur', () => {
        customTipInput.classList.remove('active');
    });

    // Guest count slider 
 const syncGuests = () => {
    if (guestCountInput && countOutput) {
      const val = guestCountInput.value;
      countOutput.textContent = val; // visible number
      countOutput.value = val;       // optional: form value for <output>
    }
  };
  syncGuests();
  if (guestCountInput) guestCountInput.addEventListener('input', syncGuests);
}

    // Calculate button
    btnElement.addEventListener('click', function() {
        const bill = parseFloat(billInput.value) || 0;
        const guests = parseInt(guestCountInput.value) || 1;
        const tipPercent = selectedTip !== null ? selectedTip : (parseFloat(customTipInput.value) || 0);
        
        const tipTotal = (bill * tipPercent) / 100;
        const totalWithTip = bill + tipTotal;
        const tipPerGuest = tipTotal / guests;
        const totalPerGuest = totalWithTip / guests;

        // Update outputs
        totalAmountOutput.textContent = totalWithTip.toFixed(2);
        tipOutput.textContent = tipPerGuest.toFixed(2);
        totalOutput.textContent = totalPerGuest.toFixed(2);
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        billInput.value = '';
        customTipInput.value = '';
        guestCountInput.value = '1';
        countOutput.textContent = '1';
        
        // Clear tip selection
        tipButtons.forEach(b => b.classList.remove('active'));
        customTipInput.classList.remove('active');
        selectedTip = null;
        
        // Reset outputs
        totalAmountOutput.textContent = '0';
        tipOutput.textContent = '0';
        totalOutput.textContent = '0';
    });
});