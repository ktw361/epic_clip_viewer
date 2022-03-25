window.onload = main;

const epic_root = '/epic_root';
const test_src = '/epic_root/P11/P11_105/frame_0000000001.jpg';
const HEIGHT = 256; 
const WIDTH = 456;

// convert int to 'frame_xxxx'
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

// Returns a glob object before .on()
function generate_gif(pid, vid, st, ed, step) {
    let gif = new GIF({
        worker: 4,
        quality: 10
    });

    let filename;
    let frame_name;
    for (let i = st; i <= ed; i += step ) {
        pid = 'P11';
        vid = 'P11_105';
        frame_name = 'frame_' + pad(i.toString(), 10) + '.jpg';
        filename = [epic_root, pid, vid, frame_name].join('/');
        let img = document.createElement("img");
        img.width = WIDTH;
        img.height = HEIGHT;
        img.src = filename;
        gif.addFrame(img);
    }
    return gif;
}

function main1() {
    let gif = generate_gif('P11', 'P11_105', 300, 520, 20)
    const container = document.getElementById("container");
    gif.on('finished', function (blob) {
        const display = document.createElement('img');
        display.src = URL.createObjectURL(blob);
        container.appendChild(display);
        // window.open(URL.createObjectURL(blob));
    });
    gif.render();
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

function main() {
    const annot_body = document.getElementById('annot_body');

    // Create this json using `annot_df.to_json(..., orient='records')
    fetch('annot_df.json')
        .then(resp => resp.json())
        .then(df => {
            df.map( e => {
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
                ])
                annot_body.append(entry);
            })
        })
        .catch(e => console.log(e));
}