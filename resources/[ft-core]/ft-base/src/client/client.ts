// Turn off emergency/police/ems dispatch every frame
setTick(() => {
  for (let i = 0; i < 25; i++) {
    EnableDispatchService(i, false)
  }
})

// Turn off wanted level
setTick(() => {
  ClearPlayerWantedLevel(PlayerPedId())
})

RegisterCommand("tpm", () => {
  console.log("teleporting to marker")
  emitNet("ft-core:tpm")
}, false)