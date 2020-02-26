import React from "react"
import { IntlContextConsumer, changeLocale } from "gatsby-plugin-intl-graphql"

const languageName = {
  en: "English",
  es: "Spanish"
}

const Language = () => {
  return (
    <div>
      <IntlContextConsumer>
        {({ languages, languages: currentLocale}) => 
          languages.map(lang => (
            <a
              key={lang}
              onClick={() => changeLocale(lang)}
              style={{
                color: currentLocale === lang ? 'yellow' : 'white',
                margin: 10,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {languageName[lang]}
            </a>
          ))
        }
      </IntlContextConsumer>
    </div>
  )
}

export default Language