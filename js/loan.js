/**
 * Loan class
 */
var Loan = (function($){
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

		this.toggleInfoBox = function(Map,ThisLoan)
		{
			return function(){
				if(ThisLoan.infobox.visible)
				{
					ThisLoan.infobox.close(Map,ThisLoan.marker);
				}
				else
				{
					ThisLoan.infoboxtext = '<div class="infoBox" style="border:2px solid rgb(16,16,16); margin-top:8px; background:#ddd; padding:5px; font-family:Helvetica Neue,Helvetica,Arial,sans-serif">';
					ThisLoan.infoboxtext += '<br><span style="font-size:133%">'+ThisLoan.data.type+'</span>';
					ThisLoan.infoboxtext += '<br>'+ThisLoan.data.street1;
					ThisLoan.infoboxtext += '<br>'+ThisLoan.data.city+', '+ThisLoan.data.state+' '+ThisLoan.data.postal_code;
					ThisLoan.infoboxtext += '<br><a class="directions" href="http://www.google.com/maps?';
					if($('#nav-address').val() !== '')
					{
						ThisLoan.infoboxtext += 'saddr='+$('#nav-address').val()+' Chicago, IL&';
					}
					ThisLoan.infoboxtext += 'daddr='+ThisLoan.data.street1+' '+ThisLoan.data.city+', '+ThisLoan.data.state+' '+ThisLoan.data.postal_code+'" target="_blank" style="color:#22f">Get Directions</a>';
					ThisLoan.infoboxtext += '</div>';
					ThisLoan.infobox.setContent(ThisLoan.infoboxtext);
					ThisLoan.infobox.open(Map,ThisLoan.marker);
					_gaq.push(['_trackLoan', 'Open InfoBox', 'Loan', ThisLoan.data.branch_name+' | '+ThisLoan.data.street1]);
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
