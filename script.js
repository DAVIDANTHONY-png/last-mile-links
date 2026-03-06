const slides = document.querySelectorAll('.hero-slide');
let current = 0;

const heroHeadings = [
    'WELCOME TO LAST MILE LINKS',
    'CONNECTING COMMUNITIES',
    'DELIVERING LAST MILE SOLUTIONS',
    'EMPOWERING LOCAL BUSINESSES',
    'BRIDGING DIGITAL DIVIDES'
];

const heroParagraphs = [
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium iure maiores sapiente possimus, deleniti similique obcaecati recusandae, atque libero autem sit!',
    'We connect people to services and opportunities at the last mile.',
    'Fast, reliable delivery and local solutions for your community.',
    'Supporting small businesses with logistics and digital tools.',
    'Building bridges to a more connected and inclusive future.'
];



const heroH1 = document.querySelector('.hero-content h1');
const heroP = document.querySelector('.hero-content p');

const FADE_MS = 350; // must match .fade-out duration
const ROLL_MS = 900; // must match .slide-in duration

function animateTextSwap(el, newText){
    return new Promise(resolve => {
        if(!el){ resolve(); return; }
        // remove any existing animation classes
        el.classList.remove('slide-in');
        el.classList.remove('fade-out');

        // start fade-out
        el.classList.add('fade-out');

        setTimeout(() => {
            // after fade completes, replace text
            el.classList.remove('fade-out');
            el.textContent = newText;
            // force reflow then play roll-in
            void el.offsetWidth;
            el.classList.add('slide-in');

            // resolve after roll-in completes
            setTimeout(() => resolve(), ROLL_MS);
        }, FADE_MS);
    });
}

function updateHero(index){
    const i = index % heroHeadings.length;
    const tasks = [];
    if(heroH1) tasks.push(animateTextSwap(heroH1, heroHeadings[i]));
    if(heroP) tasks.push(animateTextSwap(heroP, heroParagraphs[i] || ''));
    return Promise.all(tasks);
}

// set initial content without animation
if(heroH1) heroH1.textContent = heroHeadings[0];
if(heroP) heroP.textContent = heroParagraphs[0];

setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    updateHero(current);
}, 3000); // every 3 seconds

// ---------------------// Page Load Fade-In Animation
// ---------------------
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease-in';
        document.body.style.opacity = '1';
    }, 50);
});

// ---------------------
// Scroll Reveal Animation
// ---------------------
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to elements on scroll
document.querySelectorAll('.service-card, .what-we-do').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add fadeInUp keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ---------------------// Dropdown: click-to-toggle behavior with mega menu
// ---------------------
document.addEventListener('click', function(e){
    // Main dropdown toggle (Services)
    const mainToggle = e.target.closest('.top-bar > ul > li.dropdown > a');
    if(mainToggle){
        e.preventDefault();
        const li = mainToggle.parentElement;
        li.classList.toggle('open');
        setDropdownState(li, li.classList.contains('open'));
        return;
    }

    // Nested item toggle inside mega menu (ICT, Consultant, etc.)
    const nestedToggle = e.target.closest('.top-bar .dropdown > .dropdown-menu .dropdown-sub > a');
    if(nestedToggle){
        e.preventDefault();
        const li = nestedToggle.parentElement;
        li.classList.toggle('open');
        setDropdownState(li, li.classList.contains('open'));
        return;
    }

    // If a final link was clicked, close all dropdowns
    const finalLink = e.target.closest('.top-bar .dropdown-menu a:not(.dropdown-sub > a)');
    if(finalLink && !finalLink.closest('.dropdown-sub > a')){
        document.querySelectorAll('.top-bar .dropdown.open, .top-bar .dropdown-sub.open').forEach(el => {
            el.classList.remove('open');
            setDropdownState(el, false);
        });
        return;
    }

    // Click outside any dropdown -> close all
    if(!e.target.closest('.top-bar .dropdown')){
        document.querySelectorAll('.top-bar .dropdown.open, .top-bar .dropdown-sub.open').forEach(el => {
            el.classList.remove('open');
            setDropdownState(el, false);
        });
    }
});

