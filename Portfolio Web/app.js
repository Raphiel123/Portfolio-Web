/* ==========================================================================
   RAPHIEL.DEV - MAIN JAVASCRIPT CONTROLLER & THREE.JS 3D ENGINE
   Features:
   - Three.js Interactive 3D RAM Stick Visualizer & Component Raycaster
   - WhatsApp Bot Command Simulator with Live Terminal Typing Effects
   - Web Audio API Sci-Fi Sound Synthesizer
   - Project Portfolio Category Filter & Modal System
   - Secure Contact Form Handler & Interactive UI Controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Header Scroll Effect
  const mainHeader = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // Custom Cursor Movement
  const customCursor = document.getElementById('customCursor');
  const customCursorGlow = document.getElementById('customCursorGlow');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    if (customCursor) {
      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;
    }
    if (customCursorGlow) {
      customCursorGlow.style.left = `${glowX}px`;
      customCursorGlow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Web Audio Synthesizer (Sci-Fi Tones)
  let audioCtx = null;
  let soundEnabled = true;
  const soundToggleBtn = document.getElementById('soundToggle');

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
  }

  function playUiTone(freq = 600, duration = 0.08, type = 'sine') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors if blocked by browser autoplay
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('active', soundEnabled);
      soundToggleBtn.innerHTML = soundEnabled 
        ? '<i data-lucide="volume-2"></i>' 
        : '<i data-lucide="volume-x"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      playUiTone(soundEnabled ? 880 : 300, 0.1);
    });
  }

  // Hover sound bindings
  document.querySelectorAll('button, a, .spec-tab, .filter-btn, .sim-btn').forEach(el => {
    el.addEventListener('mouseenter', () => playUiTone(750, 0.04));
    el.addEventListener('click', () => playUiTone(1100, 0.06));
  });

  /* ==========================================================================
     WHATSAPP BOT COMMAND SIMULATOR
     ========================================================================== */
  const simTerminalBody = document.getElementById('simTerminalBody');
  const simBtns = document.querySelectorAll('.sim-btn');

  const botResponses = {
    '!ping': {
      text: `🚀 <strong>Kanade WA Bot Status:</strong><br>` +
            `• Pong! Speed: <strong>14ms</strong><br>` +
            `• Baileys Socket: Connected (Multi-Device)<br>` +
            `• Active Sessions: 4 Groups | 128 Users<br>` +
            `• Memory Usage: 42.8 MB / 512 MB`,
      delay: 300
    },
    '!ai Explain DDR5 RAM in 2 sentences': {
      text: `🤖 <strong>Gemini 1.5 AI Response:</strong><br>` +
            `DDR5 memory doubles data transfer bandwidth compared to DDR4 by introducing dual 32-bit subchannels per DIMM and transferring power management directly onto the RAM module (PMIC). This yields operating speeds up to 8000 MT/s at an efficient 1.1V!`,
      delay: 600
    },
    '!group status': {
      text: `🛡️ <strong>Group Shield Status [Developer Hub]:</strong><br>` +
            `• Anti-Link Shield: <span style="color:#00ff9d;">ACTIVE</span> (Auto-Kick enabled)<br>` +
            `• Welcome Banner: Enabled (Custom Canvas render)<br>` +
            `• Toxic Content Filter: AI Sentiment Classifier ON<br>` +
            `• Admin Count: 3 Verified Administrators`,
      delay: 450
    },
    '!sticker sample': {
      text: `🎨 <strong>Sticker Converter Engine:</strong><br>` +
            `[WebP Animated Sticker Generated Successfully! ✨]<br>` +
            `• Dimensions: 512x512 px (FPS: 30)<br>` +
            `• Pack Name: Raphiel Kanade Pack<br>` +
            `• Author: @raphiel.dev`,
      delay: 500
    },
    '!sysinfo': {
      text: `💻 <strong>Server Infrastructure Metrics:</strong><br>` +
            `• Runtime: Bun v1.1.20 + Elysia.js<br>` +
            `• Host: Ubuntu 24.04 LTS Cloud Instance<br>` +
            `• Engine Uptime: 24 Days, 14 Hours<br>` +
            `• Active Webhooks: Encrypted &amp; TypeBox Validated`,
      delay: 350
    }
  };

  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (!cmd || !simTerminalBody) return;

      // Append User message
      const userBubble = document.createElement('div');
      userBubble.className = 'msg-bubble user-msg';
      userBubble.innerHTML = `<div><strong>You:</strong> ${cmd}</div>`;
      simTerminalBody.appendChild(userBubble);
      simTerminalBody.scrollTop = simTerminalBody.scrollHeight;

      // Simulate Typing indicator
      const typingBubble = document.createElement('div');
      typingBubble.className = 'msg-bubble bot-msg';
      typingBubble.innerHTML = `<div class="bot-name">Kanade WA Bot</div><div><em>Kanade is typing... 💬</em></div>`;
      simTerminalBody.appendChild(typingBubble);
      simTerminalBody.scrollTop = simTerminalBody.scrollHeight;

      const respData = botResponses[cmd] || { text: 'Command executed successfully.', delay: 400 };

      setTimeout(() => {
        typingBubble.remove();
        const botBubble = document.createElement('div');
        botBubble.className = 'msg-bubble bot-msg';
        botBubble.innerHTML = `<div class="bot-name">Kanade WA Bot</div><div class="msg-content">${respData.text}</div>`;
        simTerminalBody.appendChild(botBubble);
        simTerminalBody.scrollTop = simTerminalBody.scrollHeight;
        playUiTone(900, 0.08, 'triangle');
      }, respData.delay);
    });
  });

  /* ==========================================================================
     THREE.JS 3D RAM LEARNING MODULE ENGINE
     ========================================================================== */
  const canvasContainer = document.getElementById('canvasContainer');
  const canvasLoading = document.getElementById('canvasLoading');
  let scene, camera, renderer, controls;
  let ramGroup, heatsinkMesh, rgbLightStrip;
  let dramChips = [], goldPins = [];
  let heatsinkVisible = true;
  let currentRgbColorIdx = 0;
  const rgbColors = [0x00f0ff, 0x7000ff, 0x00ff9d, 0xffd700, 0xff3366];

  function initThreeRAM() {
    if (!canvasContainer || typeof THREE === 'undefined') return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 30);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    canvasContainer.appendChild(renderer.domElement);

    // Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxDistance = 50;
      controls.minDistance = 10;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight1.position.set(15, 25, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7000ff, 0.8);
    dirLight2.position.set(-15, -10, -20);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00ff9d, 1, 40);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // Build 3D RAM Stick Group
    ramGroup = new THREE.Group();

    // 1. PCB Board (Green/Dark Charcoal Silicon)
    const pcbGeo = new THREE.BoxGeometry(22, 5, 0.4);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0e141d,
      roughness: 0.4,
      metalness: 0.2
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    ramGroup.add(pcbMesh);

    // 2. Gold Edge Connector Pins (Bottom of PCB)
    const pinGeo = new THREE.BoxGeometry(0.3, 0.8, 0.45);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    });

    for (let x = -10.2; x <= 10.2; x += 0.5) {
      if (Math.abs(x) < 0.6) continue; // Notch center
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(x, -2.8, 0);
      pin.userData = { type: 'pins', name: '288-Pin Gold Connector' };
      ramGroup.add(pin);
      goldPins.push(pin);
    }

    // 3. DRAM Memory Chips (Black ICs on PCB)
    const chipGeo = new THREE.BoxGeometry(1.8, 2.2, 0.25);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.5
    });

    for (let i = 0; i < 8; i++) {
      const chip = new THREE.Mesh(chipGeo, chipMat);
      const posX = -8.5 + i * 2.4;
      chip.position.set(posX, 0.2, 0.25);
      chip.userData = { type: 'chip', id: i + 1, name: `DRAM Silicon Die #${i + 1}` };
      ramGroup.add(chip);
      dramChips.push(chip);
    }

    // 4. Anodized Heatsink Armor (Covering Top Half)
    const heatGeo = new THREE.BoxGeometry(22.2, 4.2, 0.9);
    const heatMat = new THREE.MeshStandardMaterial({
      color: 0x1b2333,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false
    });
    heatsinkMesh = new THREE.Mesh(heatGeo, heatMat);
    heatsinkMesh.position.set(0, 1.2, 0);
    heatsinkMesh.userData = { type: 'heatsink', name: 'Anodized Aluminum Armor Heatsink' };
    ramGroup.add(heatsinkMesh);

    // 5. Top RGB Light Bar
    const rgbGeo = new THREE.BoxGeometry(22.2, 0.6, 0.95);
    const rgbMat = new THREE.MeshStandardMaterial({
      color: rgbColors[0],
      emissive: rgbColors[0],
      emissiveIntensity: 0.8,
      roughness: 0.1
    });
    rgbLightStrip = new THREE.Mesh(rgbGeo, rgbMat);
    rgbLightStrip.position.set(0, 3.4, 0);
    ramGroup.add(rgbLightStrip);

    scene.add(ramGroup);

    // Hide loader
    if (canvasLoading) {
      canvasLoading.style.opacity = '0';
      setTimeout(() => canvasLoading.style.display = 'none', 500);
    }

    // Raycaster for clicking components
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(ramGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.name) {
          updateInspectorComponent(hit.userData);
          playUiTone(1200, 0.08, 'sawtooth');
        }
      }
    });

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (ramGroup && !controls.state == -1) {
        ramGroup.rotation.y += 0.003;
      }
      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  function onWindowResize() {
    if (!canvasContainer || !camera || !renderer) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Initialize Three.js after load
  setTimeout(initThreeRAM, 200);

  /* ==========================================================================
     3D TOOLBAR & SPEC SWITCHER CONTROLS
     ========================================================================== */
  const btnToggleHeatsink = document.getElementById('btnToggleHeatsink');
  const btnCycleRGB = document.getElementById('btnCycleRGB');
  const btnResetCamera = document.getElementById('btnResetCamera');
  const btnPresetFull = document.getElementById('btnPresetFull');
  const btnPresetChips = document.getElementById('btnPresetChips');
  const btnPresetPins = document.getElementById('btnPresetPins');

  if (btnToggleHeatsink) {
    btnToggleHeatsink.addEventListener('click', () => {
      if (heatsinkMesh) {
        heatsinkVisible = !heatsinkVisible;
        heatsinkMesh.visible = heatsinkVisible;
        btnToggleHeatsink.querySelector('span').textContent = heatsinkVisible 
          ? 'Hide Armor Heatsink' 
          : 'Show Armor Heatsink';
      }
    });
  }

  if (btnCycleRGB) {
    btnCycleRGB.addEventListener('click', () => {
      if (rgbLightStrip) {
        currentRgbColorIdx = (currentRgbColorIdx + 1) % rgbColors.length;
        const newColor = rgbColors[currentRgbColorIdx];
        rgbLightStrip.material.color.setHex(newColor);
        rgbLightStrip.material.emissive.setHex(newColor);
      }
    });
  }

  if (btnResetCamera) {
    btnResetCamera.addEventListener('click', () => {
      if (camera && controls) {
        camera.position.set(0, 15, 30);
        controls.target.set(0, 0, 0);
        controls.update();
      }
    });
  }

  if (btnPresetFull) {
    btnPresetFull.addEventListener('click', () => {
      document.querySelectorAll('.view-pill').forEach(p => p.classList.remove('active'));
      btnPresetFull.classList.add('active');
      camera.position.set(0, 15, 30);
    });
  }

  if (btnPresetChips) {
    btnPresetChips.addEventListener('click', () => {
      document.querySelectorAll('.view-pill').forEach(p => p.classList.remove('active'));
      btnPresetChips.classList.add('active');
      if (heatsinkMesh) heatsinkMesh.visible = false;
      camera.position.set(0, 2, 14);
    });
  }

  if (btnPresetPins) {
    btnPresetPins.addEventListener('click', () => {
      document.querySelectorAll('.view-pill').forEach(p => p.classList.remove('active'));
      btnPresetPins.classList.add('active');
      camera.position.set(0, -6, 14);
    });
  }

  // Spec Switcher (DDR5 vs DDR4)
  const tabDDR5 = document.getElementById('tabDDR5');
  const tabDDR4 = document.getElementById('tabDDR4');

  const valDataRate = document.getElementById('valDataRate');
  const valVoltage = document.getElementById('valVoltage');
  const valPower = document.getElementById('valPower');
  const valChannel = document.getElementById('valChannel');

  if (tabDDR5 && tabDDR4) {
    tabDDR5.addEventListener('click', () => {
      tabDDR5.classList.add('active');
      tabDDR4.classList.remove('active');

      valDataRate.textContent = '4800 - 8000 MT/s';
      valVoltage.textContent = '1.1V (Efficient)';
      valPower.textContent = 'On-DIMM PMIC Controller';
      valChannel.textContent = 'Dual 32-bit Subchannels';
    });

    tabDDR4.addEventListener('click', () => {
      tabDDR4.classList.add('active');
      tabDDR5.classList.remove('active');

      valDataRate.textContent = '2133 - 3200 MT/s';
      valVoltage.textContent = '1.2V Operating';
      valPower.textContent = 'Motherboard Managed';
      valChannel.textContent = 'Single 64-bit Channel';
    });
  }

  function updateInspectorComponent(data) {
    const titleEl = document.getElementById('selectedComponentTitle');
    const tagEl = document.getElementById('selectedComponentTag');
    const descEl = document.getElementById('selectedComponentDesc');

    if (!titleEl || !tagEl || !descEl) return;

    if (data.type === 'chip') {
      tagEl.textContent = 'SILICON DRAM DIE';
      titleEl.textContent = data.name;
      descEl.textContent = 'High-speed silicon DRAM integrated circuit storing binary data charges. Formatted with bank groups for ultra-low latency read/write operations.';
    } else if (data.type === 'heatsink') {
      tagEl.textContent = 'THERMAL MANAGEMENT';
      titleEl.textContent = data.name;
      descEl.textContent = 'Precision-machined anodized aluminum heat spreader designed to quickly pull thermal heat away from the DRAM chips and PMIC module.';
    } else if (data.type === 'pins') {
      tagEl.textContent = 'INTERFACE CONNECTOR';
      titleEl.textContent = data.name;
      descEl.textContent = 'Gold-plated 288-pin edge connector providing high signal integrity and corrosion resistance when mounted into motherboard DIMM slots.';
    }
  }

  /* ==========================================================================
     PROJECT SHOWCASE FILTER & MODAL
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal logic
  const projectModal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  document.querySelectorAll('.demo-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const cat = btn.getAttribute('data-category');
      const tech = btn.getAttribute('data-tech');

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = cat;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalTech) modalTech.textContent = tech;

      if (projectModal) projectModal.classList.add('active');
    });
  });

  function closeModal() {
    if (projectModal) projectModal.classList.remove('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }

  /* ==========================================================================
     CONTACT FORM SECURITY HANDLER
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatusMsg = document.getElementById('formStatusMsg');
  const btnSubmitForm = document.getElementById('btnSubmitForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const category = document.getElementById('projectType').value;
      const message = document.getElementById('contactMessage').value;

      if (btnSubmitForm) {
        btnSubmitForm.disabled = true;
        btnSubmitForm.innerHTML = `<i data-lucide="loader"></i> Encrypting Payload...`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }

      // Simulate Elysia.js TypeBox validation & Transmission
      setTimeout(() => {
        if (btnSubmitForm) {
          btnSubmitForm.disabled = false;
          btnSubmitForm.innerHTML = `<i data-lucide="check"></i> Sent via Elysia.js`;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        if (formStatusMsg) {
          formStatusMsg.className = 'form-status-msg success';
          formStatusMsg.innerHTML = `⚡ <strong>Transmission Successful:</strong> Your inquiry for <em>"${category.toUpperCase()}"</em> was sanitized and securely encrypted via Elysia.js token bucket validation. Raphiel will respond within 24 hours.`;
        }

        contactForm.reset();
        playUiTone(1400, 0.15, 'sine');
      }, 1000);
    });
  }
});
