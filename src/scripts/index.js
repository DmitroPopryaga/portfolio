import HeaderMenu from "./HeaderMenu.js";
import HeaderScrollEffect from "./HeaderScrollEffect.js";
import Theme from "./Theme.js";
import ScrollAnimation from "./ScrollAnimation.js";

new HeaderMenu()
new HeaderScrollEffect()
new Theme()
new ScrollAnimation()

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