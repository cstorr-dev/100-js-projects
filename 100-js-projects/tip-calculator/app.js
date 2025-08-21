document.addEventListener('DOMContentLoaded', () => {
  // elements
  const resetBtn       = document.getElementById('reset-button');
  const billInput      = document.getElementById('bill-amount');
  const customTipInput = document.getElementById('custom-tip');
  const tipButtons     = document.querySelectorAll('.tip-button');
  const guestInput     = document.getElementById('guestCount');

  // outputs
  const tipOut         = document.getElementById('tip-number');            // tip per guest
  const totalAmountOut = document.getElementById('total-amount-number');   // bill + tip (whole)
  const perPersonOut   = document.getElementById('total-number');          // total per guest
  const countOut       = document.getElementById('count');                 // shows guest slider value

  // state
  let tipPercent = 0; // 15 means 15%

  // helpers
  const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const money = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  // visual helper for custom tip field
  const setCustomActive = (on) => {
    customTipInput.classList.toggle('active', !!on);
  };

  function calculate() {
    const bill   = Math.max(0, toNumber(billInput?.value, 0));
    const guests = Math.max(1, toNumber(guestInput?.value, 1));
    const tip    = bill * (toNumber(tipPercent, 0) / 100);
    const total  = bill + tip;

    const tipPerGuest   = tip   / guests;
    const totalPerGuest = total / guests;

    tipOut.textContent         = money(tipPerGuest);
    totalAmountOut.textContent = money(total);
    perPersonOut.textContent   = money(totalPerGuest);

    if (countOut) countOut.textContent = guests;
  }

  // live updates
  billInput.addEventListener('input', calculate);
  guestInput.addEventListener('input', calculate);

  // preset tip buttons
  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipPercent = toNumber(btn.dataset.tip, 0);
      customTipInput.value = '';
      setCustomActive(false);                         // 
      tipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculate();
    });
  });

  // custom tip — clears buttons & stays highlighted solo
  const activateCustom = () => {
    tipButtons.forEach(b => b.classList.remove('active')); // clear all button highlights
    setCustomActive(true);                                  // highlight custom
  };

  customTipInput.addEventListener('focus', activateCustom);
  customTipInput.addEventListener('click', activateCustom);
  customTipInput.addEventListener('input', () => {
    activateCustom();
    tipPercent = Math.max(0, toNumber(customTipInput.value, 0));
    calculate();
  });

  // if custom is emptied and loses focus, drop highlight
  customTipInput.addEventListener('blur', () => {
    if (customTipInput.value.trim() === '') setCustomActive(false);
  });

  // reset
  resetBtn?.addEventListener('click', () => {
    billInput.value = '';
    customTipInput.value = '';
    guestInput.value = 1;
    tipPercent = 0;
    setCustomActive(false);
    tipButtons.forEach(b => b.classList.remove('active'));
    calculate();
  });

  // first paint
  calculate();
});
