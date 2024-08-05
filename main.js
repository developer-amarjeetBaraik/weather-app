import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import countries from '@geoapify/geocoder-autocomplete/dist/countries.json' assert { type: 'json' };


const app = express()
const port = 3000

app.use(bodyParser.json())
const pwd = "D:\\HTML, CSS and JavaScript Project\\Weather app"
app.use(express.static(path.join(pwd, "public")))

app.get('/', (req, res) => {
  res.sendFile(path.join(pwd, 'public'))
})

app.post('/update-input',(req, res)=>{
  const { inputValue } = req.body;
  res.send({data: inputValue})
  console.log('Received input value from client:',inputValue)
})


// Proxy endpoint for GeocoderAutocomplete API
app.get('/geocode', async (req, res) => {
  const inputValue = req.query.q;
  console.log(inputValue)
  // const apiKey = 02057f56249c42919639e260bb61f243
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=02057f56249c42919639e260bb61f243`;
  
  try {
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
      console.log(data);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data from GeocoderAutocomplete API' });
  }
});

app.post('/log-lat-value', async (req, res)=>{
  const { lon, lat } = req.body;
  console.log("get from the clint ", lon, lat)
  
  // const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FSingapore`

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,visibility,wind_speed_80m,temperature_80m&forecast_days=1`
  
  try {
      const response = await fetch(url);
      const data = await response.json();
      // data.current.time = 0
      res.json(data);
      console.log(data);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data from GeocoderAutocomplete API' });
  }

  // res.send({data: inputValue})
  // console.log('Received input value from client:',inputValue)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

