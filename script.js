// Handle mobile nav toggle
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav__links--open");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("nav__links--open");
    }
  });
}

// Scroll reveal animations
const revealElements = document.querySelectorAll(
  ".section--alt, .highlight, .cards .card, .skills__column, .contact__form"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// Background orbit animation on canvas
const canvas = document.getElementById("bg-orbits");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

class OrbitingParticle {
  constructor(radius, orbitRadius, speed, color, phase) {
    this.radius = radius;
    this.orbitRadius = orbitRadius;
    this.speed = speed;
    this.color = color;
    this.angle = phase;
  }

  update(dt) {
    this.angle += this.speed * dt;
  }

  draw(context, centerX, centerY) {
    const x = centerX + Math.cos(this.angle) * this.orbitRadius;
    const y = centerY + Math.sin(this.angle) * this.orbitRadius * 0.6;

    const gradient = context.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      this.radius * 3
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(15, 23, 42, 0)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(x, y, this.radius * 3, 0, Math.PI * 2);
    context.fill();
  }
}

const particles = [];
const palette = [
  "rgba(56, 189, 248, 0.9)",
  "rgba(129, 140, 248, 0.9)",
  "rgba(249, 115, 22, 0.9)",
  "rgba(244, 114, 182, 0.9)",
];

for (let i = 0; i < 18; i += 1) {
  particles.push(
    new OrbitingParticle(
      1.2 + Math.random() * 2.5,
      80 + Math.random() * 220,
      0.0003 + Math.random() * 0.0006,
      palette[i % palette.length],
      Math.random() * Math.PI * 2
    )
  );
}

let lastTime = performance.now();

function animate(time) {
  const dt = time - lastTime;
  lastTime = time;

  ctx.clearRect(0, 0, width, height);

  const centerX = width * 0.7;
  const centerY = height * 0.35;

  particles.forEach((p) => {
    p.update(dt);
    p.draw(ctx, centerX, centerY);
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Set dynamic year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Contact form: send via EmailJS
const contactForm = document.querySelector(".contact__form");
const contactNote = document.querySelector(".contact__note");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector(".contact__submit");
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const message = formData.get("message") || "";

    // Disable button while sending
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    if (contactNote) {
      contactNote.textContent = "";
      contactNote.className = "contact__note";
    }

    // Send via EmailJS
    // Replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY with your EmailJS values
    emailjs
      .send("service_14ev9lb", "template_xhp7rb9", {
        title: `New message from ${name}`,
        message: message,
        name: name,
        email: email,
      })
      .then(() => {
        submitBtn.textContent = "Send message";
        submitBtn.disabled = false;
        contactForm.reset();
        if (contactNote) {
          contactNote.textContent = "✅ Message sent! I'll get back to you soon.";
          contactNote.classList.add("contact__note--success");
        }
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        submitBtn.textContent = "Send message";
        submitBtn.disabled = false;
        if (contactNote) {
          contactNote.textContent = "❌ Something went wrong. Please try again or email me directly.";
          contactNote.classList.add("contact__note--error");
        }
      });
  });
}