// helper to close all dropdowns
function closeAllDropdowns(){
    document.querySelectorAll('.top-bar .dropdown.open, .top-bar .dropdown-sub.open').forEach(el => el.classList.remove('open'));
}

// keyboard accessibility: Enter/Space to toggle, Escape to close, arrows to navigate
document.addEventListener('keydown', function(e){
    const active = document.activeElement;
    if(e.key === 'Escape'){
        closeAllDropdowns();
        return;
    }

    const toggleSelector = '.top-bar .dropdown > a, .top-bar .dropdown-sub > a';
    const isToggle = active && (active.matches ? active.matches(toggleSelector) : !!active.closest && !!active.closest(toggleSelector));
    if(isToggle){
        if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            active.click(); // reuse click handler
            return;
        }
        if(e.key === 'ArrowRight'){
            // open submenu and focus first item
            const li = active.parentElement;
            const submenu = li && li.querySelector('.dropdown-menu');
            if(submenu){
                li.classList.add('open');
                const first = submenu.querySelector('a');
                if(first) first.focus();
                e.preventDefault();
            }
        }
    }

    // if focus is inside a dropdown menu, allow ArrowLeft to move back to parent
    if(active && active.closest && active.closest('.dropdown-menu')){
        if(e.key === 'ArrowLeft'){
            const parentLi = active.closest('.dropdown-sub');
            if(parentLi){
                parentLi.classList.remove('open');
                const parentToggle = parentLi.querySelector('a');
                if(parentToggle) parentToggle.focus();
                e.preventDefault();
            }
        }
    }
});

/* ================= SCROLL REVEAL ================= */
const section = document.querySelector('.what-we-do');

function revealSection(){
    const trigger = window.innerHeight * 0.85;
    const sectionTop = section.getBoundingClientRect().top;

    if(sectionTop < trigger){
        section.classList.add('visible');
    }
}

window.addEventListener('scroll', revealSection);
revealSection();

/* ================= MODAL ================= */
const modal = document.getElementById('wwdModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeModal = document.querySelector('.modal-close');

document.querySelectorAll('.wwd-content a').forEach(link => {
    link.addEventListener('click', function(e){
        e.preventDefault();
        const card = this.closest('.wwd-card');
        const title = card.querySelector('h3').textContent;
        const text = card.querySelector('p').textContent;

        modalTitle.textContent = title;
        modalText.textContent = text + " We are committed to delivering impact and sustainable development through innovation and technology-driven solutions.";

        modal.classList.add('active');
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', e => {
    if(e.target === modal){
        modal.classList.remove('active');
    }
});

/* ================= SCROLL TO TOP ================= */
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if(window.scrollY > 300){
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
});

/* ================= COUNTER ANIMATION ================= */
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = 20;

            const update = () => {
                const increment = target / 100;
                if(count < target){
                    count += increment;
                    counter.textContent = Math.ceil(count);
                    setTimeout(update, speed);
                } else {
                    counter.textContent = target;
                }
            };
            update();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

/* ================= PROJECT FILTER ================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectGrid = document.querySelector('.project-grid');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Fade out current grid
        projectGrid.classList.add('fade-out');

        // Wait for fade-out + delay, then update and fade in
        setTimeout(() => {
            projectCards.forEach(card => {
                const shouldShow = filter === 'all' || card.getAttribute('data-category') === filter;
                if(shouldShow){
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });

            // Fade in
            projectGrid.classList.remove('fade-out');
        }, 300); // 0.3 second delay
    });

    /* ================= MICROINTERACTIONS BEHAVIOR ================= */
    (function(){
        // Ripple helper
        function createRipple(el, clientX, clientY){
            if(!el) return;
            el.style.position = el.style.position || getComputedStyle(el).position === 'static' ? 'relative' : el.style.position;
            const rect = el.getBoundingClientRect();
            const circle = document.createElement('span');
            circle.className = 'ripple';
            const size = Math.max(rect.width, rect.height) * 1.2;
            circle.style.width = circle.style.height = size + 'px';
            circle.style.left = (clientX - rect.left - size/2) + 'px';
            circle.style.top = (clientY - rect.top - size/2) + 'px';
            el.appendChild(circle);
            setTimeout(() => circle.remove(), 650);
        }

        // Delegate ripple to interactive elements
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-primary, .login-btn, .filter-btn, .wwd-content a, .project-card, .social-icon');
            if(btn){
                createRipple(btn, e.clientX, e.clientY);
            }
        });

        // Toast system
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);

        function showToast(msg, duration = 2200){
            const t = document.createElement('div');
            t.className = 'toast';
            t.textContent = msg;
            toastContainer.appendChild(t);
            // animate in
            requestAnimationFrame(() => t.classList.add('visible'));
            setTimeout(() => {
                t.classList.remove('visible');
                setTimeout(() => t.remove(), 300);
            }, duration);
        }

        // Copy-to-clipboard for email in footer, then open mailto
        const mailLink = document.querySelector('footer .contact-item a[href^="mailto:"]');
        if(mailLink){
            mailLink.addEventListener('click', function(e){
                e.preventDefault();
                const mail = this.getAttribute('href').replace('mailto:', '');
                if(navigator.clipboard && navigator.clipboard.writeText){
                    navigator.clipboard.writeText(mail).then(() => {
                        showToast('Email copied to clipboard');
                        setTimeout(() => window.location.href = 'mailto:' + mail, 650);
                    }).catch(() => {
                        showToast(mail);
                        setTimeout(() => window.location.href = 'mailto:' + mail, 650);
                    });
                } else {
                    showToast(mail);
                    setTimeout(() => window.location.href = 'mailto:' + mail, 650);
                }
            });
        }

        // Smooth-scroll with pulse for internal footer links
        document.querySelectorAll('footer a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e){
                const id = this.getAttribute('href');
                const target = document.querySelector(id);
                if(target){
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target.classList.add('pulse');
                    setTimeout(() => target.classList.remove('pulse'), 1000);
                }
            });
        });

        // Optional: show small toast when filter changes
        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            const label = btn.textContent.trim();
            showToast('Showing: ' + label);
        }));

    })();
});

