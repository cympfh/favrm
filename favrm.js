const YAML = require('yamljs');
const twitter = require('twitter');

const config = YAML.load('./config.yml');
var client = new twitter(config.twitter);

function remove(id) {
    console.log(`Removing ${id}`);
    client.post(`statuses/destroy/${id}`, {}, (err, _, response) => {
        if (err) console.log(err);
        console.log(`done`);
    });
}

function protected(event) {
    if (config.protect) {
        if (config.protect.keywords) {
            const text = event.target_object.text;
            for (var i = 0; i < config.protect.keywords.length; ++i) {
                if (text.indexOf(config.protect.keywords[i]) >= 0) {
                    return true;
                }
            }
        }
        if (config.protect.has_media === true) {
            if (event.target_object.entities && event.target_object.entities.media) {
                return true;
            }
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

        console.log('Ready');

        stream.on('data', (event) => {
            last_time = (new Date()).getTime();
        });

        stream.on('event', (event) => {
            if (event.event !== 'favorite') return;
            if (event.target_object.user.screen_name !== config.twitter.username) return;
            var id = event.target_object.id_str;
            var text = event.target_object.text;
            console.log(`Event: ${event.source.screen_name} favorite ${id}: ${text}`);

            if (protected(event)) {
                console.log('Protected tweet');
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
