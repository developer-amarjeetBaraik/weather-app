let inputValue = ""
document.getElementById("search").addEventListener("input", async () => {
    inputValue = document.getElementById("search").value

    // Send the input value to the server
    fetch('/update-input', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({ inputValue: inputValue })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

})
document.getElementById("search").addEventListener("input", async () => {
    document.getElementById("feched-time").innerHTML = "_ _"
    document.getElementById("Temprature").innerText = "_ _"
    document.getElementById("Humidity").innerText = "_ _"
    document.getElementById("Wind-Speed").innerText = "_ _"
    document.getElementById("Wind-Direction").innerText = "_ _"
    document.getElementById("Rain").innerText = "_ _"
    document.getElementById("Pricipitation").innerText = "_ _"

    if (inputValue.length > 3) {
        try {
            const response = await fetch(`/geocode?q=${inputValue}`);
            const data = await response.json();

            // Process suggestions here
            console.log('Suggestions:', data.features.forEach((e, index) => {
                e.properties.formatted
            })
            );



            const suggestionsList = document.getElementById("autocomplete")
            let responseArr = []

            // function getOriginalData(e){
            //     console.log("this is function ",e)
            // }

            data.features.forEach((e, index) => {

                // suggestions.innerHTML = e.properties.formatted
                responseArr.push(e.properties.formatted)
            })
            // getOriginalData()

            const listElement = document.querySelectorAll("#list");
            if (listElement) {
                console.log("list is ", listElement)
                listElement.forEach((item) => {
                    item.style.display = "none";
                    console.log("list none");
                })
            }

            responseArr.forEach((e, index) => {
                const suggestions = document.createElement("li")
                suggestions.setAttribute("id", "list")
                suggestionsList.append(suggestions)
                suggestions.innerHTML = e
                suggestions.setAttribute("index", index)
            })

            console.log(responseArr)
            const listItem = document.querySelectorAll("#list")
            if (listItem) {
                console.log("#list is avalibale")
                listItem.forEach((item) => {
                    item.addEventListener("click", () => {
                        document.getElementById("search").value = item.innerHTML
                        document.getElementById("address-field").innerHTML = item.innerHTML
                        let listNumber = item.getAttribute("index")
                        let lon = data.features[listNumber].geometry.coordinates[0]
                        let lat = data.features[listNumber].geometry.coordinates[1]
                        listItem.forEach((item) => { item.style.display = "none"; })

                        // Send the longitude and latituse value to the server
                        fetch('/log-lat-value', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/JSON'
                            },
                            body: JSON.stringify({ lon: lon, lat: lat })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Server response:', data);
                                let temperature = data.current.temperature_2m
                                let humidity = data.current.relative_humidity_2m
                                let windSpeed = data.current.wind_speed_10m
                                let windDirection = data.current.wind_direction_10m
                                let rain = data.current.rain
                                let precipitation = data.current.precipitation

                                document.getElementById("Temprature").innerText = temperature
                                document.getElementById("Humidity").innerText = humidity
                                document.getElementById("Wind-Speed").innerText = windSpeed
                                document.getElementById("Wind-Direction").innerText = windDirection
                                document.getElementById("Rain").innerText = rain
                                document.getElementById("Pricipitation").innerText = precipitation

                                const d = new Date();

                                // Extract date components
                                const year = d.getFullYear();
                                const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                                const day = d.getDate().toString().padStart(2, '0');

                                // Extract time components
                                let hours = d.getHours();
                                const minutes = d.getMinutes().toString().padStart(2, '0');
                                const seconds = d.getSeconds().toString().padStart(2, '0');

                                // Determine AM or PM period
                                const period = hours >= 12 ? 'PM' : 'AM';

                                // Convert hours from 24-hour to 12-hour format
                                hours = hours % 12;
                                hours = hours ? hours : 12; // The hour '0' should be '12'

                                // Ensure hours are two digits
                                hours = hours.toString().padStart(2, '0');

                                // Format the date and time
                                const formattedDate = `${day}-${month}-${year}`;
                                const formattedTime = `${hours}:${minutes} ${period}`;

                                document.getElementById("feched-time").innerHTML = `${hours}:${minutes} ${period}  ${day}-${month}-${year}`

                                console.log("Date:", formattedDate); // Date: 2024-07-01
                                console.log("Time:", formattedTime); // Time: 06:11 AM or PM based on current time


                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    })

                })
            }


        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }
})
