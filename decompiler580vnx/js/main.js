const addrToName = new Map();

function addEntry(hexAddr, name) {
    let num = parseInt(hexAddr, 16);
    if (!isNaN(num) && !addrToName.has(num)) addrToName.set(num, name);
}

function normalizeName(name) {
    return name
        .replace(/\s*=\s*/g, "=")
        .replace(/\s*\+=\s*/g, "+=")
        .replace(/\s*-=\s*/g, "-=")
        .replace(/\s*>>\s*/g, ">>")
        .replace(/\s*<<\s*/g, "<<")
        .replace(/\s*,\s*/g, ",")
        .replace(/\s+/g, " ")
        .trim();
}
const gadgetList = [
    ["09fa8", "setlr"],
    ["308d0", "setlr_pc"],
    ["0a05c", "DI,RT"],
    ["23f9e", "calc_checksum_set_f004"],
    ["23fa6", "calc_checksum_no_set_f004"],
    ["23fad", "calc_checksum_0"],
    ["23fc0", "calc_checksum_1"],
    ["23fd4", "calc_checksum_2"],
    ["23fea", "calc_checksum_3"],
    ["23f21", "pr_checksum"],
    ["09ca0", "[er8]+=er2,pop xr8"],
    ["2702e", "sp=er14,pop er14,rt"],
    ["12da6", "sp=er14,pop qr8"],
    ["23f82", "sp=er14,pop qr8,pop qr0"],
    ["20d60", "sp=er14,pop er14"],
    ["21f74", "sp=er6,pop er8"],
    ["09820", "sp=er14,pop xr12"],
    ["13aac", "sp=er14,pop qr8,pop er6"],
    ["0ac34", "er14=sp,rt"],
    ["0a8a8", "nop"],
    ["13b66", "er0+=er0,er0+=er2,er8=[er0]"],
    ["13b9a", "er0+=er0,er2+=er0,er0=[er2]"],
    ["1ec0c", "pop ea"],
    ["27030", "pop er14,rt"],
    ["13332", "pop er0,rt"],
    ["18974", "pop er2"],
    ["250a6", "pop er4"],
    ["0a8a6", "pop er8"],
    ["16eca", "pop er12,rt"],
    ["17bda", "pop qr0"],
    ["12da8", "pop qr8"],
    ["177da", "pop r0"],
    ["1844a", "pop r8"],
    ["1622e", "pop xr0"],
    ["1d040", "pop xr4"],
    ["183a6", "pop xr8"],
    ["0d516", "pop er10"],
    ["0d04c", "pop r12"],
    ["12602", "pop er0"],
    ["21636", "pop er12"],
    ["15c78", "pop er14"],
    ["13ab0", "pop er6"],
    ["1dcf6", "pop er6,rt"],
    ["20730", "pop xr12"],
    ["16d88", "pop er4,rt"],
    ["16d7c", "pop er8,rt"],
    ["17072", "pop qr0,rt"],
    ["14c50", "pop qr8,rt"],
    ["15fc0", "pop r4"],
    ["16210", "pop r4,rt"],
    ["14c98", "pop r9"],
    ["10e5a", "pop xr12,rt"],
    ["1d972", "pop xr4,rt"],
    ["0e5e2", "pop xr8,rt"],
    ["093b8", "pop er2,pop er8,er0=er2,rt"],
    ["1893a", "pop er0,pop er4"],
    ["16754", "pop er4,pop er8"],
    ["201f6", "pop er4,pop er12,pop r9"],
    ["14bd8", "er0+=er4,rt"],
    ["13b80", "er4+=er0,r8=r8,rt"],
    ["21ba8", "er0+=er8,rt"],
    ["21bae", "er2+=er8,rt"],
    ["2fa0c", "er0+=er2,rt"],
    ["16078", "er0+=1,rt"],
    ["09ce4", "r0+=1,rt"],
    ["14fcc", "er0+=er6,er10=er0,rt"],
    ["20838", "and r0,0f"],
    ["24008", "er6=er0,er0=er8,pop qr8"],
    ["16170", "er8=er0"],
    ["0ea70", "er2=er0,er0=er2,pop er8,rt"],
    ["14bd6", "er2=er0,er0+=er4,rt"],
    ["0bf30", "er0=er2,rt"],
    ["2470a", "er0=er4,pop er4"],
    ["2f786", "er0=er8,pop er8,rt"],
    ["0a246", "er0=er8,pop er8"],
    ["15386", "er0=er8"],
    ["1edea", "er0=er6,pop er8,pop xr4,rt"],
    ["28c86", "er2=er0,r0=r4,r1=0,pop xr4,rt"],
    ["2ffc0", "r0=r5,pop er4"],
    ["1abb0", "r0=r2=0"],
    ["1abb2", "r0=r2"],
    ["15fde", "r2=r0,pop er0"],
    ["164e4", "r2=r0,pop r6,pop er12"],
    ["177b4", "r2=0,r7=4"],
    ["1ca8a", "r0=0"],
    ["1DD54", "r0=0,rt"],
    ["1DD58", "r0=1,rt"],
    ["18978", "r0=0,pop er2"],
    ["2ac30", "r1=0,rt"],
    ["16df2", "r5=0,rt"],
    ["17b32", "er14=er0,pop xr0"],
    ["0ac7c", "er0=er12,pop er12,rt"],
    ["13916", "er10=er2,rt"],
    ["20b52", "er0=er10,pop xr8"],
    ["1e60c", "er0=1,rt"],
    ["180d2", "er2=0,er4=0,er6=0,er8=1,rt"],
    ["09caa", "er2=0,r0=2,[er8]=er2,pop xr8"],
    ["0a88a", "er2=1,r0=r2,rt"],
    ["09c9e", "r0=0,[er8]+=er2,pop xr8"],
    ["27e7c", "r2=1,r0=r2,pop er4,pop er8,rt"],
    ["27e92", "r0=r1,rt"],
    ["14fce", "er10=er0,rt"],
    ["283fe", "er2=0,er0=er2,pop er8"],
    ["140e4", "er0=er6,er2=er12"],
    ["16e18", "r4=0"],
    ["0eda0", "er0=0,rt"],
    ["16d9a", "[er2]=er0,r2=0,pop er4,rt"],
    ["139d8", "[er0]=er2,rt"],
    ["208b2", "[er0]=r2,rt"],
    ["203D2", "[er0]=r2"],
    ["176d4", "[er2]=r0,r2=0"],
    ["09ca4", "[er8]=er2,pop xr8"],
    ["13330", "[er4]=er0,pop er0,rt"],
    ["1a588", "[ea]=qr0"],
    ["22226", "[er12]=er14,pop xr4,pop qr8"],
    ["1332a", "[er4]+=1,rt"],
    ["13336", "[er4]-=1,rt"],
    ["19e5a", "er8=[ea+],rt"],
    ["16614", "[er2]=r0,r0=0"],
    ["16d7a", "er4=[er8],pop er8,rt"],
    ["13b9e", "er0=[er2],r2=9,rt"],
    ["13b6a", "er8=[er0],rt"],
    ["09e4a", "r0=[er2]"],
    ["18274", "r0=[er0]"],
    ["298dc", "er0=[er0],pop xr8,rt"],
    ["09fdc", "r0=[ea],rt"],
    ["21f72", "sp=[er8],pop er8"],
    ["1c2c0", "qr0=[ea],lea D002H,[ea]=qr0"],
    ["1c64a", "er6=[ea]"],
    ["09e8a", "er0-=er2,rt"],
    ["29a40", "er0-=er12,pop er8,pop er12,rt"],
    ["09e98", "r0-=1,rt"],
    ["0ac5a", "r0-=r8,pop er8,rt"],
    ["122d4", "or r0,r1"],
    ["1a5c2", "or qr0,qr8"],
    ["20830", "r0>>4,rt"],
    ["1bb28", "qr0>>4,rt"],
    ["1bb5c", "r0<<4,rt"],
    ["1bb70", "r1<<4,rt"],
    ["1bb5a", "er0<<4,rt"],
    ["1bb56", "xr0<<4,rt"],
    ["1bb4e", "qr0<<4,rt"],
    ["0c790", "er0-er2_gt,r0=0|r0=1,rt"],
    ["09ae6", "er0-er2_eq,r0=1|r0=0,rt"],
    ["0c7a8", "er2-er0_gt,r0=0|r0=1,rt"],
    ["2abda", "er0-er2_le,er0=er2,rt"],
    ["297e2", "er8-er0_lt,pop xr8"],
    ["091ec", "r0-0_lt,rt"],
    ["091f4", "r1-0_lt,rt"],
    ["14bd4", "er0*=r2,er2=er0,er0+=er4,rt"],
    ["14fca", "er0*=r2,er0+=er6,er10=er0,rt"],
    ["28C54", "er0/=r2,rt"],
    ["160c2", "sp+=20"],
    ["162d4", "sp+=10"],
    ["168f0", "sp+=2"],
    ["1d3c8", "sp+=4"],
    ["09932", "sp+=6,pop qr8"],
    ["13184", "sp+=50,pop qr8"],
    ["131f6", "sp+=20,pop qr8"],
    ["13320", "sp+=30,pop qr8"],
    ["15c76", "sp+=30,pop er14"],
    ["1d3f2", "sp+=2,r0=0"],
    ["1d798", "sp+=20,pop xr12"],
    ["21634", "sp+=10,pop er12"],
    ["21b9c", "sp+=60,pop xr8"],
    ["284ac", "sp+=4,pop xr8"],
    ["08f74", "sp+=64,pop er6,pop qr8"],
    ["098ec", "sp+=4,pop qr8,pop xr4"],
    ["13412", "sp+=40,pop qr8,pop xr4"],
    ["138a6", "sp+=60,pop qr8,pop xr4"],
    ["18266", "sp+=50,pop qr8,pop xr4"],
    ["193a0", "sp+=50,pop xr4,pop qr8"],
    ["202b0", "sp+=120,pop qr8,pop xr4"],
    ["20660", "sp+=2,pop xr4,pop qr8"],
    ["21b9a", "sp+=120,pop xr8"],
    ["26b12", "sp+=2,r0=1,pop er8"],
    ["2122a", "sp+=32,r2=r0,pop xr8"],
    ["18614", "?r0=00"],
    ["33030", "brk"],
    ["0d71c", "[ea]+=1,r0=3"],
    ["2c81e", "[ea]-=1,pop xr4"],
    ["24836", "B LEAVE"],
    ["09450", "BL memcpy,pop er0"],
    ["203CC", "BL strcpy"],
    ["203E0", "BL strcat"],
    ["09D3A", "BL memset,pop er2"],
    ["23CAC", "BL delay,pop xr0"],
    ["20C40", "BL line_print"],
    ["23F62", "BL printline"],
    ["24004", "BL hex_byte,er6=er0,er0=er8,pop qr8"],
    ["20A50", "BL smart_strcpy,pop er8"],
    ["0A052", "BL zero_KO"],
    ["28AC2", "BL line_draw"],
    ["09AD4", "BL render.ddd4"],
    ["2B2BA", "memcpy_auto_jmp"],
    ["08f80", "line_print"],
    ["25c1c", "getkeycode"],
    ["09E96", "[ea+]=r0,r0-=1,bne"],
    ["09C20", "cmp_ea"],
    ["17922", "calc_func"],
    ["16082", "cvt_hex_1"],
    ["160f8", "cvt_hex_2"],
    ["10f20", "memcpy_length_rn/8"],
    ["1700e", "memcpy_length_rn/2,pop qr0"],
    ["13324", "pop pc"],
    ["0E5C8", "strcpy"],
    ["2EDA0", "strcat"],
    ["26FFA", "memcpy"],
    ["0A8AA", "memmove"],
    ["29A2C", "strlen"],
    ["1EB94", "memset"],
    ["203C2", "smart_strcpy"],
    ["203D6", "smart_strcat"],
    ["203B8", "smart_strlen_n"],
    ["2086C", "basen_base_print"],
    ["23DCC", "smallprint"],
    ["08F7C", "line_print.col_0"],
    ["08F7E", "line_print"],
    ["23DC8", "printline"],
    ["09470", "render.e3d4"],
    ["0947C", "render.ddd4"],
    ["09848", "render_bitmap"],
    ["09D34", "memzero"],
    ["26086", "reset_routine"],
    ["24BD6", "get_string_constant"],
    ["08C0C", "fill_screen"],
    ["08F02", "str_decompress_print"],
    ["09F3C", "delay"],
    ["0A1CE", "_start"],
    ["293D8", "main"],
    ["09440", "buf1_to_buf2"],
    ["09458", "buf2_to_buf1"],
    ["2AB26", "byte_strlen_n"],
    ["23C4C", "diagnostic_mode"],
    ["0ACB6", "f_0ACB6"],
    ["0AD92", "diagnostic_wait_key"],
    ["0E826", "check_any_key_pressed__"],
    ["23CB4", "diagnostic"],
    ["24344", "diag_scr_888_ws"],
    ["23DD6", "diag_scr_fill_ws"],
    ["23DDA", "waitshift_striped"],
    ["23DDE", "waitshift"],
    ["23DE4", "diag_scr_ckb1_ws"],
    ["23E40", "diag_scr_ckb2_ws"],
    ["23E6A", "diag_scr_version"],
    ["23E92", "diag_print_ver"],
    ["23EEE", "diag_checksum"],
    ["23F8A", "store_reg_to_stack"],
    ["23EC8", "diag_print_pd"],
    ["23F9A", "diag_calc_checksum"],
    ["09A24", "pd_value"],
    ["24010", "hex_byte"],
    ["16EAE", "byte_hex"],
    ["09938", "hex_to_dec"],
    ["2541A", "diag_serial_num"],
    ["10E5E", "get_serial_num"],
    ["23D5A", "diag_check_key"],
    ["2641A", "diag_contrast"],
    ["2C58A", "diag_8_keytest"],
    ["1F24E", "getscancode"],
    ["2F5EA", "getkey"],
    ["25C1A", "getkeycode"],
    ["29892", "cvt_key"],
    ["0A0E0", "setsfr"],
    ["19808", "byte_to_bcd"],
    ["19832", "bcd_to_byte"],
    ["08E62", "line_draw"],
    ["091FC", "pixel_draw"],
    ["090D2", "draw_glyph"],
    ["2EDC8", "line_print__call__"],
    ["0996C", "str_decompress_print__call__"],
    ["099C2", "str_decompress_print__call1__"],
    ["0904E", "char_print_1byte"],
    ["09056", "char_print"],
    ["09238", "char_get_14"],
    ["09318", "char_get_l14"],
    ["0A16A", "zero_KO"],
    ["09DE6", "assign_var"],
    ["08C60", "buffer_clear"],
    ["0AC30", "ENTER"],
    ["0AC38", "LEAVE"],
    ["224DE", "LEAVE1"],
    ["22D66", "LEAVE2"],
    ["13D92", "LEAVE3"],
    ["2110A", "LEAVE4"],
    ["1652C", "num_add"],
    ["16538", "num_sub"],
    ["16544", "num_mul"],
    ["16550", "num_div"],
    ["1D24A", "num_add_1"],
    ["1D236", "num_sub_1"],
    ["1D272", "num_mul_1"],
    ["1D25E", "num_div_1"],
    ["20C46", "num_output_print"],
    ["1D950", "num_fromdigit"],
    ["1DC2E", "num_frombyte"],
    ["1D898", "num_invalid__"],
    ["1DBE2", "num_trunc__"],
    ["1DAF0", "num_mulxp__"],
    ["1391A", "num_random"],
    ["13A20", "num_randint"],
    ["139D2", "num_normalize"],
    ["1DC8A", "num_to_byte"],
    ["279B6", "num_to_str"],
    ["1DCE4", "num_cpy"],
    ["1D902", "num_cmp"],
    ["16844", "num_sin"],
    ["1684E", "num_cos"],
    ["168E4", "num_tan"],
    ["2AD4C", "display_menu"],
    ["093D2", "draw_byte"],
    ["2045c", "pop xr4,pop xr12"],
];

