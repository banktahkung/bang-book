let books = [];

// Initialize Reader and Fetch JSON
async function initReader() {
    try {
        const response = await fetch('books.json');
        books = await response.json();
        renderSidebar();
        checkURLParams();
    } catch (error) {
        console.error("Could not load book data:", error);
    }
}

// Render Sidebar Items
function renderSidebar() {
    const sidebarList = document.getElementById('sidebarList');
    if (!sidebarList) return;

    sidebarList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.className = `book-item ${!book.isFree ? 'locked-item' : ''}`;
        li.id = `item-${book.id}`;

        li.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p class="status-text">${book.isFree ? 'Free Access' : 'Premium Content'}</p>
            </div>
            ${book.isFree ? '' : '<span>🔒</span>'}
        `;

        li.onclick = () => loadBook(book.id);
        sidebarList.appendChild(li);
    });
}

// Load Content and Combine Chapters
function loadBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    if (!book.isFree) {
        alert("💎 This book is for Premium Members only.");
        window.location.href = "index.html#pricing";
        return;
    }

    document.getElementById('bookTitleDisplay').innerText = book.title;

    // Build the chapters
    let fullHTML = "";
    book.chapters.forEach(chap => {
        fullHTML += `
            <section class="chapter-box">
                <h2 class="chapter-title">${chap.title}</h2>
                <div class="chapter-content">${chap.text}</div>
            </section>
            <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">
        `;
    });

    document.getElementById('bookContentBody').innerHTML = fullHTML;

    // Highlight sidebar
    document.querySelectorAll('.book-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`item-${id}`)?.classList.add('active');

    // Scroll to top
    document.getElementById('readingPane').scrollTop = 0;
}

// URL Param Check
function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('book');
    if (id) loadBook(id);
}

// Navbar Shrink Logic for Mobile
const readingArea = document.getElementById('readingPane');
const sidebar = document.querySelector('.library-sidebar');

if (readingArea) {
    readingArea.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            if (readingArea.scrollTop > 80) {
                sidebar.classList.add('shrunk');
            } else {
                sidebar.classList.remove('shrunk');
            }
        }
    });
}

// UI Controls
let fontSize = 1.2;
function changeFontSize(delta) {
    fontSize += (delta * 0.1);
    document.getElementById('bookContentBody').style.fontSize = `${fontSize}rem`;
}

document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

document.addEventListener('DOMContentLoaded', initReader);