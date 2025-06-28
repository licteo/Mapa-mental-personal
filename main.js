const cards = document.querySelectorAll('.program-card');
const detailSection = document.getElementById('program-detail');
const mainContent = document.getElementById('main-content');
const backBtn = document.getElementById('back-btn');
const programTitle = document.getElementById('program-title');
const programNotes = document.getElementById('program-notes');
const notesToolbar = document.getElementById('notes-toolbar');

// Variables globales para recordatorios
let recordatoriosActivos = new Map();
let audioAlarma = null;

// Nuevo: contenedor para actividades
let programActivities = document.getElementById('program-activities');
if (!programActivities) {
  programActivities = document.createElement('div');
  programActivities.id = 'program-activities';
  programActivities.style.marginBottom = '1.5rem';
  detailSection.insertBefore(programActivities, programNotes);
}

let currentProgram = null;
let quill = null;

const defaultActividades = {
  espiritual: [
    {
      actividad: 'Cantar',
      tarea: 'Expresar la fe mediante música',
      acciones: [
        'Elegir canción espiritual',
        'Entonar con emoción',
        'Reflexionar sobre la letra'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    },
    {
      actividad: 'Orar',
      tarea: 'Conectarse con Dios mediante oración',
      acciones: [
        'Buscar un momento de silencio',
        'Expresar gratitud, petición, reflexión',
        'Finalizar en calma'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    },
    {
      actividad: 'Estudiar la Biblia',
      tarea: 'Comprender enseñanzas profundas',
      acciones: [
        'Leer un pasaje',
        'Analizar su significado',
        'Aplicarlo a la vida'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  cuerpo: [
    {
      actividad: 'Hacer ejercicio físico',
      tarea: 'Fortalecer y cuidar el cuerpo',
      acciones: [
        'Calentar con estiramiento',
        'Realizar rutina específica',
        'Estirar para finalizar'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  familia: [
    {
      actividad: 'Compartir tiempo de calidad',
      tarea: 'Fortalecer vínculos familiares',
      acciones: [
        'Conversar con interés',
        'Jugar o hacer algo juntos',
        'Escuchar activamente'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  trabajo: [
    {
      actividad: 'Asistencia y organización transporte',
      tarea: 'Control de entradas y salidas',
      acciones: [
        'Observar y anotar tiempos',
        'Organizar parqueo',
        'Coordinar flujos'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    },
    {
      actividad: 'Contar monedas o pagos',
      tarea: 'Registrar ingresos',
      acciones: [
        'Separar por valor',
        'Registrar en libreta/app',
        'Guardar con seguridad'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  estudio: [
    {
      actividad: 'Leer o aprender un tema',
      tarea: 'Adquirir conocimiento nuevo',
      acciones: [
        'Elegir tema',
        'Tomar apuntes',
        'Aplicar lo aprendido'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  recreacion: [
    {
      actividad: 'Jugar videojuegos',
      tarea: 'Estimular mente y creatividad',
      acciones: [
        'Escoger juego adecuado',
        'Establecer duración',
        'Reflexionar después'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    },
    {
      actividad: 'Ver películas',
      tarea: 'Relajarse e inspirarse',
      acciones: [
        'Seleccionar contenido',
        'Disfrutar con atención',
        'Conversar si es en grupo'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  casa: [
    {
      actividad: 'Limpiar y ordenar',
      tarea: 'Mantener espacios organizados',
      acciones: [
        'Escoger zona',
        'Recolectar y clasificar objetos',
        'Limpiar superficies'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ],
  social: [
    {
      actividad: 'Saludar y mostrar cortesía',
      tarea: 'Generar conexión con los demás',
      acciones: [
        'Saludar con sonrisa',
        'Usar frases como "gracias", "por favor"',
        'Contacto visual amable'
      ],
      activo: true,
      tareaActiva: true,
      accionesActivas: [true, true, true],
      tareaCompletada: false,
      accionesCompletadas: [false, false, false],
      fechaCompletado: null
    }
  ]
};

const nombres = {
  espiritual: '🌟 Espiritual',
  cuerpo: '💪 Cuerpo',
  familia: '👨‍👩‍👧‍👦 Familia',
  trabajo: '🧰 Trabajo',
  estudio: '📚 Estudio',
  recreacion: '🎮 Recreación',
  casa: '🏠 Casa',
  social: '🤝 Social'
};

function getActividades(program) {
  const data = localStorage.getItem('actividades_' + program);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultActividades[program] || [];
    }
  }
  return defaultActividades[program] || [];
}

function setActividades(program, acts) {
  localStorage.setItem('actividades_' + program, JSON.stringify(acts));
}

// Función para migrar datos existentes a la nueva estructura con campos de activación
function migrarDatosActividades() {
  const programas = ['espiritual', 'cuerpo', 'familia', 'trabajo', 'estudio', 'recreacion', 'casa', 'social'];
  
  programas.forEach(program => {
    const data = localStorage.getItem('actividades_' + program);
    if (data) {
      try {
        const acts = JSON.parse(data);
        let needsUpdate = false;
        
        acts.forEach(act => {
          // Agregar campos de activación si no existen
          if (act.activo === undefined) {
            act.activo = true;
            needsUpdate = true;
          }
          if (act.tareaActiva === undefined) {
            act.tareaActiva = true;
            needsUpdate = true;
          }
          if (act.accionesActivas === undefined) {
            act.accionesActivas = act.acciones ? act.acciones.map(() => true) : [];
            needsUpdate = true;
          }
          // Agregar campos de completado si no existen
          if (act.tareaCompletada === undefined) {
            act.tareaCompletada = false;
            needsUpdate = true;
          }
          if (act.accionesCompletadas === undefined) {
            act.accionesCompletadas = act.acciones ? act.acciones.map(() => false) : [];
            needsUpdate = true;
          }
          if (act.fechaCompletado === undefined) {
            act.fechaCompletado = null;
            needsUpdate = true;
          }
        });
        
        // Guardar solo si se realizaron cambios
        if (needsUpdate) {
          localStorage.setItem('actividades_' + program, JSON.stringify(acts));
        }
      } catch (e) {
        console.error('Error migrando datos para programa:', program, e);
      }
    }
  });
}

// Ejecutar migración al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  migrarDatosActividades();
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      currentProgram = card.dataset.programa;
      showProgramDetail(currentProgram);
    });
  });
});

backBtn.addEventListener('click', () => {
  detailSection.classList.add('hidden');
  document.querySelector('.programs-grid').style.display = 'grid';
});

// Función para aplicar formato desde el toolbar
if (notesToolbar) {
  notesToolbar.addEventListener('click', function(e) {
    if (e.target.dataset.cmd) {
      document.execCommand(e.target.dataset.cmd, false, null);
    }
  });
}

// Guardar notas como HTML
const programNotesDiv = document.getElementById('program-notes');
if (programNotesDiv) {
  programNotesDiv.addEventListener('input', () => {
    if (currentProgram) {
      localStorage.setItem('notas_' + currentProgram, programNotesDiv.innerHTML);
    }
  });
}

function initQuill() {
  if (quill) return;
  quill = new Quill('#program-notes', {
    modules: {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['clean']
      ]
    },
    theme: 'snow',
    placeholder: 'Escribe tus notas aquí...'
  });
  quill.on('text-change', function() {
    if (currentProgram) {
      localStorage.setItem('notas_' + currentProgram, quill.root.innerHTML);
    }
  });
}

function showProgramDetail(program) {
  programTitle.textContent = nombres[program];
  initQuill();
  if (quill) {
    const saved = localStorage.getItem('notas_' + program) || '';
    quill.root.innerHTML = saved;
  }
  // Mostrar etiquetas de notas
  if (notesTagsInput) {
    notesTagsInput.value = getTagsFromString(localStorage.getItem('tags_notas_' + program) ? JSON.parse(localStorage.getItem('tags_notas_' + program)) : []).join(', ');
    renderTagsList(getTagsFromString(localStorage.getItem('tags_notas_' + program) ? JSON.parse(localStorage.getItem('tags_notas_' + program)) : []), notesTagsList);
  }
  renderActividades(program);
  detailSection.classList.remove('hidden');
  document.querySelector('.programs-grid').style.display = 'none';
}

function renderActividades(program) {
  programActivities.innerHTML = '';
  const acts = getActividades(program);
  acts.forEach((act, idx) => {
    // Asegurar que los campos de activación y completado existan
    if (act.activo === undefined) act.activo = true;
    if (act.tareaActiva === undefined) act.tareaActiva = true;
    if (act.accionesActivas === undefined) {
      act.accionesActivas = act.acciones ? act.acciones.map(() => true) : [];
    }
    if (act.tareaCompletada === undefined) act.tareaCompletada = false;
    if (act.accionesCompletadas === undefined) {
      act.accionesCompletadas = act.acciones ? act.acciones.map(() => false) : [];
    }
    if (act.fechaCompletado === undefined) act.fechaCompletado = null;
    
    const actDiv = document.createElement('div');
    actDiv.className = 'actividad-bloque';
    
    // Crear toggles para activación
    const actividadToggle = `<label class="toggle-switch">
      <input type="checkbox" ${act.activo ? 'checked' : ''} data-type="actividad" data-idx="${idx}">
      <span class="toggle-slider"></span>
    </label>`;
    
    const tareaToggle = `<label class="toggle-switch">
      <input type="checkbox" ${act.tareaActiva ? 'checked' : ''} data-type="tarea" data-idx="${idx}">
      <span class="toggle-slider"></span>
    </label>`;
    
    // Crear checkbox para completado de tarea
    const tareaCompletadaCheckbox = `<label class="completion-checkbox">
      <input type="checkbox" ${act.tareaCompletada ? 'checked' : ''} data-type="tarea-completada" data-idx="${idx}">
      <span class="checkmark"></span>
    </label>`;
    
    // Crear toggles y checkboxes para cada acción
    const accionesToggles = act.acciones ? act.acciones.map((accion, accionIdx) => {
      const isActive = act.accionesActivas[accionIdx] !== false;
      const isCompleted = act.accionesCompletadas[accionIdx] === true;
      return `<div class="accion-item">
        <label class="toggle-switch small">
          <input type="checkbox" ${isActive ? 'checked' : ''} data-type="accion" data-idx="${idx}" data-accion-idx="${accionIdx}">
          <span class="toggle-slider"></span>
        </label>
        <label class="completion-checkbox small">
          <input type="checkbox" ${isCompleted ? 'checked' : ''} data-type="accion-completada" data-idx="${idx}" data-accion-idx="${accionIdx}">
          <span class="checkmark"></span>
        </label>
        <span class="accion-texto ${isActive ? '' : 'inactivo'} ${isCompleted ? 'completada' : ''}">${accion}</span>
      </div>`;
    }).join('') : '';
    
    // Mostrar fecha de completado si existe
    const fechaCompletadoInfo = act.fechaCompletado ? 
      `<div class="fecha-completado">✅ Completado el: ${new Date(act.fechaCompletado).toLocaleDateString()}</div>` : '';
    
    actDiv.innerHTML = `
      <div class="actividad-header">
        <div class="actividad-toggle">
          ${actividadToggle}
          <strong>Actividad ${idx + 1}:</strong> 
          <span class="actividad-nombre ${act.activo ? '' : 'inactivo'}">${act.actividad}</span>
        </div>
      </div>
      <div class="tarea-section">
        <div class="tarea-toggle">
          ${tareaToggle}
          <strong>Tarea:</strong> 
          <span class="actividad-tarea ${act.tareaActiva ? '' : 'inactivo'} ${act.tareaCompletada ? 'completada' : ''}">${act.tarea}</span>
          ${tareaCompletadaCheckbox}
        </div>
      </div>
      <div class="acciones-section">
        <strong>Acciones:</strong>
        <div class="actividad-acciones">
          ${accionesToggles}
        </div>
      </div>
      ${fechaCompletadoInfo}
      <div class="actividad-etiquetas">${(act.tags || []).map(t => `<span class='tag-chip'>${t}</span>`).join('')}</div>
      <div class="actividad-botones">
        <button class="btn-editar" data-idx="${idx}">Editar</button>
        <button class="btn-eliminar" data-idx="${idx}">Eliminar</button>
        <button class="btn-recordatorio" data-idx="${idx}">Recordatorio</button>
        <button class="btn-historial" data-idx="${idx}">Historial</button>
        <button class="btn-reset-completado" data-idx="${idx}">Reiniciar</button>
      </div>
      <div class="recordatorio-info" id="recordatorio-info-${idx}"></div>
    `;
    programActivities.appendChild(actDiv);
    
    // Mostrar info de recordatorio si existe
    const key = `recordatorio_${program}_${idx}`;
    const fechaHora = localStorage.getItem(key);
    if (fechaHora) {
      const infoDiv = actDiv.querySelector(`#recordatorio-info-${idx}`);
      if (infoDiv) {
        const fecha = new Date(parseInt(fechaHora));
        const sonidoKey = `recordatorio_sonido_${program}_${idx}`;
        const tipoSonido = localStorage.getItem(sonidoKey) || 'default';
        
        // Mapear el tipo de sonido a un emoji descriptivo
        const sonidoEmoji = {
          'default': '🔔',
          'notification': '📢',
          'alarm': '🚨',
          'bell': '🔔',
          'chime': '🎵',
          'ding': '💫',
          'ping': '📡',
          'pop': '💭',
          'success': '✅',
          'warning': '⚠️'
        };
        
        const emoji = sonidoEmoji[tipoSonido] || '🔔';
        infoDiv.innerHTML = `
          <div class="reminder-info">
            <div class="reminder-title">⏰ Recordatorio programado</div>
            <div class="reminder-details">Fecha: ${fecha.toLocaleString()}</div>
            <div class="reminder-sound">Sonido: ${emoji} ${tipoSonido === 'default' ? 'Sonido por defecto' : tipoSonido}</div>
            <button onclick="cancelarRecordatorio('${program}', ${idx}); renderActividades('${program}');" 
                    class="btn-cancel-reminder-info">
              ❌ Cancelar recordatorio
            </button>
          </div>
        `;
      }
    }
  });
  
  // Botón para agregar nueva actividad
  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Agregar actividad';
  addBtn.className = 'btn-agregar';
  addBtn.onclick = () => mostrarFormularioActividad(program);
  programActivities.appendChild(addBtn);

  // Listeners para toggles de activación
  programActivities.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const type = e.target.dataset.type;
      const accionIdx = e.target.dataset.accionIdx;
      const isChecked = e.target.checked;
      
      const acts = getActividades(program);
      if (acts[idx]) {
        if (type === 'actividad') {
          acts[idx].activo = isChecked;
        } else if (type === 'tarea') {
          acts[idx].tareaActiva = isChecked;
        } else if (type === 'accion' && accionIdx !== undefined) {
          if (!acts[idx].accionesActivas) {
            acts[idx].accionesActivas = acts[idx].acciones.map(() => true);
          }
          acts[idx].accionesActivas[parseInt(accionIdx)] = isChecked;
        }
        setActividades(program, acts);
        
        // Actualizar visualización
        const actividadDiv = e.target.closest('.actividad-bloque');
        if (type === 'actividad') {
          const nombreSpan = actividadDiv.querySelector('.actividad-nombre');
          nombreSpan.classList.toggle('inactivo', !isChecked);
        } else if (type === 'tarea') {
          const tareaSpan = actividadDiv.querySelector('.actividad-tarea');
          tareaSpan.classList.toggle('inactivo', !isChecked);
        } else if (type === 'accion') {
          const accionSpan = actividadDiv.querySelector(`[data-accion-idx="${accionIdx}"]`).closest('.accion-item').querySelector('.accion-texto');
          accionSpan.classList.toggle('inactivo', !isChecked);
        }
      }
    });
  });

  // Listeners para checkboxes de completado
  programActivities.querySelectorAll('.completion-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const type = e.target.dataset.type;
      const accionIdx = e.target.dataset.accionIdx;
      const isChecked = e.target.checked;
      
      const acts = getActividades(program);
      if (acts[idx]) {
        if (type === 'tarea-completada') {
          acts[idx].tareaCompletada = isChecked;
          if (isChecked) {
            acts[idx].fechaCompletado = Date.now();
          } else {
            acts[idx].fechaCompletado = null;
          }
        } else if (type === 'accion-completada' && accionIdx !== undefined) {
          if (!acts[idx].accionesCompletadas) {
            acts[idx].accionesCompletadas = acts[idx].acciones.map(() => false);
          }
          acts[idx].accionesCompletadas[parseInt(accionIdx)] = isChecked;
          
          // Verificar si todas las acciones están completadas
          const todasCompletadas = acts[idx].accionesCompletadas.every(completada => completada);
          if (todasCompletadas && !acts[idx].tareaCompletada) {
            acts[idx].tareaCompletada = true;
            acts[idx].fechaCompletado = Date.now();
          }
        }
        setActividades(program, acts);
        
        // Actualizar visualización
        const actividadDiv = e.target.closest('.actividad-bloque');
        if (type === 'tarea-completada') {
          const tareaSpan = actividadDiv.querySelector('.actividad-tarea');
          tareaSpan.classList.toggle('completada', isChecked);
          
          // Actualizar info de fecha
          const fechaInfo = actividadDiv.querySelector('.fecha-completado');
          if (isChecked) {
            if (!fechaInfo) {
              const newFechaInfo = document.createElement('div');
              newFechaInfo.className = 'fecha-completado';
              newFechaInfo.textContent = `✅ Completado el: ${new Date().toLocaleDateString()}`;
              actividadDiv.insertBefore(newFechaInfo, actividadDiv.querySelector('.actividad-etiquetas'));
            }
          } else {
            if (fechaInfo) {
              fechaInfo.remove();
            }
          }
        } else if (type === 'accion-completada') {
          const accionSpan = actividadDiv.querySelector(`[data-accion-idx="${accionIdx}"]`).closest('.accion-item').querySelector('.accion-texto');
          accionSpan.classList.toggle('completada', isChecked);
          
          // Actualizar checkbox de tarea si todas las acciones están completadas
          const tareaCheckbox = actividadDiv.querySelector('[data-type="tarea-completada"]');
          if (tareaCheckbox) {
            const todasCompletadas = acts[idx].accionesCompletadas.every(completada => completada);
            tareaCheckbox.checked = todasCompletadas;
            const tareaSpan = actividadDiv.querySelector('.actividad-tarea');
            tareaSpan.classList.toggle('completada', todasCompletadas);
          }
        }
      }
    });
  });

  // Listeners para editar, eliminar, recordatorio, historial y reiniciar
  programActivities.querySelectorAll('.btn-editar').forEach(btn => {
    btn.onclick = () => mostrarFormularioActividad(program, parseInt(btn.dataset.idx));
  });
  programActivities.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.onclick = () => eliminarActividad(program, parseInt(btn.dataset.idx));
  });
  programActivities.querySelectorAll('.btn-recordatorio').forEach(btn => {
    btn.onclick = () => {
      solicitarPermisoNotificaciones();
      const idx = parseInt(btn.dataset.idx);
      
      // Crear contenedor para el formulario de recordatorio
      const formContainer = document.createElement('div');
      formContainer.className = 'recordatorio-form-container';
      
      // Input para fecha y hora
      const fechaInput = document.createElement('input');
      fechaInput.type = 'datetime-local';
      fechaInput.style.marginRight = '0.5rem';
      fechaInput.style.marginBottom = '0.5rem';
      fechaInput.style.padding = '0.4rem';
      fechaInput.style.borderRadius = '0.3rem';
      fechaInput.style.border = '1px solid #ccc';
      
      // Selector de sonido
      const soundSelect = document.createElement('select');
      soundSelect.style.marginRight = '0.5rem';
      soundSelect.style.marginBottom = '0.5rem';
      soundSelect.style.padding = '0.4rem';
      soundSelect.style.borderRadius = '0.3rem';
      soundSelect.style.border = '1px solid #ccc';
      soundSelect.style.backgroundColor = '#fff';
      
      // Opciones de sonidos del sistema
      const soundOptions = [
        { value: 'default', text: '🔔 Sonido por defecto' },
        { value: 'notification', text: '📢 Notificación' },
        { value: 'alarm', text: '🚨 Alarma' },
        { value: 'bell', text: '🔔 Campana' },
        { value: 'chime', text: '🎵 Carillón' },
        { value: 'ding', text: '💫 Ding' },
        { value: 'ping', text: '📡 Ping' },
        { value: 'pop', text: '💭 Pop' },
        { value: 'success', text: '✅ Éxito' },
        { value: 'warning', text: '⚠️ Advertencia' }
      ];
      
      soundOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        soundSelect.appendChild(optionElement);
      });
      
      // Botón para probar sonido
      const testSoundBtn = document.createElement('button');
      testSoundBtn.textContent = '🔊 Probar';
      testSoundBtn.type = 'button';
      testSoundBtn.className = 'btn-test-sound';
      
      testSoundBtn.onclick = () => {
        reproducirSonidoSistema(soundSelect.value);
      };
      
      // Botones de acción
      const guardarBtn = document.createElement('button');
      guardarBtn.textContent = '💾 Guardar';
      guardarBtn.type = 'button';
      guardarBtn.className = 'btn-save-reminder';
      
      const cancelarBtn = document.createElement('button');
      cancelarBtn.textContent = '❌ Cancelar';
      cancelarBtn.type = 'button';
      cancelarBtn.className = 'btn-cancel-reminder';
      
      guardarBtn.onclick = () => {
        const fechaHora = new Date(fechaInput.value).getTime();
        const sonidoSeleccionado = soundSelect.value;
        
        if (!isNaN(fechaHora) && fechaHora > Date.now()) {
          programarRecordatorio(program, idx, acts[idx].actividad, fechaHora, sonidoSeleccionado);
          renderActividades(program);
        } else {
          alert('Selecciona una fecha y hora válida en el futuro.');
        }
      };
      
      cancelarBtn.onclick = () => renderActividades(program);
      
      // Agregar elementos al contenedor
      formContainer.appendChild(fechaInput);
      formContainer.appendChild(soundSelect);
      formContainer.appendChild(testSoundBtn);
      formContainer.appendChild(guardarBtn);
      formContainer.appendChild(cancelarBtn);
      
      const contenedor = btn.parentElement.parentElement;
      contenedor.querySelector('.recordatorio-info').innerHTML = '';
      contenedor.querySelector('.recordatorio-info').appendChild(formContainer);
    };
  });
  programActivities.querySelectorAll('.btn-historial').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      showActividadHistory(program, idx);
    };
  });
  programActivities.querySelectorAll('.btn-reset-completado').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      if (confirm('¿Reiniciar el estado de completado de esta actividad?')) {
        const acts = getActividades(program);
        if (acts[idx]) {
          acts[idx].tareaCompletada = false;
          acts[idx].accionesCompletadas = acts[idx].acciones ? acts[idx].acciones.map(() => false) : [];
          acts[idx].fechaCompletado = null;
          setActividades(program, acts);
          renderActividades(program);
        }
      }
    };
  });
  
  // Agregar botón de estadísticas de completado si no existe
  if (!document.getElementById('stats-completado-btn')) {
    const statsCompletadoBtn = document.createElement('button');
    statsCompletadoBtn.id = 'stats-completado-btn';
    statsCompletadoBtn.textContent = '📊 Progreso';
    statsCompletadoBtn.className = 'btn-stats-completado';
    statsCompletadoBtn.onclick = () => mostrarEstadisticasCompletado();
    
    // Insertar después del botón de estadísticas existente
    const statsBtn = document.getElementById('stats-btn');
    if (statsBtn && statsBtn.parentNode) {
      statsBtn.parentNode.insertBefore(statsCompletadoBtn, statsBtn.nextSibling);
    }
  }
  
  updateTagFilter();
  evitarPropagacionBotones();
}

