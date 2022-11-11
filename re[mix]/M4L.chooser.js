// M4L.chooser.js, menu control backend for the Poletti Chooser
// Jeremy Bernstein (jeremy@cycling74.com)
// © 2011 Cycling '74


autowatch = 1;

inlets = 2;
outlets = 4;

var MenuTypes = {
    none : { fun: null, name: "None", container: null },
    chain: { fun: null, name: "Chain", container: ["chains"], filterfun: filter_chain }, // only internal
    clip : { fun: iterate_clips_for_id, name: "Clip", container: ["clip_slots"] },
    clipaudio : { fun: iterate_audioclips_for_id, name: "Audio clip", container: ["clip_slots"] },
    clipmidi : { fun: iterate_midiclips_for_id, name: "MIDI clip", container: ["clip_slots"] },
    clipslot : { fun: iterate_clipslots_for_id, name: "Clip slot", container: ["clip_slots"], filterfun: filter_clipslot },
    cuepoint : { fun: iterate_cuepoints, name: "Cue point", container: ["cue_points", "live_set"], toplevel: true },
    device : { fun: iterate_devices_for_id, name: "Device", container: ["devices", "mixer_device", "return_tracks", "master_track"], filterfun: filter_device },
    parameter : { fun: iterate_parameters_for_id, name: "Parameter", container: ["parameters", "mixer_device\\s+\\S+"] },
    fparam : { fun: iterate_fparameters_for_id, name: "Param (float)", container: ["parameters", "mixer_device\\s+\\S+"], filterfun: filter_fparam },
    mixerparam : { fun: iterate_parameters_for_id, name: "Parameter", container: ["parameters", "mixer_device\\s+\\S+"] },
    scene : { fun: iterate_scenes, name: "Scene", container: ["scenes", "live_set"], toplevel: true },
    send : { fun: null, name: "Send", container: ["sends"] }, // only internal
    track : { fun: iterate_tracks, name: "Track", container: ["tracks", "master_track", "live_set"], filterfun: filter_track, toplevel: true },
    trackaudio : { fun: iterate_audiotracks, name: "Audio track", container: ["tracks", "master_track", "live_set"], filterfun: filter_track, toplevel: true },
    trackmidi : { fun: iterate_miditracks, name: "MIDI track", container: ["tracks", "master_track", "live_set"], filterfun: filter_track, toplevel: true },
    trackreturn : { fun: iterate_returntracks, name: "Return tracks", container: ["return_tracks", "live_set"], filterfun: filter_track, toplevel: true },
};

// NOTE "live_set master_track crossfader" & "live_set master_track cue_volume" result in "get path: error calculating the path" errors
// NOTE Observed device additions don't work (the new device appears with id 0, which is fairly useless). This appears to be a bug in Live, but I'm waiting for info.

var Root = "live_set";
var Listener = null;
var MenuAPI = null;

// set a default type. useful in some cases.
var LastType = jsarguments.length ? ((MenuTypes[jsarguments[1]]) ? MenuTypes[jsarguments[1]] : MenuTypes.none) : MenuTypes.none;
var LastArgs = undefined;
var LastData = undefined;

var observe = 1;
declareattribute("observe");
var master = 1;
declareattribute("master");
var mixer = 1;
declareattribute("mixer");
var returns = 1;
declareattribute("returns");
var autoloadtoplevel = 1;
declareattribute("autoloadtoplevel");

var TempAPI = new LiveAPI(); // uninitialized

/////////////////////////////////////////
// USER FUNCTIONS

