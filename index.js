var axios = require("axios");
var config = require("./config")
require("colors")
var headers = {
    'authority': 'business.facebook.com',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': "Windows",
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1'
}
class Share {
    getToken() {
        return new Promise((resolve, reject) => {
            headers['cookie'] = config['cookies']
            axios.get('https://business.facebook.com/content_management', {
                headers: headers
            }).then(res => {
                var accessToken = 'EAAG' + res.data.split('EAAG')[1].split('","')[0]
                resolve({
                    accessToken: accessToken,
                    cookie: headers['cookie']
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
    share(token, cookie) {
        delete headers.authority;
        delete headers.accept;
        delete headers['accept-language'];
        headers['accept-encoding'] = 'gzip, deflate';
        headers['host'] = 'graph.facebook.com'
        headers['cookie'] = cookie
        setInterval(function () {
            axios({
                method: 'POST',
                url: `https://graph.facebook.com/me/feed?link=https://m.facebook.com/${config['id']}&published=0&access_token=${token}`,
                headers: headers
            }).then(res => {
                console.log('[ SUCCESS ]: '.brightWhite + `${res.data.id}`.brightGreen)
            }).catch(err =>{
                console.log("[ ERROR ]:".brightWhite + "Bị block tính năng!".brightRed)
            })
        }, 1000)
    }
}

const test = new Share();
test.getToken().then(res => {
    var access_token = res['accessToken'], cookie = res['cookie'];
    test.share(access_token, cookie)
})
