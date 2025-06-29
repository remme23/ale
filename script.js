document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('order-form');
  const summary = document.getElementById('summary');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements['name'].value;
    const pizza = form.elements['pizza'].value;
    summary.textContent = `Grazie ${name}! Hai ordinato una pizza ${pizza}.`;
    form.reset();
  });
});
