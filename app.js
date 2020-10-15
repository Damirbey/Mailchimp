const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/index.html");
})

app.post("/failure",(req,res)=>{
  res.redirect("/");
})

app.post("/",(req,res)=>{
  var name = req.body.firstName;
  var surname = req.body.lastName;
  var email = req.body.email;
  var appiKey = "*********";
  var listID = "*********";
  var url = "https://us2.api.mailchimp.com/3.0/lists/"+listID;

  var data={
        members:[
        {
          email_address:email,
          status:"subscribed",
          merge_fields: {
            FNAME:name,
            LNAME:surname
          }
        }
      ]
    }
  var jsonData = JSON.stringify(data);
  var options={
    method:"POST",
    auth:"dydamirbey:"+appiKey
  }

  var request = https.request(url,options,function(response){

    if(response.statusCode === 200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
      response.on("data",(data)=>{
        console.log(JSON.parse(data));
      })
  })

  request.write(jsonData);
  request.end();

})


app.listen(process.env.PORT || 3000, function(){
  console.log("Application is running on port "+3000);
})