function mostrarFormularioActividad(program, idx = null) {
  const acts = getActividades(program);
  let act = { 
    actividad: '', 
    tarea: '', 
    acciones: [''], 
    tags: [],
    activo: true,
    tareaActiva: true,
    accionesActivas: [true],
    tareaCompletada: false,
    accionesCompletadas: [false],
    fechaCompletado: null
  };
  if (idx !== null) {
    act = { 
      ...acts[idx], 
      acciones: [...acts[idx].acciones], 
      tags: acts[idx].tags || [],
      activo: acts[idx].activo !== undefined ? acts[idx].activo : true,
      tareaActiva: acts[idx].tareaActiva !== undefined ? acts[idx].tareaActiva : true,
      accionesActivas: acts[idx].accionesActivas || acts[idx].acciones.map(() => true),
      tareaCompletada: acts[idx].tareaCompletada !== undefined ? acts[idx].tareaCompletada : false,
      accionesCompletadas: acts[idx].accionesCompletadas || acts[idx].acciones.map(() => false),
      fechaCompletado: acts[idx].fechaCompletado || null
    };
  }

  // Crear formulario con Quill para tarea y acciones
  const formDiv = document.createElement('div');
  formDiv.className = 'actividad-bloque';
  formDiv.innerHTML = `
    <form class="form-actividad">
      <div class="form-section">
        <label class="form-label">
          <input type="checkbox" name="activo" ${act.activo ? 'checked' : ''} style="margin-right: 0.5rem;">
          Actividad activa
        </label>
        <label>Actividad:<br><input type="text" name="actividad" value="${act.actividad}" required></label>
      </div>
      
      <div class="form-section">
        <label class="form-label">
          <input type="checkbox" name="tareaActiva" ${act.tareaActiva ? 'checked' : ''} style="margin-right: 0.5rem;">
          Tarea activa
        </label>
        <label>Tarea:</label>
        <div id="quill-tarea" style="height: 60px;"></div>
      </div>
      
      <div class="form-section">
        <label>Acciones:</label>
        <div id="quill-acciones" style="height: 90px;"></div>
        <div class="acciones-activas-info">
          <small>Las acciones se activarán automáticamente. Puedes desactivarlas después de guardar.</small>
        </div>
      </div>
      
      <div class="form-section">
        <label>Etiquetas:<br><input type="text" name="tags" value="${act.tags ? act.tags.join(', ') : ''}" placeholder="Etiquetas (separadas por coma)" style="width:100%; border-radius:0.4rem; border:1px solid #ccc; padding:0.4rem;" /></label>
      </div>
      
      <div class="form-buttons">
        <button type="submit">${idx !== null ? 'Guardar cambios' : 'Agregar actividad'}</button>
        <button type="button" class="btn-cancelar">Cancelar</button>
      </div>
    </form>
  `;
  programActivities.innerHTML = '';
  programActivities.appendChild(formDiv);

  // Inicializar Quill para tarea y acciones
  const quillTarea = new Quill('#quill-tarea', {
    theme: 'snow',
    modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'indent': '-1'}, { 'indent': '+1' }], ['clean']] },
    placeholder: 'Describe la tarea...'
  });
  const quillAcciones = new Quill('#quill-acciones', {
    theme: 'snow',
    modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'indent': '-1'}, { 'indent': '+1' }], ['clean']] },
    placeholder: 'Lista de acciones...'
  });
  // Cargar valores si existen
  if (act.tarea) quillTarea.root.innerHTML = act.tarea;
  if (act.acciones && act.acciones.length) quillAcciones.root.innerHTML = act.acciones.join('<br>');

  // Cancelar
  formDiv.querySelector('.btn-cancelar').onclick = () => renderActividades(program);

  // Guardar
  formDiv.querySelector('form').onsubmit = e => {
    e.preventDefault();
    
    // Obtener el contenido de Quill y dividirlo en acciones individuales
    const accionesHtml = quillAcciones.root.innerHTML;
    const accionesArray = accionesHtml.split('<br>').filter(accion => accion.trim() !== '');
    
    const nuevaActividad = {
      actividad: formDiv.querySelector('input[name="actividad"]').value,
      tarea: quillTarea.root.innerHTML,
      acciones: accionesArray,
      tags: getTagsFromString(formDiv.querySelector('input[name="tags"]').value),
      activo: formDiv.querySelector('input[name="activo"]').checked,
      tareaActiva: formDiv.querySelector('input[name="tareaActiva"]').checked,
      accionesActivas: accionesArray.map(() => true), // Todas las acciones activas por defecto
      tareaCompletada: false, // Nueva actividad no completada
      accionesCompletadas: accionesArray.map(() => false), // Ninguna acción completada
      fechaCompletado: null // Sin fecha de completado
    };
    
    if (idx !== null) {
      // Preservar estados de activación y completado de acciones existentes si es posible
      if (acts[idx].accionesActivas && acts[idx].accionesActivas.length === accionesArray.length) {
        nuevaActividad.accionesActivas = acts[idx].accionesActivas;
      }
      if (acts[idx].accionesCompletadas && acts[idx].accionesCompletadas.length === accionesArray.length) {
        nuevaActividad.accionesCompletadas = acts[idx].accionesCompletadas;
      }
      // Preservar estado de completado de tarea
      nuevaActividad.tareaCompletada = acts[idx].tareaCompletada || false;
      nuevaActividad.fechaCompletado = acts[idx].fechaCompletado || null;
      
      acts[idx] = nuevaActividad;
      setActividades(program, acts);
      saveActividadHistory(program, idx, nuevaActividad);
      renderActividades(program);
      updateTagFilter();
    } else {
      acts.push(nuevaActividad);
      setActividades(program, acts);
      saveActividadHistory(program, acts.length - 1, nuevaActividad);
      renderActividades(program);
      updateTagFilter();
    }
  };
}

