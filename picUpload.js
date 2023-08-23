let axios = require("axios");

let accessToken = "EAACrvN89NZBUBOwEVSqKZC0tdSZBKl5fZAsDBIATV9ZAYZAz1T2t63QG3mcdqPrBZCJ8inkzZAZBybFnI6l6BOoPacqlNzCGLuHKaZCAqajf89ELrJInJtWsZC12xZAW7nHsFRw0I84m3SloczLRybotWZAfLXBODAuIZBSN6V2RMSiHmjtDg2NHMIR8QJZBXOVDqLZCXUrLPp87ZC4375J4sOI57oc3ZAuIPEYRxtPeltGpwZD";   
let pageId = "17841461603080719";




const sendRequest = async () => {
    const baseUrl = "https://[YOUR_DOMAIN]/17841461603080719/media";
    const params = {
      image_url: "https://i.redd.it/7ckvugblyrhb1.jpg",
      caption: ""
    };
  
    try {
      const response = await axios.get(baseUrl, { params });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  executeRequests();