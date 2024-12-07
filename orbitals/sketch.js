let orbital
let orb
let background_image
let time = 0.05
let all_orbitals = ["n1_l0_m0", "n2_l0_m0", "n2_l1_m0", "n2_l1_m1", "n2_l1_m-1",
    "n3_l0_m0", "n3_l1_m0", "n3_l2_m0", "n3_l2_m2", "n3_l2_m-1", "n4_l2_m0", "n4_l2_m2",
    "n4_l3_m0", "n4_l3_m2", "n4_l3_m4", "n4_l3_m-1", "n4_l3_m-2", "n4_l3_m-3",
    "n5_l1_m0", "n5_l2_m0", "n5_l2_m2", "n5_l3_m0", "n5_l3_m1", "n5_l3_m2", "n5_l3_m3",
    "n5_l3_m-2", "n5_l4_m0", "n5_l4_m1", "n5_l4_m2", "n5_l4_m3", "n5_l4_m4",
    "n6_l3_m0", "n6_l3_m1", "n6_l3_m2", "n6_l3_m3", "n6_l4_m0", "n6_l4_m1"]
let selectedOrbital = "obj/h_orbita(" + all_orbitals[0] + ").obj"

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    //image(background_image, -width/2, -height/2)

    //background(200)
    // put setup code here
}

function preload() {
    fillSelectHTMLOption()
    background_image = loadImage("asset/synthwave-wallpaper-ls4wgkd97dugy7zu.jpg")
    orbital = loadModel(selectedOrbital, true)
    orb = loadModel("obj/hydrogen_withUV.obj", true)

}

function fillSelectHTMLOption() {
    let selector = document.getElementById("selector")
    for (let orbital of all_orbitals) {
        let opt = document.createElement('option');
        opt.value = orbital;
        opt.innerHTML = orbital;
        selector.appendChild(opt);
    }
}

function onSelect(selector) {
    let value = selector.value
    console.log(value)
    selectedOrbital = "obj/h_orbita(" + value + ").obj"
    orbital = loadModel(selectedOrbital, true)
}


function draw() {

    background(200)
    time += 0.05
    noStroke()
    fill(200, 20, 20)
    scale(3)
    //rotate(0.1 * PI)
    smooth()

    //rotateX(frameCount * 0.01)
    orbitControl()
    rotateZ(frameCount * 0.01)
    normalMaterial()
    model(orbital)
    // put drawing code here

}
