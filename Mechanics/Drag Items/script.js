const fosforo = document.getElementById("fosforo")
const vela = document.getElementById("vela")

fosforo.addEventListener('dragstart', dragStart);
fosforo.addEventListener('dragend', dragEnd);


vela.addEventListener('dragenter', dragEnter);
vela.addEventListener('dragover', (e) => e.preventDefault());


function dragStart() {
     console.log("Start")
    setTimeout(() => (fosforo.className = "invisible"), 0)
}

function dragEnd() {
    fosforo.className = 'tool'
    console.log("end")
}

function dragEnter(e) {
    e.preventDefault();
   
}

vela.addEventListener('drop', (e) => {
    e.preventDefault();
    console.log("Fósforo caiu na vela!");
    
    vela.src = '/Assets/img/vela_troca.png';
});