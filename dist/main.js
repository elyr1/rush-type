import { RushType } from "./engine.js";
import { FONT_VAR, WORDS } from "./params.js";
const host = document.querySelector("#rush-type");
if (!host)
    throw new Error("Missing #rush-type host");
const form = document.querySelector("#rush-form");
const input = document.querySelector("#rush-input");
const submit = document.querySelector("#rush-submit");
const status = document.querySelector("#rush-status");
if (!form || !input || !submit || !status)
    throw new Error("Missing rush text form");
const describeWords = (words) => {
    host.setAttribute("aria-label", `The words ${words.join(", ")} one at a time on a dark field. Each word holds still and sharp for a beat, then swings up and toward you, turning, until it stretches off the frame and tears into vertical streaks of green and violet light. Pointing at it holds the word near its largest state.`);
};
let queuedWords = null;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let engine = null;
let onScreen = true;
let hidden = document.hidden;
const sync = () => {
    if (!engine || reduced)
        return;
    if (onScreen && !hidden)
        engine.start();
    else
        engine.stop();
};
const init = () => {
    const nextEngine = new RushType(host);
    if (!nextEngine.ok) {
        host.dataset.failed = "true";
        host.removeAttribute("tabindex");
        host.setAttribute("aria-label", "Animation unavailable because WebGL could not start.");
        nextEngine.destroy();
        input.disabled = true;
        submit.disabled = true;
        status.dataset.state = "error";
        status.textContent = "Animation unavailable because WebGL could not start.";
        return;
    }
    engine = nextEngine;
    if (queuedWords) {
        engine.setWords(queuedWords);
        queuedWords = null;
    }
    engine.renderStill();
    if (!reduced)
        sync();
    if (document.fonts?.load) {
        const probe = document.createElement("span");
        probe.style.cssText = `position:absolute;visibility:hidden;font-family:${FONT_VAR}`;
        probe.textContent = "Ag";
        document.body.appendChild(probe);
        const fam = getComputedStyle(probe)
            .fontFamily.split(",")[0]
            .replace(/["']/g, "")
            .trim();
        probe.remove();
        document.fonts.load(`400 1em "${fam}"`).then(() => engine?.refreshFont(), () => { });
    }
};
requestAnimationFrame(init);
const io = new IntersectionObserver((entries) => {
    onScreen = entries[0]?.isIntersecting ?? false;
    sync();
}, { threshold: 0.2 });
io.observe(host);
document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
    sync();
});
let pointerHeld = false;
let focusHeld = false;
const syncHeld = () => engine?.setHeld(pointerHeld || focusHeld);
const grab = () => {
    pointerHeld = true;
    syncHeld();
};
const release = () => {
    pointerHeld = false;
    syncHeld();
};
host.addEventListener("pointerenter", grab);
host.addEventListener("pointerdown", grab);
host.addEventListener("pointerleave", release);
host.addEventListener("pointerup", release);
host.addEventListener("pointercancel", release);
host.addEventListener("focus", () => {
    focusHeld = host.matches(":focus-visible");
    syncHeld();
});
host.addEventListener("blur", () => {
    focusHeld = false;
    syncHeld();
});
let resizeTimer = 0;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => engine?.onResize(), 120);
});
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const normalized = input.value.trim();
    const words = normalized ? normalized.split(/\s+/) : [];
    if (words.length === 0) {
        input.setAttribute("aria-invalid", "true");
        status.dataset.state = "error";
        status.textContent = "Enter at least one word before submitting.";
        input.focus();
        return;
    }
    input.removeAttribute("aria-invalid");
    delete status.dataset.state;
    status.textContent = "";
    if (engine)
        engine.setWords(words);
    else
        queuedWords = words;
    describeWords(words);
});
input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") !== "true" || !input.value.trim())
        return;
    input.removeAttribute("aria-invalid");
    delete status.dataset.state;
    status.textContent = "";
});
describeWords(WORDS);