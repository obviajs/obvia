const appStyle = `
/* Style the buttons */

/* Style the active class (and buttons on mouse-over) */
.active, .hovered {
  background-color: #D6EAF8  ;
  color: white; 
  cursor: pointer;
}
.ew-resize {cursor: ew-resize !important;}
.ns-resize {cursor: ns-resize !important;}

.h-1 {height:1% !important}.h-2 {height:2% !important}.h-3 {height:3% !important}.h-4 {height:4% !important}.h-5 {height:5% !important}.h-6 {height:6% !important}.h-7 {height:7% !important}.h-8 {height:8% !important}.h-9 {height:9% !important}.h-10 {height:10% !important}.h-11 {height:11% !important}.h-12 {height:12% !important}.h-13 {height:13% !important}.h-14 {height:14% !important}.h-15 {height:15% !important}.h-16 {height:16% !important}.h-17 {height:17% !important}.h-18 {height:18% !important}.h-19 {height:19% !important}.h-20 {height:20% !important}.h-21 {height:21% !important}.h-22 {height:22% !important}.h-23 {height:23% !important}.h-24 {height:24% !important}.h-25 {height:25% !important}.h-26 {height:26% !important}.h-27 {height:27% !important}.h-28 {height:28% !important}.h-29 {height:29% !important}.h-30 {height:30% !important}.h-31 {height:31% !important}.h-32 {height:32% !important}.h-33 {height:33% !important}.h-34 {height:34% !important}.h-35 {height:35% !important}.h-36 {height:36% !important}.h-37 {height:37% !important}.h-38 {height:38% !important}.h-39 {height:39% !important}.h-40 {height:40% !important}.h-41 {height:41% !important}.h-42 {height:42% !important}.h-43 {height:43% !important}.h-44 {height:44% !important}.h-45 {height:45% !important}.h-46 {height:46% !important}.h-47 {height:47% !important}.h-48 {height:48% !important}.h-49 {height:49% !important}.h-50 {height:50% !important}.h-51 {height:51% !important}.h-52 {height:52% !important}.h-53 {height:53% !important}.h-54 {height:54% !important}.h-55 {height:55% !important}.h-56 {height:56% !important}.h-57 {height:57% !important}.h-58 {height:58% !important}.h-59 {height:59% !important}.h-60 {height:60% !important}.h-61 {height:61% !important}.h-62 {height:62% !important}.h-63 {height:63% !important}.h-64 {height:64% !important}.h-65 {height:65% !important}.h-66 {height:66% !important}.h-67 {height:67% !important}.h-68 {height:68% !important}.h-69 {height:69% !important}.h-70 {height:70% !important}.h-71 {height:71% !important}.h-72 {height:72% !important}.h-73 {height:73% !important}.h-74 {height:74% !important}.h-75 {height:75% !important}.h-76 {height:76% !important}.h-77 {height:77% !important}.h-78 {height:78% !important}.h-79 {height:79% !important}.h-80 {height:80% !important}.h-81 {height:81% !important}.h-82 {height:82% !important}.h-83 {height:83% !important}.h-84 {height:84% !important}.h-85 {height:85% !important}.h-86 {height:86% !important}.h-87 {height:87% !important}.h-88 {height:88% !important}.h-89 {height:89% !important}.h-90 {height:90% !important}.h-91 {height:91% !important}.h-92 {height:92% !important}.h-93 {height:93% !important}.h-94 {height:94% !important}.h-95 {height:95% !important}.h-96 {height:96% !important}.h-97 {height:97% !important}.h-98 {height:98% !important}.h-99 {height:99% !important}.h-100 {height:100% !important}
.mh-1 {max-height:1% !important}.mh-2 {max-height:2% !important}.mh-3 {max-height:3% !important}.mh-4 {max-height:4% !important}.mh-5 {max-height:5% !important}.mh-6 {max-height:6% !important}.mh-7 {max-height:7% !important}.mh-8 {max-height:8% !important}.mh-9 {max-height:9% !important}.mh-10 {max-height:10% !important}.mh-11 {max-height:11% !important}.mh-12 {max-height:12% !important}.mh-13 {max-height:13% !important}.mh-14 {max-height:14% !important}.mh-15 {max-height:15% !important}.mh-16 {max-height:16% !important}.mh-17 {max-height:17% !important}.mh-18 {max-height:18% !important}.mh-19 {max-height:19% !important}.mh-20 {max-height:20% !important}.mh-21 {max-height:21% !important}.mh-22 {max-height:22% !important}.mh-23 {max-height:23% !important}.mh-24 {max-height:24% !important}.mh-25 {max-height:25% !important}.mh-26 {max-height:26% !important}.mh-27 {max-height:27% !important}.mh-28 {max-height:28% !important}.mh-29 {max-height:29% !important}.mh-30 {max-height:30% !important}.mh-31 {max-height:31% !important}.mh-32 {max-height:32% !important}.mh-33 {max-height:33% !important}.mh-34 {max-height:34% !important}.mh-35 {max-height:35% !important}.mh-36 {max-height:36% !important}.mh-37 {max-height:37% !important}.mh-38 {max-height:38% !important}.mh-39 {max-height:39% !important}.mh-40 {max-height:40% !important}.mh-41 {max-height:41% !important}.mh-42 {max-height:42% !important}.mh-43 {max-height:43% !important}.mh-44 {max-height:44% !important}.mh-45 {max-height:45% !important}.mh-46 {max-height:46% !important}.mh-47 {max-height:47% !important}.mh-48 {max-height:48% !important}.mh-49 {max-height:49% !important}.mh-50 {max-height:50% !important}.mh-51 {max-height:51% !important}.mh-52 {max-height:52% !important}.mh-53 {max-height:53% !important}.mh-54 {max-height:54% !important}.mh-55 {max-height:55% !important}.mh-56 {max-height:56% !important}.mh-57 {max-height:57% !important}.mh-58 {max-height:58% !important}.mh-59 {max-height:59% !important}.mh-60 {max-height:60% !important}.mh-61 {max-height:61% !important}.mh-62 {max-height:62% !important}.mh-63 {max-height:63% !important}.mh-64 {max-height:64% !important}.mh-65 {max-height:65% !important}.mh-66 {max-height:66% !important}.mh-67 {max-height:67% !important}.mh-68 {max-height:68% !important}.mh-69 {max-height:69% !important}.mh-70 {max-height:70% !important}.mh-71 {max-height:71% !important}.mh-72 {max-height:72% !important}.mh-73 {max-height:73% !important}.mh-74 {max-height:74% !important}.mh-75 {max-height:75% !important}.mh-76 {max-height:76% !important}.mh-77 {max-height:77% !important}.mh-78 {max-height:78% !important}.mh-79 {max-height:79% !important}.mh-80 {max-height:80% !important}.mh-81 {max-height:81% !important}.mh-82 {max-height:82% !important}.mh-83 {max-height:83% !important}.mh-84 {max-height:84% !important}.mh-85 {max-height:85% !important}.mh-86 {max-height:86% !important}.mh-87 {max-height:87% !important}.mh-88 {max-height:88% !important}.mh-89 {max-height:89% !important}.mh-90 {max-height:90% !important}.mh-91 {max-height:91% !important}.mh-92 {max-height:92% !important}.mh-93 {max-height:93% !important}.mh-94 {max-height:94% !important}.mh-95 {max-height:95% !important}.mh-96 {max-height:96% !important}.mh-97 {max-height:97% !important}.mh-98 {max-height:98% !important}.mh-99 {max-height:99% !important}.mh-100 {max-height:100% !important}
.w-1 {width:1% !important}.w-2 {width:2% !important}.w-3 {width:3% !important}.w-4 {width:4% !important}.w-5 {width:5% !important}.w-6 {width:6% !important}.w-7 {width:7% !important}.w-8 {width:8% !important}.w-9 {width:9% !important}.w-10 {width:10% !important}.w-11 {width:11% !important}.w-12 {width:12% !important}.w-13 {width:13% !important}.w-14 {width:14% !important}.w-15 {width:15% !important}.w-16 {width:16% !important}.w-17 {width:17% !important}.w-18 {width:18% !important}.w-19 {width:19% !important}.w-20 {width:20% !important}.w-21 {width:21% !important}.w-22 {width:22% !important}.w-23 {width:23% !important}.w-24 {width:24% !important}.w-25 {width:25% !important}.w-26 {width:26% !important}.w-27 {width:27% !important}.w-28 {width:28% !important}.w-29 {width:29% !important}.w-30 {width:30% !important}.w-31 {width:31% !important}.w-32 {width:32% !important}.w-33 {width:33% !important}.w-34 {width:34% !important}.w-35 {width:35% !important}.w-36 {width:36% !important}.w-37 {width:37% !important}.w-38 {width:38% !important}.w-39 {width:39% !important}.w-40 {width:40% !important}.w-41 {width:41% !important}.w-42 {width:42% !important}.w-43 {width:43% !important}.w-44 {width:44% !important}.w-45 {width:45% !important}.w-46 {width:46% !important}.w-47 {width:47% !important}.w-48 {width:48% !important}.w-49 {width:49% !important}.w-50 {width:50% !important}.w-51 {width:51% !important}.w-52 {width:52% !important}.w-53 {width:53% !important}.w-54 {width:54% !important}.w-55 {width:55% !important}.w-56 {width:56% !important}.w-57 {width:57% !important}.w-58 {width:58% !important}.w-59 {width:59% !important}.w-60 {width:60% !important}.w-61 {width:61% !important}.w-62 {width:62% !important}.w-63 {width:63% !important}.w-64 {width:64% !important}.w-65 {width:65% !important}.w-66 {width:66% !important}.w-67 {width:67% !important}.w-68 {width:68% !important}.w-69 {width:69% !important}.w-70 {width:70% !important}.w-71 {width:71% !important}.w-72 {width:72% !important}.w-73 {width:73% !important}.w-74 {width:74% !important}.w-75 {width:75% !important}.w-76 {width:76% !important}.w-77 {width:77% !important}.w-78 {width:78% !important}.w-79 {width:79% !important}.w-80 {width:80% !important}.w-81 {width:81% !important}.w-82 {width:82% !important}.w-83 {width:83% !important}.w-84 {width:84% !important}.w-85 {width:85% !important}.w-86 {width:86% !important}.w-87 {width:87% !important}.w-88 {width:88% !important}.w-89 {width:89% !important}.w-90 {width:90% !important}.w-91 {width:91% !important}.w-92 {width:92% !important}.w-93 {width:93% !important}.w-94 {width:94% !important}.w-95 {width:95% !important}.w-96 {width:96% !important}.w-97 {width:97% !important}.w-98 {width:98% !important}.w-99 {width:99% !important}.w-100 {width:100% !important}
.mw-1 {max-width:1% !important}.mw-2 {max-width:2% !important}.mw-3 {max-width:3% !important}.mw-4 {max-width:4% !important}.mw-5 {max-width:5% !important}.mw-6 {max-width:6% !important}.mw-7 {max-width:7% !important}.mw-8 {max-width:8% !important}.mw-9 {max-width:9% !important}.mw-10 {max-width:10% !important}.mw-11 {max-width:11% !important}.mw-12 {max-width:12% !important}.mw-13 {max-width:13% !important}.mw-14 {max-width:14% !important}.mw-15 {max-width:15% !important}.mw-16 {max-width:16% !important}.mw-17 {max-width:17% !important}.mw-18 {max-width:18% !important}.mw-19 {max-width:19% !important}.mw-20 {max-width:20% !important}.mw-21 {max-width:21% !important}.mw-22 {max-width:22% !important}.mw-23 {max-width:23% !important}.mw-24 {max-width:24% !important}.mw-25 {max-width:25% !important}.mw-26 {max-width:26% !important}.mw-27 {max-width:27% !important}.mw-28 {max-width:28% !important}.mw-29 {max-width:29% !important}.mw-30 {max-width:30% !important}.mw-31 {max-width:31% !important}.mw-32 {max-width:32% !important}.mw-33 {max-width:33% !important}.mw-34 {max-width:34% !important}.mw-35 {max-width:35% !important}.mw-36 {max-width:36% !important}.mw-37 {max-width:37% !important}.mw-38 {max-width:38% !important}.mw-39 {max-width:39% !important}.mw-40 {max-width:40% !important}.mw-41 {max-width:41% !important}.mw-42 {max-width:42% !important}.mw-43 {max-width:43% !important}.mw-44 {max-width:44% !important}.mw-45 {max-width:45% !important}.mw-46 {max-width:46% !important}.mw-47 {max-width:47% !important}.mw-48 {max-width:48% !important}.mw-49 {max-width:49% !important}.mw-50 {max-width:50% !important}.mw-51 {max-width:51% !important}.mw-52 {max-width:52% !important}.mw-53 {max-width:53% !important}.mw-54 {max-width:54% !important}.mw-55 {max-width:55% !important}.mw-56 {max-width:56% !important}.mw-57 {max-width:57% !important}.mw-58 {max-width:58% !important}.mw-59 {max-width:59% !important}.mw-60 {max-width:60% !important}.mw-61 {max-width:61% !important}.mw-62 {max-width:62% !important}.mw-63 {max-width:63% !important}.mw-64 {max-width:64% !important}.mw-65 {max-width:65% !important}.mw-66 {max-width:66% !important}.mw-67 {max-width:67% !important}.mw-68 {max-width:68% !important}.mw-69 {max-width:69% !important}.mw-70 {max-width:70% !important}.mw-71 {max-width:71% !important}.mw-72 {max-width:72% !important}.mw-73 {max-width:73% !important}.mw-74 {max-width:74% !important}.mw-75 {max-width:75% !important}.mw-76 {max-width:76% !important}.mw-77 {max-width:77% !important}.mw-78 {max-width:78% !important}.mw-79 {max-width:79% !important}.mw-80 {max-width:80% !important}.mw-81 {max-width:81% !important}.mw-82 {max-width:82% !important}.mw-83 {max-width:83% !important}.mw-84 {max-width:84% !important}.mw-85 {max-width:85% !important}.mw-86 {max-width:86% !important}.mw-87 {max-width:87% !important}.mw-88 {max-width:88% !important}.mw-89 {max-width:89% !important}.mw-90 {max-width:90% !important}.mw-91 {max-width:91% !important}.mw-92 {max-width:92% !important}.mw-93 {max-width:93% !important}.mw-94 {max-width:94% !important}.mw-95 {max-width:95% !important}.mw-96 {max-width:96% !important}.mw-97 {max-width:97% !important}.mw-98 {max-width:98% !important}.mw-99 {max-width:99% !important}.mw-100 {max-width:100% !important}
`;
var zeroCool = {
	"constructor": "Container",
	"props": {
		"spacing": {
			"colSpan": 9
        },
        height: 800,
		"id": "snowCrash",
		"components": [{
			"constructor": "Container",
			"props": {
				"spacing": {
					"h": 100
				},
				"components": [{
					"constructor": "Container",
					"props": {
						"id": "Component_9",
						"type": "row",
						"spacing": {
							"h": 100
						},
						"components": [{
							"constructor": "Container",
							"props": {
								"spacing": {
									"colSpan": 12,
									"h": 100
								},
								"id": "workArea",
								"classes": ["border"],
								"components": [{
									"constructor": "Container",
									"props": {
										"id": "Component_11",
										"type": "row",
										"spacing": {
											"m": "auto",
											"h": 29
										},
										"components": [{
											"constructor": "Container",
											"props": {
												"spacing": {
													"colSpan": 12,
													"h": 100
												},
												"id": "workArea_12",
												"classes": ["border"],
												"components": [{
													"constructor": "Container",
													"props": {
														"id": "Component_15",
														"type": "row",
														"spacing": {
															"m": "auto",
															"h": 100
														},
														"components": [{
															"constructor": "Container",
															"props": {
																"spacing": {
																	"colSpan": 4,
																	"h": 100
																},
																"id": "workArea_16",
																"classes": ["border"],
																"components": [{
																	"constructor": "Container",
																	"props": {
																		"id": "Component_19",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 33
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_20",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "a9b84870-0cf6-4f54-92e0-4779e717d120"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "7f50b682-999e-4fdb-89d8-25ca7ae69caf"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_21",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 34
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_22",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "8fac924a-cc7e-4393-b30e-86f940244635"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "8731c8c9-2954-46cf-9d2f-c267682e7c60"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_23",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 33
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_24",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "cb273938-2465-46b3-90d9-609a0e8da525"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "b81ae020-26af-4d85-aac2-2b6802eac3e4"
																	}
																}],
																"magnets": {},
																"enabled": true,
																"guid": "be16356c-6ecf-490c-9bc8-39379e008771"
															}
														}, {
															"constructor": "Container",
															"props": {
																"spacing": {
																	"colSpan": 4,
																	"h": 100
																},
																"id": "workArea_17",
																"classes": ["border"],
																"components": [{
																	"constructor": "Container",
																	"props": {
																		"id": "Component_25",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_26",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "1b2dbfce-ffbe-4d7d-a188-d1ab35dd1b3b"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "7bf0124f-bfec-4ae4-a554-0f872b281a58"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_27",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_28",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "d8c8c1dc-3258-4e12-a584-aadd4ba0397e"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "4b12e3ab-2dd5-4ad1-8827-cc1ccd2f4603"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_29",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_30",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "23a36b70-10a2-4373-8adc-281aa317986b"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "45d0a38c-2cff-415f-a63f-9d32444c823c"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_31",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_32",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "8c13b999-ea10-4460-b9ff-8be21c66fc1a"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "818710f7-8f97-4383-8d94-69111f793710"
																	}
																}],
																"magnets": {},
																"enabled": true,
																"guid": "8ca979ae-eb14-4283-88ed-b68a3beffe91"
															}
														}, {
															"constructor": "Container",
															"props": {
																"spacing": {
																	"colSpan": 4,
																	"h": 100
																},
																"id": "workArea_18",
																"classes": ["border"],
																"components": [{
																	"constructor": "Container",
																	"props": {
																		"id": "Component_33",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_34",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "4baff84e-f512-48c6-ac75-750a67597015"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "3c805f2d-38af-410f-8e16-b15f63fcec7e"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_35",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_36",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "8ecf4684-42c8-47d5-b920-900f06da8be5"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "4d20be91-7890-4631-9d59-dfc2bd030cca"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_37",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_38",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "0c0a6b13-65d5-4ac4-a9e4-2affadb999de"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "8eaf580f-7731-44fd-a27d-2217e8c6bdae"
																	}
																}, {
																	"constructor": "Container",
																	"props": {
																		"id": "Component_39",
																		"type": "row",
																		"spacing": {
																			"m": "auto",
																			"h": 25
																		},
																		"components": [{
																			"constructor": "Container",
																			"props": {
																				"spacing": {
																					"colSpan": 12,
																					"h": 100
																				},
																				"id": "workArea_40",
																				"classes": ["border"],
																				"components": [],
																				"magnets": {},
																				"enabled": true,
																				"guid": "1664759a-d7e2-44ed-aa51-22a139b3961d"
																			}
																		}],
																		"magnets": {},
																		"enabled": true,
																		"classes": [],
																		"guid": "74f5ed6b-2cf5-41df-b0fd-62e87733ef1c"
																	}
																}],
																"magnets": {},
																"enabled": true,
																"guid": "63edd927-ce07-44e7-8622-009230caa594"
															}
														}],
														"magnets": {},
														"enabled": true,
														"classes": [],
														"guid": "169c40f9-f1e1-4100-beca-37aabe0ef5ad"
													}
												}],
												"magnets": {},
												"enabled": true,
												"guid": "de132fb0-fa80-498f-a952-7b4dba11d07c"
											}
										}],
										"magnets": {},
										"enabled": true,
										"classes": [],
										"guid": "46d0094a-0198-43b8-8d47-fc7d60d320dd"
									}
								}, {
									"constructor": "Container",
									"props": {
										"id": "Component_13",
										"type": "row",
										"spacing": {
											"m": "auto",
											"h": 71
										},
										"components": [{
											"constructor": "Container",
											"props": {
												"spacing": {
													"colSpan": 12,
													"h": 100
												},
												"id": "workArea_14",
												"classes": ["border", "active"],
												"components": [],
												"magnets": {},
												"enabled": true,
												"guid": "2c7dfb29-2337-49b2-a1c2-f275e1c1c8db"
											}
										}],
										"magnets": {},
										"enabled": true,
										"classes": [],
										"guid": "5138c97e-b818-462a-9c99-74761dfd8ad2"
									}
								}],
								"magnets": {},
								"enabled": true,
								"guid": "eaf65448-c55c-4597-98cb-e31147e81908"
							}
						}],
						"magnets": {},
						"enabled": true,
						"classes": [],
						"guid": "73445c78-881a-47f4-baf4-72fc77ee1dce"
					}
				}],
				"type": "container",
				"magnets": {},
				"id": "Component_8",
				"enabled": true,
				"classes": [],
				"guid": "59afa462-a3d3-41fe-9ea0-2bf56b426a1f"
			}
		}],
		"magnets": {},
		"enabled": true,
		"classes": [],
		"guid": "2867910e-9330-46e3-a139-261a9a974d93"
	}
};

var oxana = new App({
    style:appStyle,
    components:[
        {
            constructor: ViewStack,
            props: {
                components: [zeroCool]
            }
        }        
    ]});

oxana.registerBehaviors();
oxana.init();