// for these to work, the menu has to know what kind of menu it is, and what data it contains
function path(inpath) {
    if (arguments.length > 1) { // join args if necessary
        var arr = arrayfromargs(arguments);
        inpath = arr.join(" ");
    }

    if (!MenuAPI || !MenuAPI.menudata.length) {
        do_iterate();
        if ((!MenuAPI || !MenuAPI.menudata.length) && LastType != MenuTypes.none) { // we couldn't iterate, apparently
            // fallback code
            // analyze the path: does it contain a previous term that we _can_ iterate?
            var regexp = "^(.* \\d+).*?(" + LastType.container.join("|") + ").*?$";
            var re = new RegExp(regexp);
            var m = re.exec(inpath);

            if (m) { // we have a valid path
                TempAPI.path = m[1];
                do_iterate(TempAPI.id); // iterate on the previous term
            }
        }
    }

    //post("path: " + inpath + "\n");
    if (MenuAPI) { // we already have contents, and therefore a type
        var regexp = "^(.*(" + MenuAPI.mtype.container.join("|") + ")( \\d+)?)(.*?)$"
        var re = new RegExp(regexp);
        var m = re.exec(inpath);
        var match = false;

        if (m) { // it matches our type
            var localpath = m[1];
            //post("m[1]: " + m[1] + "\n");
            for (var i = 0; i < MenuAPI.menudata.length; i++) {
                if (MenuAPI.menudata[i].path == localpath) {
                    //post("matches index " + i + " of our menu\n");
                    outlet(0, i); // this will trigger a reset of the menu below us, in fact
                    if (!m[m.length-1].match(/^\s*?$/)) {
                        // pass the path on, there's more to parse
                        outlet(2, "path", inpath);
                    } else {
                        //don't reset again -- we sent a reset with the outlet(0) call above
                        //clear any objects below us
                        //outlet(2, "reset"); //send downstream to next M4L.chooser
                    }
                    match = true;
                    break;
                }
            }
        }
        if (!match) {
            if (inpath.match(/tracks/)) {
                inpath = tracks_to_scenes(inpath);
            } else if (inpath.match(/scenes/)) {
                inpath = scenes_to_tracks(inpath);
            } else {
                post("no match: " + inpath + "\n");
                return;
            }
            if (inpath != null) {
                path(inpath);
            }
        }
    }
}

function reset() {
    id(0);
}

function id(inid) {
    if (inid == 0 && (!LastType.toplevel || (LastType.toplevel == true && autoloadtoplevel == 0))) {
        menu_clear(MenuAPI);
        outlets_clear();
        LastData = undefined;
        return;
    }

    if (inid != 0) {
        TempAPI.id = inid;
        // no need to force iteration here.
        // the fallback code in path() will now find the parent of this "menu" and iterate it, if necessary.
        path(dequote(TempAPI.path));
    }
}

function msg_int(i) {
    if (MenuAPI) {
        if (i >= 0 && i < MenuAPI.menudata.length && MenuAPI.menudata[i].id != null) {
            //post("msg_int: " + MenuAPI.menudata[i].path + ", id: " + MenuAPI.menudata[i].id + " (" + parseInt(MenuAPI.menudata[i].id) + ")\n");
            outlet(2, "reset"); //send downstream
            outlet(1, parseInt(MenuAPI.menudata[i].id));
            menu_checks(MenuAPI, i);
        }
    }
}

function gettype() {
    outlet(3, LastType.name);
}

// generic iterate based on last (or default) type
function iterate(args) {
    do_iterate(args);
    // below is disabled -- not relevant for normal usage
/*
    var cld = LastData;
    
    do_iterate(args);
    if (cld !== undefined) {
        for (var i = 0; i < MenuAPI.menudata.length; i++) {
            if (MenuAPI.menudata[i].id == cld.id) {
                if (MenuAPI.menudata[i].name == "This Track" && MenuAPI.menudata[i].name != cld.name) continue;
                menu_set(MenuAPI, i);
                break;
            }
        }
    } 
*/
}

function do_iterate(args) {
    var fun;
    if (LastType != MenuTypes.none) {
        fun = LastType.fun;
    } else return;

    outlets_clear();
    LastArgs = args;
    fun(args);
}
do_iterate.local = 1;

function bang() {
    if (LastType != MenuTypes.none) {
        LastData = undefined;
        do_iterate(LastArgs);
    }
}

