const YAML = require('yamljs');
const twitter = require('twitter');
var { execFile } = require('child_process');

const config = YAML.load('./config.yml');
var client = new twitter(config.twitter);

function remove(id) {
    console.log('remove', id);
    client.post(`statuses/destroy/${id}`, {}, (err, _, response) => {
        if (err) console.log(err);
    });
}

function protected(text) {
    if (config.protect) {
        var w;
        for (w of config.protect) {
            if (text.indexOf(w) >= 0) return true;
        }
    }
    return false;
}

(function () {

    var suicide = () => {
        console.log("Good bye, world");
        process.exit();
    };

    var last_time = (new Date()).getTime();

    client.stream('user', {}, (stream) => {

        setInterval(() => {
            var now = (new Date()).getTime();
            var dmin = (now - last_time) / 1000 / 60;
            if (dmin > 10) suicide();
        }, 60);

        console.log('ready');

        stream.on('data', (json) => {
            last_time = (new Date()).getTime();
        });

        stream.on('event', (json) => {
            if (json.event !== 'favorite') return;
            if (json.target_object.user.screen_name !== config.twitter.username) return;
            var id = json.target_object.id_str;
            var text = json.target_object.text;
            console.log(`${json.source.screen_name} favorite ${id}: ${text}`);

            if (protected(text)) {
                console.log('Protected');
            } else {
                remove(id);
            }
        });

        stream.on('end', () => suicide());
        stream.on('disconnect', () => suicide());
        stream.on('destroy', () => suicide());
        stream.on('close', () => suicide());
        stream.on('error', () => suicide());
    });

}());
