const axios = require('axios');

let accessToken = "EAACrvN89NZBUBOwEVSqKZC0tdSZBKl5fZAsDBIATV9ZAYZAz1T2t63QG3mcdqPrBZCJ8inkzZAZBybFnI6l6BOoPacqlNzCGLuHKaZCAqajf89ELrJInJtWsZC12xZAW7nHsFRw0I84m3SloczLRybotWZAfLXBODAuIZBSN6V2RMSiHmjtDg2NHMIR8QJZBXOVDqLZCXUrLPp87ZC4375J4sOI57oc3ZAuIPEYRxtPeltGpwZD";   
const pageId = '122103253964000870';

axios.post(`https://graph.facebook.com/v10.0/${pageId}/container_create`, {
  access_token: accessToken
})
.then(response => {
  const containerId = response.data.id;

  console.log(containerId);
})
.catch(error => {
  console.error('Error creating container:', error);
});