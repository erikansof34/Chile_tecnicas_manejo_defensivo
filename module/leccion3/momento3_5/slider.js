export function init() {
  // Orden correcto
  const correctOrder = [
    "agente_transito_sld18",
    "señales_transitorias_sld18",
    "semaforos_sld18",
    "verticales_sld18",
    "horizontales_sld18"
  ];

  // Elementos DOM
  const container = document.querySelector('.container-dadarrast');
  const sortableContainer = document.querySelector('.sortable-container-dadarrast');
  const mobileContainer = document.querySelector('.mobile-container-dadarrast');
  const validateBtn = document.getElementById('validate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const validationMessage = document.querySelector('.validation-message-dadarrast');

  // Estado de la aplicación
  let isMobile = window.innerWidth <= 768;
  let hasInteraction = false;
  let isValidated = false;
  let selectedPositions = {};
  let items = Array.from(sortableContainer.querySelectorAll('.sortable-item-dadarrast'));

  // Inicializar
  shuffleItems();
  if (isMobile) {
    initMobileView();
  } else {
    initDesktopView();
  }

  // Event listeners
  validateBtn.addEventListener('click', handleValidate);
  resetBtn.addEventListener('click', handleReset);
  window.addEventListener('resize', handleResize);

  // Funciones
  function shuffleItems() {
    // Mezclar elementos para desktop
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      sortableContainer.appendChild(items[j]);
    }

    // Reordenar el array para reflejar el nuevo orden
    items = Array.from(sortableContainer.querySelectorAll('.sortable-item-dadarrast'));
  }

  function initDesktopView() {
    sortableContainer.style.display = 'flex';
    mobileContainer.style.display = 'none';

    // Hacer elementos arrastrables
    items.forEach(item => {
      item.setAttribute('draggable', 'true');

      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
        item.classList.add('dragging');
        document.body.style.overflow = 'hidden';
      });

      item.addEventListener('dragend', () => {
        items.forEach(i => i.classList.remove('dragging'));
        document.body.style.overflow = '';
        hasInteraction = true;
        validateBtn.disabled = false;
      });
    });

    sortableContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(sortableContainer, e.clientX);
      const draggable = document.querySelector('.dragging');
      if (draggable) {
        if (afterElement == null) {
          sortableContainer.appendChild(draggable);
        } else {
          sortableContainer.insertBefore(draggable, afterElement);
        }
      }
    });
  }

  function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.sortable-item-dadarrast:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function initMobileView() {
    sortableContainer.style.display = 'none';
    mobileContainer.style.display = 'flex';
    mobileContainer.innerHTML = '';

    // Crear elementos móviles
    const mobileOrder = [
      "señales_transitorias_sld18",
      "horizontales_sld18",
      "agente_transito_sld18",
      "verticales_sld18",
      "semaforos_sld18"
    ];

    mobileOrder.forEach(id => {
      const item = items.find(item => item.getAttribute('data-id') === id);
      if (item) {
        const mobileItem = document.createElement('div');
        mobileItem.className = 'mobile-item-dadarrast';
        mobileItem.setAttribute('data-id', id);
        mobileItem.innerHTML = item.innerHTML;

        const select = document.createElement('select');
        select.className = 'mobile-select-dadarrast';
        select.innerHTML = '<option value="">Seleccione...</option>' +
          '<option value="1">Paso 1</option>' +
          '<option value="2">Paso 2</option>' +
          '<option value="3">Paso 3</option>' +
          '<option value="4">Paso 4</option>' +
          '<option value="5">Paso 5</option>';

        select.addEventListener('change', (e) => {
          const position = parseInt(e.target.value);
          selectedPositions[id] = position;
          hasInteraction = true;

          // Deshabilitar esta opción en otros selects
          document.querySelectorAll('.mobile-select-dadarrast').forEach(otherSelect => {
            if (otherSelect !== select) {
              Array.from(otherSelect.options).forEach(option => {
                if (option.value === e.target.value && option.value !== "") {
                  option.disabled = true;
                }
              });
            }
          });

          // Habilitar el botón de validar si todos tienen selección
          const allSelected = Object.keys(selectedPositions).length === items.length;
          validateBtn.disabled = !allSelected;
        });

        mobileItem.appendChild(select);
        mobileContainer.appendChild(mobileItem);
      }
    });
  }

  function handleValidate() {
    isValidated = true;
    resetBtn.disabled = false;

    let results = [];

    if (isMobile) {
      // Validar para móvil
      items.forEach(item => {
        const id = item.getAttribute('data-id');
        const position = selectedPositions[id];
        const isCorrect = position === (correctOrder.indexOf(id) + 1);

        results.push({ id, isCorrect });

        const mobileItem = document.querySelector(`.mobile-item-dadarrast[data-id="${id}"]`);
        if (mobileItem) {
          if (isCorrect) {
            mobileItem.classList.add('correct-item-dadarrast');
          } else {
            mobileItem.classList.add('incorrect-item-dadarrast');
          }

          // Agregar icono de validación
          const iconDiv = document.createElement('div');
          iconDiv.className = 'validation-icon-dadarrast';

          const icon = document.createElement('img');
          icon.src = isCorrect ? './momento3_5/img/checkAct.png' : './momento3_5/img/xmarkAct.png';
          icon.alt = isCorrect ? 'Correcto' : 'Incorrecto';

          iconDiv.appendChild(icon);
          mobileItem.appendChild(iconDiv);

          // Deshabilitar el select
          const select = mobileItem.querySelector('select');
          select.disabled = true;
        }
      });
    } else {
      // Validar para desktop
      const currentOrder = Array.from(sortableContainer.querySelectorAll('.sortable-item-dadarrast'))
        .map(item => item.getAttribute('data-id'));

      results = currentOrder.map((id, index) => {
        const isCorrect = id === correctOrder[index];
        return { id, isCorrect };
      });

      // Aplicar estilos de validación
      items.forEach((item, index) => {
        const result = results[index];
        if (result.isCorrect) {
          item.classList.add('correct-item-dadarrast');
        } else {
          item.classList.add('incorrect-item-dadarrast');
        }

        // Agregar icono de validación
        const iconDiv = document.createElement('div');
        iconDiv.className = 'validation-icon-dadarrast';

        const icon = document.createElement('img');
        icon.src = result.isCorrect ? '../../assets/img/btn_validacion/checkAct.png' : '../../assets/img/btn_validacion/xmarkAct.png';
        icon.alt = result.isCorrect ? 'Correcto' : 'Incorrecto';

        iconDiv.appendChild(icon);
        item.appendChild(iconDiv);

        // Hacer no arrastrable
        item.setAttribute('draggable', 'false');
      });
    }

    // Mostrar mensaje de validación
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = correctOrder.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    validationMessage.style.display = 'block';
    if (correctCount === totalCount) {
      validationMessage.innerHTML = `
                <p class="validation-text-dadarrast">
                    <strong>¡Muy bien! ¡Has ordenado correctamente las señales de tránsito!</strong>
                </p>
                <p class="validation-score-dadarrast">
                    <strong>Tus respuestas correctas son: ${correctCount} de ${totalCount} (${percentage}%)</strong>
                </p>
            `;
      validationMessage.style.backgroundColor = '#e8f5e9';
    } else {
      validationMessage.innerHTML = `
                <p class="validation-text-dadarrast">
                    <strong>El orden no es correcto.</strong>
                </p>
                <p class="validation-score-dadarrast">
                    <strong>Tus respuestas correctas son: ${correctCount} de ${totalCount} (${percentage}%)</strong>
                </p>
            `;
      validationMessage.style.backgroundColor = '#ffebee';
    }
  }

  function handleReset() {
    // Reiniciar estado
    hasInteraction = false;
    isValidated = false;
    selectedPositions = {};

    // Limpiar validación
    validationMessage.style.display = 'none';

    if (isMobile) {
      // Reiniciar vista móvil
      document.querySelectorAll('.mobile-item-dadarrast').forEach(item => {
        item.classList.remove('correct-item-dadarrast', 'incorrect-item-dadarrast');
        const icon = item.querySelector('.validation-icon-dadarrast');
        if (icon) icon.remove();

        const select = item.querySelector('select');
        select.value = "";
        select.disabled = false;

        // Habilitar todas las opciones
        Array.from(select.options).forEach(option => {
          option.disabled = false;
        });
      });

      validateBtn.disabled = true;
    } else {
      // Reiniciar vista desktop
      shuffleItems();

      document.querySelectorAll('.sortable-item-dadarrast').forEach(item => {
        item.classList.remove('correct-item-dadarrast', 'incorrect-item-dadarrast', 'dragging');
        const icon = item.querySelector('.validation-icon-dadarrast');
        if (icon) icon.remove();

        item.setAttribute('draggable', 'true');
      });

      validateBtn.disabled = false;
    }

    resetBtn.disabled = true;
  }

  function handleResize() {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      handleReset();

      if (isMobile) {
        initMobileView();
      } else {
        initDesktopView();
      }
    }
  }
}