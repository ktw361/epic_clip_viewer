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

function main() {
    let gif = generate_gif('P11', 'P11_105', 300, 520, 20)
    const container = document.getElementById("container");
    gif.on('finished', function (blob) {
        const display = document.createElement('img');
        display.src = URL.createObjectURL(blob);
        container.appendChild(display);
        // container.appendChild(
        //     document.createElement
        // )
        // window.open(URL.createObjectURL(blob));
    });

    gif.render();

}

function main2() {
    var gif = new GIF({
        workers: 4,
        quality: 10
    });

    // add an image element
    let filename;
    let frame_name;
    let img = document.createElement("img");
    let pid = 'P11'; let vid = 'P11_105';
    let st = 300;
    let ed = 520;
    for (let i = st; i <= ed; i += 20 ) {
        pid = 'P11';
        vid = 'P11_105';
        frame_name = 'frame_' + pad(i.toString(), 10) + '.jpg';
        filename = [epic_root, pid, vid, frame_name].join('/');
        // img.src = filename;
        const imageElement = document.createElement('img');
        imageElement.width = WIDTH;
        imageElement.height = HEIGHT;
        imageElement.src = filename;
        console.log(filename);
        gif.addFrame(imageElement);
    }

    // gif.addFrame(imageElement);

    gif.on('finished', function (blob) {
        window.open(URL.createObjectURL(blob));
    });

    gif.render();

}
// function main() {
//     const container = document.getElementById("container");
//     let display = document.createElement('img');
//     // let gif = generate_gif('P11', 'P11_105', 100, 120);
//     let gif = new GIF({
//         worker: 4,
//         quality: 10
//     });

//     let filename;
//     let frame_name;
//     let img = document.createElement("img");
//     let pid = 'P11'; let vid = 'P11_105';
//     let st = 100;
//     let ed = 120;
//     for (let i = st; i <= ed; i++ ) {
//         pid = 'P11';
//         vid = 'P11_105';
//         frame_name = 'frame_' + pad(i.toString(), 10) + '.jpg';
//         filename = [epic_root, pid, vid, frame_name].join('/');
//         img.src = filename;
//         gif.addFrame(img);
//     }
//     // const img2 = document.createElement('img');
//     // img2.src = '/epic_root/P11/P11_105/frame_0000000001.jpg';
//     // gif.addFrame(img2);
//     // console.log(gif);

//     container.appendChild(display);
//     gif.on('finished', function (blob) {
//         console.log('1');
//         // display.src = URL.createObjectURL(blob);
//         window.open(URL.createObjectURL(blob));
//         console.log(blob);
//     });
//     // gif.render();
//     // // Papa.parse()
//     // fetch('test.txt')
//     //     .then(resp => resp.text())
//     //     .then(text => {
//     //         console.log(text);
//     //     })

//     // const img_show = document.createElement('img');
//     // container.appendChild(img_show);
//     // gif.addFrame(img);
//     // console.log(gif);
    
// }

function createImageElement(src) {
    const img = document.createElement("img");
    img.src = src;
    return img;
}


// var gif = new GIF({
//     workers: 2,
//     quality: 10
//   });
  
//   // add an image element
//   gif.addFrame(imageElement);
  
//   // or a canvas element
// //   gif.addFrame(canvasElement, {delay: 200});
  
//   // or copy the pixels from a canvas context
// //   gif.addFrame(ctx, {copy: true});
  
//   gif.on('finished', function(blob) {
//     window.open(URL.createObjectURL(blob));
//   });
  
//   gif.render();