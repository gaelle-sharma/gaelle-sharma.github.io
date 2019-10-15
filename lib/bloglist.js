function get_csv_data(doc_name){
  return $.ajax({
      url: ("./data/" + doc_name)
  });
}

function populate_table(doc_name, table_el, count_el, template, dt_sorting, dt_columns, search_qs){
  $.when(get_csv_data(doc_name)).then(
    function(csv){
      var json = $.csv.toObjects(csv);
      var data_count = 0;
      $.each(json, function(i, obj){
        data_count++;
        $("#" + table_el + " tbody").append(Mustache.render(template, obj));
      });

      $('#' + count_el).html(data_count);

      // initialize datatables
      var data_table = $('#' + table_el).dataTable( {
        "aaSorting": dt_sorting,
        "aoColumns": dt_columns,
        "bInfo": false,
        "bPaginate": false
      });

      // allows linking directly to searches
      if ($.address.parameter(search_qs) != undefined) {
        data_table.fnFilter( $.address.parameter(search_qs) );
        $('#' + table_el + '_filter input').ScrollTo();
      }

      // when someone types a search value, it updates the URL
      $('#' + table_el + '_filter input').keyup(function(e){
        $.address.parameter(search_qs, $('#' + table_el + '_filter input').val());
        return false;
      });
    }
  )
}

// populate data list
var data_template = "\
<tr>\
  <td>\
    <p>{{date}}</p>\
  </td>\
  <td>\
    <p>{{title}}</p>\
    </td>\
</tr>\
";

populate_table("blogs.csv", "tasklist-table", "task-count", data_template, [ [0,'asc'] ], [ null, null, null, null ], 'data-search');
