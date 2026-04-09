let currentRawLines = [];
let currentInstructionLines = [];
let currentContent = "";
let lastGadgets = [];
let currentSort = "len";

const resultsDiv = document.getElementById("resultsContainer");
const statusAction = document.getElementById("statusAction");
const statusGadgets = document.getElementById("statusGadgets");
const disasBadge = document.getElementById("disasBadge");
const disasStats = document.getElementById("disasStats");
const uploadBtn = document.getElementById("uploadBtn");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const helpBtn = document.getElementById("helpBtn");
const sortAddrBtn = document.getElementById("sortAddrBtn");
const sortLenBtn = document.getElementById("sortLenBtn");
const copyAllBtn = document.getElementById("copyAllBtn");
const instructionsTextarea = document.getElementById("instructionsInput");
const helpPanel = document.getElementById("helpPanel");

function setAction(text, isError = false) {
    statusAction.innerHTML = text;
    statusAction.style.color = isError ? "#f28b82" : "#8aa0b8";
}
function setGadgetCount(count) {
    statusGadgets.innerHTML =
        count !== undefined
            ? `<i class='fa-solid fa-bullseye'></i> ${count} gadget(s) found`
            : "";
}
function setDisasState(state, data = {}) {
    disasBadge.className = "disas-badge " + state;
    if (state === "no-file") {
        disasBadge.innerHTML = `<span class="dot"></span><span>No disassembly loaded</span>`;
        disasStats.innerHTML = "";
    } else if (state === "loading") {
        disasBadge.innerHTML = `<span class="spinner"></span><span>Loading…</span>`;
        disasStats.innerHTML = "";
    } else if (state === "loaded") {
        const { name, lines, instrs, size } = data;
        disasBadge.innerHTML = `<span class="dot"></span><span><i class='fa-solid fa-check"></i> <strong>${name}</strong></span>`;
        disasStats.innerHTML = `
                <span class="stat-chip"><i class="fa-solid fa-file-lines"></i> ${lines.toLocaleString()} lines</span>
                <span class="stat-chip"><i class="fa-solid fa-microchip"></i> ${instrs.toLocaleString()} instructions</span>
                <span class="stat-chip"><i class="fa-solid fa-hard-drive"></i> ${(size / 1024).toFixed(1)} KB</span>`;
    }
}

function normalizeInstruction(instr) {
    return instr.replace(/\s+/g, "").toLowerCase();
}

function patternToRegex(pattern) {
    let escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let regexStr = escaped.replace(/\\\$/g, "(\\d{1,2})");
    return new RegExp("^" + regexStr + "$");
}

function matchesPattern(normInstr, pattern) {
    if (pattern.length === 0) return true;
    if (pattern.includes("$")) {
        const regex = patternToRegex(pattern);
        return regex.test(normInstr);
    } else {
        return normInstr.startsWith(pattern);
    }
}

function isLabelLine(line) {
    let t = line.trim();
    return (
        t.match(/^\.l_[0-9a-f]+:$/i) !== null ||
        (t.endsWith(":") && !t.includes(";") && !t.match(/^[0-9a-f]/i))
    );
}
function extractInstruction(line) {
    let trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith(";")) return null;
    if (isLabelLine(line)) return null;
    let idx = line.indexOf(";");
    if (idx !== -1) {
        let instr = line.substring(0, idx).trim();
        if (instr) return instr;
    }
    let match = line.match(/^([^ \t]+)[ \t]+([0-9A-Fa-f ]+)[ \t]+(.*)$/);
    if (match) {
        let asm = match[3].trim();
        if (asm) return asm;
    }
    let tokens = trimmed.split(/\s+/);
    while (tokens.length) {
        let token = tokens[0];
        if (token.match(/^[0-9A-Fa-f:]+H?$/)) tokens.shift();
        else if (token.match(/^[0-9A-Fa-f]+$/)) tokens.shift();
        else break;
    }
    if (tokens.length) return tokens.join(" ");
    return null;
}

function parseLine(line) {
    let instr = extractInstruction(line);
    if (instr === null) return { type: "skip" };
    return { type: "instr", normalized: normalizeInstruction(instr) };
}

function buildInstructionIndex(rawLines) {
    let result = [];
    for (let i = 0; i < rawLines.length; i++) {
        let p = parseLine(rawLines[i]);
        if (p.type === "instr")
            result.push({ rawIndex: i, normalized: p.normalized });
    }
    return result;
}

function isEndOfGadgetRaw(line) {
    let instr = extractInstruction(line);
    if (instr === null) return false;
    let norm = normalizeInstruction(instr);
    return norm === "poppc" || norm === "rt" || norm === "rti";
}

