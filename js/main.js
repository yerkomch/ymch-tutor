document.addEventListener('DOMContentLoaded', () => {
    initConfig();
    initNavigation();
    initScrollAnimations();
    
    const categoryPage = document.getElementById('category-materials-grid');
    if (categoryPage) {
        const currentCategory = categoryPage.getAttribute('data-category');
        renderCategoryMaterials(currentCategory);
    }
});

function initConfig() {
    document.querySelectorAll('.dynamic-name').forEach(el => el.textContent = CONFIG.nombre);
    document.querySelectorAll('.dynamic-title').forEach(el => el.textContent = CONFIG.titulo);
    document.querySelectorAll('.dynamic-subtitle').forEach(el => el.textContent = CONFIG.subtitulo);
    updateWhatsAppLinks();
}

function updateWhatsAppLinks() {
    document.querySelectorAll('[data-wa-context]').forEach(btn => {
        const context = btn.getAttribute('data-wa-context');
        const materialName = btn.getAttribute('data-material') || '';
        
        let message = "";
        if (context === 'adquirir') {
            message = `Hola ${CONFIG.nombreContacto}, estoy interesado en adquirir físicamente el texto de "${materialName}" sin marca de agua.`;
        } else if (context === 'servicio-general') {
            message = `Hola ${CONFIG.nombreContacto}, estoy interesado en solicitar un servicio de diseño/tecnología.`;
        } else if (context === 'consulta') {
            message = `Hola ${CONFIG.nombreContacto}, quisiera realizar una consulta.`;
        }

        const encodedMessage = encodeURIComponent(message);
        btn.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodedMessage}`;
        btn.target = "_blank";
    });
}

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
}

function accederCategoria(categoria, passwordCorrecta, urlDestino) {
    let input = prompt(`🔒 Ingrese la contraseña para acceder a los materiales de ${categoria}:`);
    
    if (input === passwordCorrecta) {
        window.location.href = urlDestino;
    } else if (input !== null) {
        alert("❌ Contraseña incorrecta. Por favor, intente nuevamente.");
    }
}

function renderCategoryMaterials(categoria) {
    const grid = document.getElementById('category-materials-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const filtered = materiales.filter(m => m.categoria === categoria);

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--text-secondary); grid-column: 1/-1;">No hay materiales disponibles aún en esta categoría.</p>';
        return;
    }

    filtered.forEach(material => {
        const card = document.createElement('div');
        card.className = 'material-card fade-in';
        card.innerHTML = `
            <img src="${material.portada}" alt="${material.titulo}" class="card-image" onerror="this.src='https://via.placeholder.com/400x200/171717/6366F1?text=YMCH'">
            <div class="card-content">
                <span class="card-category">${material.programa}</span>
                <h3 class="card-title">${material.titulo}</h3>
                <p class="card-desc">${material.descripcion}</p>
                <div class="card-actions">
                    <a href="${material.pdf}" target="_blank" class="btn btn-primary">Ver material</a>
                    <a href="${material.pdf}" target="_blank" class="btn btn-secondary">Descargar PDF</a>
                    <a href="#" class="btn btn-whatsapp" data-wa-context="adquirir" data-material="${material.titulo}">Adquirir texto sin marca de agua</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    updateWhatsAppLinks();
    initScrollAnimations();
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}