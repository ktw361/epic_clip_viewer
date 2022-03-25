window.onload = load_main;

const epic_root = '/epic_root';
const test_src = '/epic_root/P11/P11_105/frame_0000000001.jpg';
const HEIGHT = 256; 
const WIDTH = 456;

const emap = new Map(); // map from ind to entry element
let prev_hl_ind = null;  // hightlight index

let gif = new GIF({
    worker: 4,
    quality: 30, // Higher is better
});


// convert int to 'frame_xxxx'
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

// Returns a glob object before .on()
function set_gif(pid, vid, st, ed, step) {
    gif.frames.length = 0;
    for (let i = st; i <= ed; i += step ) {
        const frame_name = 'frame_' + pad(i.toString(), 10) + '.jpg';
        const filename = [epic_root, pid, vid, frame_name].join('/');
        const img = document.createElement("img");
        img.width = WIDTH;
        img.height = HEIGHT;
        img.src = filename;
        gif.addFrame(img, {delay: 200});
    }
}

function createElementText(tag, text, func=e=>e) {
    let elem = document.createElement(tag);
    elem.textContent = text;
    return func(elem);
}
function createElementWith(tag, xs, func=e=>e) {
    let elem = document.createElement(tag);
    for (const x of xs) {
        elem.appendChild(x);
    }
    return func(elem);
}

function process_key(e) {
    const key = e.key;
    if (key == 40 || key == 'j') {   // hl DOWN
        if (prev_hl_ind != null && prev_hl_ind < emap.size-1) {
            emap.get(prev_hl_ind+1).scrollTo(1000, 100);
            change_highlight(prev_hl_ind+1);
            // const tab = document.getElementById('annotTable');
            // tab.scrollTop = tab.scrollTop + e.height;
            // tab.addEventListener("scroll", e => {
            //     console.log(tab.scrollTop);
            // });
        }
    } else if (key == 38 || key == 'k') { // hl UP
        if (prev_hl_ind != null && prev_hl_ind > 0) {
            change_highlight(prev_hl_ind-1);
        }
    }
}

function change_highlight(hl_ind) {
    if (prev_hl_ind == null) {
        emap.get(hl_ind).style.backgroundColor = "cyan";
        prev_hl_ind = hl_ind;
        return;
    }
    render_gif(hl_ind);
    if (hl_ind == prev_hl_ind) {
        emap.get(hl_ind).style.backgroundColor = "gray";
        prev_hl_ind = null;
        return;
    } else {
        emap.get(prev_hl_ind).style.backgroundColor = "gray";
        emap.get(hl_ind).style.backgroundColor = "cyan";
        prev_hl_ind = hl_ind;
        return;
    }
}

function render_gif(ind) {
    const entry = emap.get(ind).entry;
    gif.abort();
    set_gif(
        entry.participant_id, entry.video_id,
        entry.start_frame, entry.stop_frame, 1);
    const img = document.getElementById('img');
    gif.on('finished', function (blob) {
        img.src = URL.createObjectURL(blob);
    });
    gif.render();
}

function load_main() {
    const annot_body = document.getElementById('annot_body');

    // Create this json using `annot_df.to_json(..., orient='records')
    fetch('annot_df.json')
        .then(resp => resp.json())
        .then(df => {
            df.map( (e, ind) => {
                const entry = createElementWith('tr', [
                    createElementText('td', e.narration_id),
                    createElementText('td', e.participant_id),
                    createElementText('td', e.video_id),
                    createElementText('td', e.narration_timestamp),
                    createElementText('td', e.stop_timestamp),
                    createElementText('td', e.start_frame),
                    createElementText('td', e.stop_frame),
                    createElementText('td', e.narration),
                    createElementText('td', e.verb),
                    createElementText('td', e.verb_class),
                    createElementText('td', e.noun),
                    createElementText('td', e.noun_class),
                    createElementText('td', e.all_nouns),
                    createElementText('td', e.all_noun_classes),
                ], elem => {
                    elem.entry = e;
                    elem.ind = ind;
                    // e.addEventListener("mouseenter", () => {
                    //     if (!e.selected)
                    //         e.style.backgroundColor = "cyan";
                    // })
                    // e.addEventListener("mouseleave", () => {
                    //     if (!e.selected)
                    //         e.style.backgroundColor = "gray";
                    // })
                    elem.addEventListener("click", () => {
                        change_highlight(ind);
                    })
                    return elem;
                });
                annot_body.append(entry);
                emap.set(ind, entry);
                return entry;
            })
        })
        .catch(e => console.log(e));

    document.addEventListener('keypress', process_key);

    /**
     * Add Gif
     */
    // let gif = generate_gif('P11', 'P11_105', 300, 520, 20)
    // const container = document.getElementById("container");
    // gif.on('finished', function (blob) {
    //     const display = document.createElement('img');
    //     display.src = URL.createObjectURL(blob);
    //     container.appendChild(display);
    //     // window.open(URL.createObjectURL(blob));
    // });
    // gif.render();
}