function iterate_tracks() {
    LastArgs = undefined;
    MenuAPI = new LiveAPIMenu(MenuTypes.track, Root);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_audiotracks() {
    LastArgs = undefined;
    MenuAPI = new LiveAPIMenu(MenuTypes.trackaudio, Root);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_miditracks() {
    LastArgs = undefined;
    MenuAPI = new LiveAPIMenu(MenuTypes.trackmidi, Root);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_returntracks() {
    LastArgs = undefined;
    MenuAPI = new LiveAPIMenu(MenuTypes.trackreturn, Root);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_devices_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.device, "id " + id);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_parameters_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.parameter, "id " + id);
    if (MenuAPI) {
        if (MenuAPI.path.match(/mixer_device/)) {
            MenuAPI.mtype = MenuTypes.mixerparam; // this is a special case
        }
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_fparameters_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.fparam, "id " + id);
    if (MenuAPI) {
        if (MenuAPI.path.match(/mixer_device/)) {
            MenuAPI.mtype = MenuTypes.mixerparam; // these are all floats, no additional filter necessary
        }
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_scenes() {
    LastArgs = undefined;
    MenuAPI = new LiveAPIMenu(MenuTypes.scene, Root);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_clips_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.clip, "id " + id);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_audioclips_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.clipaudio, "id " + id);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_midiclips_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.clipmidi, "id " + id);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_clipslots_for_id(id) {
    if (id == 0 || id === undefined) return;
    LastArgs = arrayfromargs(arguments);
    MenuAPI = new LiveAPIMenu(MenuTypes.clipslot, "id " + id);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

function iterate_cuepoints() {
    LastArgs = undefined;
    MenuAPI = new LiveAPIMenu(MenuTypes.cuepoint, Root);
    if (MenuAPI) {
        iterate_internal(MenuAPI, observe);
    }
}

/////////////////////////////////
// INTERNAL FUNCTIONS

function get_name(api) {
    var name = api.get("name");
    if (name == "" || name == undefined || !name) {
        name = "unnamed";
    }
    return name;
}
get_name.local = 1;

var thistrack = true;
function add_header(api) {
    if (thistrack == true && (api.mtype === MenuTypes.track || api.mtype === MenuTypes.trackaudio || api.mtype === MenuTypes.trackmidi || api.mtype === MenuTypes.trackreturn)) {
        // This Track
        api.path = "this_device canonical_parent";
        api.menudata.push({id: api.id, name: "This Track", path: dequote(api.path)});
        menu_separator(api);
        return true;
    } else if (api.mtype === MenuTypes.device) {
        var target = dequote(api.path);
        if (target.match(/.*?chains \d+$/)) { // always show the chain mixer (don't test for 'mixer')
            api.path = target + " mixer_device";
            api.menudata.push({id: api.id, name: "Chain Mixer", path: dequote(api.path)});
            return true;
        }
    }
    return false;
}
add_header.local = 1;

function add_footer(api) {
    var name;
    var rv = false;
    if (api.mtype === MenuTypes.track) {
        if (returns) {
            // hack
            var blt = LastType;
            var ret = new LiveAPIMenu(MenuTypes.trackreturn, Root, false);
            if (ret) {
                thistrack = false;
                iterate_internal_guts(ret, 0);
                thistrack = true;
            }
            if (ret.menudata.length) {
                menu_separator(api);
                api.menudata = api.menudata.concat(ret.menudata);
            }
            LastType = blt;
            ret.id = 0; // shut it down
            rv = true;
        }
        if (master) {
            if (api.menudata.length) {
                menu_separator(api);
            }
            api.path = Root + " master_track";
            api.menudata.push({id: api.id, name: api.get("name"), path: Root + " master_track"});
            rv = true;
        }
        return true;
    } else if (api.mtype === MenuTypes.device) {
        if (mixer && api.get("has_audio_output") == 1) {
            var path = dequote(api.path);
            if (api.menudata.length) {
                menu_separator(api);
            }
            api.path = path + " mixer_device";
            api.menudata.push({id: api.id, name: "Mixer", path: dequote(api.path)});
            rv = true;
        }
    } 
    return rv;
}
add_footer.local = 1;

function iterate_internal_mixerparam(api, obs) {
    var target = dequote(api.path);
    var name;

    menu_clear(api);
    var children = api.children;
    ////// hack to fix ableton broken output for k_epii_PathChildren
    var re = new RegExp(/.*?canonical_parent (.*?)$/);
    var m = re.exec(children.join(" "));
    if (m) children = m[1].split(" "); // this won't work for quoted terms, though, but it's a hack  anyway
    ////// end hack
    for (var i = 0; i < children.length; i++) {
        if (children[i] == "canonical_parent") continue;
        if (children[i] == "sends") { // have to iterate
            // hack
            var blt = LastType;
            var ret = new LiveAPIMenu(MenuTypes.send, target, false);
            if (ret) {
                iterate_internal_guts(ret, 0);
                for (var j = 0; j < ret.menudata.length; j++) {
                    ret.menudata[j].name = "Send " + ret.menudata[j].name;
                }
                api.menudata = api.menudata.concat(ret.menudata);
            }
            LastType = blt;
            ret.id = 0; // shut it down
            continue;
        }
        api.path = target + " " + children[i];
        name = (children[i].charAt(0).toUpperCase() + children[i].slice(1)).replace(/_/g, " ");
        api.menudata.push({id: api.id, name: name, path: target + " " + children[i]});
    }
    menu_output(api);
}
iterate_internal_mixerparam.local = 1;

function iterate_internal_clip(api, obs) {
    var target = dequote(api.path);
    var path;
    
    menu_clear(api);
    if (Listener == null) {
        Listener = new LiveAPI(cb);
    }
    if (obs == 1) {
        Listener.mtype = api.mtype;
        Listener.property = "";
        Listener.path = target;
        Listener.property = api.mtype.container[0];
    } else {
        if (add_header(api) === true) {
            api.path = target;
        }
        var count = api.getcount(api.mtype.container[0]);
        for (var i = 0; i < count; i++) {
            path = target + " " + api.mtype.container[0] + " " + i;
            api.path = path;
            if (api.get("has_clip") == 1) {
                api.path = path + " clip";
                if ((api.mtype === MenuTypes.clipaudio && api.get("is_audio_clip") == 1) ||
                    (api.mtype === MenuTypes.clipmidi && api.get("is_midi_clip") == 1) ||
                    api.mtype === MenuTypes.clip)
                {
                    var name = get_name(api);
                    api.menudata.push({id: api.id, name: name, path: target + " " + api.mtype.container[0] + " " + i});
                }
            }
        }
        api.path = target;
        add_footer(api);
        menu_output(api);
    }
}
iterate_internal_clip.local = 1;

function iterate_internal_guts(api, obs) {
    var target = dequote(api.path);

    if (Listener == null) {
        Listener = new LiveAPI(cb);
    }
    if (obs == 1) {
        Listener.mtype = api.mtype;
        Listener.property = "";
        Listener.path = target;
        Listener.property = api.mtype.container[0];
        return false;
    } else {
        if (add_header(api) === true) {
            api.path = target;
        }
        var count = api.getcount(api.mtype.container[0]);
        //post(count + " " + api.mtype.name + "\n");
        for (var i = 0; i < count; i++) {
            api.path = target + " " + api.mtype.container[0] + " " + i;
            if (api.mtype.filterfun && api.mtype.filterfun(api) == false) continue;
            var name = get_name(api);
            api.menudata.push({id: api.id, name: name, path: target + " " + api.mtype.container[0] + " " + i});
        }
        api.path = target;
        add_footer(api);
    }
    return true;
}
iterate_internal_guts.local = 1;

function iterate_internal(api, obs) {
    if (api.mtype === MenuTypes.clip || api.mtype === MenuTypes.clipaudio || api.mtype === MenuTypes.clipmidi) {
        return iterate_internal_clip(api, obs);
    } else if (api.mtype === MenuTypes.mixerparam) {
        return iterate_internal_mixerparam(api, obs);
    }
    menu_clear(api);
    if (iterate_internal_guts(api, obs) == true) {
        menu_output(api);
    }
}
iterate_internal.local = 1;

function filter_track(api) {
    if ((api.mtype === MenuTypes.trackaudio && api.get("has_audio_input") == 1) ||
        (api.mtype === MenuTypes.trackmidi && api.get("has_midi_input") == 1) ||
        api.mtype === MenuTypes.track || api.mtype === MenuTypes.trackreturn)
    {
        return true;
    }
    return false;
}
filter_track.local = 1;

function filter_clipslot(api) {
    var target = dequote(api.path);
    var name = parseInt(target.match(/.*?(\d+)$/)[1]) + 1;
    
    api.menudata.push({id: api.id, name: name, path: target})
    return false;
}
filter_clipslot.local = 1;

// this is an abuse of the filter functionality, but what the hell
// we're going to use this to add device chains to the menu, if they exist
var DeviceIter = 0; // ugly global variable usage here.
function filter_device(api) {
    var children = api.children;
    if (!children.join(" ").match(/\s+?chains\s+/)) {
        return true; // no chains, no problem
    }
    var blt = LastType;
    var target = dequote(api.path);
    var chains = new RecursiveAPIMenu(MenuTypes.chain, target);
    if (chains) {
        api.menudata.push({id: api.id, name: api.get("name"), path: target});
        DeviceIter++;
        iterate_internal_guts(chains, 0);
        DeviceIter--;
        if (DeviceIter == 0) {
            for (var i = 0; i < chains.menudata.length; i++) {
                var iter = chains.menudata[i].path.match(/\s+?chains\s+/g);
                var spacing = "";
                for (var j = 0; j < iter.length; j++) {
                    spacing += "-";
                }
                if (spacing != "") spacing += " ";
                chains.menudata[i].name = /*'"' +*/ spacing + chains.menudata[i].name /*+ '"'*/;
            }
        }
        api.menudata = api.menudata.concat(chains.menudata);
        RecursiveAPIMenuDispose(chains);
    }
    LastType = blt;
    return false;
}
filter_device.local = 1;

function filter_chain(api) {
    var children = api.children;
    if (!children.join(" ").match(/\s*?devices\s*?/)) {
        return true; // no devices, no problem
    }
    var blt = LastType;
    var devs = new RecursiveAPIMenu(MenuTypes.device, dequote(api.path));
    if (devs) {
        var bmx = mixer;
        mixer = 0;
        iterate_internal_guts(devs, 0);
        mixer = bmx;
        api.menudata = api.menudata.concat(devs.menudata);
        RecursiveAPIMenuDispose(devs);
    }
    LastType = blt;
    return false; // don't add the chains themselves, just the devices
}
filter_chain.local = 1;

function filter_fparam(api) {
    if (api.get("is_quantized") == 0) {
        return true;
    }
    return false;
}
filter_fparam.local = 1;

function dequote(string) {
    return string.replace(/\"/g, "");
}
dequote.local = 1;

function menu_separator(api) {
    api.menudata.push({id: null, name: "-", path: ""});
}
menu_separator.local = 1;

function menu_clear(api) {
    outlet(0, "clear");
    outlet(0, "fontface","italic");
    outlet(0, "textcolor", 0.42, 0.45, 0.53, 1.);
    if (api) {
        api.menudata.splice(0, api.menudata.length);
    }
    //LastData = undefined;
}
menu_clear.local = 1;

function menu_output(api) {
    for (var i = 0; i < api.menudata.length; i++) {
        outlet(0, "append", api.menudata[i].name);
    }
}
menu_output.local = 1;

function menu_checks(api, i) {
    if (api) {
        outlet(0, "fontface", "regular");
        outlet(0, "textcolor", 0.09, 0.11, 0.14, 1.);
        outlet(0, "clearchecks");
        outlet(0, "checkitem", i);
        LastData = api.menudata[i];
    }
}
menu_checks.local = 1;

function menu_set(api, i) {
    outlet(0, "set", i);
    menu_checks(api, i);
}
menu_set.local = 1;

function outlets_clear() {
    outlet(2, "reset"); //send downstream
    outlet(1, 0); // we just got cleared, send id 0
}
outlets_clear.local = 1;

function cb(args) {
    var a = arrayfromargs(args);
    if (a[0] === "id") {
        //post("got id " + a[1] + "\n");
    } else {
        //post("'" + this.mtype.container[0] + "'" + "\n");
        //post("'" + a + "'" + "\n");
        if (a[0] === this.mtype.container[0]) { // just to be sure
            var cld = LastData;
            MenuAPI = new LiveAPIMenu(this.mtype, "id " + this.id); // replace contents
            if (MenuAPI) {
                iterate_internal(MenuAPI, 0);
            }
            if (cld !== undefined) {
                for (i = 0; i < MenuAPI.menudata.length; i++) {
                    if (MenuAPI.menudata[i].id == cld.id) {
                        if (MenuAPI.menudata[i].name == "This Track" && MenuAPI.menudata[i].name != cld.name) continue;
                        menu_set(MenuAPI, i);
                        break;
                    }
                }
            }
        }
    }
}
cb.local = 1;

// these two functions take a path to a clip and convert it into the "other direction"
function tracks_to_scenes(inpath, inid) {
    inpath = dequote(inpath);
    var re = new RegExp(/(.*?)tracks (\d+) clip_slots (\d+) clip/);
    var m = re.exec(inpath);
    
    if (m == null) {
        return null;
    } else {
        var outpath = m[1] + "scenes " + m[3] + " clip_slots " + m[2] + " clip";
        if (inid) { // if we want to be sure that it's there
            TempAPI.path = outpath;
            if (TempAPI.id == inid) {
                return outpath;
            }
        } else return outpath;
    }
    return null;
}
tracks_to_scenes.local = 1;

function scenes_to_tracks(inpath, inid) {
    inpath = dequote(inpath);
    var re = new RegExp(/(.*?)scenes (\d+) clip_slots (\d+) clip/);
    var m = re.exec(inpath);
    
    if (m == null) {
        return null;
    } else {
        var outpath = m[1] + "tracks " + m[3] + " clip_slots " + m[2] + " clip";
        if (inid) { // if we want to be sure that it's there
            TempAPI.path = outpath;
            if (TempAPI.id == inid) {
                return outpath;
            }
        } else return outpath;
    }
    return null;    
}
scenes_to_tracks.local = 1;

var GlobalAPIMenu = new LiveAPI(); // uninitialized
GlobalAPIMenu.menudata = new Array();

var TempAPIMenu = new LiveAPI(); // uninitialized
TempAPIMenu.menudata = new Array();

var TempRecursiveAPIMenu = new Array(); // don't populate unless needed
var TempRecursiveAPIMenuLevel = 0;

function RecursiveAPIMenu(type, path)
{
    var api;
    
    // get the next item in the recursive array
    if (TempRecursiveAPIMenuLevel < TempRecursiveAPIMenu.length) {
        api = TempRecursiveAPIMenu[TempRecursiveAPIMenuLevel];
    } else {
        api = new LiveAPI();
        api.menudata = new Array();
        TempRecursiveAPIMenu[TempRecursiveAPIMenuLevel] = api;
    }
    TempRecursiveAPIMenuLevel++;
    
    if (api) {
        // check for an "id" path -- we can't use it directly
        var id = /^id (\d+)$/.exec(path);
        if (id) {
            api.id = parseInt(id[1]);
        } else {
            api.path = path;
        }
        api.mtype = type;
        LastType = type;
        api.menudata.splice(0, api.menudata.length);
    }
    return api;
}

function RecursiveAPIMenuDispose(api)
{
    if (TempRecursiveAPIMenuLevel <= 0) return;
    
    if (TempRecursiveAPIMenu[TempRecursiveAPIMenuLevel-1] == api) {
        api.id = 0;
        api.mtype = MenuTypes.none;
        api.menudata.splice(0, api.menudata.length);
        TempRecursiveAPIMenuLevel--;
    }
}

function LiveAPIMenu(type, path, global)
{
    var api;
    
    if (global == true || global === undefined) {
        api = GlobalAPIMenu;
    } else {
        api = TempAPIMenu;
    }
    
    if (api) {
        // check for an "id" path -- we can't use it directly
        var id = /^id (\d+)$/.exec(path);
        if (id) {
            api.id = parseInt(id[1]);
        } else {
            api.path = path;
        }
        api.mtype = type;
        LastType = type;
        api.menudata.splice(0, api.menudata.length);
    }
    return api;
}
