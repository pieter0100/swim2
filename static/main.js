console.log("test");

// Zakładamy, że API zwraca teraz obiekt: {"temperature": 25.5}
async function getData() {
    let response = await fetch('/api/temperature'); // Załóżmy, że masz takie API

    console.log(response);
    
    if (!response.ok) {
        throw new Error(`Błąd HTTP! Status: ${response.status}`);
    }
    let data = await response.json();
    return data;
}
// 1. Znajdź element canvas
const gaugeElement = document.getElementById('gauge-thermometer');

// 2. Stwórz nowy wskaźnik
const myGauge = new RadialGauge({
    renderTo: gaugeElement, // Gdzie rysować
    width: 200,
    height: 200,
    units: "°C", // Jednostka
    minValue: -50,
    maxValue: 50,
    majorTicks: [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50],
    minorTicks: 5,
    strokeTicks: true,
    highlights: [ // Kolorowe strefy
        { from: -50, to: 0, color: 'rgba(0,0, 255, .3)' },
        { from: 0, to: 30, color: 'rgba(255, 255, 0, .3)' },
        { from: 30, to: 50, color: 'rgba(255, 0, 0, .3)' }
    ],
    // Animacja przy zmianie wartości
    animationDuration: 500, 
    animationRule: "linear"
}).draw(); // Narysuj wskaźnik

// 3. Aktualizuj wskaźnik co sekundę
setInterval(async () => { 
    try {
        // Użyjmy na razie fałszywych danych do testu
        // let fakeTemperature = (Math.random() * 100) - 50; // losowo od -50 do 50
        
        // Gdy będziesz miał API:
        let data = await getData();
        myGauge.value = data.temperature;
        
        // Aktualizujemy wartość wskaźnika
        // myGauge.value = fakeTemperature.toFixed(2); // .toFixed(2) zaokrągla

    } catch (error) {
        console.error("Nie udało się pobrać danych:", error);
    }
}, 1000); // Zmieniam na 1000ms, żeby lepiej widzieć animację


// setInterval(() => {
//     getData()
//         .then(data => {
//             console.log(data.message); 
//             document.getElementById("test").innerText = data.message
//         })
//         .catch(error => {
//             console.error("Nie udało się pobrać danych:", error);
//         });

    
// }, 1000);
