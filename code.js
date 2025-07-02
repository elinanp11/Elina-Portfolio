async function injectHeader() {
    try {
      if (document.querySelector('.main-header')) return; // ya existe
      const res = await fetch('header.html');
      if (!res.ok) throw new Error('Respuesta inválida');
      const html = await res.text();
      document.body.insertAdjacentHTML('afterbegin', html);
      // Marcar enlace activo
      document.querySelectorAll('.main-nav a').forEach(link => {
        if (location.pathname.endsWith(link.getAttribute('href'))) link.classList.add('active');
      });
    } catch (err) {
      console.error('Error al cargar header:', err);
    }
  }
  // ------------------ FIN HEADER DINÁMICO --------------
  
  // Animación de arte en el hero (puedes personalizar más)
  async function initPage() {
    await injectHeader();
    // Animación de scroll suave para los enlaces del menú
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    // Folder creativo: archivos ficticios
    if (document.getElementById('folder-gallery')) {
      loadCreativeFiles();
    }
  
    // Modo claro/oscuro
    const modeBtn = document.getElementById('mode-toggle');
    if (modeBtn) {
      modeBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      };
      // Mantener preferencia
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
      }
    }
  
    // Foto de perfil
    const profilePic = document.getElementById('profile-pic');
    const profileBtn = document.getElementById('profile-pic-btn');
    if (profilePic) profilePic.onclick = openPhotoModal;
    if (profileBtn) profileBtn.onclick = openPhotoModal;
    const saved = localStorage.getItem('profilePic');
    if (saved && profilePic) profilePic.src = saved;
  
    // Mini juego tipo Pou
    if (document.getElementById('pou-game')) {
      let hunger = 50, fun = 50;
      const hungerBar = document.getElementById('pou-hunger');
      const funBar = document.getElementById('pou-fun');
      function updatePou() {
        hungerBar.value = hunger;
        funBar.value = fun;
      }
      document.getElementById('feed-btn').onclick = () => {
        hunger = Math.min(100, hunger + 10);
        updatePou();
      };
      document.getElementById('play-btn').onclick = () => {
        fun = Math.min(100, fun + 10);
        updatePou();
      };
      setInterval(() => {
        hunger = Math.max(0, hunger - 1);
        fun = Math.max(0, fun - 1);
        updatePou();
      }, 1500);
      updatePou();
    }
  }
  // Ejecutar después de cargar HTML
  document.addEventListener('DOMContentLoaded', initPage);
  
  // ------------------  CAMBIO DE FOTO - MODAL ------------------
  function openPhotoModal() {
    // Evitar múltiples modales
    if (document.querySelector('.photo-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
      <div class="photo-modal-content">
        <img src="https://placekitten.com/120/120" class="cat-decoration-img" alt="gatito">
        <h3>Cambiar foto</h3>
        <button id="take-photo-btn">Tomar foto</button>
        <button id="choose-photo-btn">Seleccionar de galería</button>
        <button id="close-modal-btn">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);
  
    document.getElementById('close-modal-btn').onclick = () => closePhotoModal();
    document.getElementById('choose-photo-btn').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          setProfilePic(ev.target.result);
          closePhotoModal();
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };
    document.getElementById('take-photo-btn').onclick = showCameraView;
  }
  function closePhotoModal() {
    stopCamera();
    const modal = document.querySelector('.photo-modal');
    if (modal) modal.remove();
  }
  let stream;
  function showCameraView() {
    const container = document.querySelector('.photo-modal-content');
    if (!container) return;
    container.innerHTML = `
      <h3>Sonríe 😺</h3>
      <video id="camera-stream" autoplay playsinline></video>
      <button id="whisky-btn">Whisky! 📸</button>
      <button id="close-modal-btn">Cerrar</button>
    `;
    document.getElementById('close-modal-btn').onclick = () => closePhotoModal();
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        stream = s;
        const video = document.getElementById('camera-stream');
        video.srcObject = stream;
        document.getElementById('whisky-btn').onclick = () => takeSnapshot(video);
      })
      .catch(err => {
        alert('No se pudo acceder a la cámara');
        console.error(err);
      });
  }
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }
  function takeSnapshot(videoEl) {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setProfilePic(dataUrl);
    closePhotoModal();
  }
  function setProfilePic(src) {
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
      profilePic.src = src;
      localStorage.setItem('profilePic', src);
    }
  }
  
  // ------------------  FIN CAMBIO FOTO ------------------
  
  // Archivos creativos (simulados)
  let creativeFiles = [
    { name: 'Diseño_Portada.png', type: 'imagen' },
    { name: 'CV_ElinaPerez.pdf', type: 'pdf' },
    { name: 'Proyecto_Animado.html', type: 'html' }
  ];
  
  function loadCreativeFiles() {
    const gallery = document.getElementById('folder-gallery');
    gallery.innerHTML = '';
    creativeFiles.forEach(file => {
      const div = document.createElement('div');
      div.className = 'folder-file';
      div.innerHTML = `<span>${file.name}</span><br><small>${file.type}</small>`;
      div.onclick = () => alert('¡Este es un archivo creativo de ejemplo!');
      gallery.appendChild(div);
    });
  }
  
  function addCreativeFile() {
    const name = prompt('¿Nombre del nuevo archivo creativo?');
    if (name) {
      creativeFiles.push({ name, type: 'otro' });
      loadCreativeFiles();
    }
  }
  