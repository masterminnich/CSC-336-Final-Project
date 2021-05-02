(function() {
  "use strict";

  let stepNum = 1; 

  window.addEventListener("load", initialize);
  document.addEventListener("DOMContentLoaded", hideSteps);
  window.addEventListener('resize', windowResize);

  function initialize() {
  	id("startSearchBtn").addEventListener("click", startSearch);
  	id("nextBtn").addEventListener("click", nextBtnClick);
  	id("backBtn").addEventListener("click", backBtnClick);
  	
  	/* Initialize SAT/ACT disable/enable checkboxes */
  	id("satMathBox").addEventListener("click", satM);
  	id("satEnglishBox").addEventListener("click", satE);
  	id("actMathBox").addEventListener("click", actM);
  	id("actEnglishBox").addEventListener("click", actE);
  	/* Initialize SAT/ACT slider inputs */
  	id("satMathSlider").addEventListener("click", updateSatM);
  	id("satEnglishSlider").addEventListener("click", updateSatE);
  	id("actMathSlider").addEventListener("click", updateActM);
  	id("actEnglishSlider").addEventListener("click", updateActE);
  	
  	/* Resize SimpleMaps Iframe */
  	windowResize();
  }
  
  
  	/* The following functions display their corresponding SAT/ACT scores when their sliders are clicked */
  	function updateSatM(){
  		id("satMathScore").innerText = id("satMathSlider").value;
  	}
  	function updateSatE(){
  		id("satEnglishScore").innerText = id("satEnglishSlider").value;
  	}
  	function updateActM(){
  		id("actMathScore").innerText = id("actMathSlider").value;
  	}
  	function updateActE(){
  		id("actEnglishScore").innerText = id("actEnglishSlider").value;
  	}
  	
  	
  	/* The following functions disable/re-enable the SAT/ACT sliders when the checkbox is clicked. */
	function satM(){
		if(id("satMathBox").checked == false){
			id("satMathSlider").disabled = false;
		} else { id("satMathSlider").disabled = true; }
	}
	function satE(){
		if(id("satEnglishBox").checked == false){
			id("satEnglishSlider").disabled = false;
		} else { id("satEnglishSlider").disabled = true; }
	}
	function actM(){
		if(id("actMathBox").checked == false){
			id("actMathSlider").disabled = false;
		} else { id("actMathSlider").disabled = true; }
	}
	function actE(){
		if(id("actEnglishBox").checked == false){
			id("actEnglishSlider").disabled = false;
		} else { id("actEnglishSlider").disabled = true; }
	}
  
  
  /* This function checks to make sure the SimpleMaps iframe in step 1 is sized properly w.r.t the rest of the page. This function is called on load and when the page is resized. */
  function windowResize(){
  	id("mapFrame").height = id("mapFrame").scrollWidth / 1.566;
  }
  
  /* In orer to properly load the clickable map demo the display property must not be set to none until after the page has loaded. */
  function hideSteps(){
  	/* We wait half a second to switch the section to display="none" */
  	setTimeout(function(){
 		let steps = qsa("section.searchStep");
  		for(let i=0; i< steps.length; i++){
  			steps[i].style.display = "none";
  		}
	}, 500);
  }
  
  /* Triggered by event listener. When the button is clicked a next and back button appear as well as the first step of the college search. */
  function startSearch(){
  	id("step1").style.display = "block";
  	document.getElementById('nextBtn').style.display = "block";
  	document.getElementById('backBtn').style.display = "block";
  	stepNum = 1;
  	showStep(); /* Displays step 1, select states */
  }

  /* When the next or back button is pressed we ensure that only the current step is displayed on screen. Furthermore, we grey-out the back button when on step 1 and we grey-out the next button on the last step */
  function showStep(){
  	console.log("Step Number: "+stepNum);
  	let steps = qsa("section.searchStep");
  	var Next = document.getElementById('nextBtn');
  	var Back = document.getElementById('backBtn');
  	for(let i=0; i< steps.length; i++){
  		if(i == stepNum-1){
  			steps[i].style.display = "block";
  		} else {
  			steps[i].style.display = "none";
  		}
  	}
  	/* Disable the back button when the user is on the first step. */
  	if(stepNum == 1){ 
  		Back.disabled = true; 
  	} else { Back.disabled = false; }
  	/* Disable the next button when the user is on the last step. */
  	if(stepNum == 3){
  		loadData();
  		Next.disabled = true;
  	} else { Next.disabled = false; }
  }

  /* Triggered by event listener. Advances to the next step in the search. */
  function nextBtnClick(){
  	var Btn = document.getElementById('nextBtn');
	if (Btn.disabled == false) {
  		stepNum = stepNum + 1;
  		showStep();
  	}
  }
  
  /* Triggered by event listener. Goes back to the last page in the search. */
  function backBtnClick(){
    var Btn = document.getElementById('backBtn');
	if (Btn.disabled == false) {
  		stepNum = stepNum - 1;
  		showStep();
  	}
  }
  
  
/* Returns a list of state abbreviations, corresponding to those states which are selected in step 1 */
function getSelectedStates(){
	return document.getElementById("mapFrame").contentWindow.document.getElementById("selectedStates").innerText.split("-");
}

/* Parses through colleges.csv, refining the search based on user inputs. */
function searchColleges(inputData) {
	let goalColleges = getSelectedStates(); /* Get list of selected states */
	let foundColleges = []; /* Colleges that match the search */
	
	/* Refine the search to only include schools in states selected by the user */
	for(let i=1; i < inputData.length; i++){
		for(let j=0; j < goalColleges.length; j++){
			if(inputData[i][3] == goalColleges[j]){
				foundColleges.push(inputData[i]);
			}
		}
	}
	
	/* Refine the search further, only including 4+ year universities */
	let foundColleges1 = [];
	for(let k=1; k < foundColleges.length; k++){
		if(foundColleges[k][4] == 1){  //Level of Institution: 1 in this column indicates 4+ year university.
			foundColleges1.push(foundColleges[k]);
		}
	}
	
	/* Further refine the search, only including schools where the user's SAT/ACT scores are better than the 25th percentile. */
	let foundColleges2 = [];
	for(let m=1; m < foundColleges1.length; m++){
		let errors_raised = false;
		if(id("actEnglishBox").checked == false){ //Check if disabled by user 
			if(foundColleges[m][18] > parseInt(id("actEnglishScore").innerText)){ //Is the score lower than the 25th percentile?
				errors_raised = true;
			}
		}
		if(id("actMathBox").checked == false){ //Check if disabled by user 
			if(foundColleges[m][20] > parseInt(id("actMathScore").innerText)){ //Is the score lower than the 25th percentile?
				errors_raised = true;
			}
		}
		if(id("satEnglishBox").checked == false){ //Check if disabled by user 
			if(foundColleges[m][13] > parseInt(id("satEnglishScore").innerText)){ //Is the score lower than the 25th percentile?
				errors_raised = true;
			}
		}
		if(id("satMathBox").checked == false){ //Check if disabled by user 
			if(foundColleges[m][15] > parseInt(id("satMathScore").innerText)){ //Is the score lower than the 25th percentile?
				errors_raised = true;
			}
		}
		/* If any of the scores failed to meet the criteria errors_raised would be set to true. If no errors were raised keep the school in the search results list. */
		if(errors_raised == false){
			foundColleges2.push(foundColleges1[m]);
		} else { console.log("dropped (test scores)"); }
	}
	
	return foundColleges2;
}


/* Read colleges.csv using the PapaParse Library. */
var loadedData = "";
function loadData(){
	let foundColleges = "";
	
	const promise1 = new Promise((resolve, reject) => {
		Papa.parse("colleges2.csv", {
			download: true,
			complete: function(results) {
				loadedData = results.data; //Contents of the CSV file are saved to "loadedData"
				resolve();
			}
		}) 
	});
	
	/* Refine the search using searchColleges function */
	promise1.then((value) => {
  		foundColleges = searchColleges(loadedData);
  		
  		id("resultsCount").innerText = foundColleges.length;
  		
  		/* Code modified from this demo on the MapBox website: https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/ */
  		/* Initialize MapBox Below */
  		mapboxgl.accessToken = 'pk.eyJ1IjoibWFzdGVybWlubmljaCIsImEiOiJja28xdWF2NHMwb3FxMm90ZGJvc2dkY21oIn0.w2Umil-qt-6HRhgeg_ju_A';
		var map = new mapboxgl.Map({
  				container: 'map',
  			style: 'mapbox://styles/mapbox/light-v10',
  			center: [-96, 37.8],
  			zoom: 3
		});
		/* Initialize MapBox Above */
		
		
		/* Parse through the colleges that match the user's search, creating a MapBox marker for each.  */
		var Features = [];
		for(let u=0; u<foundColleges.length; u++){
			let newMarker = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [foundColleges[u][5], foundColleges[u][6]]
				},
				properties: {
					title: foundColleges[u][1], 
      				description: foundColleges[u][7], 
      				'link': foundColleges[u][2] 
				}
			};
			Features.push(newMarker);
		}
		var geojson = {
			type: 'FeatureCollection',
			features: Features
		};
		
		
		/* Add markers to map */
		geojson.features.forEach(function(marker) {
		
  			// create a HTML element for each feature
  			var el = document.createElement('div');
  			el.className = 'marker';

  			// make a marker for each feature and add to the map
  			new mapboxgl.Marker(el)
    			.setLngLat(marker.geometry.coordinates)
    			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
				.setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p><a href="' + marker.properties.link +'">'+ "University Website" + '</a>'))
    			.addTo(map);
		});
		
		
		/* Populate the "resultsList" div */
		let resultsL = id("resultsList");
		console.log(foundColleges.length);
		function checkNA(input){
			if(input == ""){
				return("NA");
			} else { return(input); }
		}
		
		/* Create a header row for the HTML table */
		let listEntry = document.createElement("tr");
		listEntry.className = "header";
		let collName = document.createElement("th");
		collName.className = "collegeName";
		collName.innerText = "Institution Name";
		let outOfStateTuition = document.createElement("th");
		outOfStateTuition.className = "outOfStateTuition";
		outOfStateTuition.innerText = "Average Total Cost (Out of State)";
		let appFee = document.createElement("th");
		appFee.className = "appFee";
		appFee.innerText = "Application Fee";
		let averageAid = document.createElement("th");
		averageAid.className = "averageAid";
		averageAid.innerText = "Average Aid Granted";
		let admissionRate = document.createElement("th");
		admissionRate.className = "admissionRate";
		admissionRate.innerText = "% Admitted";
		listEntry.appendChild(collName);
		listEntry.appendChild(outOfStateTuition);
		listEntry.appendChild(averageAid);
		listEntry.appendChild(appFee);
		listEntry.appendChild(admissionRate);
		resultsL.appendChild(listEntry);
		
		
		/* Create a table and append all colleges that matched the search to the HTML table */
		for(let p=0; p<foundColleges.length; p++){
			let listEntry = document.createElement("tr");
			listEntry.className = "entry";
			let collName = document.createElement("th");
			collName.className = "collegeName";
			collName.innerText = foundColleges[p][1];
			let outOfStateTuition = document.createElement("td");
			outOfStateTuition.className = "outOfStateTuition";
			outOfStateTuition.innerText = "$"+checkNA(foundColleges[p][9]);
			let appFee = document.createElement("td");
			appFee.className = "appFee";
			appFee.innerText = "$"+checkNA(foundColleges[p][33]);
			let averageAid = document.createElement("td");
			averageAid.className = "averageAid";
			averageAid.innerText = "$"+checkNA(foundColleges[p][29]);
			let admissionRate = document.createElement("td");
			admissionRate.className = "admissionRate";
			admissionRate.innerText = checkNA(foundColleges[p][30]);
			listEntry.appendChild(collName);
			listEntry.appendChild(outOfStateTuition);
			listEntry.appendChild(averageAid);
			listEntry.appendChild(appFee);
			listEntry.appendChild(admissionRate);
			resultsL.appendChild(listEntry);
		}
	});
}
  

  /* ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }
   
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();