function findAllGadgets(patterns) {
    if (!currentInstructionLines.length || !patterns.length) return [];
    let gadgets = [];
    let total = currentInstructionLines.length;
    for (let i = 0; i < total; i++) {
        if (!matchesPattern(currentInstructionLines[i].normalized, patterns[0]))
            continue;
        let ok = true;
        for (let j = 1; j < patterns.length; j++) {
            if (
                i + j >= total ||
                !matchesPattern(
                    currentInstructionLines[i + j].normalized,
                    patterns[j],
                )
            ) {
                ok = false;
                break;
            }
        }
        if (!ok) continue;
        let start = currentInstructionLines[i].rawIndex;
        let lines = [],
            end = start;
        for (let k = start; k < currentRawLines.length; k++) {
            lines.push(currentRawLines[k]);
            if (isEndOfGadgetRaw(currentRawLines[k])) {
                end = k;
                break;
            }
        }
        let addr = "";
        let firstLine = currentRawLines[start];
        let m = firstLine.match(/;\s*([0-9A-F]+)\s*\|/i);
        if (m) addr = m[1];
        else {
            let addrMatch = firstLine.match(/^([^ \t]+)/);
            if (addrMatch) addr = addrMatch[1];
        }
        gadgets.push({
            startLine: start,
            endLine: end,
            address: addr,
            lines,
            length: lines.length,
        });
        for (let t = i + patterns.length; t < total; t++) {
            if (currentInstructionLines[t].rawIndex > end) {
                i = t - 1;
                break;
            }
        }
    }
    return gadgets;
}

function sortGadgets(gadgets, by) {
    if (by === "addr")
        return [...gadgets].sort((a, b) => {
            let aAddr = parseInt(a.address, 16) || 0;
            let bAddr = parseInt(b.address, 16) || 0;
            return aAddr - bAddr;
        });
    if (by === "len") return [...gadgets].sort((a, b) => a.length - b.length);
    return gadgets;
}

function escapeHtml(s) {
    return s.replace(/[&<>]/g, (m) =>
        m === "&" ? "&amp;" : m === "<" ? "&lt;" : "&gt;",
    );
}

