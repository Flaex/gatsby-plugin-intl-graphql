import fs from "fs-extra"
import colors from "console-colors"

const { print, colors:{ green, cyan, reset }} = colors


// Lambda function to get the information about file
const template = lng => JSON.parse(`{"static":{"lang":"${lng}"}}`)

// Regex to find the match and change it to needed object
const find = lng => new RegExp(`content_${lng}`, "g")

// write the initial object in the file
export async function _writeOnce(path, lang = "en") {
  const singlePath = `${path}/${lang}.json`

  try {
    // If file exist don't write anything
    const res = await fs.readJson(singlePath)
    // print("green", "cyan", "success","intl-graphql", `The file for ${lang} language already exists`)
    print`${green}success ${cyan}intl-graphql ${reset}The file for "x" language already exists`
  } catch (e) {
    // If not exist write the initial JSON
    fs.outputJson(singlePath, template(lang))
      // .then(() => print(`The file for ${lang} language created`)
      .then(() => print`${green}success ${cyan}intl-graphql ${reset}The file for "x" language created`)
      .catch(e => console.error("Was an error: ", e))
  }
}

// Read existing files and later push new elements
export function _write(path, content, lang) {
  try {
    // Read the JSON file
    const data = fs.readJsonSync(path)

    // Loop the query data and write in the JSON file
    for (const i in content) {
      data[i] = content[i]
    }

    // Transform in String
    const str = JSON.stringify(data)

    // And save it
    fs.outputFileSync(path, str)
    // print("green", "cyan", "success","intl-graphql", `Writing querys for ${lang} file`)
    print`${green}success ${cyan}intl-graphql ${reset}Writing querys for "x" file`
  } catch (e) {
    throw new Error("Was an error: ", e)
  }
}

// Clean the JSON
export async function _sanitizate(path) {
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
    print`${green}success ${cyan}intl-graphql ${reset}Content field suffix cleanup`
  } catch (e) {
    throw new Error(e)
  }
}