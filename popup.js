document.addEventListener('DOMContentLoaded', function() {
  function compare(a, b) {
    if (a.from > b.from) return 1;
    if (b.from > a.from) return -1;

    return 0;
  }

  document.querySelector('#go-to-options').addEventListener('click',function() {
    window.open(chrome.runtime.getURL('options.html'))
  });

  chrome.storage.local.get(['time_table'], function(result) {
    if (!result.time_table) {
      //if the json values are not set -> load defaults
      const default_data={
        monday:[],
        tuesday:[],
        wednsday:[],
        thursday:[],
        friday:[],
        saturday:[],
        sunday:[],
      }

      const json_data_string = JSON.stringify(default_data)

      chrome.storage.local.set({'time_table':json_data_string},function(){
        // alert("defaults loaded");
      });
    }
  });



  // document.getElementById('open_page').addEventListener('click', function() {
    chrome.storage.local.get(['time_table'], function(result) {
      // alert("Value is: "+result.time_table);
      var json_data = result.time_table;
      

      const weekday = ["monday","tuesday","wednsday","thursday","friday","saturday","sunday"];
      var d = new Date();
      var today = weekday[d.getDay()-1];

      document.getElementById("current_day_id").innerHTML = "&nbsp;"+today;
      // alert(json_data);
      var check_length;
      try{
        check_length=JSON.parse(result.time_table)[today].length;
      }
      catch(e){
        check_length=0;
      }
      if(check_length>0){ 
      // SyntaxError: Unexpected token u in JSON at position 0


        const json_parsed = JSON.parse(result.time_table);
        const today_array_of_objects = json_parsed[today];
        
        today_array_of_objects.sort(compare);

        chrome.tabs.getSelected(null, function(tab) {
          parent_ = document.getElementById("todays_lectures");
          for(let i=0; i<today_array_of_objects.length; i++){

            var single_lecture_main_parent = document.createElement("div");
            single_lecture_main_parent.setAttribute("class", "single_lecture_main_parent");

            var subject_full_name = document.createElement("div");
            subject_full_name.setAttribute("class", "subject_full_name");
            subject_full_name.innerHTML = today_array_of_objects[i]['sub_name']

            single_lecture_main_parent.appendChild(subject_full_name);

            var single_lecture_top_row = document.createElement("div");
            single_lecture_top_row.setAttribute("class", "single_lecture_top_row");


            var single_lecture_h4_time = document.createElement("h4");
            single_lecture_h4_time.setAttribute("class", "single_lecture_h4");
            single_lecture_h4_time.innerHTML = today_array_of_objects[i]['from'] +" - "+today_array_of_objects[i]['to'];
            single_lecture_top_row.appendChild(single_lecture_h4_time);

            var single_lecture_h4_roll = document.createElement("h4");
            single_lecture_h4_roll.setAttribute("class", "single_lecture_h4");
            single_lecture_h4_roll.innerHTML = today_array_of_objects[i]['roll_number'];
            single_lecture_top_row.appendChild(single_lecture_h4_roll);

            var single_lecture_h4_code = document.createElement("h4");
            single_lecture_h4_code.setAttribute("class", "single_lecture_h4");
            single_lecture_h4_code.innerHTML = today_array_of_objects[i]['sub_code'];
            single_lecture_top_row.appendChild(single_lecture_h4_code);


            //BUTTON END - finalised
            var open_link_copy_link = document.createElement("div");
            open_link_copy_link.setAttribute("class", "open_link_copy_link");

            // var open_page_btn = document.createElement("button");
            // open_page_btn.innerHTML = "Open Link";
            // open_link_copy_link.appendChild(open_page_btn);

            // var copy_btn = document.createElement("button");
            // copy_btn.innerHTML = "Copy Link"
            // open_link_copy_link.appendChild(copy_btn);

            var link_new = document.createElement("a");
            link_new.setAttribute("href",today_array_of_objects[i]['link']);
            link_new.setAttribute("target","_blank");
            link_new.innerHTML = today_array_of_objects[i]['link'];
            open_link_copy_link.appendChild(link_new);

            // <a href="#" target="_blank">https://meet.google.com/anc-sds-ada</a>

            single_lecture_main_parent.appendChild(single_lecture_top_row);
            single_lecture_main_parent.appendChild(open_link_copy_link);

            parent_.appendChild(single_lecture_main_parent);
            
          }
        })
      }
      else{
        chrome.tabs.getSelected(null, function(tab) {
          document.getElementById("todays_lecture_index").innerHTML = "No Lectures today";
        })
      }

    });
    

  // });



}, false);