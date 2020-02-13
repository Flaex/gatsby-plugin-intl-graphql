import { request, GraphQLClient } from "graphql-request"
import { _writeOnce, _write, _sanitizate } from "./helpers"

// Loop the languages
const loopLangs = (langs, callback) => langs.forEach(lng => callback(lng))

// Create the initials JSON
export function createJson(path, languages) {
  // One language
  if (languages.length === 1) {
    _writeOnce(path, languages)
  }

  // Multiples languages
  languages.forEach(lang => {
    _writeOnce(path, lang)
  })
}

// Make the query and extract data to write in the needed file
export async function makeQuery({ path, url, query, languages }) {

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
    loopLangs(languages, lng => {
      // Unique path
      const singlePath = `${path}/${lng}.json`

      // Rewrite the existing JSON
      _write(singlePath, response, lng)

      // Clean the languages JSON
      _sanitizate(singlePath)
    })
  } catch (e) {
    throw new Error("Was an error: ", e)
  }
}
