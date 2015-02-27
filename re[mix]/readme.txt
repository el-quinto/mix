The Group1-6 .amxd's are the audio outputs for each group. If u don't load them, you won't get audio for those groups (or led movement). re:mix is multichannel so u load these on separate audio tracks. If u change the color of your group output tracks, the colors on the interface for the corresponding groups change too.


top row controls:
1-6	stop playback for groups 1-67-8	modifier 1 and 2
9-12	start/stop+erase pattern record
13	previous preset
14	next preset
15	set tempo (light indicates a mismatch between current and preset tempos)
16	master send1-6 (with mod 1 held)	decrease volume for group 1-61-6 (with mod 2 held)	increase volume for group 1-61-6 (with both mods held)	mute/unmute group 1-6 (momentary when held)

9-12 (with mod 1 held)	stop pattern without erasing9-12 (with mod 2 held)	overdub pattern (only works if pattern already recorded)9-12 (with both mods held)	record go, record punch-in, record previous, record next,
13 (with mod 1 held)	toggle group/play mode page14 (with mod 1 held)	toggle reverse page15 (with mod 1 held)	toggle loop length page13 (with mod 2 held)	toggle octave page14 (with mod 2 held)	toggle file pagepress both mod buttons to exit pages.15 (with mod 2 held)    tap tempo

all pages are momentary when held

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

————————————————————

Group 1-6

midi.amxd- recieves all press data and sends it out as midi (if midi out is enabled). you can also send midi to the midi.amxd to trigger press data. since midi only has 128 values, you need to use the midi2.amxd for the bottom 8 rows of a 256.
