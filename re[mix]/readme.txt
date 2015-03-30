The Group1-6 .amxd's are the audio outputs for each group. If u don't load them, you won't get audio for those groups (or led movement). re:mix is multichannel so u load these on separate audio tracks. u can change the color of your group output tracks to color-code your groups on the re:mix interface.
————————————————————
macro control- just like your group1-6 track's sends, re:mix is able to control the first 8 controls on each track's devices (intended for effect rack macros). to get this working- drop an effect rack on each group's track ('example macros' effect rack included), then click refresh any group.amxd for re:mix to gain focus. if u load a Live set with your tracks already set up with effect racks, refreshing isn't necessary.

the 8 dials in the sampler window to the right of your sends are your macro settings. these, just like with sends, can be different values for each row.
————————————————————
input.amxd- place this on the track you want to record. you can load multiple instaces on different tracks, and each can be set to record to a different input buffer (1-8) in re:mix
————————————————————
midi in/out- re:mix recieves all press data and outputs it as midi if midi out is enabled. you can also send midi to the device to trigger press data. since midi only has 128 values, you need to use the additional midi256.amxd for the bottom 8 rows of a 256.
————————————————————
click Tips in the setup tab to see keyboard shortcuts!

128/256 top row controls:
1-6	stop playback for groups 1-67-8	modifier 1 and 2 (press both mod buttons to exit pages)
9-12	start/stop+erase pattern record
13	previous preset (mod 3 when held)
14	next preset (mod 4 when held)
15	macros toggle (can be momentary when held) (pattern recordable)
16	sends toggle (can be momentary when held)Mods1-6 (with mod 1 held)	decrease volume for group 1-61-6 (with mod 2 held)	increase volume for group 1-61-6 (with both mods 1+2 held) mute/unmute group 1-6 (momentary when held)

9-12 (with mod 1 held)	pause pattern (press 9-12 again without mod held to resume)9-12 (with mod 2 held)	overdub pattern (only works if pattern already recorded)9-12 (with both mods 1+2 held)	erase paused pattern

13 (with both mod 2 held) global octave -
14 (with both mod 2 held) global octave +
15 (with both mod 2 held) global reverse

Mods 3+4 (previous+next preset) = Record Go

9-12 (with mod 3 held) - step length page, reverse page, group page, octave page
(pages are momentary if you keep holding mod 3 after selecting)
15 (with mod 3 held) - set tempo (light indicates a mismatch between current and preset tempos)

11 (with mod 4 held) - record length / record select page
12 (with mod 4 held) - file page
15 (with mod 4 held) - punch-in
16 (with mod 4 held) - tap tempo

——————————————————————————

64 top row controls: 
1-4	stop playback for groups 1-45-6	pattern recorders
7-8	modifier 1 and 2
1-4 (with mod 1 held)	decrease volume for group 1-41-4 (with mod 2 held)	increase volume for group 1-41-4 (with both mods held)	mute/unmute group 1-4 (momentary when held)
5-6 (with mod 1 held)	stop pattern without erasing5-6 (with mod 2 held)	overdub pattern (only works if pattern already recorded)
5-6 (with both mods held)   preset - +

launchpad - enable LP switch in setup tab. layout same as 128/256 except 9-16 correspond to the launchpad’s right column circular buttons. switch track’s midi-in/out to 'launchpad' after u load remix.