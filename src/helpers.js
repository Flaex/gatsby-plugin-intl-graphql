import fs from "fs-extra"
import colors from "console-colors"
import { request } from "graphql-request"

const { print, colors:{ green, cyan, reset }} = colors

/* --------------- Lambda Functions --------------- */

// Lambda function to get the information about file
const template = lng => JSON.parse(`{"static":{"lang":"${lng}"}}`)

// Regex to find the match and change it to needed object
const find = lng => new RegExp(`content_${lng}`, "g")


/* --------------- Helpers Functions --------------- */

// Write el needed JSON file
async function _write(path, content = '') {
  // Extract the language from path
  const lang = path.match(/[a-z]{2}\./gi)[0].split('').splice(0,2).join('')
  
  // If exist then create
  try {
    // read the JSON file
    const data = await fs.readJson(path)

    if (!content) {

      print`${green}success ${cyan}intl-graphql ${reset}The file for ${lang} language already exists `

    } else {
      // Loop the query data and write in the JSON file
      for (const i in content) {
        data[i] = content[i]
      }

      // Transform in string
      const str = JSON.stringify(data)

      // Save the new data
      fs.outputFileSync(path, str)

      print`${green}success ${cyan}intl-graphql ${reset}Writing querys for ${lang} file `

    }

  } catch (e) {
    // Else create the path with its json files needed

    fs.outputJson(path, template(lang))
      .then(() => 
        print`${green}success ${cyan}intl-graphql ${reset}The file for ${lang} language created `
      )
      .catch(e => console.error(e.error))

      console.log(e)
  }
}

// Clean the JSON
async function _sanitizate(path) {
  try {
    // Read JSON
    const res = await fs.readJson(path)

    // Get the "lang" object
    const lang = res.static.lang

    // Loop the JSON object
    for (const x in res) {
      const el = res[x]

      for (const i in el) {
        const prop = el[i]

        for (let [key, value] of Object.entries(prop)) {
          // If don't find then continue the process
          if (!key.match("content_")) {
            continue
          } else {
            // If find the "content_", then replace it for "content"
            if (!find(lang).test(key)) {
              delete prop[key]
            } else {
              const newkey = key.slice(0, -3)
              prop[newkey] = value
              delete prop[key]

              if (value == null) {
                delete prop[newkey]
              }
            }
          }
        }
      }
    }

    // Save the new data as String
    const str = JSON.stringify(res, null, 2)

    // Then save it
    fs.outputFileSync(path, str)

    // print("green", "cyan", "success","intl-graphql", `content field suffix cleanup`)
    print`${green}success ${cyan}intl-graphql ${reset}Content field suffix cleanup `
  } catch (e) {
    throw new Error(e)
  }
}

/* --------------- Main Functions --------------- */

// Create the initials JSON
export function createInitialJson(pathname, languages) {

  languages.forEach(lang => {
    const path = `${pathname}/${lang}.json`
    _write(path)
  })
}

// Make the query and extract data to write in the needed file
export async function modifyContent({ path, url, query, languages }) {

  // If the url isn't completed then modify it
  // http://localhost:1337/ turn to http://localhost:1337/graphql
  // http://localhost:1337 turn to http://localhost:1337/graphql
  const endpoint = url.includes("graphql")
    ? url
    : url.endsWith("/")
      ? url + "graphql"
      : url + "/graphql"

  try {
    // Make the query
    const response = await request(endpoint, query)

    // Loop languages
    languages.forEach(lang => {
      const pathname = `${path}/${lang}.json`

      // Rewrite the existing JSON
      _write(pathname, response)

      // Clean the JSON languages file
      _sanitizate(pathname)
    })

  } catch (e) {
    throw new Error("Was an error: ", e.error)
  }
}