gadgetList.push(["17b34", "pop xr0"]);
gadgetList.push(["1622e", "pop xr0"]);

for (let g of gadgetList) {
    addEntry(g[0], normalizeName(g[1]));
}
const specialNoPopGadgets = new Set([
    "sp=er14,pop er14,rt",
    "sp=er14,pop qr8",
    "sp=er14,pop qr8,pop qr0",
    "sp=er14,pop er14",
    "sp=er6,pop er8",
    "sp=er14,pop xr12",
    "sp=er14,pop qr8,pop er6",
]);
function getPopSizes(gadgetName) {
    if (!gadgetName) return null;
    let pops = [];
    let regex = /pop\s+([^,]+(?:,[^,]+)*)/gi;
    let match;
    while ((match = regex.exec(gadgetName)) !== null) {
        let popPart = match[1];
        let tokens = popPart.split(",");
        for (let token of tokens) {
            token = token.trim();
            if (
                token === "" ||
                token === "rt" ||
                token === "pop" ||
                token === "sp"
            )
                continue;
            if (token === "ea") pops.push(2);
            else if (token === "pc") pops.push(2);
            else if (token === "psw") pops.push(1);
            else if (token.startsWith("qr")) {
                for (let i = 0; i < 4; i++) pops.push(2);
            } else if (token.startsWith("xr")) {
                for (let i = 0; i < 2; i++) pops.push(2);
            } else if (token.startsWith("er")) pops.push(2);
            else if (token.startsWith("r")) pops.push(1);
        }
    }
    return pops.length ? pops : null;
}
const MIN_VALID_CALL_ADDR = 0x8000;