/* ================= LML PROGRAMS SECTION (FIXED + SMOOTH) ================= */

const lmlProgramsData = {
  "Digital Empowerment":{
    desc:"Bridging the digital divide through ICT hubs, digital literacy training, and professional certifications.",
    impact:"Over 10,000 individuals trained in digital skills and ICT certifications.",
    initiatives:[
      {icon:"fa-wifi", title:"ICT Hubs", text:"Community-based internet access centers."},
      {icon:"fa-laptop", title:"Digital Literacy", text:"Basic to advanced computer training."},
      {icon:"fa-certificate", title:"ICT Certifications", text:"Industry-recognized tech certifications."},
      {icon:"fa-users", title:"Inclusive Access", text:"Programs for women and vulnerable groups."}
    ]
  },
  "Healthcare Services":{
    desc:"Improving access to essential healthcare in underserved communities.",
    impact:"Thousands receiving medical support annually.",
    initiatives:[
      {icon:"fa-heart-pulse", title:"Primary Care", text:"Community health services."},
      {icon:"fa-user-nurse", title:"Maternal Health", text:"Support for mothers and infants."},
      {icon:"fa-syringe", title:"Vaccination", text:"Routine immunization programs."},
      {icon:"fa-kit-medical", title:"Health Education", text:"Community awareness campaigns."}
    ]
  },
  "Rural Finance":{
    desc:"Promoting financial inclusion and entrepreneurship.",
    impact:"Micro-loans empowering hundreds of rural businesses.",
    initiatives:[
      {icon:"fa-coins", title:"Microcredit", text:"Small business loans."},
      {icon:"fa-piggy-bank", title:"Savings Groups", text:"Community savings programs."},
      {icon:"fa-chart-line", title:"Financial Literacy", text:"Budgeting and planning training."},
      {icon:"fa-briefcase", title:"Entrepreneurship", text:"Business development support."}
    ]
  },
  "Sustainability":{
    desc:"Encouraging environmentally responsible development.",
    impact:"Communities adopting renewable and eco practices.",
    initiatives:[
      {icon:"fa-seedling", title:"Tree Planting", text:"Reforestation projects."},
      {icon:"fa-solar-panel", title:"Solar Energy", text:"Renewable energy initiatives."},
      {icon:"fa-recycle", title:"Waste Management", text:"Recycling programs."},
      {icon:"fa-leaf", title:"Climate Education", text:"Environmental awareness."}
    ]
  },
  "Social Protection":{
    desc:"Supporting vulnerable individuals and families.",
    impact:"Hundreds of households supported yearly.",
    initiatives:[
      {icon:"fa-hand-holding-heart", title:"Community Support", text:"Aid for vulnerable families."},
      {icon:"fa-child", title:"Child Protection", text:"Child safeguarding initiatives."},
      {icon:"fa-people-group", title:"Women Empowerment", text:"Leadership development programs."},
      {icon:"fa-shield-heart", title:"Crisis Response", text:"Emergency assistance programs."}
    ]
  }
};

