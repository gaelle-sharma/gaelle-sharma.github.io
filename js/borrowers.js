/**
 * @classDestription - Placeholder for Portfolio application variables and functions.
 * @class - Borrower
 */
var Borrowers = (function($) {
	var constructor = function(infoboxoptions){
		this.AddressMarker = null;
		
		// Now
		this.now = Date.parse('now');
		
		this.Loans = [];
		
		// Can we geolocate?
		this.geolocate = navigator.geolocation;
		
		this.getLoans = function(columns,rows,Map)
		{
			// Copy the loan data to the Loan object
			for (var i in rows)
			{
				this.Loans[i] = new Loan();
				for(var j in columns)
				{
					var colname = columns[j];
					this.Loans[i].data[colname] = rows[i][j];
				}
				// Create the Google LatLng object
				this.Loans[i].latlng = new google.maps.LatLng(this.Loans[i].data.latitude,this.Loans[i].data.longitude);
				// Create the markers for each loan
				var icon = 'img/blue.png';
				this.Loans[i].marker = new google.maps.Marker({
					position: this.Loans[i].latlng,
					map: Map.Map,
					icon:icon,
					shadow:'img/shadow.png',
					clickable:true
				});
				// Make the info box
				this.Loans[i].infobox = new InfoBox(infoboxoptions);
			}
			for(var i in this.Loans)
			{
				// Listen for marker clicks
				google.maps.event.addListener(this.Loans[i].marker, 'click', this.Loans[i].toggleInfoBox(Map.Map,this.Loans[i]));
			}
		};
		
		/**
		 * Set the address for a latlng
		 */
		this.codeLatLng = function(Latlng)
		{
			var Geocoder = new google.maps.Geocoder();
			Geocoder.geocode(
				{'latLng': Latlng},
				function(Results,Status)
				{
					if (Status == google.maps.GeocoderStatus.OK)
					{
						if (Results[0])
						{
							var formattedAddress = Results[0].formatted_address.split(',');
							$('#nav-address').val(formattedAddress[0]);
							
							// Mask the exact address before recording
							// Example: '1456 W Greenleaf Ave' becomes '1400 W Greenleaf Ave'
							var addarray = $.trim($('#nav-address').val()).split(' ');
							// Chicago addresses start with numbers. So look for them and mask them.
							if(addarray[0].match(/^[0-9]+$/) !== null)
							{
								var replacement = addarray[0].substr(0,addarray[0].length-2)+'00';
								if(replacement !== '00')
								{
									addarray[0] = replacement;
								}
								else
								{
									addarray[0] = '0';
								}
							}
							var maskedAddress = addarray.join(' ');
							_gaq.push(['_trackLoan', 'Find Me', 'Address', maskedAddress]);
						}
						else
						{
							alert('We\'re sorry. We could not find an address for this location.');
						}
					}
					else
					{
						alert('We\'re sorry. We could not find an address for this location.');
					}
				}
			);
		};
		
		// Put a Pan/Zoom control on the map
		this.setFindMeControl = function(controlDiv,Map,Portfolio,Default)
		{
			// Set CSS styles for the DIV containing the control
			// Setting padding to 5 px will offset the control
			// from the edge of the map.
			controlDiv.style.padding = '1em';
			// Set CSS for the control border.
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = '#333';
			//controlUI.style.color = 'white';
			controlUI.style.borderStyle = 'solid';
			controlUI.style.borderWidth = '0px';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.style.borderRadius = '6px';
			controlUI.title = 'Click to find your location.';
			controlDiv.appendChild(controlUI);
			// Set CSS for the control interior.
			var controlText = document.createElement('div');
			controlText.style.fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
			controlText.style.fontSize = '12px';
			controlText.style.color = '#fff';
			controlText.style.paddingLeft = '.5em';
			controlText.style.paddingRight = '.5em';
			controlText.style.paddingTop = '.3em';
			controlText.style.paddingBottom = '.3em';
			controlText.innerHTML = 'Find Me';
			controlUI.appendChild(controlText);
			// Setup the click loan listeners.
			google.maps.event.addDomListener(controlUI, 'click', function() {
				if(navigator.geolocation)
				{
					navigator.geolocation.getCurrentPosition(
						// Success
						function(position)
						{
							//_gaq.push(['_trackLoan', 'GPS', 'Success']);
							var Latlng = new google.maps.LatLng(
								position.coords.latitude,
								position.coords.longitude
							);
							Map.Map.setCenter(Latlng);
							Map.Map.setZoom(Default.zoomaddress);
							// Make a map marker if none exists yet
							if(Portfolio.AddressMarker === null)
							{
								Portfolio.AddressMarker = new google.maps.Marker({
									position:Latlng,
									map: Map.Map,
									icon:Default.iconlocation,
									clickable:false
								});
							}
							else
							{
								// Move the marker to the new location
								Portfolio.AddressMarker.setPosition(Latlng);
								// If the marker is hidden, unhide it
								if(Portfolio.AddressMarker.getMap() === null)
								{
									Portfolio.AddressMarker.setMap(Map.Map);
								}
							}
							Portfolio.codeLatLng(Latlng);
						},
						// Failure
						function()
						{
							alert('We\'re sorry. We could not find you. Please type in an address.');
						},
						{
							timeout:5000,
							enableHighAccuracy:true
						}
					);
				}
			});
		};
		
		this.setMapLegend = function(controlDiv,Map,Portfolio,Default)
		{
			// Set CSS styles for the DIV containing the control
			// Setting padding to 5 px will offset the control
			// from the edge of the map.
			controlDiv.style.padding = '1em';
			// Set CSS for the control border.
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = 'rgba(255,255,255,0.7)';
			//controlUI.style.color = 'white';
			controlUI.style.borderStyle = 'solid';
			controlUI.style.borderWidth = '0px';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.style.borderRadius = '6px';
			controlUI.title = 'Click to hide.';
			controlDiv.appendChild(controlUI);
			// Set CSS for the control interior.
			var controlText = document.createElement('div');
			controlText.style.fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
			controlText.style.fontSize = '12px';
			controlText.style.color = '#333';
			controlText.style.paddingLeft = '.5em';
			controlText.style.paddingRight = '.5em';
			controlText.style.paddingTop = '.3em';
			controlText.style.paddingBottom = '.3em';
			controlText.innerHTML = '<div>Free<img src="img/blue.png" /></div>';
			controlUI.appendChild(controlText);
		// Setup the click loan listeners.
			google.maps.event.addDomListener(controlUI, 'click', function() {
				Map.Map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear();
			});
		};
		
		this.setMarkersByType = function(type)
		{
			for(var i in this.Loans)
			{
				// Let's see if 'bank' corresponds to the bank_name for this branch.
				var loan_type = this.Loans[i].data.type;
				var onType = false;
				if (
					$.trim(type.toLowerCase()) === 'all'
					||
					(
						// If a specific loan type
						type === loan_type
					)
				)
				{
					onType = true;
					this.Loans[i].marker.setIcon('img/blue.png');
				}
				else
				{
					this.Loans[i].marker.setIcon('img/grey-transparent.png');
				}
			}
		};
	};
	return constructor;
})(jQuery);
