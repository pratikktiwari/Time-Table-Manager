document.addEventListener('DOMContentLoaded', function() {


	document.querySelector('#options_day_monday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html'))
    })
    document.querySelector('#options_day_tuesday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html')+"?day=tuesday")
    })
    document.querySelector('#options_day_wednsday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html')+"?day=wednsday")
    })
    document.querySelector('#options_day_thursday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html')+"?day=thursday")
    })
    document.querySelector('#options_day_friday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html')+"?day=friday")
    })
    document.querySelector('#options_day_saturday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html')+"?day=saturday")
    })
    document.querySelector('#options_day_sunday').addEventListener('click',function() {
    	window.open(chrome.runtime.getURL('options.html')+"?day=sunday")
    })
	



	var url = window.location.href;
	url_param = url.split("=");
	var today_;;

	if(url_param[1]){
		let active_id = "options_day_"+url_param[1];
		today_ = url_param[1];
		if(today_ !== "monday" && today_ !== "tuesday" &&today_ !== "wednsday" &&today_ !== "thursday" &&today_ !== "friday" &&today_ !== "saturday" &&today_!== "sunday"){
			window.location.href=chrome.runtime.getURL('options.html');
		}
		else{

			document.getElementById(active_id).style.textDecoration = "underline";
			document.getElementById("which_day_routine").innerHTML = url_param[1]+"'s"+" Routine"
		}
	}
	else{
		document.getElementById("options_day_monday").style.textDecoration = "underline";
		today_ = "monday"
		document.getElementById("which_day_routine").innerHTML = "Monday's"+" Routine"
	}

	//get already present data
	chrome.storage.local.get(['time_table'], function(result) {

		
		const json_parsed = JSON.parse(result.time_table);
		const today_array_of_objects = json_parsed[today_];

		chrome.tabs.getSelected(null, function(tab) {
			let main_parent = document.getElementById('container_old_tables');
			for(let i=0; i<today_array_of_objects.length; i++){

				let single_old_table_main = document.createElement("div");
				single_old_table_main.setAttribute("class","single_old_table_main");


				let sub_name = document.createElement("div");
				sub_name.setAttribute("class","link");
				sub_name.innerHTML = today_array_of_objects[i]['sub_name']
				single_old_table_main.appendChild(sub_name);

				let sub_code_p = document.createElement("div");
				let sub_code_span = document.createElement("span");
				sub_code_span.setAttribute("class","card_head");
				sub_code_span.innerHTML = "Code: ";
				sub_code_p.appendChild(sub_code_span);
				sub_code_p.innerHTML+= today_array_of_objects[i]['sub_code'];
				single_old_table_main.appendChild(sub_code_p);

				let sub_time_p = document.createElement("div");
				let sub_time_span = document.createElement("span");
				sub_time_span.setAttribute("class","card_head");
				sub_time_span.innerHTML = "Time: ";
				sub_time_p.appendChild(sub_time_span);
				sub_time_p.innerHTML+=  today_array_of_objects[i]['from'] +" - "+today_array_of_objects[i]['to'];
				single_old_table_main.appendChild(sub_time_p);

				let sub_roll_p = document.createElement("div");
				let sub_roll_span = document.createElement("span");
				sub_roll_span.setAttribute("class","card_head");
				sub_roll_span.innerHTML = "Roll: ";
				sub_roll_p.appendChild(sub_roll_span);
				sub_roll_p.innerHTML+= today_array_of_objects[i]['roll_number'];
				single_old_table_main.appendChild(sub_roll_p);

				let sub_section_p = document.createElement("div");
				let sub_section_span = document.createElement("span");
				sub_section_span.setAttribute("class","card_head");
				sub_section_span.innerHTML = "Section: ";
				sub_section_p.appendChild(sub_section_span);
				sub_section_p.innerHTML+= today_array_of_objects[i]['section']
				single_old_table_main.appendChild(sub_section_p);

				let sub_link = document.createElement("div");
				sub_link.setAttribute("class","link");
				sub_link.innerHTML = today_array_of_objects[i]['link']
				single_old_table_main.appendChild(sub_link);

				let del_btn = document.createElement("button");
				del_btn.innerHTML = "Delete";
				single_old_table_main.appendChild(del_btn);


				del_btn.onclick = function(){ 
					single_old_table_main.style.display = "none";
					//remove from array
					chrome.storage.local.get(['time_table'], function(result) {
			        	var parsed_ = JSON.parse(result.time_table);
			        	//filter
			        	const _new_data_all = {...parsed_, 
			        		[today_]:parsed_[today_].filter((item,index)=>index!==i)
			        	}
			        	chrome.storage.local.set({'time_table':JSON.stringify(_new_data_all)},function(){
						});

			        })


				};

				main_parent.appendChild(single_old_table_main);
			}
		})
	})






	document.getElementById('main_add_form').addEventListener('submit',(event)=>{

		let from_time = document.querySelector('input[name=from_time]').value;
		let to_time = document.querySelector('input[name=to_time]').value;
		let subject_code = document.querySelector('input[name=subject_code]').value;
		let subject_name = document.querySelector('input[name=subject_name]').value;
		let subject_roll = document.querySelector('input[name=subject_roll]').value;
		let subject_section = document.querySelector('input[name=subject_section]').value;
		let subject_link = document.querySelector('input[name=subject_link]').value;

		if (subject_code.length>20 || subject_name.length>50 || subject_roll.length>10 || subject_section.length>15 || subject_link.length>50) {
			let el = document.getElementById('warning_end_form');
			el.style.color='red';
			el.innerHTML = "Subject Code should be lesser than 20chars<br/>\
			Subject name should be lesser than 50chars<br/>\
			Section name should be lesser than 15chars<br/>\
			Link should be lesser than 70 chars<br/>\
				Roll should be lesser 10 chars<br/>\
				\
			";
			if(document.getElementById('warning_end_form').innerHTML.length<10){
				document.getElementById('form_container_main').appendChild(el);
			}
			//append result to json in case it is being added
			event.preventDefault();
			return false;

		}
		else{


			const new_data_from_form={
				from:from_time,
				to:to_time,
				sub_code:subject_code,
				sub_name:subject_name,
				roll_number:subject_roll,
				section:subject_section,
				link:subject_link
			}
					
			var new_data_all;
	        const json_data_string = JSON.stringify(new_data_from_form)
	        const default_data={
		        monday:[],
		        tuesday:[],
		        wednsday:[],
		        thursday:[],
		        friday:[],
		        saturday:[],
		        sunday:[],
		      }
	        chrome.storage.local.get(['time_table'], function(result) {
	        	var parsed;

	        	if (!result.time_table) {
	        		parsed = default_data;
	        	}
	        	else{
	        		parsed = JSON.parse(result.time_table);
	        	}
	        	new_data_all = {...parsed,
	        		[today_]:[...parsed[today_],new_data_from_form]
	        	}
	        	chrome.storage.local.set({'time_table':JSON.stringify(new_data_all)},function(){
				});

	        })	
			window.alert("Added to time table");
			sleep(500).then(() => {
			    window.location.reload();
			});
			event.preventDefault();
		}
	})
});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
