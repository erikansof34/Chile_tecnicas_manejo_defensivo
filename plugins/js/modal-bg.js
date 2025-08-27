function observarModal(modal) {
  const modalContent = modal.querySelector('.modal-content');
  if (!modalContent) return;

  const resizeObserver = new ResizeObserver(() => {
    ajustarAltura(modal, modalContent);
  });

  resizeObserver.observe(modalContent);
}

function ajustarAltura(modal, modalContent) {
  const modalContentHeight = modalContent.scrollHeight;
  const windowHeight = window.innerHeight;
  let heightFinal = Math.max(modalContentHeight, windowHeight);

  if (Math.abs(modalContentHeight - windowHeight) < 20) {
    heightFinal += 60;
  } else if (modalContentHeight > windowHeight) {
    heightFinal += 60;
  }

  modal.style.setProperty('--modal-before-height', heightFinal + 'px');
}

function ajustarModalBefore() {
  setTimeout(() => {
    document.querySelectorAll('.modal.show').forEach(modal => {
      const modalContent = modal.querySelector('.modal-content');
      if (!modalContent) return;

      ajustarAltura(modal, modalContent);
      observarModal(modal);
    });
  }, 50);
}

document.addEventListener('shown.bs.modal', ajustarModalBefore);
window.addEventListener('resize', ajustarModalBefore);

function ajustarOpacidadNavegacion(opacidad) {
  const nav = document.querySelector('.btn-navigation-container');
  const par = document.querySelector('.btn-parallax-mobile');
  const widget = document.getElementById('accessibility-widget');
  if (nav) nav.style.opacity = opacidad;
  if (par) par.style.zIndex = (opacidad < 1) ? '1' : '1000';
  if (widget) widget.style.zIndex = (opacidad < 1) ? '1' : '1000';
}

document.addEventListener('shown.bs.modal', function () {
  ajustarOpacidadNavegacion(0.5); // Esto se ejecuta inmediatamente
  ajustarModalBefore();           // El alto del modal se ajusta con delay interno
});

document.addEventListener('hidden.bs.modal', function () {
  ajustarOpacidadNavegacion(1);
});


// vodigo para quitar o reiniciar audio al abrir modales
$(document)
  .on('show.bs.modal', '.modal', () => {
    $('audio').prop('muted', true).trigger('pause');
  })
  .on('hidden.bs.modal', '.modal', () => {
    $('audio').prop('muted', false);
  });  