function eliminarActividad(program, idx) {
  if (confirm('¿Seguro que quieres eliminar esta actividad?')) {
    const acts = getActividades(program);
    acts.splice(idx, 1);
    setActividades(program, acts);
    renderActividades(program);
  }
}

// Registro del service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

// --- Funcionalidad de respaldo y restauración ---
const backupBtn = document.getElementById('backup-btn');
const restoreBtn = document.getElementById('restore-btn');
const restoreFile = document.getElementById('restore-file');

if (backupBtn) {
  backupBtn.onclick = function() {
    const datos = {};
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave.startsWith('notas_') || clave.startsWith('actividades_')) {
        datos[clave] = localStorage.getItem(clave);
      }
    }
    const blob = new Blob([JSON.stringify(datos, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'respaldo_programas_mentales.json';
    a.click();
    URL.revokeObjectURL(url);
  };
}

if (restoreBtn && restoreFile) {
  restoreBtn.onclick = function() {
    restoreFile.value = '';
    restoreFile.click();
  };
  restoreFile.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const datos = JSON.parse(evt.target.result);
        for (const clave in datos) {
          localStorage.setItem(clave, datos[clave]);
        }
        alert('¡Datos restaurados! Recarga la página para ver los cambios.');
      } catch (err) {
        alert('Error al restaurar los datos: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
}

// --- Recordatorios por actividad ---
function solicitarPermisoNotificaciones() {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permisos de notificación concedidos');
        }
      });
    } else if (Notification.permission === 'denied') {
      alert('Para recibir recordatorios, por favor habilita las notificaciones en tu navegador.');
    }
  } else {
    alert('Tu navegador no soporta notificaciones. Los recordatorios no funcionarán.');
  }
}

