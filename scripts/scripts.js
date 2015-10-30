$(document).ready(function(){
	var repeat=true;
	var freq=1000;
	showFreq();
	getDBRacers();
	startAJAXcalls();
	function startAJAXcalls(){
		if(repeat){
			setTimeout(function(){
			getDBRacers();
			startAJAXcalls();
			},
			freq);
		}
	}
	function showFreq(){
		$('#freq').html('Page refreshes every '+freq/1000+' second(s).');
	}
	function getDBRacers(){
		$.getJSON("service.php?action=getRunners",function(json){
			if(json.runners.length>0){
				$('#finishers_m').empty();
				$('#finishers_f').empty();
				$('#finishers_all').empty();

				$.each(json.runners,function(){
					var info="<li><b>Name:</b>"+this['fname']+this['lname']+"  <b>Time:</b>"+this['time']+"</li>";
					if(this['gender']=='m'){
						$('#finishers_m').append( info );
					}else if(this['gender']=='f'){
						$('#finishers_f').append( info );
					}else{ }
					$('#finishers_all').append( info );
				});
				getTimeAjax();
			}
		});
	}
/*	function getXMLRacers(){
		$.ajax({
			url: 'finishers.xml',
			cache: false,
			dataType: 'xml',
			success:function(xml){
				$('#finishers_m').empty();
				$('#finishers_f').empty();
				$('#finishers_all').empty();
				$(xml).find('runner').each(function(){
					var info="<li>Name:"+$(this).find('fname').text()+" "+$(this).find('lname').text()+" .Time:"+$(this).find('time').text()+"</li>";
					if($(this).find('gender').text()=='m'){
						$('#finishers_m').append(info);
					}else if($(this).find('gender').text()=='f'){
						$('#finishers_f').append(info);
					}else{ }
					$('#finishers_all').append(info);
				})
				getTimeAjax();
			}
		});
	}*/
	function getTimeAjax(){
		$.ajax({
			url: 'time.php',
			cache: false,
			success:function(date){
				$('#updatedTime').html(date);
			}
		})
	}
	$('#btnStop').click(function(){
		repeat=false;
		$("#freq").html( "Updates paused." );
	})
	$('#btnStart').click(function(){
		repeat=true;
		startAJAXcalls();
		showFreq();
	});
	$('#addRunner').submit(function(){
		return false;
	});

	$('#btnSave').click(function() {

		var data = $("#addRunner :input").serializeArray();

		$.post($("#addRunner").attr('action'), data, function(json){
			
			if (json.status == "fail") {
				alert(json.message);
			}
			if (json.status == "success") {
				alert(json.message);
				clearInputs();
			}
		}, "json");
	});	
	function clearInputs(){
		$("#txtFirstName").val('');
		$("#txtLastName").val('');
		$("#ddlGender").val('');
		$("#txtMinutes").val('');
		$("#txtSeconds").val('');
	}	
});