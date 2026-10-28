// Helpers
const $ = (q, p = document) => p.querySelector(q);
const $$ = (q, p = document) => [...p.querySelectorAll(q)];

/* ---------------------------
  Mobile Drawer
--------------------------- */
const drawer = $(".drawer");
const overlay = $(".overlay");
const navToggle = $(".nav-toggle");
const drawerClose = $(".drawer-close");

function openDrawer(){
  drawer.classList.add("open");
  overlay.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
}
function closeDrawer(){
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}
navToggle?.addEventListener("click", openDrawer);
drawerClose?.addEventListener("click", closeDrawer);
overlay?.addEventListener("click", closeDrawer);

$$(".drawer-link").forEach(a => a.addEventListener("click", closeDrawer));

/* ---------------------------
  Theme Toggle (persist)
--------------------------- */
const root = document.documentElement;
const themeToggle1 = $(".theme-toggle");
const themeToggle2 = $(".theme-toggle-2");

function setTheme(theme){
  if(theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  localStorage.setItem("theme", theme);
}
const savedTheme = localStorage.getItem("theme");
if(savedTheme) setTheme(savedTheme);

function toggleTheme(){
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
}
themeToggle1?.addEventListener("click", toggleTheme);
themeToggle2?.addEventListener("click", () => { toggleTheme(); closeDrawer(); });

/* ---------------------------
  Active Nav Link on Scroll
--------------------------- */
const sections = $$("section[id]");
const navLinks = $$(".nav-link");

function setActiveLink(){
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");
    if(scrollY >= top && scrollY < top + height){
      navLinks.forEach(a => a.classList.remove("active"));
      $(`.nav-link[href="#${id}"]`)?.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActiveLink);
setActiveLink();

/* ---------------------------
  Reveal on Scroll (stagger)
--------------------------- */
function applyReveal(){
  // Add reveal class to important elements automatically
  const targets = [
    ".badge", ".title", ".subtitle", ".cta", ".stats",
    "#about .card", "#skills .card", ".project", "#contact .card",
    ".section-head"
  ];
  targets.forEach(sel => $$(sel).forEach(el => el.classList.add("reveal")));

  // Stagger inside grids
  const groups = [
    ".stats .stat",
    ".skills-grid .card",
    ".projects-grid .project",
    "#about .grid-2 .card",
    "#contact .grid-2 .card",
    ".contact-cards .contact-item"
  ];
  groups.forEach(sel => {
    $$(sel).forEach((el, i) => el.setAttribute("data-delay", String((i % 5) + 1)));
  });

  // Float hero profile card a little
  $(".profile")?.classList.add("floaty");
}
applyReveal();

const revealEls = $$(".reveal");
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealIO.observe(el));

/* ---------------------------
  Skill Bars Animate on View
--------------------------- */
const bars = $$(".bar span");
const skillsSection = $("#skills");

const skillIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      bars.forEach(b => {
        const fill = b.getAttribute("data-fill");
        b.style.width = fill + "%";
      });
      skillIO.disconnect();
    }
  });
}, { threshold: 0.25 });

if(skillsSection) skillIO.observe(skillsSection);

/* ---------------------------
  Project Filters
--------------------------- */
const pills = $$(".pill");
const projects = $$(".project");

pills.forEach(pill => {
  pill.addEventListener("click", () => {
    pills.forEach(x => x.classList.remove("active"));
    pill.classList.add("active");

    const f = pill.dataset.filter;
    projects.forEach(card => {
      const types = card.dataset.type || "";
      const show = f === "all" || types.includes(f);
      card.style.display = show ? "block" : "none";
    });
  });
});

/* ---------------------------
  Contact Form Validation (demo)
--------------------------- */
const form = $("#contactForm");
function setError(input, msg){
  const field = input.closest(".field");
  const small = field?.querySelector(".error");
  if(small) small.textContent = msg || "";
}
function isEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name");
  const email = $("#email");
  const message = $("#message");
  let ok = true;

  if(!name.value.trim()){ setError(name, "Please enter your name"); ok = false; }
  else setError(name, "");

  if(!email.value.trim()){ setError(email, "Please enter your email"); ok = false; }
  else if(!isEmail(email.value.trim())){ setError(email, "Please enter a valid email"); ok = false; }
  else setError(email, "");

  if(!message.value.trim()){ setError(message, "Please write a message"); ok = false; }
  else setError(message, "");

  if(ok){
    alert("✅ Message sent . srikantpadhi1947@gmail.com!");
    form.reset();
  }
});

/* ---------------------------
  Scroll to Top Button
--------------------------- */
const toTop = $(".to-top");
window.addEventListener("scroll", () => {
  if(window.scrollY > 500) toTop.classList.add("show");
  else toTop.classList.remove("show");
});
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------------------------
  Footer Year
--------------------------- */
$("#year").textContent = new Date().getFullYear();

/* ---------------------------
  Resume Button (Demo)
--------------------------- */
$("#downloadResume")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Add resume.pdf in same folder and set href='resume.pdf'");
});

/* ---------------------------
  OPTIONAL: Typing effect (edit texts below)
  To enable, add this in HTML:
  Replace:  <span class="muted">Frontend / Full-Stack Learner</span>
  With:     <span class="muted" id="typing"></span><span class="typing-cursor">|</span>
--------------------------- */
const typingEl = $("#typing");
if(typingEl){
  const words = ["Frontend Developer", "UI Designer", "JavaScript Developer", "Full-Stack Learner"];
  let w = 0, i = 0, deleting = false;

  function type(){
    const word = words[w];
    typingEl.textContent = deleting ? word.slice(0, i--) : word.slice(0, i++);

    if(!deleting && i > word.length){
      deleting = true;
      setTimeout(type, 900);
      return;
    }
    if(deleting && i < 0){
      deleting = false;
      w = (w + 1) % words.length;
      i = 0;
    }
    const speed = deleting ? 45 : 70;
    setTimeout(type, speed);
  }
  type();
}
