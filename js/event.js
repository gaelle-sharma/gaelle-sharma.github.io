/**
 * Event class
 */
var Event = (function($){
	var constructor = function()
	{
		this.data = {};
		this.latlng = null;
		this.marker = null;
		this.infobox = null;
		this.infoboxtext = null;
		
		// Oh dear lord, browser detection. -10 Charisma. Is the browser android or iPhone or Blackberry or Windows mobile?
		this.isPhone = (navigator.userAgent.match(/iPhone/i)
			|| (navigator.userAgent.toLowerCase().indexOf("android") > -1)
			|| (navigator.userAgent.toLowerCase().indexOf("blackberry") > -1)
			|| navigator.userAgent.match(/iemobile/i)
			|| navigator.userAgent.match(/Windows Phone/i)) ? true : false;

		this.toggleInfoBox = function(Map,ThisEvent)
		{
			return function(){
				if(ThisEvent.infobox.visible)
				{
					ThisEvent.infobox.close(Map,ThisEvent.marker);
				}
				else
				{
					ThisEvent.infoboxtext = '<div class="infoBox" style="border:2px solid rgb(16,16,16); margin-top:8px; background:#ddd; padding:5px; font-family:Helvetica Neue,Helvetica,Arial,sans-serif">';
					ThisEvent.infoboxtext += '<br>'+ThisEvent.data.street1;
					ThisEvent.infoboxtext += '<br>'+ThisEvent.data.city+', '+ThisEvent.data.state+' '+ThisEvent.data.postal_code;
					ThisEvent.infoboxtext += '<br><a class="directions" href="http://www.google.com/maps?';
					if($('#nav-address').val() !== '')
					{
						ThisEvent.infoboxtext += 'saddr='+$('#nav-address').val()+' Chicago, IL&';
					}
					ThisEvent.infoboxtext += 'daddr='+ThisEvent.data.street1+' '+ThisEvent.data.city+', '+ThisEvent.data.state+' '+ThisEvent.data.postal_code+'" target="_blank" style="color:#22f">Get Directions</a>';
					ThisEvent.infoboxtext += '</div>';
					ThisEvent.infobox.setContent(ThisEvent.infoboxtext);
					ThisEvent.infobox.open(Map,ThisEvent.marker);
					_gaq.push(['_trackEvent', 'Open InfoBox', 'Event', ThisEvent.data.facility_name+' | '+ThisEvent.data.street1]);
				}
			};
		};
		
		this.closeInfoBox = function(Map,Marker,InfoBox)
		{
			if(InfoBox.visible)
			{
				InfoBox.close(Map,Marker);
			}
		};
		
	};
	return constructor;
})(jQuery);