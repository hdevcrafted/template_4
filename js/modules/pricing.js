/**
 * Pricing Module - Handles billing toggle and pricing updates
 */

export function initPricing() {
  // Billing Toggle - Update prices
  const billingRadios = document.querySelectorAll('input[name="billing"]');
  billingRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      const isYearly = this.value === 'yearly';
      document.querySelectorAll('.price-amount').forEach(priceElement => {
        const monthlyPrice = priceElement.getAttribute('data-monthly');
        const yearlyPrice = priceElement.getAttribute('data-yearly');
        priceElement.textContent = isYearly ? yearlyPrice : monthlyPrice;
      });

      // Update period label
      const periodLabels = document.querySelectorAll('.price-period');
      periodLabels.forEach(label => {
        label.textContent = isYearly ? '/year' : '/month';
      });
    });
  });
}

export function initFAQ() {
  // FAQ Toggle
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('i');
      answer.classList.toggle('show');
      icon.style.transform = answer.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });
}
