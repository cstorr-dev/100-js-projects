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

  // currency tabs
  const currencyTabs   = document.querySelectorAll('.tab-button');

  // state
  let tipPercent = 0;           // 15 means 15%
  let currentCurrency = 'USD';  // selected display currency

  // demo rates relative to USD (adjust when you want)
  const RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 155.0
  };

  // --- helpers ---
  const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // convert from USD -> selected currency for display
  const convert = (amountInUSD) => amountInUSD * (RATES[currentCurrency] ?? 1);

  // formated using selected currency
  const money = (n) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: currentCurrency }).format(n);

  const setCustomActive = (on) => {
    customTipInput.classList.toggle('active', !!on);
  };

  function calculate() {
    const bill   = Math.max(0, toNumber(billInput?.value, 0));
    const guests = Math.max(1, toNumber(guestInput?.value, 1));
    const tip    = bill * (toNumber(tipPercent, 0) / 100);
    const total  = bill + tip;

    // base (USD) per-guest
    const tipPerGuest   = tip   / guests;
    const totalPerGuest = total / guests;

    // convert for display
    const tipPerGuestC   = convert(tipPerGuest);
    const totalC         = convert(total);
    const totalPerGuestC = convert(totalPerGuest);

    tipOut.textContent         = money(tipPerGuestC);
    totalAmountOut.textContent = money(totalC);
    perPersonOut.textContent   = money(totalPerGuestC);
    if (countOut) countOut.textContent = guests;
  }

  // currency tabs - set active & currency then recalc
  currencyTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency || 'USD';
      calculate();
    });
  });

  // live updates
  billInput.addEventListener('input', calculate);
  guestInput.addEventListener('input', calculate);

  // preset tip buttons
  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipPercent = toNumber(btn.dataset.tip, 0);
      customTipInput.value = '';
      setCustomActive(false);
      tipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculate();
    });
  });

  // custom tip — clears btns & stays highlighted
  const activateCustom = () => {
    tipButtons.forEach(b => b.classList.remove('active'));
    setCustomActive(true);
  };

  customTipInput.addEventListener('focus', activateCustom);
  customTipInput.addEventListener('click', activateCustom);
  customTipInput.addEventListener('input', () => {
    activateCustom();
    tipPercent = Math.max(0, toNumber(customTipInput.value, 0));
    calculate();
  });

  customTipInput.addEventListener('blur', () => {
    if (customTipInput.value.trim() === '') setCustomActive(false);
  });

  // reset btn
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
