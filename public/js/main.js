
 


  $(document).ready(function(){
	 
  $('.dropdown').click(function()
  {
	  $('.dropdown-menu').fadeToggle();
  })
   $(document).on("click",".accordian",function()
 {
	 
	  if($(this).closest('.panel').find('.collapseOne').is(":visible")){
		 
		    $(this).find('img').attr('src',"images/arrow-bottom.png")
	  }else{
		  
		   $(this).find('img').attr('src',"images/arrow-top.png")
	  }
	   $(this).closest('.panel').find('.collapseOne').slideToggle();
  })
   $(document).on("click",".pl-remove",function()
  {
	   $(this).closest('.panel').remove()
  })
    $(document).on("click",".editblock",function()
  {
	   
  })
  
  $('.tooltip-input').tooltip()
  $('.tooltip-anc').tooltip()
       
	 
  $('.add-panel-btn').click(function()
  {
	  var pan=$(this).closest('.panel').html();
	  
	  $('#panel-body').append('<div class="panel">'+pan+'</div>')
	  $('#panel-body').find('.panel-footer').remove()
  })
  $('#savebutton').click(function()
  {
	  $('#myModal').modal('hide');
  })
  $('.datepicker').datepicker({
      showOn: "button",
      buttonImage: "images/calender.png",
      buttonImageOnly: true,
      buttonText: "Select date"
    });
   $(document).on('focus',".datepicker", function(){
    $(this).datepicker({
      showOn: "button",
      buttonImage: "images/calender.png",
      buttonImageOnly: true,
      buttonText: "Select date"
    });
});

 $('.arrow-menu>a').click(function(e)
 {
	 e.preventDefault();
	  
	 $('.left-block-main ul li').find("ul").each(function()
	 {
		$(this).height($(this).height())
	 })
	  if( $('.left-block-main ul li').hasClass("open"))
	 {
		 $('.left-block-main ul li').find("ul").slideUp(1000);
		 $('.left-block-main ul li').removeClass("open")
		  $('.left-block-main ul li').removeClass("active-menu")
	 }
	 $(this).parent().find("ul").slideToggle(1000);
	 $(this).parent().addClass("open")
	  $(this).parent().addClass("active-menu")
 })

$('.paymentmode').change(function()
{
	var selecd=$(this).find("option:selected" ).val();
	$('.list-block').hide()
	$("#"+selecd).show()
})
$('.add-rule').click(function(e)
{e.preventDefault()
	$('#addrule').show();
})
var pageurl;
var widgetlink
$('#p-select-widget').click(function(e)
{
	e.preventDefault();
	pageurl=$(this).attr('data-url');
 localStorage.setItem("pageurl", pageurl);
	 window.open("select-widget1.html","_self").focus();
})
$('#createofwidget').click(function(e)
{
	e.preventDefault();
	pageurl=$(this).attr('data-url');
 localStorage.setItem("pageurl", pageurl);
	 window.open("create-widget1.html","_self").focus();
})

$('.add-widget-sc').click(function()
{
	
	widgetlink='<div class="panel ui-draggable">'+$(this).closest('.panel').html()+'</div>';
	 localStorage.setItem("widget", widgetlink);
	 window.open(localStorage.getItem("pageurl")+"#add-widget","_self").focus();
})

  $(document).on('click',".add-widget-in", function(){
  widgetlink='<div class="panel ui-draggable">'+$(this).closest('.panel').html()+'</div>';
	 localStorage.setItem("widget", widgetlink);
	 window.open(localStorage.getItem("pageurl")+"#add-widget","_self").focus();
});
 $('#btn-cancel,#btn-cancel1').click(function()
 {
	 
	  window.open("dashboard.html","_self").focus();
 })

var hash = window.location.hash;
if(hash=="#add-widget"){
	$('.right-block .panel-primary>.panel-body .search-block').after( localStorage.getItem("widget")); 
	$('.right-block .panel-primary>.panel-body .panel-footer').remove()
	 $(".widget-panel").parent().draggable({
			 
         appendTo: "body",
         helper: "clone",
		 cursor:"move"
		
        });
	
}
 });



 