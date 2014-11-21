(function($,TkMap,FusionTable,Loans){
	/**
	 * @classDescription - Default settings for this application
	 * @class - Default
	 */
	var Default = {
		// City
		city:'Chicago',
		// DOM ID of where the Google Map is to be rendered
		domid:'map',
		// Google Fusion Tables SQL-like query string for flu shot location data
		loanquery:'SELECT * FROM 1v-pRfwahJ8dhd8u7Z48xH0hdz_MO1a6raP9C5rHm',
		// Google Fusion Tables URI
		fturl:'https://www.googleapis.com/fusiontables/v1/query',
		// Google maps API key
		googlemapsapikey:'AIzaSyDzVY87fn_IVQpKjFNfcZUztkkdmw1nGT8',
		// Icon
		icon:'/img/blue.png',
		// Icon for your location
		iconlocation:'/img/yellow-dot.png',
		// infobox.js options
		infoboxoptions:{
			disableAutoPan: false,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-121, 0),
			zIndex: null,
			boxStyle: {
				background: "url('img/tipbox.gif') no-repeat",
				opacity: 0.92,
				width: "240px"
			},
			closeBoxMargin: "11px 4px 4px 4px",
			closeBoxURL: "img/close_x.png",
			infoBoxClearance: new google.maps.Size(25, 60),
			visible: false,
			pane: "floatPane",
			enableLoanPropagation: false
		},
		// Start center latitude of the Google map
		lat:41.875,
		// Start center longitude of the Google map
		lng:-87.6425,
		// State
		state:'Illinois',
		// Defined style types passed to TkMap
		styles:'grey minlabels',
		// Initial zoom level for the Google map
		zoom:11,
		// Zoom for finding address
		zoomaddress:14
	};
	
	/* 
	 * jQuery's 'on document ready' function
	 * Run this after the DOM is fully loaded.
	 */
	$(function(){
		/**
		 * @classDescription - Construct the Map object
		 * @class - Map
		 */
		var Map = new TkMap({
			domid:Default.domid,
			init:true,
			lat:Default.lat,
			lng:Default.lng,
			styles:Default.styles,
			zoom:Default.zoom
		}); // END Map object constructor
		
		/**
		 * The UPB Loan Finder application object
		 */
		var Portfolio = new Borrowers(Default.infoboxoptions);
		
		if(Portofolio.geolocate)
		{
			var FindMeDiv = document.createElement('div');
			Portfolio.setFindMeControl(FindMeDiv,Map,Portfolio,Default);
			FindMeDiv.index = 1;
			Map.Map.controls[google.maps.ControlPosition.TOP_RIGHT].push(FindMeDiv);
		}
		
		// Get the loan location data from the Google Fusion Table
		var LoansFT = new FusionTable(Default.fturl,Default.loanquery,Default.googlemapsapikey);
		$.getJSON(LoansFT.url, {
			dataType: 'jsonp',
			timeout: 5000
		})
		.done(function (ftdata) {
			LoansFT.columns = ftdata.columns;
			LoansFT.rows = ftdata.rows;
			Portfolio.getLoans(LoansFT.columns,LoansFT.rows,Map);
			// Highlight all loans regardless of type.
			Portfolio.setMarkersByType('all');
		})
		.fail(function(){
			alert('Oh, no! We are having trouble getting the information we need from storage.');
		});
		
		$('#nav-all').click(function(){
			
			// Change the UI
			$('#nav-li-types,.type-btn').removeClass('active');
			$('#nav-li-all').addClass('active');
			$('#nav-types-text').text('Type');
			if($('#navbar-button').is(':visible'))
			{
				$('#navbar-button').click();
			}
			
			// Selected today's loans
			Portfolio.setMarkersByType('all');
			
		}); // END Loan type dropup listener
		
		/*
		 * The Loan type dropup list listener
		 */
		$('.type').click(function(){
			
			// Change the UI
			$('#nav-li-all').removeClass('active');
			$('#nav-li-types').addClass('active');
			$('#nav-types-text').text($(this).text());
			if($('#navbar-button').is(':visible'))
			{
				$('#navbar-button').click();
			}
			
			// Select the day's loans
			Portfolio.setMarkersByType($(this).text());
			
		}); // END Type dropup listener
		
		$('#nav-address').change(function(){
			if($(this).val().length === 0)
			{
				if(Portfolio.AddressMarker !== null)
				{
					Portfolio.AddressMarker.setMap(null);
				}
			}
		});
		
		// Go button listener
		$('#nav-go').click(function(){
			$('#nav-address').blur();
			if($('#nav-address').val().length > 0)
			{
				var Geocoder = new google.maps.Geocoder();
				Geocoder.geocode(
					{
						address:$('#nav-address').val()+', '+Default.city+', '+Default.state
					},
					// Google returned a status
					function(Results, Status)
					{
						// Google returned an OK status
						if (Status == google.maps.GeocoderStatus.OK)
						{
							// Google returned a location
							if (Results[0])
							{
								Map.Map.panTo(Results[0].geometry.location);
								Map.Map.setZoom(Default.zoomaddress);
								// Make a map marker if none exists yet
								if(Portfolio.AddressMarker === null)
								{
									Portfolio.AddressMarker = new google.maps.Marker({
										position:Results[0].geometry.location,
										map: Map.Map,
										icon:Default.iconlocation,
										clickable:false
									});
								}
								else
								{
									// Move the marker to the new location
									Portfolio.AddressMarker.setPosition(Results[0].geometry.location);
									// If the marker is hidden, unhide it
									if(Portfolio.AddressMarker.getMap() === null)
									{
										Portfolio.AddressMarker.setMap(Map.Map);
									}
								}
								if($('#navbar-button').is(':visible'))
								{
									$('#navbar-button').click();
								}
								
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
								_gaq.push(['_trackLoan', 'Go Button', 'Address', maskedAddress]);
								
							}
							else
							{
								// Google didn't return a location
								alert('Sorry! We couldn\'t find that address.');
							}
						}
						else
						{
							// Google didn't return an OK status
							alert('Sorry! We couldn\'t find that address.');
						}
					}
				);
			}
			else
			{
				// Dude. The 'nav-address' input is empty
				alert('Please enter a '+Default.city+' street address in the box next to the "Go" button in the bottom navigation bar.');
			}
		}); // END Go button listener
		
		// Listen for clicks on "directions" links in the location pop-ups.
		$('body').on('click','.directions',function(){
			var theurl = 'http://www.google.com/maps?';
			if($('#nav-address').val() !== '')
			{
				theurl += 'saddr='+$('#nav-address').val()+' '+Default.city+', '+Default.state+'&';
			}
			theurl += 'daddr='+this.Loans[i].data.street1+' '+this.Loans[i].data.city+', '+this.Loans[i].data.state+' '+this.Loans[i].data.postal_code;
			window.open(theurl);
		});
		
	}); // END jQuery on document ready
})(jQuery,TkMap,FusionTable,Borrowers);
