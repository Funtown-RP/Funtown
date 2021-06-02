setTick(() => {
	// Turn off emergency/police/ems dispatch every frame
	for (let i = 0; i < 25; i++) {
		EnableDispatchService(i, false);
	}

	// Turn off wanted level every frame
	ClearPlayerWantedLevel(PlayerId());
});