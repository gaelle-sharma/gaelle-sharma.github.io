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
