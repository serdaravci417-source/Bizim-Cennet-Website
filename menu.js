let menuData = null;
let currentLang = 'tr';

// Sayfa yüklendiğinde JSON verisini çek
document.addEventListener("DOMContentLoaded", () => {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            renderMenu();
        })
        .catch(error => console.error("Menü yüklenirken hata oluştu:", error));
});

// Dil değiştirme fonksiyonu
function setLanguage(lang) {
    currentLang = lang;
    
    // Butonların aktiflik durumunu görsel olarak güncelle
    const btnTr = document.getElementById('btn-tr');
    const btnEn = document.getElementById('btn-en');
    
    if (lang === 'tr') {
        btnTr.className = "px-3 py-1 rounded-full bg-[#3d5a45] text-white transition-all";
        btnEn.className = "px-3 py-1 rounded-full bg-transparent text-[#6b6a65] transition-all";
    } else {
        btnEn.className = "px-3 py-1 rounded-full bg-[#3d5a45] text-white transition-all";
        btnTr.className = "px-3 py-1 rounded-full bg-transparent text-[#6b6a65] transition-all";
    }
    
    renderMenu();
}

// Menüyü HTML'e basan ana fonksiyon
function renderMenu() {
    if (!menuData) return;

    const categoryBar = document.getElementById('category-bar');
    const menuContent = document.getElementById('menu-content');
    
    categoryBar.innerHTML = '';
    menuContent.innerHTML = '';

    // 1. Kategorileri Oluştur (Üst Bar)
    menuData.categories.forEach(cat => {
        const catName = cat.name[currentLang];
        categoryBar.innerHTML += `
            <a href="#cat-${cat.id}" class="whitespace-nowrap px-4 py-1.5 rounded-xl bg-[#e5e4e0]/50 text-sm font-medium hover:bg-[#3d5a45]/10 transition-colors">
                ${catName}
            </a>
        `;
    });

    // 2. Ürünleri Kategorilerine Göre Gruplayarak Listele
    menuData.categories.forEach(cat => {
        const catName = cat.name[currentLang];
        const catProducts = menuData.products.filter(p => p.category === cat.id && p.available);

        if (catProducts.length === 0) return; // Kategoride ürün yoksa başlığı gösterme

        let categoryHTML = `
            <section id="cat-${cat.id}" class="scroll-mt-28">
                <h2 class="text-xl font-serif font-bold text-[#3d5a45] border-b border-[#3d5a45]/20 pb-2 mb-4">${catName}</h2>
                <div class="space-y-5">
        `;

        catProducts.forEach(prod => {
            const prodName = prod.name[currentLang];
            const prodDesc = prod.description[currentLang];
            
            categoryHTML += `
                <div class="flex justify-between items-start gap-4 group">
                    <div class="space-y-1">
                        <h3 class="font-medium text-[16px] text-[#2c2c2c] group-hover:text-[#3d5a45] transition-colors">${prodName}</h3>
                        <p class="text-xs text-[#7c7b75] leading-relaxed pr-4">${prodDesc}</p>
                    </div>
                    <div class="font-semibold text-sm text-[#2c2c2c] whitespace-nowrap">
                        ${prod.price} TL
                    </div>
                </div>
            `;
        });

        categoryHTML += `</div></section>`;
        menuContent.innerHTML += categoryHTML;
    });
}
