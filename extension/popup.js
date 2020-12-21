let featureLabels = ['Has IP instead of domain','Long Url','Url shortening service','Has @ symbol','Has "//" in Url','Has "-" in Url',
'Has multiple subdomains','Domain registration length','Has favicon','Has HTTP||HTTPS in domain','Has too many request Urls',
'Anchor URLs','Has too many links to other domains','Has forms that are blank or linked to other domains',
'Submits information to email','Host name not included in Url','Uses iFrame','Age of domain','Has DNS records',
'Has website traffic in Alexa Database','Is in Google Index','PhishTank , StopBadware statistical report']

/*let featureImportances = [0.02028601 ,0.01241364 ,0.00973127, 0.00777288, 0.0068409,  0.06719891
    ,0.10480104 ,0.02319245, 0.01229527, 0.00863143, 0.02741843, 0.40687722
    ,0.06062731, 0.03264948, 0.00925056, 0.00751179, 0.00606805, 0.02217081
    ,0.01918039, 0.10794734, 0.01880391, 0.00833091]*/

 let featureImportances = [0.01597467 ,0.00574401 ,0.00333786, 0.00318408, 0.00205337, 0.04914518
        ,0.05074627 ,0.01929444 ,0.00558118, 0.00343736 ,0.01915875 ,0.23754862
        ,0.04634102, 0.01956581, 0.00456807 ,0.0027318 , 0.00279512, 0.02222524
       , 0.01639077 ,0.05979195 ,0.01564903 ,0.00340118]
       
   
function compare( a, b ) {
    if ( a.featureImportance < b.featureImportance ){
      return 1;
    }
    if ( a.featureImportance > b.featureImportance ){
      return -1;
    }
    return 0;
  }


  
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
        let FeaturesResult= new Array()
       
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

                        if(json.prediction == 1 && json.probability[0][0] < 0.30){
                           // $("#prediction").append('<div class="col-12 safe">We predict this site is safe to browse.</div>')
                           $('#prediction').empty()
                           $("#prediction").append('<div class="col-12 alert alert-success text-center animate__animated animate__slideInLeft" role="alert">We predict this site is SAFE to browse.</div>')
                            $('#checkPage').removeClass()
                            $('#checkPage').addClass('btn btn-success')
                        }else if(json.prediction == 1 && json.probability[0][0] >= 0.30){
                            $('#prediction').empty()
                            $("#prediction").append('<div class="col-12 alert alert-warning text-center animate__animated animate__slideInLeft" role="alert">We predict this site is SUSPICIOUS to browse! Continue at your own risk.</div>')
                            $('#checkPage').removeClass()
                            $('#checkPage').addClass('btn btn-danger')
                        }else {
                            $('#prediction').empty()
                            $("#prediction").append('<div class="col-12 alert alert-danger text-center animate__animated animate__slideInLeft" role="alert">We predict this site is NOT SAFE to browse! We recommend to close this site.</div>')
                            $('#checkPage').removeClass()
                            $('#checkPage').addClass('btn btn-danger')
                        }
                        
                        let progressBarColor = ''
                        if(json.probability[0][0] < 0.30){
                            progressBarColor = '#28A745'
                        }else if(json.probability[0][0] >= 0.30 && json.probability[0][0] < 0.5){
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
                            let tempE= {featureLabel:featureLabels[i],featureImportance:featureImportances[i],featureResult:element}
                            FeaturesResult.push(tempE)
                            i++
                        })
                        


                        FeaturesResult.sort(compare)
                       

                        FeaturesResult.forEach(element => {
                            let animation= j == 0 || j%2==0 ? 'animate__slideInLeft' : 'animate__slideInRight' 
                            let ratingScore 
                            if(element.featureImportance*100 > 20){
                                ratingScore="&#9733;&#9733;&#9733;&#9733;&#9733;"
                                //ratingScore="★★★★★"
                            }else if(element.featureImportance*100 > 5){
                                ratingScore="&#9733;&#9733;&#9733;"
                                //ratingScore="★★★"
                            }else if(element.featureImportance*100 > 2){
                                ratingScore="&#9733;&#9733;"
                                //ratingScore="★"
                            }else{
                                ratingScore="&#9733;"
                            }
                            if(element.featureResult == -1){
                                $('#features').append('<div class="alert alert-danger col-5 animate__animated '+animation+' animate__delay-1s"><p class="text-right">*<small>'+ratingScore+'</small></p><p class="text-center">'+element.featureLabel+'</p></div>')
                            }else if(element.featureResult == 1){
                                $('#features').append('<div class="alert alert-success col-5 animate__animated '+animation+' animate__delay-1s"><p class="text-right">*<small>'+ratingScore+'</small></p><p class="text-center">'+element.featureLabel+'</p></div>')
                            }else{
                                $('#features').append('<div class="alert alert-warning col-5 animate__animated '+animation+' animate__delay-1s"><p class="text-right">*<small>'+ratingScore+'</small></p><p class="text-center">'+element.featureLabel+'</p></div>')
                            }
                           
                            
                            j++
                        })
                        
                        $("#checkPage").removeClass('buttonLoader')
                        $("#checkPage").text('Scan this site')
                        $("#checkPage").attr("disabled", false);
                    }
                }
                else if(xhr.status === 0){
                    $('#errorSection').show();
                    $('#errorMessage').empty()
                    $("#errorMessage").append('<div class="col-12 alert alert-info text-center animate__animated animate__slideInLeft" role="alert">Server unavailable!</div>')
                    $("#checkPage").removeClass('buttonLoader')
                    $("#checkPage").text('Scan this site')
                    $("#checkPage").attr("disabled", false);
                }      
            };
            var data = JSON.stringify({"url": tab.url});
            xhr.send(data);
      });
    }, false);
  }, false);