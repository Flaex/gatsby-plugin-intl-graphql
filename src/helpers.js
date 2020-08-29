import fs from "fs-extra"
import { println } from "console-colors"
import { request, GraphQLClient } from "graphql-request"
import axios from "axios"

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

      println`{green}success {cyan}intl-graphql {reset}The file for ${lang} language already exists `

    } else {
      // Loop the query data and write in the JSON file
      for (const i in content) {
        data[i] = content[i]
      }

      console.log('from _write: ', content)

      // Transform in string
      const str = JSON.stringify(data)

      // Save the new data
      fs.outputFileSync(path, str)

      println`{green}success {cyan}intl-graphql {reset}Writing querys for ${lang} file `

    }

  } catch (e) {
    // Else create the path with its json files needed

    fs.outputJson(path, template(lang))
      .then(() => 
        println`{green}success {cyan}intl-graphql {reset}The file for ${lang} language created `
      )
      .catch(e => console.error(e.error))

      console.log(e)
  }
}

// Clean the JSON
async function cleanup(path) {
  try {
    // Read JSON
    const res = await fs.readJson(path)
    const str = JSON.stringify(res)

    // Get the "lang" object
    const lang = res.static.lang

    if (!str.includes(`content_${lang}`)) return

    delete res.static

    const temp = {
      static: {
        lang
      }
    }

    Object.entries(res).forEach(item => {
      item.forEach(el => {
        if (typeof el === 'object') {
          let index = Object.keys(el).findIndex(content => content === `content_${lang}`)
          let content = {'content': Object.values(el)[index]}
          temp[item[0]] = content
        }
      })
    })

    // Save the new data as String
    const stringify = JSON.stringify(temp, null, 2)

    // Then save it
    fs.outputFileSync(path, stringify)

    // print("green", "cyan", "success","intl-graphql", `content field suffix cleanup`)
    println`{green}success {cyan}intl-graphql {reset}Content field suffix cleanup `
  } catch (e) {
    throw new Error(e)
  }
}

// Check user data
async function checkLoginUser({url, identifier, password}) {
  // Complete endpoint
  const uri = `${url}auth/local`

  if (!identifier && !password) return

  try {
    const { data } = await axios.post(uri, {identifier, password})

    return data.jwt
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
export async function modifyContent({ path, url, query, languages, loginData }) {
  let response;
  // If the url isn't completed then modify it
  // http://localhost:1337/ turn to http://localhost:1337/graphql
  // http://localhost:1337 turn to http://localhost:1337/graphql
  const endpoint = url.includes("graphql")
    ? url
    : url.endsWith("/")
      ? url + "graphql"
      : url + "/graphql"

  try {
    // check if loginData no exist
    if (!loginData.identifier && !loginData.password) {
      response = await request(endpoint, query)
    } else {
      const jwt = await checkLoginUser({
        url,
        identifier: loginData.identifier,
        password: loginData.password
      })

      response = await new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${jwt}`
        }
      }).request(query)
    }


    // console.log(response)

    // Loop languages
    languages.forEach(lang => {
      const pathname = `${path}/${lang}.json`

      // Rewrite the existing JSON
      _write(pathname, response)

      // Clean the JSON languages file
      cleanup(pathname)
    })

  } catch (e) {
    throw new Error("Was an error: ", e.error)
  }
}