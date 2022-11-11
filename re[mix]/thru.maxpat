{
	"patcher" : 	{
		"fileversion" : 1,
		"rect" : [ 404.0, 177.0, 236.0, 74.0 ],
		"bglocked" : 0,
		"defrect" : [ 404.0, 177.0, 236.0, 74.0 ],
		"openrect" : [ 0.0, 0.0, 0.0, 0.0 ],
		"openinpresentation" : 0,
		"default_fontsize" : 10.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial Bold",
		"gridonopen" : 0,
		"gridsize" : [ 8.0, 8.0 ],
		"gridsnaponopen" : 0,
		"toolbarvisible" : 1,
		"boxanimatetime" : 200,
		"imprint" : 0,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"boxes" : [ 			{
				"box" : 				{
					"maxclass" : "outlet",
					"numinlets" : 1,
					"patching_rect" : [ 16.0, 43.0, 18.0, 18.0 ],
					"id" : "obj-1",
					"numoutlets" : 0,
					"comment" : ""
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "inlet",
					"numinlets" : 0,
					"patching_rect" : [ 16.0, 8.0, 18.0, 18.0 ],
					"id" : "obj-2",
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"comment" : ""
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "Thru input",
					"numinlets" : 1,
					"fontname" : "Arial",
					"patching_rect" : [ 40.0, 8.0, 56.0, 18.0 ],
					"id" : "obj-3",
					"numoutlets" : 0,
					"fontsize" : 10.0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "Thru output",
					"numinlets" : 1,
					"fontname" : "Arial",
					"patching_rect" : [ 40.0, 43.0, 62.0, 18.0 ],
					"id" : "obj-4",
					"numoutlets" : 0,
					"fontsize" : 10.0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "A simple router that allows for simplified wiring of multiple wires to patch subsystems.",
					"linecount" : 4,
					"numinlets" : 1,
					"fontname" : "Arial Bold",
					"patching_rect" : [ 104.0, 8.0, 125.0, 52.0 ],
					"id" : "obj-5",
					"numoutlets" : 0,
					"fontsize" : 10.0
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"source" : [ "obj-2", 0 ],
					"destination" : [ "obj-1", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
 ]
	}

}