// Función para crear y cargar el audio de alarma
function crearAudioAlarma() {
  if (!audioAlarma) {
    audioAlarma = new Audio();
    
    // Crear un tono de alarma usando Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // También crear un audio de respaldo usando data URL
    const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    audioAlarma.src = audioData;
    audioAlarma.load();
  }
}

// Función para reproducir alarma
function reproducirAlarma() {
  try {
    // Intentar usar Web Audio API primero
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Crear un patrón de alarma más llamativo
    const now = audioContext.currentTime;
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.setValueAtTime(600, now + 0.1);
    oscillator.frequency.setValueAtTime(800, now + 0.2);
    oscillator.frequency.setValueAtTime(600, now + 0.3);
    oscillator.frequency.setValueAtTime(800, now + 0.4);
    oscillator.frequency.setValueAtTime(600, now + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    oscillator.start(now);
    oscillator.stop(now + 0.6);
    
    // Repetir el patrón
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      const now2 = audioContext.currentTime;
      oscillator2.frequency.setValueAtTime(800, now2);
      oscillator2.frequency.setValueAtTime(600, now2 + 0.1);
      oscillator2.frequency.setValueAtTime(800, now2 + 0.2);
      oscillator2.frequency.setValueAtTime(600, now2 + 0.3);
      
      gainNode2.gain.setValueAtTime(0.3, now2);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.4);
      
      oscillator2.start(now2);
      oscillator2.stop(now2 + 0.4);
    }, 700);
    
  } catch (error) {
    console.log('Error reproduciendo alarma:', error);
    // Fallback: intentar reproducir audio del navegador
    if (audioAlarma) {
      audioAlarma.play().catch(e => console.log('Error reproduciendo audio:', e));
    }
  }
}

// Función para reproducir sonidos del sistema
function reproducirSonidoSistema(tipoSonido) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    // Configurar diferentes sonidos según el tipo
    switch (tipoSonido) {
      case 'notification':
        // Sonido de notificación suave
        oscillator.frequency.setValueAtTime(523, now); // Do
        oscillator.frequency.setValueAtTime(659, now + 0.1); // Mi
        oscillator.frequency.setValueAtTime(784, now + 0.2); // Sol
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;
        
      case 'alarm':
        // Sonido de alarma fuerte y repetitivo
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            const time = audioContext.currentTime;
            osc.frequency.setValueAtTime(800, time);
            osc.frequency.setValueAtTime(600, time + 0.1);
            osc.frequency.setValueAtTime(800, time + 0.2);
            
            gain.gain.setValueAtTime(0.4, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            
            osc.start(time);
            osc.stop(time + 0.3);
          }, i * 400);
        }
        break;
        
      case 'bell':
        // Sonido de campana
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.setValueAtTime(600, now + 0.05);
        oscillator.frequency.setValueAtTime(800, now + 0.1);
        oscillator.frequency.setValueAtTime(600, now + 0.15);
        oscillator.frequency.setValueAtTime(800, now + 0.2);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;
        
      case 'chime':
        // Sonido de carillón
        const notes = [523, 659, 784, 1047]; // Do, Mi, Sol, Do alto
        notes.forEach((freq, index) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            const time = audioContext.currentTime;
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            
            osc.start(time);
            osc.stop(time + 0.3);
          }, index * 150);
        });
        break;
        
      case 'ding':
        // Sonido de ding simple
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
        
      case 'ping':
        // Sonido de ping electrónico
        oscillator.frequency.setValueAtTime(1000, now);
        oscillator.frequency.setValueAtTime(800, now + 0.05);
        oscillator.frequency.setValueAtTime(600, now + 0.1);
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
        
      case 'pop':
        // Sonido de pop suave
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.setValueAtTime(600, now + 0.05);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;
        
      case 'success':
        // Sonido de éxito
        const successNotes = [523, 659, 784]; // Do, Mi, Sol
        successNotes.forEach((freq, index) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            const time = audioContext.currentTime;
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            
            osc.start(time);
            osc.stop(time + 0.2);
          }, index * 100);
        });
        break;
        
      case 'warning':
        // Sonido de advertencia
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            const time = audioContext.currentTime;
            osc.frequency.setValueAtTime(600, time);
            osc.frequency.setValueAtTime(400, time + 0.1);
            
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            
            osc.start(time);
            osc.stop(time + 0.2);
          }, i * 300);
        }
        break;
        
      default:
        // Sonido por defecto (el mismo que la alarma original)
        reproducirAlarma();
        break;
    }
    
  } catch (error) {
    console.log('Error reproduciendo sonido del sistema:', error);
    // Fallback: usar el sonido por defecto
    reproducirAlarma();
  }
}

