var mpdParser = require('mpd-parser');



(async()=> {

    const manifestUri = 'https://v.redd.it/7998dmt69igb1/DASHPlaylist.mpd';
    const res = await fetch(manifestUri);
    const manifest = await res.text();
    var parsedManifest = mpdParser.parse(manifest, { manifestUri });

    console.log(parsedManifest.mediaGroups.AUDIO.audio.main.playlists[0].sidx.uri);
})();
