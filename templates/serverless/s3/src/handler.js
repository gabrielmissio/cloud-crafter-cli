exports.handler = async (event, context) => {
  console.log(JSON.stringify({
    event,
    context
  }))

  return {
    success: true
  }
}
