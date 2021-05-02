# CSC-336-Final-Project
Final Project for Bei Xiao's Web Programming class at American University. 
My idea was to create a website that helps students start their college search process.


Click the "start a new search" button the generate a new search. A map will appear, simply select all the states you want to consider in your college search then click "next". You will be asked for your SAT/ACT scores, simply enter your scores with the sliders of click the checkmark next to the slider if you haven't taken the test. Click next to generate your results. The results displayed are all the colleges within your selected region where your test scores are higher than the 25th percentile.


## Technologies Used:
- [Integrated Postsecondary Education Data System: National Center for Education Statistics](https://nces.ed.gov/ipeds/use-the-data)' "Compare Institutions" dataset. I downloaded the data a CSV file called "colleges2.csv".
- [Papa Parse 5 Library](https://www.papaparse.com/docs#data) to parse the local csv file.
- [MapBox API](https://www.mapbox.com/) to display results on an interactive map.
- [SimpleMaps "Selectable States" Demo javasript plugin](https://simplemaps.com/docs/selectable-states). I didn't want to spend all of my time creating a pretty map, so I decided to integrate this. 


## In the future...
I am interested in implementing the [DataTables plugin](https://datatables.net/) to clean up the results table. 
