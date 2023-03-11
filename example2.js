// https://stackoverflow.com/questions/28744546/using-jquery-datatables-with-non-tabular-layout
$(document).ready(function(){
    var myTable = $('#example').DataTable({
        //hide entries
        "lengthChange": false,
        //hide info
        pageLength: 8,
        "info": false,
        "data": [
          // some rows data
          ['Trident','Internet Explorer 4.0','Win 95+','4','X'],
          ['Trident','Internet Explorer 5.0','Win 95+','5','C'],
          ['Trident','Internet Explorer 5.5','Win 95+','5.5','A'],
          ['Trident','Internet Explorer 6','Win 98+','6','A'],
          ['Trident','Internet Explorer 4.0','Win 95+','4','X'],
          ['Trident','Internet Explorer 5.0','Win 95+','5','C'],
          ['Trident','Internet Explorer 5.5','Win 95+','5.5','A'],
          ['Trident','Internet Explorer 6','Win 98+','6','A'],
          ['Trident','Internet Explorer 4.0','Win 95+','4','X'],
          ['Trident','Internet Explorer 5.0','Win 95+','5','C'],
          ['Trident','Internet Explorer 5.5','Win 95+','5.5','A'],
          ['Trident','Internet Explorer 6','Win 98+','6','A']
        ],
        "columns": [
          { "title": "Engine" },
          { "title": "Browser" },
          { "title": "Platform" },
          { "title": "Version", "class": "center" },
          { "title": "Grade", "class": "center" }
        ],
        "initComplete": function(settings, json) {
          // show new container for data
          $('#new-list').insertBefore('#example');
          $('#new-list').show();
        },
        "rowCallback": function( row, data ) {
          // on each row callback
          var li = $(document.createElement('li'));
          
          for(var i=0;i<data.length;i++) {
            li.append('<p>' + data[i] + '</p>');
          }
          li.appendTo('#new-list');
        },
        "preDrawCallback": function( settings ) {
          // clear list before draw
          $('#new-list').empty();
        }
    });
});