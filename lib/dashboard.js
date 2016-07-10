//number of tasks and progress bar (number of tasks completed out of total number of tasks)
function get_csv_data(doc_name){
  return $.ajax({
      url: ("./data/" + doc_name)
  });
}

function load_progress_bar(doc_name, progressbar_el, taskstat_el){
  $.when(get_csv_data(doc_name)).then(
    function(csv){
      var json = $.csv.toObjects(csv);
      var total_count = 0;
      var completed_count = 0;
      $.each(json, function(i, obj){
          total_count++;
          var status = obj.status;
          if (status=="Complete"){
            completed_count++;
          }
      });

      var progresspercent = (completed_count / total_count) * 100;
      $('#' + progressbar_el).width(progresspercent+"%");

      var taskstracked = total_count + " tasks being tracked";
      $('#' + taskstat_el).html(taskstracked);

    }
  )
}

load_progress_bar("tasks.csv", "progress-bar", "taskstat-well");


//number of days until go-live
function countdown(glDate) {
    var todayDate = new Date();
    var countdown = Math.round((glDate-todayDate)/(1000*60*60*24));
    $('#golivestat-well').html(countdown + " days until Go-Live")
}

var goliveDate = new Date ("July 30, 2016 00:00:00");
countdown(goliveDate);


