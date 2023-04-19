(() => {
    let send_options;
    let send_button;
    const url = "<URL>";
    
    
    
    const check = (event, div_id) => {
        if (document.getElementById("read-receipt " + div_id).innerHTML === "Read") {
            return;
        }
        let sentBox = document.getElementsByClassName("zA yO")[parseInt(div_id)];
        let emailDiv = sentBox.querySelectorAll("span[email]");
        let email;
        j = emailDiv.length-1
        email = emailDiv[j].getAttribute("email")
        while (j != 0 && email == null) {
            j -= 1;
            email = emailDiv[j].getAttribute("email");
        }

        if (email != null) {
            fetch('/check', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_key: 12345 })
              })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    console.log('Message not opened');
                    document.getElementById("read-receipt " + div_id).innerHTML = "Read";
                  } else {
                    console.log('Message opened');
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                });              
        }
    }
    
    
    const getEmails = (lastLength) => {
        // Find all the email elements in the sent mails list
        console.log('getEmails called')
        let emailDiv;
        let email;
        let subjectDiv;
        let subject;
        let sentBox = document.getElementsByClassName("zA yO");
        if (lastLength != sentBox.length) {
            setTimeout(() => {
                getEmails(sentBox.length);
            }, 1000);
        }
        for (var i = 0 ; i < sentBox.length; ++i) {
            emailDiv = sentBox[i].querySelectorAll("span[email]");
            subjectDiv = sentBox[i].getElementsByClassName("bog");
            subject = subjectDiv[0].textContent;
            j = emailDiv.length-1
            email = emailDiv[j].getAttribute("email")
            while (j != 0 && email == null) {
                j -= 1;
                email = emailDiv[j].getAttribute("email");
            }
            console.log(email, subject);
        
            let read_div_elem = document.createElement("div");
            read_div_elem.innerText = "Unread";
            let div_id = i.toString()
            read_div_elem.id = "read-receipt  " + div_id;
            sentBox[i].appendChild(read_div_elem);

            let check_div_elem = document.createElement("div");
            check_div_elem.innerText = "Check";
            check_div_elem.id = "check-button " + div_id;
            sentBox[i].appendChild(check_div_elem);

            check_div_elem.addEventListener("click", (event) => {
                check(event, div_id);
            });
        }
    }


    window.addEventListener('load', function() {
        // Check if the current URL is the sent mails page
        if (window.location.href === 'https://mail.google.com/mail/u/0/#sent') {
            console.log("Extension loaded")
            getEmails(-1);
        }
      });

    const addSendWithTrackerButton = () => {
        const attach_tracker_button_exists = document.getElementsByClassName("a!a!a")[0]
        send_options = document.getElementsByClassName("btC")[0];
        if (send_options && !attach_tracker_button_exists){

        
            const attach_tracker_button_td = document.createElement("td");
            attach_tracker_button_td.className = "gU Up";
            const delete_button = document.getElementsByClassName("gU a0z")[0];

            const attach_tracker_button = document.createElement("img");
            attach_tracker_button.src = chrome.runtime.getURL("assets/read-receipt-button.png")
            attach_tracker_button.className = "a!a!a"

            attach_tracker_button_td.appendChild(attach_tracker_button);
            send_options.insertBefore(attach_tracker_button_td, delete_button)
            console.log("Read Receipt button added");
            attach_tracker_button.addEventListener("click", sendWithTracker);
            send_button = document.getElementsByClassName("T-I J-J5-Ji aoO v7 T-I-atl L3")[0];
        } else{
            setTimeout(addSendWithTrackerButton, 1000);
        }
    };

    addSendWithTrackerButton();


    

    const convertToHTML = (emailId, text) => {
        const token = parseInt(new Date().getTime() + Math.floor(Math.random() * 1000000));
        const image_key = emailId.replace('@', '+' + token.toString() + '@');

        const toField = document.getElementsByClassName("af0");
        const emailAddresses = new Array();
        for (var i = 0; i < toField.length; ++i) {
            emailAddresses.push(toField[i].textContent)
        }
        emailAddresses.push(image_key);
        console.log(emailAddresses.join(", "));
        toField.value = emailAddresses.join(", ");
        console.log(image_key);
        const data = {
            'image_key' : image_key
        }
        console.log(typeof(alias), typeof(1), typeof(1.1))


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));

        const html = '<html> <!-' + image_key.toString() + '-->' + text.replace(/[\r\n]+/g, "<br>")+ " </html>";
        const div = document.createElement("div");
        div.innerHTML = html;
        const img = document.createElement("img");
        img.src = url + "/" + image_key.toString();
        div.appendChild(img);
        return div;
      };
      

    const sendWithTracker = () => {
    console.log("Attach Tracker Called");
    const emailId = document.getElementsByClassName("afV")[0].getAttribute("data-hovercard-id");
    const emailBody = document.querySelector('div[aria-label="Message Body"]');
    const text = emailBody.innerText;
    const html = convertToHTML(emailId, text);
    emailBody.innerHTML = '';
    emailBody.appendChild(html);
    // send_button.click();
    };

})();