// Función para programar recordatorio
function programarRecordatorio(program, idx, actividad, fechaHora, tipoSonido = 'default') {
  const key = `recordatorio_${program}_${idx}`;
  const sonidoKey = `recordatorio_sonido_${program}_${idx}`;
  
  localStorage.setItem(key, fechaHora);
  localStorage.setItem(sonidoKey, tipoSonido);
  
  // Calcular tiempo hasta el recordatorio
  const tiempoHastaRecordatorio = fechaHora - Date.now();
  
  if (tiempoHastaRecordatorio > 0) {
    // Programar el recordatorio
    const timeoutId = setTimeout(() => {
      mostrarRecordatorio(program, idx, actividad, tipoSonido);
    }, tiempoHastaRecordatorio);
    
    // Guardar el timeout ID para poder cancelarlo
    recordatoriosActivos.set(key, timeoutId);
    
    console.log(`Recordatorio programado para: ${new Date(fechaHora).toLocaleString()} con sonido: ${tipoSonido}`);
  } else {
    // Si la fecha ya pasó, mostrar inmediatamente
    mostrarRecordatorio(program, idx, actividad, tipoSonido);
  }
}

// Función para mostrar recordatorio
function mostrarRecordatorio(program, idx, actividad, tipoSonido = 'default') {
  // Reproducir sonido específico
  reproducirSonidoSistema(tipoSonido);
  
  // Mostrar notificación del navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    const notificacion = new Notification('⏰ ¡Recordatorio de Actividad!', {
      body: `Programa: ${nombres[program]}\nActividad: ${actividad}\n\n¡Es hora de realizar esta actividad!`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `recordatorio_${program}_${idx}`,
      requireInteraction: true,
      silent: false
    });
    
    // Manejar clic en la notificación
    notificacion.onclick = function() {
      window.focus();
      // Navegar a la actividad específica
      if (currentProgram !== program) {
        showProgramDetail(program);
      }
      // Resaltar la actividad
      setTimeout(() => {
        const actividadElement = document.querySelector(`[data-idx="${idx}"]`);
        if (actividadElement) {
          actividadElement.closest('.actividad-bloque').style.animation = 'highlightRecordatorio 2s ease-in-out';
        }
      }, 500);
    };
    
    // Auto-cerrar la notificación después de 10 segundos
    setTimeout(() => {
      notificacion.close();
    }, 10000);
  }
  
  // Mostrar alerta en la página también
  const mensaje = `⏰ ¡Recordatorio!\n\nPrograma: ${nombres[program]}\nActividad: ${actividad}\n\n¡Es hora de realizar esta actividad!`;
  
  // Crear modal de recordatorio personalizado
  mostrarModalRecordatorio(mensaje, program, idx, tipoSonido);
  
  // Limpiar el recordatorio
  const key = `recordatorio_${program}_${idx}`;
  const sonidoKey = `recordatorio_sonido_${program}_${idx}`;
  localStorage.removeItem(key);
  localStorage.removeItem(sonidoKey);
  recordatoriosActivos.delete(key);
}

// Función para mostrar modal de recordatorio
function mostrarModalRecordatorio(mensaje, program, idx, tipoSonido = 'default') {
  // Crear modal si no existe
  let modalRecordatorio = document.getElementById('modal-recordatorio');
  if (!modalRecordatorio) {
    modalRecordatorio = document.createElement('div');
    modalRecordatorio.id = 'modal-recordatorio';
    modalRecordatorio.className = 'modal recordatorio-modal';
    modalRecordatorio.innerHTML = `
      <div class="modal-content recordatorio-content">
        <div class="recordatorio-header">
          <span class="recordatorio-icon">⏰</span>
          <h2>¡Recordatorio!</h2>
        </div>
        <div class="recordatorio-body">
          <p id="recordatorio-mensaje"></p>
        </div>
        <div class="recordatorio-buttons">
          <button id="recordatorio-ok" class="btn-recordatorio-ok">Entendido</button>
          <button id="recordatorio-ir" class="btn-recordatorio-ir">Ir a la actividad</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalRecordatorio);
    
    // Event listeners
    document.getElementById('recordatorio-ok').onclick = () => {
      modalRecordatorio.style.display = 'none';
    };
    
    document.getElementById('recordatorio-ir').onclick = () => {
      modalRecordatorio.style.display = 'none';
      if (currentProgram !== program) {
        showProgramDetail(program);
      }
      setTimeout(() => {
        const actividadElement = document.querySelector(`[data-idx="${idx}"]`);
        if (actividadElement) {
          actividadElement.closest('.actividad-bloque').style.animation = 'highlightRecordatorio 2s ease-in-out';
        }
      }, 500);
    };
  }
  
  // Mostrar el mensaje
  document.getElementById('recordatorio-mensaje').textContent = mensaje;
  modalRecordatorio.style.display = 'flex';
  
  // Auto-cerrar después de 30 segundos
  setTimeout(() => {
    if (modalRecordatorio.style.display === 'flex') {
      modalRecordatorio.style.display = 'none';
    }
  }, 30000);
}

// Función para cancelar recordatorio
function cancelarRecordatorio(program, idx) {
  const key = `recordatorio_${program}_${idx}`;
  const sonidoKey = `recordatorio_sonido_${program}_${idx}`;
  
  localStorage.removeItem(key);
  localStorage.removeItem(sonidoKey);
  
  // Cancelar el timeout si existe
  const timeoutId = recordatoriosActivos.get(key);
  if (timeoutId) {
    clearTimeout(timeoutId);
    recordatoriosActivos.delete(key);
  }
}

// Función para revisar recordatorios (mantener para compatibilidad)
function revisarRecordatorios() {
  const ahora = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);
    if (clave && clave.startsWith('recordatorio_') && !clave.includes('sonido')) {
      const fechaHora = parseInt(localStorage.getItem(clave));
      if (!isNaN(fechaHora) && fechaHora <= ahora) {
        // Obtener info de la actividad
        const partes = clave.split('_');
        const program = partes[1];
        const idx = parseInt(partes[2]);
        const acts = getActividades(program);
        
        // Obtener el tipo de sonido guardado
        const sonidoKey = `recordatorio_sonido_${program}_${idx}`;
        const tipoSonido = localStorage.getItem(sonidoKey) || 'default';
        
        if (acts[idx]) {
          mostrarRecordatorio(program, idx, acts[idx].actividad, tipoSonido);
        }
      }
    }
  }
}

// Inicializar sistema de recordatorios
document.addEventListener('DOMContentLoaded', function() {
  crearAudioAlarma();
  solicitarPermisoNotificaciones();
  
  // Revisar recordatorios cada minuto
  setInterval(revisarRecordatorios, 60000);
  
  // Revisar recordatorios al cargar la página
  setTimeout(revisarRecordatorios, 1000);
  
  // Botón de prueba de alarma
  const testAlarmBtn = document.getElementById('test-alarm-btn');
  if (testAlarmBtn) {
    testAlarmBtn.onclick = function() {
      reproducirAlarma();
      mostrarModalRecordatorio('🔔 ¡Prueba de alarma!\n\nEsta es una prueba del sistema de recordatorios.\n\nLa alarma debería haber sonado.', 'test', 0);
    };
  }
});

// --- Estadísticas y seguimiento ---
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStats = document.getElementById('close-stats');

if (statsBtn && statsModal && closeStats) {
  statsBtn.onclick = function() {
    mostrarEstadisticas();
    statsModal.style.display = 'flex';
  };
  closeStats.onclick = function() {
    statsModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === statsModal) {
      statsModal.style.display = 'none';
    }
  };
}

function mostrarEstadisticas() {
  // Datos de actividades por programa
  const programas = Object.keys(nombres);
  const actividadesPorPrograma = programas.map(p => getActividades(p).length);
  // Datos de recordatorios por programa
  const recordatoriosPorPrograma = programas.map(p => {
    let count = 0;
    const acts = getActividades(p);
    acts.forEach((_, idx) => {
      if (localStorage.getItem(`recordatorio_${p}_${idx}`)) count++;
    });
    return count;
  });
  // Datos de notas por programa
  const notasPorPrograma = programas.map(p => {
    const notas = localStorage.getItem('notas_' + p);
    return notas ? notas.length : 0;
  });

  // Gráfico de actividades
  const ctx1 = document.getElementById('chart-actividades').getContext('2d');
  if (window.chartActividades) window.chartActividades.destroy();
  window.chartActividades = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: programas.map(p => nombres[p]),
      datasets: [{
        label: 'Actividades por programa',
        data: actividadesPorPrograma,
        backgroundColor: '#6c63ff'
      }]
    },
    options: { responsive: true }
  });

  // Gráfico de recordatorios
  const ctx2 = document.getElementById('chart-recordatorios').getContext('2d');
  if (window.chartRecordatorios) window.chartRecordatorios.destroy();
  window.chartRecordatorios = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: programas.map(p => nombres[p]),
      datasets: [{
        label: 'Recordatorios activos',
        data: recordatoriosPorPrograma,
        backgroundColor: '#ff9800'
      }]
    },
    options: { responsive: true }
  });

  // Gráfico de notas
  const ctx3 = document.getElementById('chart-notas').getContext('2d');
  if (window.chartNotas) window.chartNotas.destroy();
  window.chartNotas = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: programas.map(p => nombres[p]),
      datasets: [{
        label: 'Cantidad de texto en notas',
        data: notasPorPrograma,
        backgroundColor: '#2196f3'
      }]
    },
    options: { responsive: true }
  });
}

// --- Modo oscuro ---
const darkModeBtn = document.getElementById('darkmode-btn');
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    if (darkModeBtn) darkModeBtn.textContent = 'Modo claro';
    localStorage.setItem('modo_oscuro', '1');
  } else {
    document.body.classList.remove('dark-mode');
    if (darkModeBtn) darkModeBtn.textContent = 'Modo oscuro';
    localStorage.setItem('modo_oscuro', '0');
  }
}
if (darkModeBtn) {
  darkModeBtn.onclick = function() {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  };
}
// Al cargar, aplicar preferencia guardada
if (localStorage.getItem('modo_oscuro') === '1') {
  setDarkMode(true);
}

// --- Exportar a PDF ---
const exportAllPdfBtn = document.getElementById('export-all-pdf');
const exportProgramPdfBtn = document.getElementById('export-program-pdf');

function exportarProgramaAPDF(program) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Programa: ${nombres[program]}`, 10, 15);
  let y = 25;
  // Notas
  const notas = localStorage.getItem('notas_' + program);
  if (notas) {
    doc.setFontSize(12);
    doc.text('Notas:', 10, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(stripHtml(notas), 180), 10, y);
    y += 15;
  }
  // Actividades
  const acts = getActividades(program);
  acts.forEach((act, idx) => {
    doc.setFontSize(12);
    doc.text(`Actividad ${idx + 1}: ${act.actividad}`, 10, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize('Tarea: ' + stripHtml(act.tarea), 180), 12, y);
    y += 7;
    doc.text(doc.splitTextToSize('Acciones: ' + (act.acciones ? stripHtml(act.acciones.join(' ')) : ''), 180), 12, y);
    y += 12;
    if (y > 270) { doc.addPage(); y = 15; }
  });
  doc.save(`programa_${program}.pdf`);
}

function exportarTodoAPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 15;
  Object.keys(nombres).forEach(program => {
    doc.setFontSize(16);
    doc.text(`Programa: ${nombres[program]}`, 10, y);
    y += 8;
    // Notas
    const notas = localStorage.getItem('notas_' + program);
    if (notas) {
      doc.setFontSize(12);
      doc.text('Notas:', 10, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(stripHtml(notas), 180), 10, y);
      y += 15;
    }
    // Actividades
    const acts = getActividades(program);
    acts.forEach((act, idx) => {
      doc.setFontSize(12);
      doc.text(`Actividad ${idx + 1}: ${act.actividad}`, 10, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize('Tarea: ' + stripHtml(act.tarea), 180), 12, y);
      y += 7;
      doc.text(doc.splitTextToSize('Acciones: ' + (act.acciones ? stripHtml(act.acciones.join(' ')) : ''), 180), 12, y);
      y += 12;
      if (y > 270) { doc.addPage(); y = 15; }
    });
    y += 10;
    if (y > 270) { doc.addPage(); y = 15; }
  });
  doc.save('programas_mentales.pdf');
}

function stripHtml(html) {
  var tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

if (exportAllPdfBtn) {
  exportAllPdfBtn.onclick = exportarTodoAPDF;
}
if (exportProgramPdfBtn) {
  exportProgramPdfBtn.onclick = function() {
    if (currentProgram) exportarProgramaAPDF(currentProgram);
  };
}

// --- Buscador global ---
const globalSearch = document.getElementById('global-search');
const searchResultsModal = document.getElementById('search-results-modal');
const closeSearchResults = document.getElementById('close-search-results');
const searchResultsList = document.getElementById('search-results-list');

if (globalSearch) {
  globalSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      realizarBusquedaGlobal(globalSearch.value.trim());
    }
  });
}
if (closeSearchResults && searchResultsModal) {
  closeSearchResults.onclick = function() {
    searchResultsModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === searchResultsModal) {
      searchResultsModal.style.display = 'none';
    }
  };
}

function realizarBusquedaGlobal(query) {
  if (!query) return;
  const resultados = [];
  const programas = Object.keys(nombres);
  programas.forEach(program => {
    // Buscar en notas
    const notas = localStorage.getItem('notas_' + program);
    if (notas && stripHtml(notas).toLowerCase().includes(query.toLowerCase())) {
      resultados.push({
        tipo: 'Nota',
        programa,
        texto: resaltarCoincidencia(stripHtml(notas), query)
      });
    }
    // Buscar en actividades
    const acts = getActividades(program);
    acts.forEach((act, idx) => {
      if (act.actividad && act.actividad.toLowerCase().includes(query.toLowerCase())) {
        resultados.push({
          tipo: 'Actividad',
          programa,
          idx,
          texto: resaltarCoincidencia(act.actividad, query)
        });
      }
      if (act.tarea && stripHtml(act.tarea).toLowerCase().includes(query.toLowerCase())) {
        resultados.push({
          tipo: 'Tarea',
          programa,
          idx,
          texto: resaltarCoincidencia(stripHtml(act.tarea), query)
        });
      }
      if (act.acciones && act.acciones.join(' ').toLowerCase().includes(query.toLowerCase())) {
        resultados.push({
          tipo: 'Acciones',
          programa,
          idx,
          texto: resaltarCoincidencia(stripHtml(act.acciones.join(' ')), query)
        });
      }
    });
  });
  mostrarResultadosBusqueda(resultados, query);
}

function resaltarCoincidencia(texto, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return texto.replace(re, '<span class="highlight-search">$1</span>');
}

