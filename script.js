window.onload = main;

const epic_root = '/epic_root';
const test_src = '/epic_root/P11/P11_105/frame_0000000001.jpg';
const HEIGHT = 256; 
const WIDTH = 456;

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

function main() {
    // Papa.parse()
    fetch('EPIC_100_train.json')
        .then(resp => resp.json())
        .then(df => {
            console.log(df);
        })
}