let featureLabels = ['Has IP instead of domain','Long Url','Url shortening service','Has @ symbol','Has "//" in Url','Has "-" in Url',
'Has multiple subdomains','Domain registration length','Has favicon','Has HTTP||HTTPS in domain','Has too many request Urls',
'Has too many anchor Urls','Has too many links to other domains','Has forms that are blank or linked to other domains',
'Submits information to email','Host name not included in Url','Uses iFrame','Age of domain','Has DNS records',
'Has website traffic in Alexa Database','Is in Google Index','PhishTank , StopBadware statistical report']

/*
safe=#28A745
danger=#DC3545
warning=#FFC107

*/
document.addEventListener('DOMContentLoaded', function() {
    let checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {
        $(this).attr("disabled", true);
        $(this).addClass('buttonLoader')
        $(this).text('')
       
      chrome.tabs.getSelected(null, function(tab) {
                    // Sending and receiving data in JSON format using POST method
            //
            let xhr = new XMLHttpRequest();
            let url = "http://localhost:3000/detectphishing";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    
                    let json = JSON.parse(xhr.responseText);


                    if(json.hasOwnProperty('error')){
                        $('#errorSection').show();
                        switch (json.error) {
                            case 'ERROR_NEWTAB':
                                $('#errorMessage').empty()
                                $("#errorMessage").append('<div class="col-12 alert alert-info text-center animate__animated animate__slideInLeft" role="alert">You must browse to a website in order to scan it!</div>')
                                $("#checkPage").removeClass('buttonLoader')
                                $("#checkPage").text('Scan this site')
                                $("#checkPage").attr("disabled", false);
                                break;
                        
                            default:
                                $('#errorMessage').empty()
                                $("#errorMessage").append('<div class="col-12 alert alert-info text-center animate__animated animate__slideInLeft" role="alert">Something went wrong!</div>')
                                $("#checkPage").removeClass('buttonLoader')
                                $("#checkPage").text('Scan this site')
                                $("#checkPage").attr("disabled", false);
                                break;
                        }

                    }else{
                        $('#detailsSection').show();

                        if(json.prediction == 1){
                           // $("#prediction").append('<div class="col-12 safe">We predict this site is safe to browse.</div>')
                           $('#prediction').empty()
                           $("#prediction").append('<div class="col-12 alert alert-success text-center animate__animated animate__slideInLeft" role="alert">We predict this site is safe to browse.</div>')
                            $('#checkPage').removeClass()
                            $('#checkPage').addClass('btn btn-success')
                        }else {
                            $('#prediction').empty()
                            $("#prediction").append('<div class="col-12 alert alert-danger text-center animate__animated animate__slideInLeft" role="alert">We predict this site is NOT safe to browse! Continue at your own risk.</div>')
                            $('#checkPage').removeClass()
                            $('#checkPage').addClass('btn btn-danger')
                        }
                        
                        let progressBarColor = ''
                        if(json.probability[0][0] < 0.45){
                            progressBarColor = '#28A745'
                        }else if(json.probability[0][0] >= 0.45 && json.probability[0][0] < 0.5){
                            progressBarColor ='#FFC107'
                        }else {
                            progressBarColor ='#DC3545'
                        }
                        
                        // Progress Bar block code
                        $('#progressBarContainer').empty()
                        let bar = new ProgressBar.Circle(progressBarContainer, {
                            color: progressBarColor,
                            // This has to be the same size as the maximum width to
                            // prevent clipping
                            strokeWidth: 5,
                            trailWidth: 2,
                            easing: 'bounce',
                            duration: 1400,
                            text: {
                            autoStyleContainer: false
                            },
                            from: { color: progressBarColor, width: 1 },
                            to: { color: progressBarColor, width: 5 },
                            // Set default step function for all animate calls
                            step: function(state, circle) {
                            circle.path.setAttribute('stroke', state.color);
                            circle.path.setAttribute('stroke-width', state.width);
                            //circle.value = json.probability[0][0]
                            var value = Math.round(circle.value() * 100);
                            if (value === 0) {
                                circle.setText('0');
                            } else {
                                circle.setText(value+'%');
                            }
                        
                            }
                        });
                        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                        bar.text.style.fontSize = '2rem';
                        
                        bar.animate(json.probability[0][0]);  // Number from 0.0 to 1.0
                        let i=0
                        let j=0
                        $('#features').empty()
                        json.features[0].forEach(element => {
                            let animation= i == 0 || i%2==0 ? 'animate__slideInLeft' : 'animate__slideInRight' 
                            if(i%2==0)
                              j++ 
                            if(element == -1){
                                $('#features').append('<div class="alert alert-danger col-5 animate__animated '+animation+' animate__delay-1s">'+featureLabels[i]+'</div>')
                            }else if(element == 1){
                                $('#features').append('<div class="alert alert-success col-5 animate__animated '+animation+' animate__delay-1s">'+featureLabels[i]+'</div>')
                            }else{
                                $('#features').append('<div class="alert alert-warning col-5 animate__animated '+animation+' animate__delay-1s">'+featureLabels[i]+'</div>')
                            }
                            i++
                        });
                        $("#checkPage").removeClass('buttonLoader')
                        $("#checkPage").text('Scan this site')
                        $("#checkPage").attr("disabled", false);
                    }
                    

                }       
            };
            var data = JSON.stringify({"url": tab.url});
            xhr.send(data);
      });
    }, false);
  }, false);