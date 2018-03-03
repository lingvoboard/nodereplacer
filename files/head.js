'use strict'
const fs = require('fs')
const readline = require('readline')

module.exports = {
ProcessString: function(s, o) {


if (o.RunOnStart == true) {

  if (typeof(onstart) === "function") {
    onstart()
    return true
  }

return false

}

if (o.RunOnExit == true)
{

  if (typeof(onexit) === "function") {
    onexit()
  }

return

}


if (o.RunOnExitAsync === 'check') {

  if (typeof(onexit_async) === "function") {
    return true
  }


return false

}


if (o.RunOnExitAsync === 'run') {

  if (typeof(onexit_async) === "function") {
    onexit_async()
  }


return

}


