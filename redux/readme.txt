
top row controls:
1-6	stop playback for groups 1-67-8	modifier 1 and 2
9-12	start/stop+erase pattern record
13	previous preset
14	next preset
15	set tempo (light indicates a mismatch between current and preset tempos)
16	master send1-6 (with mod 1 held)	decrease volume for group 1-61-6 (with mod 2 held)	increase volume for group 1-61-6 (with both mods held)	mute/unmute group 1-6 (momentary when held)

9-12 (with mod 1 held)	stop pattern without erasing9-12 (with mod 2 held)	overdub pattern (only works if pattern already recorded)9-12 (with both mods held)	record go, record punch-in, record previous, record next,
13 (with mod 1 held)	toggle group page14 (with mod 1 held)	toggle reverse page15 (with mod 1 held)	toggle loop length page13 (with mod 2 held)	toggle octave page14 (with mod 2 held)	toggle file pagepress both mod buttons to exit pages.15 (with mod 2 held)    tap tempo

13 (with both mods held) global octave -
14 (with both mods held) global octave +
15 (with both mods held) global reverse

——————————————————————————

for 64: 
1-4	stop playback for groups 1-45-6	pattern recorders
7-8	modifier 1 and 2
1-4 (with mod 1 held)	decrease volume for group 1-41-4 (with mod 2 held)	increase volume for group 1-41-4 (with both mods held)	mute/unmute group 1-4 (momentary when held)
5-6 (with mod 1 held)	stop pattern without erasing5-6 (with mod 2 held)	overdub pattern (only works if pattern already recorded)
5-6 (with both mods held)   preset - +

64 mode switch is in the setup tab. be sure to enable *before loading your set.
————————————————————

Be sure to always stop/start the transport after loading redux.amxd or it will be out of sync.


Drop audio files anywhere on device to load. drop individual files directly on a row for instant loading.

master send button modes. (labeled o and i on the floating window, below the sends)

o- by turning master send on, master send will engage on the next sample trigger.
i- by turning master send off, master send will disengage on the next sample trigger.

by default master send will engage/disengage immediately.

pattern recorders now record inner loops, reverse, octave +-, group stop, group mute.

holding a button, then pressing a button to the left on the row now triggers group stop.

holding a button, then pressing any three buttons on a row now triggers reverse.

copy/paste row settings- click the row number to copy. click another row’s step 1 to paste.

save button-click row number then ‘save’ to save sample to disk.

use midi.amxd for getting midi to/from mlr.

note- there’s an little grey button to the right of each row pan fader that will reset the row’s vol to 0db.

the grey dot in each row’s speed col sets the row’s speed to 1. (useful for oneshots you don’t want re-pitched)

***midi.amxd- recieves all your button presses from redux and it sends them out as midi. this can be recorded into an ableton track, then played back (output back into the midi.amxd) sort of like automation.

you can use the midi.amxd to send the midi wherever u like, but the most obvious use is for recording/editing performances.

since midi only has 128 values, you need to use midi256.amxd for the bottom 8 rows of 256.