document.addEventListener("DOMContentLoaded", function(){

  const lmlTabsContainer = document.getElementById("lmlProgramsTabs");
  const lmlTitle = document.getElementById("lmlProgramTitle");
  const lmlDesc = document.getElementById("lmlProgramDesc");
  const lmlImpact = document.getElementById("lmlProgramImpact");
  const lmlGrid = document.getElementById("lmlProgramsGrid");
  const lmlContent = document.getElementById("lmlProgramsContent");

  if(!lmlTabsContainer) return; // prevents errors if section not found

  /* Create Tabs */
  Object.keys(lmlProgramsData).forEach((name,index)=>{
    const tab = document.createElement("button");
    tab.className = "lml-programs-tab";
    tab.textContent = name;
    if(index===0) tab.classList.add("active");
    tab.addEventListener("click",()=>lmlChangeProgram(name,tab));
    lmlTabsContainer.appendChild(tab);
  });

  function lmlChangeProgram(name,tab){

    if(tab.classList.contains("active")) return;

    document.querySelectorAll(".lml-programs-tab")
      .forEach(t=>t.classList.remove("active"));

    tab.classList.add("active");

    lmlContent.classList.remove("fade-in");
    lmlContent.classList.add("fade-out");

    setTimeout(()=>{

      lmlTitle.textContent = name;
      lmlDesc.textContent = lmlProgramsData[name].desc;
      lmlImpact.textContent = lmlProgramsData[name].impact;

      lmlGrid.innerHTML="";
      lmlProgramsData[name].initiatives.forEach(item=>{
        const card = document.createElement("div");
        card.className="lml-programs-item";
        card.innerHTML=`
          <i class="fa-solid ${item.icon}"></i>
          <h5>${item.title}</h5>
          <p>${item.text}</p>
        `;
        lmlGrid.appendChild(card);
      });

      lmlContent.classList.remove("fade-out");
      lmlContent.classList.add("fade-in");

    },200);
  }

  /* Initial Load */
  const firstTab = document.querySelector(".lml-programs-tab");
  lmlContent.classList.add("fade-in");
  lmlTitle.textContent = Object.keys(lmlProgramsData)[0];
  lmlDesc.textContent = lmlProgramsData[Object.keys(lmlProgramsData)[0]].desc;
  lmlImpact.textContent = lmlProgramsData[Object.keys(lmlProgramsData)[0]].impact;

  lmlProgramsData[Object.keys(lmlProgramsData)[0]].initiatives.forEach(item=>{
    const card = document.createElement("div");
    card.className="lml-programs-item";
    card.innerHTML=`
      <i class="fa-solid ${item.icon}"></i>
      <h5>${item.title}</h5>
      <p>${item.text}</p>
    `;
    lmlGrid.appendChild(card);
  });

});

/* ================= SERVICE SELECTOR ================= */
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('service-select');
    const serviceBtn = document.getElementById('service-btn');
    
    if (serviceSelect && serviceBtn) {
        // Enable/disable button based on selection
        serviceSelect.addEventListener('change', function() {
            serviceBtn.disabled = !this.value;
        });
        
        // Navigate on button click
        serviceBtn.addEventListener('click', function() {
            if (serviceSelect.value) {
                window.location.href = serviceSelect.value;
            }
        });
    }
});