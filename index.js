const fetch = require('node-fetch');
const fs = require('fs');
const notifier = require('node-notifier');

let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

let today = date+"-"+month+"-"+year;

let url = "https://www.cowin.gov.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=307&date="+today;

let settings = { method: "Get" };
var age_limit = 18;
var counter =0;
var data =[];

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        json["centers"].forEach(findCenter);
		saveAsFile();
    });
	
function findCenter(center,index){
	console.log("checking session for center id:"+center["center_id"]);
	center["sessions"].forEach(findSession);
	if(counter > 0){
			data.push(center);
	}
	counter=0;
}

function findSession(session,index){
	if(session["available_capacity"] > 0){
		if(session["min_age_limit"]>=age_limit){
			counter+=1;
			console.log("Found session "+counter);
		}
	}
	if(counter == 0){
		console.log("Found no sessions for the current center");
	}

}

function saveAsFile(){
	fs.writeFile("##/vaccinate.txt", JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
	notifier.notify({
  title: 'Found '+counter+" centers for vaccination!",
  message: 'View the file vaccinate.txt on desktop',
  sound:true,
  wait:true
});
}); 

}