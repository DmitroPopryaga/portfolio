import HeaderMenu from "./HeaderMenu.js";
import HeaderScrollEffect from "./HeaderScrollEffect.js";
import Theme from "./Theme.js";
import ScrollAnimation from "./ScrollAnimation.js";
import CopyMail from "./CopyMail.js";

new HeaderMenu()
new HeaderScrollEffect()
new Theme()
new ScrollAnimation()
new CopyMail()
new HeaderScrollEffect()

const swiperProject = new Swiper('.swiper', {
  loop: true,
  spaceBetween: 16,
  slidesPerView: 'auto',
  grabCursor: true,
  speed: 600,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  breakpoints: {
    768: {
      spaceBetween: 24,
    },
    1024: {
      spaceBetween: 32,
    },
  },
})

const scrollReveal = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2000,
  delay: 300,
  reset: false,
})

scrollReveal.reveal('.hero__data', {origin: 'left'})
scrollReveal.reveal('.hero__image', {origin: 'right'})
scrollReveal.reveal('#hard-skills .skills__item', {origin:'left', interval:100, delay: 400})
scrollReveal.reveal('#soft-skills .skills__item', {origin:'right', interval:100, delay: 400})
scrollReveal.reveal('.scroll-animation', {origin: 'bottom', delay: 500})
scrollReveal.reveal('.portfolio', {delay: 600})
scrollReveal.reveal('.work', {delay: 700})
scrollReveal.reveal('.footer', {delay: 800})
