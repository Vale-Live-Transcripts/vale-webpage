// The landing page's motion: the hero captions a made-up dinner, headlines
// caption themselves, and the drawn sections answer the pointer.
//
// The HTML is each section's finished frame. Without JavaScript nothing here
// runs and that frame is what shows; under Reduce Motion the controls still
// work, but nothing plays on its own and nothing animates. Loops stop while
// their section is off screen, so the page does no work nobody sees.

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
if (!reduceMotion) root.classList.add('motion');

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const press = (buttons, chosen) => buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === chosen)));

// Calls `seen(visible)` whenever an element comes into or leaves view.
function watch(element, seen, options = { threshold: 0.35 }) {
    if (!element) return;
    new IntersectionObserver((entries) => entries.forEach((e) => seen(e.isIntersecting)), options).observe(element);
}

// The made-up dinner, the same words as the app's sample (ValeKit's
// SampleConversation). Never a real conversation.
const DINNER = {
    es: ['¿Quién quiere más pasta?', 'Yo, por favor, está buenísima.', 'La tía Rosa llega el sábado a las tres.',
        '¿Vamos el domingo al mercado del barrio?', 'Sí, pero temprano, antes de que'],
    de: ['Wer möchte noch Nudeln?', 'Ich, bitte, die sind köstlich.', 'Tante Rosa kommt am Samstag um drei.',
        'Gehen wir am Sonntag auf den Markt?', 'Ja, aber früh, bevor'],
    en: ['Who wants more pasta?', "Me, please, it's delicious.", 'Aunt Rosa arrives on Saturday at three.',
        'Shall we go to the market on Sunday?', 'Yes, but early, before'],
};
const PITCH = ['Every word, big and clear.', 'Vale! writes down what is said in the room,', 'live, and in large type.'];

// Caption themes: ground, text, and the partial shade (ValeKit's CaptionTheme).
const THEMES = {
    noche: ['#000000', '#ffffff', '#b3b3b3'],
    dia: ['#ffffff', '#111111', '#4d4d4d'],
    amarillo: ['#000000', '#ffd60a', '#b89a00'],
    papel: ['#f6efdf', '#1c1a17', '#5a5347'],
};

// Top bar: the hero's colours over the hero, the page's below it.
watch($('#hero'), (visible) => $('#top').classList.toggle('below', !visible),
    { rootMargin: '-64px 0px 0px 0px', threshold: 0 });

// The page's own A+: the whole site grows, for the people it is made for.
$('#scale').addEventListener('click', (event) => {
    const larger = event.currentTarget.getAttribute('aria-pressed') !== 'true';
    event.currentTarget.setAttribute('aria-pressed', String(larger));
    root.style.setProperty('--page-scale', larger ? '125%' : '100%');
});

// Hero: the page captions itself, then the dinner, over and over while
// it is on screen and listening.
const hero = {
    lines: $('#lines'),
    go: $('#go'),
    listening: !reduceMotion,
    onScreen: true,
    run: 0,
    size: 1,
};

function showListening() {
    hero.go.className = 'btn ' + (hero.listening ? 'stop' : 'start');
    hero.go.setAttribute('aria-pressed', String(hero.listening));
    $('#go-text').textContent = hero.listening ? 'Stop' : 'Start';
    $('#pill').classList.toggle('off', !hero.listening);
    if (!hero.listening) $('#pill-text').textContent = 'Paused';
}

async function say(text, id, last) {
    [...hero.lines.children].forEach((line) => { line.className = 'line old'; });
    while (hero.lines.children.length > 3) hero.lines.firstElementChild.remove();
    const line = document.createElement('p');
    line.className = 'line new';
    hero.lines.append(line);
    const words = text.split(' ');
    for (const [i, word] of words.entries()) {
        if (id !== hero.run) return;
        const span = document.createElement('span');
        span.className = 'w pending';
        span.textContent = word + (i < words.length - 1 ? ' ' : '');
        line.append(span);
        await sleep(210 + Math.random() * 170);
    }
    if (last) return;
    await sleep(300);
    line.querySelectorAll('.pending').forEach((span) => span.classList.remove('pending'));
    await sleep(1100);
}

async function play() {
    const id = ++hero.run;
    while (id === hero.run) {
        hero.lines.textContent = '';
        $('#pill-text').textContent = 'Listening · English';
        for (const line of PITCH) {
            await say(line, id);
            if (id !== hero.run) return;
        }
        $('#pill-text').textContent = 'Listening · Español';
        for (const [i, line] of DINNER.es.entries()) {
            await say(line, id, i === DINNER.es.length - 1);
            if (id !== hero.run) return;
        }
        await sleep(3500);
    }
}

function settle() {
    hero.run++;
    hero.lines.querySelectorAll('.pending').forEach((span) => span.classList.remove('pending'));
}