function normalizeAddress(addr) {
    if (addr === 0x09c21) return 0x09c20;
    if (addr === 0x0947e) return 0x0947c;
    if (addr & 1 && addrToName.has(addr - 1)) return addr - 1;
    return addr;
}

function hexToBytes(hexStr) {
    let clean = hexStr.replace(/\s+/g, "");
    if (!clean) return [];
    if (clean.length % 2) clean = clean.slice(0, -1);
    let bytes = [];
    for (let i = 0; i < clean.length; i += 2)
        bytes.push(parseInt(clean.substr(i, 2), 16));
    return bytes;
}

function parseToItems(bytes, startAddr) {
    let items = [];
    let offset = 0;
    let i = 0;
    while (i < bytes.length) {
        let ramAddr = startAddr + offset;
        if (i + 3 < bytes.length) {
            let zz = bytes[i],
                yy = bytes[i + 1],
                third = bytes[i + 2],
                fourth = bytes[i + 3];
            if (third >= 0x30 && third <= 0x39 && fourth === 0x30) {
                let X = third - 0x30;
                let rawAddr = (X << 16) | (yy << 8) | zz;
                if (rawAddr === 0x03030) {
                    let val = (bytes[i + 1] << 8) | bytes[i];
                    items.push({
                        type: "data",
                        hexBytes: [zz, yy],
                        value: val,
                        ramAddr: ramAddr,
                        rawMode: false,
                    });
                    i += 2;
                    offset += 2;
                    continue;
                }
                if (rawAddr < MIN_VALID_CALL_ADDR) {
                    let val1 = (yy << 8) | zz;
                    let val2 = (fourth << 8) | third;
                    items.push({
                        type: "data",
                        hexBytes: [zz, yy],
                        value: val1,
                        ramAddr: ramAddr,
                        rawMode: false,
                    });
                    offset += 2;
                    items.push({
                        type: "data",
                        hexBytes: [third, fourth],
                        value: val2,
                        ramAddr: startAddr + offset,
                        rawMode: false,
                    });
                    i += 4;
                    offset += 2;
                    continue;
                }
                let fixedAddr = normalizeAddress(rawAddr);
                let name = addrToName.get(fixedAddr);
                items.push({
                    type: "call",
                    hexBytes: [zz, yy, third, fourth],
                    addr: fixedAddr,
                    name: name || null,
                    ramAddr: ramAddr,
                    rawMode: false,
                });
                i += 4;
                offset += 4;
                if (name && !specialNoPopGadgets.has(name)) {
                    let popSizes = getPopSizes(name);
                    if (popSizes && popSizes.length > 0) {
                        let totalBytes = popSizes.reduce((a, b) => a + b, 0);
                        if (i + totalBytes <= bytes.length) {
                            for (let sz of popSizes) {
                                let dataBytes = bytes.slice(i, i + sz);
                                let value;
                                if (sz === 1) value = dataBytes[0];
                                else if (sz === 2)
                                    value = (dataBytes[1] << 8) | dataBytes[0];
                                else {
                                    value = 0;
                                    for (let j = 0; j < sz; j++)
                                        value |= dataBytes[j] << (8 * j);
                                }
                                items.push({
                                    type: "data",
                                    hexBytes: dataBytes,
                                    value: value,
                                    ramAddr: startAddr + offset,
                                    rawMode: false,
                                });
                                i += sz;
                                offset += sz;
                            }
                            continue;
                        }
                    }
                }
                continue;
            }
        }
        if (i + 1 < bytes.length) {
            let val = (bytes[i + 1] << 8) | bytes[i];
            items.push({
                type: "data",
                hexBytes: [bytes[i], bytes[i + 1]],
                value: val,
                ramAddr: ramAddr,
                rawMode: false,
            });
            i += 2;
            offset += 2;
        } else {
            items.push({
                type: "data",
                hexBytes: [bytes[i]],
                value: bytes[i],
                ramAddr: ramAddr,
                rawMode: false,
            });
            i++;
            offset++;
        }
    }
    return items;
}
function renderDetailedHtml(items, onToggle) {
    const container = document.createElement("div");
    for (let idx = 0; idx < items.length; idx++) {
        const it = items[idx];
        const lineDiv = document.createElement("div");
        lineDiv.className = "gadget-line";
        let hexText = it.hexBytes
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" ");
        const badge = document.createElement("span");
        badge.className = "hex-badge";
        badge.textContent = hexText;
        lineDiv.appendChild(badge);
        const arrowSpan = document.createElement("span");
        arrowSpan.className = "arrow";
        arrowSpan.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        lineDiv.appendChild(arrowSpan);
        if (it.type === "call") {
            const addrStr = it.addr.toString(16).toUpperCase().padStart(5, "0");
            if (it.rawMode) {
                const rawHexValue =
                    (it.hexBytes[3] << 24) |
                    (it.hexBytes[2] << 16) |
                    (it.hexBytes[1] << 8) |
                    it.hexBytes[0];
                const dataSpan = document.createElement("span");
                dataSpan.className = "data-name";
                dataSpan.textContent = `→ 0x${rawHexValue.toString(16).toUpperCase().padStart(8, "0")}`;
                lineDiv.appendChild(dataSpan);
            } else {
                const addrSpan = document.createElement("span");
                addrSpan.className = "addr";
                addrSpan.textContent = addrStr;
                lineDiv.appendChild(addrSpan);
                const nameSpan = document.createElement("span");
                if (it.name) {
                    nameSpan.className = "gadget-name";
                    nameSpan.textContent = `→ ${it.name}`;
                } else {
                    nameSpan.className = "gadget-name-unknown";
                    nameSpan.textContent = `→ call ${addrStr}`;
                }
                lineDiv.appendChild(nameSpan);
            }
            const toggleBtn = document.createElement("button");
            toggleBtn.innerHTML = '<i class="fa-solid fa-rotate"></i>';
            toggleBtn.className = "toggle-call-btn";
            toggleBtn.title = "Toggle raw hex";
            toggleBtn.onclick = (e) => {
                e.stopPropagation();
                onToggle(idx);
            };
            lineDiv.appendChild(toggleBtn);
        } else {
            let displayValue =
                it.hexBytes.length === 2
                    ? `0x${it.value.toString(16).toUpperCase().padStart(4, "0")}`
                    : `0x${it.value.toString(16).toUpperCase().padStart(2, "0")}`;
            const dataSpan = document.createElement("span");
            dataSpan.className = "data-name";
            dataSpan.textContent = `→ ${displayValue}`;
            lineDiv.appendChild(dataSpan);
        }
        const locSpan = document.createElement("span");
        locSpan.className = "location";
        locSpan.textContent = it.ramAddr
            .toString(16)
            .toLowerCase()
            .padStart(5, "0");
        lineDiv.appendChild(locSpan);
        container.appendChild(lineDiv);
    }
    return container;
}