function mostrarResultadosBusqueda(resultados, query) {
  if (!searchResultsModal || !searchResultsList) return;
  searchResultsList.innerHTML = '';
  if (resultados.length === 0) {
    searchResultsList.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    resultados.forEach(res => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<strong>${res.tipo}</strong> en <b>${nombres[res.programa]}</b>:<br>${res.texto}`;
      div.style.cursor = 'pointer';
      div.onclick = function() {
        searchResultsModal.style.display = 'none';
        showProgramDetail(res.programa);
        setTimeout(() => {
          resaltarEnDetalle(res.texto.replace(/<[^>]+>/g, ''), query);
        }, 300);
      };
      searchResultsList.appendChild(div);
    });
  }
  searchResultsModal.style.display = 'flex';
}

function resaltarEnDetalle(texto, query) {
  // Resalta coincidencias en el detalle del programa
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  // Notas
  const notesDiv = document.getElementById('program-notes');
  if (notesDiv) {
    notesDiv.innerHTML = notesDiv.innerHTML.replace(/<span class="highlight-search">(.*?)<\/span>/g, '$1');
    notesDiv.innerHTML = notesDiv.innerHTML.replace(re, '<span class="highlight-search">$1</span>');
  }
  // Tareas y acciones
  document.querySelectorAll('.actividad-tarea, .actividad-acciones').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/<span class="highlight-search">(.*?)<\/span>/g, '$1');
    el.innerHTML = el.innerHTML.replace(re, '<span class="highlight-search">$1</span>');
  });
}

// --- Etiquetas en notas y actividades ---
const notesTagsInput = document.getElementById('notes-tags');
const notesTagsList = document.getElementById('notes-tags-list');
const tagFilter = document.getElementById('tag-filter');

function getTagsFromString(str) {
  if (Array.isArray(str)) return str;
  if (typeof str === 'string') {
    return str.split(',').map(t => t.trim()).filter(t => t);
  }
  return [];
}
function renderTagsList(tags, container) {
  container.innerHTML = '';
  tags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = tag;
    container.appendChild(chip);
  });
}
function getAllTags() {
  const tagsSet = new Set();
  // Notas
  Object.keys(nombres).forEach(p => {
    const tags = JSON.parse(localStorage.getItem('tags_notas_' + p) || '[]');
    tags.forEach(t => tagsSet.add(t));
    // Actividades
    getActividades(p).forEach((act, idx) => {
      (act.tags || []).forEach(t => tagsSet.add(t));
    });
  });
  return Array.from(tagsSet);
}
function updateTagFilter() {
  if (!tagFilter) return;
  const tags = getAllTags();
  tagFilter.innerHTML = '<option value="">Filtrar por etiqueta</option>' + tags.map(t => `<option value="${t}">${t}</option>`).join('');
}
if (tagFilter) {
  tagFilter.onchange = function() {
    if (!tagFilter.value) {
      document.querySelector('.programs-grid').style.display = 'grid';
      return;
    }
    // Ocultar todas las tarjetas
    document.querySelectorAll('.program-card').forEach(card => card.style.display = 'none');
    // Mostrar solo las que tengan la etiqueta
    Object.keys(nombres).forEach(p => {
      // Notas
      const tags = JSON.parse(localStorage.getItem('tags_notas_' + p) || '[]');
      if (tags.includes(tagFilter.value)) {
        document.querySelector(`.program-card[data-programa="${p}"]`).style.display = 'flex';
      }
      // Actividades
      getActividades(p).forEach((act, idx) => {
        if ((act.tags || []).includes(tagFilter.value)) {
          document.querySelector(`.program-card[data-programa="${p}"]`).style.display = 'flex';
        }
      });
    });
  };
}
// Guardar y mostrar etiquetas en notas
function saveNotesTags(program) {
  if (!notesTagsInput) return;
  const tags = getTagsFromString(notesTagsInput.value);
  localStorage.setItem('tags_notas_' + program, JSON.stringify(tags));
  renderTagsList(tags, notesTagsList);
  updateTagFilter();
}
if (notesTagsInput) {
  notesTagsInput.addEventListener('input', () => {
    if (currentProgram) saveNotesTags(currentProgram);
  });
}

// --- Historial de notas y actividades ---
const notesHistoryBtn = document.getElementById('notes-history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');

function saveNotesHistory(program, contenido) {
  const key = 'history_notas_' + program;
  let hist = JSON.parse(localStorage.getItem(key) || '[]');
  hist.unshift({ fecha: new Date().toLocaleString(), contenido });
  if (hist.length > 10) hist = hist.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(hist));
}
function showNotesHistory(program) {
  if (!historyModal || !historyList) return;
  const key = 'history_notas_' + program;
  const hist = JSON.parse(localStorage.getItem(key) || '[]');
  historyList.innerHTML = '';
  if (hist.length === 0) {
    historyList.innerHTML = '<p>No hay historial.</p>';
  } else {
    hist.forEach((h, i) => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<b>${h.fecha}</b><br><div style='border:1px solid #ccc; border-radius:0.4em; padding:0.5em; margin:0.5em 0; max-height:80px; overflow:auto;'>${h.contenido}</div><button data-idx='${i}'>Restaurar</button>`;
      div.querySelector('button').onclick = function() {
        if (confirm('¿Restaurar esta versión?')) {
          if (quill) quill.root.innerHTML = h.contenido;
          localStorage.setItem('notas_' + program, h.contenido);
          saveNotesHistory(program, h.contenido);
          showNotesHistory(program);
        }
      };
      historyList.appendChild(div);
    });
  }
  historyModal.style.display = 'flex';
}
if (notesHistoryBtn) {
  notesHistoryBtn.onclick = function() {
    if (currentProgram) showNotesHistory(currentProgram);
  };
}
if (closeHistory && historyModal) {
  closeHistory.onclick = function() { historyModal.style.display = 'none'; };
  window.onclick = function(event) {
    if (event.target === historyModal) historyModal.style.display = 'none';
  };
}
// Guardar historial de notas al editar
if (programNotesDiv) {
  programNotesDiv.addEventListener('input', () => {
    if (currentProgram) {
      saveNotesHistory(currentProgram, programNotesDiv.innerHTML);
    }
  });
}
// Historial de actividades
function saveActividadHistory(program, idx, actividad) {
  const key = `history_actividad_${program}_${idx}`;
  let hist = JSON.parse(localStorage.getItem(key) || '[]');
  hist.unshift({ fecha: new Date().toLocaleString(), actividad });
  if (hist.length > 10) hist = hist.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(hist));
}
function showActividadHistory(program, idx) {
  if (!historyModal || !historyList) return;
  const key = `history_actividad_${program}_${idx}`;
  const hist = JSON.parse(localStorage.getItem(key) || '[]');
  historyList.innerHTML = '';
  if (hist.length === 0) {
    historyList.innerHTML = '<p>No hay historial.</p>';
  } else {
    hist.forEach((h, i) => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<b>${h.fecha}</b><br><div style='border:1px solid #ccc; border-radius:0.4em; padding:0.5em; margin:0.5em 0; max-height:80px; overflow:auto;'>${JSON.stringify(h.actividad, null, 2)}</div><button data-idx='${i}'>Restaurar</button>`;
      div.querySelector('button').onclick = function() {
        if (confirm('¿Restaurar esta versión?')) {
          const acts = getActividades(program);
          acts[idx] = h.actividad;
          setActividades(program, acts);
          saveActividadHistory(program, idx, h.actividad);
          renderActividades(program);
          historyModal.style.display = 'none';
        }
      };
      historyList.appendChild(div);
    });
  }
  historyModal.style.display = 'flex';
}

// --- Compartir programa ---
const shareBtn = document.getElementById('share-program-btn');
const shareModal = document.getElementById('share-modal');
const closeShare = document.getElementById('close-share');
const shareCopy = document.getElementById('share-copy');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareEmail = document.getElementById('share-email');

function getProgramaTexto(program) {
  let texto = `Programa: ${nombres[program]}\n`;
  const notas = localStorage.getItem('notas_' + program);
  if (notas) texto += `Notas:\n${stripHtml(notas)}\n`;
  const tags = JSON.parse(localStorage.getItem('tags_notas_' + program) || '[]');
  if (tags.length) texto += `Etiquetas: ${tags.join(', ')}\n`;
  const acts = getActividades(program);
  
  acts.forEach((act, idx) => {
    // Solo incluir actividades activas
    if (act.activo !== false) {
      texto += `\nActividad ${idx + 1}: ${act.actividad}`;
      
      // Mostrar estado de completado
      if (act.tareaCompletada) {
        const fecha = act.fechaCompletado ? new Date(act.fechaCompletado).toLocaleDateString() : 'Fecha no registrada';
        texto += ` ✅ (Completada el ${fecha})`;
      }
      texto += '\n';
      
      // Solo incluir tarea si está activa
      if (act.tareaActiva !== false) {
        texto += `Tarea: ${stripHtml(act.tarea)}`;
        if (act.tareaCompletada) texto += ' ✅';
        texto += '\n';
      }
      
      // Solo incluir acciones activas
      if (act.acciones && act.acciones.length > 0) {
        const accionesActivas = act.acciones.filter((accion, accionIdx) => {
          return act.accionesActivas && act.accionesActivas[accionIdx] !== false;
        });
        if (accionesActivas.length > 0) {
          texto += `Acciones:`;
          accionesActivas.forEach((accion, accionIdx) => {
            const originalIdx = act.acciones.indexOf(accion);
            const isCompleted = act.accionesCompletadas && act.accionesCompletadas[originalIdx];
            texto += `\n  - ${stripHtml(accion)}${isCompleted ? ' ✅' : ''}`;
          });
          texto += '\n';
        }
      }
      
      if (act.tags && act.tags.length) texto += `Etiquetas: ${act.tags.join(', ')}\n`;
    }
  });
  return texto;
}
if (shareBtn && shareModal && closeShare) {
  shareBtn.onclick = function() {
    shareModal.style.display = 'flex';
  };
  closeShare.onclick = function() {
    shareModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === shareModal) shareModal.style.display = 'none';
  };
}
if (shareCopy) {
  shareCopy.onclick = function() {
    if (currentProgram) {
      const texto = getProgramaTexto(currentProgram);
      navigator.clipboard.writeText(texto);
      alert('¡Copiado al portapapeles!');
    }
  };
}
if (shareWhatsapp) {
  shareWhatsapp.onclick = function() {
    if (currentProgram) {
      const texto = encodeURIComponent(getProgramaTexto(currentProgram));
      window.open(`https://wa.me/?text=${texto}`, '_blank');
    }
  };
}
if (shareEmail) {
  shareEmail.onclick = function() {
    if (currentProgram) {
      const texto = encodeURIComponent(getProgramaTexto(currentProgram));
      window.open(`mailto:?subject=Programa%20Mental&body=${texto}`);
    }
  };
}

// --- Gamificación: puntos y logros ---
const pointsDisplay = document.getElementById('points-display');
const achievementsBtn = document.getElementById('achievements-btn');
const achievementsModal = document.getElementById('achievements-modal');
const closeAchievements = document.getElementById('close-achievements');
const achievementsList = document.getElementById('achievements-list');

