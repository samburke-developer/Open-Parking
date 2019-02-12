const request = require("request-promise");

let findParkLocation = async (location, radius) =>
{
	let locations = []
	options = {"$$app_token" : process.env.APP_TOKEN}
	await request.get(`${process.env.BASE_URL}?status=Unoccupied&$where=within_circle(location, ${location.lat}, ${location.lng}, ${radius})`, options)
	.then( (response) =>
	{
		response = JSON.parse(response);
		console.log(response.length);
		locations = response;
	}
	).catch(error => 
	{
		console.log(error)
	})
	return locations;
}

//Recursivly increases radius until atleast 1 parking location is found
let getParkLocation = async (location, radius) =>
{
	let locations = await findParkLocation(location, radius)
	if(locations.length == 0)
	{
		return await getParkLocation(location, radius*2);
	}
	else return locations;
}

exports.getFreeSpots = async(req,res) => 
{
	// let location = {lat: -37.813423, lng: 144.973799};
	let location = {lat: req.body.lat, lng: req.body.lng};
	let locations = await getParkLocation(location, 100)
	res.send(locations)
}

exports.renderHome = async(req,res) => 
{
	res.render('index', {title: 'Open Parking'})
}
