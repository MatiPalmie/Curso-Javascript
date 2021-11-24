$(document).ready(() => {
    renderButtons(aviones);
})

//Constructores
class plane {
    constructor(id, avion, velocidad, consumo, img) {
        this.id = id;
        this.avion = avion;
        this.velocidad = parseInt(velocidad);
        this.consumo = parseInt(consumo);
        this.img = img;
    }
}
//Variables
let aviones;
let distancia;
let consumo;
let tiempoVuelo;
let combustible;
let resultado;
let viento;
let result;

//Jquery
//Se extraen de un archivo JSON los datos de los aviones predeterminados
$.ajax({
    url: 'js/aviones.json',
    success: function (data, textStatus, xhr) {
        console.log(data);
        aviones = data;
    },
    error: function (xhr, textStatus, error) {
        console.log(error);
    }
});
//Boton para personalizar el avión
$(".custom").append('<button id="custom" class="btns">Personalizar</button>')
//Botón para último cálculo
$("body").append('<button id="result" class="btns">Último cálculo</button>')

//Selectores

let planeSelect = document.querySelectorAll('.aviones,.custom');
let btnResult = document.querySelector('#result');

//Funciones
//Renderizar aviones predeterminados
function renderButtons() {
    aviones.forEach(avion => {
        $(".aviones").prepend(`<button id="${avion.id}" class="btns">${avion.avion}</button>`)
    });
}
//Agrega los botones de los aviones personalizados
addButton = (aviones) => {
    $(".aviones").prepend(`<button id="${aviones[aviones.length-1].id}" class="btns">${aviones[aviones.length-1].avion}</button>`)
}

function cancelFade(btnCancel, card) {
    $(btnCancel).click(function () {
        $(card).animate({
            opacity: 0,
        }, 1000, function () {
            $(card).remove()
            resultado = undefined
            $('button').fadeIn(1000);
        });
    });
}
//Funcion de calculo
function selected(e) {
    e.preventDefault();
    const selected = e.target.id;
    const card = document.createElement("div")
    card.classList.add("card")
    //Carga el Avion personalizado si el personalizar es apretado o busca los datos en el array correspondiente al botón pulsado
    if (selected === "custom") {
        card.innerHTML = `<h2>Ingrese los datos</h2>
                        <h3>Ingrese un nombre</h3>
                        <input type="text" id="nombre">
                        <h3>Velocidad (km/h)</h3>
                        <input type="number" id="vel">
                        <h3>Consumo por hora(lts)</h3>
                        <input type="number" id="comb">
                        <div class="cardButton">
                            <button id="submitCustom" class="btns">Continuar</button>
                            <button id="cancelCustom" class="btns">Cancelar</button>
                        </div>`
        document.body.appendChild(card);
    } else {
        resultado = aviones.find(pln => pln.id === selected);
        card.innerHTML = `<h3>${resultado.avion}</h3>
                        <h3>Velocidad ${resultado.velocidad} Km/h</h3>
                        <h3>Consumo ${resultado.consumo} Lts/h</h3>
                        <img src="${resultado.img}" alt ="${resultado.avion}"></img>
                        <div class="cardButton">
                        <button id="submitCustom" class="btns">Continuar</button>
                        <button id="cancelCustom" class="btns">Cancelar</button>
                        </div>`
        document.body.appendChild(card);
    }
    const btnCancel = document.querySelector('#cancelCustom');
    const btnContinue = document.querySelector('#submitCustom');
    cancelFade(btnCancel, card);
    //Carga el avion personalizado en el array y renderiza el boton correspondiente o, si se selecciono anteriormente un avion, nos solicita ingresar la distancia
    btnContinue.onclick = () => {
        if (resultado === undefined) {
            aviones.push(new plane(nombre.value, nombre.value, vel.value, comb.value, "img/plane.png"));
            document.body.removeChild(card);
            addButton(aviones);
            $('button').hide();
            $('button').fadeIn(1000)
        } else {
            card.innerHTML = `<h2>Distancia(Km)</h2>
                            <input type="number" id="distance">
                            <button id="submitCustom" class="btns">Continuar</button>
                            <button id="cancelCustom" class="btns">Cancelar</button>`
            const btnCancel = document.querySelector('#cancelCustom');
            const btnContinue = document.querySelector('#submitCustom');
            cancelFade(btnCancel, card);
            //Realiza el calculo y lo renderiza. También lo guarda en el localStorage para poder utilizarlo con la funcion de último cálculo
            btnContinue.onclick = () => {
                tiempoVuelo = tresRegla(distance.value, 60, resultado.velocidad).toFixed(2);
                combustible = tresRegla(tiempoVuelo, resultado.consumo, 60).toFixed(2);
                result = [tiempoVuelo, combustible, `${resultado.avion}`]
                localStorage.setItem('result', JSON.stringify(result));
                card.innerHTML = `<h2>${resultado.avion}</h2>
                            <p>El tiempo de vuelo será de <strong>${tiempoVuelo}</strong> minutos</p>
                            <p>El combustible utilizado sera de <strong>${combustible}</strong> litros</p>
                            <button id="cancelCustom" class="btns">Finalizar</button>`;
                const btnCancel = document.querySelector('#cancelCustom');
                cancelFade(btnCancel, card);
            }
        }
    }
}

tresRegla = (n1, n2, n3) => {
    return (n1 * n2) / n3;
}
//Renderizar Clima
function meteo(clima, wind) {
    $('.clima').append(`<h2>${clima.name}</h2>
                        <img src="http://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png">
                        <ul class="list">
                            <li>Temperatura ${clima.main.temp}°C</li>
                            <li>Viento ${wind} Km/h</li>
                        </ul>`);

}

//Función para renderizar el último cálculo que fue realizado

btnResult.onclick = () => {
    $(btnResult).fadeOut(900)
    result = JSON.parse(localStorage.getItem('result'));
    $('body').append(`<div class="result">
                    <h3>Último cálculo</h3>
                    <ul>
                    <li><strong>Avion:</strong>  ${result[2]}</li>
                    <li><strong>Tiempo de Vuelo:</strong>  ${result[0]} Minutos</li>
                    <li><strong>Combustible:</strong>  ${result[1]} Litros</li>
                    </ul>
                    <button id="cancelResult" class="btns">Finalizar</button>
                    </div>`)
    const btnCancel = document.querySelector('#cancelResult');
    cancelFade(btnCancel, '.result');
}

//EventHandler
$(planeSelect).on('click', selected);

//API del Clima
$.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather?lat=-38.0033&lon=-57.5528&units=metric&lang=sp&appid=324b76a64f05be8671a2689b50474b6b',
    dataType: 'json',
    success: function (data) {
        console.log(data);
        viento = data.wind.speed;
        let wind = tresRegla(viento, 1, 0.2778);
        wind = wind.toFixed(2);
        meteo(data, wind);
    },
    error: function (xhr, status, error) {
        console.log(error);
    }
})