function formatSimple(items) {
    let lines = [];
    for (let it of items) {
        if (it.type === "call") {
            if (it.rawMode) {
                const rawHexValue =
                    (it.hexBytes[3] << 24) |
                    (it.hexBytes[2] << 16) |
                    (it.hexBytes[1] << 8) |
                    it.hexBytes[0];
                lines.push(
                    `0x${rawHexValue.toString(16).toUpperCase().padStart(8, "0")}`,
                );
            } else {
                lines.push(
                    it.name ||
                        `call ${it.addr.toString(16).toUpperCase().padStart(5, "0")}`,
                );
            }
        } else {
            let val =
                it.hexBytes.length === 2
                    ? `0x${it.value.toString(16).toUpperCase().padStart(4, "0")}`
                    : `0x${it.value.toString(16).toUpperCase().padStart(2, "0")}`;
            lines.push(val);
        }
    }
    return lines.join("\n");
}
let currentMode = "detail";
let currentItems = [];
let currentByteCount = 0;

const hexInput = document.getElementById("hexInput");
const outputDiv = document.getElementById("outputList");
const statusSpan = document.getElementById("statusMsg");
const statsSpan = document.getElementById("statsMsg");
const decompileBtn = document.getElementById("decompileBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const pasteBtn = document.getElementById("pasteBtn");
const startAddrInput = document.getElementById("startAddrInput");
const modeDetail = document.getElementById("modeDetailBtn");
const modeSimple = document.getElementById("modeSimpleBtn");

function updateStats(bytes, items) {
    statsSpan.textContent = `byte: ${bytes} | items: ${items}`;
}

function setStatus(text, isError = false) {
    statusSpan.innerHTML = text;
    statusSpan.style.color = isError ? "#f28b82" : "#a0b8d0";
    setTimeout(() => {
        if (statusSpan.innerHTML === text && !isError)
            statusSpan.style.color = "#a0b8d0";
    }, 2000);
}

function refreshOutput() {
    if (!currentItems.length) {
        outputDiv.innerHTML =
            '<div style="color:#b0c0d8; padding:12px;">// No data. Enter hex and press DECOMPILE.</div>';
        updateStats(0, 0);
        return;
    }
    if (currentMode === "detail") {
        outputDiv.innerHTML = "";
        outputDiv.appendChild(
            renderDetailedHtml(currentItems, (idx) => {
                if (currentItems[idx] && currentItems[idx].type === "call") {
                    currentItems[idx].rawMode = !currentItems[idx].rawMode;
                    refreshOutput();
                    setStatus(
                        `Toggled raw hex for call at ${currentItems[idx].addr.toString(16).toUpperCase()}`,
                    );
                }
            }),
        );
    } else {
        outputDiv.innerText = formatSimple(currentItems);
    }
    updateStats(currentByteCount, currentItems.length);
}

function decompileAndSet() {
    let rawHex = hexInput.value.trim();
    if (!rawHex) {
        currentItems = [];
        currentByteCount = 0;
        outputDiv.innerHTML =
            '<div style="color:#b0c0d8; padding:12px;">// Please enter hex program</div>';
        updateStats(0, 0);
        setStatus(
            `<i class='fa-solid fa-triangle-exclamation'></i> No hex input`,
            true,
        );
        return;
    }
    let startAddr = parseInt(startAddrInput.value.trim().toLowerCase(), 16);
    if (isNaN(startAddr)) startAddr = 0xd730;
    setStatus(`<i class='fa-solid fa-hourglass-half'></i> Decompiling...`);
    setTimeout(() => {
        try {
            let bytes = hexToBytes(rawHex);
            if (!bytes.length) throw new Error("Invalid hex bytes");
            currentByteCount = bytes.length;
            currentItems = parseToItems(bytes, startAddr);
            refreshOutput();
            setStatus(
                `<i class='fa-solid fa-check"></i> Decompiled successfully`,
            );
        } catch (e) {
            currentItems = [];
            currentByteCount = 0;
            outputDiv.innerHTML = `<div style="color:#f28b82; padding:12px;'>// Error: ${e.message}</div>`;
            updateStats(0, 0);
            setStatus(
                `<i class='fa-solid fa-xmark'></i> Decompile error`,
                true,
            );
        }
    }, 10);
}

decompileBtn.onclick = decompileAndSet;
clearBtn.onclick = () => {
    hexInput.value = "";
    currentItems = [];
    currentByteCount = 0;
    outputDiv.innerHTML =
        '<div style="color:#b0c0d8; padding:12px;">// Press DECOMPILE</div>';
    updateStats(0, 0);
    setStatus(`<i class='fa-solid fa-broom'></i> Cleared`);
};
copyBtn.onclick = () => {
    let txt =
        currentMode === "detail"
            ? formatSimple(currentItems)
            : outputDiv.innerText;
    if (
        !txt ||
        txt.includes("// Press DECOMPILE") ||
        txt.includes("// No data")
    ) {
        setStatus(
            `<i class='fa-solid fa-triangle-exclamation'></i> Nothing to copy`,
            true,
        );
        return;
    }
    navigator.clipboard
        .writeText(txt)
        .then(() =>
            setStatus(`<i class='fa-solid fa-clipboard'></i> Copied output`),
        )
        .catch(() =>
            setStatus(`<i class='fa-solid fa-xmark'></i> Copy failed`, true),
        );
};
pasteBtn.onclick = async () => {
    try {
        let text = await navigator.clipboard.readText();
        hexInput.value = text;
        setStatus(
            `<i class='fa-solid fa-thumbtack'></i> Pasted from clipboard`,
        );
    } catch {
        setStatus(
            `<i class='fa-solid fa-triangle-exclamation'></i> Cannot read clipboard`,
            true,
        );
    }
};

function setActiveMode(mode) {
    currentMode = mode;
    if (mode === "detail") {
        modeDetail.classList.add("active");
        modeSimple.classList.remove("active");
    } else {
        modeSimple.classList.add("active");
        modeDetail.classList.remove("active");
    }
    refreshOutput();
    setStatus(
        `<i class='fa-solid fa-repeat'></i> Switched to ${mode === "detail" ? "Detailed" : "Simple"} mode`,
    );
}
modeDetail.onclick = () => setActiveMode("detail");
modeSimple.onclick = () => setActiveMode("simple");

hexInput.value = "";
currentItems = [];
currentByteCount = 0;
outputDiv.innerHTML =
    '<div style="color:#b0c0d8; padding:12px;">// Press DECOMPILE</div>';
updateStats(0, 0);
setStatus(`<i class='fa-solid fa-check'></i> Ready`);
