'use strict';
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // This is old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  // This is modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//  Scrolling navbar to page
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching the class name of nav element
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// mous over on nav bar opacity will be less

const handleHover = function (e, opa) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (el !== link) el.style.opacity = opa;
    });
    logo.style.opacity = opa;
  }
};
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
const initialCoords = section1.getBoundingClientRect();
// Sticky navigation
const navHeight = nav.getBoundingClientRect().height;
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top - navHeight) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//     console.log('ye hi he');
//   }
// });

// Sticly navigation using API intesection
const header = document.querySelector('.header');
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry.isIntersecting);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//  Reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.isIntersecting);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// lazy loading images
const imagTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.scr = entry.target.dataset.scr;
  entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15,
  rootMargin: `-200px`,
});
imagTargets.forEach(function (img) {
  imgObserver.observe(img);
  img.classList.add('lazy-img');
});
// slider component
const slides = document.querySelectorAll('.slide');
// const slider = document.querySelector('.slider');
const btnLft = document.querySelector('.slider__btn--left');
const btnRt = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');
const createDotes = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class='dots__dot' data-slide='${i}'></button>`
    );
  });
};
createDotes();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};
// slider.style.transform = 'scale(0.9) translateX(0px)';
// slider.style.overflow = 'visible';

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);
activateDot(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
btnRt.addEventListener('click', nextSlide);
btnLft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

const renderd = function (data) {
  const html = `<div class="container">
        <div class="miniContainer">
          <img
            src=${data.image}
            alt=""
          />
          <div class="data">
            <p class="date"><span class="spn">Date :</span>${data.ath_date}</p>
            <p class="name">
              <span class="spn">Name :</span> ${data.name}
              <span class="symbol">${data.symbol}</span>
            </p>
            <p class="price"><span class="spn">Price :</span>${data.current_price}</p>
            <p class="rak"><span class="spn">Rank :</span> ${data.market_cap_rank}</p>
          </div>
        </div>
      </div>`;
  ``;
  section1.insertAdjacentHTML('beforeend', html);
};
// const r = async function (url) {
//   const data = await fetch(url);
//   console.log(data);
//   const s = data.json();
//   console.log(s);
//   console.log(' sgfggrw');

//   // .then(d => {
//   //   d.forEach(el => {
//   //     renderd(el);
//   //     console.log(el);
//   //   })
// };
// r('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');

const res = async url => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    data.forEach(el => {
      // Assuming renderd is a defined function to display elements
      renderd(el);
    });
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
};

res('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
console.log('gegfe');
