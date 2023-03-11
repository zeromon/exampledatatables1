// Initialize the DataTable
//           $(document).ready(function () {
//             $('#tableID').dataTable({
//                 "ajax": "geeks.json",
//                 "dataSrc": "employes",
//                 "columns": [
//                     { 'employes': 'id' },
//                     { 'employes': 'name' },
//                     { 'employes': 'address' }
//                 ]
//             });
//         });
let url = "https://dummyjson.com";
var currentRow;
var idData;
$(document).ready(function(){
  var myTable = $("#tableID").DataTable({
//     columnDefs: [
//       {
//         searchable: false,
//         orderable: false,
//         targets: 0,
//       },
//     ],
//     dom: 'Bfrtip',
//     buttons: [
//        {
//           extend: 'pdfHtml5',
//           download: 'open'
//        }
//     ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'pdf',
        pageSize: 'A4',
        // https://stackoverflow.com/questions/35642802/datatables-export-pdf-with-100-width
        //https://pdfmake.github.io/docs/0.1/document-definition-object/tables/
        customize:function(doc){
          // doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
          console.log(doc);
          //change width each column
          doc.content[1].table.widths = ['auto', '*','*'];
          doc.styles.tableHeader.fillColor='#ff5500';
          // var colCount = new Array();
          //   $('#tableID').find('tbody tr:first-child td').each(function(){
          //       if($(this).attr('colspan')){
          //           for(var i=0;i<=$(this).attr('colspan');$i++){
          //               colCount.push('*');
          //           }
          //       }else{ colCount.push('*'); }
          //   });
          //   doc.content[1].table.widths = colCount;
        },
        exportOptions:{
          columns:[0,2,3],
          modifier:{
            page:'all'
          }
        },
        download: 'open'
      }
    ],
//     buttons: [
//       'copyHtml5',
//       'excelHtml5',
//       'csvHtml5',
//       {
//         extends: 'pdf',
//         exportOptions:{
//           modifier: {
//             page:'all'
//           }
//         }
//       }
//     ],
    order: [[1, 'asc']],
    ajax: {
      url: url+"/products?limit=150&skip=85",
      dataSrc: 'products',
    },
    columnDefs:[
    // this is for tricking data columns for working with index number on table, using this for skipping data on column 0
      {
        data: 'id',
        searchable: false,
        orderable: false,
        targets: 0,
      },
    // hide data id, targets is to change column number
      {data: 'id', targets: 1, visible:false},
      {data: 'title', targets: 2},
      {data: 'brand', targets: 3},
      {
        data: 'id',
        targets: 4,
        render: function(data, type, row){
          return `<button class="btn btn-primary btn-xs" onclick="getOneProduct(${data})"><span class="fa fa-eye"></span></button>`+`<button class="btn btn-success btn-xs btnEdit"><span class="fa fa-edit"></span></button>`+`<button class="btn btn-danger btn-xs btnDelete"><span class="fa fa-close"></span></button>`;
        }
      }
    ]
  });
  // add number row/index on table
  myTable.on('order.dt search.dt', function () {
     let i = 1;
    // this is replace column 0 with number
     myTable.cells(null, 0, { 
      search: 'applied', 
      order: 'applied' })
    .every(function (cell) {
        this.data(i++);
     });
  }).draw();

  // delete btn click
  $("#tableID").on("click", ".btnDelete",function(){
    let row = $(this).closest("tr").find("td");
    let currentID = $(row).html();
    // get data id, column is column number from id
    let dataId = myTable.column(1).data()[currentID];
    console.log(dataId);
    console.log(currentID);
    if(confirm("are you sure delete this data?")){
      fetch(url+'/products/'+dataId, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        myTable.row($(this).closest("tr")).remove().draw();
        alert("data success deleted")
      });
    }
  });

  // edit btn click
  $("#tableID").on("click",'.btnEdit',function(){
    //select tr element from current element
    currentRow = $(this).closest("tr")
    let idRow = currentRow.find("td");
    let currentID = $(idRow).html();
    idData = myTable.column(1).data()[currentID];
    var $tds = currentRow.find("td").not(':first').not(':last');

    // add value to input text

    $('#name').val($($tds[0]).html());
    $('#brand').val($($tds[1]).html());

    // $.each($tds, function(i, el) {
    //   var txt = $(this).text();
    //   console.log(txt);
    //   // $(this).html("").append("<input type='text' value='" + txt + "'>");
    // });
  });

  // save edit btn click
  $('#btnEditSave').on("click",function(){
    let name = $('#name').val();
    let brand = $('#brand').val();
    fetch(url+'/products/'+idData, {
      method: 'PUT', /* or PATCH */
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: name,
        brand: brand
      })
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      var $tds = currentRow.find("td").not(':first').not(':last');
      $($tds[0]).html(name);
      $($tds[1]).html(brand);
      $('#name').val("");
      $('#brand').val("");
      alert("Edit Success");
    });
  });
  $('#btnPost').on("click",function(){
    let name = $('#name').val();
    let brand = $('#brand').val();
    if(name.length != 0 || brand.length != 0){
      fetch(url+'/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name,
          brand: brand
          /* other product data */
        })
      })
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        myTable.row.add({id: data.id, title: data.title, brand: data.brand}).draw(false);
        alert("success post data")
      });
    }else{
      alert("please insert data")
    }
  });
});
function getOneProduct(id){
  $.get(url+"/products/"+id, (res) => {
    console.log(res);
    alert("name "+res.title+" brand "+res.brand);
  });
}
$.get("http://localhost:8000/data_example.json",(result)=>{
  console.log(result);
});
  function testClick() {
    fetch(url + "/products?limit=10&skip=0")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
  fetch(url + "/test", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));