const LOGROS = [
  { id: 'primer_actividad', nombre: '¡Primera actividad!', desc: 'Agrega tu primera actividad.', puntos: 10 },
  { id: 'cinco_actividades', nombre: '¡Cinco actividades!', desc: 'Agrega 5 actividades.', puntos: 20 },
  { id: 'primer_nota', nombre: '¡Primera nota!', desc: 'Escribe tu primera nota.', puntos: 10 },
  { id: 'etiquetas', nombre: 'Maestro de etiquetas', desc: 'Usa etiquetas en notas o actividades.', puntos: 10 },
  { id: 'recordatorio', nombre: 'Organizador', desc: 'Programa tu primer recordatorio.', puntos: 10 },
  { id: 'pdf', nombre: 'Exportador', desc: 'Exporta un programa o todo a PDF.', puntos: 10 },
  { id: 'compartir', nombre: 'Comunicador', desc: 'Comparte un programa.', puntos: 10 },
  { id: 'modo_oscuro', nombre: 'Nocturno', desc: 'Activa el modo oscuro.', puntos: 5 }
];
function getPoints() {
  return parseInt(localStorage.getItem('puntos') || '0');
}
function setPoints(p) {
  localStorage.setItem('puntos', p);
  if (pointsDisplay) pointsDisplay.textContent = `🏆 ${p}`;
}
function addPoints(p) {
  setPoints(getPoints() + p);
}
function getAchievements() {
  return JSON.parse(localStorage.getItem('logros') || '[]');
}
function unlockAchievement(id) {
  let logros = getAchievements();
  if (!logros.includes(id)) {
    logros.push(id);
    localStorage.setItem('logros', JSON.stringify(logros));
    const logro = LOGROS.find(l => l.id === id);
    if (logro) addPoints(logro.puntos);
    if (achievementsBtn) achievementsBtn.classList.add('highlight-search');
    setTimeout(() => achievementsBtn && achievementsBtn.classList.remove('highlight-search'), 1500);
  }
}
function updateAchievementsModal() {
  if (!achievementsList) return;
  const logros = getAchievements();
  achievementsList.innerHTML = LOGROS.map(l =>
    `<div style="margin-bottom:0.7em;"><b>${l.nombre}</b> (${l.puntos} pts)<br><span style="font-size:0.95em;">${l.desc}</span><br>${logros.includes(l.id) ? '<span style=\'color:green\'>✔ Desbloqueado</span>' : '<span style=\'color:#aaa\'>❌ Sin desbloquear</span>'}</div>`
  ).join('');
}
if (pointsDisplay) pointsDisplay.textContent = `🏆 ${getPoints()}`;
if (achievementsBtn && achievementsModal && closeAchievements) {
  achievementsBtn.onclick = function() {
    updateAchievementsModal();
    achievementsModal.style.display = 'flex';
  };
  closeAchievements.onclick = function() { achievementsModal.style.display = 'none'; };
  window.onclick = function(event) {
    if (event.target === achievementsModal) achievementsModal.style.display = 'none';
  };
}
// Lógica para sumar puntos y logros en acciones clave
// 1. Agregar actividad
const originalSetActividades = setActividades;
setActividades = function(program, acts) {
  const prev = getActividades(program).length;
  originalSetActividades(program, acts);
  if (acts.length > prev) {
    if (acts.length === 1) unlockAchievement('primer_actividad');
    if (acts.length === 5) unlockAchievement('cinco_actividades');
  }
};
// 2. Escribir nota
if (programNotesDiv) {
  programNotesDiv.addEventListener('input', () => {
    if (currentProgram) {
      if ((quill && quill.getText().trim().length > 0) || programNotesDiv.innerText.trim().length > 0) {
        unlockAchievement('primer_nota');
      }
    }
  });
}
// 3. Usar etiquetas
if (notesTagsInput) {
  notesTagsInput.addEventListener('input', () => {
    if (notesTagsInput.value.trim().length > 0) unlockAchievement('etiquetas');
  });
}
// 4. Programar recordatorio
const originalProgramarRecordatorio = programarRecordatorio;
programarRecordatorio = function(program, idx, actividad, fechaHora, tipoSonido = 'default') {
  unlockAchievement('recordatorio');
  originalProgramarRecordatorio(program, idx, actividad, fechaHora, tipoSonido);
};
// 5. Exportar PDF
if (exportAllPdfBtn) {
  exportAllPdfBtn.addEventListener('click', () => unlockAchievement('pdf'));
}
if (exportProgramPdfBtn) {
  exportProgramPdfBtn.addEventListener('click', () => unlockAchievement('pdf'));
}
// 6. Compartir
if (shareBtn) {
  shareBtn.addEventListener('click', () => unlockAchievement('compartir'));
}
// 7. Modo oscuro
if (darkModeBtn) {
  darkModeBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) unlockAchievement('modo_oscuro');
  });
}

// Evitar que los botones internos de la tarjeta interfieran con el click de la tarjeta
function evitarPropagacionBotones() {
  document.querySelectorAll('.btn-editar, .btn-eliminar, .btn-recordatorio, .btn-historial').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

// Función para obtener estadísticas de completado
function getEstadisticasCompletado(program) {
  const acts = getActividades(program);
  let totalActividades = 0;
  let actividadesCompletadas = 0;
  let totalTareas = 0;
  let tareasCompletadas = 0;
  let totalAcciones = 0;
  let accionesCompletadas = 0;
  
  acts.forEach(act => {
    if (act.activo !== false) {
      totalActividades++;
      if (act.tareaCompletada) {
        actividadesCompletadas++;
      }
      
      if (act.tareaActiva !== false) {
        totalTareas++;
        if (act.tareaCompletada) {
          tareasCompletadas++;
        }
      }
      
      if (act.acciones && act.accionesActivas) {
        act.accionesActivas.forEach((activa, idx) => {
          if (activa) {
            totalAcciones++;
            if (act.accionesCompletadas && act.accionesCompletadas[idx]) {
              accionesCompletadas++;
            }
          }
        });
      }
    }
  });
  
  return {
    totalActividades,
    actividadesCompletadas,
    totalTareas,
    tareasCompletadas,
    totalAcciones,
    accionesCompletadas,
    porcentajeActividades: totalActividades > 0 ? Math.round((actividadesCompletadas / totalActividades) * 100) : 0,
    porcentajeTareas: totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0,
    porcentajeAcciones: totalAcciones > 0 ? Math.round((accionesCompletadas / totalAcciones) * 100) : 0
  };
}

// Función para mostrar estadísticas de completado en el modal
function mostrarEstadisticasCompletado() {
  if (!currentProgram) return;
  
  const stats = getEstadisticasCompletado(currentProgram);
  const statsModal = document.getElementById('stats-modal');
  const modalContent = statsModal.querySelector('.modal-content');
  
  // Crear contenido de estadísticas de completado
  const statsContent = `
    <div class="stats-completado">
      <h3>📊 Progreso de Completado</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">${stats.actividadesCompletadas}/${stats.totalActividades}</div>
          <div class="stat-label">Actividades</div>
          <div class="stat-bar">
            <div class="stat-progress" style="width: ${stats.porcentajeActividades}%"></div>
          </div>
          <div class="stat-percentage">${stats.porcentajeActividades}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.tareasCompletadas}/${stats.totalTareas}</div>
          <div class="stat-label">Tareas</div>
          <div class="stat-bar">
            <div class="stat-progress" style="width: ${stats.porcentajeTareas}%"></div>
          </div>
          <div class="stat-percentage">${stats.porcentajeTareas}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.accionesCompletadas}/${stats.totalAcciones}</div>
          <div class="stat-label">Acciones</div>
          <div class="stat-bar">
            <div class="stat-progress" style="width: ${stats.porcentajeAcciones}%"></div>
          </div>
          <div class="stat-percentage">${stats.porcentajeAcciones}%</div>
        </div>
      </div>
    </div>
  `;
  
  // Agregar el contenido al modal existente
  const existingStats = modalContent.querySelector('.stats-completado');
  if (existingStats) {
    existingStats.remove();
  }
  modalContent.insertAdjacentHTML('beforeend', statsContent);
  
  statsModal.style.display = 'flex';
}

// --- Modal de prueba de sonidos ---
const testSoundsBtn = document.getElementById('test-sounds-btn');
const testSoundsModal = document.getElementById('test-sounds-modal');
const closeTestSounds = document.getElementById('close-test-sounds');

if (testSoundsBtn && testSoundsModal && closeTestSounds) {
  testSoundsBtn.onclick = function() {
    testSoundsModal.style.display = 'flex';
  };
  
  closeTestSounds.onclick = function() {
    testSoundsModal.style.display = 'none';
  };
  
  window.onclick = function(event) {
    if (event.target === testSoundsModal) {
      testSoundsModal.style.display = 'none';
    }
  };
  
  // Event listeners para los botones de prueba de sonidos
  document.querySelectorAll('.sound-test-btn').forEach(btn => {
    btn.onclick = function() {
      const soundType = this.dataset.sound;
      reproducirSonidoSistema(soundType);
      
      // Efecto visual de feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    };
  });
} 