hero.go.addEventListener('click', () => {
    hero.listening = !hero.listening;
    showListening();
    if (hero.listening) play(); else settle();
});

$('#larger').addEventListener('click', () => {
    hero.size = Math.min(1.5, hero.size + 0.125);
    $('#stage').style.setProperty('--size', hero.size);
});
$('#smaller').addEventListener('click', () => {
    hero.size = Math.max(0.625, hero.size - 0.125);
    $('#stage').style.setProperty('--size', hero.size);
});

$$('.dot').forEach((dot) => dot.addEventListener('click', () => {
    const [ground, text, partial] = THEMES[dot.dataset.theme];
    root.style.setProperty('--cbg', ground);
    root.style.setProperty('--cfg', text);
    root.style.setProperty('--cp', partial);
    $('meta[name="theme-color"]').setAttribute('content', ground);
    press($$('.dot'), dot);
}));

showListening();
watch($('#hero'), (visible) => {
    if (visible === hero.onScreen) return;
    hero.onScreen = visible;
    if (!hero.listening) return;
    if (visible) play(); else settle();
}, { threshold: 0.2 });
if (hero.listening) play();

// Headlines caption themselves: each word arrives in the partial shade,
// then the line settles.
function splitWords(element) {
    const walk = (node) => [...node.childNodes].forEach((child) => {
        if (child.nodeType !== Node.TEXT_NODE) {
            if (!child.classList.contains('sr')) walk(child);
            return;
        }
        const pieces = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((piece) => {
            if (!piece) return;
            if (/^\s+$/.test(piece)) {
                pieces.append(piece);
                return;
            }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = piece;
            pieces.append(span);
        });
        child.replaceWith(pieces);
    });
    walk(element);
}

if (!reduceMotion) {
    const captionObserver = new IntersectionObserver((entries) => entries.forEach(async (entry) => {
        if (!entry.isIntersecting) return;
        captionObserver.unobserve(entry.target);
        const words = [...entry.target.querySelectorAll('.w')];
        for (const word of words) {
            word.classList.add('in', 'pending');
            await sleep(150);
        }
        await sleep(350);
        words.forEach((word) => word.classList.remove('pending'));
    }), { threshold: 0.6 });
    $$('[data-caption]').forEach((element) => {
        splitWords(element);
        captionObserver.observe(element);
    });
}

// One tap: the big button starts and stops, with its own symbol and word.
$('#big-start').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const on = button.classList.toggle('on');
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? 'Stop' : 'Start');
});

// Sizes: the line steps through the nine A− / A+ sizes as the section
// scrolls past.
const STEPS = [24, 28, 34, 40, 48, 56, 64, 80, 96];
if (!reduceMotion) {
    const sizes = $('#sizes');
    const sample = $('#sample');
    const ticks = $$('#ruler li');
    let queued = false;
    const draw = () => {
        queued = false;
        const box = sizes.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -box.top / (box.height - innerHeight)));
        const step = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
        const widest = Math.min(sizes.clientWidth - 40, 1240) / 9.2;
        sample.style.fontSize = (STEPS[step] / 96) * widest + 'px';
        ticks.forEach((tick, i) => tick.classList.toggle('on', i === step));
    };
    const queue = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(draw);
    };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    draw();
}

// Private: the counter tries, and stays at zero.
if (!reduceMotion) {
    let counted = false;
    watch($('#zero'), async (visible) => {
        if (!visible || counted) return;
        counted = true;
        for (const n of [3, 2, 1, 0]) {
            $('#zero').textContent = n;
            await sleep(220);
        }
    }, { threshold: 0.5 });
}

// Languages: the dinner in the language picked.
const said = $('#said');
let saying = 0;
async function speak(language) {
    const id = ++saying;
    said.lang = language;
    said.textContent = '';
    const words = DINNER[language].slice(0, 2).join(' ').split(' ');
    for (const word of words) {
        if (id !== saying) return;
        said.textContent += (said.textContent ? ' ' : '') + word;
        if (!reduceMotion) await sleep(150);
    }
}
$$('.langs button').forEach((button) => button.addEventListener('click', () => {
    press($$('.langs button'), button);
    speak(button.dataset.lang);
}));

// Made for the table: one drawn device in each platform's shape.
$$('.picker button').forEach((button) => button.addEventListener('click', () => {
    press($$('.picker button'), button);
    const device = $('#device');
    device.dataset.device = button.dataset.device;
    device.setAttribute('aria-label', {
        ipad: 'Vale! on iPad: the conversation in large type on the left, the controls in a rail on the right',
        iphone: 'Vale! on iPhone: the conversation in large type, the controls in a tray below it',
        sideways: 'Vale! on iPhone held sideways: the conversation on the left, a narrow rail of controls on the right',
        mac: 'Vale! on the Mac: the conversation in a window, the controls in its toolbar',
    }[button.dataset.device]);
}));
