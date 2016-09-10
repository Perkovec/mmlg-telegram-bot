return {
  enabled = true,
  name = "testLua",
  trigger = "command",
  pattern = "^\\/lua",
  patternFlags = "i",
  main = function(msg)
    msg:sendMessage({
      text = "answer"
    })
  end
}