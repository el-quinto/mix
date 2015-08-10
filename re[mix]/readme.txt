Max 7 / Live 9.2 or later required.

re:mix is based on mlr, a monome application by Brian Crabtree. if you haven’t tried mlr, i highly suggest u start there. re:mix will make a lot more sense if you do.

The Group1-6 .amxd's are the audio outputs for each group. If u don't load them, you won't get audio for those groups (or led movement). re:mix is multichannel so u load these on separate audio tracks. u can change the color of your group output tracks to color-code your groups on the re:mix interface.
————————————————————
send / macro control- re:mix is able to control the first 4 sends and first 8 device parameters on each group’s track (can be different values for each row / each preset). there’s an ’example macros' effect rack included to get you started, but the fx are purposefully cheesy to encourage you to experiment and make your own.
————————————————————
input.amxd- place this on the track you want to record. you can load multiple instaces on different tracks, and each can be set to record to a different input buffer (1-8) in re:mix
————————————————————
midi in/out- re:mix recieves all press data and outputs it as midi if midi out is enabled. you can also send midi to the device to trigger press data. since midi only has 128 values, you need an additional midi track with the midi(row9-16).amxd for midi to/from the bottom 8 rows of a 256.
name piano roll.adg - placing this on the re:mix track makes it so u can see the row/button names on the piano roll.
———————————————————— 
click Info in the setup tab for keyboard shortcuts!

128/256 top row controls:
1-6	stop playback for groups 1-67-8	modifier 1 and 2 (previous/next input when pressed quickly)
9-12	start/stop+erase pattern record
13	previous preset (mod 3 when held)
14	next preset (mod 4 when held)
15	macros toggle (can be momentary when held) (pattern recordable)
16	sends toggle (can be momentary when held)Mods1-6 (with mod 1 held)	decrease volume for group 1-61-6 (with mod 2 held)	increase volume for group 1-61-6 (with both mods 1+2 held) mute/unmute group 1-6 (momentary when held)

9-12 (with mod 1 held)	pause pattern (press 9-12 again without mod held to resume)9-12 (with mod 2 held)	overdub pattern (only works if pattern already recorded)9-12 (with both mods 1+2 held)	erase paused pattern

13 (with mod 2 held) global octave -
14 (with mod 2 held) global octave +
15 (with mod 2 held) global reverse

Mods 3+4 (previous+next preset) = Record Go

9  (with mod 3 held) - step length page
10 (with mod 3 held) - reverse page
11 (with mod 3 held) - group page (columns 1-6 = groups, 7-8 = row vol, 9-12 = play mode)
12 (with mod 3 held) - octave page
(pages are momentary if you keep holding mod 3 after selecting)
15 (with mod 3 held) - set  next tempo 

11 (with mod 4 held) - record length / record select page
12 (with mod 4 held) - file page
15 (with mod 4 held) - punch-in
16 (with mod 4 held) - tap tempo

(press both mod1/2 buttons or either mod3/4 to exit pages)
——————————————————————————

64 top row controls: 
1-4	stop playback for groups 1-45-6	pattern recorders
7-8	modifier 1 and 2
1-4 (with mod 1 held)	decrease volume for group 1-41-4 (with mod 2 held)	increase volume for group 1-41-4 (with both mods held)	mute/unmute group 1-4 (momentary when held)
5-6 (with mod 1 held)	stop pattern without erasing5-6 (with mod 2 held)	overdub pattern (only works if pattern already recorded)
5-6 (with both mods held)   preset - +
quickly press mod1 or 2 to trigger send/macro switches
