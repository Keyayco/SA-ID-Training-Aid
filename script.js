// ==========================
// TOP TABS
// ==========================
const topTabs = document.querySelectorAll(".top-tab");

topTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        topTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        document.querySelectorAll(".top-section").forEach(s => {
            s.classList.remove("active");
        });

        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add("active");
    });
});


// ==========================
// SUB TABS
// ==========================
const subTabs = document.querySelectorAll(".sub-tab");

subTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const parent = tab.closest(".top-section");

        parent.querySelectorAll(".sub-tab").forEach(t => {
            t.classList.remove("active");
        });

        tab.classList.add("active");

        parent.querySelectorAll(".sub-section").forEach(s => {
            s.classList.remove("active");
        });

        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add("active");
    });
});


// ==========================
// CARD NAVIGATION
// ==========================
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        const target = card.getAttribute("data-target");

        document.querySelectorAll(".top-section").forEach(sec => {
            sec.classList.remove("active");
        });

        document.getElementById(target).classList.add("active");

        document.querySelectorAll(".top-tab").forEach(tab => {
            tab.classList.remove("active");
        });

        const activeTab = document.querySelector(`.top-tab[data-tab="${target}"]`);
        if (activeTab) activeTab.classList.add("active");
    });
});


// ==========================
// ZOOM + PAN SYSTEM
// ==========================
const overlay = document.getElementById("zoom-overlay");
const zoomedImg = document.getElementById("zoomed-img");

let scale = 1;
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;


// ==========================
// OPEN IMAGE (EXCLUDE OVERLAY IMG)
// ==========================
document.querySelectorAll("img").forEach(img => {
    if (img.id === "zoomed-img") return;

    img.addEventListener("click", () => {
        zoomedImg.src = img.src;
        overlay.classList.add("active");

        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });
});


// ==========================
// CLOSE OVERLAY
// ==========================
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");
    }
});


// ==========================
// ZOOM (DESKTOP SCROLL)
// ==========================
overlay.addEventListener("wheel", (e) => {
    e.preventDefault();

    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(1, scale), 4);

    updateTransform();
});


// ==========================
// DRAG (WORKS FOR BOTH MOUSE + TOUCH)
// ==========================

// START
function startDrag(x, y) {
    isDragging = true;
    overlay.classList.add("dragging");

    startX = x - translateX;
    startY = y - translateY;
}

// MOVE
function drag(x, y) {
    if (!isDragging) return;

    translateX = x - startX;
    translateY = y - startY;

    updateTransform();
}

// END
function endDrag() {
    isDragging = false;
    overlay.classList.remove("dragging");
}


// ==========================
// MOUSE EVENTS
// ==========================
zoomedImg.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
});

document.addEventListener("mousemove", (e) => {
    drag(e.clientX, e.clientY);
});

document.addEventListener("mouseup", endDrag);


// ==========================
// TOUCH EVENTS (MOBILE)
// ==========================
zoomedImg.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
});

zoomedImg.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    drag(touch.clientX, touch.clientY);
});

zoomedImg.addEventListener("touchend", endDrag);


// ==========================
// APPLY TRANSFORM
// ==========================
function updateTransform() {
    zoomedImg.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