function renderGadgets(gadgets, sortBy = currentSort) {
    let sorted = sortGadgets(gadgets, sortBy);
    if (!sorted.length) {
        resultsDiv.innerHTML = `<pre style="margin:0;color:#4a6080;">// No gadgets found.</pre>`;
        return;
    }
    let parts = [];
    for (let g of sorted) {
        let text = escapeHtml(g.lines.join("\n"));
        let rawText = g.lines.join("\n").replace(/"/g, "&quot;");
        parts.push(
            `<div class="gadget-block">` +
                `<div class="gadget-header">` +
                `<span><i class="fa-solid fa-location-dot"></i> ${g.address || "?"} · lines ${g.startLine + 1}–${g.endLine + 1} · len ${g.length}</span>` +
                `<button class="copy-gadget-btn" onclick="copyGadget(this,'${rawText.replace(/\n/g, "\\n").replace(/'/g, "\\x27")}')"><i class='fa-solid fa-clipboard"></i> Copy</button>` +
                `</div>` +
                `<div class="gadget-line'>${text}</div>` +
                `</div>`,
        );
    }
    resultsDiv.innerHTML = parts.join("");
}

window.copyGadget = function (btn, text) {
    navigator.clipboard
        .writeText(text.replace(/\\n/g, "\n"))
        .then(() => {
            btn.innerHTML = `<i class='fa-solid fa-check'></i> Copied!`;
            setAction(`<i class='fa-solid fa-clipboard'></i> Gadget copied`);
            setTimeout(
                () =>
                    (btn.innerHTML = `<i class='fa-solid fa-clipboard'></i> Copy`),
                1500,
            );
        })
        .catch(() =>
            setAction(`<i class='fa-solid fa-xmark'></i> Copy failed`, true),
        );
};

async function performSearch() {
    if (!currentRawLines.length) {
        setAction(
            `<i class='fa-solid fa-triangle-exclamation'></i> Upload a disassembly file first`,
            true,
        );
        return;
    }
    let raw = instructionsTextarea.value.trim();
    if (!raw) {
        setAction(
            `<i class='fa-solid fa-triangle-exclamation'></i> Enter instructions`,
            true,
        );
        return;
    }
    let patterns = raw
        .split(/\r?\n/)
        .map((l) => normalizeInstruction(l.trim()))
        .filter((l) => l);
    if (!patterns.length) {
        setAction(
            `<i class='fa-solid fa-triangle-exclamation'></i> No valid instructions`,
            true,
        );
        return;
    }
    setAction(`<i class='fa-solid fa-magnifying-glass'></i> Searching…`);
    await new Promise((r) => setTimeout(r, 10));
    try {
        let gadgets = findAllGadgets(patterns);
        lastGadgets = gadgets;
        renderGadgets(gadgets);
        setGadgetCount(gadgets.length);
        setAction(
            gadgets.length
                ? `<i class='fa-solid fa-check'></i> Found ${gadgets.length} gadget(s)`
                : `<i class='fa-solid fa-check'></i> No gadgets found`,
        );
    } catch (e) {
        setAction(
            `<i class='fa-solid fa-xmark'></i> Search error: ` + e.message,
            true,
        );
    }
}

function loadFile(file) {
    setDisasState("loading");
    setAction(`<i class='fa-solid fa-hourglass-half'></i> Reading file…`);
    let reader = new FileReader();
    reader.onload = (e) => {
        setTimeout(() => {
            currentContent = e.target.result;
            currentRawLines = currentContent.split(/\r?\n/);
            currentInstructionLines = buildInstructionIndex(currentRawLines);
            setDisasState("loaded", {
                name: file.name,
                lines: currentRawLines.length,
                instrs: currentInstructionLines.length,
                size: new Blob([currentContent]).size,
            });
            setAction(`<i class='fa-solid fa-check"></i> File loaded`);
            resultsDiv.innerHTML = `<pre style="margin:0;color:#4a6080;'>// File loaded. Enter instructions and click Find.</pre>`;
            setGadgetCount();
            uploadBtn.style.animation = "none";
        }, 300);
    };
    reader.onerror = () => {
        setDisasState("no-file");
        setAction(`<i class='fa-solid fa-xmark'></i> Error reading file`, true);
    };
    reader.readAsText(file);
}

function clearAll() {
    currentRawLines = [];
    currentInstructionLines = [];
    currentContent = "";
    instructionsTextarea.value = "";
    lastGadgets = [];
    currentSort = "len";
    resultsDiv.innerHTML = `<pre style="margin:0;color:#4a6080;">// Upload a disassembly file and enter instructions to search.</pre>`;
    setDisasState("no-file");
    setAction(`<i class='fa-solid fa-broom'></i> Cleared`);
    setGadgetCount();
    uploadBtn.style.animation = "pulse 1.5s infinite";
}

uploadBtn.onclick = () => {
    let inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".txt,.asm,.dis,.lst,text/plain";
    inp.onchange = (e) => {
        if (e.target.files.length) loadFile(e.target.files[0]);
    };
    inp.click();
};
searchBtn.onclick = performSearch;
clearBtn.onclick = clearAll;
helpBtn.onclick = () => helpPanel.classList.toggle("show");
sortAddrBtn.onclick = () => {
    if (!lastGadgets.length) {
        setAction(
            `<i class='fa-solid fa-triangle-exclamation'></i> Search first`,
            true,
        );
        return;
    }
    currentSort = "addr";
    renderGadgets(lastGadgets, "addr");
    setAction(`<i class='fa-solid fa-chart-bar'></i> Sorted by address`);
};
sortLenBtn.onclick = () => {
    if (!lastGadgets.length) {
        setAction(
            `<i class='fa-solid fa-triangle-exclamation'></i> Search first`,
            true,
        );
        return;
    }
    currentSort = "len";
    renderGadgets(lastGadgets, "len");
    setAction(`<i class='fa-solid fa-ruler'></i> Sorted by length`);
};
copyAllBtn.onclick = () => {
    if (!lastGadgets.length) {
        setAction(
            `<i class='fa-solid fa-triangle-exclamation'></i> No gadgets to copy`,
            true,
        );
        return;
    }
    let sorted = sortGadgets(lastGadgets, currentSort);
    let txt = sorted
        .map((g) => g.lines.join("\n"))
        .join("\n\n" + "=".repeat(50) + "\n\n");
    navigator.clipboard
        .writeText(txt)
        .then(() =>
            setAction(
                `<i class='fa-solid fa-clipboard'></i> Copied all ${sorted.length} gadgets`,
            ),
        )
        .catch(() =>
            setAction(`<i class='fa-solid fa-xmark'></i> Copy failed`, true),
        );
};
instructionsTextarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) performSearch();
});

setDisasState("no-file");
setAction(`<i class='fa-solid fa-check'></i> Ready`);
