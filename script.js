window.onload = load_main;

const epic_root = '/epic_root';
const test_src = '/epic_root/P11/P11_105/frame_0000000001.jpg';
const HEIGHT = 256; 
const WIDTH = 456;
const FRAME_WIDTH = 256;

const emap = new Map(); // map from ind to entry element
let prev_hl_ind = 0;  // hightlight index
const frames_arr = new Array();
let gif_step = 1;


let gif = new GIF({
    worker: 4,
    quality: 100, // Higher is faster
});

// Returns a glob object before .on()
function set_gif(pid, vid, st, ed, step) {
    gif.frames.splice(0, gif.frames.length); // length = 0;
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

function render_frames(ind, table_id, num_cols=5) {
    if (!document.getElementById("show_frames").checked) return;
    const entry = emap.get(ind).entry;
    const pid = entry.participant_id,
        vid = entry.video_id,
        st = entry.start_frame,
        ed = entry.stop_frame;
    const table = document.getElementById(table_id);
    table.textContent = "";
    let tr = null;
    for (let i = st; i <= ed; i ++ ) {
        const frame_name = 'frame_' + pad(i.toString(), 10) + '.jpg';
        const filename = [epic_root, pid, vid, frame_name].join('/');
        const img = document.createElement("img");
        img.src = filename;

        const tab_ind = i - st;
        if (tab_ind % num_cols == 0) {
            if (tab_ind > 0) table.appendChild(tr);
            tr = createElementWith('tr', []);
        }        
        tr.appendChild(
            createElementWith('td', [
                createElementText('label', `${i.toString()}`),
                createElementText('br'),
                img])
        )
        img.width = FRAME_WIDTH;
    }
    table.appendChild(tr)
}

function show_gif_check(elem) {
    if (elem.checked) {
        document.getElementById("gifContainer").hidden = false;
        render_gif(prev_hl_ind);
    } else {
        document.getElementById("gifContainer").hidden = true;
    }
}

function show_frames_check(elem) {
    if (elem.checked) {
        document.getElementById("frameContainer").hidden = false;
        render_frames(prev_hl_ind, "frameTable");
    } else {
        document.getElementById("frameContainer").hidden = true;
    }
}

function search_noun() {
    const NOUN_COL_IND = 10;
    const input = document.getElementById("noun_filter");
    const word = input.value.toUpperCase();
    const table = document.getElementById("annotTable");
    tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        const tds = tr[i].getElementsByTagName("td");
        let flag = true;
        const td = tds[NOUN_COL_IND];
        if (td.innerHTML.toUpperCase().indexOf(word)> -1) {
            flag = false;
        }
        if (flag) {
            tr[i].hidden = true;
        } else {
            tr[i].hidden = false;
        }
    }


}

function change_gif_step(step) {
    const StepMapping = {
        0: 1,
        25: 2,
        50: 5,
        75: 10,
        100: 20,
    };
    step = StepMapping[step];
    document.getElementById("gif_interval").textContent = `${step}`;
    gif_step = step;
    render_gif(prev_hl_ind);
}

function process_key(e) {
    const key = e.key;
    if (key == 40 || key == 'j') {   // hl DOWN
        if (prev_hl_ind != null && prev_hl_ind < emap.size-1) {
            emap.get(prev_hl_ind+1).scrollTo(1000, 100);
            highlight_and_display(prev_hl_ind+1);
        }
    } else if (key == 38 || key == 'k') { // hl UP
        if (prev_hl_ind != null && prev_hl_ind > 0) {
            highlight_and_display(prev_hl_ind-1);
        }
    }
}

function highlight_and_display(hl_ind) {
    emap.get(prev_hl_ind).style.backgroundColor = "gray";
    emap.get(hl_ind).style.backgroundColor = "cyan";
    prev_hl_ind = hl_ind;
    render_gif(hl_ind);
    render_frames(hl_ind, "frameTable");
}

function render_gif(ind) {
    if (!document.getElementById("show_gif").checked) return;
    const entry = emap.get(ind).entry;
    gif.abort();
    const main_gif = document.getElementById('main_gif');
    main_gif.height = HEIGHT;
    main_gif.src = "assets/Loading.jpg";
    set_gif(
        entry.participant_id, entry.video_id,
        entry.start_frame, entry.stop_frame, gif_step);
    gif.render();
}

function load_main() {

    gif.on('finished', function (blob) {
        main_gif.src = URL.createObjectURL(blob);
        console.log(`gif created: ${main_gif.src}`)
    });

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
                        highlight_and_display(ind);
                    })
                    return elem;
                });
                const annot_body = document.getElementById('annot_body');
                annot_body.append(entry);
                emap.set(ind, entry);
                return entry;
            })
        }).then( () => {
            // Initialize
            prev_hl_ind = 0;
            highlight_and_display(0);
        })
        .catch(e => console.log(e));

    document.addEventListener('keypress', process_key);

}