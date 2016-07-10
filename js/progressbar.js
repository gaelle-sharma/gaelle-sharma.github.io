$( document ).ready(function() {
	$.getJSON("./data/tasks.json", function( result ) {
	  var total_count = result.data.length;
	  var completed_count = 0;
	  for (i = 0; i < total_count; i++) {
	  	var status = result.data[i].status;
	  	if (status=="Complete"){
	  		completed_count++;
	  	}
	  }
      var progresspercent = (completed_count / total_count) * 100;
	  $("#progress-bar").width(progresspercent+"%")
	})
})